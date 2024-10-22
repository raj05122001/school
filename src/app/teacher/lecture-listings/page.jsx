"use client";
import { Box, Grid, Pagination } from "@mui/material";
import React, { useEffect, useState } from "react";
import ListingCard from "@/commonComponents/ListingCard/ListingCard";
import Filters from "@/components/teacher/lecture-listings/Filters/Filters";
import { getTeacherAllLecture } from "@/api/apiHelper";
import { decodeToken } from "react-jwt";
import Cookies from "js-cookie";
import { useSearchParams, useRouter, usePathname } from "next/navigation";
import { useThemeContext } from "@/hooks/ThemeContext";
import LectureListingCardSkeleton from "@/commonComponents/Skeleton/LectureListingCardSkeleton/LectureListingCardSkeleton";

const page = () => {
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

  const fetchData = async () => {
    setIsLoading(true);
    try {
      const apiResponse = await getTeacherAllLecture(
        userDetails?.teacher_id,
        encodeURI(searchQuery),
        // getDate,
        "",
        // selectedType,
        "",
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

  // Define light and dark mode styles
  const darkModeStyles = {
    backgroundColor: "#1a1a1a",
    paginationItemColor: "#ffffff",
    paginationBg: "#333333",
    paginationSelectedBg: "#005bb5", // Example blue for selected item
    paginationSelectedColor: "#ffffff",
  };

  const lightModeStyles = {
    backgroundColor: "#ffffff",
    paginationItemColor: "#000000",
    paginationBg: "#f0f0f0",
    paginationSelectedBg: "#005bb5", // Example blue for selected item
    paginationSelectedColor: "#ffffff",
  };

  return (
    <Box sx={{ width: "100%", height: "100%" }}>
      <Filters />
      <Grid container>
        {isLoading
          ? Array.from({ length: 9 }, (_, ind) => (
              <Grid item xs={12} sm={4} key={ind} spacing={2}>
                <LectureListingCardSkeleton />
              </Grid>
            ))
          : lectureList?.data?.map((value, index) => (
              <Grid item xs={12} sm={4} key={index}>
                <ListingCard data={value} />
              </Grid>
            ))}
      </Grid>
      {lectureList?.data?.length > 1 ? (
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

export default page;
