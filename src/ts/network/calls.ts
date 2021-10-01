import axios, { AxiosResponse } from "axios";
import { HOST_URL, LOGIN_ENDPOINT } from "./config";
import LoginResponse from "../model/login-response";

const login = async (
  username: string,
  password: string,
  isEmail: boolean
): Promise<AxiosResponse<LoginResponse>> => {
  const response = await axios.post(HOST_URL + LOGIN_ENDPOINT, {
    username: isEmail ? "" : username,
    email: isEmail ? username : "",
    password: password,
  });

  return response;
};

export { login };
