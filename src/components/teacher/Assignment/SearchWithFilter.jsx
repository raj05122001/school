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

  return (
    <>
      {/* Search bar with filter toggle */}
      <Box sx={{ display: "flex", alignItems: "center", p: 2 }}>
        <Paper
          component="form"
          onSubmit={handleSearchSubmit}
          sx={{
            p: "2px 8px",
            display: "flex",
            alignItems: "center",
            flex: 1,
            borderRadius: "16px",
            border: "1px solid #ccc",
          }}
        >
          <InputBase
            sx={{ ml: 1, flex: 1 }}
            placeholder="Search"
            value={searchInput}
            onChange={(e) => setSearchInput(e.target.value)}
          />
          <IconButton type="submit">
            <FiSearch />
          </IconButton>
        </Paper>
        <IconButton
          onClick={() => setFilterOpen(true)}
          sx={{ ml: 2, border: "1px solid #ccc", borderRadius: 2, width: 42, height: 42 }}
        >
          <FiFilter />
        </IconButton>
      </Box>

      {/* Filter dialog */}
      <Dialog open={filterOpen} onClose={() => setFilterOpen(false)} fullWidth maxWidth="md">
        <DialogTitle>Search Filters</DialogTitle>
        <DialogContent>
          <LocalizationProvider dateAdapter={AdapterDayjs}>
            <Grid container spacing={2} sx={{ mt: 1 }}>
              <Grid item xs={12} sm={4}>
                <Autocomplete
                  freeSolo
                  options={classList.map((c) => c.name)}
                  value={filterClass}
                  onChange={(_e, val) => setFilterClass(val || "")}
                  renderInput={(params) => (
                    <TextField
                      {...params}
                      label="Class"
                      InputProps={{
                        ...params.InputProps,
                        endAdornment: filterClass ? (
                          <InputAdornment position="end">
                            <IconButton onClick={() => setFilterClass("")}
                              edge="end"
                            >
                              <FaTimes />
                            </IconButton>
                          </InputAdornment>
                        ) : null,
                      }}
                    />
                  )}
                />
              </Grid>
              <Grid item xs={12} sm={4}>
                <Autocomplete
                  freeSolo
                  options={subjectList.map((s) => s.name)}
                  value={filterSubject}
                  onChange={(_e, val) => setFilterSubject(val || "")}
                  renderInput={(params) => (
                    <TextField
                      {...params}
                      label="Subject"
                      InputProps={{
                        ...params.InputProps,
                        endAdornment: filterSubject ? (
                          <InputAdornment position="end">
                            <IconButton onClick={() => setFilterSubject("")}
                              edge="end"
                            >
                              <FaTimes />
                            </IconButton>
                          </InputAdornment>
                        ) : null,
                      }}
                    />
                  )}
                  disabled={!filterClass}
                />
              </Grid>
              <Grid item xs={12} sm={4}>
                <DatePicker
                  views={["month"]}
                  label="Month"
                  value={filterDate}
                  onChange={(val) => setFilterDate(val)}
                  renderInput={(params) => <TextField {...params} fullWidth />}
                />
              </Grid>
            </Grid>
          </LocalizationProvider>
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setFilterOpen(false)}>Cancel</Button>
          <Button variant="contained" onClick={handleApplyFilters}>
            Apply
          </Button>
        </DialogActions>
      </Dialog>
    </>
  );
}
