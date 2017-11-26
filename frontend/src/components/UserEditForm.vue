<template>
  <div class="pull-left left-text">
    <h3> {{ user.name }} </h3>
    <b-row>
      <b-col cols="4"> <span class="bold-edit-user-text" >Membership Number:</span> {{ user.id }}</b-col>
      <b-col cols="4"> <span class="bold-edit-user-text" >Age Group Number:</span> {{ user.ageGroup }}</b-col>
    </b-row>
    <b-row>
      <b-col cols="4">
        <b-form-radio-group id="btnradios2"
                        buttons
                        button-variant="outline-primary"
                        v-model="selected"
                        :options="statusOptions"
                        name="radiosBtnDefault" />
        </b-form-radio-group>
      </b-col>
    </b-row>
    <b-row>
      <b-col cols="6">
          <div v-if="editBarcode">
            <b-form-input type="text" :placeholder="user.barcode"></b-form-input>
          </div>
          <div v-else>
            <span class="bold-edit-user-text" > Barcode: </span> {{ user.barcode }}
            <a v-on:click="handleEditClick" href="#"> Add Edit </a>
          </div>

      </b-col>
      <b-col cols="3" >

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
    },
    handleEditClick: function() {
      this.editBarcode = true;
    }
  },
  data() {
    return {
      selected: 'active',
      statusOptions: [
        { text: 'Active', value: 'active' },
        { text: 'Inactive', value: 'inactive' }
      ],
      updated: {},
      editBarcode: false,
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

.btn{
  margin: 20px 0;
}

.btn-outline-primary:not([disabled]):not(.disabled):active, .btn-outline-primary:not([disabled]):not(.disabled).active, .show > .btn-outline-primary.dropdown-toggle {
  background-color: #868e96;
  box-shadow: 0 0 0 0.2rem #868e96;
  border-color: #868e96;

}

.btn-outline-primary{
  color: #868e96;
  border-color: #868e96;
}


</style>
