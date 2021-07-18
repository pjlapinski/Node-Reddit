<template>
  <div class="page">
    <main-navbar />
    <post-content v-if="post !== null" :moderator="moderator" :post="post" @upvote="upvote" @downvote="downvote" />
    <comment-form v-if="$store.user !== null" :post="post" />
    <comment-list :comments="comments" :moderator="moderator" />
  </div>
</template>
<script>
import MainNavbar from '../components/MainNavbar.vue';
import PostContent from '../components/post/PostContent.vue';
import CommentList from '../components/post/comment/CommentList.vue';
import CommentForm from '../components/post/comment/CommentForm.vue';
import axios from 'axios';

export default {
  name: 'Post',
  components: { MainNavbar, PostContent, CommentList, CommentForm },
  data() {
    return {
      post: null,
      comments: [],
      moderator: false,
    };
  },
  methods: {
    upvote() {
      if (this.$store.user === null) return;
      axios.post('/posts/vote', { post: this.post.id, vote: 1 });
    },
    downvote() {
      if (this.$store.user === null) return;
      axios.post('/posts/vote', { post: this.post.id, vote: -1 });
    },
  },
  created() {
    this.$store.socket.on('vote', data => {
      if (this.post.id !== data.postId) return;
      if (this.$store.user !== null && data.userId === this.$store.user.id) this.post.voted_by_user = data.vote;
      this.post.score = data.score;
    });
    axios
      .get(`/posts/${this.$route.params.id}`)
      .then(res => {
        this.post = res.data.post;
        this.comments = res.data.comments;
      })
      .then(() => {
        axios.get(`/r/${this.post.subreddit_name}/mod`).then(res => {
          this.moderator = res.data;
        });
      })
      .catch(() => {
        this.$router.push('/error');
      });
    this.$store.socket.on('delete-post', postId => {
      const postIdNum = parseInt(postId);
      if (this.post.id === postIdNum) {
        this.$router.push('/');
      }
    });
    this.$store.socket.on('new-comment', comment => {
      if (comment.post !== this.post.id) return;
      this.comments.push(comment);
    });
    this.$store.socket.on('delete-comment', commentId => {
      const commentIdNum = parseInt(commentId);
      this.comments = this.comments.filter(comment => comment.id !== commentIdNum);
    });
  },
};
</script>
