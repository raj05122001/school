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

export const AppContextProvider = createContext({});

const Main = ({ children }) => {
  const pathname = usePathname();
  const [open, setOpen] = useState(true);
  const [openRecordingDrawer, setOpenRecordingDrawer] = useState(false);
  const [recordingData, setRecordingData] = useState({});

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

  useEffect(() => {
    if (openRecordingDrawer) {
      document.body.style.overflowY = "hidden";
      document.body.style.position = "fixed";
    } else {
      document.body.style.overflowY = "scroll";
      document.body.style.position = "";
    }
    return () => {
      document.body.style.position = "";
    };
  }, [openRecordingDrawer]);

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
              setRecordingData,
              setOpenRecordingDrawer,
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