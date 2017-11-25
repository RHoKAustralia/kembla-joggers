<template>
  <div class="container">
    <b-card>
      <b-row>
        <b-col cols="6">
          <b-form-input v-model="searchValue" type="text" placeholder="Search"></b-form-input>
        </b-col>
      </b-row>
    <b-modal size="lg" ref="userEditModal" title="" class="user-edit-modal">
      <user-edit-form :user="selectedUser"></user-edit-form>
    </b-modal>
    <user-list v-on:editUserClicked="editUserClicked" :users="searchedUsers"></user-list>
    </b-card>
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
      searchValue: "",
      users: {}
    }
  },
  methods: {
    editUserClicked: function(user) {
      console.log(user);
      this.selectedUser = user;
      this.$refs.userEditModal.show()      
    }
  },
  mounted() {
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
      this.users = userList;
  },
  computed: {
    searchedUsers: function() {
      if (this.searchValue) {
        return this.users.filter(user => {
          return user.name.includes(this.searchValue)
        });
      } else {
        return this.users;
      }
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

.user-edit-modal {
  width:800px;
}
</style>
