import { Box } from "@mui/material";
import React, { useMemo } from "react";
// import ProfileCard from "../ProfileCard/ProfileCard";
// import SubjectCompletion from "../SubjectCompletion/SubjectCompletion";
// import LectureDuration from "../LectureDuration/LectureDuration";
import Image from "next/image";
import TotalLectures from "../TotalLectures/TotalLectures";
import AverageLectureDuration from "../AverageLectureDuration/AverageLectureDuration";
import StudentCount from "../StudentCount/StudentCount";
import TeacherCount from "../TeacherCount/TeacherCount";
import ProfileCardAdmin from "../ProfileCardAdmin/ProfileCardAdmin";

function HeroAdmin({ countData, loading }) {
  const totalLectures = useMemo(
    () => <TotalLectures countData={countData} loading={loading} />,
    [countData, loading]
  );
  const averageLectureDuration = useMemo(
    () => <AverageLectureDuration countData={countData} loading={loading} />,
    [countData, loading]
  );
  const studentCount = useMemo(
    () => <StudentCount countData={countData} loading={loading} />,
    [countData, loading]
  );
  const teacherCount = useMemo(
    () => <TeacherCount countData={countData} loading={loading} />,
    [countData, loading]
  );
  return (
    <Box
      sx={{
        width: "100%",
        height: "316px",
        display: "flex",
        flexShrink: 0,
        borderRadius: "20px",
        padding: "15px 0px 0px 16px",
        background: "var(--Green-dark-2, #0B2311);",
        position: "relative",
        overflow: "hidden",
      }}
    >
      <Box
        sx={{
          display: "flex",
          flexDirection: "column",
          width: "100%",
          height: "100%",
          flexShrink: 0,
        }}
      >
        <Box sx={{ marginTop: "15px", marginLeft: "16px" }}>
          <ProfileCardAdmin />
        </Box>
        <Box
          sx={{
            display: "flex",
            gap: "55.62px",
            // marginTop: "94.22px",
            // marginBottom: "53.79px",
            marginLeft: "16px",
            justifyContent: "center",
            alignItems: "center",
            height: "100%",
          }}
        >
          {/* <LectureDuration averageDuration={averageDuration} />
          <SubjectCompletion /> */}
          {totalLectures}
          {averageLectureDuration}
          {studentCount}
          {teacherCount}
        </Box>
      </Box>

      {/* Top-right SVG */}
      <Box
        sx={{
          position: "absolute",
          top: "-150px", // move it up to only show part
          right: "-125px", // move it right to show top-right curve
          width: "245px", // large enough to contain all circles
          height: "200px",
          pointerEvents: "none", // let clicks through
        }}
      >
        <svg
          xmlns="http://www.w3.org/2000/svg"
          width="300"
          height="300"
          viewBox="0 0 300 300"
          fill="none"
        >
          <circle cx="150" cy="150" r="120" stroke="#1F6F2C" strokeWidth="1" />
          <circle cx="150" cy="150" r="90" stroke="#1F6F2C" strokeWidth="1" />
          <circle cx="150" cy="150" r="60" stroke="#1F6F2C" strokeWidth="1" />
          <circle cx="150" cy="150" r="30" stroke="#1F6F2C" strokeWidth="1" />
        </svg>
      </Box>
      {/* Bottom-right SVG */}
      <Box
        sx={{
          position: "absolute",
          bottom: "-150px",
          right: "-125px",
          width: "245px",
          height: "300px",
          pointerEvents: "none",
        }}
      >
        <svg
          xmlns="http://www.w3.org/2000/svg"
          width="300"
          height="300"
          viewBox="0 0 300 300"
          fill="none"
        >
          <circle cx="150" cy="150" r="120" stroke="#1F6F2C" strokeWidth="1" />
          <circle cx="150" cy="150" r="90" stroke="#1F6F2C" strokeWidth="1" />
          <circle cx="150" cy="150" r="60" stroke="#1F6F2C" strokeWidth="1" />
          <circle cx="150" cy="150" r="30" stroke="#1F6F2C" strokeWidth="1" />
        </svg>
      </Box>
    </Box>
  );
}

export default HeroAdmin;
