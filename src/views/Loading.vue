<template>
  <div id="loading" class="page">
    <div id="loading-content">
      <img src="../assets/spinner-light.svg" />
      <p>Grabbing your followed manga</p>
      <progress :value="progress" :max="total" />
      <p id="error">{{ errorMessage }}</p>
    </div>
  </div>
</template>

<script lang="ts">
import { Vue } from "vue-class-component";
import { store } from "@/store";
import { AxiosError, AxiosResponse } from "axios";
import { getUser, getMangaStatus, getManga, getMangaRelated } from "@/ts/network/calls";
import { ErrorResponse, StaffResponse, CoverResponse } from "@/ts/model/response";
import { handleErrorMessage } from "@/ts/util/errorMessage";
import { Staff, Cover, Manga } from "@/ts/model/data";

export default class Loading extends Vue {
  private total = 0;
  private progress = 0;
  private errorMessage = "";

  private session = store.state.token.session;

  mounted(): void {
    this.getUsername();
    this.getAllMangaFollows();
  }

  private getUsername() {
    getUser(this.session)
      .then((response) => {
        store.commit("setUsername", response.data.data.attributes.username);
      })
      .catch((error: AxiosError<ErrorResponse>) => {
        this.errorMessage = handleErrorMessage(error);
      });
  }

  private getRelationshipIds(followedManga: Manga[], type: string): (string | undefined)[] {
    return followedManga.map((manga) => {
      return manga.relationships.find((relationship) => relationship.type === type)?.id;
    });
  }

  private getAllMangaFollows(): void {
    // Grab followed manga statuses
    getMangaStatus(this.session)
      .then((response) => {
        let statuses = response.data.statuses;
        let statusesEntries = Object.entries(statuses) as [string, string][];

        this.total = statusesEntries.length;

        for (let i = 0; i < this.total; i += 100) {
          let mangaIds = statusesEntries.slice(i, i + 100).map((status) => {
            return status[0];
          });

          getManga(mangaIds)
            .then((response) => {
              let followedManga = response.data.data;
              let authorIds = this.getRelationshipIds(followedManga, "author");
              let artistIds = this.getRelationshipIds(followedManga, "artist");
              let coverIds = this.getRelationshipIds(followedManga, "cover_art");

              getMangaRelated(authorIds, artistIds, coverIds).then((responses) => {
                let authors: Staff[];
                let artists: Staff[];
                let covers: Cover[];

                // Author
                if (responses[0].status === "fulfilled") {
                  authors = (responses[0] as PromiseFulfilledResult<AxiosResponse<StaffResponse>>)
                    .value.data.data;
                }

                // Artist
                if (responses[1].status === "fulfilled") {
                  artists = (responses[1] as PromiseFulfilledResult<AxiosResponse<StaffResponse>>)
                    .value.data.data;
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

                  if (this.progress === this.total) {
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

  private sortManga(): void {
    let originalLanguages = new Set<string>();
    let genres = new Set<string>();
    let themes = new Set<string>();
    let formats = new Set<string>();
    let authors = new Set<string>();
    let artists = new Set<string>();

    const followedMangas = store.state.followedMangas;
    for (const mangaFull of followedMangas) {
      originalLanguages.add(mangaFull.manga.attributes.originalLanguage); // Original Language

      // Genre/Theme/Format
      for (const tag of mangaFull.manga.attributes.tags) {
        switch (tag.attributes.group) {
          case "genre":
            genres.add(tag.attributes.name.en);
            break;
          case "theme":
            themes.add(tag.attributes.name.en);
            break;
          case "format":
            formats.add(tag.attributes.name.en);
            break;
        }
      }

      // Author
      authors.add(mangaFull.author?.id);
      artists.add(mangaFull.artist?.id);
    }

    // Save values
    const commits = (type: string, payloads: Set<string>) => {
      payloads.forEach((p) => {
        store.commit(type, p);
      });
    };

    commits("addOriginalLanguage", originalLanguages);
    commits("addGenre", genres);
    commits("addTheme", themes);
    commits("addFormat", formats);
    commits("addAuthor", authors);
    commits("addArtist", artists);
  }
}
</script>
