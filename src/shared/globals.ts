export const DOC_SIZE = 20;
export const minimumDocs = 1;
export const maximumDocs = 3;

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
