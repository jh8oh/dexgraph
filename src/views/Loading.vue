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
import { getMangaFollows, getMangaRelated } from "@/ts/network/calls";
import {
  MangaFollowResponse,
  ErrorResponse,
  MangaStatusResponse,
  AuthorArtistResponse,
  CoverResponse,
} from "@/ts/model/response";
import { handleErrorMessage } from "@/ts/util/errorMessage";
import { AuthorArtist, Cover } from "@/ts/model/manga";

export default class Loading extends Vue {
  private total = 0;
  private progress = 0;
  private description = "";
  private errorMessage = "";

  mounted(): void {
    this.getAllMangaFollows();
  }

  private getAllMangaFollows(): void {
    this.description = "Grabbing your followed manga";

    const session = store.state.token.session;
    let body = { limit: 1, offset: 0 };
    getMangaFollows(session, body)
      .then((response: AxiosResponse<MangaFollowResponse>) => {
        this.total = response.data.total; // Get total

        for (let offset = 0; offset < this.total; offset += 100) {
          body = { limit: 100, offset: offset };
          getMangaFollows(session, body)
            .then((response: AxiosResponse<MangaFollowResponse>) => {
              let followedManga = response.data.data;
              followedManga.forEach((manga) => {
                const mangaId = manga.id;
                const authorId = manga.relationships.find(
                  (relationship) => relationship.type === "author"
                )?.id;
                const artistId = manga.relationships.find(
                  (relationship) => relationship.type === "artist"
                )?.id;
                const coverId = manga.relationships.find(
                  (relationship) => relationship.type === "cover_art"
                )?.id;
                getMangaRelated(session, mangaId, authorId, artistId, coverId).then((responses) => {
                  let status: string | null = null;
                  let author: AuthorArtist | null = null;
                  let artist: AuthorArtist | null = null;
                  let cover: Cover | null = null;

                  // Manga status
                  if (responses[0].status === "fulfilled") {
                    status = (
                      responses[0] as PromiseFulfilledResult<AxiosResponse<MangaStatusResponse>>
                    ).value.data.status;
                  }

                  // Author
                  if (authorId != null) {
                    if (responses[1].status === "fulfilled") {
                      author = (
                        responses[1] as PromiseFulfilledResult<AxiosResponse<AuthorArtistResponse>>
                      ).value.data.data;
                    }
                  }

                  // Artist
                  if (artistId != null) {
                    if (responses[2].status === "fulfilled") {
                      artist = (
                        responses[2] as PromiseFulfilledResult<AxiosResponse<AuthorArtistResponse>>
                      ).value.data.data;
                    }
                  }

                  // Cover
                  if (coverId != null) {
                    if (responses[3].status === "fulfilled") {
                      cover = (responses[3] as PromiseFulfilledResult<AxiosResponse<CoverResponse>>)
                        .value.data.data;
                    }
                  }

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
