<template>
  <div id="loading" class="page">
    <div id="loading-content">
      <img src="../assets/spinner-light.svg" />
      <p>{{ description }}</p>
      <progress :value="progress" :max="total" />
      <p id="error">{{ errorMessage }}</p>
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
  private progress = 0;
  private description = "";
  private errorMessage = "";

  mounted(): void {
    this.getAllMangaFollows();
  }

  getRelationshipIds(followedManga: Manga[], type: string): (string | undefined)[] {
    return followedManga.map((manga) => {
      return manga.relationships.find((relationship) => relationship.type === type)?.id;
    });
  }

  private getAllMangaFollows(): void {
    this.description = "Grabbing your followed manga";

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
                  this.progress++;
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
}
</script>
