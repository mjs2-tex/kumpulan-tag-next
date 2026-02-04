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
    format: [60, 60],
  });

  items.forEach((item, index) => {
    if (index > 0) doc.addPage([60, 60]);

    const marginX = 3;
    const contentWidth = 54;
    const fontSize = 6;

    doc.setDrawColor(0, 0, 0);
    doc.setLineWidth(0.3);

    /* ================= HEADER ================= */
    doc.setFont("helvetica", "bold");
    doc.setFontSize(9);
    doc.rect(marginX, 3, contentWidth, 7);
    doc.text("SABRINA", 30, 7.8, { align: "center" });

    /* ================= TABLE ================= */
    // Proses pembersihan warna sebelum masuk ke tabel
    const cleanColor = (item.warna_produk || "")
      .split("(")[0] // Ambil teks sebelum kurung buka
      .trim()        // Buang spasi di awal/akhir
      .toUpperCase(); // Pastikan huruf besar semua

    autoTable(doc, {
      startY: 10,
      margin: { left: marginX, right: marginX },
      tableWidth: contentWidth,
      theme: "grid",
      styles: {
        fontSize,
        cellPadding: 1.5,
        lineWidth: 0.3,
        lineColor: [0, 0, 0],
        textColor: [0, 0, 0],
        valign: "middle",
        font: "helvetica",
      },
      columnStyles: {
        0: { cellWidth: 15, fontStyle: "bold" },
        1: { cellWidth: 24, halign: "center", fontStyle: "bold" },
        2: { cellWidth: 15, halign: "center" },
      },
      body: [
        ["PI NO", "PM-014", "LOT NO"],
        ["ITEM", "24009#", item.no_lot_custom || "LOT 1"],
        ["COL", cleanColor, "ROLL"], // Menggunakan variabel cleanColor yang sudah dikondisikan
        ["LENGTH", item.quantity || "0", item.no_piece || "0"],
      ],
    });

    const finalY = (doc as any).lastAutoTable.finalY;

    /* ================= K3L ================= */
    const k3lHeight = 6;
    doc.rect(marginX, finalY, 39, k3lHeight);
    doc.rect(marginX + 39, finalY, 15, k3lHeight);

    doc.setFontSize(fontSize);
    doc.text("NO REGISTRASI K3L:", marginX + 2, finalY + 4);
    doc.text("24-D-000695", marginX + 53, finalY + 4, { align: "right" });

    /* ================= BARCODE ================= */
    const barcodeY = finalY + k3lHeight;
    const barcodeBoxHeight = 12;

    doc.rect(marginX, barcodeY, contentWidth, barcodeBoxHeight);

    const barcodeX = marginX + 2;
    const barcodeWidth = 28;
    const barcodeHeight = 8;

    const canvas = document.createElement("canvas");
    JsBarcode(canvas, item.production_name || "D-20251239828", {
      format: "CODE128",
      width: 2,
      height: 30,
      margin: 0,
      displayValue: false,
    });

    doc.addImage(
      canvas.toDataURL("image/png"),
      "PNG",
      barcodeX,
      barcodeY + 2,
      barcodeWidth,
      barcodeHeight
    );

    const textX = barcodeX + barcodeWidth + 3;
    const textY = barcodeY + (barcodeBoxHeight / 2) + (fontSize / 2) - 1;

    doc.setFontSize(fontSize);
    doc.text(
      item.production_name || "D-20251239828",
      textX,
      textY - 1 // Disesuaikan sedikit agar lebih center secara visual
    );

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