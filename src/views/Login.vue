<template>
  <div id="login" class="page">
    <span class="floating-label">Username/Email</span>
    <input type="text" />
    <span class="floating-label">Password</span>
    <input type="password" />
    <button @click="login">Log In</button>
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
