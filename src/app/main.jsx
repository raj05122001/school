"use client";
import { usePathname } from "next/navigation";
import React, { useEffect, useState, createContext } from "react";
import { Toaster } from "react-hot-toast";
import { Suspense } from "react";
import Footer from "@/components/Footer/Footer";
import Sidebar from "@/components/Sidebar/Sidebar";
import { Box } from "@mui/material";
import { ThemeProvider } from "@/hooks/ThemeContext";
import LectureRecorder from "@/components/LectureRecorder/LectureRecorder";
import CreatingLecture from "@/components/teacher/LectureCreate/CreatingLecture";

export const AppContextProvider = createContext({});

const Main = ({ children }) => {
  const pathname = usePathname();
  const [open, setOpen] = useState(true);
  const [openRecordingDrawer, setOpenRecordingDrawer] = useState(false);
  const [recordingData, setRecordingData] = useState({});
  const [openCreateLecture, setOpenCreateLecture] = useState(false);
  const [isEditLecture, setIsEditLecture] = useState(false);

  const handleResize = () => {
    if (window.innerWidth < 980) {
      setOpen(false);
    } else {
      setOpen(true); // Optional: If you want to reopen the sidebar when the width is greater than 980
    }
  };

  useEffect(() => {
    handleResize();

    window.addEventListener("resize", handleResize);

    return () => {
      window.removeEventListener("resize", handleResize);
    };
  }, []);

  const closeDrawer = () => {
    setOpenRecordingDrawer(false);
  };

  const handleCloseCreateLecture = () => {
    setOpenCreateLecture(false);
    setRecordingData({});
  };

  const handleCreateLecture = (value = "", isEditMode = false) => {
    if (isEditMode) {
      setRecordingData(value);
      setIsEditLecture(true);
      setOpenCreateLecture(true);
    } else {
      setIsEditLecture(false);
      setRecordingData({});
      setOpenCreateLecture(true);
    }
  };

  const handleLectureRecord = (value) => {
    setRecordingData(value);
    setOpenRecordingDrawer(true);
  };

  return (
    <Suspense>
      <Toaster position="bottom-center" reverseOrder={false} />
      {pathname === "/login" ||
      pathname === "/forget-password" ||
      pathname === "/registration" ||
      pathname === "/vipsbot" ||
      pathname === "/invite-accept" ? (
        <>{children}</>
      ) : (
        <ThemeProvider>
          <AppContextProvider.Provider
            value={{
              openRecordingDrawer,
              handleCreateLecture,
              openCreateLecture,
              handleLectureRecord,
            }}
          >
            <Box
              sx={{
                display: "grid",
                gridTemplateColumns: open ? "240px 1fr" : "60px 1fr",
                minHeight: "100vh",
              }}
            >
              <Box>
                <Sidebar open={open} setOpen={setOpen} />
              </Box>
              {openRecordingDrawer && (
                <LectureRecorder
                  open={openRecordingDrawer}
                  closeDrawer={closeDrawer}
                  recordingData={recordingData}
                />
              )}
              {openCreateLecture && (
                <CreatingLecture
                  open={openCreateLecture}
                  handleClose={handleCloseCreateLecture}
                  isEditMode={isEditLecture}
                  lecture={recordingData}
                />
              )}
              <Box sx={{ display: "flex", flexDirection: "column" }}>
                {children}
                <Box sx={{ mt: "auto" }}>
                  <Footer />
                </Box>
              </Box>
            </Box>
          </AppContextProvider.Provider>
        </ThemeProvider>
      )}
    </Suspense>
  );
};

export default Main;
