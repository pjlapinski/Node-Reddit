<template>
  <div class="page">
    <main-navbar />
    <form-container>
      <div class="form-group mt-2">
        <label for="email">Email</label>
        <input v-model="email" type="text" name="email" id="email" class="form-control" />
      </div>
      <div class="form-group mt-2">
        <label for="password">Password</label>
        <input v-model="password" type="password" name="password" id="password" class="form-control" />
      </div>
      <button type="submit" class="btn btn-dark border border-light mt-2 mb-3" @click="onSubmit">Login</button>
      <p v-if="error !== ''" class="text-danger">{{ error }}</p>
    </form-container>
  </div>
</template>

<script>
import MainNavbar from '../components/MainNavbar.vue';
import FormContainer from '../components/FormContainer.vue';
import axios from 'axios';

export default {
  name: 'Login',
  components: { MainNavbar, FormContainer },
  data() {
    return {
      email: '',
      password: '',
      error: '',
    };
  },
  methods: {
    onSubmit(event) {
      event.preventDefault();
      this.error = '';
      axios
        .post('/user/login', { username: this.email, password: this.password }, { withCredentials: true })
        .then(res => {
          if ('error' in res.data) {
            this.error = res.data.error;
          } else {
            this.$store.user = res;
            this.$router.push('/');
          }
        });
    },
  },
};
</script>
