import { updatePersonalised } from "@/api/apiHelper";
import { useEffect, useRef } from "react";
import { decodeToken } from "react-jwt";
import Cookies from "js-cookie";

const usePersonalisedRecommendations = (id, section, useref, comment = "") => {
  const userDetails = decodeToken(Cookies.get("ACCESS_TOKEN"));
  const updateCalled = useRef(false);

  useEffect(() => {
    const updateData = async () => {
      updateCalled.current = true;
      try {
        const formData = {
          student: userDetails?.student_id,
          lecture: id,
          section: section,
          comment: comment,
        };
        await updatePersonalised(formData);
      } catch (error) {
        console.error(error);
      }
    };

    const handleScrollAndUpdate = async () => {
      if (updateCalled.current) {
        return;
      }

      if (useref.current) {
        const { scrollTop, scrollHeight, clientHeight } = useref.current;
        if (
          scrollHeight > clientHeight &&
          scrollTop + clientHeight >= scrollHeight / 2
        ) {
          await updateData();
        } else if (scrollHeight === clientHeight) {
          await updateData();
        }
      }
    };

    useref.current?.addEventListener("scroll", handleScrollAndUpdate);
    useref.current?.addEventListener("mouseenter", handleScrollAndUpdate);
    useref.current?.addEventListener("mouseleave", handleScrollAndUpdate);

    return () => {
      useref.current?.removeEventListener("scroll", handleScrollAndUpdate);
      useref.current?.removeEventListener("mouseenter", handleScrollAndUpdate);
      useref.current?.removeEventListener("mouseleave", handleScrollAndUpdate);
    };
  }, [useref, userDetails, section, comment, id]);

  // Optionally, return any values or handlers you might want to use elsewhere
};

export default usePersonalisedRecommendations;
