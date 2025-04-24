import { Autocomplete, TextField } from "@mui/material";
import { useThemeContext } from "@/hooks/ThemeContext";

const CustomAutocomplete = ({
  options,
  onSelect,
  onChange,
  label,
  value,
  disabled,
}) => {
  const { isDarkMode } = useThemeContext();

  const lowerCase = (value) => {
    return value ? value?.toLowerCase() : value;
  };

  const handleSelect = (newValue) => {
    onSelect(newValue);
    onChange(newValue?.name);
  };

  const handleChange = (newValue) => {
    const findValue = options?.find(
      (val) => lowerCase(val?.name) === lowerCase(newValue)
    );
    if (findValue) {
      onSelect(findValue);
      onChange(findValue?.name);
    } else {
      onChange(newValue);
    }
  };

  return (
    <Autocomplete
      freeSolo
      disableClearable
      options={options}
      value={value}
      getOptionLabel={(option) => option.name}
      // disabled = {disabled}
      onChange={(event, newValue) => {
        handleSelect(newValue);
      }}
      renderInput={(params) => (
        <TextField
          {...params}
          label={label}
          variant="outlined"
          onChange={(event) => handleChange(event.target.value)}
          InputLabelProps={{
            style: {},
            sx: {
              "&.Mui-focused": {
                fontSize: "16px",
                fontFamily: "Inter",
                color:"#000"
              },
            },
          }}
          InputProps={{
            ...params.InputProps,
            type: "search",
            sx: {
              borderRadius: "12px",
              fontSize: "16px",
              fontFamily: "Inter",
              backgroundColor: isDarkMode ? "" : "rgba(255, 255, 255, 0.5)",
              "& .MuiOutlinedInput-notchedOutline": {
                color:"#001B72"
              },
              "&.Mui-focused .MuiOutlinedInput-notchedOutline": {
                borderColor: "#001B72", // this is the key line
              },
            },
          }}
        />
      )}
    />
  );
};

export default CustomAutocomplete;
