import React from 'react';
import { Box, Paper, CardContent, Typography, Button, List, ListItem, ListItemText, Grid, IconButton } from '@mui/material';
import { FaUpload, FaEdit, FaTrash, FaBook } from 'react-icons/fa';
import { keyframes } from '@mui/system';

const fadeIn = keyframes`
  from {
    opacity: 0;
    transform: translateY(20px);
  }
  to {
    opacity: 1;
    transform: translateY(0);
  }
`;

const cardStyle = {
  animation: `${fadeIn} 0.5s ease-in-out`,
  transition: 'transform 0.3s ease-in-out',
  '&:hover': {
    transform: 'translateY(-10px)',
  },
  padding: 2,
  textAlign: 'center',
};

const buttonStyle = {
  backgroundColor: '#1976d2',
  color: '#fff',
  '&:hover': {
    backgroundColor: '#1565c0',
  },
};

const ResourceManagement = () => {
  // Sample data
  const resources = [
    { id: 1, title: 'Introduction to Algebra', type: 'PDF', date: '2024-09-01' },
    { id: 2, title: 'Chemistry Lab Manual', type: 'Doc', date: '2024-09-02' },
    { id: 3, title: 'Physics Lecture Notes', type: 'PDF', date: '2024-09-03' },
  ];

  const popularResources = [
    { id: 1, title: 'Calculus Handbook', type: 'PDF', views: 1500 },
    { id: 2, title: 'Biology Diagrams', type: 'Image', views: 1200 },
    { id: 3, title: 'World History Timeline', type: 'PDF', views: 900 },
  ];

  return (
    <Box sx={{ flexGrow: 1, p: 2 }}>
      <Grid container spacing={3}>
        {/* Upload Resources */}
        <Grid item xs={12}>
          <Paper elevation={4} sx={cardStyle}>
            <CardContent>
              <Typography variant="h6" component="div" sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center' }}>
                <FaUpload style={{ marginRight: 8 }} />
                Upload Resources
              </Typography>
              <Button variant="contained" sx={{ ...buttonStyle, mt: 2 }}>
                Upload New Resource
              </Button>
            </CardContent>
          </Paper>
        </Grid>

        {/* Manage Resources */}
        <Grid item xs={12} sm={6}>
          <Paper elevation={4} sx={cardStyle}>
            <CardContent>
              <Typography variant="h6" component="div" sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center' }}>
                Manage Resources
              </Typography>
              <List>
                {resources.map((resource) => (
                  <ListItem
                    key={resource.id}
                    secondaryAction={
                      <>
                        <IconButton edge="end" aria-label="edit" sx={{ color: '#1976d2' }}>
                          <FaEdit />
                        </IconButton>
                        <IconButton edge="end" aria-label="delete" sx={{ color: '#d32f2f' }}>
                          <FaTrash />
                        </IconButton>
                      </>
                    }
                  >
                    <ListItemText
                      primary={resource.title}
                      secondary={`${resource.type} | Uploaded on: ${resource.date}`}
                    />
                  </ListItem>
                ))}
              </List>
            </CardContent>
          </Paper>
        </Grid>

        {/* Library Overview */}
        <Grid item xs={12} sm={6}>
          <Paper elevation={4} sx={cardStyle}>
            <CardContent>
              <Typography variant="h6" component="div" sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center' }}>
                <FaBook style={{ marginRight: 8 }} />
                Library Overview
              </Typography>
              <List>
                {popularResources.map((resource) => (
                  <ListItem key={resource.id}>
                    <ListItemText
                      primary={resource.title}
                      secondary={`${resource.type} | Views: ${resource.views}`}
                    />
                  </ListItem>
                ))}
              </List>
            </CardContent>
          </Paper>
        </Grid>
      </Grid>
    </Box>
  );
};

export default ResourceManagement;
