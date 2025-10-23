import React, { useState, useEffect } from "react";
import { db } from "../../../firebase";
import {
    collection,
    getDocs,
    addDoc,
    updateDoc,
    deleteDoc,
    doc,
    serverTimestamp
} from "firebase/firestore";

import "../../css/databuku.css";

function Dashboardbuku() {
  const [bukuList, setBukuList] = useState([]);
  const [showModal, setShowModal] = useState(false);
  const [isEditMode, setIsEditMode] = useState(false);
  const [editingId, setEditingId] = useState(null);
  const [formData, setFormData] = useState({
    judul: "",
    penulis: "",
    penerbit: "",
    tahun_terbit: "",
    kategori: "",
    tebal_buku: "",
    cover: "",
    deskripsi: "",
  });

  const fetchBuku = async () => {
    try {
      const querySnapshot = await getDocs(collection(db, "data_buku"));
      const data = querySnapshot.docs.map((doc) => ({
        id: doc.id,
        ...doc.data(),
      }));
      setBukuList(data);
    } catch (error) {
      console.error("Error mengambil data:", error);
    }
  };

  useEffect(() => {
    fetchBuku();
  }, []);

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const resetForm = () => {
    setFormData({
      judul: "",
      penulis: "",
      penerbit: "",
      tahun_terbit: "",
      kategori: "",
      tebal_buku: "",
      cover: "",
      deskripsi: "",
    });
    setIsEditMode(false);
    setEditingId(null);
    setShowModal(false);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const dataToSave = { ...formData };
    if (dataToSave.tahun_terbit) dataToSave.tahun_terbit = parseInt(dataToSave.tahun_terbit, 10);
    if (dataToSave.tebal_buku) dataToSave.tebal_buku = parseInt(dataToSave.tebal_buku, 10);

    try {
      if (isEditMode && editingId) {
        const bukuRef = doc(db, "data_buku", editingId);
        await updateDoc(bukuRef, dataToSave);
        alert("Buku berhasil diupdate!");
      } else {
        await addDoc(collection(db, "data_buku"), {
          ...dataToSave,
          createdAt: serverTimestamp(),
        });
        alert("Buku berhasil ditambahkan!");
      }
      fetchBuku();
      resetForm();
    } catch (error) {
      console.error(`Error ${isEditMode ? "update" : "tambah"} data:`, error);
      alert(`Gagal ${isEditMode ? "update" : "menambah"} buku.`);
    }
  };

  const handleEdit = (buku) => {
    setFormData({
      judul: buku.judul || "",
      penulis: buku.penulis || "",
      penerbit: buku.penerbit || "",
      tahun_terbit: buku.tahun_terbit ? String(buku.tahun_terbit) : "",
      kategori: buku.kategori || "",
      tebal_buku: buku.tebal_buku ? String(buku.tebal_buku) : "",
      cover: buku.cover || "",
      deskripsi: buku.deskripsi || "",
    });
    setEditingId(buku.id);
    setIsEditMode(true);
    setShowModal(true);
  };

  const handleDelete = async (id) => {
    if (window.confirm("Yakin hapus buku ini? Data tidak bisa dikembalikan!")) {
      try {
        await deleteDoc(doc(db, "data_buku", id));
        alert("Buku berhasil dihapus!");
        fetchBuku();
      } catch (error) {
        console.error("Error hapus data:", error);
        alert("Gagal menghapus buku.");
      }
    }
  };

  return (
    <div className="buku-page">
      <h1>Daftar Buku</h1>
      <button className="btn-add" onClick={() => setShowModal(true)}>Tambah Buku</button>

      {/* Modal Form */}
      {showModal && (
        <div className="modal">
          <div className="modal-content">
            <h2>{isEditMode ? "Edit Buku" : "Tambah Buku"}</h2>
            <form onSubmit={handleSubmit}>
              <input type="text" name="judul" placeholder="Judul Buku" value={formData.judul} onChange={handleChange} required />
              <input type="text" name="penulis" placeholder="Penulis" value={formData.penulis} onChange={handleChange} />
              <input type="text" name="penerbit" placeholder="Penerbit" value={formData.penerbit} onChange={handleChange} />
              <input type="number" name="tahun_terbit" placeholder="Tahun Terbit" value={formData.tahun_terbit} onChange={handleChange} />
              <input type="text" name="kategori" placeholder="Kategori" value={formData.kategori} onChange={handleChange} />
              <input type="number" name="tebal_buku" placeholder="Tebal Buku (halaman)" value={formData.tebal_buku} onChange={handleChange} />
              <input type="text" name="cover" placeholder="URL Cover" value={formData.cover} onChange={handleChange} />
              <textarea name="deskripsi" placeholder="Deskripsi" value={formData.deskripsi} onChange={handleChange}></textarea>
              <div className="modal-buttons">
                <button type="submit">{isEditMode ? "Update" : "Tambah"}</button>
                <button type="button" onClick={resetForm}>Batal</button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Daftar Buku */}
      <div className="buku-list">
        {bukuList.length === 0 ? (
          <p className="empty-text">Tidak ada buku.</p>
        ) : (
          bukuList.map((buku) => (
            <div key={buku.id} className="buku-card modern-card">
              <div className="cover-wrapper">
                <img src={buku.cover || "https://via.placeholder.com/150x220"} alt={buku.judul} />
              </div>
              <h3>{buku.judul}</h3>
              <p><strong>Penulis:</strong> {buku.penulis}</p>
              <p><strong>Penerbit:</strong> {buku.penerbit}</p>
              <p><strong>Tahun:</strong> {buku.tahun_terbit}</p>
              <p><strong>Kategori:</strong> {buku.kategori}</p>
              <p><strong>Tebal:</strong> {buku.tebal_buku} halaman</p>
              <p className="deskripsi">{buku.deskripsi}</p>
              <div className="card-buttons">
                <button className="btn-edit" onClick={() => handleEdit(buku)}>Edit</button>
                <button className="btn-delete" onClick={() => handleDelete(buku.id)}>Hapus</button>
              </div>
            </div>
          ))
        )}
      </div>

    </div>
  );
}

export default Dashboardbuku;
