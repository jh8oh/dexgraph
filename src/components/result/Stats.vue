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
        <BarChart
          v-else
          :chartData="originalLanguagesChartData"
          :options="barChartOptions"
          :width="barChartWidth"
          :height="BarChartHeight"
        />
      </div>
      <div>
        <h3>Genres</h3>
        <BarChart
          :chartData="genresChartData"
          :options="barChartOptions"
          :width="barChartWidth"
          :height="BarChartHeight"
        />
        <button
          class="stat-change"
          @click="genreMaxSize = genreMaxSize > 10 ? genreMaxSize - 5 : 10"
        >
          Remove
        </button>
        <button
          class="stat-change"
          @click="genreMaxSize = genreMaxSize < 20 ? genreMaxSize + 5 : 20"
        >
          Add
        </button>
      </div>
      <div>
        <h3>Themes</h3>
        <BarChart
          :chartData="themesChartData"
          :options="barChartOptions"
          :width="barChartWidth"
          :height="BarChartHeight"
        />
        <button
          class="stat-change"
          @click="themeMaxSize = themeMaxSize > 10 ? themeMaxSize - 5 : 10"
        >
          Remove
        </button>
        <button
          class="stat-change"
          @click="themeMaxSize = themeMaxSize < 20 ? themeMaxSize + 5 : 20"
        >
          Add
        </button>
      </div>
      <div>
        <h3>Formats</h3>
        <BarChart
          :chartData="formatsChartData"
          :options="barChartOptions"
          :width="barChartWidth"
          :height="BarChartHeight"
        />
        <button
          class="stat-change"
          @click="formatMaxSize = formatMaxSize > 10 ? formatMaxSize - 5 : 10"
        >
          Remove
        </button>
        <button
          class="stat-change"
          @click="formatMaxSize = formatMaxSize < 20 ? formatMaxSize + 5 : 20"
        >
          Add
        </button>
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
import { addToMap, sortMap } from "@/ts/util";
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

function toChartData(map: Map<string | null, number>, maxSize = 10) {
  let size = map.size > maxSize ? maxSize : map.size;

  return {
    labels: Array.from<string | null>(map.keys())
      .slice(0, size)
      .map((s) => toDisplayText(s)),
    datasets: [
      {
        data: Array.from<number>(map.values()).slice(0, size),
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
    originalLanguagesIsPie() {
      return this.originalLanguages.size <= 6;
    },
    originalLanguagesChartData() {
      return toChartData(this.originalLanguages);
    },
    genresChartData() {
      return toChartData(this.genres, this.genreMaxSize);
    },
    themesChartData() {
      return toChartData(this.themes, this.themeMaxSize);
    },
    formatsChartData() {
      return toChartData(this.formats, this.formatMaxSize);
    },
    barChartWidth() {
      return this.isLessThan600 ? 500 : 800;
    },
    BarChartHeight() {
      return this.isLessThan600 ? 500 : 400;
    },
    barChartOptions() {
      if (this.isLessThan600) {
        return {
          responsive: true,
          indexAxis: "y",
          plugins: { legend: { display: false } },
        };
      } else {
        return {
          responsive: true,
          plugins: { legend: { display: false } },
        };
      }
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
  private genreMaxSize = 10;
  private themeMaxSize = 10;
  private formatMaxSize = 10;
  private pieChartOptions = { responsive: true };
  private isLessThan600 = false;

  created(): void {
    window.addEventListener("resize", this.handleResize);
    this.handleResize();
  }

  destroyed(): void {
    window.removeEventListener("resize", this.handleResize);
  }

  beforeMount(): void {
    this.setUpMangaStats();
  }

  private handleResize() {
    if (window.innerWidth > 600) {
      this.isLessThan600 = false;
    } else {
      this.isLessThan600 = true;
    }
  }

  private addToMap(map: Map<string | null, number>, key: string | null) {
    let value = map.get(key);
    map.set(key, value != undefined ? value + 1 : 1);
  }

  private setUpMangaStats(): void {
    const followedMangas = store.state.followedMangas;
    for (const mangaFull of followedMangas) {
      // Follow Status
      addToMap(this.followStatus, mangaFull.status);

      // Manga Status
      addToMap(this.mangaStatus, mangaFull.manga.attributes.status);

      // Publication Demographic
      addToMap(this.publicationDemographic, mangaFull.manga.attributes.publicationDemographic);

      // Content Rating
      addToMap(this.contentRating, mangaFull.manga.attributes.contentRating);

      // Original Language
      addToMap(this.originalLanguages, mangaFull.manga.attributes.originalLanguage);

      // Genre/Theme/Format
      for (const tag of mangaFull.manga.attributes.tags) {
        switch (tag.attributes.group) {
          case "genre":
            addToMap(this.genres, tag.attributes.name.en);
            break;
          case "theme":
            addToMap(this.themes, tag.attributes.name.en);
            break;
          case "format":
            addToMap(this.formats, tag.attributes.name.en);
            break;
        }
      }
    }

    this.originalLanguages = sortMap(this.originalLanguages);
    this.genres = sortMap(this.genres);
    this.themes = sortMap(this.themes);
    this.formats = sortMap(this.formats);
  }
}
</script>
