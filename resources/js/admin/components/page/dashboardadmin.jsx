import React, { useState, useEffect } from "react";
import { db } from "../../../firebase";
import { collection, getDocs } from "firebase/firestore";
import "../../css/dataAdmin.css";

function Dashboardadmin() {
  const [dataAdmin, setDataAdmin] = useState([]);

  const fetchAdmin = async () => {
    try {
      const querySnapshot = await getDocs(collection(db, "Admin"));
      const data = querySnapshot.docs.map((doc) => ({
        id: doc.id,
        ...doc.data(),
      }));
      setDataAdmin(data);
    } catch (error) {
      console.error("Error: ", error);
    }
  };

  useEffect(() => {
    fetchAdmin();
  }, []);

  return (
    <div className="container-data-admin-dashboard">
      {dataAdmin.map((admin) => (
        <div key={admin.id}>
          <div className="container-berder-img-admin-dashboard">
            <img src={admin.foto_admin} alt="" />
          </div>
          <p>{admin.email}</p>
          <p>{admin.nama}</p>
          {/* ✅ convert timestamp biar tidak error */}
          <p>
            {admin.tanggal_lahir
              ? new Date(admin.tanggal_lahir.seconds * 1000).toLocaleDateString()
              : ""}
          </p>
        </div>
      ))}
    </div>
  );
}

export default Dashboardadmin;
