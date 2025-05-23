import React, { useEffect, useState } from "react";
import { Grid, Card, Typography, Avatar, Box, Skeleton, Autocomplete, TextField } from "@mui/material";
import { FaTrophy, FaCircle } from "react-icons/fa";
import { getAllSubject, getClassAssignment } from "@/api/apiHelper";
import { useThemeContext } from "@/hooks/ThemeContext";

const ClassAssignment = () => {
  const [data, setData] = useState({});
  const [loading, setLoading] = useState(true);
  const { isDarkMode, primaryColor, secondaryColor } = useThemeContext();
  const [selectedOptions, setSelectedOptions] = useState(null);
  const [classOptions, setClassOptions] = useState([]);   


  
  useEffect(() => {
    if(selectedOptions?.id){
    fetchClassAssignment();
  }
  }, [selectedOptions]);

  const fetchClassOptions = async () => {
      try {
        const subjectResponse = await getAllSubject();
        setClassOptions(subjectResponse?.data?.data);
        setSelectedOptions(subjectResponse?.data?.data?.[1]);
      } catch (error) {
        console.error(error);
      }
    };

  const fetchClassAssignment = async () => {
    setLoading(true);
    try {
      const response = await getClassAssignment(selectedOptions?.id);
      setData(response?.data?.data);
    } catch (error) {
      console.error(error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
      fetchClassOptions();
    }, []);


  return (
    // <Grid container spacing={2}>
    //   {/* Left Card */}
    //   <Grid item xs={12} sm={7}>
    //     <Card
    //       variant="outlined"
    //       sx={{
    //         padding: 3,
    //         backdropFilter: "blur(10px)",
    //         backgroundColor: "rgba(255, 255, 255, 0.2)",
    //         boxShadow: "0 4px 30px rgba(0, 0, 0, 0.1)",
    //         borderRadius: "16px",
    //       }}
    //       className="blur_effect_card"
    //     >
    //       <Grid container>
    //         {/* Overall Class Score */}
    //         <Grid item xs={12} sm={6} container spacing={2}>
    //           <Grid
    //             item
    //             xs={6}
    //             container
    //             direction="column"
    //             alignItems="flex-start"
    //           >
    //             <Typography variant="h6" gutterBottom color={primaryColor}>
    //               Overall Class Score
    //             </Typography>
    //             {loading ? (
    //               <>
    //                 <Skeleton variant="text" width={80} height={40} />
    //                 <Skeleton variant="text" width={60} height={20} />
    //               </>
    //             ) : (
    //               <>
    //                 <Typography variant="h4" color="primary" fontWeight="bold">
    //                   {data?.over_all_class_score || 0}
    //                 </Typography>
    //                 <Typography variant="body2" color={secondaryColor}>
    //                   Average Grade
    //                 </Typography>
    //                 <Typography variant="body1" color={secondaryColor}>
    //                   {data?.average_grade || 0}
    //                 </Typography>
    //               </>
    //             )}
    //           </Grid>
    //           <Grid
    //             item
    //             xs={6}
    //             sx={{
    //               textAlign: "center",
    //               display: "flex",
    //               alignItems: "center",
    //             }}
    //           >
    //             {loading ? (
    //               <Skeleton variant="circular" width={100} height={100} />
    //             ) : (
    //               <FaTrophy size={100} color="green" />
    //             )}
    //           </Grid>
    //         </Grid>

    //         {/* Work Assigned */}
    //         <Grid item xs={12} sm={6} container spacing={2}>
    //           <Grid
    //             item
    //             xs={6}
    //             container
    //             direction="column"
    //             alignItems="flex-start"
    //           >
    //             <Typography variant="h6" gutterBottom color={primaryColor}>
    //               Work Assigned
    //             </Typography>
    //             {loading ? (
    //               <>
    //                 <Skeleton variant="text" width={80} height={40} />
    //                 <Skeleton variant="text" width={60} height={20} />
    //               </>
    //             ) : (
    //               <>
    //                 <Typography variant="h4" color="primary" fontWeight="bold">
    //                   {data?.total_assignments || 0}
    //                 </Typography>
    //                 <Typography variant="body2" color={secondaryColor}>
    //                   Average Percentage
    //                 </Typography>
    //                 <Typography variant="body1" color={secondaryColor}>
    //                   {data?.average_percentage || 0}%
    //                 </Typography>
    //               </>
    //             )}
    //           </Grid>
    //           <Grid
    //             item
    //             xs={6}
    //             sx={{
    //               textAlign: "center",
    //               display: "flex",
    //               alignItems: "center",
    //             }}
    //           >
    //             {loading ? (
    //               <Skeleton variant="circular" width={100} height={100} />
    //             ) : (
    //               <BubblePattern />
    //             )}
    //           </Grid>
    //         </Grid>
    //       </Grid>
    //     </Card>
    //   </Grid>

    //   {/* Right Cards */}
    //   <Grid item xs={12} container sm={5} spacing={2}>
    //     {[0, 50, 80]?.map((range, index) => (
    //       <Grid item xs={12} sm={4} key={index}>
    //         <Box
    //           sx={{
    //             backgroundColor:
    //               index === 0 ? "#f2757d" : index === 1 ? "#ffcc73" : "#86e28a",
    //             padding: 2,
    //             textAlign: "center",
    //             borderRadius: 2,
    //             color: "white",
    //             height: "100%",
    //             display: "flex",
    //             flexDirection: "column",
    //             justifyContent: "center",
    //             alignItems: "center",
    //           }}
    //         >
    //           {loading ? (
    //             <Skeleton variant="text" width={40} height={40} />
    //           ) : (
    //             <Typography variant="h4" fontWeight="bold">
    //               {(index === 0
    //                 ? data?.student_counts?.range_0_50
    //                 : index === 1
    //                 ? data?.student_counts?.range_50_80
    //                 : data?.student_counts?.range_80_100) || 0}
    //             </Typography>
    //           )}
    //           <Typography variant="body2">
    //             {index === 0
    //               ? "Assignment Range 0 To 50"
    //               : index === 1
    //               ? "Assignment Range 50 To 80"
    //               : "Assignment Range 80 To 100"}
    //           </Typography>
    //         </Box>
    //       </Grid>
    //     ))}
    //   </Grid>
    // </Grid>
    <Box
          sx={{
            display: "inline-flex",
            padding: "32px 24px 24px 24px",
            flexDirection: "column",
            justifyContent: "flex-end",
            alignItems: "center",
            gap: "23px",
            borderRadius: "20px",
            background: "#FFF",
            width: "100%",
            // height:"100%"
          }}
        >
          <Box
            sx={{
              display: "flex",
              alignItems: "center",
              gap: "53px",
              //   backgroundColor: "#F3F5F7",
              color: "#3B3D3B",
            }}
          >
            <Box display={"flex"} sx={{ gap: "6px" }}>
              <Box
                sx={{
                  display: "flex",
                  width: "24px",
                  height: "24px",
                  justifyContent: "center",
                  alignItems: "center",
                  flexShrink: 0,
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
                    d="M18.0001 7.16C17.9401 7.15 17.8701 7.15 17.8101 7.16C16.4301 7.11 15.3301 5.98 15.3301 4.58C15.3301 3.15 16.4801 2 17.9101 2C19.3401 2 20.4901 3.16 20.4901 4.58C20.4801 5.98 19.3801 7.11 18.0001 7.16Z"
                    stroke="#3B3D3B"
                    stroke-width="2"
                    stroke-linecap="round"
                    stroke-linejoin="round"
                  />
                  <path
                    d="M16.9702 14.4399C18.3402 14.6699 19.8502 14.4299 20.9102 13.7199C22.3202 12.7799 22.3202 11.2399 20.9102 10.2999C19.8402 9.58992 18.3102 9.34991 16.9402 9.58991"
                    stroke="#3B3D3B"
                    stroke-width="2"
                    stroke-linecap="round"
                    stroke-linejoin="round"
                  />
                  <path
                    d="M5.96998 7.16C6.02998 7.15 6.09998 7.15 6.15998 7.16C7.53998 7.11 8.63998 5.98 8.63998 4.58C8.63998 3.15 7.48998 2 6.05998 2C4.62998 2 3.47998 3.16 3.47998 4.58C3.48998 5.98 4.58998 7.11 5.96998 7.16Z"
                    stroke="#3B3D3B"
                    stroke-width="2"
                    stroke-linecap="round"
                    stroke-linejoin="round"
                  />
                  <path
                    d="M6.99994 14.4399C5.62994 14.6699 4.11994 14.4299 3.05994 13.7199C1.64994 12.7799 1.64994 11.2399 3.05994 10.2999C4.12994 9.58992 5.65994 9.34991 7.02994 9.58991"
                    stroke="#3B3D3B"
                    stroke-width="2"
                    stroke-linecap="round"
                    stroke-linejoin="round"
                  />
                  <path
                    d="M12.0001 14.63C11.9401 14.62 11.8701 14.62 11.8101 14.63C10.4301 14.58 9.33008 13.45 9.33008 12.05C9.33008 10.62 10.4801 9.46997 11.9101 9.46997C13.3401 9.46997 14.4901 10.63 14.4901 12.05C14.4801 13.45 13.3801 14.59 12.0001 14.63Z"
                    stroke="#3B3D3B"
                    stroke-width="2"
                    stroke-linecap="round"
                    stroke-linejoin="round"
                  />
                  <path
                    d="M9.08997 17.7799C7.67997 18.7199 7.67997 20.2599 9.08997 21.1999C10.69 22.2699 13.31 22.2699 14.91 21.1999C16.32 20.2599 16.32 18.7199 14.91 17.7799C13.32 16.7199 10.69 16.7199 9.08997 17.7799Z"
                    stroke="#3B3D3B"
                    stroke-width="2"
                    stroke-linecap="round"
                    stroke-linejoin="round"
                  />
                </svg>
              </Box>
    
              <Typography
                sx={{
                  color: "var(--Text-Color-1, #3B3D3B)",
                  fontFamily: "Inter, sans-serif",
                  fontSize: "22px",
                  fontStyle: "normal",
                  fontWeight: 600,
                  lineHeight: "normal",
                }}
              >
                Class Proficiency
              </Typography>
            </Box>
            <Box
              sx={{
                display: "flex",
                gap: "10px",
                alignItems: "center",
                background: "var(--BG-Color-1, #F3F5F7)",
                borderRadius: "10px",
              }}
            >
              <Autocomplete
                freeSolo
                id="class"
                disableClearable
                options={classOptions?.map((option) => option?.name)}
                value={selectedOptions?.name || ""} // Set value to the class name only
                onChange={(event, newValue) => {
                  const selected = classOptions.find(
                    (option) => option.name === newValue
                  );
                  setSelectedOptions(selected || null); // Set selected option object
                }}
                renderInput={(params) => (
                  <TextField
                    {...params}
                    placeholder="Select Class"
                    variant="outlined"
                    InputProps={{
                      ...params.InputProps,
                      type: "search",
                      sx: {
                        backdropFilter: "blur(10px)",
                        backgroundColor: "rgba(255, 255, 255, 0.2)",
                        height: 45,
                        width: 200,
                        borderRadius: "10px",
                        "& .MuiOutlinedInput-notchedOutline": {
                          border: "1px solid #d3d3d3",
                        },
                      },
                    }}
                    sx={{
                      //   boxShadow: currentStyles.boxShadow,
                      borderRadius: "10px",
                    }}
                  />
                )}
              />
            </Box>
          </Box>
          <Box
            sx={{
              display: "flex",
              padding: "14px 12px",
              alignItems: "flex-start",
              gap: "10px",
              alignSelf: "stretch",
              borderRadius: "12px",
              background: "#EDEEFC",
            }}
          >
            <Box
              sx={{
                width: "58px",
                height: "58px",
                flexShrink: 0,
                borderRadius: "8px",
                background: "#FFF",
              }}
            >
              <Box
                sx={{
                  display: "flex",
                  width: "24px",
                  height: "24px",
                  justifyContent: "center",
                  alignItems: "center",
                  flexShrink: 0,
                  margin: "17px",
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
                    d="M18.1401 21.62C17.2601 21.88 16.2201 22 15.0001 22H9.00011C7.78011 22 6.74011 21.88 5.86011 21.62C6.08011 19.02 8.75011 16.97 12.0001 16.97C15.2501 16.97 17.9201 19.02 18.1401 21.62Z"
                    stroke="#5856D6"
                    stroke-width="1.5"
                    stroke-linecap="round"
                    stroke-linejoin="round"
                  />
                  <path
                    d="M15 2H9C4 2 2 4 2 9V15C2 18.78 3.14 20.85 5.86 21.62C6.08 19.02 8.75 16.97 12 16.97C15.25 16.97 17.92 19.02 18.14 21.62C20.86 20.85 22 18.78 22 15V9C22 4 20 2 15 2ZM12 14.17C10.02 14.17 8.42 12.56 8.42 10.58C8.42 8.60002 10.02 7 12 7C13.98 7 15.58 8.60002 15.58 10.58C15.58 12.56 13.98 14.17 12 14.17Z"
                    stroke="#5856D6"
                    stroke-width="1.5"
                    stroke-linecap="round"
                    stroke-linejoin="round"
                  />
                  <path
                    d="M15.5799 10.58C15.5799 12.56 13.9799 14.17 11.9999 14.17C10.0199 14.17 8.41992 12.56 8.41992 10.58C8.41992 8.60002 10.0199 7 11.9999 7C13.9799 7 15.5799 8.60002 15.5799 10.58Z"
                    stroke="#5856D6"
                    stroke-width="1.5"
                    stroke-linecap="round"
                    stroke-linejoin="round"
                  />
                </svg>
              </Box>
            </Box>
            <Box
              sx={{
                display: "flex",
                justifyContent: "center",
                alignItems: "center",
                flexDirection: "column",
                width:"100%"
              }}
            >
              <Typography
                sx={{
                  alignSelf: "stretch",
                  color: "var(--Text-Color-1, #3B3D3B)",
                  fontFamily: "Inter, sans-serif",
                  fontSize: "16px",
                  fontStyle: "normal",
                  fontWeight: 600,
                  lineHeight: "normal",
                }}
              >
                Overall Class Participation
              </Typography>
              <Box sx={{display:"flex", justifyContent:"space-between", width:"100%"}}>
                <Typography
                  sx={{
                    alignSelf: "stretch",
                    color: "var(--Text-Color-1, #3B3D3B)",
                    fontFamily: "Inter, sans-serif",
                    fontSize: "24px",
                    fontStyle: "normal",
                    fontWeight: 600,
                    lineHeight: "normal",
                    marginTop: "7px",
                  }}
                >
                  {data?.over_all_class_score || 0}
                </Typography>
                <Box
                sx={{
                  display: "inline-flex",
                  alignItems: "center",
                  justifyContent: "center",
                  padding: "4px",
                  gap: "5px",
                  borderRadius: "6px",
                  background: "#FFF",
                }}
              >
                <Typography
                  sx={{
                    color: "var(--Text-Color-1, #3B3D3B)",
                    fontFamily: "Inter, sans-serif",
                    fontSize: "12px",
                    fontStyle: "normal",
                    fontWeight: 400,
                    lineHeight: "150.4%",
                    textAlign: "center",
                  }}
                >
                  Avg. Grade
                </Typography>
                <Typography
                  sx={{
                    color: "var(--Text-Color-1, #3B3D3B)",
                    fontFamily: "Inter, sans-serif",
                    fontSize: "12px",
                    fontStyle: "normal",
                    fontWeight: 700,
                    lineHeight: "150.4%",
                    textAlign: "center",
                  }}
                >
                  {data?.average_grade || 0}%
                </Typography>
              </Box>
              </Box>
            </Box>
            <Box
              sx={{
                display: "flex",
                flexDirection: "column",
                justifyContent: "flex-end",
                height: "100%",
              }}
            >
              
            </Box>
          </Box>
          <Box
            sx={{
              display: "flex",
              padding: "14px 12px",
              alignItems: "flex-start",
              gap: "10px",
              alignSelf: "stretch",
              borderRadius: "12px",
              background: "#E6F1FD",
            }}
          >
            <Box
              sx={{
                width: "58px",
                height: "58px",
                flexShrink: 0,
                borderRadius: "8px",
                background: "#FFF",
              }}
            >
              <Box
                sx={{
                  display: "flex",
                  width: "24px",
                  height: "24px",
                  justifyContent: "center",
                  alignItems: "center",
                  flexShrink: 0,
                  margin: "17px",
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
                    d="M12 18.2C14.2091 18.2 16 16.4091 16 14.2C16 11.9908 14.2091 10.2 12 10.2C9.79086 10.2 8 11.9908 8 14.2C8 16.4091 9.79086 18.2 12 18.2Z"
                    stroke="#007AFF"
                    stroke-width="1.5"
                    stroke-miterlimit="10"
                    stroke-linecap="round"
                    stroke-linejoin="round"
                  />
                  <path
                    d="M10.4399 14.2999L11.0899 14.9499C11.2799 15.1399 11.5899 15.1399 11.7799 14.9599L13.5599 13.3199"
                    stroke="#007AFF"
                    stroke-width="1.5"
                    stroke-linecap="round"
                    stroke-linejoin="round"
                  />
                  <path
                    d="M8.00007 22H16.0001C20.0201 22 20.7401 20.39 20.9501 18.43L21.7001 10.43C21.9701 7.99 21.2701 6 17.0001 6H7.00007C2.73007 6 2.03007 7.99 2.30007 10.43L3.05007 18.43C3.26007 20.39 3.98007 22 8.00007 22Z"
                    stroke="#007AFF"
                    stroke-width="1.5"
                    stroke-miterlimit="10"
                    stroke-linecap="round"
                    stroke-linejoin="round"
                  />
                  <path
                    d="M8 6V5.2C8 3.43 8 2 11.2 2H12.8C16 2 16 3.43 16 5.2V6"
                    stroke="#007AFF"
                    stroke-width="1.5"
                    stroke-miterlimit="10"
                    stroke-linecap="round"
                    stroke-linejoin="round"
                  />
                  <path
                    d="M21.65 11C19.92 12.26 18 13.14 16.01 13.64"
                    stroke="#007AFF"
                    stroke-width="1.5"
                    stroke-miterlimit="10"
                    stroke-linecap="round"
                    stroke-linejoin="round"
                  />
                  <path
                    d="M2.62012 11.27C4.29012 12.41 6.11012 13.22 8.00012 13.68"
                    stroke="#007AFF"
                    stroke-width="1.5"
                    stroke-miterlimit="10"
                    stroke-linecap="round"
                    stroke-linejoin="round"
                  />
                </svg>
              </Box>
            </Box>
            <Box
              sx={{
                display: "flex",
                justifyContent: "center",
                alignItems: "center",
                flexDirection: "column",
                width: "100%",
              }}
            >
              <Typography
                sx={{
                  alignSelf: "stretch",
                  color: "var(--Text-Color-1, #3B3D3B)",
                  fontFamily: "Inter, sans-serif",
                  fontSize: "16px",
                  fontStyle: "normal",
                  fontWeight: 600,
                  lineHeight: "normal",
                }}
              >
                Work Assigned
              </Typography>
              <Box
                sx={{
                  display: "flex",
                  justifyContent: "space-between",
                  width: "100%",
                }}
              >
                <Typography
                  sx={{
                    alignSelf: "stretch",
                    color: "var(--Text-Color-1, #3B3D3B)",
                    fontFamily: "Inter, sans-serif",
                    fontSize: "24px",
                    fontStyle: "normal",
                    fontWeight: 600,
                    lineHeight: "normal",
                    marginTop: "7px",
                  }}
                >
                  {data?.total_assignments || 0}
                </Typography>
                <Box
                  sx={{
                    display: "inline-flex",
                    alignItems: "center",
                    justifyContent: "center",
                    padding: "4px",
                    gap: "5px",
                    borderRadius: "6px",
                    background: "#FFF",
                  }}
                >
                  <Typography
                    sx={{
                      color: "var(--Text-Color-1, #3B3D3B)",
                      fontFamily: "Inter, sans-serif",
                      fontSize: "12px",
                      fontStyle: "normal",
                      fontWeight: 400,
                      lineHeight: "150.4%",
                      textAlign: "center",
                    }}
                  >
                    Avg. Percentage
                  </Typography>
                  <Typography
                    sx={{
                      color: "var(--Text-Color-1, #3B3D3B)",
                      fontFamily: "Inter, sans-serif",
                      fontSize: "12px",
                      fontStyle: "normal",
                      fontWeight: 700,
                      lineHeight: "150.4%",
                      textAlign: "center",
                    }}
                  >
                    {data?.average_percentage || 0}%
                  </Typography>
                </Box>
              </Box>
            </Box>
          </Box>
        </Box>
  );
};

export default ClassAssignment;

// Component for the bubble pattern
// export const BubblePattern = () => (
//   <Box sx={{ position: "relative", width: 100, height: 100 }}>
//     {[
//       { top: 10, left: 10, size: 30, color: "#a3e635" },
//       { top: 20, left: 40, size: 25, color: "#65a30d" },
//       { top: 50, left: 20, size: 40, color: "#84cc16" },
//       { top: 30, left: 70, size: 35, color: "#eab308" },
//       { top: 80, left: 50, size: 25, color: "#ca8a04" },
//       { top: 70, left: 90, size: 20, color: "#84cc16" },
//       { top: 15, left: 75, size: 15, color: "#84cc16" },
//       { top: 60, left: 70, size: 30, color: "#a3e635" },
//       { top: 40, left: 100, size: 20, color: "#65a30d" },
//     ]?.map((bubble, index) => (
//       <FaCircle
//         key={index}
//         style={{
//           position: "absolute",
//           top: bubble.top,
//           left: bubble.left,
//           fontSize: bubble.size,
//           color: bubble.color,
//         }}
//       />
//     ))}
//   </Box>
// );
