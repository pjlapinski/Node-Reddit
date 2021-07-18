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
      <div class="form-group mt-2">
        <label for="repeat-password">Repeat password</label>
        <input
          v-model="repeatPassword"
          type="password"
          name="repeat-password"
          id="repeat-password"
          class="form-control"
        />
      </div>
      <button type="submit" class="btn btn-dark border border-light mt-2 mb-3" @click="onSubmit">Register</button>
      <p v-if="error !== ''" class="text-danger">{{ error }}</p>
    </form-container>
  </div>
</template>

<script>
import MainNavbar from '../components/MainNavbar.vue';
import FormContainer from '../components/FormContainer.vue';
import axios from 'axios';

export default {
  name: 'Register',
  components: { MainNavbar, FormContainer },
  data() {
    return {
      email: '',
      password: '',
      repeatPassword: '',
      error: '',
    };
  },
  methods: {
    onSubmit(event) {
      event.preventDefault();
      this.error = '';
      if (!this.validateData()) return;
      axios
        .post('/user/register', { email: this.email, password: this.password }, { withCredentials: true })
        .then(res => {
          if ('error' in res.data) {
            this.error = res.data.error;
          } else {
            this.$store.user = res;
            this.$router.push('/');
          }
        });
    },
    validateData() {
      if (this.email.match(/[^\s@]+@[^\s@]+\.[^\s@]+/g) === null) {
        this.error = 'The email needs to be a valid address';
        return false;
      }
      if (this.password !== this.repeatPassword) {
        this.error = 'The passwords need match';
        return false;
      }
      if (this.password.length < 8) {
        this.error = 'The password must contain at least 8 characters';
        return false;
      }
      return true;
    },
  },
};
</script>
