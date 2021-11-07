<template>
  <div id="result" class="page">
    <div id="result-content">
      <h1>{{ username }}</h1>
      <div id="result-component">
        <input id="toggle-menu" type="checkbox" />
        <label id="menu-icon" for="toggle-menu" />
        <ul id="result-sidebar">
          <li
            v-for="tab in tabs"
            :key="tab"
            v-bind:class="['tab-button', { active: currentTab === tab.replace(/\s/g, '') }]"
            @click="currentTab = tab.replace(/\s/g, '')"
          >
            <strong>{{ tab }}</strong>
          </li>
        </ul>
        <component v-bind:is="currentTab" class="result-tab"></component>
      </div>
    </div>
  </div>
</template>

<script lang="ts">
import { store } from "@/store";
import { Options, Vue } from "vue-class-component";
import Overview from "@/components/result/Overview.vue";
import MangaList from "@/components/result/MangaList.vue";
import Stats from "@/components/result/Stats.vue";
import Staff from "@/components/result/Staff.vue";

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

  private authors = new Set<string>();
  private artists = new Set<string>();

  currentTab = "Overview";
  tabs = ["Overview", "Manga List", "Stats", "Staff"];

  mounted(): void {
    this.username = store.state.username;

    this.updateLocalStorageManga();
  }

  private updateLocalStorageManga() {
    const followedMangasTooBig = localStorage.getItem("followedMangasTooBig");
    if (followedMangasTooBig != "true") {
      const localFollowedMangas = localStorage.getItem("followedMangas");
      const storeFollowedMangas = JSON.stringify(store.state.followedMangas);
      if (localFollowedMangas != storeFollowedMangas) {
        try {
          localStorage.setItem("followedMangas", storeFollowedMangas);
        } catch (e) {
          localStorage.setItem("followedMangasTooBig", "true");
        }
      }
    }
  }
}
</script>
