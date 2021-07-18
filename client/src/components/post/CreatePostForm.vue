<template>
  <form class="container-wide">
    <h3>Create a post in r/{{ $route.params.name }}</h3>
    <hr />
    <div class="d-flex flex-column">
      <label>Title:</label>
      <input type="text" class="form-control text-white bg-dark w-100" v-model="title" />
    </div>
    <div class="d-flex flex-column mt-2">
      <label>Image:</label>
      <input type="file" accept="image/*" @change="updateImage" />
    </div>
    <div class="d-flex flex-column mt-2">
      <label>YouTube video:</label>
      <input type="url" class="form-control text-white bg-dark w-100" v-model="videoUrl" />
    </div>
    <div class="d-flex flex-column mt-2">
      <label>Text:</label>
      <textarea rows="5" class="form-control text-white bg-dark w-100" v-model="text" />
    </div>
    <button type="submit" class="btn border border-light text-white mt-2" @click="onSubmit">Submit</button>
    <p v-if="error !== ''" class="text-danger">{{ error }}</p>
  </form>
</template>

<script>
import axios from 'axios';

export default {
  name: 'CreatePostForm',
  data() {
    return {
      image: null,
      videoUrl: '',
      text: '',
      error: '',
      title: '',
    };
  },
  methods: {
    updateImage(event) {
      if (event.target.files.length !== 0) {
        this.image = event.target.files[0];
      }
    },
    onSubmit(event) {
      event.preventDefault();
      this.error = '';
      if (this.title === '') {
        this.error = 'The post requires a title';
        return;
      }
      if (this.title.length > 256) {
        this.error = 'The title can only be up to 256 characters long';
        return;
      }
      if (!this.validateUrl()) return;
      const formData = new FormData();
      formData.append('title', this.title);
      formData.append('image', this.image);
      formData.append('videoUrl', this.videoUrl);
      formData.append('text', this.text);
      formData.append('subreddit', this.$route.params.name);
      axios
        .post('/posts/create', formData, {
          headers: {
            'Content-Type': 'multipart/form-data',
          },
        })
        .then(res => {
          this.$router.push(`/post/${res.data.id}`);
        });
    },
    validateUrl() {
      if (this.videoUrl === '') return true;
      if (!this.videoUrl.startsWith('https://www.youtube.com/')) {
        this.error = 'Only YouTube videos are accepted';
        return false;
      }
      try {
        new URL(this.videoUrl);
      } catch {
        this.error = 'This is not a valid url';
        return false;
      }
      return true;
    },
  },
};
</script>
