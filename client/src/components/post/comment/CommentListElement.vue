<template>
  <div class="container-wide">
    <moderator-tools v-if="moderator" :data="comment" source="comment" />
    <h5>{{ comment.author }}</h5>
    <p>{{ comment.content }}</p>
  </div>
</template>
<script>
import ModeratorTools from '../ModeratorTools.vue';

export default {
  name: 'CommentListElement',
  components: { ModeratorTools },
  props: ['comment', 'moderator'],
};
</script>
