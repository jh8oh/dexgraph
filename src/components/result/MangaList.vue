<template>
  <section id="manga-list">
    <h2>Manga List ({{ mangaList?.length }})</h2>
    <ul>
      <li v-for="mangaFull in mangaList" :key="mangaFull.manga.id">
        <figure @click="goToUrl(mangaFull.manga.id)">
          <img
            :src="`https://uploads.mangadex.org/covers/${mangaFull.manga.id}/${mangaFull.cover.attributes.fileName}.256.jpg`"
          />
          <figcaption>{{ mangaFull.manga.attributes.title.en }}</figcaption>
        </figure>
      </li>
    </ul>
  </section>
</template>

<script lang="ts">
import { Vue } from "vue-class-component";
import { store } from "@/store";
import { MangaFull } from "@/ts/model/data";

export default class MangaList extends Vue {
  private mangaList: MangaFull[] | null = null;

  mounted(): void {
    this.mangaList = store.state.followedMangas;
  }

  private goToUrl(mangaId: string): void {
    window.open("https://mangadex.org/title/" + mangaId, "_blank");
  }
}
</script>
