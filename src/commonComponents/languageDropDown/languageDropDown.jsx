import { Box } from "@mui/material";
import React, { useState } from "react";
import { useLanguage } from "@/Context/LanguageContext"; 

const LanguageDropdown = () => {
  const { changeLanguage, lang } = useLanguage();
  const options = [
    { lang: "English", val: "en" },
    { lang: "हिन्दी", val: "hi" },
    { lang: "मराठी", val: "mr" },
  ];

  const handleChange = (event) => {
    changeLanguage(event?.target?.value);
  };

  return (
    <Box>
      <label htmlFor="dropdown" style={{ margin: "2px", padding: "2px" }}>
        Language:
      </label>
      <select
        id="dropdown"
        value={lang}
        onChange={handleChange}
        style={{
          margin: "2px",
          padding: "10px 8px",
          borderRadius: "4px",
          fontSize: "12px",
          lineHeight: "1.5",
        }}
      >
        <option value="" disabled>
          Select...
        </option>
        {options?.map((option, index) => (
          <option key={index} value={option?.val} style={{
            margin: "2px",
          padding: "10px 8px",
          borderRadius: "4px",
          fontSize: "16px",
          lineHeight: "1.5",
          }}>
            {option?.lang}
          </option>
        ))}
      </select>
      {/* {selectedOption && <p>You selected: {selectedOption}</p>} */}
    </Box>
  );
};

export default LanguageDropdown;
