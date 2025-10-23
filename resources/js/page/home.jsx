import React, { useEffect, useState } from "react";
import { db, auth } from "../firebase";
import { collection, getDocs, query, where, addDoc, serverTimestamp } from "firebase/firestore";
import { Typewriter } from 'react-simple-typewriter';




// import css
import "./css/home.css";

function Home() {
  //munculin buku yang sesuai dengan kategori
  const [bukuList, setBukuList] = useState([]);
  const [kategori, setKategori] = useState("semua");
  const [searchTerm, setSearchTerm] = useState("");


  const fetchData = async (selectedKategori) => {
    try {
      let q;
      if (selectedKategori === "semua") {
        q = collection(db, "data_buku");
      } else {
        q = query(collection(db, "data_buku"), where("kategori", "==", selectedKategori));
      }

      const querySnapshot = await getDocs(q);
      const data = querySnapshot.docs.map((doc) => ({
        id: doc.id,
        ...doc.data(),
      }));
      setBukuList(data);
    } catch (error) {
      console.error("Gagal mengambil data buku:", error);
    }
  }
  // 📌 State
  const [selectedBuku, setSelectedBuku] = useState(null); // ✅ Tambahin state buat modal
  // 📌 Ambil data buku dari Firestore
  const fetchBuku = async () => {
    try {
      const bukuCollection = collection(db, "data_buku");
      const querySnapshot = await getDocs(bukuCollection);
      setBukuList(querySnapshot.docs.map((doc) => ({ id: doc.id, ...doc.data() })));
    } catch (error) {
      console.error("Gagal mengambil data buku:", error);
    }
  };

  useEffect(() => {
    fetchData("semua");
    fetchBuku();
    const logPageView = async () => {
      try {
        // ambil user yang login, kalau ada
        const user = auth.currentUser;
        const userId = user ? user.uid : "guest";
        await addDoc(collection(db, "pengunjung"), {
          page: "home",
          created_at: serverTimestamp(),
          userId: userId,
        });
        console.log("Page view logged");
      } catch (error) {
        console.error("Error logging page view:", error);
      }
    };
    logPageView(); // ✅ cukup panggil di sini
  }, []);

  //filter buku berdasarkan search
  const filteredBuku = bukuList.filter((buku) =>
    buku.judul.toLowerCase().includes(searchTerm.toLowerCase())
  );
  return (
    <div className="content">
      {/* Navbar */}

      {/* Hero */}
      <section className="hero">
        <h1>
          <Typewriter
            words={["Temukan Buku Favorit Anda"]}
            loop={true}
            cursor
            cursorStyle="|"
            typeSpeed={150}
            deleteSpeed={80}
            delaySpeed={1000}
          />
        </h1>

        <p>
          Jelajahi ribuan buku dari berbagai genre. Dari bestseller hingga karya
          tersembunyi, temukan cerita yang menginspirasi.
        </p>
        <div className="search-box">
          <input
            type="text"
            placeholder="Cari judul buku"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)} //update state saat user ngetik
          />
        </div>
      </section>

      <div className="container-menu">
        <button onClick={() => { setKategori("semua"); fetchData("semua"); }}>Semua</button>
        <button onClick={() => { setKategori("fiksi"); fetchData("fiksi"); }}>Fiksi</button>
        <button onClick={() => { setKategori("non fiksi"); fetchData("non fiksi"); }}>Non-fiksi</button>
        <button onClick={() => { setKategori("cerita"); fetchData("cerita"); }}>Cerita</button>
      </div>

      {/* Semua Buku */}
      <section className="section">
        <div className="section-header">
          <h2>Semua Buku</h2>
        </div>
        <div className="grid">
          {bukuList.length > 0 ? (
            filteredBuku.map((buku) => (
              <div
                key={buku.id}
                className="card"
                onClick={() => setSelectedBuku(buku)} // ✅ klik buka modal
              >
                <div className="relative">
                  <img src={buku.cover} alt={buku.judul} />
                  <span className="tag">{buku.kategori}</span>
                </div>
                <div className="card-body">
                  <h3>{buku.judul}</h3>
                  <p>oleh {buku.penulis}</p>
                </div>
              </div>
            ))
          ) : (
            <p>Sedang memuat buku...</p>
          )}
        </div>
      </section>

      {/* Modal Detail Buku */}
      {selectedBuku && (
        <div className="modal-overlay" onClick={() => setSelectedBuku(null)}>
          <div className="modal-content" onClick={(e) => e.stopPropagation()}>
            <button className="close-btn" onClick={() => setSelectedBuku(null)}>✖</button>

            {/* Cover di kiri */}
            <img src={selectedBuku.cover} alt={selectedBuku.judul} className="modal-img" />

            {/* Info di kanan */}
            <div className="modal-info">
              <h2>{selectedBuku.judul}</h2>
              <p><b>Penulis:</b> {selectedBuku.penulis}</p>
              <p><b>kategori:</b> {selectedBuku.kategori}</p>
              <p><b>Penerbit:</b> {selectedBuku.penerbit}</p>
              <p><b>Tahun Terbit:</b> {selectedBuku["tahun_terbit"]}</p>
              <p><b>ISBN:</b> {selectedBuku.isbn}-</p>
              <p><b>Tebal:</b> {selectedBuku["tebal_buku"]} halaman</p>
              <p className="deskripsi">{selectedBuku.deskripsi}</p>
            </div>
          </div>
        </div>
      )}

    </div>
  );
}

export default Home;
