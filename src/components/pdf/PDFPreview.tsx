import React from 'react';
import { useEstimate } from '../../contexts/EstimateContext';
import { calculateGrandTotal } from '../../utils/calculations';
import type { Allocation } from '../../types/estimate';

function groupAllocations(allocations: Allocation[], lineItems: any[]) {
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

export function PDFPreview() {
  const { estimate } = useEstimate();

  if (!estimate) return null;

  const grandTotal = calculateGrandTotal(estimate.lineItems);
  const categories = Array.from(new Set(estimate.lineItems.map(item => item.category)));
  const categoriesWithSubtotals = categories.map(cat => {
    const items = estimate.lineItems.filter(item => item.category === cat);
    const subtotal = items.reduce((sum, item) => sum + item.total, 0);
    return { category: cat, items, subtotal };
  });

  const groupedAllocations = estimate.allocations.length > 0
    ? groupAllocations(estimate.allocations, estimate.lineItems)
    : null;

  return (
    <div className="bg-white rounded-lg shadow-lg overflow-hidden">
      {/* PDF Preview Container - styled to look like a PDF page */}
      <div className="bg-white p-8" style={{ minHeight: '11in', maxWidth: '8.5in', margin: '0 auto' }}>
        {/* Header */}
        <div className="flex justify-between items-start mb-6 pb-4 border-b-2 border-gray-200">
          <div className="flex items-center gap-3">
            <div className="w-8 h-8 bg-brand-green rounded-full flex items-center justify-center">
              <span className="text-white font-bold text-sm">E</span>
            </div>
            <div>
              <div className="text-brand-green font-bold text-sm">EVERGREEN</div>
              <div className="text-gray-800 text-xs">MILLWORK</div>
            </div>
          </div>
          <div className="text-brand-green font-semibold text-sm">Estimate Preview</div>
        </div>

        {/* Project Info */}
        <div className="grid grid-cols-2 gap-4 mb-6 text-xs">
          <div className="space-y-1">
            <div><span className="font-semibold">Project:</span> {estimate.projectName || '—'}</div>
            <div><span className="font-semibold">Address:</span> {estimate.address || '—'}</div>
            <div><span className="font-semibold">Project Type:</span> {estimate.projectType}</div>
          </div>
          <div className="space-y-1">
            <div><span className="font-semibold">Client:</span> {estimate.client || '—'}</div>
            <div><span className="font-semibold">Bid Date:</span> {estimate.bidDate || '—'}</div>
            <div><span className="font-semibold">Buildings:</span> {estimate.buildings}</div>
            <div><span className="font-semibold">Units:</span> {estimate.units}</div>
          </div>
        </div>

        {/* Line Items Table */}
        {estimate.lineItems.length > 0 ? (
          <div className="mb-6">
            <h3 className="text-sm font-semibold mb-2">Estimate Details</h3>
            <div className="border border-gray-300 rounded overflow-hidden">
              <table className="w-full text-xs">
                <thead>
                  <tr className="bg-gray-200">
                    <th className="text-left p-2 border-r border-gray-300">Description</th>
                    <th className="text-right p-2 border-r border-gray-300">Quantity</th>
                    <th className="text-right p-2 border-r border-gray-300">Unit Cost</th>
                    <th className="text-right p-2">Total</th>
                  </tr>
                </thead>
                <tbody>
                  {categoriesWithSubtotals.map(({ category, items, subtotal }) => (
                    <React.Fragment key={category}>
                      {items.map((item, idx) => (
                        <tr key={item.id} className={idx % 2 === 0 ? 'bg-white' : 'bg-gray-50'}>
                          <td className="p-2 border-r border-gray-300">{item.description || '—'}</td>
                          <td className="p-2 text-right border-r border-gray-300">{item.quantity}</td>
                          <td className="p-2 text-right border-r border-gray-300">${item.unitCost.toFixed(2)}</td>
                          <td className="p-2 text-right">${item.total.toFixed(2)}</td>
                        </tr>
                      ))}
                      <tr key={`${category}-subtotal`} className="bg-gray-100 font-semibold">
                        <td colSpan={3} className="p-2 text-right border-r border-gray-300">
                          {category} Subtotal:
                        </td>
                        <td className="p-2 text-right">${subtotal.toFixed(2)}</td>
                      </tr>
                    </React.Fragment>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        ) : (
          <div className="mb-6 text-xs text-gray-500 italic">
            No line items yet. Add items to see them in the preview.
          </div>
        )}

        {/* Grand Total */}
        {estimate.lineItems.length > 0 && (
          <div className="mb-6">
            <div className="bg-brand-green rounded px-4 py-2 flex justify-end">
              <span className="text-white font-bold text-sm">
                Grand Total: ${grandTotal.toFixed(2)}
              </span>
            </div>
          </div>
        )}

        {/* Allocations */}
        {groupedAllocations && Object.keys(groupedAllocations).length > 0 && (
          <div className="mb-6">
            <h3 className="text-sm font-semibold mb-2">Allocations</h3>
            {Object.entries(groupedAllocations).map(([location, items]) => (
              <div key={location} className="mb-4 ml-2">
                <div className="text-xs font-semibold mb-1">{location}</div>
                <div className="border border-gray-300 rounded overflow-hidden">
                  <table className="w-full text-xs">
                    <thead>
                      <tr className="bg-gray-200">
                        <th className="text-left p-1 border-r border-gray-300">Description</th>
                        <th className="text-right p-1 border-r border-gray-300">Quantity</th>
                        <th className="text-right p-1">Total</th>
                      </tr>
                    </thead>
                    <tbody>
                      {items.map((alloc, idx) => (
                        <tr key={alloc.id} className={idx % 2 === 0 ? 'bg-white' : 'bg-gray-50'}>
                          <td className="p-1 border-r border-gray-300">{alloc.description}</td>
                          <td className="p-1 text-right border-r border-gray-300">{alloc.quantity}</td>
                          <td className="p-1 text-right">${alloc.total.toFixed(2)}</td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>
            ))}
          </div>
        )}

        {/* Scope Details */}
        {(estimate.scope.inclusions.length > 0 || 
          estimate.scope.exclusions.length > 0 || 
          estimate.scope.deliveryTerms.length > 0) && (
          <div className="mb-6">
            <h3 className="text-sm font-semibold mb-3">Scope Details</h3>
            
            {estimate.scope.inclusions.length > 0 && (
              <div className="mb-3">
                <div className="text-xs font-semibold mb-1">Inclusions:</div>
                <ul className="text-xs space-y-0.5 ml-2">
                  {estimate.scope.inclusions.map((inclusion, idx) => (
                    <li key={idx}>• {inclusion}</li>
                  ))}
                </ul>
              </div>
            )}

            {estimate.scope.exclusions.length > 0 && (
              <div className="mb-3">
                <div className="text-xs font-semibold mb-1">Exclusions:</div>
                <ul className="text-xs space-y-0.5 ml-2">
                  {estimate.scope.exclusions.map((exclusion, idx) => (
                    <li key={idx}>• {exclusion}</li>
                  ))}
                </ul>
              </div>
            )}

            {estimate.scope.deliveryTerms.length > 0 && (
              <div className="mb-3">
                <div className="text-xs font-semibold mb-1">Delivery Terms:</div>
                <ul className="text-xs space-y-0.5 ml-2">
                  {estimate.scope.deliveryTerms.map((term, idx) => (
                    <li key={idx}>• {term}</li>
                  ))}
                </ul>
              </div>
            )}
          </div>
        )}

        {/* Footer note */}
        <div className="mt-8 pt-4 border-t border-gray-200 text-xs text-gray-500 text-center">
          This is a preview of how your PDF will look when generated
        </div>
      </div>
    </div>
  );
}

