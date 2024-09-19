import React from "react";
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
} from "react-icons/md";
import Cookies from "js-cookie";
import { useRouter } from "next/navigation";

const drawerWidth = 240;
const miniDrawerWidth = 60;

const Sidebar = ({ open, setOpen }) => {
  const router = useRouter();
  const iconSize = open ? 22 : 26;
  const handleDrawerToggle = () => {
    setOpen(!open);
  };

  const handleRoute = async () => {
    document.body.style.overflow = "";
    await localStorage.removeItem("REFRESH_TOKEN");
    await localStorage.removeItem("ACCESS_TOKEN");
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
            backgroundColor: "#1e1e2d",
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
              <Typography
                variant="h5"
                sx={{
                  color: "#fff",
                  fontWeight: "bold",
                  letterSpacing: "0.5px",
                }}
              >
                VidyaAI
                <Typography
                  variant="h5"
                  component="span"
                  sx={{
                    color: "#00c853",
                    ml: 0.2,
                    fontWeight: "bold",
                  }}
                >
                  ►
                </Typography>
              </Typography>
            )}
            <IconButton
              onClick={handleDrawerToggle}
              sx={{ color: "#fff", ml: open ? 2 : 0 }}
            >
              <MdMenu size={26}/>
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
              <Avatar
                src="/path/to/avatar.jpg"
                alt="User Name"
                sx={{ width: 48, height: 48, mb: open ? 0 : 1 }}
              />
              <Typography variant="body1" sx={{ ml: 2, color: "#fff" }}>
                User Name
              </Typography>
            </Box>
          ) : (
           <Box sx={{display:'flex',justifyContent:'center',alignItems:'center',marginTop:2}}>
             <Avatar
              src="/path/to/avatar.jpg"
              alt="User Name"
              sx={{ width: 36, height:  36, mb: open ? 0 : 1 }}
            />
            </Box>
          )}

          <List>
            {[
              { text: "Dashboard", icon: <MdDashboard size={iconSize} /> },
              { text: "Create Lecture", icon: <MdCreate size={iconSize} /> },
              { text: "Lecture Listing", icon: <MdList size={iconSize} /> },
              {
                text: "Lecture Tracking",
                icon: <MdTrackChanges size={iconSize} />,
              },
              {
                text: "Lecture Schedule",
                icon: <MdSchedule size={iconSize} />,
              },
            ].map((item, index) => (
              <Tooltip
                title={item.text}
                key={index}
                placement="right"
                disableHoverListener={open}
              >
                <ListItem
                  button
                  sx={{
                    padding:open? "10px 16px" : "5px 10px",
                    borderRadius: "8px",
                    "&:hover": {
                      backgroundColor: "#343446",
                    },
                    margin: "8px 0",
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
                padding:open? "10px 16px" : "5px 10px",
                borderRadius: "8px",
                "&:hover": {
                  backgroundColor: "#343446",
                },
                margin: "8px 0",
              }}

              onClick={()=>handleRoute()}
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
