<template>
  <div>

  <b-form-group
      id="fieldset1"
      description="Let us know your name."
      label="Enter your name"
      valid-feedback="Thank you"
  >
    <b-form-input id="input1" ></b-form-input>
  </b-form-group>
  </div>
</template>

<script>
export default {
  name: 'UserEditForm',
  props: ['user'],
  methods: {
    submit: function(user) {
      this.$emit(user);
    }
  }
}
</script>

<style>

</style>
