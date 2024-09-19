import axios from "axios";
import { BASE_URL, BASE_URL_MEET } from "@/constants/apiconfig";

export const API_STATE = {
  initial: "initial",
  pending: "pending",
  success: "success",
  error: "error",
  getColorHash: function (state) {
    switch (state) {
      case this.initial:
        return null;
      case this.pending:
        return "#F29339";
      case this.success:
        return "#4BB543";
      case this.error:
        return "#D9512C";
      default:
        return null;
    }
  },
};

export const axiosInstance = (
  baseURL = BASE_URL,
  headers = { "X-Requested-With": "XMLHttpRequest" }
) => {
  return axios.create({ baseURL, headers, withCredentials: false });
};

export const axiosAuthInstance = (
  baseURL = BASE_URL_MEET,
  headers = { "X-Requested-With": "XMLHttpRequest", 'Content-Type': 'multipart/form-data' }
) => {
  return axios.create({ baseURL, headers, withCredentials: false });
};

export const axiosUserDashBoardInstance = (
  baseURL = BASE_URL_MEET,
  headers = { "X-Requested-With": "XMLHttpRequest" }
) => {
  return axios.create({ baseURL, headers, withCredentials: false });
};
