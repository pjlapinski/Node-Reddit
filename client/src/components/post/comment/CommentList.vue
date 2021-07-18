<template>
  <div>
    <comment-list-element v-for="comment in comments" :key="comment.id" :comment="comment" :moderator="moderator" />
  </div>
</template>
<script>
import CommentListElement from './CommentListElement.vue';

export default {
  name: 'CommentList',
  props: ['comments', 'moderator'],
  components: { CommentListElement },
};
</script>
