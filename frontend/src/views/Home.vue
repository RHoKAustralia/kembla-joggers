<template>
  <div class="home-container">
  <b-container>
    <b-row align-h="center">
      <b-col cols="6" class="home-div">
        <img src="../assets/contacts.png">
      </b-col>
      <b-col cols="6" class="home-div">
        <img src="../assets/events.png">
      </b-col>
      <b-col cols="6" class="home-div">
        <img src="../assets/timer.png">
      </b-col>
      <b-col cols="6" class="home-div">
        <img src="../assets/settings.png">
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

.home-container{
  width: 500dp;
  height: 350dp;
  top: 100px;
}

img{
  height: 70%;
  width: inherit;
  position: relative;
  background-color: #10518a;
  padding: 20px;

}

</style>
