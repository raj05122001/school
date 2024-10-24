import axiosAPIInstance from "./axiosAPIInstance";
import apiServices from "./apiServices";

export const loginApi = async (formData) => {
  const apiInstance = new apiServices(axiosAPIInstance);
  return await apiInstance.loginApi(formData);
};

export const createLecture = async (formData) => {
  const apiInstance = new apiServices(axiosAPIInstance);
  return await apiInstance.createLecture(formData);
};

export const updateLecture = async (lectureId, formData) => {
  const apiInstance = new apiServices(axiosAPIInstance);
  return await apiInstance.updateLecture(lectureId, formData);
};

export const getClassDropdown = async () => {
  const apiInstance = new apiServices(axiosAPIInstance);
  return await apiInstance.getClassDropdown();
};

export const getSubjectByClass = async (className, search) => {
  const apiInstance = new apiServices(axiosAPIInstance);
  return await apiInstance.getSubjectByClass(className, search);
};

export const getChapterBySubject = async (subject, search) => {
  const apiInstance = new apiServices(axiosAPIInstance);
  return await apiInstance.getChapterBySubject(subject, search);
};

export const getTopicsByChapter = async (chapter, search) => {
  const apiInstance = new apiServices(axiosAPIInstance);
  return await apiInstance.getTopicsByChapter(chapter, search);
};

export const createNewChapter = async (formData) => {
  const apiInstance = new apiServices(axiosAPIInstance);
  return await apiInstance.createNewChapter(formData);
};

export const createNewTopics = async (formData) => {
  const apiInstance = new apiServices(axiosAPIInstance);
  return await apiInstance.createNewTopics(formData);
};

export const getTeacherDetails = async (teacherId) => {
  const apiInstance = new apiServices(axiosAPIInstance);
  return await apiInstance.getTeacherDetails(teacherId);
};

export const createNewClass = async (formData) => {
  const apiInstance = new apiServices(axiosAPIInstance);
  return await apiInstance.createNewClass(formData);
};

export const createNewSubject = async (formData) => {
  const apiInstance = new apiServices(axiosAPIInstance);
  return await apiInstance.createNewSubject(formData);
};

export const updateSubject = async (class_id, formData) => {
  const apiInstance = new apiServices(axiosAPIInstance);
  return await apiInstance.updateSubject(class_id, formData);
};

export const deleteUpcommingLecture = async (lectureId) => {
  const apiInstance = new apiServices(axiosAPIInstance);
  return await apiInstance.deleteUpcommingLecture(lectureId);
};

export const getMyLectures = async (
  status,
  type = "",
  search = "",
  page = 1,
  size = 10,
  getMyLectures
) => {
  const apiInstance = new apiServices(axiosAPIInstance);
  return await apiInstance.getMyLectures(
    status,
    type,
    search,
    page,
    size,
    getMyLectures
  );
};

export const getUpcommingMeetingByDate = async (year, month) => {
  const apiInstance = new apiServices(axiosAPIInstance);
  return await apiInstance.getUpcommingMeetingByDate(year, month);
};

export const getClassByCourse = async (course, search) => {
  const apiInstance = new apiServices(axiosAPIInstance);
  return await apiInstance.getClassByCourse(course, search);
};

export const getTeacherAllLecture = async (
  userId,
  search,
  date,
  type,
  page,
  pageSize,
  subjectList = "",
  classList=""
) => {
  const apiInstance = new apiServices(axiosAPIInstance);
  return await apiInstance.getTeacherAllLecture(
    userId,
    search,
    date,
    type,
    page,
    pageSize,
    subjectList,
    classList
  );
};

export const downloadExcelFile = async () => {
  const apiInstance = new apiServices(axiosAPIInstance);
  return await apiInstance.downloadExcelFile();
};

export const uploadExcelFile = async (formData) => {
  const apiInstance = new apiServices(axiosAPIInstance);
  return await apiInstance.uploadExcelFile(formData);
}

export const updateLectureAttachment = async (lectureId, formData) => {
  const apiInstance = new apiServices(axiosAPIInstance);
  return await apiInstance.updateLectureAttachment(lectureId, formData);
};

export const uploadAudioFile = async (lectureId, formData) => {
  const apiInstance = new apiServices(axiosAPIInstance);
  return await apiInstance.uploadAudioFile(lectureId, formData);
};

export const uploadS3Video = async (lectureId, formData) => {
  const apiInstance = new apiServices(axiosAPIInstance);
  return await apiInstance.uploadS3Video(lectureId, formData);
};