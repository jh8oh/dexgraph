<template>
  <div id="login" class="page">
    <div id="login-content">
      <h1>
        Log in to <span id="mangadex"><strong>MangaDex</strong></span>
      </h1>
      <label class="input-text">
        <input v-model="username" type="text" required />
        <span>Username/Email</span>
      </label>
      <label class="input-text">
        <input v-model="password" type="password" required />
        <span>Password</span>
      </label>
      <p id="error">{{ errorMessage }}</p>
      <button @click="login">Log In</button>
    </div>
  </div>
</template>

<script lang="ts">
import { Vue } from "vue-class-component";
import { AxiosError, AxiosResponse } from "axios";
import { login } from "@/ts/network/calls";
import LoginResponse from "@/ts/model/login-response";
import ErrorResponse from "@/ts/model/error-response";
import store from "@/store";

export default class Login extends Vue {
  private username = "";
  private password = "";
  private errorMessage = "";

  private login() {
    // Validate username and checks if email
    if (this.username.length === 0) {
      this.errorMessage = "Please enter your username";
      return;
    }

    var isEmail = false;
    if (this.username.includes("@")) {
      isEmail = true;
    }

    // Validates password
    if (this.password.length === 0) {
      this.errorMessage = "Please enter your password";
      return;
    } else if (this.password.length < 8) {
      this.errorMessage = "Password has to have at least 8 characters";
      return;
    }

    // Call MangaDex API
    login(this.username, this.password, isEmail)
      .then((response: AxiosResponse<LoginResponse>) => {
        store.commit("setToken", response.data.token);
        store.commit("setRefresh", response.data.result);
      })
      .catch((error: AxiosError<ErrorResponse>) => {
        if (error.response) {
          // Request made and server responded
          this.errorMessage = error.response.data.errors[0].detail;
          console.log(error.response.data);
        } else if (error.request) {
          // The request was made but no response was received
          this.errorMessage =
            "MangaDex failed to respond. Please try again later.";
          console.log(error.request);
        } else {
          // Something happened in setting up the request that triggered an Error
          this.errorMessage = "Unable to send request. Please try again later.";
          console.log("Error", error.message);
        }
      });
  }
}
</script>
