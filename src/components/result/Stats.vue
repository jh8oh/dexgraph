<template>
  <section id="stats">
    <h2>Stats</h2>
    <div id="stats-graphs">
      <div>
        <h3>Follow Status</h3>
        <PieChart :chartData="followStatusChartData" :chartOptions="chartOptions" />
      </div>
      <div>
        <h3>Manga Status</h3>
      </div>
      <div>
        <h3>Publication Demographic</h3>
      </div>
      <div>
        <h3>Content Rating</h3>
      </div>
    </div>
  </section>
</template>

<script lang="ts">
import { Options, Vue } from "vue-class-component";
import { store } from "@/store";
import {
  staticContentRating,
  staticFollowStatus,
  staticMangaStatus,
  staticPublicationDemographic,
} from "@/ts/model/static";
import { colors } from "@/ts/util/chart";
import PieChart from "@/components/chart/PieChart.vue";

function toDisplayText(s: string): string {
  switch (s) {
    case "re_reading":
      return "Rereading";
    default: {
      const toSpace = s.replace(/_/g, " ");
      return toSpace[0].toUpperCase() + toSpace.slice(1);
    }
  }
}

@Options({
  components: {
    PieChart,
  },
  computed: {
    followStatusChartData() {
      return {
        labels: Array.from<string>(this.followStatus.keys()).map((s) => toDisplayText(s)),
        datasets: [
          {
            data: Array.from<number>(this.followStatus.values()),
            backgroundColor: colors(this.followStatus.size),
          },
        ],
      };
    },
  },
})
export default class Stats extends Vue {
  // Manga Stats
  private followStatus = new Map<string, number>(staticFollowStatus.map((e) => [e, 0]));
  private mangaStatus = new Map<string, number>(staticMangaStatus.map((e) => [e, 0]));
  private publicationDemographic = new Map<string, number>(
    staticPublicationDemographic.map((e) => [e, 0])
  );
  private contentRating = new Map<string, number>(staticContentRating.map((e) => [e, 0]));
  private originalLanguages = new Map<string, number>();
  private genres = new Map<string, number>();
  private themes = new Map<string, number>();
  private formats = new Map<string, number>();

  // Chart options
  private chartOptions = { responsive: true };

  beforeMount(): void {
    this.setUpMangaStats();
  }

  private addToMap(map: Map<string, number>, key: string) {
    let value = map.get(key);
    map.set(key, value != undefined ? value + 1 : 1);
  }

  private setUpMangaStats(): void {
    const followedMangas = store.state.followedMangas;
    for (const mangaFull of followedMangas) {
      // Follow Status
      this.addToMap(this.followStatus, mangaFull.status);

      // Manga Status
      this.addToMap(this.mangaStatus, mangaFull.manga.attributes.status);

      // Publication Demographic
      this.addToMap(this.publicationDemographic, mangaFull.manga.attributes.publicationDemographic);

      // Content Rating
      this.addToMap(this.contentRating, mangaFull.manga.attributes.contentRating);

      // Original Language
      this.addToMap(this.originalLanguages, mangaFull.manga.attributes.originalLanguage);

      // Genre/Theme/Format
      for (const tag of mangaFull.manga.attributes.tags) {
        switch (tag.attributes.group) {
          case "genre":
            this.addToMap(this.genres, tag.attributes.name.en);
            break;
          case "theme":
            this.addToMap(this.themes, tag.attributes.name.en);
            break;
          case "format":
            this.addToMap(this.formats, tag.attributes.name.en);
            break;
        }
      }
    }
  }
}
</script>
