import Api from "../api/api";

export const getComplaintTypes = async (token: string) => {
  var route = `complaintype`;
  var Data = await Api(route, null, "GET", token);
  return Data;
};

export const getComplaints = async (
  policyNo: string,
  empSRNumber: string,
  token: string
) => {
  var route = `complain/formember/${policyNo}/${empSRNumber}`;
  var Data = await Api(route, null, "GET", token);
  return Data;
};

export const getComplaintDetails = async (
  complaintId: number,
  token: string
) => {
  var route = `complain/${complaintId}`;
  var Data = await Api(route, null, "GET", token);
  return Data;
};

export const createComplaintForMember = async (
  policyNo: string,
  certificateNo: string,
  complainTypeId: number,
  subject: string,
  message: string,
  token: string
) => {
  var route = `complain`;
  var body = {
    policyNo,
    certificateNo,
    complainTypeId,
    subject,
    message,
  };
  var Data = await Api(route, body, "POST", token);
  return Data;
};
