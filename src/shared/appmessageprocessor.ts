const delay = (ms: number) => new Promise((resolve) => setTimeout(resolve, ms));

export const messageFromApp = async (messageFromSite: any) => {
  const message = JSON.parse(messageFromSite.data);

  switch (message.key) {
    case "FirebaseToken":
      await delay(5000);
      document.dispatchEvent(
        new CustomEvent("FirebaseToken", { detail: message.data })
      );
      break;
    case "GoBack":
      document.dispatchEvent(new CustomEvent("GoBack", { detail: "" }));
      break;
    case "refreshNotification":
      document.dispatchEvent(
        new CustomEvent("refreshNotification", { detail: "" })
      );
      break;
    case "openNotification":
      await delay(2000);
      document.dispatchEvent(
        new CustomEvent("openNotification", { detail: "" })
      );
      break;
    case "UploadAction":
      document.dispatchEvent(
        new CustomEvent("UploadAction", { detail: message.data })
      );
      break;
    default:
      console.log(message.data);
  }
};
