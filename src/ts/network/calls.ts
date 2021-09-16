import axios from "axios";
import { HOST_URL, LOGIN_ENDPOINT } from "@/ts/network/config";

const login = async (username: string, password: string, isEmail: boolean) => {
    const response = await axios.post(HOST_URL + LOGIN_ENDPOINT, {
        username: isEmail ? "" : username,
        email: isEmail ? username : "",
        password: password,
    });

    return response;
};

export { login };
