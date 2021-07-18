<template>
  <div class="container-wide">
    <moderator-tools v-if="moderator" :data="post" source="post" />
    <post-info
      :post="post"
      :showVoteIcons="$store.user !== null"
      :showSubredditSource="true"
      :titleAsLink="false"
      @upvote="upvote"
      @downvote="downvote"
    />
    <div v-if="post.video_url !== null" class="text-center mt-2">
      <hr />
      <iframe :src="post.video_url" frameborder="0"></iframe>
    </div>
    <div v-if="post.image_path !== null" class="text-center mt-2">
      <hr />
      <img :src="post.image_path" />
    </div>
    <div v-if="post.content !== null && post.content.length > 0" class="mt-2">
      <hr />
      <p>{{ post.content }}</p>
    </div>
  </div>
</template>
<script>
import PostInfo from './PostInfo.vue';
import ModeratorTools from './ModeratorTools.vue';

export default {
  name: 'PostContent',
  components: { PostInfo, ModeratorTools },
  props: ['post', 'moderator'],
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
<style lang="scss" scoped>
iframe {
  // 16:9
  width: 50vw;
  height: 30vw;
  min-width: 300px;
  min-height: 170px;
}
img {
  max-width: 80vw;
  max-height: 80vh;
  height: auto;
}
</style>
