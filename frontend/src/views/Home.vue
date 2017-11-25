<template>

  <div class="main-div">
    <div class="header-div">
      <img src="../assets/KJlogo.png">
    </div>

    <b-container class="home-container">
      <b-row align-h="center">
        <b-col cols="4" class="home-div">
            <a href="#">
                <img src="../assets/contacts.png">
                <h3>MEMBERS</h3>
            </a>
        </b-col>

        <b-col cols="4" class="home-div">
          <a href="#">

            <img src="../assets/events.png">
            <h3>EVENTS</h3>
          </a>
        </b-col>
      </b-row>
      <b-row align-h="center">
        <b-col cols="4" class="home-div">
          <a href="#">
            <img src="../assets/timer.png">
            <h3>RUN TIMER</h3>
          </a>
        </b-col>
        <b-col cols="4" class="home-div">
          <a href="#">
            <img src="../assets/settings.png">
            <h3>SETTINGS</h3>
          </a>
        </b-col>
      </b-row>
    </b-container>

    <div>
      <a href="#" class="log-out">Log out: [user]</a>
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
  margin-top: 150px;
}

.home-div{
  position: relative;
  background-color: #10518a;
  padding: 100px;
  border-radius: 15px;
  height: 110px;
  width: 120px;
  margin: 20px;
}

a {
  color: #4a4a4a;
  line-height: 60px;

    &:hover {
      color: #10518a;
    }
}

</style>
