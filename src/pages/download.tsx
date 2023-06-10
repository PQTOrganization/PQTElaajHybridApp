import { Link } from "@mui/material";

const DownloadPage = () => {
  return (
    <div
      style={{
        display: "flex",
        flex: 1,
        height: "100vh",
        flexDirection: "column",
        justifyContent: "center",
        alignContent: "center",
        alignItems: "center",
      }}
    >
      <Link
        href="/assets/forms/HospitalizationReimbursmentClaimForm.pdf"
        target="_blank"
        download={true}
        underline="hover"
      >
        Claim Form (Page 1 & 2)
      </Link>
    </div>
  );
};

export default DownloadPage;
