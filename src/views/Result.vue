<template>
  <div id="result" class="page">
    <h1>{{ username }}</h1>
    <ul id="result-sidebar">
      <li
        v-for="tab in tabs"
        :key="tab"
        v-bind:class="['tab-button', { active: currentTab === tab }]"
        @click="currentTab = tab.replace(/\s/g, '')"
      >
        {{ tab }}
      </li>
    </ul>
    <component v-bind:is="currentTab" class="result-tab"></component>
  </div>
</template>

<script lang="ts">
import { store } from "@/store";
import { Options, Vue } from "vue-class-component";
import Overview from "@/components/Overview.vue";
import MangaList from "@/components/MangaList.vue";
import Stats from "@/components/Stats.vue";
import Staff from "@/components/Staff.vue";

@Options({
  components: {
    Overview,
    MangaList,
    Stats,
    Staff,
  },
})
export default class Result extends Vue {
  private username = "";

  currentTab = "Overview";
  tabs = ["Overview", "Manga List", "Stats", "Staff"];

  mounted(): void {
    this.username = store.state.username;
  }
}
</script>
