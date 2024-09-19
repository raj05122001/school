import axiosAPIInstance from "./axiosAPIInstance";
import apiServices from "./apiServices";

export const loginApi = async (formData) => {
  const apiInstance = new apiServices(axiosAPIInstance);
  return await apiInstance.loginApi(formData);
};
