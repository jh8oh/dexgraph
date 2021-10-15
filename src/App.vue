<template>
  <router-view />
</template>

<script lang="ts">
import { Vue } from "vue-class-component";
import { store } from "./store";

export default class App extends Vue {
  beforeCreate(): void {
    store.commit("initialize");
  }
}
</script>
<style lang="scss" src="./scss/main.scss" />
