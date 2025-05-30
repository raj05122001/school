import React, { useContext, useEffect, useState } from "react";
import {
  Box,
  Drawer,
  List,
  ListItemButton,
  ListItemIcon,
  ListItemText,
  Tooltip,
  Avatar,
  Typography,
  Collapse,
  Menu,
  MenuItem,
  IconButton,
  ListItem,
  Button,
} from "@mui/material";
import {
  MdDashboard,
  MdSchedule,
  MdPerson,
  MdVideoLibrary,
  MdTask,
  MdAssignment,
  MdLogout,
} from "react-icons/md";
import { FaChalkboardTeacher } from "react-icons/fa";
import Cookies from "js-cookie";
import { useRouter, usePathname } from "next/navigation";
import { useThemeContext } from "@/hooks/ThemeContext";
import { decodeToken } from "react-jwt";
import UserImage from "@/commonComponents/UserImage/UserImage";
import { AppContextProvider } from "@/app/main";
import Logo from "@/commonComponents/Logo/Logo";
import { LuGraduationCap } from "react-icons/lu";
import { HiOutlineChartBar } from "react-icons/hi2";
import { HiOutlineDocumentDuplicate } from "react-icons/hi2";
import {
  IoIosArrowDown,
  IoIosArrowForward,
  IoIosArrowUp,
} from "react-icons/io";
import { FaRobot } from "react-icons/fa6";

// You may adjust widths as per your design
const drawerWidth = 240;
const miniDrawerWidth = 60;

export const sidebarLinks = {
  overview: [
    {
      text: "Admin Directory",
      href: "/admin/directory",
      icon: <MdPerson size={22} />,
      show: "ADMIN",
    },
    {
      text: "Admin Dashboard",
      href: "/admin/dashboard",
      icon: <HiOutlineChartBar size={22} />,
      show: "ADMIN",
    },
    {
      text: "Lecture",
      href: "",
      icon: <HiOutlineDocumentDuplicate size={22} />,
      show: "ADMIN",
      children: [
        {
          text: "Lecture Listings",
          href: "/admin/lecture-listings",
          icon: <MdVideoLibrary size={22} />,
          show: "ADMIN",
        },
        {
          text: "Lecture Schedule",
          href: "/admin/lecture-schedule",
          icon: <MdSchedule size={22} />,
          show: "ADMIN",
        },
        {
          text: "Lecture Tracking",
          href: "/admin/lecture-tracking",
          icon: <MdTask size={22} />,
          show: "ADMIN",
        },
      ],
    },
    {
      text: "Dashboard",
      href: "/teacher/dashboard",
      icon: <HiOutlineChartBar size={22} />,
      show: "TEACHER",
    },
    {
      text: "Lecture",
      href: "",
      icon: <HiOutlineDocumentDuplicate size={22} />,
      show: "TEACHER",
      children: [
        {
          text: "Lecture Listings",
          href: "/teacher/lecture-listings",
          icon: <MdVideoLibrary size={22} />,
          show: "TEACHER",
        },
        {
          text: "Lecture Schedule",
          href: "/teacher/lecture-schedule",
          icon: <MdSchedule size={22} />,
          show: "TEACHER",
        },
        {
          text: "Lecture Tracking",
          href: "/teacher/lecture-tracking",
          icon: <MdTask size={22} />,
          show: "TEACHER",
        },
      ],
    },
    {
      text: "Assessment",
      href: "/teacher/assignment",
      icon: <LuGraduationCap size={22} />,
      show: "TEACHER",
    },
    {
      text: "Dashboard",
      href: "/student/dashboard",
      icon: <HiOutlineChartBar size={22} />,
      show: "STUDENT",
    },
    {
      text: "Lecture Listings",
      href: "/student/lecture-listings",
      icon: <HiOutlineDocumentDuplicate size={22} />,
      show: "STUDENT",
    },
    {
      text: "Chatbot",
      href: "/chat-bot",
      icon: <FaRobot size={22} />,
      show: ["TEACHER", "STUDENT", "ADMIN"],
    },
  ],
};

const Sidebar = ({ open, setOpen }) => {
  const { isDarkMode, primaryColor, secondaryColor } = useThemeContext();
  const { handleCreateLecture } = useContext(AppContextProvider);
  const userDetails = decodeToken(Cookies.get("ACCESS_TOKEN"));
  const router = useRouter();
  const pathname = usePathname();

  // Track which parent item is expanded
  const [expandedItem, setExpandedItem] = useState(null);
  const [anchorEl, setAnchorEl] = React.useState(null);

  const handleChange = (event) => {
    setAuth(event.target.checked);
  };

  const handleMenu = (event) => {
    setAnchorEl(event.currentTarget);
  };

  const handleClose = () => {
    setAnchorEl(null);
  };

  const handleRoute = async () => {
    // Example: if you need a logout method
    Cookies.remove("REFRESH_TOKEN");
    Cookies.remove("ACCESS_TOKEN");
    router.push("/login");
  };

  // Handle toggling a parent item
  const handleItemClick = (index, item) => {
    // If the item has children, toggle it
    if (item.children) {
      setExpandedItem(expandedItem === index ? null : index);
    } else {
      // Otherwise, navigate
      router.push(item.href);
    }
  };

  useEffect(() => {
    if (
      [
        "/teacher/lecture-listings",
        "/teacher/lecture-schedule",
        "/teacher/lecture-tracking",
      ].includes(pathname)
    ) {
      setExpandedItem(1);
    }
  }, []);

  console.log("userDetails : ", userDetails);

  return (
    <Drawer
      variant="permanent"
      sx={{
        width: open ? drawerWidth : miniDrawerWidth,
        flexShrink: 0,
        "& .MuiDrawer-paper": {
          width: open ? drawerWidth : miniDrawerWidth,
          transition: "width 0.3s",
          overflowX: "hidden",
          display: "flex",
          flexDirection: "column",
          justifyContent: "space-between",
          backgroundColor: "white",
          color: "black",
        },
      }}
    >
      {/* Logo / Top Section */}
      <Box>
        <Box
          sx={{
            display: "flex",
            alignItems: "center",
            justifyContent: open ? "space-between" : "center",
            borderBottom: "1px solid #C1C1C1",
            py: 1.35,
            margin: "16px",
          }}
        >
          {open && <Logo />}
        </Box>

        <Typography
          sx={{
            color: "#8C8F90",
            fontWeight: 700,
            fontSize: "14px",
            lineHeight: "14.18px",
            mt: 2,
            paddingLeft: "16px",
          }}
        >
          MAIN
        </Typography>

        {/* Sidebar Links */}
        <List>
          {sidebarLinks.overview
            .filter((val) => val.show.includes(userDetails?.role))
            .map((item, index) => {
              const isOpen = expandedItem === index;

              return (
                <Box
                  key={index}
                  sx={{
                    mb: 1,
                    fontFamily: "Inter, sans-serif",

                    paddingLeft: "16px",
                  }}
                >
                  <Tooltip
                    title={item.text}
                    placement="right"
                    disableHoverListener={open}
                  >
                    <ListItemButton
                      sx={{
                        minHeight: 48,
                        margin: "8px 0",
                        pl: open ? 2 : 1,
                        borderRight:
                          pathname === item.href ||
                          (item.text === "Lecture" &&
                            [
                              "/teacher/lecture-listings",
                              "/teacher/lecture-schedule",
                              "/teacher/lecture-tracking",
                            ].includes(pathname))
                            ? "4px solid #12DD00"
                            : "none", // Use a solid color for the border
                      }}
                      onClick={() => handleItemClick(index, item)}
                    >
                      <ListItemIcon
                        sx={{
                          color:
                            pathname === item.href ||
                            (item.text === "Lecture" &&
                              [
                                "/teacher/lecture-listings",
                                "/teacher/lecture-schedule",
                                "/teacher/lecture-tracking",
                              ].includes(pathname))
                              ? "#16AA54"
                              : "#8C8F90",
                          minWidth: open ? "unset" : "20px",
                          mr: open ? 2 : 0,
                          display: "flex",
                          justifyContent: "center",
                          alignItems: "center",
                        }}
                      >
                        {item.icon}
                      </ListItemIcon>

                      {/* Show the text only if drawer is open */}
                      {open && (
                        <ListItemText
                          primary={item.text}
                          sx={{
                            color:
                              pathname === item.href ||
                              (item.text === "Lecture" &&
                                [
                                  "/teacher/lecture-listings",
                                  "/teacher/lecture-schedule",
                                  "/teacher/lecture-tracking",
                                ].includes(pathname))
                                ? "#16AA54"
                                : "#8C8F90",
                          }}
                        />
                      )}
                      {item.text === "Lecture" &&
                        (isOpen ? <IoIosArrowUp /> : <IoIosArrowDown />)}
                    </ListItemButton>
                  </Tooltip>

                  {/* Collapse for children if they exist */}
                  {item.children && (
                    <Collapse in={isOpen} timeout="auto" unmountOnExit>
                      <List component="div" disablePadding>
                        {item.children
                          .filter((val) => val.show.includes(userDetails?.role))
                          .map((child, childIndex) => (
                            <Tooltip
                              title={child.text}
                              key={childIndex}
                              placement="right"
                              disableHoverListener={open}
                            >
                              <ListItemButton
                                sx={{
                                  borderRadius: 2,
                                  margin: "4px 0",
                                  pl: open ? 4 : 2,
                                }}
                                onClick={() => router.push(child.href)}
                              >
                                {open && (
                                  <ListItemText
                                    primary={child.text}
                                    sx={{
                                      color:
                                        pathname === child.href
                                          ? "#16AA54"
                                          : "#8C8F90",
                                      ml: 2,
                                    }}
                                  />
                                )}
                              </ListItemButton>
                            </Tooltip>
                          ))}
                      </List>
                    </Collapse>
                  )}
                </Box>
              );
            })}
        </List>
      </Box>

      {/* Profile Section */}
      {open ? (
        <Box>
          <Box sx={{ borderTop: "1px solid #C1C1C1", marginX: "16px" }} />
          <div>
            <Box
              onClick={handleMenu}
              sx={{
                display: "flex",
                alignItems: "center",
                flexDirection: "row",
                // borderTop: "1px solid #C1C1C1",
                p: 2,
                mt: 2,
                mb: 1,
                // marginX: "16px",
                justifyContent: "space-between",
                cursor: "pointer",
              }}
            >
              <Box sx={{ display: "flex", alignItems: "center" }}>
                <Box sx={{ width: 48, height: 48 }}>
                  <UserImage
                    profilePic={userDetails?.profile_pic}
                    name={userDetails?.full_name}
                    width={42}
                    height={42}
                  />
                </Box>
                <Box>
                  <Typography
                    variant="body1"
                    sx={{
                      color: "#282D32",
                      fontWeight: 700,
                      fontSize: "16px",
                      lineHeight: "18.91px",
                      fontFamily: "Inter, sans-serif",
                    }}
                  >
                    {userDetails?.full_name}
                  </Typography>
                  <Typography
                    variant="body1"
                    sx={{
                      color: "#404145",
                      fontFamily: "Inter, sans-serif",
                      fontSize: "12px",
                    }}
                  >
                    CCST
                  </Typography>
                </Box>
              </Box>
              <Box>
                <IoIosArrowForward size={20} />
              </Box>
            </Box>
            <Box>
              <Menu
                id="menu-appbar"
                anchorEl={anchorEl}
                anchorOrigin={{
                  vertical: "top",
                  horizontal: "top",
                }}
                keepMounted
                transformOrigin={{
                  vertical: "top",
                  horizontal: "top",
                }}
                open={Boolean(anchorEl)}
                onClose={handleClose}
                PaperProps={{
                  sx: {
                    padding: 0, // Remove default padding
                    borderRadius: "16px", // Apply your radius here
                  },
                }}
              >
                <Box
                  sx={{
                    display: "inline-flex",
                    flexDirection: "column",
                    justifyContent: "center",
                    alignItems: "center",
                    padding: "24px",
                    flexDirection: "column",
                    alignItems: "flex-start",
                    gap: "22px",
                    // borderRadius: "12px",
                    border: "none",
                    backgroundColor: "#fff",
                    boxShadow: "none",
                    // boxShadow: "0px 4px 10px 0px rgba(0, 0, 0, 0.15)",
                    height: "100%",
                  }}
                >
                  <Box sx={{ display: "flex", alignItems: "center" }}>
                    <Box sx={{ width: 48, height: 48 }}>
                      <UserImage
                        profilePic={userDetails?.profile_pic}
                        name={userDetails?.full_name}
                        width={42}
                        height={42}
                      />
                    </Box>
                    <Box>
                      <Typography
                        variant="body1"
                        sx={{
                          color: "#282D32",
                          fontWeight: 700,
                          fontSize: "16px",
                          lineHeight: "18.91px",
                          fontFamily: "Inter, sans-serif",
                        }}
                      >
                        {userDetails?.full_name}
                      </Typography>
                      <Typography
                        variant="body1"
                        sx={{
                          color: "#404145",
                          fontFamily: "Inter, sans-serif",
                          fontSize: "12px",
                        }}
                      >
                        CCST
                      </Typography>
                    </Box>
                  </Box>
                 {userDetails?.role!=="ADMIN"? <Box
                    sx={{
                      display: "flex",
                      flexDirection: "column",
                      gap: "7px",
                    }}
                  >
                    <Button
                      variant="outlined"
                      color="primary"
                      onClick={() => {
                        if (userDetails?.role === "TEACHER") {
                          console.log("Role:", userDetails?.role); // debug log
                          handleClose(); // close menu if needed
                          router.push("/teacher/myprofile");
                        } else if(userDetails?.role === "STUDENT") {
                          console.log("Role:", userDetails?.role); // debug log
                          handleClose(); // close menu if needed
                          router.push("/student/myprofile");
                        }
                      }}
                      sx={{
                        mt: 2,
                        display: "inline-flex",
                        padding: "12px 32px",
                        justifyContent: "center",
                        alignItems: "center",
                        gap: "8px",
                        textTransform: "none",
                        borderRadius: "8px",
                        background: "#141514",
                        color: "#FFF",
                        textAlign: "center",
                        fontFeatureSettings: "'liga' off, 'clig' off",
                        fontFamily: "Aptos",
                        fontSize: "16px",
                        fontStyle: "normal",
                        fontWeight: "700",
                        lineHeight: "24px",
                        "&:hover": {
                          border: "1px solid #141514",
                          background: "#E5E5E5",
                          color: "#141514",
                        },
                      }}
                    >
                      Setup Profile
                    </Button>
                  </Box>:""}
                  <Box>
                    <MenuItem
                      sx={{
                        fontFamily: "Aptos",
                        fontSize: "16px",
                        fontStyle: "normal",
                        fontWeight: "700",
                        lineHeight: "24px",
                        margin: "0 auto",
                        border: "none",
                      }}
                    >
                      {/* <Box sx={{ display: "flex", gap: "8px" }}>
                        <svg
                          xmlns="http://www.w3.org/2000/svg"
                          width="24"
                          height="24"
                          viewBox="0 0 24 24"
                          fill="none"
                        >
                          <path
                            d="M2 12.8799V11.1199C2 10.0799 2.85 9.21994 3.9 9.21994C5.71 9.21994 6.45 7.93994 5.54 6.36994C5.02 5.46994 5.33 4.29994 6.24 3.77994L7.97 2.78994C8.76 2.31994 9.78 2.59994 10.25 3.38994L10.36 3.57994C11.26 5.14994 12.74 5.14994 13.65 3.57994L13.76 3.38994C14.23 2.59994 15.25 2.31994 16.04 2.78994L17.77 3.77994C18.68 4.29994 18.99 5.46994 18.47 6.36994C17.56 7.93994 18.3 9.21994 20.11 9.21994C21.15 9.21994 22.01 10.0699 22.01 11.1199V12.8799C22.01 13.9199 21.16 14.7799 20.11 14.7799C18.3 14.7799 17.56 16.0599 18.47 17.6299C18.99 18.5399 18.68 19.6999 17.77 20.2199L16.04 21.2099C15.25 21.6799 14.23 21.3999 13.76 20.6099L13.65 20.4199C12.75 18.8499 11.27 18.8499 10.36 20.4199L10.25 20.6099C9.78 21.3999 8.76 21.6799 7.97 21.2099L6.24 20.2199C5.33 19.6999 5.02 18.5299 5.54 17.6299C6.45 16.0599 5.71 14.7799 3.9 14.7799C2.85 14.7799 2 13.9199 2 12.8799Z"
                            stroke="#3B3D3B"
                            stroke-width="1.5"
                            stroke-miterlimit="10"
                            stroke-linecap="round"
                            stroke-linejoin="round"
                          />
                          <path
                            d="M12 15C13.6569 15 15 13.6569 15 12C15 10.3431 13.6569 9 12 9C10.3431 9 9 10.3431 9 12C9 13.6569 10.3431 15 12 15Z"
                            stroke="#3B3D3B"
                            stroke-width="1.5"
                            stroke-miterlimit="10"
                            stroke-linecap="round"
                            stroke-linejoin="round"
                          />
                        </svg>{" "}
                        <Typography>Settings</Typography>
                      </Box> */}
                    </MenuItem>

                    <MenuItem
                      onClick={() => router.push("/teacher/myprofile")}
                      sx={{
                        fontFamily: "Aptos",
                        fontSize: "16px",
                        fontStyle: "normal",
                        fontWeight: "700",
                        lineHeight: "24px",
                      }}
                    >
                      <Box sx={{ display: "flex", gap: "8px" }}>
                        <svg
                          xmlns="http://www.w3.org/2000/svg"
                          width="24"
                          height="24"
                          viewBox="0 0 24 24"
                          fill="none"
                        >
                          <path
                            d="M12 21C16.9706 21 21 16.9706 21 12C21 7.02944 16.9706 3 12 3C7.02944 3 3 7.02944 3 12C3 16.9706 7.02944 21 12 21Z"
                            stroke="#3B3D3B"
                            stroke-width="1.5"
                            stroke-linecap="round"
                            stroke-linejoin="round"
                          />
                          <path
                            d="M12 11V16"
                            stroke="#3B3D3B"
                            stroke-width="1.5"
                            stroke-linecap="round"
                            stroke-linejoin="round"
                          />
                          <path
                            d="M11.9502 8H12.0502V8.1H11.9502V8Z"
                            stroke="#3B3D3B"
                            stroke-width="1.5"
                            stroke-linecap="round"
                            stroke-linejoin="round"
                          />
                        </svg>{" "}
                        <Typography>Information</Typography>
                      </Box>
                    </MenuItem>

                    <MenuItem
                      onClick={() => handleRoute()}
                      sx={{
                        fontFamily: "Aptos",
                        fontSize: "16px",
                        fontStyle: "normal",
                        fontWeight: "700",
                        lineHeight: "24px",
                      }}
                    >
                      <Box sx={{ display: "flex", gap: "8px" }}>
                        <svg
                          xmlns="http://www.w3.org/2000/svg"
                          width="24"
                          height="24"
                          viewBox="0 0 24 24"
                          fill="none"
                        >
                          <path
                            d="M17.4404 14.62L20.0004 12.06L17.4404 9.5"
                            stroke="#3B3D3B"
                            stroke-width="1.5"
                            stroke-miterlimit="10"
                            stroke-linecap="round"
                            stroke-linejoin="round"
                          />
                          <path
                            d="M9.75977 12.0596H19.9298"
                            stroke="#3B3D3B"
                            stroke-width="1.5"
                            stroke-miterlimit="10"
                            stroke-linecap="round"
                            stroke-linejoin="round"
                          />
                          <path
                            d="M11.7598 20C7.33977 20 3.75977 17 3.75977 12C3.75977 7 7.33977 4 11.7598 4"
                            stroke="#3B3D3B"
                            stroke-width="1.5"
                            stroke-miterlimit="10"
                            stroke-linecap="round"
                            stroke-linejoin="round"
                          />
                        </svg>{" "}
                        <Typography>Logout</Typography>
                      </Box>
                    </MenuItem>
                  </Box>
                </Box>

                {/* <MenuItem
                onClick={() => handleRoute()}
                sx={{
                  fontFamily: "Aptos",
                  fontSize: "16px",
                  fontStyle: "normal",
                  fontWeight: "700",
                  lineHeight: "24px",
                }}
              >
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  width="24"
                  height="24"
                  viewBox="0 0 24 24"
                  fill="none"
                >
                  <path
                    d="M17.4404 14.62L20.0004 12.06L17.4404 9.5"
                    stroke="#3B3D3B"
                    stroke-width="1.5"
                    stroke-miterlimit="10"
                    stroke-linecap="round"
                    stroke-linejoin="round"
                  />
                  <path
                    d="M9.75977 12.0596H19.9298"
                    stroke="#3B3D3B"
                    stroke-width="1.5"
                    stroke-miterlimit="10"
                    stroke-linecap="round"
                    stroke-linejoin="round"
                  />
                  <path
                    d="M11.7598 20C7.33977 20 3.75977 17 3.75977 12C3.75977 7 7.33977 4 11.7598 4"
                    stroke="#3B3D3B"
                    stroke-width="1.5"
                    stroke-miterlimit="10"
                    stroke-linecap="round"
                    stroke-linejoin="round"
                  />
                </svg>{" "}
                Logout
              </MenuItem> */}
              </Menu>
            </Box>
          </div>
        </Box>
      ) : (
        <Box
          sx={{
            display: "flex",
            justifyContent: "center",
            alignItems: "center",
            mt: 2,
          }}
        >
          <UserImage
            profilePic={userDetails?.profile_pic}
            name={userDetails?.full_name}
            width={36}
            height={36}
          />
        </Box>
      )}
    </Drawer>
  );
};

export default Sidebar;
