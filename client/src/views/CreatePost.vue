<template>
  <div class="page">
    <main-navbar />
    <create-post-form />
  </div>
</template>

<script>
import MainNavbar from '../components/MainNavbar.vue';
import CreatePostForm from '../components/post/CreatePostForm.vue';

export default {
  name: 'CreatePost',
  components: { MainNavbar, CreatePostForm },
};
</script>
