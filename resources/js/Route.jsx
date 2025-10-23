import React from "react";
import { Routes, Route } from "react-router-dom";
import ProtectedRoute from "./ProtectedRoute";

//import page
import Home from "./page/home";

//import component 
import LoginUsers from "./components/src/LoginUsers";
import RegisterUsers from "./components/src/RegisterUsers";



import LoginAdmin from "./components/admin/loginAdmin";

import LayoutDash from "./admin/components/layout";
import Dashboardhome from "./admin/components/page/dashboardhome";
import DashboardBuku from "./admin/components/page/dashboardbuku";
import Dashboardadmin from "./admin/components/page/dashboardadmin";

function App() {
  return (
    <Routes>

      <Route path="/home" element={<ProtectedRoute><Home /></ProtectedRoute>} />
      <Route path="/login" element={<LoginUsers />} />
      <Route path="/register" element={<RegisterUsers />} />
      <Route path="/loginAnd" element={<LoginAdmin />} />
      



      <Route path="/dashboardbackup" element={<LayoutDash/>}>
         <Route index element={<Dashboardhome/>}/>
         <Route path="bukudash" element={<DashboardBuku/>}/>
         <Route path="admindash" element={<Dashboardadmin/>}/>
      </Route>

    </Routes>
  );
}

export default App;
