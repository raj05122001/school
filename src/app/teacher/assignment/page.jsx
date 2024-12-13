"use client";
import React, { useMemo, useState, useEffect } from "react";
import TeacherFilters from "@/components/teacher/lecture-listings/Filters/TeacherFilters";
import { Box, Typography, Grid,Pagination } from "@mui/material";
import { useSearchParams, useRouter, usePathname } from "next/navigation";
import { useThemeContext } from "@/hooks/ThemeContext";
import { MdAssignment } from "react-icons/md";
import AssignmentCard from "@/components/teacher/Assignment/AssignmentCard";
import { getTeacherAllLecture,getTeacherAssignment } from "@/api/apiHelper";
import LectureListingCardSkeleton from "@/commonComponents/Skeleton/LectureListingCardSkeleton/LectureListingCardSkeleton";
import { FaChalkboardTeacher } from "react-icons/fa";
import { decodeToken } from "react-jwt";
import Cookies from "js-cookie";

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

  const encodeURI = (value) => {
    return encodeURIComponent(value);
  };

  useEffect(() => {
    fetchData();
  }, [activePage, classValue, subject, searchQuery]);

  const fetchData = async () => {
    setIsLoading(true);
    try {
      const apiResponse = await getTeacherAssignment("","",classValue,subject,searchQuery);
      if (apiResponse?.success) {
        setLectureList(apiResponse?.data?.lectures);
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

  const handleChangeRoute = (id) => {
    router.push(`/teacher/assignment/${id}`);
  };

  const filters = useMemo(
    () => (
      <TeacherFilters
        classValue={classValue}
        subject={subject}
        searchQuery={searchQuery}
        month={month}
        lectureType={lectureType}
        isAssignment={true}
        label={
          <Box sx={{ display: "flex", alignItems: "center", gap: 1 }}>
            <MdAssignment size={30} color={primaryColor} />
            <Typography variant="h4" color={primaryColor}>
              Lecture Assessment
            </Typography>
          </Box>
        }
      />
    ),
    [classValue, subject, searchQuery, month, lectureType,isDarkMode]
  );
  return (
    <Box sx={{ width: "100%", height: "100%" }}>
      {filters}
      <Grid container spacing={2}>
        {isLoading ? (
          Array.from({ length: 9 }, (_, ind) => (
            <Grid item xs={12} sm={4} key={ind} spacing={2}>
              <LectureListingCardSkeleton />
            </Grid>
          ))
        ) : lectureList?.data?.length > 0 ? (
          lectureList?.data?.map((value, index) => (
            <Grid item xs={12} sm={4} key={index}>
              <AssignmentCard data={value} onClick={handleChangeRoute} />
            </Grid>
          ))
        ) : (
          <Grid
            item
            xs={12}
            sx={{
              display: "flex",
              flexDirection: "column",
              alignItems: "center",
              justifyContent: "center",
              height: "100%",
            }}
          >
            <FaChalkboardTeacher
              size={30}
              sx={{
                fontSize: 80,
                color: isDarkMode
                  ? darkModeStyles.paginationItemColor
                  : lightModeStyles.paginationItemColor,
              }}
            />
            <Typography
              variant="h5"
              align="center"
              sx={{
                marginTop: 2,
                color: isDarkMode
                  ? darkModeStyles.paginationItemColor
                  : lightModeStyles.paginationItemColor,
                fontWeight: "bold",
              }}
            >
              No lectures assignment available at the moment
            </Typography>
            <Typography
              variant="body1"
              align="center"
              sx={{
                marginTop: 1,
                color: isDarkMode
                  ? darkModeStyles.paginationItemColor
                  : lightModeStyles.paginationItemColor,
              }}
            >
              Please check back later or modify your search filters.
            </Typography>
          </Grid>
        )}
      </Grid>
      {lectureList?.data?.length > 0 && lectureList?.total > 1 ? (
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
            count={lectureList?.total}
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
