<template>
  <div id="login" class="page">
    <div id="login-content">
      <label class="input-text">
        <input type="text" required />
        <span>Username/Email</span>
      </label>
      <br />
      <label class="input-text">
        <input type="password" required />
        <span>Password</span>
      </label>
      <br />
      <button @click="login">Log In</button>
    </div>
  </div>
</template>

<script lang="ts">
import { Options, Vue } from "vue-class-component";

@Options({})
export default class Login extends Vue {
  private login() {
    return;
  }
}
</script>
