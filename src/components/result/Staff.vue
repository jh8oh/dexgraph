<template>
  <section id="staff">
    <h2>Staff</h2>
    <div id="staff-content">
      <div>
        <h3>Authors</h3>
        <BarChart
          :chartData="authorsChartData"
          :options="barChartOptions"
          :width="barChartWidth"
          :height="BarChartHeight"
        />
      </div>
      <div>
        <h3>Artists</h3>
        <BarChart
          :chartData="artistsChartData"
          :options="barChartOptions"
          :width="barChartWidth"
          :height="BarChartHeight"
        />
      </div>
    </div>
  </section>
</template>

<script lang="ts">
import { Options, Vue } from "vue-class-component";
import { store } from "@/store";
import { addToMap } from "@/ts/util";
import { colors } from "@/ts/util/chart";
import { BarChart } from "vue-chart-3";

function toDisplayText(s: string): string {
  const toSpace = s.replace(/_/g, " ");
  return toSpace[0].toUpperCase() + toSpace.slice(1);
}

function toChartData(map: Map<string, number>) {
  const newMap = new Map([...map.entries()].sort((a, b) => b[1] - a[1]));

  let size = newMap.size > 10 ? 10 : newMap.size;

  return {
    labels: Array.from<string>(newMap.keys())
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
    BarChart,
  },
  computed: {
    authorsChartData() {
      return toChartData(this.authors);
    },
    artistsChartData() {
      return toChartData(this.artists);
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
export default class Staff extends Vue {
  private authors = new Map<string, number>();
  private artists = new Map<string, number>();

  private isLessThan600 = false;

  created(): void {
    window.addEventListener("resize", this.handleResize);
    this.handleResize();
  }

  destroyed(): void {
    window.removeEventListener("resize", this.handleResize);
  }

  beforeMount(): void {
    this.setUpMangaStaff();
  }

  private handleResize() {
    if (window.innerWidth > 600) {
      this.isLessThan600 = false;
    } else {
      this.isLessThan600 = true;
    }
  }

  private setUpMangaStaff() {
    const followedMangas = store.state.followedMangas;
    for (const mangaFull of followedMangas) {
      addToMap(this.authors, mangaFull.author.attributes.name);
      addToMap(this.artists, mangaFull.artist.attributes.name);
    }
  }
}
</script>
