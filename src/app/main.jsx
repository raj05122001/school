"use client";
import { usePathname } from "next/navigation";
import React, { useEffect, useState, createContext } from "react";
import { Toaster } from "react-hot-toast";
import { Suspense } from "react";
import Footer from "@/components/Footer/Footer";
import Sidebar from "@/components/Sidebar/Sidebar";
import { Box, Button, IconButton } from "@mui/material";
import { ThemeProvider } from "@/hooks/ThemeContext";
import LectureRecorder from "@/components/LectureRecorder/LectureRecorder";
import CreatingLecture from "@/components/teacher/LectureCreate/CreatingLecture";
import ChatBot from "@/components/ChatBot/ChatBot";
import { BsChatSquareText } from "react-icons/bs";
import Image from "next/image";
import NewChatbot from "@/components/ChatBot/NewChatbot";
import GreetingCardNew from "@/components/admin/dashboard/GreetingCard/GreetingCardNew";

export const AppContextProvider = createContext({});

const Main = ({ children }) => {
  const isTrialAccount =
    process.env.NEXT_PUBLIC_iSTRIALACCOUNT === "true" ? true : false;
  const s3FileName = process.env.NEXT_PUBLIC_FILE_NAME === "edu/" ? "edu/" : "";

  console.log("s3FileName : ", s3FileName);

  const pathname = usePathname();
  const [open, setOpen] = useState(true);
  const [openRecordingDrawer, setOpenRecordingDrawer] = useState(false);
  const [recordingData, setRecordingData] = useState({});
  const [openCreateLecture, setOpenCreateLecture] = useState(false);
  const [isEditLecture, setIsEditLecture] = useState(false);
  const [isOpenChatBot, setIsOpenChatBot] = useState(false);
  const [userInput, setUserInput] = useState("");

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

  const handelChatBotText = (value) => {
    setUserInput(value);
    setIsOpenChatBot(true);
  };

  return (
    <Suspense>
      <Toaster position="bottom-center" reverseOrder={false} />
      {pathname === "/login" ||
      pathname === "/forget-password" ||
      pathname === "/registration" ||
      pathname === "/signup" ||
      pathname === "/vipsbot" ||
      pathname === "/terms-and-conditions" ||
      pathname === "/delete-account" ||
      pathname === "/privacy-policy" ||
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
              handelChatBotText,
              isTrialAccount,
              s3FileName,
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
                <Box>
                  {!pathname.includes("lecture-listings/") && (
                    <GreetingCardNew />
                  )}
                </Box>
                {children}
                <Box sx={{ mt: "auto" }}>
                  <Footer />
                </Box>
              </Box>
            </Box>

            {pathname.includes("lecture-listings/") && (
              <Box position="fixed" bottom={4} right={4}>
                <IconButton
                  disableRipple
                  onClick={() => {
                    setUserInput("");
                    setIsOpenChatBot((prev) => !prev);
                  }}
                  size="large"
                  color="primary"
                >
                  {/* <Image
                    className="cursor-pointer"
                    src="/chatbot.png"
                    alt="chat bot"
                    width={50}
                    height={50}
                  /> */}
                  <Button
                    disableRipple
                    variant="contained"
                    sx={{
                      display: "flex",
                      width: "161px",
                      height: "59px",
                      padding: "15px 17px",
                      alignItems: "center",
                      gap: "11px",
                      flexShrink: 0,
                      textTransform: "none",
                      borderRadius: "17px",
                      border: "2px solid #051700",
                      background:
                        "linear-gradient(238deg, #16AA54 -15.62%, #094422 82.04%)",
                    }}
                  >
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      width="24"
                      height="25"
                      viewBox="0 0 24 25"
                      fill="none"
                    >
                      <path
                        d="M8.68006 13.2201H10.4201V17.2701C10.4201 17.8701 11.1601 18.1501 11.5601 17.7001L15.8201 12.8601C16.1901 12.4401 15.8901 11.7801 15.3301 11.7801H13.5901V7.73008C13.5901 7.13008 12.8501 6.85008 12.4501 7.30008L8.19006 12.1401C7.82006 12.5601 8.12006 13.2201 8.68006 13.2201Z"
                        stroke="#FCFBFA"
                        stroke-width="1.5"
                        stroke-miterlimit="10"
                        stroke-linecap="round"
                        stroke-linejoin="round"
                      />
                      <path
                        d="M11.9702 22.5C17.4931 22.5 21.9702 18.0228 21.9702 12.5C21.9702 6.97715 17.4931 2.5 11.9702 2.5C6.44737 2.5 1.97021 6.97715 1.97021 12.5C1.97021 18.0228 6.44737 22.5 11.9702 22.5Z"
                        stroke="#FCFBFA"
                        stroke-width="1.5"
                        stroke-miterlimit="10"
                        stroke-linecap="round"
                        stroke-linejoin="round"
                      />
                    </svg>{" "}
                    <span
                      style={{
                        color: "#FFF",
                        fontFamily: "Inter",
                        fontSize: "20px",
                        fontStyle: "normal",
                        fontWeight: 400,
                        lineHeight: "28px",
                      }}
                    >
                      Chatbot
                    </span>
                  </Button>
                </IconButton>
                {isOpenChatBot && (
                  <NewChatbot
                    suggestionInput={userInput}
                    setIsOpenChatBot={setIsOpenChatBot}
                  />
                )}
              </Box>
            )}
          </AppContextProvider.Provider>
        </ThemeProvider>
      )}
    </Suspense>
  );
};

export default Main;
