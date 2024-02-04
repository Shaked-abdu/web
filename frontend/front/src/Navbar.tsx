import React from "react";
import { useNavigate } from "react-router-dom";

interface TopNavbarProps {
  onLogout: () => void;
  onProfile: () => void;
  isLoggedIn: boolean;
  isGoolge: boolean;
}

const TopNavbar: React.FC<TopNavbarProps> = ({
  isLoggedIn,
  onLogout,
  onProfile,
  isGoolge,
}) => {
  const navigate = useNavigate();

  const onExtra = () => {
    navigate("/extra");
  };
  return (
    <nav
      className="navbar navbar-dark"
      style={{ backgroundColor: "rgb(126,205,216)" }}
    >
      <div style={{ height: "40px", marginLeft: "10px" }}>
        {isLoggedIn && (
          <button
            type="submit"
            className="btn btn-primary"
            onClick={onLogout}
            style={{ marginRight: "10px" }}
          >
            התנתקות
          </button>
        )}
      </div>

      <div style={{ height: "40px" }}>
        {isLoggedIn && (
          <button
            type="submit"
            className="btn btn-primary"
            onClick={onExtra}
            style={{ marginRight: "10px" }}
          >
            נתונים נוספים
          </button>
        )}
        {isLoggedIn && !isGoolge && (
          <button
            type="submit"
            className="btn btn-primary"
            onClick={onProfile}
            style={{ marginRight: "10px" }}
          >
            פרופיל
          </button>
        )}
      </div>
    </nav>
  );
};

export default TopNavbar;
