<template>
  <form>
    <h4>Name</h4>
    <input type="text" v-model="name" class="form-control text-white bg-dark" />
    <h4 class="mt-2">Description</h4>
    <textarea v-model="description" rows="5" class="form-control text-white bg-dark"></textarea>
    <button class="btn text-white border border-light mt-2" type="submit" @click="onSubmit">Submit</button>
    <p class="text-danger mt-2">{{ errors }}</p>
  </form>
</template>
<script>
export default {
  name: 'SubredditForm',
  data() {
    return {
      name: '',
      description: '',
      errors: '',
    };
  },
  props: ['existingData', 'errorsReceived'],
  methods: {
    onSubmit(event) {
      event.preventDefault();
      if (this.name === '' || this.description === '') {
        this.errors = 'No field can be empty';
        return;
      }
      this.$emit('submit', { name: this.name, description: this.description });
    },
  },
  mounted() {
    this.name = this.existingData.name;
    this.description = this.existingData.description;
    this.errors = this.errorsReceived;
  },
  watch: {
    errorsReceived() {
      this.errors = this.errorsReceived;
    },
    name() {
      this.$emit('clearErrors');
      this.errors = '';
    },
    description() {
      this.$emit('clearErrors');
      this.errors = '';
    },
  },
};
</script>
