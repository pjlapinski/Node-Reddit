<template>
  <div class="container-wide">
    <div v-if="!isEditting">
      <button v-if="moderator" class="btn border border-light text-white mb-2" @click="onEdit">Edit</button>
      <div id="top-row" class="d-flex">
        <h2>r/{{ name }}</h2>
        <button v-if="$store.user !== null" class="join-btn" @click="subscribe">
          {{ btnText }}
        </button>
      </div>
      <p class="m-0 mt-4">{{ description }}</p>
      <a :href="$route.fullPath + '/create'" v-if="$store.user !== null" class="btn text-white border border-light mt-3"
        >Create a post</a
      >
    </div>
    <subreddit-form
      v-else
      :existingData="{ name, description }"
      :errorsReceived="errors"
      @submit="onEditSubmitted"
      @clearErrors="clearErrors"
    />
  </div>
</template>

<script>
import SubredditForm from './SubredditForm.vue';
import axios from 'axios';

export default {
  name: 'SubredditHeader',
  props: ['subscribed', 'name', 'description', 'moderator'],
  components: { SubredditForm },
  data() {
    return {
      isEditting: false,
      errors: '',
    };
  },
  computed: {
    btnText() {
      return this.subscribed ? 'Leave' : 'Join';
    },
  },
  methods: {
    subscribe() {
      this.$emit('subscribe');
    },
    onEdit() {
      this.isEditting = true;
    },
    onEditSubmitted(data) {
      axios.patch(`/r/${this.name}`, data).then(res => {
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

<style lang="scss" scoped>
#top-row {
  gap: 1rem;
}
</style>
