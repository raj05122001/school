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
    return this.axiosInstance
      .post(`/api/v1/lecture/`, formData)
      .then((response) => {
        toast.success("Lecture Created Successfully");
        return response;
      })
      .catch((error) => {
        toast.error("Error creating lecture");
        console.error(error);
        throw error;
      });
  };

  public updateLecture = (lectureId, formData) => {
    return this.axiosInstance
      .patch(`/api/v1/lecture/${lectureId}/`, formData)
      .then((response) => {
        toast.success("Lecture Updated Successfully");
        return response;
      })
      .catch((error) => {
        toast.error("Error updating lecture");
        console.error(error);
        throw error;
      });
  };

  public registration = async (payload) => {
    return await this.authAxiosInstance
      .post("api/v1/account/register/", payload, {
        headers: {
          "Content-Type": "multipart/form-data",
        },
      })
      .then((response) => {
        return response;
      })
      .catch((error) => {
        console.error(error);
        throw error;
      });
  };

  public grtDepartment = async () => {
    return await this.authAxiosInstance
      .get(`/api/v1/dropdown/department/`)
      .then((Response) => Response)
      .catch((error) => console.error(error));
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

  // public deleteUpcommingLecture = (lectureId) => {
  //   return this.axiosInstance
  //     .delete(`/api/v1/lecture/${lectureId}/`)
  //     .then((response) => {
  //       return response;
  //     })
  //     .catch((error) => {
  //       console.error("this is error", error);
  //     });
  // };

  public getMyLectures = async (
    status = "UPCOMMING",
    type = "",
    search = "",
    page = 1,
    size = 10,
    getMyLectures,
    subjectList = "",
    classList = ""
  ) => {
    return await this.axiosInstance
      .get(
        `/api/v1/dashboard/teacher/lectures/?status=${status}&type=${type}&search=${search}&page=${page}&size=${size}${
          getMyLectures ? `&date=${getMyLectures}` : ""
        }${subjectList ? `&subject=${subjectList}` : ""}${
          classList ? `&class=${classList}` : ""
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
    return this.axiosInstance
      .post(`/api/v1/dashboard/upload_excel/`, formData)
      .then((response) => {
        return response;
      })
      .catch((error) => {
        console.error(error);
        throw error;
      });
  };
  public updateLectureAttachment = (lectureId, formData) => {
    const headers = { "Content-Type": "multipart/form-data" };
    return this.axiosInstance
      .post(`/api/v1/lecture/${lectureId}/attachment/`, formData, { headers })
      .then((response) => {
        return response;
      })
      .catch((error) => {
        toast.error("Job Title not loaded, please contact to admin.");
        console.error(error);
      });
  };

  public uploadAudioFile = (lectureId, formData) => {
    return this.axiosInstance
      .patch(`/api/v1/lecture/${lectureId}/audio_media/`, formData)
      .then((response) => {
        return response;
      });
  };

  public uploadS3Video = async (lectureId, formData) => {
    return await this.axiosInstance
      .patch(`/api/v1/lecture/${lectureId}/upload_media/`, formData)
      .then((Response) => Response);
  };

  public getLectureById = async (lectureId) => {
    return await this.axiosInstance
      .get(`/api/v1/lecture/${lectureId}/`)
      .then((Response) => Response)
      .catch((error) => console.error(error));
  };

  public getLectureSummary = async (lectureId) => {
    return await this.axiosInstance
      .get(`/api/v1/lecture/${lectureId}/summary/`)
      .then((Response) => Response)
      .catch((error) => console.error(error));
  };

  public getLectureHighlights = async (lectureId) => {
    return await this.axiosInstance
      .get(`/api/v1/lecture/${lectureId}/highlights/`)
      .then((Response) => Response)
      .catch((error) => console.error(error));
  };

  public updateSummary = async (summaryId, data) => {
    return await this.axiosInstance
      .patch(`api/v1/edit/summary/${summaryId}/`, data)
      .then((response) => {
        if (!response.data.success) {
          return response;
        }
        return response;
      })
      .catch((error) => {
        const errorText = error.response.data.errors
          ? error.response.data.errors.username[0]
          : error.response.data.message;
        console.error(error);
      });
  };

  public getLectureNotes = async (lectureId) => {
    return await this.axiosInstance
      .get(`/api/v1/lecture/${lectureId}/notes/`)
      .then((Response) => Response.data)
      .catch((error) => console.error(error));
  };

  public getBreakpoint = async (lectureId) => {
    return await this.axiosInstance
      .get(`/api/v1/lecture/${lectureId}/breakpoint/`)
      .then((Response) => Response)
      .catch((error) => console.error(error));
  };

  public generateContent = async (data) => {
    return await this.axiosInstance
      .post(`/api/v1/generate_content/`, data, {
        headers: {
          "Content-Type": "multipart/form-data",
        },
      })
      .then((response) => {
        return response;
      })
      .catch((error) => {
        console.error(error);
      });
  };

  public generateArticle = async (data) => {
    return await this.axiosInstance
      .post(`/api/v1/generate_article/`, data, {
        headers: {
          "Content-Type": "multipart/form-data",
        },
      })
      .then((response) => {
        return response;
      })
      .catch((error) => {
        console.error(error);
      });
  };

  public meetingAnalytics = async (meetingId) => {
    return await this.axiosInstance
      .get(`/api/v1/lecture/${meetingId}/analytics/`)
      .then((response) => {
        return response;
      })
      .catch((error) => {
        console.error(error);
      });
  };

  public getAllLectureCount = async () => {
    return await this.axiosInstance
      .get(`/api/v1/lecture_tracking/`)
      .then((Response) => Response)
      .catch((error) => console.error(error));
  };

  public getCountByCategory = async (class_ids = "", teacher_id) => {
    return await this.axiosInstance
      .get(
        `/api/v1/dashboard/count_by_category/?class_ids=${class_ids}${
          teacher_id !== 0 ? `&teacher_id=${teacher_id}` : ""
        }`
      )
      .then((Response) => Response)
      .catch((error) => console.error(error));
  };

  public getStudentByGrade = async (
    class_ids = "",
    grade = "A",
    teacher_id = 0
  ) => {
    return await this.axiosInstance
      .get(
        `/api/v1/dashboard/get_by_category/?class_ids=${class_ids}&grade=${grade}${
          teacher_id !== 0 ? `&teacher_id=${teacher_id}` : ""
        }`
      )
      .then((Response) => Response)
      .catch((error) => console.error(error));
  };

  public getteacherClass = async () => {
    return await this.axiosInstance
      .get(`/api/v1/dashboard/teacher/average_duration/`)
      .then((Response) => Response)
      .catch((error) => console.error(error));
  };

  public getClassAssignment = async (class_ids, isTeacher = false) => {
    return await this.axiosInstance
      .get(
        `/api/v1/dashboard/assignment-class-details/${class_ids}/${
          isTeacher ? "?teacher=True" : ""
        }`
      )
      .then((Response) => Response)
      .catch((error) => console.error(error));
  };

  public getStudentAssignment = async (class_ids, isTeacher = false) => {
    return await this.axiosInstance
      .get(
        `/api/v1/dashboard/assignment-student-details/${class_ids}/${
          isTeacher ? "?teacher=True" : ""
        }`
      )
      .then((Response) => Response)
      .catch((error) => console.error(error));
  };

  public getAllSubject = async () => {
    return await this.axiosInstance
      .get(`/api/v1/dashboard/admin/class_list/`)
      .then((Response) => Response)
      .catch((error) => console.error(error));
  };

  public regenrateNotes = (lectureId, formData) => {
    const toastInstance = toast.loading("Loading Notes...");
    return this.axiosInstance
      .post(`api/v1/dynamic_notes/?lecture_id=${lectureId}`, formData)
      .then((response) => {
        toast.success("Updated Notes Successfully", {
          id: toastInstance,
          duration: Constants.toastTimer,
        });
        return response;
      })
      .catch((error) => {
        toast.error(
          error?.response?.data?.message || "Failed to update notes",
          {
            id: toastInstance,
            duration: Constants.toastTimer,
          }
        );
        console.error("this is error", error);
      });
  };

  public getLectureQuiz = async (lectureId) => {
    return await this.axiosInstance
      .get(`/api/v1/lecture/${lectureId}/quiz/`)
      .then((Response) => Response.data)
      .catch((error) => console.error(error));
  };

  public getLectureQuestion = async (lectureId) => {
    return await this.axiosInstance
      .get(`/api/v1/lecture/${lectureId}/questions/`)
      .then((Response) => Response.data)
      .catch((error) => console.error(error));
  };

  public getLectureResources = async (lectureId) => {
    return await this.axiosInstance
      .get(`/api/v1/lecture/${lectureId}/resources/`)
      .then((Response) => Response.data)
      .catch((error) => console.error(error));
  };

  public getLectureAssignment = async (lectureId) => {
    return await this.axiosInstance
      .get(`/api/v1/get_assignment/${lectureId}/`)
      .then((Response) => Response.data)
      .catch((error) => console.error(error));
  };

  public updateLectureAssignment = async (lectureId, formData) => {
    return await this.axiosInstance
      .patch(`/api/v1/lecture_assignment/${lectureId}/`, formData)
      .then((Response) => Response)
      .catch((error) => console.error(error));
  };

  public createAssignment = (formData) => {
    return this.axiosInstance
      .post(`/api/v1/lecture_assignment/`, formData, {
        headers: {
          "Content-Type": "multipart/form-data",
        },
      })
      .then((response) => {
        return response;
      })
      .catch((error) => {
        console.error(error);
        throw error;
      });
  };

  public getLectureAns = async (data) => {
    return await this.axiosInstance
      .post(`/api/v1/get/ans/`, data)
      .then((Response) => Response.data)
      .catch((error) => console.error(error));
  };

  public getStudentAllLecture = async (
    search = "",
    date = "",
    type = "",
    page = 1,
    pageSize = 9,
    subjectList = ""
  ) => {
    return await this.axiosInstance
      .get(
        `/api/v1/student/lectures/?search=${
          search ? search : ""
        }&page=${page}&size=${pageSize}&date=${date ? date : ""}&type=${
          type ? type : ""
        }${subjectList ? `&subject=${subjectList}` : ""}`
      )
      .then((Response) => Response)
      .catch((error) => console.error(error));
  };

  public getLectureTracking = async (
    status,
    search,
    type,
    page,
    size,
    getDate,
    subjectList = "",
    classList = ""
  ) => {
    return await this.axiosInstance
      .get(
        `/api/v1/dashboard/all_lectures/?search=${search}&type=${type}&status=${status}&page=${page}&size=${size}${
          getDate ? `&date=${getDate}` : ""
        }${subjectList ? `&subject=${subjectList}` : ""}${
          classList ? `&class=${classList}` : ""
        }`
      )
      .then((Response) => Response)
      .catch((error) => console.error(error));
  };

  public postFeedback = (formData) => {
    return this.axiosInstance
      .post(`api/v1/lecture_feedback/`, formData)
      .then((response) => {
        return response;
      })
      .catch((error) => {
        console.error(error);
      });
  };

  public getComments = async (id) => {
    return await this.axiosInstance
      .get(`/api/v1/discussion_reply/${id ? `?lecture_id=${id}` : ""}`)
      .then((Response) => Response.data)
      .catch((error) => console.error(error));
  };

  public updateLectureDiscussion = (lectureId, formData) => {
    const headers = { "Content-Type": "multipart/form-data" };
    return this.axiosInstance
      .post(`/api/v1/lecture/${lectureId}/discussion/`, formData, headers)
      .then((response) => {
        return response;
      })
      .catch((error) => {
        toast.error("Job Title not loaded, please contact to admin.");
        console.error(error);
      });
  };

  public getLectureDiscussion = (lectureId) => {
    return this.axiosInstance
      .get(`/api/v1/lecture/${lectureId}/discussion/`)
      .then((response) => {
        return response;
      })
      .catch((error) => {
        console.error(error);
      });
  };

  public updateCommentReply = (formData) => {
    return this.axiosInstance
      .post(`/api/v1/discussion_reply/`, formData)
      .then((response) => {
        return response;
      })
      .catch((error) => {
        console.error(error);
      });
  };

  public getFeedback = async (lectureId, student_id) => {
    return await this.axiosInstance
      .get(
        `/api/v1/lecture_feedback/${lectureId}/${
          student_id ? `?student_id=${student_id}` : ""
        }`
      )
      .then((Response) => Response.data)
      .catch((error) => console.error(error));
  };

  public getStudentLectures = async (type = "COMPLETED") => {
    return await this.axiosInstance
      .get(`/api/v1/dashboard/student/lectures/?status=${type}`)
      .then((Response) => Response)
      .catch((error) => console.error(error));
  };

  public submitQuiz = (formData, lectureId) => {
    return this.axiosInstance
      .post(`api/v1/student/answer_quiz/${lectureId}/`, formData)
      .then((response) => {
        return response;
      })
      .catch((error) => {
        console.error(error);
      });
  };

  public getQuizResponse = async (lectureId) => {
    return await this.axiosInstance
      .get(`/api/v1/student/answer_quiz/${lectureId}/`)
      .then((Response) => Response.data);
  };

  public updateTeacherDetails = async (teacherId, formData) => {
    return await this.axiosInstance
      .patch(`/api/v1/teacher/${teacherId}/`, formData)
      .then((Response) => Response)
      .catch((error) => console.error(error));
  };

  public updateFeedback = async (teacherId, formData) => {
    return await this.axiosInstance
      .patch(`/api/v1/lecture_feedback/${teacherId}/`, formData)
      .then((Response) => Response)
      .catch((error) => console.error(error));
  };

  public submitMOLAssignment = (formData) => {
    return this.axiosInstance
      .post(`/api/v1/lecture_assignmentAnswer/`, formData)
      .then((response) => {
        return response;
      })
      .catch((error) => {
        console.error(error);
        throw error;
      });
  };

  public getAssignmentAnswer = async (
    lecture_id,
    assignment_id = "",
    classname = "",
    subject = "",
    lecture_topic = "",
    size = "10"
  ) => {
    return await this.axiosInstance
      .get(
        `/api/v1/get_assignment_answer/?class=${classname}&subject=${subject}&lecture_topic=${lecture_topic}&lecture_id=${lecture_id}&assignment_id=${assignment_id}&size=${size}`
      )
      .then((Response) => Response)
      .catch((error) => console.error(error));
  };
  public getMolMarks = async (lecture_id, student_id) => {
    return await this.axiosInstance
      .get(
        `/api/v1/student/get_mol_marks/?lecture_id=${lecture_id}&student_id=${student_id}`
      )
      .then((Response) => Response)
      .catch((error) => console.error(error));
  };

  public updateMolMarks = async (marks_id, formData) => {
    return await this.axiosInstance
      .patch(
        `/api/v1/student/get_mol_marks/?lecture_marks_id=${marks_id}`,
        formData
      )
      .then((Response) => Response)
      .catch((error) => console.error(error));
  };

  public getMyRank = async () => {
    return await this.axiosInstance
      .get(`/api/v1/dashboard/student/my-rank/`)
      .then((Response) => Response.data);
  };

  public getMyAssignmentAnalytics = async () => {
    return await this.axiosInstance
      .get(`/api/v1/dashboard/student/my-assignment/`)
      .then((Response) => Response.data);
  };

  public getTeacherStudentCount = async () => {
    return await this.axiosInstance
      .get(`/api/v1/dashboard/admin/total_teacher_student/`)
      .then((Response) => Response.data);
  };

  public getTopTeachers = async () => {
    return await this.axiosInstance
      .get(`/api/v1/dashboard/admin/top_teachers/`)
      .then((Response) => Response.data);
  };
  public getTeacherAssignment = async (
    lecture_id = "",
    student_id = "",
    classname = "",
    subject = "",
    search = "",
    student_name = "",
    assignment_id = ""
  ) => {
    return await this.axiosInstance
      .get(
        `/api/v1/get_assignment_answer/?class=${classname}&subject=${subject}&search=${search}&lecture_id=${lecture_id}&student_id=${student_id}&student_name=${student_name}&assignment_id=${assignment_id}`
      )
      .then((Response) => Response.data);
  };

  public updateAssignment = async (que_id, formData) => {
    return await this.axiosInstance
      .patch(`/api/v1/lecture_assignmentAnswer/${que_id}/`, formData)
      .then((Response) => Response)
      .catch((error) => console.error(error));
  };

  public getMySubject = async () => {
    return await this.axiosInstance
      .get(`/api/v1/dashboard/student/subject/`)
      .then((Response) => Response.data);
  };

  public getMySubjectWatchtime = async (lectureId) => {
    return await this.axiosInstance
      .get(`/api/v1/dashboard/student/subject/${lectureId}/watchtime/`)
      .then((Response) => Response.data);
  };

  public getStudentUpcommingMeetingByDate = (year, month) => {
    return this.axiosInstance
      .get(`/api/v1/student/upcomming_lectures/?date=${year}-${month}`)
      .then((response) => {
        return response;
      });
  };

  public getAllUpcommingByDate = (year, month) => {
    return this.axiosInstance
      .get(
        `/api/v1/dashboard/all_lectures/?status=UPCOMMING&date=${year}-${month}`
      )
      .then((response) => {
        return response;
      });
  };

  public getTeacherLectureCompletion = async (lectureId) => {
    return await this.axiosInstance
      .get(`/api/v1/dashboard/teacher_completed_graph/?teacher_id=${lectureId}`)
      .then((Response) => Response.data);
  };

  public getWatchtimeComparison = async (lectureId) => {
    return await this.axiosInstance
      .get(`/api/v1/dashboard/teacher_watchtime_graph/?teacher_id=${lectureId}`)
      .then((Response) => Response.data);
  };
  public updateWatchtime = async (formData) => {
    return await this.axiosInstance
      .post(`/api/v1/dashboard/watchtime_data/`, formData)
      .then((Response) => Response);
  };

  public commentWatchtimeGraph = (filter_by = "") => {
    return this.axiosInstance
      .get(
        `/api/v1/dashboard/teacher/upload-comment-watchtime-graph/?filter_by=${filter_by}`
      )
      .then((response) => {
        return response;
      });
  };

  public getOneTimePassword = (data) => {
    return this.authAxiosInstance
      .post("api/v1/account/send-otp/", data)
      .then((response) => {
        return response;
      });
  };

  public verifyOneTimePassword = (data) => {
    return this.authAxiosInstance
      .post("api/v1/account/verify-otp/", data)
      .then((response) => {
        return response;
      });
  };

  public resendOneTimePassword = (data) => {
    return this.authAxiosInstance
      .post("api/v1/account/resend-otp/", data)
      .then((response) => {
        return response;
      });
  };

  public watchtimeBySubject = () => {
    return this.axiosInstance
      .get(`/api/v1/dashboard/teacher/watchtime_by_subject/`)
      .then((response) => {
        return response;
      });
  };

  public getRatingsCount = () => {
    return this.axiosInstance
      .get(`/api/v1/dashboard/teacher/ratings_count/`)
      .then((response) => {
        return response;
      });
  };

  public getAllTeachers = async (
    academicYearParam,
    courseParam,
    classListParam,
    departmentsParam,
    search,
    page,
    pageSize
  ) => {
    return await this.axiosInstance
      .get(
        `/api/v1/dashboard/admin/academic/teachers/?academic_year=${academicYearParam}&course=${courseParam}&class=${classListParam}&department=${departmentsParam}&search=${search}&page=${page}&size=${pageSize}`
      )
      .then((Response) => Response)
      .catch((error) => console.error(error));
  };

  public getAllStudent = async (
    academicYearParam,
    courseParam,
    classListParam,
    departmentsParam,
    search,
    page,
    pageSize
  ) => {
    return await this.axiosInstance
      .get(
        `/api/v1/dashboard/admin/academic/students/?academic_year=${academicYearParam}&department=${departmentsParam}&course=${courseParam}&class=${classListParam}&search=${search}&page=${page}&size=${pageSize}`
      )
      .then((Response) => Response)
      .catch((error) => console.error(error));
  };

  public postRewriteAI = (formData) => {
    return this.axiosInstance
      .post(`/api/v1/rewrite_question/`, formData)
      .then((response) => {
        return response;
      })
      .catch((error) => {
        console.error(error);
      });
  };

  public getSubjectCompletion = () => {
    return this.axiosInstance
      .get(`/api/v1/dashboard/teacher/syllabus_completion/`)
      .then((response) => {
        return response;
      });
  };

  public updatePersonalised = (formData) => {
    return this.axiosInstance
      .post(`/api/v1/student/get-personalised-recommendations/`, formData)
      .then((response) => {
        return response;
      });
  };

  public getLecAttachment = async (lectureId) => {
    return await this.axiosInstance
      .get(`/api/v1/lecture/${lectureId}/attachment/`)
      .then((Response) => Response)
      .catch((error) => console.error(error));
  };

  public deleteAttachment = async (deleteId) => {
    const toastInstance = toast.loading("Deleting attachment...");
    try {
      const response = await this.axiosInstance.delete(
        `/api/v1/delete/attachment/${deleteId}/`
      );
      if (!response.data.success) {
        toast.error(response.data.message, {
          id: toastInstance,
          duration: Constants.toastTimer,
        });
        return response;
      }
      toast.success(response.data.message, {
        id: toastInstance,
        duration: Constants.toastTimer,
      });
      return response;
    } catch (error) {
      const errorText = error.response?.data?.errors
        ? error.response.data.errors.username[0]
        : error.response?.data?.message || "Something went wrong";
      toast.error(errorText, {
        id: toastInstance,
        duration: Constants.toastTimer,
      });
      console.error(error);
    }
  };

  public postDepartment = (formData) => {
    return this.authAxiosInstance
      .post(`api/v1/administration/department/`, formData)
      .then((response) => {
        return response;
      })
      .catch((error) => {
        console.error(error);
      });
  };
  public getPersonalisedRecommendations = async (lectureId) => {
    return await this.axiosInstance
      .get(
        `/api/v1/student/get-personalised-recommendations/?lecture_id=${lectureId}`
      )
      .then((Response) => Response)
      .catch((error) => console.error(error));
  };

  public getTopic = async (lectureId, section) => {
    return await this.axiosInstance
      .get(
        `/api/v1/student/get-topic/?lecture_id=${lectureId}&section=${section}`
      )
      .then((Response) => Response)
      .catch((error) => console.error(error));
  };

  public getQuery = (formData) => {
    return this.axiosInstance
      .post(`/api/v1/student/get-query/`, formData)
      .then((response) => {
        return response;
      });
  };

  public createSession = (formData) => {
    return this.axiosInstance
      .post(`/api/v1/chatbot/`, formData)
      .then((response) => {
        return response;
      })
      .catch((error) => {
        console.error(error);
      });
  };

  public getNewLectureAns = async (sessionID, data) => {
    return await this.axiosInstance
      .post(`/api/v1/chatbot/user_message/${sessionID}/`, data)
      .then((Response) => Response.data)
      .catch((error) => console.error(error));
  };

  public deleteUpcomingLecture = (lectureId) => {
    const deleteLecturePromise = this.axiosInstance.delete(
      `/api/v1/lecture/${lectureId}/`
    );

    toast.promise(
      deleteLecturePromise,
      {
        loading: "Deleting lecture...",
        success: "Lecture successfully deleted!",
        error: (error) =>
          error?.response?.data?.message || "Failed to delete the lecture",
      },
      {
        duration: Constants.toastTimer, // Set your custom auto-close timer
      }
    );

    return deleteLecturePromise
      .then((response) => {
        return response;
      })
      .catch((error) => {
        console.error("Error deleting lecture:", error);
        throw error; // Re-throw the error for further handling
      });
  };

  public getGuidance = async (assignmentId) => {
    return await this.axiosInstance
      .get(`/api/v1/get_guidance/${assignmentId}/`)
      .then((Response) => Response)
      .catch((error) => console.error(error));
  };

  public getStudentAssignmentComment = async (assignmentId, studentId) => {
    return await this.axiosInstance
      .get(
        `/api/v1/student/auto-assessment-feedback/${assignmentId}/?student_id=${studentId}`
      )
      .then((Response) => Response)
      .catch((error) => console.error(error));
  };

  public getChatbotHistory = async () => {
    return await this.axiosInstance
      .get(`/api/v1/chatbot`)
      .then((Response) => Response)
      .catch((error) => console.error(error));
  };
  
  public releasedLecture = async (lectureId, formData) => {
    return await this.axiosInstance
      .patch(`api/v1/lecture/${lectureId}/`, formData)
      .then((Response) => Response)
      .catch((error) => console.error(error));
  };

  public getAnswerStatus = async (assignmentId) => {
    return await this.axiosInstance
      .get(`/api/v1/assignment_status/${assignmentId}/`)
      .then((Response) => Response)
      .catch((error) => console.error(error));
  };

  public reSubmitAssignment = async (assignmentId, formData) => {
    return await this.axiosInstance
      .patch(`/api/v1/lecture_assignmentAnswer/${assignmentId}/`, formData)
      .then((Response) => Response)
      .catch((error) => console.error(error));
  };

  public deleteCompletedLecture = (lectureId) => {
    const toastId = toast.loading("Loading...");
    return this.axiosInstance
      .delete(`/api/v1/lecture/${lectureId}/soft_delete/`)
      .then((response) => {
        toast.success("Lecture Successfully Deleted", {
          id: toastId,
          duration: Constants.toastTimer,
        });
        return response;
      })
      .catch((error) => {
        toast.error(error?.response?.data?.message || "Something went wrong", {
          id: toastId,
          duration: Constants.toastTimer,
        });
        console.error("this is error", error);
      });
  };
}
