<template>
  <div id="loading" class="page">
    <div id="loading-content">
      <img src="../assets/spinner-light.svg" />
      <p id="error">{{ errorMessage }}</p>
      <div class="table">
        <div class="table-row">
          <span>Getting your followed manga</span>
          <progress :value="get_progress" :max="total" />
        </div>
        <div class="table-row">
          <span>Analysing your manga</span>
          <progress :value="anal_progress" :max="total" />
        </div>
      </div>
    </div>
  </div>
</template>

<script lang="ts">
import { Vue } from "vue-class-component";
import { store } from "@/store";
import { AxiosError, AxiosResponse } from "axios";
import { getMangaStatus, getManga, getMangaRelated } from "@/ts/network/calls";
import {
  ErrorResponse,
  MangaStatusResponse,
  MangaResponse,
  AuthorArtistResponse,
  CoverResponse,
} from "@/ts/model/response";
import { handleErrorMessage } from "@/ts/util/errorMessage";
import { AuthorArtist, Cover, Manga } from "@/ts/model/data";

export default class Loading extends Vue {
  private total = 0;
  private get_progress = 0;
  private anal_progress = 0;
  private errorMessage = "";

  private followStatus = new Map<string, number>([
    ["reading", 0],
    ["re_reading", 0],
    ["completed", 0],
    ["on_hold", 0],
    ["dropped", 0],
    ["plan_to_read", 0],
  ]);
  private mangaStatus = new Map<string, number>([
    ["ongoing", 0],
    ["completed", 0],
    ["hiatus", 0],
    ["cancelled", 0],
  ]);
  private demographic = new Map<string, number>([
    ["shounen", 0],
    ["shoujo", 0],
    ["josei", 0],
    ["seinen", 0],
  ]);
  private contentRating = new Map<string, number>([
    ["safe", 0],
    ["suggestive", 0],
    ["erotica", 0],
    ["pornographic", 0],
  ]);
  private originalLanguage = new Map<string, number>();
  private genre = new Map<string, number>();
  private theme = new Map<string, number>();
  private format = new Map<string, number>();
  private author = new Map<AuthorArtist, number>();
  private artist = new Map<AuthorArtist, number>();

  mounted(): void {
    this.getAllMangaFollows();
  }

  getRelationshipIds(followedManga: Manga[], type: string): (string | undefined)[] {
    return followedManga.map((manga) => {
      return manga.relationships.find((relationship) => relationship.type === type)?.id;
    });
  }

  private getAllMangaFollows(): void {
    const session = store.state.token.session;

    // Grab followed manga statuses
    getMangaStatus(session)
      .then((response: AxiosResponse<MangaStatusResponse>) => {
        let statuses = response.data.statuses;
        let statusesEntries = Object.entries(statuses);

        this.total = statusesEntries.length;

        for (let i = 0; i < this.total; i += 100) {
          let mangaIds = statusesEntries.slice(i, i + 100).map((status) => {
            return status[0];
          });

          getManga(mangaIds)
            .then((response: AxiosResponse<MangaResponse>) => {
              let followedManga = response.data.data;
              let authorIds = this.getRelationshipIds(followedManga, "author");
              let artistIds = this.getRelationshipIds(followedManga, "artist");
              let coverIds = this.getRelationshipIds(followedManga, "cover_art");

              getMangaRelated(authorIds, artistIds, coverIds).then((responses) => {
                let authors: AuthorArtist[];
                let artists: AuthorArtist[];
                let covers: Cover[];

                // Author
                if (responses[0].status === "fulfilled") {
                  authors = (
                    responses[0] as PromiseFulfilledResult<AxiosResponse<AuthorArtistResponse>>
                  ).value.data.data;
                }

                // Artist
                if (responses[1].status === "fulfilled") {
                  artists = (
                    responses[1] as PromiseFulfilledResult<AxiosResponse<AuthorArtistResponse>>
                  ).value.data.data;
                }

                // Cover
                if (responses[2].status === "fulfilled") {
                  covers = (responses[2] as PromiseFulfilledResult<AxiosResponse<CoverResponse>>)
                    .value.data.data;
                }

                followedManga.forEach((manga, index) => {
                  let status = statusesEntries[index][1];
                  let author = authors[index];
                  let artist = artists[index];
                  let cover = covers[index];

                  store.commit("addManga", { manga, status, author, artist, cover });
                  this.get_progress++;

                  if (this.get_progress === this.total) {
                    this.sortManga();
                  }
                });
              });
            })
            .catch((error: AxiosError<ErrorResponse>) => {
              this.errorMessage = handleErrorMessage(error);
            });
        }
      })
      .catch((error: AxiosError<ErrorResponse>) => {
        this.errorMessage = handleErrorMessage(error);
      });
  }

  private addToMap<K>(map: Map<K, number>, value: K) {
    if (map.has(value)) {
      let number = map.get(value);
      map.set(value, number ? number + 1 : 1);
    } else {
      map.set(value, 1);
    }
  }

  private sortManga(): void {
    const followedMangas = store.state.followedMangas;
    for (const mangaFull of followedMangas) {
      this.addToMap(this.followStatus, mangaFull.status); // Status
      this.addToMap(this.mangaStatus, mangaFull.manga.attributes.status); // Manga Status
      this.addToMap(this.demographic, mangaFull.manga.attributes.publicationDemographic); // Publication Demographic
      this.addToMap(this.contentRating, mangaFull.manga.attributes.contentRating); // Content Rating
      this.addToMap(this.originalLanguage, mangaFull.manga.attributes.originalLanguage); // Original Language

      // Genre/Theme/Format
      for (const tag of mangaFull.manga.attributes.tags) {
        switch (tag.attributes.group) {
          case "genre":
            this.addToMap(this.genre, tag.attributes.name.en);
            break;
          case "theme":
            this.addToMap(this.theme, tag.attributes.name.en);
            break;
          case "format":
            this.addToMap(this.format, tag.attributes.name.en);
            break;
        }
      }

      // Author
      this.addToMap(this.author, mangaFull.author);
      this.addToMap(this.artist, mangaFull.artist);

      this.anal_progress++;
    }
  }
}
</script>
