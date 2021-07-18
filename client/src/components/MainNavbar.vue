<template>
  <nav class="navbar sticky-top navbar-dark bg-dark px-3 w-100">
    <select
      v-model="selectedSubreddit"
      @change="subredditChange"
      class="bg-dark text-white p-1 rounded col-lg-1 col-md-2 col-sm-4 col-4 h6"
    >
      <option value="" disabled selected class="d-none">Navigate</option>
      <option value="home">Home</option>
      <option value="all">All</option>
      <option value="discover">Discover subreddits</option>
      <option v-if="$store.user !== null" value="create">Create a new subreddit</option>
      <option v-for="sub in subscribed" :key="sub.id" :value="'r/' + sub.name">r/{{ sub.name }}</option>
    </select>
    <div class="mr-auto">
      <a href="/search" class="anchor-white px-1">Search</a>
      <template v-if="$store.user !== null">
        <a href="/user" class="anchor-white px-1">Profile</a>
        <span href="/logout" class="anchor-white px-1" @click="logout">Logout</span>
      </template>
      <template v-else>
        <a href="/login" class="anchor-white px-1">Login</a>
        <a href="/register" class="anchor-white px-1">Register</a>
      </template>
    </div>
  </nav>
</template>

<script>
import axios from 'axios';

export default {
  name: 'MainNavbar',
  data() {
    return {
      subscribed: [],
      selectedSubreddit: '',
    };
  },
  methods: {
    logout() {
      axios.post('/user/logout', {}).then(() => {
        this.$router.go();
      });
    },
    subredditChange() {
      if (this.selectedSubreddit === 'home') {
        this.$router.push('/');
      } else {
        this.$router.push('/' + this.selectedSubreddit);
      }
    },
  },
  mounted() {
    axios.get('/user/subreddits').then(res => {
      this.subscribed = res.data;
    });
  },
};
</script>
