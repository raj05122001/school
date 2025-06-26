// import { Box } from "@mui/material";
// import React, { useState } from "react";
// import { useLanguage } from "@/Context/LanguageContext";
// import { useTranslations } from "next-intl"; 

// const LanguageDropdown = () => {
//   const t=useTranslations();
//   const { changeLanguage, lang } = useLanguage();
//   const options = [
//     { lang: "English", val: "en" },
//     { lang: "हिन्दी", val: "hi" },
//     { lang: "मराठी", val: "mr" },
//   ];

//   const handleChange = (event) => {
//     changeLanguage(event?.target?.value);
//   };

//   return (
//     <Box>
//       <label htmlFor="dropdown" style={{ margin: "2px", padding: "2px" }}>
//         🌐{t("Language")}
//       </label>
//       <select
//         id="dropdown"
//         value={lang}
//         onChange={handleChange}
//         style={{
//           margin: "2px",
//           padding: "10px 8px",
//           borderRadius: "4px",
//           fontSize: "12px",
//           lineHeight: "1.5",
//         }}
//       >
//         <option value="" disabled>
//          {t("Select")}...
//         </option>
//         {options?.map((option, index) => (
//           <option key={index} value={option?.val} style={{
//             margin: "2px",
//           padding: "10px 8px",
//           borderRadius: "4px",
//           fontSize: "16px",
//           lineHeight: "1.5",
//           }}>
//             {option?.lang}
//           </option>
//         ))}
//       </select>
//       {/* {selectedOption && <p>You selected: {selectedOption}</p>} */}
//     </Box>

//   );
// };

// export default LanguageDropdown;


import { Box } from "@mui/material";
import React, { useState } from "react";
import { useLanguage } from "@/Context/LanguageContext";
import { useTranslations } from "next-intl";

const LanguageDropdown = () => {
  const t = useTranslations();
  const { changeLanguage, lang } = useLanguage();
  const [isOpen, setIsOpen] = useState(false);

  const options = [
    { lang: "English", val: "en", gradient: "from-blue-500 to-purple-600" },
    { lang: "हिन्दी", val: "hi", gradient: "from-orange-500 to-red-500" },
    { lang: "मराठी", val: "mr", gradient: "from-green-500 to-teal-500" },
  ];

  const selectedOption = options.find(option => option.val === lang) || options[0];

  const handleOptionClick = (value) => {
    changeLanguage(value);
    setIsOpen(false);
  };

  return (
    <Box
      sx={{
        position: 'relative',
        width: "220",
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'space-between',
        gap: '6px',
        margin: '2px',
        padding: '2px'
      }}
    >

      {/* Glowing Label */}
      <Box
        sx={{
          display: 'flex',
          alignItems: 'center',
          gap: '8px',
          marginBottom: '6px',
          fontSize: '16px',
          fontWeight: '700',
          background: 'linear-gradient(45deg, #667eea, #764ba2, #f093fb)',
          backgroundSize: '150% 150%',
          backgroundClip: 'text',
          WebkitBackgroundClip: 'text',
          WebkitTextFillColor: 'transparent',
          animation: 'gradient 3s ease infinite',
          '@keyframes gradient': {
            '0%': { backgroundPosition: '0% 50%' },
            '50%': { backgroundPosition: '100% 50%' },
            '100%': { backgroundPosition: '0% 50%' }
          }
        }}
      >
        <Box
          sx={{
            fontSize: '12px',
            filter: 'drop-shadow(0 0 8px rgba(102, 126, 234, 0.4))',
            animation: 'pulse 2s ease-in-out infinite'
          }}
        >

        </Box>
        {t("Language")}
      </Box>

      {/* Main Dropdown Button */}
      <Box
        onClick={() => setIsOpen(!isOpen)}
        sx={{
          position: 'relative',
          background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
          borderRadius: '16px',
          padding: '3px',
          cursor: 'pointer',
          width: "100%", 
          transition: 'all 0.3s cubic-bezier(0.4, 0, 0.2, 1)',
          '&:hover': {
            transform: 'translateY(-2px) scale(1.02)',
            boxShadow: '0 20px 40px rgba(102, 126, 234, 0.4), 0 0 20px rgba(118, 75, 162, 0.3)',
          },
          '&:active': {
            transform: 'translateY(0) scale(0.98)',
          }
        }}
      >
        <Box
          sx={{
            background: 'rgba(255, 255, 255, 0.95)',
            backdropFilter: 'blur(20px)',
            borderRadius: '8px',
            padding: '1.5px 10px',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between',
            border: '1px solid rgba(255, 255, 255, 0.2)',
          }}
        >
          {/* Selected Language Display */}
          <Box sx={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
            <Box
              sx={{
                fontSize: '12px',
                filter: 'drop-shadow(0 4px 8px rgba(0, 0, 0, 0.1))',
                animation: selectedOption ? 'bounce 0.6s ease-out' : 'none',
                '@keyframes bounce': {
                  '0%': { transform: 'scale(1)' },
                  '50%': { transform: 'scale(1.2)' },
                  '100%': { transform: 'scale(1)' }
                }
              }}
            >
              {selectedOption.flag}
            </Box>
            <Box>
              <Box sx={{
                fontSize: '16px',
                fontWeight: '700',
                color: '#2d3748',
                marginBottom: '1px'
              }}>
                {selectedOption.lang}
              </Box>
              <Box sx={{
                fontSize: '9px',
                color: '#718096',
                fontWeight: '500',
                textTransform: 'uppercase',
                letterSpacing: '1px'
              }}>
                {selectedOption.val.toUpperCase()}
              </Box>
            </Box>
          </Box>

          {/* Animated Arrow */}
          <Box
            sx={{
              width: '28px',
              height: '28px',
              borderRadius: '50%',
              background: 'linear-gradient(135deg, #667eea, #764ba2)',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              transition: 'all 0.3s ease',
              transform: isOpen ? 'rotate(180deg)' : 'rotate(0deg)',
              boxShadow: '0 4px 15px rgba(102, 126, 234, 0.3)',
            }}
          >
            <svg width="14" height="14" viewBox="0 0 24 24" fill="none">
              <path d="M7 10L12 15L17 10" stroke="white" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" />
            </svg>
          </Box>
        </Box>
      </Box>

      {/* Dropdown Menu */}
      {isOpen && (
        <>
          {/* Backdrop */}
          <Box
            onClick={() => setIsOpen(false)}
            sx={{
              position: 'fixed',
              top: 0,
              left: 0,
              right: 0,
              bottom: 0,
              zIndex: 998,
              background: 'rgba(0, 0, 0, 0.1)',
              backdropFilter: 'blur(2px)',
            }}
          />

          {/* Options Menu */}
          <Box
            sx={{
              position: 'absolute',
              top: '100%',
              left: 0,
              right: 0,
              marginTop: '8px',
              background: 'rgba(255, 255, 255, 0.95)',
              backdropFilter: 'blur(20px)',
              borderRadius: '20px',
              border: '1px solid rgba(255, 255, 255, 0.2)',
              boxShadow: '0 25px 50px rgba(0, 0, 0, 0.15)',
              zIndex: 999,
              overflow: 'hidden',
              animation: 'slideIn 0.4s cubic-bezier(0.4, 0, 0.2, 1)',
              '@keyframes slideIn': {
                '0%': {
                  opacity: 0,
                  transform: 'translateY(-20px) scale(0.95)',
                },
                '100%': {
                  opacity: 1,
                  transform: 'translateY(0) scale(1)',
                }
              }
            }}
          >
            {options.map((option, index) => (
              <Box
                key={index}
                onClick={() => handleOptionClick(option.val)}
                sx={{
                  display: 'flex',
                  alignItems: 'center',
                  gap: '12px',
                  padding: '14px 18px',
                  cursor: 'pointer',
                  position: 'relative',
                  transition: 'all 0.3s ease',
                  '&:hover': {
                    background: `linear-gradient(135deg, ${option.gradient.includes('blue') ? '#667eea20' : option.gradient.includes('orange') ? '#f6931020' : '#10b98120'}, transparent)`,
                    transform: 'translateX(8px)',
                    '&::before': {
                      transform: 'scaleX(1)',
                    }
                  },
                  '&::before': {
                    content: '""',
                    position: 'absolute',
                    left: 0,
                    top: 0,
                    bottom: 0,
                    width: '4px',
                    background: option.gradient.includes('blue') ? 'linear-gradient(135deg, #667eea, #764ba2)' :
                      option.gradient.includes('orange') ? 'linear-gradient(135deg, #f6931f, #f59e0b)' :
                        'linear-gradient(135deg, #10b981, #059669)',
                    transform: 'scaleX(0)',
                    transformOrigin: 'left',
                    transition: 'transform 0.3s ease',
                  }
                }}
              >
                <Box
                  sx={{
                    fontSize: '24px',
                    filter: 'drop-shadow(0 2px 4px rgba(0, 0, 0, 0.1))',
                    transition: 'transform 0.2s ease',
                    '&:hover': {
                      transform: 'scale(1.1)',
                    }
                  }}
                >
                  {option.flag}
                </Box>
                <Box sx={{ flex: 1 }}>
                  <Box sx={{
                    fontSize: '16px',
                    fontWeight: '600',
                    color: '#2d3748',
                    marginBottom: '2px'
                  }}>
                    {option.lang}
                  </Box>
                  <Box sx={{
                    fontSize: '11px',
                    color: '#718096',
                    fontWeight: '500',
                    textTransform: 'uppercase',
                    letterSpacing: '0.5px'
                  }}>
                    {option.val}
                  </Box>
                </Box>


                {option.val === lang && (
                  <Box
                    sx={{
                      width: '20px',
                      height: '20px',
                      borderRadius: '50%',
                      background: 'linear-gradient(135deg, #10b981, #059669)',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      animation: 'checkmark 0.5s ease-out',
                      '@keyframes checkmark': {
                        '0%': { transform: 'scale(0) rotate(0deg)' },
                        '50%': { transform: 'scale(1.2) rotate(180deg)' },
                        '100%': { transform: 'scale(1) rotate(360deg)' }
                      }
                    }}
                  >
                    <svg width="12" height="12" viewBox="0 0 24 24" fill="none">
                      <path d="M5 12L10 17L20 7" stroke="white" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round" />
                    </svg>
                  </Box>
                )}
              </Box>
            ))}
          </Box>
        </>
      )}
    </Box>
  );
};

export default LanguageDropdown;