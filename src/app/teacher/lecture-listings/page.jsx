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

  useEffect(() => {
    const handler = setTimeout(() => {
      const newSearchParams = new URLSearchParams(searchParams.toString());

      if (localSearchInput && localSearchInput.trim()) {
        newSearchParams.set("globalSearch", localSearchInput.trim());
      } else {
        newSearchParams.delete("globalSearch");
      }

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
      />
    ),
    [classValue, subject, searchQuery, month, lectureType]
  );

  return (
    <Box sx={{ width: "100%", height: "100%" }}>
      {filters}

      <Box
        sx={{
          px: 2,
          pb: 2,
          pt: 1,
          display: "flex",
          flexDirection: { xs: "column", sm: "row" },
          alignItems: { xs: "flex-start", sm: "center" },
          justifyContent: "flex-end",
          gap: 2,
        }}
      >
        <Box
          sx={{
            width: { xs: "90%", sm: "320px", md: "420px" },
          }}
        >
          <TextField
            value={localSearchInput}
            onChange={handleSearchChange}
            placeholder="Search lectures..."
            size="small"
            fullWidth
            InputProps={{
              startAdornment: (
                <InputAdornment position="start">
                  <FaSearch
                    size={14}
                    style={{
                      opacity: 0.7,
                    }}
                  />
                </InputAdornment>
              ),
            }}
            sx={{
              "& .MuiOutlinedInput-root": {
                borderRadius: "999px",
                paddingRight: "8px",
                backgroundColor: isDarkMode ? "#020617" : "#f9fafb",
                boxShadow: isDarkMode
                  ? "0 10px 30px rgba(0,0,0,0.45)"
                  : "0 10px 30px rgba(15,23,42,0.10)",
                "& fieldset": {
                  borderColor: isDarkMode ? "#334155" : "#e5e7eb",
                },
                "&:hover fieldset": {
                  borderColor: primaryColor || "#2563eb",
                },
                "&.Mui-focused fieldset": {
                  borderColor: primaryColor || "#2563eb",
                  boxShadow: `0 0 0 1px ${primaryColor || "#2563eb"}`,
                },
              },
              "& .MuiInputBase-input": {
                fontSize: 14,
              },
            }}
          />
        </Box>
      </Box>
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
