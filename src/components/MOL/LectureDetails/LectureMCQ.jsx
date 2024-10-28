import React from 'react'
import { Box, Typography } from '@mui/material'

const LectureMCQ = ({isDarkMode}) => {
  return (
    <Box
          sx={{
            p: 3,
            width: "100%",
            color: isDarkMode ? "#F0EAD6" : "#36454F",
            borderRadius: "8px",
            background: isDarkMode
              ? "radial-gradient(circle at 10% 20%, rgb(90, 92, 106) 0%, rgb(32, 45, 58) 81.3%)"
              : "radial-gradient(circle at 18.7% 37.8%, rgb(250, 250, 250) 0%, rgb(225, 234, 238) 90%)",
          }}
        >
          <Typography variant="h6" fontWeight="bold">
            Key points
          </Typography>
          <ul>
            <li>The lecture started with an introduction to basic concepts.</li>
            <li>In-depth discussion on the main topic followed.</li>
            <li>Q&A session at the end to clarify doubts.</li>
          </ul>
        </Box>
  )
}

export default LectureMCQ
