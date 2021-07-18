<template>
  <div class="page">
    <main-navbar />
    <subreddit-list :search="{}" />
  </div>
</template>

<script>
import MainNavbar from '../components/MainNavbar.vue';
import SubredditList from '../components/search/SubredditList.vue';

export default {
  name: 'All',
  components: { MainNavbar, SubredditList },
};
</script>
