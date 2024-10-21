import axiosAPIInstanceAuth from "./axiosAPIInstanceAuth";
import { async } from "regenerator-runtime";
import { toast } from "react-toastify";
import Constants from "@/constants/Constants";

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

  public createLecture = (formData) => {
    const toastInstance = toast.loading("Loading...");
    return this.axiosInstance
      .post(`/api/v1/lecture/`, formData)
      .then((response) => {
        if (!response.data.success) {
          toast.update(toastInstance, {
            render: response.data.message,
            type: "warning",
            isLoading: false,
            autoClose: Constants.toastTimer,
          });
          return response;
        }
        toast.update(toastInstance, {
          render: "Lecture is created",
          type: "success",
          isLoading: false,
          autoClose: Constants.toastTimer,
        });
        return response;
      })
      .catch((error) => {
        const errorText = error.response.data.message;
        toast.update(toastInstance, {
          render: errorText,
          type: "error",
          isLoading: false,
          autoClose: Constants.toastTimer,
        });
        console.error(error);
        throw error;
      });
  };

  public updateLecture = (lectureId, formData) => {
    const toastInstance = toast.loading("Loading...");
    return this.axiosInstance
      .patch(`/api/v1/lecture/${lectureId}/`, formData)
      .then((response) => {
        if (!response.data.success) {
          toast.update(toastInstance, {
            render: response.data.message,
            type: "warning",
            isLoading: false,
            autoClose: Constants.toastTimer,
          });
          return response;
        }
        toast.update(toastInstance, {
          render: "Lecture is created",
          type: "success",
          isLoading: false,
          autoClose: Constants.toastTimer,
        });
        return response;
      })
      .catch((error) => {
        const errorText = error.response.data.message;
        toast.update(toastInstance, {
          render: errorText,
          type: "error",
          isLoading: false,
          autoClose: Constants.toastTimer,
        });
        console.error(error);
        throw error;
      });
  };

  public getClassDropdown = async () => {
    return await this.authAxiosInstance
      .get(`/api/v1/dropdown/class/`)
      .then((Response) => Response.data)
      .catch((error) => console.error(error));
  };

  public getSubjectByClass = async (className, search = "") => {
    return await this.authAxiosInstance
      .get(`/api/v1/dropdown/subject/?class=${className}&search=${search}`)
      .then((Response) => Response)
      .catch((error) => console.error(error));
  };

  public getChapterBySubject = async (subject, search = "") => {
    return await this.authAxiosInstance
      .get(`/api/v1/dropdown/chapter/?subject=${subject}&search=${search}`)
      .then((Response) => Response)
      .catch((error) => console.error(error));
  };

  public getTopicsByChapter = async (chapter, search = "") => {
    return await this.authAxiosInstance
      .get(`/api/v1/dropdown/topics/?chapter=${chapter}&search=${search}`)
      .then((Response) => Response)
      .catch((error) => console.error(error));
  };

  public createNewChapter = async (formData) => {
    return await this.axiosInstance
      .post(`/api/v1/administration/chapter/`, formData)
      .then((Response) => Response)
      .catch((error) => console.error(error));
  };

  public createNewTopics = async (formData) => {
    return await this.axiosInstance
      .post(`/api/v1/administration/topics/`, formData)
      .then((Response) => Response)
      .catch((error) => console.error(error));
  };

  public getTeacherDetails = async (teacherId) => {
    return await this.axiosInstance
      .get(`/api/v1/teacher/${teacherId}/`)
      .then((Response) => Response)
      .catch((error) => console.error(error));
  };

  public createNewClass = async (formData) => {
    return await this.axiosInstance
      .post(`/api/v1/administration/class/`, formData)
      .then((Response) => Response)
      .catch((error) => console.error(error));
  };

  public createNewSubject = async (formData) => {
    return await this.axiosInstance
      .post(`/api/v1/administration/subject/`, formData)
      .then((Response) => Response)
      .catch((error) => console.error(error));
  };

  public updateSubject = async (class_id, formData) => {
    return await this.axiosInstance
      .patch(`/api/v1/administration/class/${class_id}/`, formData)
      .then((Response) => Response)
      .catch((error) => console.error(error));
  };

  public deleteUpcommingLecture = (lectureId) => {
    const toastInstance = toast.loading("Loading...");
    return this.axiosInstance
      .delete(`/api/v1/lecture/${lectureId}/`)
      .then((response) => {
        toast.update(toastInstance, {
          render: "Lecture Successfully Delete",
          type: "success",
          isLoading: false,
          autoClose: Constants.toastTimer,
        });
        return response;
      })
      .catch((error) => {
        toast.update(toastInstance, {
          render: error?.response?.data?.message,
          type: "error",
          isLoading: false,
          autoClose: Constants.toastTimer,
        });
        console.error("this is error", error);
      });
  };

  }
