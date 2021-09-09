<template>
  <div id="login" class="page">
    <div id="login-content">
      <h1>
        Log in to <span id="mangadex"><strong>MangaDex</strong></span>
      </h1>
      <label class="input-text">
        <input type="text" required />
        <span>Username/Email</span>
      </label>
      <label class="input-text">
        <input type="password" required />
        <span>Password</span>
      </label>
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
