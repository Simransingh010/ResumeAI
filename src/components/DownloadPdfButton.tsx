"use client";

import React, { useState } from "react";
import { FaDownload, FaSpinner } from "react-icons/fa";

interface DownloadPdfButtonProps {
  resumeName?: string;
}

const DownloadPdfButton: React.FC<DownloadPdfButtonProps> = ({ resumeName = "resume" }) => {
  const [isGenerating, setIsGenerating] = useState(false);

  const handleDownload = async () => {
    if (isGenerating) return;
    
    setIsGenerating(true);
    try {
      // Dynamically import to avoid SSR issues
      const html2canvas = (await import("html2canvas")).default;
      const jsPDF = (await import("jspdf")).default;

      // Find the preview element
      const previewElement = document.querySelector(".preview") as HTMLElement;
      if (!previewElement) {
        console.error("Preview element not found");
        return;
      }

      // Store original styles
      const originalBoxShadow = previewElement.style.boxShadow;
      const originalPadding = previewElement.style.padding;
      const originalMaxWidth = previewElement.style.maxWidth;

      // Temporarily remove shadow and adjust padding for PDF
      previewElement.style.boxShadow = "none";
      previewElement.style.padding = "32px";
      previewElement.style.maxWidth = "210mm"; // A4 width

      // Wait for styles to apply
      await new Promise(resolve => setTimeout(resolve, 100));

      // Create canvas from the preview element with high quality
      const canvas = await html2canvas(previewElement, {
        scale: 3, // Higher scale for better quality
        useCORS: true,
        logging: false,
        backgroundColor: "#ffffff",
        windowWidth: 794, // A4 width in pixels at 96 DPI
        windowHeight: 1123, // A4 height in pixels at 96 DPI
      });

      // Restore original styles
      previewElement.style.boxShadow = originalBoxShadow;
      previewElement.style.padding = originalPadding;
      previewElement.style.maxWidth = originalMaxWidth;

      const imgData = canvas.toDataURL("image/png", 1.0);
      
      // A4 dimensions in mm
      const pdf = new jsPDF({
        orientation: "portrait",
        unit: "mm",
        format: "a4",
        compress: true,
      });

      const pdfWidth = pdf.internal.pageSize.getWidth();
      const pdfHeight = pdf.internal.pageSize.getHeight();
      
      // Add margins
      const margin = 10;
      const contentWidth = pdfWidth - (2 * margin);
      const contentHeight = (canvas.height * contentWidth) / canvas.width;

      let heightLeft = contentHeight;
      let position = margin;

      // Add first page
      pdf.addImage(imgData, "PNG", margin, position, contentWidth, contentHeight, undefined, "FAST");
      heightLeft -= (pdfHeight - 2 * margin);

      // Add additional pages if content is longer than one page
      while (heightLeft > 0) {
        position = -(contentHeight - heightLeft) + margin;
        pdf.addPage();
        pdf.addImage(imgData, "PNG", margin, position, contentWidth, contentHeight, undefined, "FAST");
        heightLeft -= (pdfHeight - 2 * margin);
      }

      pdf.save(`${resumeName}.pdf`);
    } catch (error) {
      console.error("Error generating PDF:", error);
      alert("Failed to generate PDF. Please try again.");
    } finally {
      setIsGenerating(false);
    }
  };

  return (
    <button
      onClick={handleDownload}
      disabled={isGenerating}
      className={`fixed bottom-6 right-6 bg-gray-900 hover:bg-gray-700 dark:bg-white dark:hover:bg-gray-100 text-white dark:text-gray-900 px-6 py-3 rounded-lg shadow-lg flex items-center gap-2 transition-all exclude-print z-50 font-bold ${
        isGenerating ? "opacity-75 cursor-wait" : "hover:scale-105"
      }`}
      aria-label="Download Resume as PDF"
    >
      {isGenerating ? (
        <>
          <FaSpinner className="animate-spin" />
          <span>Generating...</span>
        </>
      ) : (
        <>
          <FaDownload />
          <span>Download PDF</span>
        </>
      )}
    </button>
  );
};

export default DownloadPdfButton;
