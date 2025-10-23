import Button from "react-bootstrap/Button";
import { useNavigate } from "react-router-dom";

export default function Error() {
  const navigate = useNavigate();

  return (
    <>
      <div className="centered flex-column gap-1">
        <h1 className="m-0">404</h1>
        <h2 className="m-0" style={{ color: "var(--shade-primary)" }}>Page Not Found</h2>
        <div className="d-flex justify-content-center gap-3 mt-2">
          <Button
            className="action-btn btn"
            onClick={() => navigate("/manage-cards")}
          >
            Add New Card
          </Button>
          <Button
            className="primary-btn btn"
            onClick={() => navigate("/study")}
          >
            Want to Study?
          </Button>
        </div>
      </div>
    </>
  );
}
