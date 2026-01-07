import Api from "../api/api";

export const updateProfilePicture = async(imageData: string, token: string)=>{

    var route="/api/User/picture";
    var body={
        userId: 0,
        imageBase64: imageData,
    }

    var Data = await Api(route, body, "POST", token);
    return Data;

};