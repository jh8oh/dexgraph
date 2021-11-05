<template>
  <section id="stats">
    <h2>Stats</h2>
    <div id="stats-graphs">
      <div>
        <h3>Follow Status</h3>
        <PieChart :chartData="followStatusChartData" :options="chartOptions" />
      </div>
      <div>
        <h3>Manga Status</h3>
        <PieChart :chartData="mangaStatusChartData" :options="chartOptions" />
      </div>
      <div>
        <h3>Publication Demographic</h3>
        <PieChart :chartData="publicationDemographicChartData" :options="chartOptions" />
      </div>
      <div>
        <h3>Content Rating</h3>
        <PieChart :chartData="contentRatingChartData" :options="chartOptions" />
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
import { PieChart } from "vue-chart-3";

function toDisplayText(s: string | null): string {
  switch (s) {
    case null:
      return "None";
    case "re_reading":
      return "Rereading";
    default: {
      const toSpace = s.replace(/_/g, " ");
      return toSpace[0].toUpperCase() + toSpace.slice(1);
    }
  }
}

function toChartData(map: Map<string | null, number>) {
  return {
    labels: Array.from<string | null>(map.keys()).map((s) => toDisplayText(s)),
    datasets: [
      {
        data: Array.from<number>(map.values()),
        backgroundColor: colors(map.size),
      },
    ],
  };
}

@Options({
  components: {
    PieChart,
  },
  computed: {
    followStatusChartData() {
      return toChartData(this.followStatus);
    },
    mangaStatusChartData() {
      return toChartData(this.mangaStatus);
    },
    publicationDemographicChartData() {
      return toChartData(this.publicationDemographic);
    },
    contentRatingChartData() {
      return toChartData(this.contentRating);
    },
  },
})
export default class Stats extends Vue {
  // Manga Stats
  private followStatus = new Map<string | null, number>(staticFollowStatus.map((e) => [e, 0]));
  private mangaStatus = new Map<string | null, number>(staticMangaStatus.map((e) => [e, 0]));
  private publicationDemographic = new Map<string | null, number>(
    staticPublicationDemographic.map((e) => [e, 0])
  );
  private contentRating = new Map<string | null, number>(staticContentRating.map((e) => [e, 0]));
  private originalLanguages = new Map<string | null, number>();
  private genres = new Map<string | null, number>();
  private themes = new Map<string | null, number>();
  private formats = new Map<string | null, number>();

  // Chart options
  private chartOptions = { responsive: true };

  beforeMount(): void {
    this.setUpMangaStats();
  }

  private addToMap(map: Map<string | null, number>, key: string | null) {
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
