<template>
  <div>
  
  <table class="table table-striped">
    <thead>
      <tr>
        <th>Name</th>
        <th>Status</th>
        <th>Member #</th>      
        <th>Barcode</th>
        <th>Age Group</th>
        <th>Edit</th>
      </tr>
    </thead>
    <tbody>
    <user-list-component 
      v-for="user in users"
      :key="user.id" 
      :user="user" 
      v-on:editUser="editUserClicked(user)">
    </user-list-component>
    </tbody>
  </table>
  </div>
</template>

<script>
import UserListComponent from '@/components/UserListComponent';
export default {
  name: 'UserList',
  props: ['users'],
  components: {
    'user-list-component': UserListComponent
  },
  methods: {
    editUserClicked: function(user) {
      console.log(user);
      this.$emit('editUserClicked', user);
    }
  }
}
</script>

<style>
.user-list {
  height: 500px;
  overflow-y: scroll;
}
table {
    width: 100%;
    text-align: center;
}

thead, tbody, tr, td, th { display: block; }

tr:after {
    content: ' ';
    display: block;
    visibility: hidden;
    clear: both;
}

tbody {
    height: 600px;
    overflow-y: auto;
}

thead {
    /* fallback */
}


tbody td, thead th {
    width: 16.66%;
    float: left;
        }
</style>
