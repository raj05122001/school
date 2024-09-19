import axios from "axios";
import config from "../../config";

const baseURL = config.VIDYAAI_API;

const axiosAPIInstanceAuth = axios.create({
  baseURL,
  headers: { "X-Requested-With": "XMLHttpRequest" }
});

axiosAPIInstanceAuth.interceptors.request.use(
  async (config) => {
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

axiosAPIInstanceAuth.interceptors.response.use(
  (response) => {
    return response;
  },
  async (error) => {
    if (error.response && error.response.status === 401) {
      console.error('Access token expired, and refresh token failed.');
    } else {
      console.error('Error making request:', error);
    }
    return Promise.reject(error);
  }
);

export default axiosAPIInstanceAuth;
