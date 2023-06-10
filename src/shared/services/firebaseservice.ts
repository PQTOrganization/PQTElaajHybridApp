import Api from "../api/api";

export const saveFirebaseTokenToDB = async (
  userId: number,
  firebaseToken: string,
  authToken: string
) => {
  var body = {
    userId: userId,
    deviceToken: firebaseToken,
  };

  try {
    var resp = await Api("userdevice", body, "POST", authToken);
  } catch (ex) {
    console.log(ex);
  }
};
