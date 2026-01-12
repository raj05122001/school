import axios from "axios";
import config from "../../config";
import { isExpired } from "react-jwt";
import axiosAPIInstanceAuth from "./axiosAPIInstanceAuth";
import Cookies from "js-cookie";

const baseURL = config.VIDYAAI_API;

let isRefreshing = false;
let refreshPromise = null;

const axiosAPIInstance = axios.create({
  baseURL,
  headers: { "X-Requested-With": "XMLHttpRequest" },
});

// ✅ helper: safely read ?token= from URL (client only)
const getWebAccessToken = () => {
  if (typeof window === "undefined") return "";
  try {
    const sp = new URLSearchParams(window.location.search);
    return sp.get("token") || "";
  } catch {
    return "";
  }
};

export const replaceStringQutes = (token) =>
  token ? String(token).replace(/"/g, "") : "";

export const refreshAccessToken = async () => {
  const web_access_token = getWebAccessToken();
  const refreshToken =
    replaceStringQutes(Cookies.get("REFRESH_TOKEN")) || web_access_token;

  if (!refreshToken) {
    // nothing to refresh with
    isRefreshing = false;
    throw new Error("No refresh token available");
  }

  // ✅ if already refreshing, return same promise
  if (isRefreshing && refreshPromise) {
    const response = await refreshPromise;
    const newAccessToken = response.data?.access;
    if (newAccessToken) Cookies.set("ACCESS_TOKEN", newAccessToken, { expires: 7 });
    return newAccessToken;
  }

  isRefreshing = true;

  refreshPromise = axiosAPIInstanceAuth.post(`api/v1/account/token/refresh/`, {
    refresh: refreshToken,
  });

  try {
    const response = await refreshPromise;
    const newAccessToken = response.data?.access;

    if (!newAccessToken) throw new Error("Refresh response missing access token");

    Cookies.set("ACCESS_TOKEN", newAccessToken, { expires: 7 });
    return newAccessToken;
  } finally {
    isRefreshing = false;
    refreshPromise = null;
  }
};

axiosAPIInstance.interceptors.request.use(
  async (reqConfig) => {
    let accessToken = replaceStringQutes(Cookies.get("ACCESS_TOKEN"));

    // ✅ if no access token, try using url token (optional)
    if (!accessToken) {
      const webToken = getWebAccessToken();
      if (webToken) {
        Cookies.set("ACCESS_TOKEN", webToken, { expires: 7 });
        accessToken = webToken;
      }
    }

    // ✅ refresh if expired
    if (accessToken && isExpired(accessToken)) {
      accessToken = await refreshAccessToken();
    }

    if (accessToken) {
      reqConfig.headers = reqConfig.headers || {};
      reqConfig.headers.Authorization = `Bearer ${accessToken}`;
    }

    return reqConfig;
  },
  (error) => Promise.reject(error)
);

export default axiosAPIInstance;
