"use client";
import { usePathname } from "next/navigation";
import React, { useEffect, useState, createContext } from "react";
import { Toaster } from "react-hot-toast";
import { Suspense } from "react";
import Footer from "@/components/Footer/Footer";
import Sidebar from "@/components/Sidebar/Sidebar";
import { Box, IconButton } from "@mui/material";
import { ThemeProvider } from "@/hooks/ThemeContext";
import LectureRecorder from "@/components/LectureRecorder/LectureRecorder";
import CreatingLecture from "@/components/teacher/LectureCreate/CreatingLecture";
import ChatBot from "@/components/ChatBot/ChatBot";
import { BsChatSquareText } from "react-icons/bs";
import Image from "next/image";
import NewChatbot from "@/components/ChatBot/NewChatbot";

export const AppContextProvider = createContext({});

const Main = ({ children }) => {
  const isTrialAccount=process.env.NEXT_PUBLIC_iSTRIALACCOUNT==="true"? true : false
  const s3FileName=process.env.NEXT_PUBLIC_FILE_NAME==="edu/"? "edu/" : ""

  console.log("s3FileName : ",s3FileName)

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
              s3FileName
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

            {pathname.includes("lecture-listings/") && (
              <Box position="fixed" bottom={4} right={4}>
                <IconButton
                  onClick={() => {
                    setUserInput("");
                    setIsOpenChatBot((prev) => !prev);
                  }}
                  size="large"
                  color="primary"
                >
                  <Image
                    className="cursor-pointer"
                    src="/chatbot.png"
                    alt="chat bot"
                    width={50}
                    height={50}
                  />
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
