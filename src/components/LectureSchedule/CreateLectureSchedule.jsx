import { Fragment, useState, useRef } from "react";
import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Button,
  TextField,
  IconButton,
  Typography,
  Box,
} from "@mui/material";
import { IoCloseSharp } from "react-icons/io5";
import { useForm } from "react-hook-form";
import { uploadExcelFile } from "@/api/apiHelper";
import { useThemeContext } from "@/hooks/ThemeContext";
import { FaRegFileExcel } from "react-icons/fa";


export default function CreateLectureSchedule({ open, setOpen }) {
  const inputRef = useRef(null);
  const { isDarkMode, primaryColor } = useThemeContext();
  const [loading, setLoading] = useState(false)

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm();
  const [addFile, setAddFile] = useState("");
  const [error, setError] = useState("");

  const onSubmit = async () => {
    if (!addFile) {
      setError("Please add syllabus file.");
      return;
    }
    const formData = new FormData();
    formData.append("File", addFile);
    setLoading(true)
    try {
      await uploadExcelFile(formData);
      setOpen(false);
    } catch (error) {
      console.error(error);
    }finally {
      setLoading(false)
    }
  };

  const handleRemoveFile = () => {
    setAddFile("");
    inputRef.current.value = null;
  };

  return (
    loading ? (           
          <Box className="overlay">
            <Box className="loader"></Box>
        </Box>        
         ) :
    <Fragment>
      <Dialog open={open} onClose={() => setOpen(false)} fullWidth maxWidth="xs"
      sx={{
        "& .MuiDialogContent-root": {
          bgcolor: isDarkMode ? "#424242" : "white",
          color: isDarkMode ? "white" : "black",
          background: isDarkMode
            ? "linear-gradient(180.3deg, rgb(221, 221, 221) 5.5%, rgb(110, 136, 161) 90.2%);"
            : "radial-gradient(592px at 48.2% 50%, rgba(255, 255, 249, 0.6) 0%, rgb(160, 199, 254) 74.6%);",
        },
        "& .MuiDialogTitle-root": {
          bgcolor: isDarkMode ? "#424242" : "white",
          color: isDarkMode ? "white" : "black",
          display: "flex",
          justifyContent: "center",
          alignItems: "cener",
          background: isDarkMode
            ? "linear-gradient(to top, #09203f 0%, #537895 100%);"
            : "linear-gradient(to top, #fff1eb 0%, #ace0f9 100%);",
        },
        "& .MuiPaper-root": {
          border: "2px solid #0096FF",
          borderRadius: "12px",
        },
      }}
      >
        <DialogTitle>
          <Box display="flex" justifyContent="space-between" alignItems="center">
            <FaRegFileExcel style={{marginRight:3, color:isDarkMode? "white":"black"}}/>
            <Typography variant="h6">Upload Syllabus</Typography>
          </Box>
        </DialogTitle>
        <DialogContent>
          <form onSubmit={handleSubmit(onSubmit)}>
            <Box display="flex" flexDirection="column" gap={2} mt={2}>
              <input
                id="upload_file"
                type="file"
                ref={inputRef}
                accept=".xlsx"
                style={{ display: "none" }}
                onChange={(e) => {
                  setAddFile(e.target.files[0]);
                  if (e.target.files[0]) {
                    setError("");
                  }
                }}
              />
              <Box
                border={1}
                borderColor="#ccc"
                borderRadius={1}
                p={2}
                bgcolor="#F5F7F9"
              >
                {addFile && (
                  <Box borderBottom={1} pb={1} mb={1}>
                    <Box display="flex" justifyContent="space-between" alignItems="center">
                      <Typography variant="body2" color="#919BA7">
                        {addFile.name}
                      </Typography>
                      <IconButton onClick={handleRemoveFile}>
                        <IoCloseSharp fontSize="small" color="#919BA7" />
                      </IconButton>
                    </Box>
                  </Box>
                )}
                <label htmlFor="upload_file" style={{ cursor: "pointer" }}>
                  <Typography variant="body2" color="primary">
                    Upload the Course File
                  </Typography>
                </label>
              </Box>
              {error && (
                <Typography variant="body2" color="error">
                  {error}
                </Typography>
              )}
            </Box>
          </form>
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setOpen(false)} color="primary">
            Cancel
          </Button>
          <Button onClick={handleSubmit(onSubmit)} color="primary">
            Save
          </Button>
        </DialogActions>
      </Dialog>
    </Fragment>
  );
}
