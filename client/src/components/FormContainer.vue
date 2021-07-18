<template>
  <form class="form-container container col-lg-4 col-md-6 mt-5 bg-dark py-2 px-4">
    <slot />
  </form>
</template>

<script>
export default {
  name: 'FormContainer',
};
</script>

<style lang="scss" scoped>
.form-container {
  border-radius: 10px;
}
</style>
