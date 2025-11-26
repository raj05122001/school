"use client";

import React, { useState, useEffect, useRef } from "react";
import {
  Box,
  IconButton,
  InputBase,
  Paper,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Grid,
  TextField,
  Button,
  Autocomplete,
  InputAdornment,
  useMediaQuery,
  useTheme,
  Typography,
  Chip,
  Divider,
} from "@mui/material";
import { FiSearch, FiFilter } from "react-icons/fi";
import { FaTimes } from "react-icons/fa";
import { DatePicker } from "@mui/x-date-pickers/DatePicker";
import { AdapterDayjs } from "@mui/x-date-pickers/AdapterDayjs";
import { LocalizationProvider } from "@mui/x-date-pickers/LocalizationProvider";
import dayjs from "dayjs";
import { usePathname, useRouter, useSearchParams } from "next/navigation";
import { getClassByCourse, getSubjectByClass } from "@/api/apiHelper";

export default function SearchWithFilter() {
  const searchParams = useSearchParams();
  const router = useRouter();
  const pathname = usePathname();
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down('sm'));
  const isTablet = useMediaQuery(theme.breakpoints.down('md'));

  const [searchInput, setSearchInput] = useState(
    searchParams.get("globalSearch") || ""
  );
  const [filterClass, setFilterClass] = useState(
    searchParams.get("class") || ""
  );
  const [filterSubject, setFilterSubject] = useState(
    searchParams.get("subject") || ""
  );
  const [filterDate, setFilterDate] = useState(
    searchParams.get("month") ? dayjs(searchParams.get("month")) : null
  );
  const [filterOpen, setFilterOpen] = useState(false);

  const [classList, setClassList] = useState([]);
  const [subjectList, setSubjectList] = useState([]);

  // Count active filters for badge
  const activeFiltersCount = [
    filterClass,
    filterSubject,
    filterDate
  ].filter(Boolean).length;

  // Fetch classes on mount
  useEffect(() => {
    async function loadClasses() {
      try {
        const res = await getClassByCourse("", "");
        setClassList(res?.data?.data || []);
      } catch (err) {
        console.error("Error loading classes", err);
      }
    }
    loadClasses();
  }, []);

  // Fetch subjects whenever class changes
  useEffect(() => {
    async function loadSubjects() {
      if (!filterClass) {
        setSubjectList([]);
        return;
      }
      try {
        const res = await getSubjectByClass(filterClass, "");
        setSubjectList(res?.data?.data || []);
      } catch (err) {
        console.error("Error loading subjects", err);
      }
    }
    loadSubjects();
  }, [filterClass]);

  useEffect(() => {
    if (!filterClass) setFilterSubject("");
  }, [filterClass]);

  // Sync state with URL params
  useEffect(() => {
    setSearchInput(searchParams.get("globalSearch") || "");
    setFilterClass(searchParams.get("class") || "");
    setFilterSubject(searchParams.get("subject") || "");
    setFilterDate(
      searchParams.get("month") ? dayjs(searchParams.get("month")) : null
    );
  }, [searchParams]);

  const firstSearchRef = useRef(true);
  // Debounce global search param update
  useEffect(() => {
    if (firstSearchRef.current) {
      firstSearchRef.current = false;
      return;
    }
    const timer = setTimeout(() => {
      const params = new URLSearchParams(searchParams.toString());
      if (searchInput) params.set("globalSearch", searchInput);
      else params.delete("globalSearch");
      router.replace(`${pathname}?${params.toString()}`);
    }, 500);
    return () => clearTimeout(timer);
  }, [searchInput]);

  // Handle Enter key submit
  const handleSearchSubmit = (e) => {
    e.preventDefault();
    const params = new URLSearchParams(searchParams.toString());
    if (searchInput) params.set("globalSearch", searchInput);
    else params.delete("globalSearch");
    router.push(`${pathname}?${params.toString()}`);
  };

  // Apply filters and push URL
  const handleApplyFilters = () => {
    const params = new URLSearchParams(searchParams.toString());
    if (filterClass) params.set("class", filterClass);
    else params.delete("class");
    if (filterSubject) params.set("subject", filterSubject);
    else params.delete("subject");
    if (filterDate) params.set("month", filterDate.toISOString());
    else params.delete("month");
    router.push(`${pathname}?${params.toString()}`);
    setFilterOpen(false);
  };

  // Clear all filters
  const handleCancelFilters = () => {
    const params = new URLSearchParams(searchParams.toString());
    params.delete("class");
    params.delete("subject");
    params.delete("month");
    router.push(`${pathname}?${params.toString()}`);

    setFilterClass("");
    setFilterSubject("");
    setFilterDate(null);
    setSubjectList([]);
    setFilterOpen(false);
  };

  // Clear individual filter
  const handleClearFilter = (filterType) => {
    const params = new URLSearchParams(searchParams.toString());
    
    switch (filterType) {
      case 'class':
        setFilterClass("");
        params.delete("class");
        setFilterSubject("");
        params.delete("subject");
        break;
      case 'subject':
        setFilterSubject("");
        params.delete("subject");
        break;
      case 'date':
        setFilterDate(null);
        params.delete("month");
        break;
      case 'search':
        setSearchInput("");
        params.delete("globalSearch");
        break;
      default:
        break;
    }
    
    router.push(`${pathname}?${params.toString()}`);
  };

  return (
    <>
      {/* Search bar with filter toggle - Improved Design */}
      <Box sx={{ 
        display: "flex", 
        alignItems: "center", 
        p: isMobile ? 1 : 2,
        gap: isMobile ? 1 : 2,
        flexDirection: isMobile ? 'column' : 'row'
      }}>
        {/* Search Input */}
        <Paper
          component="form"
          onSubmit={handleSearchSubmit}
          sx={{
            p: "2px 8px",
            display: "flex",
            alignItems: "center",
            flex: 1,
            borderRadius: "12px",
            border: "1px solid #e0e0e0",
            boxShadow: "0 2px 8px rgba(0,0,0,0.05)",
            width: isMobile ? '100%' : 'auto',
            minWidth: isMobile ? 'auto' : '300px',
            transition: 'all 0.2s ease',
            '&:hover': {
              boxShadow: "0 4px 12px rgba(0,0,0,0.1)",
              borderColor: theme.palette.primary.main,
            },
            '&:focus-within': {
              boxShadow: `0 4px 12px ${theme.palette.primary.main}20`,
              borderColor: theme.palette.primary.main,
            }
          }}
        >
          <FiSearch style={{ color: '#666', margin: '0 8px' }} />
          <InputBase
            sx={{ 
              ml: 1, 
              flex: 1,
              fontSize: isMobile ? '14px' : '16px',
              '& input::placeholder': {
                fontSize: isMobile ? '14px' : '16px',
                color: '#999'
              }
            }}
            placeholder="Search lectures..."
            value={searchInput}
            onChange={(e) => setSearchInput(e.target.value)}
          />
          {searchInput && (
            <IconButton 
              onClick={() => handleClearFilter('search')} 
              edge="end"
              size="small"
              sx={{ 
                color: '#666',
                '&:hover': { color: theme.palette.error.main }
              }}
            >
              <FaTimes />
            </IconButton>
          )}
        </Paper>

        {/* Filter Button with Badge */}
        <Box sx={{ position: 'relative', display: isMobile ? 'flex' : 'block', width: isMobile ? '100%' : 'auto' }}>
          <Button
            variant="outlined"
            onClick={() => setFilterOpen(true)}
            startIcon={<FiFilter />}
            sx={{
              border: "1px solid #e0e0e0",
              borderRadius: "12px",
              padding: isMobile ? '8px 16px' : '10px 20px',
              textTransform: 'none',
              fontWeight: 500,
              fontSize: isMobile ? '14px' : '16px',
              color: '#333',
              backgroundColor: '#fff',
              width: isMobile ? '100%' : 'auto',
              justifyContent: isMobile ? 'center' : 'flex-start',
              '&:hover': {
                borderColor: theme.palette.primary.main,
                backgroundColor: '#f8f9fa',
              }
            }}
          >
            Filters
            {activeFiltersCount > 0 && (
              <Box
                sx={{
                  backgroundColor: theme.palette.primary.main,
                  color: 'white',
                  borderRadius: '50%',
                  width: 20,
                  height: 20,
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  fontSize: '12px',
                  fontWeight: 'bold',
                  marginLeft: 1
                }}
              >
                {activeFiltersCount}
              </Box>
            )}
          </Button>
        </Box>
      </Box>

      {/* Active Filters Display */}
      {(filterClass || filterSubject || filterDate) && (
        <Box sx={{ px: isMobile ? 1 : 2, pb: 1 }}>
          <Typography variant="body2" color="textSecondary" sx={{ mb: 1, fontSize: '14px' }}>
            Active filters:
          </Typography>
          <Box sx={{ display: 'flex', gap: 1, flexWrap: 'wrap' }}>
            {filterClass && (
              <Chip
                label={`Class: ${filterClass}`}
                onDelete={() => handleClearFilter('class')}
                size="small"
                color="primary"
                variant="outlined"
              />
            )}
            {filterSubject && (
              <Chip
                label={`Subject: ${filterSubject}`}
                onDelete={() => handleClearFilter('subject')}
                size="small"
                color="primary"
                variant="outlined"
              />
            )}
            {filterDate && (
              <Chip
                label={`Month: ${filterDate.format('MMM YYYY')}`}
                onDelete={() => handleClearFilter('date')}
                size="small"
                color="primary"
                variant="outlined"
              />
            )}
          </Box>
        </Box>
      )}

      {/* Filter Dialog - Improved Design */}
      <Dialog 
        open={filterOpen} 
        onClose={() => setFilterOpen(false)} 
        fullWidth 
        maxWidth="sm"
        PaperProps={{
          sx: {
            borderRadius: '16px',
            overflow: 'hidden'
          }
        }}
      >
        <DialogTitle sx={{ 
          backgroundColor: '#f8f9fa',
          borderBottom: '1px solid #e0e0e0',
          py: 2
        }}>
          <Typography variant="h6" fontWeight="600">
            Search Filters
          </Typography>
          <Typography variant="body2" color="textSecondary" sx={{ mt: 0.5 }}>
            Refine your lecture search
          </Typography>
        </DialogTitle>
        
        <DialogContent sx={{ py: 3 }}>
          <LocalizationProvider dateAdapter={AdapterDayjs}>
            <Grid container spacing={3}>
              <Grid item xs={12} sx={{ mt: 2 }}> 
                <Autocomplete
                  freeSolo
                  options={classList.map((c) => c.name)}
                  value={filterClass || null}                   
                  inputValue={filterClass}                       
                  onInputChange={(_e, val) => setFilterClass(val || "")} 
                  onChange={(_e, val) => setFilterClass(val || "")}     
                  renderInput={(params) => (
                    <TextField
                      {...params}
                      label="Class"
                      variant="outlined"
                      fullWidth
                      InputProps={{
                        ...params.InputProps,
                        startAdornment: (
                          <InputAdornment position="start">
                            <Box sx={{ color: '#666', mr: 1 }}>🏫</Box>
                          </InputAdornment>
                        ),
                        endAdornment: filterClass ? (
                          <InputAdornment position="end">
                            <IconButton 
                              onClick={() => setFilterClass("")} 
                              edge="end"
                              size="small"
                            >
                              <FaTimes />
                            </IconButton>
                          </InputAdornment>
                        ) : null,
                      }}
                      sx={{
                        '& .MuiOutlinedInput-root': {
                          borderRadius: '12px',
                        }
                      }}
                    />
                  )}
                />
              </Grid>
              
              <Grid item xs={12}>
                <Autocomplete
                  freeSolo
                  options={subjectList.map((s) => s.name)}
                  value={filterSubject || null}                     
                  inputValue={filterSubject}                           
                  onInputChange={(_e, val) => setFilterSubject(val || "")} 
                  onChange={(_e, val) => setFilterSubject(val || "")}       
                  disabled={!filterClass}
                  renderInput={(params) => (
                    <TextField
                      {...params}
                      label="Subject"
                      variant="outlined"
                      fullWidth
                      disabled={!filterClass}
                      InputProps={{
                        ...params.InputProps,
                        startAdornment: (
                          <InputAdornment position="start">
                            <Box sx={{ color: '#666', mr: 1 }}>📚</Box>
                          </InputAdornment>
                        ),
                        endAdornment: filterSubject ? (
                          <InputAdornment position="end">
                            <IconButton 
                              onClick={() => setFilterSubject("")} 
                              edge="end"
                              size="small"
                            >
                              <FaTimes />
                            </IconButton>
                          </InputAdornment>
                        ) : null,
                      }}
                      sx={{
                        '& .MuiOutlinedInput-root': {
                          borderRadius: '12px',
                        },
                        '& .MuiInputLabel-root.Mui-disabled': {
                          color: '#ccc'
                        }
                      }}
                      placeholder={!filterClass ? "Select a class first" : ""}
                    />
                  )}
                />
              </Grid>
              
              <Grid item xs={12}>
                <DatePicker
                  views={["month"]}
                  label="Month"
                  value={filterDate}
                  onChange={(val) => setFilterDate(val)}
                  renderInput={(params) => (
                    <TextField
                      {...params}
                      fullWidth
                      variant="outlined"
                      InputProps={{
                        ...params.InputProps,
                        startAdornment: (
                          <InputAdornment position="start">
                            <Box sx={{ color: '#666', mr: 1 }}>📅</Box>
                          </InputAdornment>
                        ),
                      }}
                      sx={{
                        '& .MuiOutlinedInput-root': {
                          borderRadius: '12px',
                        }
                      }}
                    />
                  )}
                />
              </Grid>
            </Grid>
          </LocalizationProvider>
        </DialogContent>
        
        <Divider />
        
        <DialogActions sx={{ py: 2, px: 3, gap: 1 }}>
          <Button 
            onClick={handleCancelFilters}
            variant="outlined"
            sx={{
              borderRadius: '10px',
              textTransform: 'none',
              fontWeight: 500,
              px: 3
            }}
          >
            Clear All
          </Button>
          <Button 
            variant="contained" 
            onClick={handleApplyFilters}
            sx={{
              borderRadius: '10px',
              textTransform: 'none',
              fontWeight: 500,
              px: 3
            }}
          >
            Apply Filters
          </Button>
        </DialogActions>
      </Dialog>
    </>
  );
}