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
import {
  staticContentRating,
  staticFollowStatus,
  staticMangaStatus,
  staticPublicationDemographic,
} from "@/ts/model/static";

export default class Loading extends Vue {
  private total = 0;
  private get_progress = 0;
  private anal_progress = 0;
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
    const session = store.state.token.session;

    // Grab followed manga statuses
    getMangaStatus(session)
      .then((response: AxiosResponse<MangaStatusResponse>) => {
        let statuses = response.data.statuses;
        let statusesEntries = Object.entries(statuses) as [string, string][];

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

  private addToMap(map: Map<string, number>, value: string | undefined) {
    if (value != undefined) {
      if (map.has(value)) {
        let number = map.get(value);
        map.set(value, number ? number + 1 : 1);
      } else {
        map.set(value, 1);
      }
    }
  }

  private mapToArray<K, T>(map: Map<K, T>): [K, T][] {
    const array: [K, T][] = [];
    map.forEach((value: T, key: K) => {
      array.push([key, value]);
    });
    return array;
  }

  private sortManga(): void {
    let followStatusCount = new Map<string, number>(staticFollowStatus.map((v) => [v, 0]));
    let mangaStatusCount = new Map<string, number>(staticMangaStatus.map((v) => [v, 0]));
    let demographicCount = new Map<string, number>(staticPublicationDemographic.map((v) => [v, 0]));
    let contentRatingCount = new Map<string, number>(staticContentRating.map((v) => [v, 0]));
    let originalLanguageCount = new Map<string, number>();
    let genreCount = new Map<string, number>();
    let themeCount = new Map<string, number>();
    let formatCount = new Map<string, number>();
    let authorCount = new Map<string, number>();
    let artistCount = new Map<string, number>();

    const followedMangas = store.state.followedMangas;
    for (const mangaFull of followedMangas) {
      this.addToMap(followStatusCount, mangaFull.status); // Status
      this.addToMap(mangaStatusCount, mangaFull.manga.attributes.status); // Manga Status
      this.addToMap(demographicCount, mangaFull.manga.attributes.publicationDemographic); // Publication Demographic
      this.addToMap(contentRatingCount, mangaFull.manga.attributes.contentRating); // Content Rating
      this.addToMap(originalLanguageCount, mangaFull.manga.attributes.originalLanguage); // Original Language

      // Genre/Theme/Format
      for (const tag of mangaFull.manga.attributes.tags) {
        switch (tag.attributes.group) {
          case "genre":
            this.addToMap(genreCount, tag.attributes.name.en);
            break;
          case "theme":
            this.addToMap(themeCount, tag.attributes.name.en);
            break;
          case "format":
            this.addToMap(formatCount, tag.attributes.name.en);
            break;
        }
      }

      // Author
      this.addToMap(authorCount, mangaFull.author?.id);
      this.addToMap(artistCount, mangaFull.artist?.id);

      this.anal_progress++;
    }

    // Save values
    const commitCount = (type: string, payloads: ([string, number] | [AuthorArtist, number])[]) => {
      payloads.forEach((p) => {
        store.commit(type, p);
      });
    };

    commitCount("addFollowStatusCount", this.mapToArray(followStatusCount));
    commitCount("addMangaStatusCount", this.mapToArray(mangaStatusCount));
    commitCount("addDemographicCount", this.mapToArray(demographicCount));
    commitCount("addContentRatingCount", this.mapToArray(contentRatingCount));
    commitCount("addOriginalLanguageCount", this.mapToArray(originalLanguageCount));
    commitCount("addGenreCount", this.mapToArray(genreCount));
    commitCount("addThemeCount", this.mapToArray(themeCount));
    commitCount("addFormatCount", this.mapToArray(formatCount));
    commitCount("addAuthorCount", this.mapToArray(authorCount));
    commitCount("addArtistCount", this.mapToArray(artistCount));
  }
}
</script>
