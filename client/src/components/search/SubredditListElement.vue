<template>
  <div class="container-wide">
    <div class="d-flex header-row">
      <a :href="'/r/' + subreddit.name" class="anchor-white">
        <h3>r/{{ subreddit.name }}</h3>
      </a>
      <button v-if="$store.user !== null" class="join-btn" @click="subscribe">
        {{ btnText }}
      </button>
    </div>
    <p class="mt-4 mb-0">{{ subreddit.description }}</p>
  </div>
</template>
<script>
export default {
  name: 'SubredditListElement',
  props: ['subreddit'],
  computed: {
    btnText() {
      return this.subreddit.subscribed ? 'Leave' : 'Join';
    },
  },
  methods: {
    subscribe() {
      this.$emit('subscribe');
    },
  },
};
</script>
<style lang="scss" scoped>
.header-row {
  gap: 1rem;
}
</style>
