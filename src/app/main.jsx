"use client";
import { usePathname } from "next/navigation";
import React, { useState } from "react";
import { Toaster } from "react-hot-toast";
import { Suspense } from "react";
import Footer from "@/components/Footer/Footer";
import Sidebar from "@/components/Sidebar/Sidebar";
import { Box } from "@mui/material";

const Main = ({ children }) => {
  const pathname = usePathname();
  const [open, setOpen] = useState(false);

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
      )}
    </>
  );
};

export default Main;
