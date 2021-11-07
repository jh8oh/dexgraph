<template>
  <div id="login" class="page">
    <div id="login-content">
      <h1>
        Log in to <span id="mangadex"><strong>MangaDex</strong></span>
      </h1>
      <label class="input-text">
        <input v-model="username" type="text" @keyup.enter="focusPassword()" required />
        <span>Username/Email</span>
      </label>
      <label class="input-text">
        <input
          ref="input_password"
          v-model="password"
          type="password"
          @keyup.enter="login()"
          required
        />
        <span>Password</span>
      </label>
      <p id="error">{{ errorMessage }}</p>
      <button @click="login">Log In</button>
    </div>
  </div>
</template>

<script lang="ts">
import { Vue } from "vue-class-component";
import { store } from "@/store";
import router from "@/router";
import { AxiosError } from "axios";
import { login, check } from "@/ts/network/calls";
import { ErrorResponse } from "@/ts/model/response";
import { handleErrorMessage } from "@/ts/util/errorMessage";

export default class Login extends Vue {
  private username = "";
  private password = "";
  private errorMessage = "";

  $refs!: {
    input_password: HTMLInputElement;
  };

  mounted(): void {
    this.checkFollowedManga();
    this.checkUsername();
  }

  private checkFollowedManga() {
    if (store.state.followedMangas.length != 0) {
      router.push("result");
    } else {
      this.checkToken();
    }
  }

  private checkToken() {
    if (store.state.token.session != "") {
      check(store.state.token.session)
        .then((response) => {
          if (response.data.isAuthenticated) {
            router.push("loading");
          }
        })
        .catch((error: AxiosError<ErrorResponse>) => {
          this.errorMessage = handleErrorMessage(error);
        });
    }
  }

  private checkUsername() {
    this.username = store.state.username;
  }

  private focusPassword() {
    this.$refs.input_password.focus();
  }

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
      .then((response) => {
        store.commit("setToken", response.data.token);
        router.push("loading");
      })
      .catch((error: AxiosError<ErrorResponse>) => {
        this.errorMessage = handleErrorMessage(error);
      });
  }
}
</script>
