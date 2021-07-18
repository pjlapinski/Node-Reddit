<template>
  <div class="page">
    <main-navbar />
    <subreddit-header
      :moderator="moderator"
      :subscribed="subscribed"
      :name="name"
      :description="description"
      @subscribe="subscribe"
    />
    <post-list
      :moderator="moderator"
      :showSubredditSource="false"
      :source="{ subreddit: $route.params.name }"
      :showVoteIcons="$store.user !== null"
    />
  </div>
</template>
<script>
import axios from 'axios';
import PostList from '../components/search/PostList.vue';
import MainNavbar from '../components/MainNavbar.vue';
import SubredditHeader from '../components/subreddit/SubredditHeader.vue';

export default {
  name: 'Subreddit',
  components: { PostList, MainNavbar, SubredditHeader },
  data() {
    return {
      name: '',
      description: '',
      subscribed: false,
      moderator: false,
    };
  },
  methods: {
    subscribe() {
      axios.post(`/r/${this.$route.params.name}/subscribe`, {}, { withCredentials: true }).then(res => {
        this.subscribed = res.data.subscribed;
      });
    },
  },
  mounted() {
    this.name = this.$route.params.name;
    axios
      .get(`/r/${this.$route.params.name}`, { withCredentials: true })
      .then(res => {
        this.description = res.data.description;
        this.subscribed = res.data.subscribed;
        this.moderator = res.data.moderator;
      })
      .catch(() => {
        this.$router.push('/error');
      });
  },
};
</script>
