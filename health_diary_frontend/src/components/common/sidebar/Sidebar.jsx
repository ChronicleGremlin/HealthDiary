import React from "react";
import { NavLink, useLocation} from "react-router-dom";
import "./Sidebar.css";

const Sidebar = () => {
 const location = useLocation(); // Get current location to pass as "from"

  return (
    <div className="sidebar">
      <h2 className="sidebar-title">Health Diary</h2>
      <nav className="sidebar-nav">
        <NavLink
          to="/app/dashboard"
          className={({ isActive }) =>
              `sidebar-link${isActive ? ' active' : ''}`
          }
          state={{ from: location.pathname }}
        >
          Dashboard
        </NavLink>
        <NavLink
          to="/app/profile"
          className="sidebar-link"
          state={{ from: location.pathname }}
        >
          User Profile
        </NavLink>
      </nav>
    </div>
  );
};
export default Sidebar;
