import React, { useEffect, useState } from "react";
import { auth } from "../../firebase";
import { Link, Outlet } from "react-router-dom";
import { onAuthStateChanged } from "firebase/auth";
import "./css/layout.css"


function LayoutDash() {
    const [user, setUsers] = useState(null);

    useEffect(() => {
        const unsubsribe = onAuthStateChanged(auth, (currentUsers) => {
            if (currentUsers) {
                setUsers(currentUsers);
            } else {
                setUsers(null);
            }
        });
        return () => unsubsribe();
    }, []);

    if (!user) {
        return <p>Memuat...</p>;
    }


    return (
        <div>
            <div className="sidebar">
                <div className="sidebar-header">
                    <div className="border-profil-admin">
                        <img src={user.photoURL} alt="profil" />
                    </div>
                    {/* <div className="admin-name">
                       <h3>{user.displayName}</h3>
                        <p>{user.email}</p>
                    </div> */}
                </div>
                <h2 className="Judul-text-admin">Dashboard</h2>
                <nav className="nav-menu-admin">
                    <ul>
                        <li><Link to="/dashboardbackup"><img src="/svg/stats.svg" alt="Dashboard Icon" />Dashboard</Link></li>
                        <li><Link to="/dashboardbackup/bukudash"><img src="/svg/book-bookmark.svg" alt="Data Buku Icon" />Data Buku</Link></li>
                        <li><a href="/home"><img src="/svg/house-chimney.svg" alt="Settings Icon" />home</a></li>
                    </ul>
                </nav>
                <div className="button-logout-admin">
                    <a href="/login">
                        <button>Keluar</button>
                    </a>
                </div>
            </div>

            <div>
                <Outlet/>
            </div>

        </div>
    )
}

export default LayoutDash;
