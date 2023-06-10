import { useEffect, useState } from "react";
import {
  Dialog,
  DialogContent,
  Divider,
  InputAdornment,
  List,
  ListItem,
  ListItemIcon,
  ListItemText,
  TextField,
  Typography,
  useTheme,
} from "@mui/material";

import { Launch, Close, Search } from "@mui/icons-material";
import UserIcon from "@mui/icons-material/AccountCircle";

import Skeleton from "react-loading-skeleton";

import { getPolicyMembers } from "../../shared/services/memberservice";
import { useErrorContext } from "../../context/errorcontext";
import { useAuthContext } from "../../context/authcontext";

import GridDX from "../layout/griddx";
import Loading from "../loading";

const ParticipantSelector = (props: any) => {
  const loading = props.loading ?? false;

  const theme = useTheme();
  const { getToken } = useAuthContext();
  const { setError } = useErrorContext();

  const [showList, setShowList] = useState(false);
  const [showSearch, setShowSearch] = useState(false);
  const [loadingParticipants, setLoadingParticipants] = useState(false);
  const [participants, setParticipants] = useState<any>([]);
  const [filteredParticipants, setFilteredParticipants] = useState<any>([]);
  const [participantName, setParticipantName] = useState("");
  const [searchValue, setSearchValue] = useState("");

  const showParticipantList = () => {
    if (participants.length === 0) {
      setLoadingParticipants(true);

      const token = getToken();

      getPolicyMembers(props?.userData?.policyNumber, token)
        .then((participants) => {
          setParticipants(participants);
          setFilteredParticipants(participants);
        })
        .catch((err) => setError(err))
        .finally(() => setLoadingParticipants(false));
    }

    setShowList(true);
  };

  const participantSelected = (participant: any) => {
    setParticipantName(participant.employeeName);
    props.onSelected(participant);
    setShowList(false);
    setSearchValue("");
    setShowSearch(false);
  };

  useEffect(() => {
    const filterResult = participants.filter(
      (p: any) =>
        p.employeeName.toLowerCase().includes(searchValue.toLowerCase()) ||
        p.certNumber.toLowerCase().includes(searchValue.toLowerCase())
    );

    setFilteredParticipants(filterResult);
  }, [searchValue]);

  if (loading)
    return (
      <Skeleton
        containerClassName="skeleton-container"
        style={{ height: 56 }}
      />
    );
  else
    return (
      <>
        <Dialog fullScreen open={showList} onClose={() => setShowList(false)}>
          <DialogContent sx={{ p: 0 }}>
            <GridDX container sx={{ width: "100%" }}>
              <GridDX
                item
                xs={12}
                justifyContent="space-between"
                sx={{
                  p: 2,
                  backgroundColor: theme.palette.primary.main,
                  color: "white",
                }}
              >
                {showSearch ? (
                  <TextField
                    fullWidth
                    autoFocus
                    variant="outlined"
                    value={searchValue}
                    onChange={(e) => setSearchValue(e.target.value)}
                    sx={{
                      "& .MuiOutlinedInput-root": {
                        color: "white",
                      },
                      "& .MuiOutlinedInput-notchedOutline ": {
                        borderColor: "white !important",
                      },
                    }}
                    InputProps={{
                      endAdornment: (
                        <InputAdornment position="end">
                          <Close
                            sx={{ cursor: "pointer", color: "white" }}
                            onClick={() => {
                              setShowSearch(false);
                              setSearchValue("");
                            }}
                          />
                        </InputAdornment>
                      ),
                    }}
                  />
                ) : (
                  <>
                    <Typography sx={{ fontWeight: "bold", flex: 1 }}>
                      Select Participant
                    </Typography>
                    {!loadingParticipants && (
                      <Search
                        sx={{ cursor: "pointer", mx: 2 }}
                        onClick={() => setShowSearch(true)}
                      />
                    )}
                    <Close
                      sx={{ cursor: "pointer" }}
                      onClick={() => setShowList(false)}
                    />
                  </>
                )}
              </GridDX>
              <GridDX item xs={12} sx={{ px: 2 }}>
                {loadingParticipants ? (
                  <Loading />
                ) : (
                  <List
                    sx={{
                      width: "100%",
                    }}
                  >
                    {filteredParticipants.map((p: any, index: number) => (
                      <div key={`pitem_${index}`}>
                        <ListItem
                          alignItems="flex-start"
                          sx={{ cursor: "pointer" }}
                          onClick={() => participantSelected(p)}
                        >
                          <ListItemIcon>
                            <UserIcon fontSize="large" />
                          </ListItemIcon>
                          <ListItemText
                            primary={p.employeeName}
                            secondary={
                              <Typography
                                sx={{ display: "inline" }}
                                component="span"
                                variant="body2"
                                color="text.primary"
                              >
                                {p.certNumber}
                              </Typography>
                            }
                          />
                        </ListItem>
                        <Divider variant="inset" component="li" />
                      </div>
                    ))}
                  </List>
                )}
              </GridDX>
            </GridDX>
          </DialogContent>
        </Dialog>
        <TextField
          fullWidth
          variant="outlined"
          label="Select Participant"
          value={participantName}
          onWheel={(e: any) => e.target?.blur()}
          onClick={showParticipantList}
          InputProps={{
            endAdornment: (
              <InputAdornment position="end" sx={{ cursor: "pointer" }}>
                <Launch />
              </InputAdornment>
            ),
          }}
        />
      </>
    );
};

export default ParticipantSelector;
