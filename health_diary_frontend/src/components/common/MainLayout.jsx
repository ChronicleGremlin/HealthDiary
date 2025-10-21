import React from "react";
import Sidebar from "./sidebar/Sidebar";
import Breadcrumbs from './breadcrumbs/Breadcrumbs';
import Footer from "./footer/Footer";
import { Outlet } from "react-router-dom";
import "./MainLayout.css";

const MainLayout = () => {
  return (
    <div className="main-layout">
      <Sidebar />
      <div className="main-content">
        <Breadcrumbs />
        <div className="page-body">
          <Outlet />
        </div>
        <Footer />
      </div>
    </div>
  );
};

export default MainLayout;
