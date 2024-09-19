import axios from "axios";
import config from "../../config";
import { isExpired } from "react-jwt";
import axiosAPIInstanceAuth from "./axiosAPIInstanceAuth";
import Cookies from 'js-cookie';

const window = global?.window || {};
const localStorage = window.localStorage || {};

const baseURL = config.VIDYAAI_API;

let isRefreshing = false;
let refreshPromise = null;

const axiosAPIInstance = axios.create({
    baseURL,
    headers: { "X-Requested-With": "XMLHttpRequest" }
});

export const refreshAccessToken = async () => {
    const refreshToken = replaceStringQutes(localStorage.getItem("VIDYAAI_REFRESH_TOKEN"));
    refreshPromise = axiosAPIInstanceAuth.post(`api/v1/account/token/refresh/`, {
        refresh: refreshToken
    });

    const response = await refreshPromise;
    const newAccessToken = response.data.access;
    Cookies.set('VIDYAAI_ACCESS_TOKEN', newAccessToken);
    isRefreshing = false;
    localStorage.setItem(
        "VIDYAAI_ACCESS_TOKEN",
        JSON.stringify(newAccessToken)
    );
    return newAccessToken;
}

axiosAPIInstance.interceptors.request.use(
    async (config) => {
        let newToken;
        let accessToken = replaceStringQutes(localStorage.getItem("VIDYAAI_ACCESS_TOKEN"));
        newToken = accessToken
        if (isExpired(accessToken)) {
            newToken = await refreshAccessToken();
        }
        config.headers.Authorization = `Bearer ${newToken}`;
        return config;
    },
    (error) => {
        return Promise.reject(error);
    }
);


export default axiosAPIInstance;

export const replaceStringQutes = (token) => token ? token.replace(/"/g, '') : '';
