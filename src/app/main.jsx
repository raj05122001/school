"use client";
import { usePathname } from "next/navigation";
import React, { useEffect, useState } from "react";
import { Toaster } from "react-hot-toast";
import { Suspense } from "react";
import Footer from "@/components/Footer/Footer";
import Sidebar from "@/components/Sidebar/Sidebar";
import { Box } from "@mui/material";
import { ThemeProvider } from "@/hooks/ThemeContext";

const Main = ({ children }) => {
  const pathname = usePathname();
  const [open, setOpen] = useState(true);

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

  return (
    <>
      <Toaster position="bottom-center" reverseOrder={false} />
      {pathname === "/login" ||
      pathname === "/forget-password" ||
      pathname === "/registration" ||
      pathname === "/vipsbot" ||
      pathname === "/invite-accept" ? (
        <>{children}</>
      ) : (
        <ThemeProvider>
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
            <Box sx={{ display: "flex", flexDirection: "column" }}>
              <Suspense>{children}</Suspense>
              <Box sx={{ mt: "auto" }}>
                <Footer />
              </Box>
            </Box>
          </Box>
        </ThemeProvider>
      )}
    </>
  );
};

export default Main;
