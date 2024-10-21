"use client";
import { Box, Grid } from "@mui/material";
import React from "react";
import ListingCard from "@/commonComponents/ListingCard/ListingCard";
import Filters from "@/components/teacher/lecture-listings/Filters/Filters";

const page = () => {
  return (
    <Box sx={{ width: "100%", height: "100%" }}>
      <Filters />
      <Grid container  mt={3}>
        {Array.from({ length: 9 }, (_, ind) => (
          <Grid item xs={12} sm={4} key={ind}>
            <ListingCard ind={ind} />
          </Grid>
        ))}
      </Grid>
    </Box>
  );
};

export default page;
