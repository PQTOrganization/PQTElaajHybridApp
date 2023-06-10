import Fab from "@mui/material/Fab";
import AddIcon from "@mui/icons-material/Add";

import { useNavigate } from "react-router-dom";
import { useErrorContext } from "../../context/errorcontext";

import ComplaintCard from "../../components/business/complaintcard";
import GridDX from "../../components/layout/griddx";
import { useEffect, useState } from "react";
import {
  getComplaintDetails,
  getComplaints,
} from "../../shared/services/complaintservice";
import { useAuthContext } from "../../context/authcontext";
import Loading from "../../components/loading";

const LaunchComplaint = () => {
  const navigate = useNavigate();
  const { setError } = useErrorContext();
  const { getUserDetails, getToken } = useAuthContext();

  const [complaints, setComplaints] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    getUserDetails().then((userDetails: any) => {
      const token = getToken();
      getComplaints(userDetails.policyNumber, userDetails.certNumber, token)
        .then((complaints) => {
          console.log({ complaints });
          setComplaints(complaints);
        })
        .catch((err) => setError(err))
        .finally(() => setLoading(false));
    });
  }, []);

  const addComplaint = () => {
    navigate("/manage-complaint");
  };

  const showComplaint = (complainId: number) => {
    alert(complainId);
    navigate("/manage-complaint", { state: { complainId } });
  };

  return (
    <GridDX
      container
      sx={{ width: "100%", alignContent: "flex-start" }}
      rowSpacing={2}
    >
      {loading ? (
        <Loading />
      ) : (
        complaints.map((c, i) => (
          <ComplaintCard data={c} onClick={showComplaint} />
        ))
      )}

      <Fab
        color="primary"
        sx={{ position: "absolute", bottom: 16, right: 16 }}
        onClick={addComplaint}
      >
        <AddIcon />
      </Fab>
    </GridDX>
  );
};

export default LaunchComplaint;
