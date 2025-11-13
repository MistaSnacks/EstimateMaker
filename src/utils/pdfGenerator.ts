import jsPDF from 'jspdf';
import autoTable from 'jspdf-autotable';
import type { Estimate } from '../types/estimate';
import { calculateGrandTotal } from './calculations';

export async function generatePDF(estimate: Estimate): Promise<void> {
  const doc = new jsPDF();
  
  const pageWidth = doc.internal.pageSize.getWidth();
  const margin = 15;
  let yPos = margin;

  // Header
  doc.setFontSize(18);
  doc.setTextColor(16, 185, 129); // brand green
  doc.text('Estimate Preview', pageWidth - margin, yPos, { align: 'right' });
  
  yPos += 20;

  // Evergreen Millwork Logo
  // Green circle with E
  doc.setFillColor(16, 185, 129);
  doc.circle(margin + 15, yPos - 10, 8, 'F');
  doc.setTextColor(255, 255, 255);
  doc.setFontSize(14);
  doc.setFont('helvetica', 'bold');
  doc.text('E', margin + 12, yPos - 6);
  
  // Company name
  doc.setTextColor(16, 185, 129);
  doc.setFontSize(12);
  doc.setFont('helvetica', 'bold');
  doc.text('EVERGREEN', margin + 30, yPos - 8);
  doc.setTextColor(0, 0, 0);
  doc.setFontSize(10);
  doc.text('MILLWORK', margin + 30, yPos - 2);

  yPos += 10;

  // Project Info
  doc.setTextColor(0, 0, 0);
  doc.setFontSize(10);
  
  // Left column
  doc.text(`Project: ${estimate.projectName}`, margin, yPos);
  doc.text(`Address: ${estimate.address}`, margin, yPos + 5);
  doc.text(`Project Type: ${estimate.projectType}`, margin, yPos + 10);
  
  // Right column
  doc.text(`Client: ${estimate.client}`, pageWidth / 2, yPos);
  doc.text(`Bid Date: ${estimate.bidDate}`, pageWidth / 2, yPos + 5);
  doc.text(`Buildings: ${estimate.buildings}`, pageWidth / 2, yPos + 10);
  doc.text(`Units: ${estimate.units}`, pageWidth / 2, yPos + 15);

  yPos += 30;

  // Line Items Table
  doc.setFontSize(12);
  doc.text('Estimate Details', margin, yPos);
  yPos += 5;

  const tableData = estimate.lineItems.map(item => [
    item.description,
    item.quantity.toString(),
    `$${item.unitCost.toFixed(2)}`,
    `$${item.total.toFixed(2)}`,
  ]);

  autoTable(doc, {
    head: [['Description', 'Quantity', 'Unit Cost', 'Total']],
    body: tableData,
    startY: yPos,
    styles: { fontSize: 9 },
    headStyles: { fillColor: [200, 200, 200], textColor: [0, 0, 0] },
  });

  yPos = (doc as any).lastAutoTable.finalY + 10;

  // Grand Total
  const grandTotal = calculateGrandTotal(estimate.lineItems);
  doc.setFillColor(16, 185, 129);
  doc.roundedRect(pageWidth - 80, yPos - 8, 75, 15, 3, 3, 'F');
  doc.setTextColor(255, 255, 255);
  doc.setFontSize(12);
  doc.setFont('helvetica', 'bold');
  doc.text(`Grand Total: $${grandTotal.toFixed(2)}`, pageWidth - 5, yPos, { align: 'right' });

  yPos += 20;

  // Allocations
  if (estimate.allocations.length > 0) {
    doc.setTextColor(0, 0, 0);
    doc.setFont('helvetica', 'normal');
    doc.setFontSize(12);
    doc.text('Allocations', margin, yPos);
    yPos += 5;

    const grouped = groupAllocations(estimate.allocations, estimate.lineItems);
    
    for (const [location, items] of Object.entries(grouped)) {
      doc.setFontSize(10);
      doc.text(location, margin + 5, yPos);
      yPos += 5;

      const allocData = items.map(alloc => [
        alloc.description,
        alloc.allocatedTo,
        alloc.quantity.toString(),
        `$${alloc.total.toFixed(2)}`,
      ]);

      autoTable(doc, {
        head: [['Description', 'Allocated To', 'Quantity', 'Total']],
        body: allocData,
        startY: yPos,
        styles: { fontSize: 8 },
        margin: { left: 15 },
      });

      yPos = (doc as any).lastAutoTable.finalY + 10;
    }
  }

  // Scope Details
  doc.setFontSize(12);
  doc.text('Scope Details', margin, yPos);
  yPos += 10;

  // Inclusions
  doc.setFontSize(10);
  doc.setFont('helvetica', 'bold');
  doc.text('Inclusions:', margin, yPos);
  yPos += 5;
  doc.setFont('helvetica', 'normal');
  estimate.scope.inclusions.forEach(inclusion => {
    doc.text(`• ${inclusion}`, margin + 5, yPos);
    yPos += 5;
  });

  yPos += 5;

  // Exclusions
  doc.setFont('helvetica', 'bold');
  doc.text('Exclusions:', margin, yPos);
  yPos += 5;
  doc.setFont('helvetica', 'normal');
  estimate.scope.exclusions.forEach(exclusion => {
    doc.text(`• ${exclusion}`, margin + 5, yPos);
    yPos += 5;
  });

  yPos += 5;

  // Delivery Terms
  doc.setFont('helvetica', 'bold');
  doc.text('Delivery Terms:', margin, yPos);
  yPos += 5;
  doc.setFont('helvetica', 'normal');
  estimate.scope.deliveryTerms.forEach(term => {
    doc.text(`• ${term}`, margin + 5, yPos);
    yPos += 5;
  });

  // Save PDF
  doc.save(`${estimate.projectName.replace(/\s+/g, '_')}_Estimate.pdf`);
}

function groupAllocations(allocations: any[], lineItems: any[]) {
  const grouped: Record<string, any[]> = {};
  
  allocations.forEach(alloc => {
    const item = lineItems.find(li => li.id === alloc.lineItemId);
    if (!grouped[alloc.allocatedTo]) {
      grouped[alloc.allocatedTo] = [];
    }
    grouped[alloc.allocatedTo].push({
      ...alloc,
      description: item?.description || '',
    });
  });
  
  return grouped;
}
