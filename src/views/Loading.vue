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
import { AuthorArtist, Cover } from "@/ts/model/data";

export default class Loading extends Vue {
  private total = 0;
  private progress = 0;
  private description = "";
  private errorMessage = "";

  private authorArtistIdMap = new Map<string, AuthorArtist>();

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
                let authorId = manga.relationships.find(
                  (relationship) => relationship.type === "author"
                )?.id;
                let artistId = manga.relationships.find(
                  (relationship) => relationship.type === "artist"
                )?.id;
                const coverId = manga.relationships.find(
                  (relationship) => relationship.type === "cover_art"
                )?.id;

                let status: string | undefined = undefined;
                let author: AuthorArtist | undefined = undefined;
                let artist: AuthorArtist | undefined = undefined;
                let sameArtist = false;
                let cover: Cover | undefined = undefined;

                // Check if author/artist has been searched before
                if (authorId != undefined) {
                  if (this.authorArtistIdMap.has(authorId)) {
                    author = this.authorArtistIdMap.get(authorId);
                    authorId = undefined;
                  }
                }
                if (artistId != undefined) {
                  if (this.authorArtistIdMap.has(artistId)) {
                    artist = this.authorArtistIdMap.get(artistId);
                    artistId = undefined;
                  }
                }

                // Check if author/artist are the same
                if (authorId === artistId) {
                  artistId = undefined;
                  sameArtist = true;
                }

                getMangaRelated(session, mangaId, authorId, artistId, coverId).then((responses) => {
                  // Manga status
                  if (responses[0].status === "fulfilled") {
                    status = (
                      responses[0] as PromiseFulfilledResult<AxiosResponse<MangaStatusResponse>>
                    ).value.data.status;
                  }

                  let index = 1;

                  // Author
                  if (authorId != undefined) {
                    if (responses[index].status === "fulfilled") {
                      author = (
                        responses[index] as PromiseFulfilledResult<
                          AxiosResponse<AuthorArtistResponse>
                        >
                      ).value.data.data;
                      this.authorArtistIdMap.set(authorId, author);
                    }
                    index++;
                  }

                  // Artist
                  if (artistId != undefined) {
                    if (responses[index].status === "fulfilled") {
                      artist = (
                        responses[index] as PromiseFulfilledResult<
                          AxiosResponse<AuthorArtistResponse>
                        >
                      ).value.data.data;
                      this.authorArtistIdMap.set(artistId, artist);
                    }
                    index++;
                  }
                  if (sameArtist) {
                    artist = author;
                  }

                  // Cover
                  if (coverId != undefined) {
                    if (responses[index].status === "fulfilled") {
                      cover = (
                        responses[index] as PromiseFulfilledResult<AxiosResponse<CoverResponse>>
                      ).value.data.data;
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
