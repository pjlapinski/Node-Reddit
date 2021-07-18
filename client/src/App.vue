<template>
  <div id="main" class="text-white vh-100 w-100">
    <router-view :key="$route.path" />
  </div>
</template>

<script>
import io from 'socket.io-client';
import config from './config';

export default {
  created() {
    this.$store.socket = io(config.SERVER_HOST, { transports: ['websocket'] });
    this.$store.socket.emit('whoami');
    this.$store.socket.on('whoami', res => {
      this.$store.user = res;
    });
  },
};
</script>

<style lang="scss">
@import '~bootstrap/scss/bootstrap.scss';
@import '~@fortawesome/fontawesome-free/css/all.css';

* {
  margin: 0;
  padding: 0;
}

.anchor-white {
  text-decoration: none;
  color: #fff;
  &:hover {
    color: darken(#fff, 50%) !important;
    cursor: pointer;
  }
}

.text-underline {
  text-decoration: underline;
}

.minvh-100 {
  min-height: 100vh;
}

.container-wide {
  @extend .mx-auto, .col-lg-8, .col-md-10, .col-sm-10, .col-11, .bg-dark, .my-2, .p-3, .rounded;
}

.join-btn {
  @extend .px-3, .btn, .text-white, .border, .border-light;
  border-radius: 40px;
}

.page {
  @extend .bg-secondary, .minvh-100, .pb-2;
}
</style>
