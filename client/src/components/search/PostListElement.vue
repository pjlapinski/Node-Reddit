<template>
  <div class="container-wide">
    <moderator-tools v-if="moderator" :data="post" :source="post" />
    <post-info
      :post="post"
      :showSubredditSource="showSubredditSource"
      :showVoteIcons="showVoteIcons"
      :titleAsLink="true"
      @upvote="upvote"
      @downvote="downvote"
    />
  </div>
</template>

<script>
import PostInfo from '../post/PostInfo.vue';
import ModeratorTools from '../post/ModeratorTools.vue';

export default {
  name: 'PostListElement',
  props: ['post', 'showVoteIcons', 'showSubredditSource', 'moderator'],
  components: { PostInfo, ModeratorTools },
  methods: {
    upvote() {
      this.$emit('upvote');
    },
    downvote() {
      this.$emit('downvote');
    },
  },
};
</script>
