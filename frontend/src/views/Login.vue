<template>
  <div class="login-container">
    <div class="logo">
      <img src="../assets/KJlogo.png">
    </div>
    <h5>LOGIN</h5>
    <form class="login" action="">
      <b-form-input class="email" type="email" placeholder="Enter Email" name="email" required></b-form-input>
      <b-form-input type="password" placeholder="Enter Password" class="password" name="password" required></b-form-input>
      <button type="submit" class="btn btn-primary signupbtn btn-lg btn-block">LOG IN</button>
    </form>
    <div class="forgot-password">
      <a href="#">Forgot password?</a>
    </div>
  </div>
</template>


<script>
export default {
  name: "login",
}
</script>

<style scoped>
  .login-container {
    margin: 0 auto;
    width: 100vw;
    height: 100%;
    background-color: #FFFFFF;
  }

  h5 {
    color: #4a4a4a;

  }

  .logo {
    position: relative;
    margin: 0 auto;
    width: 320px;
    height: auto;
  }

  img {
    width: 100%;
    height: 100%;
    position: relative;
  }

  form {
    float: none;
    margin: 50px auto 0;
    width: 45%;
  }

  input,
  button {
    margin-bottom: 20px;
  }

  button {
    margin-top: 40px;
    background-color: #10518a;
    color: #FFFFFF;
  }

  .forgot-password {
    position: absolute;
    left: 0;
    bottom: 0;
    width: 100%;
    height: 60px;
    background-color: #F0F0F0;
  }

  a {
    color: #4a4a4a;
    line-height: 60px;

      &:hover {
        color: #10518a;
      }
  }
</style>
