import axiosAPIInstanceAuth from "./axiosAPIInstanceAuth";
import { async } from "regenerator-runtime";
import Constants from "@/constants/Constants";
import toast from "react-hot-toast";

export default class apiServices {
  private axiosInstance;
  private authAxiosInstance;

  public constructor(axiosInstance) {
    this.axiosInstance = axiosInstance;
    this.authAxiosInstance = axiosAPIInstanceAuth;
  }

  public loginApi = async (formData) => {
    return await this.authAxiosInstance
      .post(`/api/v1/account/login/`, formData)
      .then((response) => {
        return response;
      })
      .catch((error) => {
        throw error;
      });
  };

  public createLecture = (formData) => {
    const toastInstance = toast.loading("Loading...");
    return this.axiosInstance
      .post(`/api/v1/lecture/`, formData)
      .then((response) => {
        if (!response.data.success) {
          toast.dismiss(toastInstance); // Dismiss the loading toast
          toast.error(response.data.message, {
            duration: Constants.toastTimer,
          });
          return response;
        }
        toast.dismiss(toastInstance); // Dismiss the loading toast
        toast.success("Lecture is created", {
          duration: Constants.toastTimer,
        });
        return response;
      })
      .catch((error) => {
        toast.dismiss(toastInstance); // Dismiss the loading toast
        const errorText = error.response?.data?.message || "An error occurred";
        toast.error(errorText, {
          duration: Constants.toastTimer,
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
          toast.dismiss(toastInstance); // Dismiss the loading toast
          toast.error(response.data.message, {
            duration: Constants.toastTimer,
          });
          return response;
        }
        toast.dismiss(toastInstance); // Dismiss the loading toast
        toast.success("Lecture is updated", {
          duration: Constants.toastTimer,
        });
        return response;
      })
      .catch((error) => {
        toast.dismiss(toastInstance); // Dismiss the loading toast
        const errorText = error.response?.data?.message || "An error occurred";
        toast.error(errorText, {
          duration: Constants.toastTimer,
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
        toast.dismiss(toastInstance); // Dismiss the loading toast
        toast.success("Lecture Successfully Deleted", {
          duration: Constants.toastTimer,
        });
        return response;
      })
      .catch((error) => {
        toast.dismiss(toastInstance); // Dismiss the loading toast
        const errorText = error?.response?.data?.message || "An error occurred";
        toast.error(errorText, {
          duration: Constants.toastTimer,
        });
        console.error("this is error", error);
      });
  };

  public getMyLectures = async (
    status = "UPCOMMING",
    type = "",
    search = "",
    page = 1,
    size = 10,
    getMyLectures
  ) => {
    return await this.axiosInstance
      .get(
        `/api/v1/dashboard/teacher/lectures/?status=${status}&type=${type}&search=${search}&page=${page}&size=${size}${
          getMyLectures ? `&date=${getMyLectures}` : ""
        }`
      )
      .then((Response) => Response)
      .catch((error) => console.error(error));
  };

  public getUpcommingMeetingByDate = (year, month) => {
    return this.axiosInstance
      .get(`/api/v1/teacher/upcomming_lectures/?date=${year}-${month}`)
      .then((response) => {
        return response;
      })
      .catch((error) => {
        const errorText = error.response.data.errors
          ? error.response.data.errors.username[0]
          : error.response.data.message;
        toast.error(errorText);
      });
  };

  public getClassByCourse = async (course, search = "") => {
    return await this.authAxiosInstance
      .get(`/api/v1/dropdown/class/?course=${course}&search=${search}`)
      .then((Response) => Response)
      .catch((error) => console.error(error));
  };

  public getTeacherAllLecture = async (
    userId,
    search = "",
    date = "",
    type = "",
    page = 1,
    pageSize = 9,
    subjectList = "",
    classList = ""
  ) => {
    return await this.axiosInstance
      .get(
        `/api/v1/teacher/lectures/?search=${
          search ? search : ""
        }&page=${page}&size=${pageSize}&date=${date ? date : ""}&type=${
          type ? type : ""
        }${subjectList ? `&subject=${subjectList}` : ""}${
          classList ? `&class=${classList}` : ""
        }`
      )
      .then((Response) => Response)
      .catch((error) => console.error(error));
  };

  public downloadExcelFile = async () => {
    return await this.axiosInstance
      .get(`/api/v1/dashboard/download_excel/`)
      .then((Response) => Response)
      .catch((error) => console.error(error));
  };

  public uploadExcelFile = (formData) => {
    const toastInstance = toast.loading("Loading...");
    return this.axiosInstance
      .post(`/api/v1/dashboard/upload_excel/`, formData)
      .then((response) => {
        if (!response.data.success) {
          toast.dismiss(toastInstance); // Dismiss the loading toast
          toast.error(response.data.message, {
            duration: Constants.toastTimer,
          });
          return response;
        }
        toast.dismiss(toastInstance); // Dismiss the loading toast
        toast.success(response.data?.data?.message, {
          duration: Constants.toastTimer,
        });
        return response;
      })
      .catch((error) => {
        toast.dismiss(toastInstance); // Dismiss the loading toast
        const errorText = error.response?.data?.message || "An error occurred";
        toast.error(errorText, {
          duration: Constants.toastTimer,
        });
        console.error(error);
        throw error;
      });
  };
}
