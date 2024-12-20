import React, { useState } from "react";
import styles from "./Seekbar.module.css";
import { Box, Typography, Popover } from "@mui/material";

const Seekbar = ({ data, time, onClickonUser, totalTime }) => {
  const [hoveredIndex, setHoveredIndex] = useState(null);
  const [showTooltip, setShowTooltip] = useState(false);

  const [anchorEl, setAnchorEl] = React.useState(null);

  const handlePopoverOpen = (event) => {
    setAnchorEl(event.currentTarget);
  };

  const handlePopoverClose = () => {
    setAnchorEl(null);
  };

  const open = Boolean(anchorEl);

  return (
    <Box className={styles.seekBar}>
      {data?.map((obj, index) => {
        const timePersantage = obj.start / 10 / totalTime;
        if (timePersantage > 100) {
          return null;
        }
        return (
          <Box key={index}>
            <Box
              onClick={() => onClickonUser(obj.start)}
              onMouseOver={() => {
                setHoveredIndex(index);
                setShowTooltip(true);
              }}
              onMouseOut={() => {
                setHoveredIndex(null);
                setShowTooltip(false);
              }}
              aria-owns={open ? "mouse-over-popover" : undefined}
              aria-haspopup="true"
              onMouseEnter={handlePopoverOpen}
              onMouseLeave={handlePopoverClose}
              key={index}
              className={styles.thumb}
              style={{
                marginLeft: `calc(${timePersantage}% - 1px)`,
                backgroundColor: "#4caf50",
              }}
            />
          {hoveredIndex===index &&  <Popover
              id="mouse-over-popover"
              sx={{ pointerEvents: "none" }}
              open={open}
              anchorEl={anchorEl}
              anchorOrigin={{
                vertical: 'top',
                horizontal: 'center',
              }}
              transformOrigin={{
                vertical: 'bottom',
                horizontal: 'center',
              }}
              onClose={handlePopoverClose}
              disableRestoreFocus
            >
              <Typography sx={{ p: 1 ,maxWidth:300}}>
                {" "}
                {obj.gist && (
                  <div>
                    <b className="font-black">Title :</b> {obj.gist}
                  </div>
                )}
                {obj.headline && (
                  <div>
                    <b className="font-black">Heading :</b> {obj.headline}
                  </div>
                )}
              </Typography>
            </Popover>}
          </Box>
        );
      })}

      <Box
        className={styles.mainThumb}
        style={{ marginLeft: `calc(${(100 * time) / totalTime}% - 3px)` }}
      ></Box>
    </Box>
  );
};

export default Seekbar;
