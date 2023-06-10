import { useLocation } from "react-router-dom";

const WebPage = () => {
  const { state } = useLocation();

  return <iframe src={state.url} style={{ width: "100%", height: "100%" }} />;
};

export default WebPage;
