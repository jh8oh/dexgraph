import { AxiosError } from "axios";
import { ErrorResponse } from "../model/response";

function handleErrorMessage(error: AxiosError<ErrorResponse>): string {
  if (error.response) {
    // Request made and server responded
    console.log(error.response.data);
    return error.response.data.errors[0].detail;
  } else if (error.request) {
    // The request was made but no response was received
    console.log(error.request);
    return "MangaDex failed to respond. Please try again later.";
  } else {
    // Something happened in setting up the request that triggered an Error
    console.log("Error", error.message);
    return "Unable to send request. Please try again later.";
  }
}

export { handleErrorMessage };
