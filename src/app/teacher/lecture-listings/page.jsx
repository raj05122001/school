"use client";
import {
  Box,
  Grid,
  Pagination,
  Typography,
  TextField,
  InputAdornment,
} from "@mui/material";
import { FaChalkboardTeacher, FaSearch } from "react-icons/fa";
import React, { useEffect, useMemo, useState } from "react";
import ListingCard from "@/commonComponents/ListingCard/ListingCard";
import TeacherFilters from "@/components/teacher/lecture-listings/Filters/TeacherFilters";
import { getTeacherAllLecture } from "@/api/apiHelper";
import { decodeToken } from "react-jwt";
import Cookies from "js-cookie";
import { useSearchParams, useRouter, usePathname } from "next/navigation";
import { useThemeContext } from "@/hooks/ThemeContext";
import LectureListingCardSkeleton from "@/commonComponents/Skeleton/LectureListingCardSkeleton/LectureListingCardSkeleton";

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

const Page = () => {
  const { isDarkMode, primaryColor } = useThemeContext();
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

  const [localSearchInput, setLocalSearchInput] = useState(searchQuery);

  useEffect(() => {
    setLocalSearchInput(searchQuery);
  }, [searchQuery]);

  useEffect(() => {
    fetchData();
  }, [activePage, classValue, subject, searchQuery, month, lectureType]);

  const fetchData = async () => {
    setIsLoading(true);
    try {
      console.log("🔹 Fetching lectures with params:", {
        teacher_id: userDetails?.teacher_id,
        searchQuery,
        month,
        lectureType,
        activePage,
        pageSize: 16,
        subject,
        classValue,
      });

      const apiResponse = await getTeacherAllLecture(
        userDetails?.teacher_id,
        searchQuery,
        month,
        lectureType,
        activePage,
        16,
        subject,
        classValue
      );

      console.log("✅ Raw API response:", apiResponse);

      if (apiResponse?.data?.success) {
        console.log("📚 Lecture list from API:", apiResponse?.data);
        setLectureList(apiResponse?.data);
      } else {
        console.warn("⚠️ API success false:", apiResponse?.data);
      }
    } catch (error) {
      console.error("❌ Error in fetchData:", error);
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
    router.push(`/teacher/lecture-listings/${id}`);
  };

  const handleSearchChange = (e) => {
    setLocalSearchInput(e.target.value);
  };

  const prevSearchRef = React.useRef(localSearchInput);

  useEffect(() => {
    const handler = setTimeout(() => {
      const next = (localSearchInput || "").trim();
      const prev = (prevSearchRef.current || "").trim();

      // ✅ agar search text same hai, kuch bhi mat karo
      if (next === prev) return;

      prevSearchRef.current = next;

      const newSearchParams = new URLSearchParams(searchParams.toString());

      if (next) {
        newSearchParams.set("globalSearch", next);
      } else {
        newSearchParams.delete("globalSearch");
      }

      // ✅ page reset only when search changes
      newSearchParams.set("activePage", "1");

      router.push(`${pathname}?${newSearchParams.toString()}`);
    }, 500);

    return () => clearTimeout(handler);
  }, [localSearchInput, pathname, router, searchParams]);

  const flattenValuesToString = (obj, visited = new Set()) => {
    if (obj === null || obj === undefined) return "";

    if (typeof obj !== "object") return String(obj);

    if (visited.has(obj)) return "";
    visited.add(obj);

    let values = [];

    if (Array.isArray(obj)) {
      for (const item of obj) {
        values.push(flattenValuesToString(item, visited));
      }
    } else {
      for (const key of Object.keys(obj)) {
        values.push(flattenValuesToString(obj[key], visited));
      }
    }

    return values.join(" ");
  };

  const filteredLectures = useMemo(() => {
    const list = lectureList?.data || [];
    if (!searchQuery.trim()) return list;

    const q = searchQuery.toLowerCase();

    const result = list.filter((item) => {
      const haystack = flattenValuesToString(item).toLowerCase();
      return haystack.includes(q);
    });

    console.log("🎯 Filtered lectures (deep search):", {
      searchQuery,
      totalFromApi: list.length,
      totalAfterFilter: result.length,
    });

    return result;
  }, [lectureList, searchQuery]);

  const filters = useMemo(
    () => (
      <TeacherFilters
        classValue={classValue}
        subject={subject}
        searchQuery={searchQuery}
        month={month}
        lectureType={lectureType}
        localSearchInput={localSearchInput}
        onSearchChange={handleSearchChange}
        isDarkMode={isDarkMode}
        primaryColor={primaryColor}
      />
    ),
    [
      classValue,
      subject,
      searchQuery,
      month,
      lectureType,
      localSearchInput,
      isDarkMode,
      primaryColor,
    ]
  );

  return (
    <Box sx={{ width: "100%", height: "100%" }}>
      {filters}

  
      <Grid container spacing={2}>
        {isLoading ? (
          Array.from({ length: 16 }, (_, ind) => (
            <Grid item xs={12} sm={4} md={3} key={ind} spacing={2}>
              <LectureListingCardSkeleton />
            </Grid>
          ))
        ) : filteredLectures.length > 0 ? (
          filteredLectures.map((value, index) => (
            <Grid item xs={12} sm={4} md={3} key={index}>
              <ListingCard data={value} onClick={handleChangeRoute} />
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
              py: 8,
            }}
          >
            <FaChalkboardTeacher
              size={60}
              color={
                isDarkMode
                  ? darkModeStyles.paginationItemColor
                  : lightModeStyles.paginationItemColor
              }
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
              No lectures found
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
              Try changing the search text or filters.
            </Typography>
          </Grid>
        )}
      </Grid>

      {lectureList?.data?.length > 0 && lectureList?.total > 1 && (
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
      )}
    </Box>
  );
};

export default Page;
