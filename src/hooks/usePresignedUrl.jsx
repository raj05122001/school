import { getPresignedUrl } from "@/api/apiHelper";

const usePresignedUrl = () => {
  const fetchPresignedUrl = async (data) => {
    try {
      const response = await getPresignedUrl(data);
      return {
        presigned_url: response?.data?.presigned_url,
        file_type: data?.file_type,
      };
    } catch (err) {
      console.error("Failed to get presigned URL:", err);
    }
  };

  return { fetchPresignedUrl };
};

export default usePresignedUrl;