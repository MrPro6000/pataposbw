import jsPDF from "jspdf";

export interface InvoicePdfData {
  invoiceNumber: string;
  date: string;
  dueDate?: string;
  // Business info
  businessName?: string;
  businessEmail?: string;
  businessPhone?: string;
  businessLogoUrl?: string;
  // Customer info
  customerName: string;
  customerEmail?: string;
  customerPhone?: string;
  customerAddress?: string;
  // Line items
  items: { description: string; quantity: number; unitPrice: number; total: number }[];
  subtotal: number;
  notes?: string;
}

export const generateInvoicePdf = async (data: InvoicePdfData): Promise<jsPDF> => {
  const doc = new jsPDF();
  const pageWidth = doc.internal.pageSize.getWidth();
  const margin = 20;
  let y = 20;

  // Colors
  const primaryColor: [number, number, number] = [30, 58, 138]; // dark blue
  const textColor: [number, number, number] = [31, 41, 55];
  const mutedColor: [number, number, number] = [107, 114, 128];

  // Try to load logo
  if (data.businessLogoUrl) {
    try {
      const img = new Image();
      img.crossOrigin = "anonymous";
      await new Promise<void>((resolve, reject) => {
        img.onload = () => resolve();
        img.onerror = () => reject();
        img.src = data.businessLogoUrl!;
      });
      doc.addImage(img, "JPEG", margin, y, 40, 40);
      y += 5;
    } catch {
      // Skip logo if it fails to load
    }
  }

  // Invoice title (right aligned)
  doc.setFontSize(28);
  doc.setTextColor(...primaryColor);
  doc.setFont("helvetica", "bold");
  doc.text("INVOICE", pageWidth - margin, y + 10, { align: "right" });

  doc.setFontSize(10);
  doc.setTextColor(...mutedColor);
  doc.text(`#${data.invoiceNumber}`, pageWidth - margin, y + 18, { align: "right" });
  doc.text(`Date: ${data.date}`, pageWidth - margin, y + 24, { align: "right" });
  if (data.dueDate) {
    doc.text(`Due: ${data.dueDate}`, pageWidth - margin, y + 30, { align: "right" });
  }

  y = data.businessLogoUrl ? 70 : 55;

  // From section
  doc.setFontSize(9);
  doc.setTextColor(...mutedColor);
  doc.text("FROM", margin, y);
  y += 6;
  doc.setFontSize(11);
  doc.setTextColor(...textColor);
  doc.setFont("helvetica", "bold");
  doc.text(data.businessName || "Your Business", margin, y);
  doc.setFont("helvetica", "normal");
  doc.setFontSize(9);
  doc.setTextColor(...mutedColor);
  if (data.businessEmail) { y += 5; doc.text(data.businessEmail, margin, y); }
  if (data.businessPhone) { y += 5; doc.text(data.businessPhone, margin, y); }

  // To section (right column)
  let yTo = data.businessLogoUrl ? 70 : 55;
  const rightCol = pageWidth / 2 + 10;
  doc.setFontSize(9);
  doc.setTextColor(...mutedColor);
  doc.text("BILL TO", rightCol, yTo);
  yTo += 6;
  doc.setFontSize(11);
  doc.setTextColor(...textColor);
  doc.setFont("helvetica", "bold");
  doc.text(data.customerName, rightCol, yTo);
  doc.setFont("helvetica", "normal");
  doc.setFontSize(9);
  doc.setTextColor(...mutedColor);
  if (data.customerEmail) { yTo += 5; doc.text(data.customerEmail, rightCol, yTo); }
  if (data.customerPhone) { yTo += 5; doc.text(data.customerPhone, rightCol, yTo); }
  if (data.customerAddress) {
    const addrLines = doc.splitTextToSize(data.customerAddress, pageWidth / 2 - margin - 10);
    addrLines.forEach((line: string) => { yTo += 5; doc.text(line, rightCol, yTo); });
  }

  y = Math.max(y, yTo) + 15;

  // Table header
  doc.setFillColor(245, 247, 250);
  doc.rect(margin, y, pageWidth - margin * 2, 10, "F");
  doc.setFontSize(8);
  doc.setTextColor(...mutedColor);
  doc.setFont("helvetica", "bold");
  doc.text("DESCRIPTION", margin + 4, y + 7);
  doc.text("QTY", pageWidth - margin - 70, y + 7, { align: "right" });
  doc.text("PRICE", pageWidth - margin - 35, y + 7, { align: "right" });
  doc.text("TOTAL", pageWidth - margin - 4, y + 7, { align: "right" });
  y += 14;

  // Table rows
  doc.setFont("helvetica", "normal");
  doc.setFontSize(10);
  doc.setTextColor(...textColor);

  data.items.forEach((item) => {
    if (y > 260) { doc.addPage(); y = 20; }
    doc.text(item.description, margin + 4, y);
    doc.text(String(item.quantity), pageWidth - margin - 70, y, { align: "right" });
    doc.text(`P${item.unitPrice.toFixed(2)}`, pageWidth - margin - 35, y, { align: "right" });
    doc.text(`P${item.total.toFixed(2)}`, pageWidth - margin - 4, y, { align: "right" });
    y += 8;
    // Divider
    doc.setDrawColor(230, 230, 230);
    doc.line(margin, y - 3, pageWidth - margin, y - 3);
  });

  y += 5;

  // Total
  doc.setFillColor(30, 58, 138);
  doc.roundedRect(pageWidth - margin - 80, y, 80, 14, 3, 3, "F");
  doc.setFontSize(12);
  doc.setTextColor(255, 255, 255);
  doc.setFont("helvetica", "bold");
  doc.text(`Total: P${data.subtotal.toFixed(2)}`, pageWidth - margin - 40, y + 9.5, { align: "center" });

  y += 25;

  // Notes
  if (data.notes) {
    doc.setFontSize(9);
    doc.setTextColor(...mutedColor);
    doc.setFont("helvetica", "bold");
    doc.text("NOTES", margin, y);
    doc.setFont("helvetica", "normal");
    y += 6;
    const noteLines = doc.splitTextToSize(data.notes, pageWidth - margin * 2);
    doc.text(noteLines, margin, y);
  }

  // Footer
  const pageHeight = doc.internal.pageSize.getHeight();
  doc.setFontSize(8);
  doc.setTextColor(160, 160, 160);
  doc.text("Powered by PATA", pageWidth / 2, pageHeight - 10, { align: "center" });

  return doc;
};
