"use client";
import { Box, Grid, Pagination, Typography } from "@mui/material";
import { FaChalkboardTeacher } from "react-icons/fa";
import React, { useEffect, useMemo, useState } from "react";
import ListingCard from "@/commonComponents/ListingCard/ListingCard";
import Filters from "@/components/teacher/lecture-listings/Filters/Filters";
import { getTeacherAllLecture } from "@/api/apiHelper";
import { decodeToken } from "react-jwt";
import Cookies from "js-cookie";
import { useSearchParams, useRouter, usePathname } from "next/navigation";
import { useThemeContext } from "@/hooks/ThemeContext";
import LectureListingCardSkeleton from "@/commonComponents/Skeleton/LectureListingCardSkeleton/LectureListingCardSkeleton";

const Page = () => {
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

  useEffect(() => {
    fetchData();
  }, [activePage, classValue, subject, searchQuery, month, lectureType]);

  const encodeURI = (value) => {
    return encodeURIComponent(value);
  };

  const filters = useMemo(
    () => (
      <Filters
        classValue={classValue}
        subject={subject}
        searchQuery={searchQuery}
        month={month}
        lectureType={lectureType}
      />
    ),
    [classValue, subject, searchQuery, month, lectureType]
  );

  const fetchData = async () => {
    setIsLoading(true);
    try {
      const apiResponse = await getTeacherAllLecture(
        userDetails?.teacher_id,
        encodeURI(searchQuery),
        month,
        lectureType,
        activePage,
        9,
        encodeURI(subject),
        encodeURI(classValue)
      );
      if (apiResponse?.data?.success) {
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
              <ListingCard data={value} />
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
              No lectures available at the moment
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

export default Page;
