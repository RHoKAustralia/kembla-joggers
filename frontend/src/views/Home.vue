<template>

  <div class="main-div">
    <div class="header-div">
      <img src="../assets/KJlogo.png">
    </div>

    <b-container class="home-container">
      <b-row align-h="center">
        <b-col cols="5" class="home-div">
          <router-link to="/contacts">
            <img src="../assets/contacts.png">
          </router-link>
        </b-col>
        <b-col cols="5" class="home-div">
          <router-link to="/events">
            <img src="../assets/events.png">
          </router-link>
        </b-col>
      </b-row>
      <b-row align-h="center">
        <b-col cols="5" class="home-div">
          <router-link to="/timer">
            <img src="../assets/timer.png">
          </router-link>
        </b-col>
        <b-col cols="5" class="home-div">
          <router-link to="/settings">
            <img src="../assets/settings.png">
          </router-link>
        </b-col>
      </b-row>
    </b-container>

    <div>
      <a href="#" class="logout">Log out: [user]</a>
    </div>

  </div>
</template>

<script>
export default {
  name: "home",
  components: {
  }
}
</script>

<style scoped>
h1, h2 {
  font-weight: normal;
}
ul {
  list-style-type: none;
  padding: 0;
}
li {
  display: inline-block;
  margin: 0 10px;
}

h3{
  color: white;
  padding: 5px;
}

.header-div{
  position: fixed;
  top: 0;
  height: inherit;
}

.home-container{
  position: relative;
  display: inline-block;
  vertical-align: middle;
  margin-top: 80px;
}

.home-div{
  display: inline-block;
  vertical-align: middle;
  position: relative;
  background-color: #10518a;
  padding: 50px;
  border-radius: 15px;
  width: 50%;
  margin: 20px;
}

img{
  position: relative;
  display: inline-block;
  vertical-align: middle;
}

a {
  color: #4a4a4a;
  line-height: 60px;

    &:hover {
      color: #10518a;
    }
}

.logout {
  position: absolute;
  left: 0;
  bottom: 0;
  width: 100%;
  height: 60px;
  background-color: #F0F0F0;
}


</style>
