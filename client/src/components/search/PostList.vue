<template>
  <div>
    <post-list-element
      v-for="post in posts"
      :moderator="moderator"
      :key="post.id"
      :post="post"
      :show-vote-icons="showVoteIcons"
      :show-subreddit-source="showSubredditSource"
      @upvote="upvote(post)"
      @downvote="downvote(post)"
    />
  </div>
</template>
<script>
import PostListElement from './PostListElement.vue';
import axios from 'axios';

export default {
  name: 'PostList',
  props: ['source', 'showVoteIcons', 'showSubredditSource', 'moderator'],
  data() {
    return {
      posts: [],
    };
  },
  components: { PostListElement },
  methods: {
    upvote(post) {
      if (this.$store.user === null) return;
      axios.post('/posts/vote', { post: post.id, vote: 1 });
    },
    downvote(post) {
      if (this.$store.user === null) return;
      axios.post('/posts/vote', { post: post.id, vote: -1 });
    },
  },
  created() {
    this.$store.socket.on('delete-post', postId => {
      const postIdNum = parseInt(postId);
      this.posts = this.posts.filter(post => post.id !== postIdNum);
    });
    this.$store.socket.on('vote', data => {
      this.posts.map(p => {
        if (p.id !== data.postId) return p;
        if (this.$store.user !== null && data.userId === this.$store.user.id) p.voted_by_user = data.vote;
        p.score = data.score;
        return p;
      });
    });
    if (this.source.search !== undefined) {
      axios.post('/posts', { search: this.source.search }).then(res => {
        this.posts = res.data;
        if (this.posts.length === 0) this.$emit('noResults');
      });
    } else if (this.source.all === true) {
      axios.get('/posts').then(res => {
        this.posts = res.data;
      });
    } else if (this.source.subreddit === null) {
      axios.get('/posts/user').then(res => {
        this.posts = res.data;
      });
    } else {
      axios.get(`/posts/r/${this.source.subreddit}`).then(res => {
        this.posts = res.data;
      });
    }
  },
};
</script>
