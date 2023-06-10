import {
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  useTheme,
} from "@mui/material";

import { formattedNumber } from "../../shared/globals";
import LoadingTypography from "../controls/loadingtypography";

const CoverageTable = (props: any) => {
  const rows = props.data ?? [];
  const loading = props.loading ?? false;
  const theme = useTheme();

  return (
    <TableContainer>
      <Table
        size="small"
        sx={{
          width: "100%",
          "td, th": {
            borderColor: theme.palette.success.main,
            padding: "6px 10px",
          },
          fontSize: 14,
        }}
      >
        <TableHead>
          <TableRow>
            <TableCell sx={{ paddingLeft: "0px !important" }}>
              Benefit(s)
            </TableCell>
            <TableCell align="right">Room Limit</TableCell>
            <TableCell align="right">Total Limit</TableCell>
            <TableCell align="right" sx={{ paddingRight: "0px !important" }}>
              Remaining Limit
            </TableCell>
          </TableRow>
        </TableHead>
        <TableBody>
          {rows.map((row: any, index: number) => (
            <TableRow key={"cov_row_" + index}>
              <TableCell
                component="th"
                scope="row"
                sx={{ paddingLeft: "0px !important" }}
              >
                <LoadingTypography
                  loading={loading}
                  text={row.coverageDescription}
                />
              </TableCell>
              <TableCell align="right">
                <LoadingTypography
                  loading={loading}
                  text={formattedNumber(row.roomLimit)}
                />
              </TableCell>
              <TableCell align="right">
                <LoadingTypography
                  loading={loading}
                  text={formattedNumber(row.totalAmount)}
                />
              </TableCell>
              <TableCell align="right" sx={{ paddingRight: "0px !important" }}>
                <LoadingTypography
                  loading={loading}
                  text={formattedNumber(row.claimAmount)}
                />
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </TableContainer>
  );
};

export default CoverageTable;
