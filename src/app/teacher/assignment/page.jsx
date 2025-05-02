"use client";
import React, { useMemo, useState, useEffect } from "react";
import TeacherFilters from "@/components/teacher/lecture-listings/Filters/TeacherFilters";
import {
  Box,
  Typography,
  Grid,
  Pagination,
  Table,
  TableHead,
  TableRow,
  TableCell,
  TableBody,
} from "@mui/material";
import { useSearchParams, useRouter, usePathname } from "next/navigation";
import { useThemeContext } from "@/hooks/ThemeContext";
import { MdAssignment } from "react-icons/md";
import AssignmentCard from "@/components/teacher/Assignment/AssignmentCard";
import { getTeacherAllLecture, getTeacherAssignment } from "@/api/apiHelper";
import LectureListingCardSkeleton from "@/commonComponents/Skeleton/LectureListingCardSkeleton/LectureListingCardSkeleton";
import { FaChalkboardTeacher } from "react-icons/fa";
import { decodeToken } from "react-jwt";
import Cookies from "js-cookie";
import ChapterStatus from "@/components/teacher/Assignment/ChapterStatus";
import SearchWithFilter from "@/components/teacher/Assignment/SearchWithFilter";
import AssignmentTable from "@/components/teacher/Assignment/AssignmentTable";
import CalendarIconCustom from "@/commonComponents/CalendarIconCustom/CalendarIconCustom";

const Assignment = () => {
  const { isDarkMode, primaryColor, secondaryColor } = useThemeContext();
  const userDetails = decodeToken(Cookies.get("ACCESS_TOKEN"));
  const searchParams = useSearchParams();
  const router = useRouter();
  const pathname = usePathname();

  const classValue = searchParams.get("class") || "";
  const subject = searchParams.get("subject") || "";
  const searchQuery = searchParams.get("globalSearch") || "";
  const month = searchParams.get("month") || "";
  const lectureType = searchParams.get("lectureType") || "";
  const activePage = parseInt(searchParams.get("activePage")) || 1;

  const [lectureList, setLectureList] = useState([]);
  const [isLoading, setIsLoading] = useState(true);

  const darkModeStyles = {
    backgroundColor: "#1a1a1a",
    paginationItemColor: "#ffffff",
    paginationBg: "#333333",
    paginationSelectedBg: "#005bb5",
    paginationSelectedColor: "#ffffff",
  };

  const lightModeStyles = {
    backgroundColor: "#ffffff",
    paginationItemColor: "#000000",
    paginationBg: "#f0f0f0",
    paginationSelectedBg: "#005bb5",
    paginationSelectedColor: "#ffffff",
  };

  useEffect(() => {
    fetchData();
  }, [activePage, classValue, subject, searchQuery]);

  const fetchData = async () => {
    setIsLoading(true);
    try {
      const apiResponse = await getTeacherAssignment(
        "",
        "",
        classValue,
        subject,
        searchQuery,
        "",
        "",
        activePage
      );
      if (apiResponse?.success) {
        setLectureList(apiResponse?.data);
      }
    } catch (error) {
      console.error(error);
    } finally {
      setIsLoading(false);
    }
  };

  const handleChange = (event, value) => {
    const newSearchParams = new URLSearchParams(searchParams.toString());
    newSearchParams.set("activePage", value);
    router.push(`${pathname}?${newSearchParams.toString()}`);
  };

  return (
    <Box sx={{ width: "100%", height: "100%", p: 4 }}>
      <ChapterStatus
        totalChapters={lectureList.total_lectures}
        checked={lectureList?.total_checked}
        notChecked={lectureList?.total_not_checked}
      />
      <SearchWithFilter />
      <AssignmentTable data={lectureList?.lectures?.data} />

      {lectureList?.lectures?.data?.length > 0 && lectureList?.lectures?.total > 1 ? (
        <Box
          sx={{
            display: "flex",
            justifyContent: "center",
            alignItems: "center",
            padding: 2,
          }}
        >
          <Pagination
            page={activePage}
            onChange={handleChange}
            count={lectureList?.lectures?.total}
            variant="outlined"
            color="primary"
            size="large"
            sx={{
              "& .MuiPaginationItem-root": {
                color: isDarkMode
                  ? darkModeStyles.paginationItemColor
                  : lightModeStyles.paginationItemColor,
              },
              "& .Mui-selected": {
                backgroundColor: isDarkMode
                  ? darkModeStyles.paginationSelectedBg
                  : lightModeStyles.paginationSelectedBg,
                color: isDarkMode
                  ? darkModeStyles.paginationSelectedColor
                  : lightModeStyles.paginationSelectedColor,
              },
            }}
          />
        </Box>
      ) : (
        ""
      )}
    </Box>
  );
};

export default Assignment;
