import moment from "moment";
import Api from "../api/api";

export const getClaim = async (
  policyNo: string,
  empCode: string,
  token: string
) => {
  var route = `Claim/Recent/${policyNo}/${empCode}`;
  var Data = await Api(route, null, "GET", token);
  return Data;
};

export const getAllClaims = async (
  policyNo: string,
  empSrNo: string,
  periodFrom: Date | null = null,
  periodTo: Date | null = null,
  token: string
) => {
  var route = `Claim/ForMember/${policyNo}/${empSrNo}`;

  if (periodFrom && periodTo) {
    route =
      route +
      `/${moment(periodFrom).format("YYYY-MM-DD")}/${moment(periodTo).format(
        "YYYY-MM-DD"
      )}`;
  }

  var Data = await Api(route, null, "GET", token);
  return Data;
};

export const getClaimSummary = async (
  policyNo: string,
  empSRNumber: string,
  employeeCode: string,
  token: string
) => {
  var route = `Claim/Summary/${policyNo}/${empSRNumber}/${employeeCode}`;
  var Data = await Api(route, null, "GET", token);
  return Data;
};

export const getAllClaimTypes = async (EmpSRNumber: string, token: string) => {
  var route = "ClaimType/ForEmployee/" + EmpSRNumber;
  var Data = await Api(route, null, "GET", token);
  return Data;
};

export const createClaimRequest = async (
  certificateNumber: string,
  policyNumber: string,
  employeeCode: string,
  claimType: string,
  hospitalId: string | null,
  claimAmount: number,
  documents: any,
  token: string
) => {
  var route = "Claim/ClaimRequest";
  var body = {
    claimRequestId: 0,
    requestType: 1,
    certificateNumber: certificateNumber,
    policyNumber: policyNumber,
    employeeCode: employeeCode,
    claimType: claimType,
    hospitalId: hospitalId,
    claimAmount: claimAmount,
    expectedCost: null,
    documents,
  };

  var Data = await Api(route, body, "POST", token);
  return Data;
};

export const createOPDClaimRequest = async (
  certificateNumber: string,
  employeeCode: string,
  claimType: string,
  hospitalId: string,
  claimAmount: number,
  documents: any,
  token: string
) => {
  var route = "Claim/OPDClaimRequest";
  var body = {
    claimRequestId: 0,
    requestType: 2,
    certificateNumber: certificateNumber,
    employeeCode: employeeCode,
    claimType: claimType,
    hospitalId: hospitalId,
    claimAmount: claimAmount,
    expectedCost: null,
    documents,
  };

  var Data = await Api(route, body, "POST", token);
  return Data;
};

export const createIntimationRequest = async (
  certificateNumber: string,
  employeeCode: string,
  claimType: string | null,
  hospitalId: string,
  hospitalName: string,
  expectedCost: number,
  documents: any,
  token: string
) => {
  var route = "Claim/IntimatationRequest";
  var body = {
    claimRequestId: 0,
    requestType: 3,
    certificateNumber: certificateNumber,
    employeeCode: employeeCode,
    hospitalId: hospitalId,
    hospitalName: hospitalName,
    claimAmount: null,
    expectedCost: expectedCost,
    documents,
  };

  var Data = await Api(route, body, "POST", token);
  return Data;
};

export const getDocumentTypes = async (token: string) => {
  var route = "ClaimDocumentType";
  var Data = await Api(route, null, "GET", token);
  return Data;
};

export const uploadDocument = async (
  claimRequestDocumentId: number,
  claimRequestId: number,
  claimtDocumentTypeId: number,
  document: string,
  token: string
) => {
  var route = "ClaimRequestDocument";
  var body = {
    claimRequestDocumentId: claimRequestDocumentId,
    claimRequestId: claimRequestId,
    claimtDocumentTypeId: claimtDocumentTypeId,
    document: document,
  };

  var Data = await Api(route, body, "POST", token);
  return Data;
};
