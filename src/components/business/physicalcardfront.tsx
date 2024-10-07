import { useState } from "react";
import {
  Card,
  CardContent,
  Dialog,
  DialogContent,
  IconButton,
  Typography,
} from "@mui/material";

import { useTheme } from "@mui/material/styles";
import moment from "moment";
import Skeleton from "react-loading-skeleton";

import ZoomIcon from "@mui/icons-material/ZoomIn";
import CloseIcon from "@mui/icons-material/Close";

import GridDX from "../layout/griddx";
import headerimg from "../../assets/physical-card-header.png";
import cardBg from "../../assets/cardBg.png";

const PhysicalCardFront = (props: any) => {
  const theme = useTheme();

  const member = props.member;
  const familyMembers = props.familyMembers;
  const loading = props.loading ?? false;

  const [open, setOpen] = useState(false);

  const handleClose = () => {
    setOpen(false);
  };

  if (loading)
    return (
      <Skeleton
        containerClassName="skeleton-container"
        style={{ height: 200, marginBottom: 20 }}
      />
    );
  else
    return (
      <>
        <Dialog open={open} onClose={handleClose} fullScreen>
          <DialogContent sx={{ p: 1, display: "flex" }}>
            <GridDX
              container
              sx={{ width: "100%", flexDirection: "column" }}
              alignContent="flex-start"
            >
              <GridDX item xs={12} justifyContent="center">
                <IconButton size="large" onClick={() => setOpen(false)}>
                  <CloseIcon />
                </IconButton>
              </GridDX>
              <GridDX
                item
                xs={12}
                sx={{ width: "auto", flex: 1 }}
                alignItems="flex-start"
              >
                <GridDX
                  container
                  rowSpacing={1}
                  alignContent="flex-start"
                  sx={{
                    width: "750px",
                    backgroundImage: `url(${cardBg})`,
                    borderRadius: "30px",
                    backgroundPosition: "center",
                    border: "1px solid black",
                    backgroundRepeat: "no-repeat",
                    backgroundSize: "100%",
                  }}
                >
                  <GridDX item xs={12} className="card-header">
                    <img
                      src={headerimg}
                      style={{ flex: 1, maxWidth: "750px" }}
                    />
                  </GridDX>

                  <GridDX item xs={7} sx={{ py: 1, px: 1 }}>
                    <GridDX
                      container
                      sx={{ flexDirection: "row", width: "100%" }}
                    >
                      <GridDX item xs={4}>
                        <Typography sx={{ color: "#8B0037" }}>
                          Participant Name:
                        </Typography>
                      </GridDX>
                      <GridDX item xs={8}>
                        <Typography style={{ color: "black" }}>
                          {member?.companyName}
                        </Typography>
                      </GridDX>
                      <GridDX item xs={4}>
                        <Typography sx={{ color: "#8B0037" }}>
                          Employee Name:
                        </Typography>
                      </GridDX>
                      <GridDX item xs={8}>
                        <Typography sx={{ color: "black" }}>
                          {member?.employeeName}
                        </Typography>
                      </GridDX>
                      <GridDX item xs={4}>
                        <Typography sx={{ color: "#8B0037" }}>
                          CNIC No:
                        </Typography>
                      </GridDX>
                      <GridDX item xs={8}>
                        <Typography sx={{ color: "black" }}>
                          {member?.employeeCNIC}
                        </Typography>
                      </GridDX>
                      <GridDX item xs={4}>
                        <Typography sx={{ color: "#8B0037" }}>DOB :</Typography>
                      </GridDX>
                      <GridDX item xs={8}>
                        <Typography sx={{ color: "black" }}>
                          {moment(member?.employeeDateOfBirth).format(
                            "DD-MMM-yyyy"
                          )}
                        </Typography>
                      </GridDX>
                      <GridDX item xs={4}>
                        <Typography sx={{ color: "#8B0037" }}>
                          Cert No:
                        </Typography>
                      </GridDX>
                      <GridDX item xs={8}>
                        <Typography sx={{ color: "black" }}>
                          {member?.employeeSRNumber}
                        </Typography>
                      </GridDX>
                      <GridDX item xs={4}>
                        <Typography sx={{ color: "#8B0037" }}>
                          Emp No:
                        </Typography>
                      </GridDX>
                      <GridDX item xs={8}>
                        <Typography sx={{ color: "black" }}>
                          {member?.employeeFolioId}
                        </Typography>
                      </GridDX>
                      <GridDX item xs={4}>
                        <Typography sx={{ color: "#8B0037" }}>
                          Branch:
                        </Typography>
                      </GridDX>
                      <GridDX item xs={8}>
                        <Typography sx={{ color: "black" }}>XXX</Typography>
                      </GridDX>
                    </GridDX>
                  </GridDX>

                  <GridDX
                    item
                    xs={5}
                    style={{ padding: 8 }}
                    alignItems="flex-start"
                  >
                    {familyMembers && familyMembers.length > 0 && (
                      <GridDX
                        container
                        sx={{ flexDirection: "row", width: "100%" }}
                        rowSpacing={2}
                      >
                        <GridDX xs={6}>
                          <Typography sx={{ color: "#8B0037" }}>
                            Family Member
                          </Typography>
                        </GridDX>
                        <GridDX xs={3}>
                          <Typography sx={{ color: "#8B0037" }}>Age</Typography>
                        </GridDX>
                        <GridDX xs={3}>
                          <Typography sx={{ color: "#8B0037" }}>
                            Cert
                          </Typography>
                        </GridDX>

                        {familyMembers.map((m: any, i: number) => (
                          <>
                            <GridDX key={"empName_" + i} xs={6}>
                              <Typography sx={{ color: "black" }}>
                                {m.employeeName}
                              </Typography>
                            </GridDX>
                            <GridDX key={"empAge_" + i} xs={3}>
                              <Typography sx={{ color: "black" }}>
                                {m.age}
                              </Typography>
                            </GridDX>
                            <GridDX key={"empSR_" + i} xs={3}>
                              <Typography sx={{ color: "black" }}>
                                {m.employeeSRNumber.split("-")[1]}
                              </Typography>
                            </GridDX>
                          </>
                        ))}
                      </GridDX>
                    )}
                  </GridDX>
                  <GridDX container sx={{ pl: 1, pt: 1 }}>
                    {" "}
                    <GridDX item xs={4}>
                      <Typography sx={{ color: "#8B0037" }}>
                        Room Limit:
                      </Typography>
                    </GridDX>
                    <GridDX item xs={8}>
                      <Typography sx={{ color: "black" }}>
                        {member?.roomLimit}
                      </Typography>
                    </GridDX>
                    <GridDX item xs={4}>
                      <Typography sx={{ color: "#8B0037" }}>
                        Valid up to:
                      </Typography>
                    </GridDX>
                    <GridDX item xs={8}>
                      <Typography sx={{ color: "black" }}>
                        {moment(member?.policyEndDate).format("DD-MMM-yyyy")}
                      </Typography>
                    </GridDX>
                  </GridDX>
                  <GridDX
                    item
                    xs={12}
                    width="100%"
                    padding="10px"
                    backgroundColor="#8B0037"
                    justifyContent="center"
                    sx={{
                      borderBottomLeftRadius: "30px",
                      borderBottomRightRadius: "30px",
                    }}
                  >
                    <Typography color="white" fontSize={15} fontStyle="italic">
                      A Pak-Qatar Group Company: Pakistan's Premier and Pioneer
                      Islamic Financial Services Group
                    </Typography>
                  </GridDX>
                </GridDX>
              </GridDX>
            </GridDX>
          </DialogContent>
        </Dialog>
        <Card
          sx={{
            width: 632,
            transform: "scale(0.58)",
            transformOrigin: "left top",
            backgroundImage: `url(${cardBg})`,
            borderRadius: "30px",
            backgroundSize: "100%",
            border: "1px solid black",
            backgroundRepeat: "no-repeat",

            boxShadow:
              "0px 2px 1px -1px rgba(0,0,0,0.2), 0px 1px 1px 0px rgba(0,0,0,0.14), 0px 0px 0px 0px rgba(0,0,0,0.12) !important",
          }}
        >
          <CardContent sx={{ p: 0 }}>
            <GridDX container>
              <GridDX item xs={12} className="card-header">
                <img src={headerimg} />
              </GridDX>
              <GridDX item xs={12} sx={{ py: 1, px: 1 }}>
                <GridDX container rowSpacing={1}>
                  <GridDX item xs={6} sx={{ py: 1, px: 1 }}>
                    <GridDX
                      container
                      sx={{ flexDirection: "row", width: "100%" }}
                      rowSpacing={1}
                    >
                      <GridDX item xs={4}>
                        <Typography sx={{ fontSize: 10, color: "#8B0037" }}>
                          Participant Name:
                        </Typography>
                      </GridDX>
                      <GridDX item xs={8}>
                        <Typography style={{ color: "black", fontSize: 8 }}>
                          {member?.companyName}
                        </Typography>
                      </GridDX>
                      <GridDX item xs={4}>
                        <Typography sx={{ fontSize: 10, color: "#8B0037" }}>
                          Employee Name:
                        </Typography>
                      </GridDX>
                      <GridDX item xs={8}>
                        <Typography style={{ color: "black", fontSize: 10 }}>
                          {member?.employeeName}
                        </Typography>
                      </GridDX>
                      <GridDX item xs={4}>
                        <Typography sx={{ fontSize: 10, color: "#8B0037" }}>
                          CNIC No:
                        </Typography>
                      </GridDX>
                      <GridDX item xs={8}>
                        <Typography style={{ color: "black", fontSize: 10 }}>
                          {member?.employeeCNIC}
                        </Typography>
                      </GridDX>
                      <GridDX item xs={4}>
                        <Typography sx={{ fontSize: 10, color: "#8B0037" }}>
                          DOB :
                        </Typography>
                      </GridDX>
                      <GridDX item xs={8}>
                        <Typography style={{ color: "black", fontSize: 10 }}>
                          {moment(member?.employeeDateOfBirth).format(
                            "DD-MMM-yyyy"
                          )}
                        </Typography>
                      </GridDX>
                      <GridDX item xs={4}>
                        <Typography sx={{ fontSize: 10, color: "#8B0037" }}>
                          Cert No:
                        </Typography>
                      </GridDX>
                      <GridDX item xs={8}>
                        <Typography style={{ color: "black", fontSize: 10 }}>
                          {member?.employeeSRNumber}
                        </Typography>
                      </GridDX>
                      <GridDX item xs={4}>
                        <Typography sx={{ fontSize: 10, color: "#8B0037" }}>
                          Emp No:
                        </Typography>
                      </GridDX>
                      <GridDX item xs={8}>
                        <Typography style={{ color: "black", fontSize: 10 }}>
                          {member?.employeeFolioId}
                        </Typography>
                      </GridDX>
                      <GridDX item xs={4}>
                        <Typography sx={{ fontSize: 10, color: "#8B0037" }}>
                          Branch:
                        </Typography>
                      </GridDX>
                      <GridDX item xs={8}>
                        <Typography style={{ color: "black", fontSize: 10 }}>
                          XXX
                        </Typography>
                      </GridDX>
                    </GridDX>
                  </GridDX>

                  <GridDX
                    item
                    xs={6}
                    style={{ padding: 8 }}
                    alignItems="flex-start"
                  >
                    {familyMembers && familyMembers.length > 0 && (
                      <GridDX
                        container
                        sx={{
                          flexDirection: "row",
                          width: "100%",
                        }}
                        rowSpacing={1}
                      >
                        <GridDX xs={6}>
                          <Typography
                            style={{ fontSize: 10, color: "#8B0037" }}
                          >
                            Family Member
                          </Typography>
                        </GridDX>
                        <GridDX xs={3}>
                          <Typography
                            style={{ fontSize: 10, color: "#8B0037" }}
                          >
                            Age
                          </Typography>
                        </GridDX>
                        <GridDX xs={3}>
                          <Typography
                            style={{ fontSize: 10, color: "#8B0037" }}
                          >
                            Cert
                          </Typography>
                        </GridDX>

                        {familyMembers.map((m: any, i: number) => (
                          <>
                            <GridDX key={"empName_" + i} xs={6}>
                              <Typography
                                style={{ fontSize: 10, color: "black" }}
                              >
                                {m.employeeName}
                              </Typography>
                            </GridDX>
                            <GridDX key={"empAge_" + i} xs={3}>
                              <Typography
                                style={{ fontSize: 10, color: "black" }}
                              >
                                {m.age}
                              </Typography>
                            </GridDX>
                            <GridDX key={"empSR_" + i} xs={3}>
                              <Typography
                                style={{ fontSize: 10, color: "black" }}
                              >
                                {m.employeeSRNumber.split("-")[1]}
                              </Typography>
                            </GridDX>
                          </>
                        ))}
                      </GridDX>
                    )}
                  </GridDX>
                  <GridDX container sx={{ pl: 1, pt: 2 }}>
                    {" "}
                    <GridDX item xs={4}>
                      <Typography style={{ fontSize: 10, color: "#8B0037" }}>
                        Room Limit:
                      </Typography>
                    </GridDX>
                    <GridDX item xs={8}>
                      <Typography sx={{ color: "black", fontSize: 10 }}>
                        {member?.roomLimit}
                      </Typography>
                    </GridDX>
                    <GridDX item xs={4}>
                      <Typography style={{ fontSize: 10, color: "#8B0037" }}>
                        Valid up to:
                      </Typography>
                    </GridDX>
                    <GridDX item xs={8}>
                      <Typography sx={{ color: "black", fontSize: 10 }}>
                        {moment(member?.policyEndDate).format("DD-MMM-yyyy")}
                      </Typography>
                    </GridDX>
                  </GridDX>
                </GridDX>
              </GridDX>
              <GridDX
                item
                xs={12}
                width="100%"
                padding="10px"
                backgroundColor="#8B0037"
                justifyContent="center"
                sx={{
                  borderBottomLeftRadius: "30px",
                  borderBottomRightRadius: "30px",
                }}
              >
                <Typography color="white" fontSize={12} fontStyle="italic">
                  A Pak-Qatar Group Company: Pakistan's Premier and Pioneer
                  Islamic Financial Services Group
                </Typography>
              </GridDX>
            </GridDX>
          </CardContent>
          <IconButton
            size="large"
            sx={{
              position: "absolute",
              bottom: 10,
              right: 10,
              p: 0,
              backgroundColor: theme.palette.success.main,
              transform: "scale(1.5)",
            }}
            onClick={() => setOpen(true)}
          >
            <ZoomIcon fontSize="large" sx={{ color: "white" }} />
          </IconButton>
        </Card>
      </>
    );
};

export default PhysicalCardFront;
