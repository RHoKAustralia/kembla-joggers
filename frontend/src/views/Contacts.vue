<template>
  <div class="container">
    <b-modal ref="userEditModal" title="">
      <p class="my-4">Hello from modal!</p>
      <user-edit-form :user="selectedUser"></user-edit-form>
    </b-modal>
    <user-list v-on:editUserClicked="editUserClicked()" :users="users"></user-list>
  </div>
</template>

<script>
import UserList from '@/components/UserList';
import UserEditForm from '@/components/UserEditForm';
export default {
  name: 'contacts',
  data: () => {
    return {
      selectedUser: {},
    }
  },
  methods: {
    editUserClicked: function(user) {
      this.selectedUser = user;
      this.$refs.userEditModal.show()      
    }
  },
  computed: {
    users: function() {
      const userList = [];
      for(let i = 0; i < 30; i ++) {
        const user = {
          name: Math.random().toString(36).substring(7),
          status: Math.random() > 0.2 ? 'active' : 'inactive',
          id: i,
          barcode: Math.random().toString(36).substring(7),
          ageGroup: Math.random() > 0.5 ? '20-24' : '50-60'
        }
        userList.push(user);
      }
      return userList;
    }
  },
  components: {
    'user-list': UserList,
    'user-edit-form': UserEditForm
  }
}
</script>

<style scoped>
.container {
  height: 100%;
}
</style>
