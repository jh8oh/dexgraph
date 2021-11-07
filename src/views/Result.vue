<template>
  <div id="result" class="page">
    <div id="result-content">
      <h1>{{ username }}</h1>
      <button id="sign-out" @click="signOut()">Sign Out</button>
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
import { Options, Vue } from "vue-class-component";
import { store } from "@/store";
import router from "@/router";
import MangaList from "@/components/result/MangaList.vue";
import Stats from "@/components/result/Stats.vue";
import Staff from "@/components/result/Staff.vue";

@Options({
  components: {
    MangaList,
    Stats,
    Staff,
  },
})
export default class Result extends Vue {
  private username = "";

  currentTab = "MangaList";
  tabs = ["Manga List", "Stats", "Staff"];

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

  private signOut() {
    localStorage.removeItem("username");
    localStorage.removeItem("token");
    localStorage.removeItem("followedMangas");
    store.commit("clear");

    router.push("/");
  }
}
</script>
