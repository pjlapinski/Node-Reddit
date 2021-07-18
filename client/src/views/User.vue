<template>
  <div class="page">
    <main-navbar />
    <form-container>
      <h4 class="mt-2">Change password</h4>
      <div class="form-group mt-2">
        <label for="newPassword">New password</label>
        <input v-model="newPassword" type="password" name="newPassword" id="newPassword" class="form-control" />
      </div>
      <div class="form-group mt-2">
        <label for="repeatPassword">Repeat password</label>
        <input
          v-model="repeatPassword"
          type="password"
          name="repeatPassword"
          id="repeatPassword"
          class="form-control"
        />
      </div>
      <div class="form-group mt-2">
        <label for="oldPassword">Old password</label>
        <input v-model="oldPassword" type="password" name="oldPassword" id="oldPassword" class="form-control" />
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
  name: 'User',
  components: { MainNavbar, FormContainer },
  data() {
    return {
      newPassword: '',
      repeatPassword: '',
      oldPassword: '',
      error: '',
    };
  },
  methods: {
    onSubmit(event) {
      event.preventDefault();
      this.error = '';
      if (!this.validateData()) return;
      axios
        .post(
          '/user/password-change',
          { oldPassword: this.oldPassword, newPassword: this.newPassword },
          { withCredentials: true }
        )
        .then(res => {
          if (res.data === 'OK') {
            this.$router.push('/');
          } else {
            this.error = res.data.error;
          }
        });
    },
    validateData() {
      if (this.newPassword !== this.repeatPassword) {
        this.error = 'The passwords do not match';
        return false;
      }
      if (this.newPassword.length < 8) {
        this.error = 'The password must contain at least 8 characters';
        return false;
      }
      return true;
    },
  },
};
</script>
