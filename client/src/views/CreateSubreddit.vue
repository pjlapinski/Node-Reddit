<template>
  <div class="page">
    <main-navbar />
    <div class="container-wide">
      <subreddit-form
        v-if="$store.user !== null"
        :existingData="{ name: '', description: '' }"
        :errorsReceived="errors"
        @submit="onSubmit"
        @clearErrors="clearErrors"
      />
      <h2 v-else>You need to be logged in to create a subreddit</h2>
    </div>
  </div>
</template>
<script>
import SubredditForm from '../components/subreddit/SubredditForm.vue';
import MainNavbar from '../components/MainNavbar.vue';
import axios from 'axios';

export default {
  name: 'CreateSubreddit',
  components: { MainNavbar, SubredditForm },
  data() {
    return {
      errors: '',
    };
  },
  methods: {
    onSubmit(data) {
      axios.post('/r/create-subreddit', data).then(res => {
        if ('error' in res.data) {
          this.errors = res.data.error;
          return;
        }
        this.$router.push(`/r/${res.data.name}`);
      });
    },
    clearErrors() {
      this.errors = '';
    },
  },
};
</script>
