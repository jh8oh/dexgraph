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
      <ul></ul>
      <div>
        <h3>Artists</h3>
        <BarChart
          :chartData="artistsChartData"
          :options="barChartOptions"
          :width="barChartWidth"
          :height="BarChartHeight"
        />
      </div>
      <ul></ul>
    </div>
  </section>
</template>

<script lang="ts">
import { Options, Vue } from "vue-class-component";
import { store } from "@/store";
import { addToMap, sortMap } from "@/ts/util";
import { colors } from "@/ts/util/chart";
import { BarChart } from "vue-chart-3";

function toChartData(map: Map<string, number>) {
  let size = map.size > 10 ? 10 : map.size;

  return {
    labels: Array.from<string>(map.keys()).slice(0, size),
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

    this.authors = sortMap(this.authors);
    this.artists = sortMap(this.artists);
  }
}
</script>
