import Api from "../api/api";

export const getMembers = async (
  policyNo: string,
  empCode: string,
  token: string
) => {
  var route = `Member/${policyNo}/${empCode}`;
  var Data = await Api(route, null, "GET", token);
  return Data;
};

export const getMemberBenefits = async (
  policyNo: string,
  empSrNo: string,
  token: string
) => {
  var route = `Member/Benefits/${policyNo}/${empSrNo}`;
  var Data = await Api(route, null, "GET", token);
  return Data;
};

export const getMemberPolicyPeriods = async (
  policyNo: string,
  token: string
) => {
  var route = `Member/PolicyPeriods/${policyNo}`;
  var Data = await Api(route, null, "GET", token);
  return Data;
};

export const CorrectionRecord = async (
  userEmailAddress: string,
  certificateNumber: string,
  employeeCode: string,
  name: string,
  cnic: string,
  dateOfBirth: Date,
  ibanNumber: string,
  mobileNumber: string,
  email: string,
  profileImage: string,
  token: string
) => {
  var route = `Member/RecordCorrection`;
  var body = {
    userEmailAddress: userEmailAddress,
    certificateNumber: certificateNumber,
    employeeCode: employeeCode,
    name: name,
    cnic: cnic,
    dateOfBirth: dateOfBirth,
    ibanNumber: ibanNumber,
    mobileNumber: mobileNumber,
    email: email,
    profileImage: profileImage,
  };
  var Data = await Api(route, body, "POST", token);
  return Data;
};

export const getPolicyMembers = async (policyNo: string, token: string) => {
  var route = `Member/PolicyMembers/${policyNo}`;
  var Data = await Api(route, null, "GET", token);
  return Data;
};
