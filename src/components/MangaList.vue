<template>
  <section>
    <h2>Manga List</h2>
    <ul>
      <li
        v-for="mangaFull in mangaList"
        :key="mangaFull.manga.id"
        @click="goToUrl(mangaFull.manga.id)"
      >
        <img
          :src="`https://uploads.mangadex.org/covers/${mangaFull.manga.id}/${mangaFull.cover.attributes.fileName}.256.jpg`"
        />
        <h3>{{ mangaFull.manga.attributes.title.en }}</h3>
        <p v-html="markdownToHtml(mangaFull.manga.attributes.description.en)" />
      </li>
    </ul>
  </section>
</template>

<script lang="ts">
import { store } from "@/store";
import { MangaFull } from "@/ts/model/data";
import { Vue } from "vue-class-component";
import marked from "marked";

export default class MangaList extends Vue {
  private mangaList: MangaFull[] | null = null;

  mounted(): void {
    this.mangaList = store.state.followedMangas;
  }

  private markdownToHtml(markdown: string): string {
    return marked(markdown);
  }

  private goToUrl(mangaId: string): void {
    window.open("https://mangadex.org/title/" + mangaId, "_blank");
  }
}
</script>
