<template>
  <div class="mb-3">
    <button class="btn btn-danger" @click="onClick">
      <i v-if="clickedAmount === 0" class="far fa-trash-alt"></i>
      <h6 v-else-if="clickedAmount === 1">Delete this {{ source }}?</h6>
    </button>
  </div>
</template>
<script>
import axios from 'axios';

export default {
  name: 'ModeratorTools',
  props: ['data', 'source'],
  data() {
    return {
      clickedAmount: 0,
    };
  },
  methods: {
    onClick() {
      this.clickedAmount++;
      if (this.clickedAmount >= 2) {
        if (this.source === 'post') axios.delete(`/posts/${this.data.id}`);
        else if (this.source === 'comment') axios.delete(`/posts/comment/${this.data.id}`);
      }
    },
  },
};
</script>
