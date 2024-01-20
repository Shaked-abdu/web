import React from "react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faUser } from "@fortawesome/free-solid-svg-icons";
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
    <nav className="navbar navbar-dark bg-primary">
      <div style={{ height: "40px" }}>
        {isLoggedIn && (
          <button type="submit" className="btn btn-light" onClick={onLogout}>
            התנתקות
          </button>
        )}
      </div>
      <div style={{ height: "40px" }}>
        {isLoggedIn && (
          <button type="submit" className="btn btn-light" onClick={onExtra}>
            נתונים נוספים
          </button>
        )}
      </div>
      <div style={{ height: "40px" }}>
        {isLoggedIn && !isGoolge &&(
          <button type="submit" className="btn btn-light" onClick={onProfile}>
            <FontAwesomeIcon icon={faUser} />
          </button>
        )}
      </div>
    </nav>
  );
};

export default TopNavbar;
