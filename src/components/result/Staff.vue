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
      <div class="staff-list">
        <transition-group name="list" tag="ul">
          <li v-for="(author, index) in authorList" :key="author[0]">
            <span class="index">{{ index + 1 }}</span>
            <a :href="'https://mangadex.org/author/' + getStaffLink(author[0])">{{ author[0] }}</a>
            <span class="staff-count">{{ author[1] }}</span>
          </li>
        </transition-group>
        <button @click="this.authorListSize = this.authorListSize + 10">More</button>
        <button
          class="less"
          v-if="this.authorListSize > 10"
          @click="this.authorListSize = this.authorListSize - 10"
        >
          Less
        </button>
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
      <div class="staff-list">
        <transition-group name="list" tag="ul">
          <li v-for="(artist, index) in artistList" :key="artist[0]">
            <span class="index">{{ index + 1 }}</span>
            <a :href="'https://mangadex.org/author/' + getStaffLink(artist[0])">{{ artist[0] }}</a>
            <span class="staff-count">{{ artist[1] }}</span>
          </li>
        </transition-group>
        <button @click="this.artistListSize = this.artistListSize + 10">More</button>
        <button
          class="less"
          v-if="this.artistListSize > 10"
          @click="this.artistListSize = this.artistListSize - 10"
        >
          Less
        </button>
      </div>
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
    authorList() {
      return Array.from(this.authors.entries()).splice(0, this.authorListSize);
    },
    artistList() {
      return Array.from(this.artists.entries()).splice(0, this.artistListSize);
    },
  },
})
export default class Staff extends Vue {
  private followedMangas = store.state.followedMangas;
  private authors = new Map<string, number>();
  private artists = new Map<string, number>();

  private isLessThan600 = false;

  private authorListSize = 10;
  private artistListSize = 10;

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
    for (const mangaFull of this.followedMangas) {
      addToMap(this.authors, mangaFull.author.attributes.name);
      addToMap(this.artists, mangaFull.artist.attributes.name);
    }

    this.authors = sortMap(this.authors);
    this.artists = sortMap(this.artists);
  }

  private getStaffLink(name: string) {
    const search = this.followedMangas.find(
      (mangaFull) =>
        mangaFull.author.attributes.name == name || mangaFull.artist.attributes.name == name
    );

    return search?.author.attributes.name == name ? search?.author.id : search?.artist.id;
  }
}
</script>
