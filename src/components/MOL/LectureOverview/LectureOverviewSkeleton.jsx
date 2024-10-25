import React from 'react';
import { Box, Skeleton, Typography } from '@mui/material';

const LectureOverviewSkeleton = () => {
  return (
    <Box>
      {/* Skeleton for Tab Header */}
      <Box display="flex" gap={2} mb={2}>
        <Skeleton variant="rectangular" width={100} height={30} />
        <Skeleton variant="rectangular" width={100} height={30} />
      </Box>

      {/* Skeleton for Summary Content */}
      <Box p={3}>
        <Skeleton variant="text" width="80%" height={30} />
        <Skeleton variant="text" width="90%" height={30} />
        <Skeleton variant="text" width="75%" height={30} />
      </Box>

      {/* Skeleton for Highlights Content */}
      <Box p={3}>
        <Typography variant="h6">
          <Skeleton width="40%" />
        </Typography>
        <Skeleton variant="text" width="85%" height={20} />
        <Skeleton variant="text" width="80%" height={20} />
        <Skeleton variant="text" width="70%" height={20} />
      </Box>
    </Box>
  );
};

export default LectureOverviewSkeleton;
