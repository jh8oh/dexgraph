<template>
  <div id="result" class="page">
    <div id="result-content">
      <h1>{{ username }}</h1>
      <div id="result-component">
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
import Overview from "@/components/Overview.vue";
import MangaList from "@/components/MangaList.vue";
import Stats from "@/components/Stats.vue";
import Staff from "@/components/Staff.vue";
import {
  staticContentRating,
  staticFollowStatus,
  staticMangaStatus,
  staticPublicationDemographic,
} from "@/ts/model/static";

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

  // Manga Stats
  private followStatus = new Set<string>(staticFollowStatus);
  private mangaStatus = new Set<string>(staticMangaStatus);
  private publicationDemographic = new Set<string>(staticPublicationDemographic);
  private contentRating = new Set<string>(staticContentRating);
  private originalLanguages = new Set<string>();
  private genres = new Set<string>();
  private themes = new Set<string>();
  private formats = new Set<string>();
  private authors = new Set<string>();
  private artists = new Set<string>();

  currentTab = "Overview";
  tabs = ["Overview", "Manga List", "Stats", "Staff"];

  mounted(): void {
    this.username = store.state.username;

    this.updateLocalStorageManga();
    this.sortManga();
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

  private sortManga(): void {
    const followedMangas = store.state.followedMangas;
    for (const mangaFull of followedMangas) {
      this.originalLanguages.add(mangaFull.manga.attributes.originalLanguage); // Original Language

      // Genre/Theme/Format
      for (const tag of mangaFull.manga.attributes.tags) {
        switch (tag.attributes.group) {
          case "genre":
            this.genres.add(tag.attributes.name.en);
            break;
          case "theme":
            this.themes.add(tag.attributes.name.en);
            break;
          case "format":
            this.formats.add(tag.attributes.name.en);
            break;
        }
      }

      // Author
      this.authors.add(mangaFull.author?.id);
      this.artists.add(mangaFull.artist?.id);
    }
  }
}
</script>
