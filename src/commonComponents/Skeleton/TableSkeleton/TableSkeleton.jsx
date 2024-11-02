import {
  TableContainer,
  Table,
  Paper,
  TableHead,
  TableRow,
  TableCell,
  Skeleton,
  TableBody,
} from "@mui/material";
import { useThemeContext } from "@/hooks/ThemeContext";

const TableSkeleton = ({ row = 5 }) => {
  const { isDarkMode, primaryColor } = useThemeContext();
  return (
    <TableContainer component={Paper} className="blur_effect_card">
      <Table>
        <TableHead>
          <TableRow
            sx={{
              background: isDarkMode
                ? "radial-gradient(circle at 10% 20%, rgb(90, 92, 106) 0%, rgb(32, 45, 58) 81.3%)"
                : "linear-gradient(178.6deg, rgb(20, 36, 50) 11.8%, rgb(124, 143, 161) 83.8%)",
            }}
          >
            {[...Array(row)]?.map((head, index) => (
              <TableCell
                key={index}
                sx={{ color: isDarkMode ? "white" : "black" }}
                className="px-6 py-3 text-left text-base font-medium uppercase tracking-wider"
              >
                <Skeleton
                  variant="text"
                  width="100%"
                  height={30}
                  sx={{
                    backgroundColor: isDarkMode ? "#616161" : "#f0f0f0",
                  }}
                />
              </TableCell>
            ))}
          </TableRow>
        </TableHead>
        <TableBody>
          {[...Array(5)]?.map((_, index) => (
            <TableRow key={index}>
              {[...Array(row)]?.map((_, idx) => (
                <TableCell key={idx}>
                  <Skeleton
                    variant="text"
                    width="100%"
                    height={30}
                    sx={{
                      backgroundColor: isDarkMode ? "#616161" : "#f0f0f0",
                    }}
                  />
                </TableCell>
              ))}
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </TableContainer>
  );
};

export default TableSkeleton;
