import useAxios from "../useAxios";

const getTaskManagement = (userId, page, searchquery) => {
  const { response, error, loading, reFetch } = useAxios({
    url: `/api/v1/users/${userId}/user_list/?page=${page || 1}&search=${searchquery}`,
    method: 'get',
  });

  return {
    userManagementMeetings: response?.data || [],
    userManagementMeetingsError: error,
    userManagementMeetingsLoading: loading,
    reFetchUserManagementMeetings: reFetch,
    userManagementMeetingCount: response?.count || ''
  };
};

export default getTaskManagement;
