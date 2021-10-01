<template>
  <div id="loading" class="page"></div>
</template>

<script lang="ts">
import { Options, Vue } from "vue-class-component";
import { store } from "@/store";
import { AxiosError, AxiosResponse } from "axios";
import { getMangaFollows } from "@/ts/network/calls";
import { MangaFollowResponse, ErrorResponse } from "@/ts/model/response";

@Options({
  mounted() {
    const session = store.state.token.session;

    let body = { limit: 1, offset: 0 };
    getMangaFollows(session, body)
      .then((response: AxiosResponse<MangaFollowResponse>) => {
        store.commit("addManga", response.data.data[0]); // Add first manga
        let total = response.data.total; // Get total

        for (let offset = 1; offset < total; offset += 100) {
          body = { limit: 100, offset: offset };
          getMangaFollows(session, body)
            .then((response: AxiosResponse<MangaFollowResponse>) => {
              let followedManga = response.data.data;
              followedManga.forEach((manga) => {
                store.commit("addManga", manga);
              });
            })
            .catch((error: AxiosError<ErrorResponse>) => {
              // TODO
              console.log(error);
            });
        }
      })
      .catch((error: AxiosError<ErrorResponse>) => {
        // TODO
        console.log(error);
      });
  },
})
export default class Loading extends Vue {}
</script>
