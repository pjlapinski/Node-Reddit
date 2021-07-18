<template>
  <div>
    <subreddit-list-element
      v-for="subreddit in subreddits"
      :key="subreddit.id"
      :subreddit="subreddit"
      @subscribe="subscribe(subreddit)"
    />
  </div>
</template>
<script>
import SubredditListElement from './SubredditListElement.vue';
import axios from 'axios';

export default {
  name: 'SubredditList',
  components: { SubredditListElement },
  data() {
    return {
      subreddits: [],
    };
  },
  props: ['search'],
  methods: {
    subscribe(subreddit) {
      axios.post(`/r/${subreddit.name}/subscribe`, {}).then(res => {
        this.subreddits = this.subreddits.map(sub => {
          if (sub.id !== subreddit.id) return sub;
          return {
            ...subreddit,
            subscribed: res.data.subscribed,
          };
        });
      });
      this.$router.go();
    },
  },
  created() {
    if (this.search.search === undefined) {
      axios.get('/r').then(res => {
        this.subreddits = res.data;
      });
    } else {
      axios.post('/r', { search: this.search.search }).then(res => {
        this.subreddits = res.data;
        if (this.subreddits.length === 0) this.$emit('noResults');
      });
    }
  },
};
</script>
