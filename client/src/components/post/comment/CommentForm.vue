<template>
  <form class="container-wide">
    <h4>Write a comment</h4>
    <hr />
    <textarea v-model="content" rows="5" class="w-100 bg-dark text-white" />
    <button type="submit" class="btn border border-light text-white" @click="onSubmit">Submit</button>
    <p v-if="error !== ''" class="text-danger">{{ error }}</p>
  </form>
</template>
<script>
export default {
  name: 'CommentForm',
  props: ['post'],
  data() {
    return {
      content: '',
      error: '',
    };
  },
  methods: {
    onSubmit(event) {
      event.preventDefault();
      if (this.content === '') {
        return (this.error = 'Content cannot be empty');
      }
      this.$store.socket.emit('new-comment', { post: this.post.id, content: this.content });
      this.content = '';
    },
  },
  watch: {
    content() {
      this.error = '';
    },
  },
};
</script>
