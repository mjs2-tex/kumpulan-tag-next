"use client";

import Image from "next/image";
import Link from "next/link";
import { useState } from "react";
import { useRouter } from "next/navigation";
import axios from "axios";
import Swal from "sweetalert2";

export default function LoginPage() {
  const router = useRouter();
  const [productionName, setProductionName] = useState("");
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!productionName.trim()) {
      Swal.fire({
        icon: "warning",
        title: "Input kosong",
        text: "Silakan scan kartu produksi",
        timer: 3000,
        showConfirmButton: false,
      });
      return;
    }

    try {
      setLoading(true);

      const response = await axios.get("/api/cek_kartu_produksi", {
        params: {
          production_name: productionName.trim(),
        },
        timeout: 5000, // ⏱️ timeout 5 detik
      });

      const data = response.data;

      if (!data.production_name) {
        // ❌ Tidak ditemukan
        Swal.fire({
          icon: "error",
          title: "Kartu Produksi",
          text: "Kartu produksi tidak ditemukan",
          timer: 3000,
          showConfirmButton: false,
        });
        setProductionName("");
        return;
      }

      // ✅ Ketemu → redirect
      router.push(
        `/pilihtag?production_name=${encodeURIComponent(
          data.production_name
        )}`
      );
    } catch (error: any) {
      console.error(error);

      Swal.fire({
        icon: "error",
        title: "Terjadi Kesalahan",
        text: "Periksa kembali koneksi",
        timer: 3000,
        showConfirmButton: false,
      });
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="relative z-10 w-full max-w-sm p-8 bg-white/10 backdrop-blur-md rounded-2xl shadow-2xl border border-white/20">
      <h2 className="text-xl font-bold text-center text-white mb-6">
        Selamat Datang di Aplikasi TAG MJS2
      </h2>

      <form className="flex flex-col gap-4" onSubmit={handleSubmit}>
        <div>
          <label className="block text-sm text-white mb-1">
            Scan Kartu Proses
          </label>
          <input
            type="text"
            autoFocus
            value={productionName}
            onChange={(e) => setProductionName(e.target.value)}
            placeholder="Masukan Nomor Kartu PROSES (Scan)"
            className="w-full px-4 py-2 rounded-lg bg-white/20 border border-white/30 text-white placeholder-white/60 focus:outline-none focus:ring-2 focus:ring-blue-400"
          />
        </div>

        <div className="flex flex-col gap-3 mt-4">
          <button
            type="submit"
            disabled={loading}
            className="w-full bg-blue-600 hover:bg-blue-700 disabled:opacity-60 text-white font-semibold py-2 rounded-lg transition-all"
          >
            {loading ? "Memeriksa..." : "Pilih Jenis TAG"}
          </button>

          <Link
            href="/manual"
            className="w-full text-center bg-transparent border border-white/50 hover:bg-white/10 text-white font-semibold py-2 rounded-lg transition-all"
          >
            Input Tag Manual
          </Link>
        </div>
      </form>
    </div>
  );
}
