import FileResizer from "react-image-file-resizer";

export enum claimStatus {
  "Pending" = 1,
  "Full settlement" = 2,
}

export function dataURLtoBlob(dataurl: any) {
  var arr = dataurl.split(","),
    mime = arr[0].match(/:(.*?);/)[1],
    bstr = atob(arr[1]),
    n = bstr.length,
    u8arr = new Uint8Array(n);
  while (n--) {
    u8arr[n] = bstr.charCodeAt(n);
  }
  return new Blob([u8arr], { type: mime });
}

export function toBase64(file: any) {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.readAsDataURL(file);
    reader.onload = () => resolve(reader.result);
    reader.onerror = (error) => reject(error);
  });
}

export const formattedNumber = (numberValue: number) => {
  if (numberValue) return Intl.NumberFormat().format(numberValue);
  else return 0;
};

export function readableFileSize(attachmentSize: number) {
  const DEFAULT_SIZE = 0;
  const fileSize = attachmentSize ?? DEFAULT_SIZE;

  if (!fileSize) {
    return `${DEFAULT_SIZE} KB`;
  }

  const sizeInKb = fileSize / 1024;

  if (sizeInKb > 1024) {
    return `${(sizeInKb / 1024).toFixed(1)} MB`;
  } else {
    return `${sizeInKb.toFixed(1)} KB`;
  }
}

export function bytesToMegabytes(bytes: number) {
  if (typeof bytes !== "number" || bytes < 0) {
    return "Invalid input: Please provide a positive number of bytes.";
  }
  const megabytes = bytes / (1024 * 1024);
  return megabytes;
}

export const handleCall = (event: any, number: string = "021111825238") => {
  const win: any = window;

  if (win?.ReactNativeWebView)
    win.ReactNativeWebView.postMessage(
      JSON.stringify({ type: "call", data: number })
    );
  else window.alert("No dialer available");
};

export const requestLocationPermissionFromDevice = () => {
  const win: any = window;

  if (win?.ReactNativeWebView)
    win.ReactNativeWebView.postMessage(
      JSON.stringify({ type: "AskLocationPermission", data: "" })
    );
};

export const requestCameraStoragePermissionFromDevice = () => {
  const win: any = window;

  if (win?.ReactNativeWebView)
    win.ReactNativeWebView.postMessage(
      JSON.stringify({ type: "AskCameraStoragePermission", data: "" })
    );
};

export const intimateDeviceForFBSetup = () => {
  const win: any = window;

  if (win?.ReactNativeWebView)
    win.ReactNativeWebView.postMessage(
      JSON.stringify({ type: "setUpFirebase" })
    );
};

/**
 * Get the distance in kilometers between two coordinates.
 * @param lat1 Latitude of the first coordinate, in degrees
 * @param long1 Longitude of the first coordinate, in degrees
 * @param lat2 Latitude of the second coordinate, in degrees
 * @param long2 Longitude of the second coordinate, in degrees
 * @return Distance in kilometers
 */
export const getGeoDistance = (
  lat1: number,
  long1: number,
  lat2: number,
  long2: number
) => {
  const earthRadius: number = 6371; // Approximate radius of the earth in kilometers
  const distance =
    Math.acos(
      Math.sin((lat2 * Math.PI) / 180.0) * Math.sin((lat1 * Math.PI) / 180.0) +
        Math.cos((lat2 * Math.PI) / 180.0) *
          Math.cos((lat1 * Math.PI) / 180.0) *
          Math.cos(((long1 - long2) * Math.PI) / 180.0)
    ) * earthRadius;

  return Math.round(distance);
};

export const openURLInBrowser = (url: string) => {
  const win: any = window;

  if (url)
    if (win?.ReactNativeWebView)
      win.ReactNativeWebView.postMessage(
        JSON.stringify({ type: "webpage", data: url })
      );
    else window.open(url, "_new");
};

export const openMedIQUrl = (userData: string) => {
  const win: any = window;

  if (win?.ReactNativeWebView)
    win.ReactNativeWebView.postMessage(
      JSON.stringify({ type: "openmediq", data: userData })
    );
};

export const openGoogleMapsApp = (directionsData: string) => {
  const win: any = window;

  if (win?.ReactNativeWebView)
    win.ReactNativeWebView.postMessage(
      JSON.stringify({ type: "openmaps", data: directionsData })
    );
};

export const base64toBlob = (base64Image: any) => {
  // Split into two parts
  const parts = base64Image.split(";base64,");

  // Hold the content type
  const imageType = parts[0].split(":")[1];

  // Decode Base64 string
  const decodedData = window.atob(parts[1]);

  // Create UNIT8ARRAY of size same as row data length
  const uInt8Array = new Uint8Array(decodedData.length);

  // Insert all character code into uInt8Array
  for (let i = 0; i < decodedData.length; ++i) {
    uInt8Array[i] = decodedData.charCodeAt(i);
  }

  // Return BLOB image after conversion
  return new Blob([uInt8Array], { type: imageType });
};

export const resizeFile = (e: any, maxWidth: number, maxHeight: number) =>
  new Promise((resolve) => {
    console.log("max width", maxWidth);
    console.log("max height", maxHeight);
    FileResizer.imageFileResizer(
      e,
      maxWidth,
      maxHeight,
      "JPEG",
      100,
      0,
      (uri) => {
        resolve(uri);
      },
      "base64"
    );
  });

export const getBase64ImageSizeInMB = (image: any) => {
  console.log("image", image);
  const stringLength = image.length - "data:image/png;base64,".length;
  const sizeInBytes = 4 * Math.ceil(stringLength / 3) * 0.5624896334383812;
  const sizeInMB = sizeInBytes / 1048576;
  return sizeInMB;
};

export const getProfileImageFromDevice = (userId: any) => {
  let data = { userId: userId };
  const win: any = window;
  if (win?.ReactNativeWebView) {
    win.ReactNativeWebView.postMessage(
      JSON.stringify({
        type: "getProfileImageFromLocalStorage",
        data: JSON.stringify(data),
      })
    );
  }
};

export const openCameraOnMobile = (userId: any) => {
  let data = { userId: userId };

  const win: any = window;

  if (win?.ReactNativeWebView)
    win.ReactNativeWebView.postMessage(
      JSON.stringify({ type: "opencamera", data: JSON.stringify(data) })
    );
};

export const openDocumentUploadOnMobile = (id: number) => {
  const win: any = window;
  let data = { id: id };
  if (win?.ReactNativeWebView)
    win.ReactNativeWebView.postMessage(
      JSON.stringify({ type: "opendocupload", data: JSON.stringify(data) })
    );
};

export const logOnMobile = (message: string) => {
  const win: any = window;

  if (win?.ReactNativeWebView)
    win.ReactNativeWebView.postMessage(
      JSON.stringify({ type: "Console", data: message })
    );
};

export const isEmail = (val: string) => {
  let regEmail =
    /^(([^<>()\[\]\\.,;:\s@"]+(\.[^<>()\[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,2}\.[0-9]{1,3}\.[0-9]{1,2}])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{1,}))$/;

  return regEmail.test(val);
};

export const pad = (num: any) => {
  return ("0" + num).slice(-2);
};

export const formatTimerToMinAndSecs = (seconds: any) => {
  return pad(Math.floor(seconds / 60)) + ":" + pad(seconds % 60);
};
