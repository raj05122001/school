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
      show: ["TEACHER","STUDENT", "ADMIN"]
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
                        fontSize:"12px"
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
            >
              {userDetails?.role==="TEACHER"?<MenuItem onClick={()=>router.push("/teacher/myprofile")}>Profile</MenuItem>:""}
              <MenuItem onClick={() => handleRoute()}>Logout</MenuItem>
            </Menu>
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
