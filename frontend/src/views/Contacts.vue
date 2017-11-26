<template>
  <div class="container">
    <div class="header-container">
    <router-link to="/">
      <span class="home-span">
      <i class="fa fa-home home-button"></i>
      </span>
    </router-link>
    <img src="../assets/KJlogo.png">
    </div>
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
import { getUserList } from '../api/index';
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
    getUserList().then(users => {
      this.users = users.data.results.map(user => {
        return {
          id: user.memberId,
          status: 'active',
          name: `${user.firstName} ${user.lastName}`,
        }
      });

    }).catch(e => {
      console.log(e);
    });
  },
  computed: {
    searchedUsers: function() {
      if (this.searchValue) {
        return this.users.filter(user => {
          const lower = user.name.toLowerCase();
          return lower.includes(this.searchValue.toLowerCase())
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
  text-align: left;
}

.header-container {
  display: inline-block;
}

.home-button {
  font-size: 40px;
}

.user-edit-modal {
  width:800px;
}

img {
  position: inherit;
}

</style>
