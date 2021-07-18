<template>
  <div class="page">
    <main-navbar />
    <post-list
      :moderator="false"
      :showSubredditSource="true"
      :source="{ all: true }"
      :showVoteIcons="$store.user !== null"
    />
  </div>
</template>

<script>
import MainNavbar from '../components/MainNavbar.vue';
import PostList from '../components/search/PostList.vue';

export default {
  name: 'All',
  components: { MainNavbar, PostList },
};
</script>
