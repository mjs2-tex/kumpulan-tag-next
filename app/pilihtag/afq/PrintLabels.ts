'use client';

import jsPDF from "jspdf";
import autoTable from "jspdf-autotable";

// JANGAN import JsBarcode dan printJS di sini secara static

export const printLabels = async (items: any[]) => {
  // 1. Guard clause untuk SSR
  if (typeof window === "undefined") return;

  // 2. Dynamic Import di dalam fungsi (Agar tidak terbaca saat build server)
  const JsBarcode = (await import("jsbarcode")).default;
  const printJS = (await import("print-js")).default;

  const doc = new jsPDF({
    orientation: "portrait",
    unit: "mm",
    format: [100, 180],
  });

  items.forEach((item, index) => {
    if (index > 0) doc.addPage([100, 180]);

    const marginX = 35;
    const contentWidth = 54;
    const fontSize = 6;

    doc.setDrawColor(0, 0, 0);
    doc.setLineWidth(0.3);

    /* ================= HEADER ================= */
    doc.setFont("helvetica", "bold");
    doc.setFontSize(9);
    doc.text(String(item.no_piece), 35, 35);

    doc.setFont("helvetica", "bold");
    doc.setFontSize(9);
    doc.text(item.warna_produk, 35, 55);

    doc.setFont("helvetica", "bold");
    doc.setFontSize(9);
    doc.text(String(item.quantity), 35, 68);

    doc.setFont("helvetica", "bold");
    doc.setFontSize(9);
    doc.text(String(parseFloat(item.quantity) * 0.9144), 68 , 68);

  });

  // --- PDF OUTPUT & PRINT-JS ---
  const pdfArrayBuffer = doc.output('arraybuffer');
  const blob = new Blob([pdfArrayBuffer], { type: 'application/pdf' });
  const pdfUrl = URL.createObjectURL(blob);

  printJS({
    printable: pdfUrl,
    type: 'pdf',
    onPrintDialogClose: () => URL.revokeObjectURL(pdfUrl),
    showModal: true,
    modalMessage: 'Menyiapkan dokumen...',
  });
};