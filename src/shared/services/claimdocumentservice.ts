import moment from "moment";
import Api from "../api/api";

export const uploadDocument = async (documents: any, token: string) => {
  var route = "ClaimRequestDocument/bulk";
  var body = {
    documents: documents,
  };

  var Data = await Api(route, body, "POST", token);
  return Data;
};
