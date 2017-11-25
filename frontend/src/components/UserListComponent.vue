<template>
    <tr>
      <td class="filterable-cell">
        <div class="bold-table">{{ user.name }}</div>
      </td>
      <td class="filterable-cell">
        <div class="bold-table" v-bind:class="{ iconactive: user.status === 'active' }">
          {{ user.status }}
        </div>
      </td>
      <td class="filterable-cell">
        {{ user.id }}
      </td>
      <td class="filterable-cell">
        <div v-bind:class="{ iconactive: user.status === 'active' }">        
          <i v-if="user.barcode" class="fa fa-check-circle iconactive" aria-hidden="true"></i>
          <i v-else class="fa fa-times-circle iconinactive" aria-hidden="true"></i>
        </div>        
      </td>
      <td class="filterable-cell">
        {{ user.ageGroup }}
      </td>       
      <td class="filterable-cell">
        <b-button class="edit-button" v-on:click="emitUserEdit(user.id)" variant="primary">Edit</b-button>
      </td>
    </tr>
</template>

<script>
export default {
  name: 'UserCardComponent',
  props: ['user'],
  methods: {
    emitUserEdit: function(id) {
      console.log(id);
      this.$emit('editUser', id);
    }
  }
}
</script>

<style scoped>
.iconactive {
  color: #149940;
}

.iconinactive {
  color: #C6000E;
}

.bold-table {
  font-weight: bold;
}
.edit-button {
  width: 80%;
  color: #FFFFFF;
  font-family: Roboto;
  font-size: 14px;
  font-weight: bold;	
  text-align: center;
  background-color: #10518A;
  border-radius: 2px;
  border: none;
}
</style>
