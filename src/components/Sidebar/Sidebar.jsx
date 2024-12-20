import React,{useContext} from "react";
import {
  Box,
  Drawer,
  List,
  ListItem,
  ListItemIcon,
  ListItemText,
  IconButton,
  Tooltip,
  Avatar,
  Typography,
} from "@mui/material";
import {
  MdDashboard,
  MdCreate,
  MdList,
  MdTrackChanges,
  MdSchedule,
  MdLogout,
  MdMenu,
  MdPerson,
  MdVideoLibrary,
  MdHelp,
  MdTask,
  MdAssignment,
} from "react-icons/md";
import { PiExam } from "react-icons/pi";
import { FaChalkboardTeacher } from "react-icons/fa";
import { AiOutlinePlus } from "react-icons/ai";
import Cookies from "js-cookie";
import { useRouter,usePathname } from "next/navigation";
import { useThemeContext } from "@/hooks/ThemeContext";
import { decodeToken } from "react-jwt";
import UserImage from "@/commonComponents/UserImage/UserImage";
import { AppContextProvider } from "@/app/main";
import Logo from "@/commonComponents/Logo/Logo";

const drawerWidth = 240;
const miniDrawerWidth = 60;

const Sidebar = ({ open, setOpen }) => {
  const { isDarkMode, primaryColor, secondaryColor } = useThemeContext();
  const { handleCreateLecture }=useContext(AppContextProvider)
  const userDetails = decodeToken(Cookies.get("ACCESS_TOKEN"));
  const router = useRouter();
  const pathname=usePathname();
  const iconSize = open ? 22 : 26;
  const handleDrawerToggle = () => {
    setOpen(!open);
  };

  const handleRoute = async () => {
    document.body.style.overflow = "";
    Cookies.remove("REFRESH_TOKEN");
    Cookies.remove("ACCESS_TOKEN");
    return router.push("/login");
  };

  return (
    <Box sx={{ display: "flex" }}>
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
            backgroundColor: isDarkMode ? "black" : "#1e1e2d",
            color: "#fff",
            boxShadow: "2px 0 5px rgba(0,0,0,0.1)",
          },
        }}
      >
        <Box sx={{ padding: open ? "16px" : "8px" }}>
          <Box
            sx={{
              display: "flex",
              alignItems: "center",
              justifyContent: open ? "space-between" : "center",
            }}
          >
            {open && (
              <Logo />
            )}
            <IconButton
              onClick={handleDrawerToggle}
              sx={{ color: "#fff", ml: open ? 2 : 0 }}
            >
              <MdMenu size={26} />
            </IconButton>
          </Box>

          {/* Profile Section */}
          {open ? (
            <Box
              sx={{
                display: "flex",
                alignItems: "center",
                flexDirection: open ? "row" : "column",
                backgroundColor: "#2c2c3c",
                borderRadius: "8px",
                p: open ? 2 : 1,
                mt: 2,
                mb: 3,
                transition: "padding 0.3s",
              }}
            >
              <Box sx={{ width: 48, height: 48, mb: open ? 0 : 1 }}>
                <UserImage
                  profilePic={userDetails?.profile_pic}
                  name={userDetails?.full_name}
                  width={48}
                  height={48}
                />
              </Box>
              <Typography variant="body1" sx={{ ml: 2, color: "#fff" }}>
                {userDetails?.full_name}
              </Typography>
            </Box>
          ) : (
            <Box
              sx={{
                display: "flex",
                justifyContent: "center",
                alignItems: "center",
                marginTop: 2,
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

          <List>
            {sidebarLinks.overview
              ?.filter((val) => val.show.includes(userDetails?.role))
              ?.map((item, index) => (
                <Tooltip
                  title={item.text}
                  key={index}
                  placement="right"
                  disableHoverListener={open}
                >
                  <ListItem
                    button
                    sx={{
                      boxShadow: pathname===item.href? "0 4px 30px rgba(0, 0, 0, 0.1)":"",
                      backgroundColor:pathname===item.href? "rgba(255, 255, 255, 0.04)":"",
                      padding: open ? "10px 16px" : "5px 10px",
                      borderRadius: "8px",
                      "&:hover": {
                        backgroundColor: "#343446",
                      },
                      margin: "8px 0",
                    }}
                    onClick={() => {
                      if (item.text === "Create Lecture") {
                        handleCreateLecture("",false);
                      } else {
                        router.push(item.href);
                      }
                    }}
                  >
                    <ListItemIcon
                      sx={{
                        color: "#00c853",
                        minWidth: open ? "unset" : "20px",
                        justifyContent: "center",
                        alignItems: "center",
                        display: "flex",
                      }}
                    >
                      {item.icon}
                    </ListItemIcon>
                    {open && (
                      <ListItemText
                        primary={item.text}
                        sx={{ color: "#fff", ml: 2 }}
                      />
                    )}
                  </ListItem>
                </Tooltip>
              ))}
          </List>
        </Box>

        <Box sx={{ mb: 2 }}>
          <Tooltip title="Logout" placement="right" disableHoverListener={open}>
            <ListItem
              button
              sx={{
                padding: open ? "10px 16px" : "5px 10px",
                borderRadius: "8px",
                "&:hover": {
                  backgroundColor: "#343446",
                },
                margin: "8px 0",
              }}
              onClick={() => handleRoute()}
            >
              <ListItemIcon
                sx={{
                  color: "#f44336",
                  minWidth: open ? "unset" : "40px",
                  justifyContent: "center",
                  alignItems: "center",
                  display: "flex",
                }}
              >
                <MdLogout size={iconSize} />
              </ListItemIcon>
              {open && (
                <ListItemText primary="Logout" sx={{ color: "#fff", ml: 2 }} />
              )}
            </ListItem>
          </Tooltip>
        </Box>
      </Drawer>

      <Box component="main" sx={{ flexGrow: 1, p: 3 }}>
        {/* Main content goes here */}
      </Box>
    </Box>
  );
};

export default Sidebar;

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
      icon: <MdDashboard size={22} />,
      show: "ADMIN",
    },
    {
      text: "Dashboard",
      href: "/student/dashboard",
      icon: <MdDashboard size={22} />,
      show: "STUDENT",
    },
    {
      text: "Dashboard",
      href: "/teacher/dashboard",
      icon: <FaChalkboardTeacher size={22} />,
      show: "TEACHER",
    },
    {
      text: "Create Lecture",
      href: "",
      icon: <AiOutlinePlus size={22} />,
      show: "TEACHER",
    },
    {
      text: "Lecture Listings",
      href: "/admin/lecture-listings",
      icon: <MdVideoLibrary size={22} />,
      show: "ADMIN",
    },
    {
      text: "Lecture Listings",
      href: "/teacher/lecture-listings",
      icon: <MdVideoLibrary size={22} />,
      show: "TEACHER",
    },
    {
      text: "Lecture Listings",
      href: "/student/lecture-listings",
      icon: <MdVideoLibrary size={22} />,
      show: "STUDENT",
    },
    {
      text: "Lecture Tracking",
      href: "/admin/lecture-tracking",
      icon: <MdTask size={22} />,
      show: "ADMIN",
    },
    {
      text: "Lecture Tracking",
      href: "/teacher/lecture-tracking",
      icon: <MdTask size={22} />,
      show: "TEACHER",
    },
    {
      text: "Lecture Schedule",
      href: "/teacher/lecture-schedule",
      icon: <MdSchedule size={22} />,
      show: "TEACHER",
    },
    {
      text: "Assessment",
      href: "/teacher/assignment",
      icon: <MdAssignment size={22} />,
      show: "TEACHER",
    },
    {
      text: "Lecture Schedule",
      href: "/admin/lecture-schedule",
      icon: <MdSchedule size={22} />,
      show: "ADMIN",
    },
    // {
    //   text: "Test Series",
    //   href: "/quizcomponent",
    //   icon: <MdAssignment size={22} />,
    //   show: "STUDENT TEACHER",
    // },
    // {
    //   text: "Create Quiz",
    //   href: "/teacher/quiz",
    //   icon: <PiExam size={22} />,
    //   show: "STUDENT TEACHER",
    // },
  ],
};
