<template>
  <div class="pull-left left-text">
    <h3> {{ user.name }} </h3>
    <b-row>
      <b-col> <span class="bold-edit-user-text" >Membership Number:</span> {{ user.id }}</b-col>
      <b-col> <span class="bold-edit-user-text" >Age Group Number:</span> {{ user.ageGroup }}</b-col>
    </b-row>
    <b-row>
      <b-col>
        <b-form-radio-group id="btnradios1"
                        buttons
                        v-model="selected"
                        :options="statusOptions"
                        name="radiosBtnDefault" />
        </b-form-radio-group>
      </b-col>
    </b-row>
    <b-row>
      <b-col cols="4">
        <span class="bold-edit-user-text" > Barcode: </span> {{ user.barcode }}
      </b-col>
      <b-col>
        <a href="#"> Add Edit </a>
      </b-col>
    </b-row>
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
  },
  data() {
    return {
      selected: 'active',
      statusOptions: [
        { text: 'Active', value: 'active' },
        { text: 'Inactive', value: 'inactive' }        
      ]
    }
  }
}
</script>

<style>
.left-text {
  text-align: left;
  width: 100%;
}
.bold-edit-user-text {
  font-weight: bold;
}
</style>
