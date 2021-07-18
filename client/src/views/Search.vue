<template>
  <div class="page">
    <main-navbar />
    <div class="container-wide">
      <div id="search-choice-header" class="d-flex">
        <h4>Search for a:</h4>
        <input
          v-model="searchType"
          type="radio"
          name="search"
          id="post"
          value="post"
          class="btn-check"
          autocomplete="off"
          checked
        />
        <label for="post" class="btn btn-outline-light">Post</label>
        <input
          v-model="searchType"
          type="radio"
          name="search"
          id="subreddit"
          value="subreddit"
          class="btn-check"
          autocomplete="off"
        />
        <label for="subreddit" class="btn btn-outline-light">Subreddit</label>
      </div>
      <div class="mt-4">
        <form>
          <input type="text" v-model="searchValue" class="bg-dark text-white form-control" />
          <button type="submit" class="btn text-white border border-light mt-2" @click="search">Search</button>
        </form>
      </div>
    </div>
    <post-list
      v-if="startSearch && searchType === 'post'"
      :moderator="false"
      :source="{ search: searchValue }"
      :showVoteIcons="$store.user !== null"
      :showSubredditSource="true"
      @no-results="onSearchFailed"
    />
    <subreddit-list
      v-if="startSearch && searchType === 'subreddit'"
      :search="{ search: searchValue }"
      @no-results="onSearchFailed"
    />
    <div v-if="noResults" class="container-wide">
      <h2>No results</h2>
    </div>
  </div>
</template>
<script>
import MainNavbar from '../components/MainNavbar.vue';
import PostList from '../components/search/PostList.vue';
import SubredditList from '../components/search/SubredditList.vue';

export default {
  name: 'Search',
  data() {
    return {
      searchType: 'post',
      searchValue: '',
      startSearch: false,
      noResults: false,
    };
  },
  components: { MainNavbar, PostList, SubredditList },
  methods: {
    search(event) {
      event.preventDefault();
      this.startSearch = true;
    },
    onSearchFailed() {
      this.noResults = true;
    },
  },
  watch: {
    searchType() {
      this.searchValue = '';
      this.startSearch = false;
      this.noResults = false;
    },
    searchValue() {
      this.startSearch = false;
      this.noResults = false;
    },
  },
};
</script>
<style lang="scss" scoped>
#search-choice-header {
  gap: 1rem;
}
</style>
