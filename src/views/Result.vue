<template>
  <div id="result" class="page">
    <h1>{{ username }}</h1>
  </div>
</template>

<script lang="ts">
import { store } from "@/store";
import { Vue } from "vue-class-component";

export default class Result extends Vue {
  private username = "";

  mounted(): void {
    this.username = store.state.username;
  }
}
</script>
