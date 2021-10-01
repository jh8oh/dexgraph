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
import { getMangaFollows } from "@/ts/network/calls";
import { MangaFollowResponse, ErrorResponse } from "@/ts/model/response";
import { handleErrorMessage } from "@/ts/util/errorMessage";

export default class Loading extends Vue {
  private total = 0;
  private progress = 1;
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
        store.commit("addManga", response.data.data[0]); // Add first manga
        this.total = response.data.total; // Get total

        for (let offset = 1; offset < this.total; offset += 100) {
          body = { limit: 100, offset: offset };
          getMangaFollows(session, body)
            .then((response: AxiosResponse<MangaFollowResponse>) => {
              let followedManga = response.data.data;
              followedManga.forEach((manga) => {
                this.progress++;
                store.commit("addManga", manga);
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
