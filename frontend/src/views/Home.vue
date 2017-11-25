<template>

  <div class="main-div">
    <div class="header-div">
      <img src="../assets/KJlogo.png">
    </div>

    <b-container class="home-container">
      <b-row align-h="center">
        <b-col cols="6" class="home-div">
          <router-link to="/contacts">
            <img src="../assets/contacts.png">
          </router-link>
        </b-col>
        <b-col cols="6" class="home-div">
          <router-link to="/events">
            <img src="../assets/events.png">
          </router-link>
        </b-col>
      </b-row>
      <b-row align-h="center">
        <b-col cols="6" class="home-div">
          <router-link to="/timer">
            <img src="../assets/timer.png">
          </router-link>
        </b-col>
        <b-col cols="6" class="home-div">
          <router-link to="/settings">
            <img src="../assets/settings.png">
          </router-link>
        </b-col>
      </b-row>
    </b-container>
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
a {
  color: #42b983;
}

.header-div{
  position: fixed;
  top: 0;
  height: inherit;
  background-color: red;
}

.home-container{
  position: relative;
  margin-top: 100px;
}

.home-div img{
  height: 70%;
  width: inherit;
  position: relative;
  background-color: #10518a;
  padding: 20px;
}

.home-div{
  margin: 0;
}

</style>
