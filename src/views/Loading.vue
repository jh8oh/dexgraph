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
import { Options, Vue } from "vue-class-component";
import { store } from "@/store";
import router from "@/router";
import { AxiosError, AxiosResponse } from "axios";
import { getUser, getMangaStatus, getManga, getMangaRelated } from "@/ts/network/calls";
import { ErrorResponse, StaffResponse, CoverResponse } from "@/ts/model/response";
import { handleErrorMessage } from "@/ts/util/errorMessage";
import { Staff, Cover, Manga } from "@/ts/model/data";

@Options({
  computed: {
    allComplete() {
      return this.usernameCompleted && this.mangaFollowsCompleted;
    },
  },
  watch: {
    allComplete(newValue: boolean) {
      if (newValue) {
        router.push("result");
      }
    },
  },
})
export default class Loading extends Vue {
  private total = 0;
  private progress = 0;
  private errorMessage = "";

  private session = store.state.token.session;

  private usernameCompleted = false;
  private mangaFollowsCompleted = false;

  mounted(): void {
    this.getUsername();
    this.getAllMangaFollows();
  }

  private getUsername() {
    getUser(this.session)
      .then((response) => {
        store.commit("setUsername", response.data.data.attributes.username);
        this.usernameCompleted = true;
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
              let authorIds = this.getRelationshipIds(followedManga, "author").filter(
                (id) => id != undefined
              );
              let artistIds = this.getRelationshipIds(followedManga, "artist").filter(
                (id) => id != undefined
              );
              let coverIds = this.getRelationshipIds(followedManga, "cover_art").filter(
                (id) => id != undefined
              );

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
                  let author = authors.find((a) => a.id === authorIds[index]);
                  let artist = artists.find((a) => a.id === artistIds[index]);
                  let cover = covers.find((c) => c.id === coverIds[index]);

                  store.commit("addManga", { manga, status, author, artist, cover });
                  this.progress++;

                  if (this.progress === this.total) {
                    this.mangaFollowsCompleted = true;
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
}
</script>
