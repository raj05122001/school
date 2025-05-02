"use client";

import {
  Box,
  IconButton,
  InputBase,
  Paper,
  Dialog,
  DialogTitle,
  DialogContent,
  Grid,
  TextField,
  Button,
} from "@mui/material";
import { FiSearch, FiFilter } from "react-icons/fi";
import { useState, useEffect, useRef } from "react";
import { DatePicker } from "@mui/x-date-pickers/DatePicker";
import { AdapterDayjs } from "@mui/x-date-pickers/AdapterDayjs";
import { LocalizationProvider } from "@mui/x-date-pickers/LocalizationProvider";
import dayjs from "dayjs";
import { usePathname, useRouter, useSearchParams } from "next/navigation";

export default function SearchWithFilter() {
  const searchParams = useSearchParams();
  const router = useRouter();
  const pathname = usePathname();

  // Controlled inputs, initialized from URL
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

  // Keep state synced if URL is changed elsewhere
  useEffect(() => {
    setSearchInput(searchParams.get("globalSearch") || "");
    setFilterClass(searchParams.get("class") || "");
    setFilterSubject(searchParams.get("subject") || "");
    setFilterDate(
      searchParams.get("month") ? dayjs(searchParams.get("month")) : null
    );
  }, [searchParams]);

  // Debounce flag to skip the very first render
  const firstSearchRef = useRef(true);

  // Debounced search: updates ?globalSearch=… as user types
  useEffect(() => {
    if (firstSearchRef.current) {
      firstSearchRef.current = false;
      return;
    }
    const handler = setTimeout(() => {
      const params = new URLSearchParams(searchParams.toString());
      if (searchInput) params.set("globalSearch", searchInput);
      else params.delete("globalSearch");
      // replace so user can use back button normally
      router.replace(`${pathname}?${params.toString()}`);
    }, 500);

    return () => clearTimeout(handler);
  }, [searchInput, pathname, router, searchParams]);

  // Manual submit (Enter key) still works
  const handleSearchSubmit = (e) => {
    e.preventDefault();
    const params = new URLSearchParams(searchParams.toString());
    if (searchInput) params.set("globalSearch", searchInput);
    else params.delete("globalSearch");
    router.push(`${pathname}?${params.toString()}`);
  };

  // Apply filters when “Apply” is clicked
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
      {/* Search Bar */}
      <Box sx={{ display: "flex", justifyContent: "space-between", p: 2 }}>
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
          sx={{
            ml: 2,
            borderRadius: 2,
            border: "1px solid #ccc",
            height: "42px",
            width: "42px",
          }}
        >
          <FiFilter />
        </IconButton>
      </Box>

      {/* Filter Modal */}
      <Dialog
        open={filterOpen}
        onClose={() => setFilterOpen(false)}
        fullWidth
        maxWidth="md"
      >
        <DialogTitle sx={{ fontWeight: "bold" }}>
          Search filter
        </DialogTitle>
        <DialogContent>
          <Box sx={{ p: 1 }}>
            <Grid container spacing={2}>
              <Grid item xs={12} sm={6} md={3}>
                <TextField
                  label="Class"
                  fullWidth
                  size="small"
                  variant="outlined"
                  value={filterClass}
                  onChange={(e) => setFilterClass(e.target.value)}
                />
              </Grid>
              <Grid item xs={12} sm={6} md={3}>
                <TextField
                  label="Subject"
                  fullWidth
                  size="small"
                  variant="outlined"
                  value={filterSubject}
                  onChange={(e) => setFilterSubject(e.target.value)}
                />
              </Grid>
              <Grid item xs={12} sm={6} md={3}>
                <LocalizationProvider dateAdapter={AdapterDayjs}>
                  <DatePicker
                    label="Date"
                    value={filterDate}
                    onChange={(newDate) => setFilterDate(newDate)}
                    slotProps={{
                      textField: { size: "small", fullWidth: true },
                    }}
                  />
                </LocalizationProvider>
              </Grid>
            </Grid>

            <Box
              sx={{
                mt: 3,
                display: "flex",
                justifyContent: "flex-end",
                gap: 2,
              }}
            >
              <Button
                onClick={() => setFilterOpen(false)}
                variant="outlined"
              >
                Cancel
              </Button>
              <Button
                onClick={handleApplyFilters}
                variant="contained"
                color="primary"
              >
                Apply
              </Button>
            </Box>
          </Box>
        </DialogContent>
      </Dialog>
    </>
  );
}
