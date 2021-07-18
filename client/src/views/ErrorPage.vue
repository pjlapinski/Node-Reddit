<template>
  <div class="page">
    <main-navbar />
    <div class="container-wide">
      <h2>This page does not exist</h2>
    </div>
  </div>
</template>
<script>
import MainNavbar from '../components/MainNavbar.vue';

export default {
  name: 'ErrorPage',
  components: { MainNavbar },
};
</script>
