import useAxios from "../useAxios";

const getTaskManagement = (userId, value, meetingType, page, searchQuery, searchById, date) => {
  const { response, error, loading, reFetch, setloading } = useAxios({
    url: `api/v1/users/${userId}/action_item/?${value}=true&status=${meetingType}&page=${page || 1}&search=${searchQuery}&id=${searchById || ''}&date=${date}`,
    method: 'get',
  });

  return {
    taskManagementMeetings: response?.data || [],
    taskManagementMeetingsError: error,
    taskManagementMeetingsLoading: loading,
    reFetchTaskManagementMeetings: reFetch,
    taskManagementMeetingCount: response?.count || '',
    setloading: setloading
  };
};

export default getTaskManagement;
