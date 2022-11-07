import { useNavigate } from "react-router-dom";
import Not from "../static/403.svg";

function Unauth() {
  const navigate = useNavigate();
  const goBack = () => {
    navigate(-1);
  };
  return (
    <div className="bg-light vh-100 d-flex justify-content-center align-items-center text-center">
      <div>
        <h1>Unauthorized Access!</h1>
        <img src={Not} alt="not found" />
        <p className="lead fw-bolder m-1">
          You do not have access to the requested page.{" "}
        </p>
        <button className="btn btn-danger text-white m-1 p-2" onClick={goBack}>
          Go Back{" "}
        </button>
      </div>
    </div>
  );
}

export default Unauth;
