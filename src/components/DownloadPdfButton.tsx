"use client";

import React from "react";
import { FaDownload } from "react-icons/fa";

interface DownloadPdfButtonProps {
  resumeName?: string;
}

const DownloadPdfButton: React.FC<DownloadPdfButtonProps> = ({ resumeName = "resume" }) => {
  const handleDownload = async () => {
    try {
      // Dynamically import to avoid SSR issues
      const html2canvas = (await import("html2canvas")).default;
      const jsPDF = (await import("jspdf")).default;

      const previewElement = document.querySelector(".preview") as HTMLElement;
      if (!previewElement) {
        console.error("Preview element not found");
        return;
      }

      // Create canvas from the preview element
      const canvas = await html2canvas(previewElement, {
        scale: 2,
        useCORS: true,
        logging: false,
        backgroundColor: "#ffffff",
      });

      const imgData = canvas.toDataURL("image/png");
      
      // A4 dimensions in mm
      const pdf = new jsPDF({
        orientation: "portrait",
        unit: "mm",
        format: "a4",
      });

      const pdfWidth = pdf.internal.pageSize.getWidth();
      const pdfHeight = pdf.internal.pageSize.getHeight();
      
      // Calculate image dimensions to fit A4
      const imgWidth = pdfWidth;
      const imgHeight = (canvas.height * pdfWidth) / canvas.width;

      let heightLeft = imgHeight;
      let position = 0;

      // Add first page
      pdf.addImage(imgData, "PNG", 0, position, imgWidth, imgHeight);
      heightLeft -= pdfHeight;

      // Add additional pages if content is longer than one page
      while (heightLeft > 0) {
        position = heightLeft - imgHeight;
        pdf.addPage();
        pdf.addImage(imgData, "PNG", 0, position, imgWidth, imgHeight);
        heightLeft -= pdfHeight;
      }

      pdf.save(`${resumeName}.pdf`);
    } catch (error) {
      console.error("Error generating PDF:", error);
      alert("Failed to generate PDF. Please try again.");
    }
  };

  return (
    <button
      onClick={handleDownload}
      className="fixed bottom-6 right-6 bg-gray-900 hover:bg-gray-700 dark:bg-white dark:hover:bg-gray-100 text-white dark:text-gray-900 px-6 py-3 rounded-lg shadow-lg flex items-center gap-2 transition-all hover:scale-105 exclude-print z-50 font-bold"
      aria-label="Download Resume as PDF"
    >
      <FaDownload />
      <span>Download PDF</span>
    </button>
  );
};

export default DownloadPdfButton;
