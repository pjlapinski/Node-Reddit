<template>
  <div class="d-flex gap">
    <div class="d-flex flex-column justify-content-center text-center">
      <i
        v-if="showVoteIcons"
        class="far fa-arrow-alt-circle-up pointer"
        :class="{ 'text-orange': post.voted_by_user === 1 }"
        @click="upvote"
      />
      <span>{{ post.score }}</span>
      <i
        v-if="showVoteIcons"
        class="far fa-arrow-alt-circle-down pointer"
        :class="{ 'text-orange': post.voted_by_user === -1 }"
        @click="downvote"
      />
    </div>
    <div>
      <h5 v-if="titleAsLink" class="anchor-white" @click="goToPost">{{ post.title }}</h5>
      <h5 v-else class="text-white">{{ post.title }}</h5>
      <span>
        <a
          v-if="showSubredditSource"
          :href="`/r/${post.subreddit_name}`"
          class="font-weight-bold anchor-white text-underline"
          >r/{{ post.subreddit_name }}</a
        >
        Posted by {{ post.author }} on <span class="nobr">{{ date }} at {{ time }}</span>
      </span>
    </div>
  </div>
</template>

<script>
export default {
  name: 'PostInfo',
  props: ['post', 'showVoteIcons', 'showSubredditSource', 'titleAsLink'],
  methods: {
    upvote() {
      this.$emit('upvote');
    },
    downvote() {
      this.$emit('downvote');
    },
    goToPost() {
      this.$router.push(`/post/${this.post.id}`);
    },
  },
  computed: {
    date() {
      return this.post.creation_date.split('T')[0];
    },
    time() {
      return this.post.creation_date.split('T')[1].split('.')[0];
    },
  },
};
</script>

<style lang="scss" scoped>
.gap {
  gap: 1rem;
}

.nobr {
  white-space: nowrap;
}

.text-orange {
  color: orange;
}

.pointer {
  cursor: pointer;
}
</style>
