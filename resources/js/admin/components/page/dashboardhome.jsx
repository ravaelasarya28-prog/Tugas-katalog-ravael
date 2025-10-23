import React, { useState, useEffect } from "react";
import { useNavigate, Outlet, Link } from "react-router-dom";
import { signOut } from "firebase/auth";
import { auth, db } from "../../../firebase";
import { collection, getDocs, serverTimestamp, addDoc, updateDoc, deleteDoc, doc } from "firebase/firestore";
import {
    LineChart,
    Line,
    BarChart,
    Bar,
    XAxis,
    YAxis,
    Tooltip,
    CartesianGrid,
    Legend,
    ResponsiveContainer
} from "recharts";

import "../../css/bodyDashboard.css";
import "../../css/listdatabukudashboard.css";
import "../../css/statistikDashboard.css";
import "../../css/dashboard.css";
import { Typewriter } from 'react-simple-typewriter';


function Dashboardhome() {

    const [bukuList, setBukuList] = useState([]);
    const [formData, setFormData] = useState({
        judul: "",
        penulis: "",
        penerbit: "",
        kategori: "",
        tahun_terbit: "",
        tebal_buku: "",
        deskripsi: "",
        cover: ""
    });

    //ambil jumlah data buku
    const [jumlahbuku, setjumlahbuku] = useState(0);
    const [jumlahusers, setjumlahusers] = useState(0);
    const [jumlahadmin, setjumlahadmin] = useState(0);
    const [stats, setStats] = useState({});

    useEffect(() => {
        const fetchJumlahBuku = async () => {
            try {
                const querySnapshotBUKU = await getDocs(collection(db, "data_buku"));
                const querySnapshotUSERS = await getDocs(collection(db, "pengguna"));
                const querySnapshotADMIN = await getDocs(collection(db, "Admin"));
                setjumlahbuku(querySnapshotBUKU.size);

                setjumlahusers(querySnapshotUSERS.size);
                setjumlahadmin(querySnapshotADMIN.size);
            } catch (error) {
                console.error("Error fetching data: ", error);
            }
        };

        const fetchStats = async () => {
            const snapshot = await getDocs(collection(db, "pengunjung"));  //nama koleksi di firestore
            const data = {};

            snapshot.forEach((doc) => {
                const { created_at } = doc.data();
                if (!created_at) return;

                const date = created_at.toDate(); // Firestore Timestamp → JS Date
                const day = date.toISOString().split("T")[0]; // contoh: 2025-09-27
                const year = date.getFullYear();

                if (!data[year]) data[year] = {};
                if (!data[year][day]) data[year][day] = 0;

                data[year][day] += 1;
            });

            const finalData = {};
            Object.entries(data).forEach(([year, days]) => {
                finalData[year] = Object.entries(days).map(([day, count]) => ({
                    day,
                    count,
                }));
            });

            // ✅ Update state di sini
            setStats(finalData);
        };

        fetchStats();
        fetchJumlahBuku();
    }, []);

    //ambil data buku
    useEffect(() => {
        const fetchBuku = async () => {
            try {
                const querySnapshotDatabukulist = await getDocs(collection(db, "data_buku"));
                const databukulist = querySnapshotDatabukulist.docs.map((doc) => ({
                    id: doc.id,
                    ...doc.data(),
                }));
                setBukuList(databukulist);
            } catch (error) {
                console.error("Error ambil data :", error);
            }
        };
        fetchBuku();
    }, []);

    //Aksi table buku
    const handleChange = (e) => {
        setFormData({ ...formData, [e.target.name]: e.target.value });
    };

    // tambah data buku ke Firestore
    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
            await addDoc(collection(db, "data_buku"), formData);
            alert("Data berhasil ditambahkan!");

            // reset form
            setFormData({
                judul: "",
                penulis: "",
                penerbit: "",
                kategori: "",
                tahun_terbit: "",
                tebal_buku: "",
                deskripsi: "",
                cover: "",
            });

            // refresh data
            const querySnapshot = await getDocs(collection(db, "data_buku"));
            const databuku = querySnapshot.docs.map((doc) => ({
                id: doc.id,
                ...doc.data(),
            }));
            setBukuList(databuku);
        } catch (error) {
            console.error("Error tambah data:", error);
        }
    };

    return (
        <div className="dashboard-container">
            <section className="isi-dashboard-admin-container">
                <h1 className="welcome-title">
  <Typewriter
    words={['Welcome to the Admin Dashboard']}
    loop={false}
    cursor
    cursorStyle="|"
    typeSpeed={80}
    deleteSpeed={50}
    delaySpeed={1000}
  />
</h1>
<p className="welcome-subtext">
  Manage your library, books, and users with ease ✨
</p>

            </section>




            {bukuList.length === 0 ? (
                <p className="no-data-message">Belum ada data...</p>
            ) : (
                <div className="container-list-buku-minimal">
                    {bukuList.map((buku, index) => (
                        <div className="buku-card-minimal" key={buku.id}>
                            {/* Nomor */}
                            <div className="buku-no-badge">{index + 1}</div>

                            {/* Cover */}
                            <div className="buku-cover-minimal">
                                <img src={buku.cover} alt={buku.judul} />
                            </div>

                            {/* Info Inti */}
                            <div className="buku-info-inti">
                                <div className="buku-info-item judul">
                                    <div className="buku-info-label">Judul</div>
                                    {buku.judul}
                                </div>
                                <div className="buku-info-item">
                                    <div className="buku-info-label">Penulis</div>
                                    {buku.penulis}
                                </div>
                                <div className="buku-info-item">
                                    <div className="buku-info-label">Penerbit</div>
                                    {buku.penerbit}
                                </div>
                                <div className="buku-info-item">
                                    <div className="buku-info-label">Kategori</div>
                                    {buku.kategori}
                                </div>
                                <div className="buku-info-item">
                                    <div className="buku-info-label">Tahun</div>
                                    {buku.tahun_terbit}
                                </div>
                                <div className="buku-info-item">
                                    <div className="buku-info-label">Tebal</div>
                                    {buku.tebal_buku} hlm
                                </div>

                            </div>
                        </div>
                    ))}
                </div>
            )}


        </div>


    );
}

export default Dashboardhome;
