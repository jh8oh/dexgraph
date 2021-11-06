<template>
  <section id="stats">
    <h2>Stats</h2>
    <div id="stats-graphs">
      <div>
        <h3>Follow Status</h3>
        <PieChart :chartData="followStatusChartData" :options="pieChartOptions" />
      </div>
      <div>
        <h3>Manga Status</h3>
        <PieChart :chartData="mangaStatusChartData" :options="pieChartOptions" />
      </div>
      <div>
        <h3>Publication Demographic</h3>
        <PieChart :chartData="publicationDemographicChartData" :options="pieChartOptions" />
      </div>
      <div>
        <h3>Content Rating</h3>
        <PieChart :chartData="contentRatingChartData" :options="pieChartOptions" />
      </div>
      <div>
        <h3>Original Languages</h3>
        <PieChart
          v-if="originalLanguagesIsPie"
          :chartData="originalLanguagesChartData"
          :options="pieChartOptions"
        />
        <BarChart v-else :chartData="originalLanguagesChartData" :options="barChartOptions" />
      </div>
      <div>
        <h3>Genre</h3>
        <BarChart :chartData="genresChartData" :options="barChartOptions" />
      </div>
      <div>
        <h3>Theme</h3>
        <BarChart :chartData="themesChartData" :options="barChartOptions" />
      </div>
      <div>
        <h3>Format</h3>
        <BarChart :chartData="formatsChartData" :options="barChartOptions" />
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
import { PieChart, BarChart } from "vue-chart-3";

function toDisplayText(s: string | null): string {
  switch (s) {
    case null:
      return "None";
    case "re_reading":
      return "Rereading";
    case "ja":
      return "Japanese";
    case "ko":
      return "Korean";
    case "en":
      return "English";
    case "zh":
      return "Chinese";
    default: {
      const toSpace = s.replace(/_/g, " ");
      return toSpace[0].toUpperCase() + toSpace.slice(1);
    }
  }
}

function toChartData(map: Map<string | null, number>, isBar: boolean) {
  let newMap = map;
  if (isBar) {
    newMap = new Map([...map.entries()].sort((a, b) => b[1] - a[1]));
  }

  let size = newMap.size > 10 ? 10 : newMap.size;

  return {
    labels: Array.from<string | null>(newMap.keys())
      .slice(0, size)
      .map((s) => toDisplayText(s)),
    datasets: [
      {
        data: Array.from<number>(newMap.values()).slice(0, size),
        backgroundColor: colors(size),
      },
    ],
  };
}

@Options({
  components: {
    PieChart,
    BarChart,
  },
  computed: {
    followStatusChartData() {
      return toChartData(this.followStatus, false);
    },
    mangaStatusChartData() {
      return toChartData(this.mangaStatus, false);
    },
    publicationDemographicChartData() {
      return toChartData(this.publicationDemographic, false);
    },
    contentRatingChartData() {
      return toChartData(this.contentRating, false);
    },
    originalLanguagesIsPie() {
      return this.originalLanguages.size <= 6;
    },
    originalLanguagesChartData() {
      return toChartData(this.originalLanguages, this.originalLanguagesIsPie);
    },
    genresChartData() {
      return toChartData(this.genres, true);
    },
    themesChartData() {
      return toChartData(this.themes, true);
    },
    formatsChartData() {
      return toChartData(this.formats, true);
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
  private pieChartOptions = { responsive: true };
  private barChartOptions = { responsive: true, plugins: { legend: { display: false } } };

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
