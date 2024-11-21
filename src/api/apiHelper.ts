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
  getMyLectures,
  subjectList="",
  classList=""
) => {
  const apiInstance = new apiServices(axiosAPIInstance);
  return await apiInstance.getMyLectures(
    status,
    type,
    search,
    page,
    size,
    getMyLectures,
    subjectList,
    classList
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
  classList = ""
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
};

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

export const getLectureById = async (lectureId) => {
  const apiInstance = new apiServices(axiosAPIInstance);
  return await apiInstance.getLectureById(lectureId);
};

export const getLectureSummary = async (lectureId) => {
  const apiInstance = new apiServices(axiosAPIInstance);
  return await apiInstance.getLectureSummary(lectureId);
};

export const getLectureHighlights = async (lectureId) => {
  const apiInstance = new apiServices(axiosAPIInstance);
  return await apiInstance.getLectureHighlights(lectureId);
};

export const updateSummary = async (transcriptId, data) => {
  const apiInstance = new apiServices(axiosAPIInstance);
  return await apiInstance.updateSummary(transcriptId, data);
};

export const getBreakpoint = async (lectureId) => {
  const apiInstance = new apiServices(axiosAPIInstance);
  return await apiInstance.getBreakpoint(lectureId);
};

export const generateContent = async (data) => {
  const apiInstance = new apiServices(axiosAPIInstance);
  return await apiInstance.generateContent(data);
};

export const generateArticle = async (data) => {
  const apiInstance = new apiServices(axiosAPIInstance);
  return await apiInstance.generateArticle(data);
};

export const meetingAnalytics = async (meetingId) => {
  const apiInstance = new apiServices(axiosAPIInstance);
  return await apiInstance.meetingAnalytics(meetingId);
};

export const getAllLectureCount = async () => {
  const apiInstance = new apiServices(axiosAPIInstance);
  return await apiInstance.getAllLectureCount();
};

export const getCountByCategory = async (class_ids,teacher_id) => {
  const apiInstance = new apiServices(axiosAPIInstance);
  return await apiInstance.getCountByCategory(class_ids,teacher_id);
};

export const getClassAssignment = async (class_ids,isTeacher=false) => {
  const apiInstance = new apiServices(axiosAPIInstance);
  return await apiInstance.getClassAssignment(class_ids,isTeacher);
};

export const getStudentAssignment = async (class_ids,isTeacher=false) => {
  const apiInstance = new apiServices(axiosAPIInstance);
  return await apiInstance.getStudentAssignment(class_ids,isTeacher);
};

export const getStudentByGrade = async (class_ids, grade,teacher_id) => {
  const apiInstance = new apiServices(axiosAPIInstance);
  return await apiInstance.getStudentByGrade(class_ids, grade,teacher_id);
};

export const getteacherClass = async () => {
  const apiInstance = new apiServices(axiosAPIInstance);
  return await apiInstance.getteacherClass();
};

export const getLectureNotes = async (lectureId) => {
  const apiInstance = new apiServices(axiosAPIInstance);
  return await apiInstance.getLectureNotes(lectureId);
};

export const regenrateNotes = async (lectureId, formData) => {
  const apiInstance = new apiServices(axiosAPIInstance);
  return await apiInstance.regenrateNotes(lectureId, formData);
};

export const getLectureQuiz = async (lectureId) => {
  const apiInstance = new apiServices(axiosAPIInstance);
  return await apiInstance.getLectureQuiz(lectureId);
};

export const getLectureQuestion = async (lectureId) => {
  const apiInstance = new apiServices(axiosAPIInstance);
  return await apiInstance.getLectureQuestion(lectureId);
};

export const getLectureResources = async (lectureId) => {
  const apiInstance = new apiServices(axiosAPIInstance);
  return await apiInstance.getLectureResources(lectureId);
};

export const getLectureAssignment = async (lectureId) => {
  const apiInstance = new apiServices(axiosAPIInstance);
  return await apiInstance.getLectureAssignment(lectureId);
};

export const updateLectureAssignment = async (lectureId, formData) => {
  const apiInstance = new apiServices(axiosAPIInstance);
  return await apiInstance.updateLectureAssignment(lectureId, formData);
};

export const createAssignment = async (formData) => {
  const apiInstance = new apiServices(axiosAPIInstance);
  return await apiInstance.createAssignment(formData);
};

export const getLectureAns = async (data) => {
  const apiInstance = new apiServices(axiosAPIInstance);
  return await apiInstance.getLectureAns(data);
};

export const getStudentAllLecture = async (
  search,
  date,
  type,
  page,
  pageSize,
  subjectList = ""
) => {
  const apiInstance = new apiServices(axiosAPIInstance);
  return await apiInstance.getStudentAllLecture(
    search,
    date,
    type,
    page,
    pageSize,
    subjectList
  );
};

export const getLectureTracking = async (
  status,
  search,
  type,
  page,
  size,
  getDate,
  subjectList = "",
  classList=""
) => {
  const apiInstance = new apiServices(axiosAPIInstance);
  return await apiInstance.getLectureTracking(
    status,
    search,
    type,
    page,
    size,
    getDate,
    subjectList,
    classList
  );
};

export const postFeedback = async (formData) => {
  const apiInstance = new apiServices(axiosAPIInstance);
  return await apiInstance.postFeedback(formData);
};

export const getComments = async (id) => {
  const apiInstance = new apiServices(axiosAPIInstance);
  return await apiInstance.getComments(id);
};

export const updateLectureDiscussion = async (lectureId, formData) => {
  const apiInstance = new apiServices(axiosAPIInstance);
  return await apiInstance.updateLectureDiscussion(lectureId, formData);
};

export const updateCommentReply = async ( formData) => {
  const apiInstance = new apiServices(axiosAPIInstance);
  return await apiInstance.updateCommentReply( formData);
};

export const getFeedback = async ( lectureId,student_id) => {
  const apiInstance = new apiServices(axiosAPIInstance);
  return await apiInstance.getFeedback( lectureId,student_id);
};

export const getStudentLectures = async (type) => {
  const apiInstance = new apiServices(axiosAPIInstance);
  return await apiInstance.getStudentLectures(type);
};

export const submitQuiz = async (formData, lectureId) => {
  const apiInstance = new apiServices(axiosAPIInstance);
  return await apiInstance.submitQuiz(formData, lectureId);
};

export const getQuizResponse = async (lectureId) => {
  const apiInstance = new apiServices(axiosAPIInstance);
  return await apiInstance.getQuizResponse(lectureId);
}
export const updateTeacherDetails = async (teacherId,formData) => {
  const apiInstance = new apiServices(axiosAPIInstance);
  return await apiInstance.updateTeacherDetails(teacherId,formData);
};

export const updateFeedback = async (teacherId,formData) => {
  const apiInstance = new apiServices(axiosAPIInstance);
  return await apiInstance.updateFeedback(teacherId,formData);
};

export const getLectureDiscussion = async ( lectureId) => {
  const apiInstance = new apiServices(axiosAPIInstance);
  return await apiInstance.getLectureDiscussion( lectureId);
};

export const submitMOLAssignment = async (formData) => {
  const apiInstance = new apiServices(axiosAPIInstance);
  return await apiInstance.submitMOLAssignment(formData);
};

export const getAssignmentAnswer = async (lecture_id, assignment_id) => {
  const apiInstance = new apiServices(axiosAPIInstance);
  return await apiInstance.getAssignmentAnswer(lecture_id, assignment_id);
};
export const getMolMarks = async ( lecture_id,student_id) => {
  const apiInstance = new apiServices(axiosAPIInstance);
  return await apiInstance.getMolMarks( lecture_id,student_id);
};

export const updateMolMarks = async ( marks_id, formData) => {
  const apiInstance = new apiServices(axiosAPIInstance);
  return await apiInstance.updateMolMarks( marks_id, formData);
};

export const verifyOneTimePassword = async (data) => {
  const apiInstance = new apiServices(axiosAPIInstance);
  return await apiInstance.verifyOneTimePassword(data);
};

export const resendOneTimePassword = async (data) => {
  const apiInstance = new apiServices(axiosAPIInstance);
  return await apiInstance.resendOneTimePassword(data);
};

export const getMyRank = async () => {
  const apiInstance = new apiServices(axiosAPIInstance);
  return await apiInstance.getMyRank();
};

export const getOneTimePassword = async (data) => {
  const apiInstance = new apiServices(axiosAPIInstance);
  return await apiInstance.getOneTimePassword(data);
};

export const getMyAssignmentAnalytics = async () => {
  const apiInstance = new apiServices(axiosAPIInstance);
  return await apiInstance.getMyAssignmentAnalytics();
};

export const getTeacherStudentCount = async () => {
  const apiInstance = new apiServices(axiosAPIInstance);
  return await apiInstance.getTeacherStudentCount();
};

export const getTopTeachers = async () => {
  const apiInstance = new apiServices(axiosAPIInstance);
  return await apiInstance.getTopTeachers();
};

export const getTeacherAssignment = async (lecture_id="",student_id="",classname="",subject="",search="",student_name="",assignment_id="") => {
  const apiInstance = new apiServices(axiosAPIInstance);
  return await apiInstance.getTeacherAssignment(lecture_id,student_id,classname,subject,search,student_name,assignment_id);
};

export const updateAssignment = async (que_id, formData) => {
  const apiInstance = new apiServices(axiosAPIInstance);
  return await apiInstance.updateAssignment(que_id, formData);
}

export const getMySubject = async () => {
  const apiInstance = new apiServices(axiosAPIInstance);
  return await apiInstance.getMySubject();
};

export const getMySubjectWatchtime = async (lectureId) => {
  const apiInstance = new apiServices(axiosAPIInstance);
  return await apiInstance.getMySubjectWatchtime(lectureId);
};

export const getStudentUpcommingMeetingByDate = async (year, month) => {
  const apiInstance = new apiServices(axiosAPIInstance);
  return await apiInstance.getStudentUpcommingMeetingByDate(year, month);
};

export const getAllUpcommingByDate = async (year, month) => {
  const apiInstance = new apiServices(axiosAPIInstance);
  return await apiInstance.getAllUpcommingByDate(year, month);
};

export const getTeacherLectureCompletion = async (teacherId) => {
  const apiInstance = new apiServices(axiosAPIInstance);
  return await apiInstance.getTeacherLectureCompletion(teacherId);
};

export const getWatchtimeComparison = async (teacherId) => {
  const apiInstance = new apiServices(axiosAPIInstance);
  return await apiInstance.getWatchtimeComparison(teacherId);
};
export const updateWatchtime = async (formData) => {
  const apiInstance = new apiServices(axiosAPIInstance);
  return await apiInstance.updateWatchtime(formData);
}

export const commentWatchtimeGraph = async (filter_by="") => {
  const apiInstance = new apiServices(axiosAPIInstance);
  return await apiInstance.commentWatchtimeGraph(filter_by);
}

export const watchtimeBySubject = async () => {
  const apiInstance = new apiServices(axiosAPIInstance);
  return await apiInstance.watchtimeBySubject();
}

export const getRatingsCount = async () => {
  const apiInstance = new apiServices(axiosAPIInstance);
  return await apiInstance.getRatingsCount();
}

export const getAllTeachers = async (
  academicYearParam,
  courseParam,
  classListParam,
  departmentsParam,
  search,
  page,
  pageSize
) => {
  const apiInstance = new apiServices(axiosAPIInstance);
  return await apiInstance.getAllTeachers(
    academicYearParam,
    courseParam,
    classListParam,
    departmentsParam,
    search,
    page,
    pageSize
  );
};

export const getAllStudent = async (
  academicYearParam,
  courseParam,
  classListParam,
  departmentsParam,
  search,
  page,
  pageSize
) => {
  const apiInstance = new apiServices(axiosAPIInstance);
  return await apiInstance.getAllStudent(
    academicYearParam,
    courseParam,
    classListParam,
    departmentsParam,
    search,
    page,
    pageSize
  );
};

export const postRewriteAI = async (formData) => {
  const apiInstance = new apiServices(axiosAPIInstance);
  return await apiInstance.postRewriteAI(formData);
};

export const getSubjectCompletion = async () => {
  const apiInstance = new apiServices(axiosAPIInstance);
  return await apiInstance.getSubjectCompletion();
}

export const getAllSubject = async () => {
  const apiInstance = new apiServices(axiosAPIInstance);
  return await apiInstance.getAllSubject();
}

export const updatePersonalised = async (formData) => {
  const apiInstance = new apiServices(axiosAPIInstance);
  return await apiInstance.updatePersonalised(formData);
};

export const getLecAttachment = async (lectureId) => {
  const apiInstance = new apiServices(axiosAPIInstance);
  return await apiInstance.getLecAttachment(lectureId);
};

export const deleteAttachment = async (deleteId) => {
  const apiInstance = new apiServices(axiosAPIInstance);
  return await apiInstance.deleteAttachment(deleteId);
};

