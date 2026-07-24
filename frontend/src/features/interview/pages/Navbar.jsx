import React from "react";
import { useNavigate } from "react-router-dom";
import "../styles/Navbar.scss";
import { useAuth } from "../../auth/hooks/useAuth";
const Navbar = () => {
  const navigate = useNavigate();
  const {user,handleLogout}=useAuth()
  return (
    <nav className="navbar">
      <div className="navbar__logo" onClick={() => navigate("/")}>
        <h2>InterviewAI</h2>
      </div>

      <div className="navbar__right">
        <div className="navbar__user">
          <span className="avatar">
            {user?.name?.charAt(0).toUpperCase()}
          </span>

          <div className="user-info">
            <h4>{user?.name}</h4>
            <p>{user?.email}</p>
          </div>
        </div>

        <button className="logout-btn" onClick={handleLogout}>
          Logout
        </button>
      </div>
    </nav>
  );
};

export default Navbar;