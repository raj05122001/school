import axiosAPIInstanceAuth from "./axiosAPIInstanceAuth";
import { async } from "regenerator-runtime";

export default class apiServices {
  private axiosInstance;
  private authAxiosInstance;

  public constructor(axiosInstance) {
    this.axiosInstance = axiosInstance;
    this.authAxiosInstance = axiosAPIInstanceAuth;
  }


  public loginApi = async (formData) => {
    return await this.authAxiosInstance
      .post(`/api/v1/account/login/`,formData)
      .then((response) => {
        return response;
      })
      .catch((error)=>{
        throw(error)
      })
  };

  }
