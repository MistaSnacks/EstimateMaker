import { useState } from 'react';
import { useEstimate } from '../../contexts/EstimateContext';
import { Button } from '../common/Button';
import { FiPlus, FiTrash2, FiEdit2 } from 'react-icons/fi';
import type { Allocation } from '../../types/estimate';
import { getUnallocatedQuantity } from '../../utils/calculations';

export function AllocationsEditor() {
  const { estimate, addAllocation, updateAllocation, deleteAllocation } = useEstimate();
  const [editingId, setEditingId] = useState<string | null>(null);
  const [showAddForm, setShowAddForm] = useState(false);
  const [formData, setFormData] = useState({
    lineItemId: '',
    allocatedTo: '',
    quantity: 1,
  });

  if (!estimate || estimate.lineItems.length === 0) {
    return null; // Don't show allocations if there are no line items
  }

  const handleAddAllocation = () => {
    const lineItem = estimate.lineItems.find(item => item.id === formData.lineItemId);
    if (!lineItem) return;

    const unallocatedQty = getUnallocatedQuantity(
      lineItem.quantity,
      estimate.allocations.filter(a => a.lineItemId === formData.lineItemId)
    );

    if (formData.quantity > unallocatedQty) {
      alert(`Cannot allocate more than ${unallocatedQty} (unallocated quantity)`);
      return;
    }

    const unitCost = lineItem.unitCost;
    const total = formData.quantity * unitCost;

    const newAllocation: Allocation = {
      id: `alloc_${Date.now()}_${Math.random()}`,
      lineItemId: formData.lineItemId,
      allocatedTo: formData.allocatedTo,
      quantity: formData.quantity,
      total,
    };

    addAllocation(newAllocation);
    setFormData({ lineItemId: '', allocatedTo: '', quantity: 1 });
    setShowAddForm(false);
  };

  const handleUpdateAllocation = (id: string, updates: Partial<Allocation>) => {
    const allocation = estimate.allocations.find(a => a.id === id);
    if (!allocation) return;

    const lineItem = estimate.lineItems.find(item => item.id === allocation.lineItemId);
    if (!lineItem) return;

    const otherAllocations = estimate.allocations.filter(
      a => a.lineItemId === allocation.lineItemId && a.id !== id
    );
    const unallocatedQty = getUnallocatedQuantity(lineItem.quantity, otherAllocations);

    if (updates.quantity && updates.quantity > unallocatedQty + allocation.quantity) {
      alert(`Cannot allocate more than ${unallocatedQty + allocation.quantity} (available quantity)`);
      return;
    }

    const finalQuantity = updates.quantity ?? allocation.quantity;
    const total = finalQuantity * lineItem.unitCost;

    updateAllocation(id, { ...updates, total });
    setEditingId(null);
  };

  const handleDeleteAllocation = (id: string) => {
    if (confirm('Are you sure you want to delete this allocation?')) {
      deleteAllocation(id);
    }
  };

  // Group allocations by line item
  const allocationsByLineItem = estimate.lineItems.map(lineItem => {
    const allocations = estimate.allocations.filter(a => a.lineItemId === lineItem.id);
    const unallocatedQty = getUnallocatedQuantity(lineItem.quantity, allocations);
    return { lineItem, allocations, unallocatedQty };
  }).filter(group => group.allocations.length > 0 || group.unallocatedQty > 0);

  // Generate allocation suggestions based on project type
  const getAllocationSuggestions = (): string[] => {
    const suggestions: string[] = [];
    if (estimate.projectType === 'Multi-Family' || estimate.projectType === 'Townhome') {
      for (let i = 1; i <= estimate.buildings; i++) {
        suggestions.push(`Building ${i}`);
      }
      for (let i = 1; i <= estimate.units; i++) {
        suggestions.push(`Unit ${i}`);
      }
      suggestions.push('Common Areas', 'Exterior', 'Interior');
    } else {
      suggestions.push('Area 1', 'Area 2', 'Area 3', 'Exterior', 'Interior');
    }
    return suggestions;
  };

  const suggestions = getAllocationSuggestions();

  return (
    <div className="bg-white p-6 rounded-lg shadow">
      <div className="flex justify-between items-center mb-4">
        <h2 className="text-xl font-semibold">Allocations</h2>
        {!showAddForm && (
          <Button onClick={() => setShowAddForm(true)} size="sm">
            <FiPlus className="inline mr-1" />
            Add Allocation
          </Button>
        )}
      </div>

      {showAddForm && (
        <div className="mb-6 p-4 bg-gray-50 rounded-lg border border-gray-200">
          <h3 className="font-medium mb-3">Add New Allocation</h3>
          <div className="space-y-3">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Line Item
              </label>
              <select
                value={formData.lineItemId}
                onChange={(e) => {
                  setFormData({ ...formData, lineItemId: e.target.value, quantity: 1 });
                }}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-1 focus:ring-brand-green"
              >
                <option value="">Select a line item</option>
                {estimate.lineItems.map(item => {
                  const unallocatedQty = getUnallocatedQuantity(
                    item.quantity,
                    estimate.allocations.filter(a => a.lineItemId === item.id)
                  );
                  return (
                    <option key={item.id} value={item.id}>
                      {item.description || 'Untitled'} ({unallocatedQty} available)
                    </option>
                  );
                })}
              </select>
            </div>

            {formData.lineItemId && (
              <>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Allocate To
                  </label>
                  <div className="flex gap-2 mb-2">
                    <input
                      type="text"
                      value={formData.allocatedTo}
                      onChange={(e) => setFormData({ ...formData, allocatedTo: e.target.value })}
                      placeholder="e.g., Building 1, Unit 2, Common Areas"
                      className="flex-1 px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-1 focus:ring-brand-green"
                    />
                  </div>
                  <div className="flex flex-wrap gap-2">
                    {suggestions.map(suggestion => (
                      <button
                        key={suggestion}
                        onClick={() => setFormData({ ...formData, allocatedTo: suggestion })}
                        className="px-2 py-1 text-xs bg-white border border-gray-300 rounded hover:bg-gray-50"
                      >
                        {suggestion}
                      </button>
                    ))}
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Quantity
                  </label>
                  <input
                    type="number"
                    min="1"
                    max={
                      estimate.lineItems.find(item => item.id === formData.lineItemId)?.quantity || 1
                    }
                    value={formData.quantity}
                    onChange={(e) => setFormData({ ...formData, quantity: parseInt(e.target.value) || 1 })}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-1 focus:ring-brand-green"
                  />
                  {formData.lineItemId && (
                    <p className="text-xs text-gray-500 mt-1">
                      Available: {
                        getUnallocatedQuantity(
                          estimate.lineItems.find(item => item.id === formData.lineItemId)!.quantity,
                          estimate.allocations.filter(a => a.lineItemId === formData.lineItemId)
                        )
                      }
                    </p>
                  )}
                </div>

                <div className="flex gap-2">
                  <Button onClick={handleAddAllocation} size="sm" variant="primary">
                    Add Allocation
                  </Button>
                  <Button
                    onClick={() => {
                      setShowAddForm(false);
                      setFormData({ lineItemId: '', allocatedTo: '', quantity: 1 });
                    }}
                    size="sm"
                    variant="secondary"
                  >
                    Cancel
                  </Button>
                </div>
              </>
            )}
          </div>
        </div>
      )}

      {allocationsByLineItem.length === 0 && !showAddForm ? (
        <div className="text-center py-8 text-gray-500">
          <p>No allocations yet. Allocations help you track which line items go to which buildings, units, or areas.</p>
          <p className="text-sm mt-2">Click "Add Allocation" to get started.</p>
        </div>
      ) : (
        <div className="space-y-6">
          {allocationsByLineItem.map(({ lineItem, allocations, unallocatedQty }) => (
            <div key={lineItem.id} className="border border-gray-200 rounded-lg p-4">
              <div className="flex justify-between items-start mb-3">
                <div>
                  <h4 className="font-medium text-gray-900">
                    {lineItem.description || 'Untitled Item'}
                  </h4>
                  <p className="text-sm text-gray-500">
                    Total Quantity: {lineItem.quantity} | Unallocated: {unallocatedQty}
                  </p>
                </div>
              </div>

              {allocations.length > 0 && (
                <div className="space-y-2">
                  {allocations.map((allocation) => (
                    <div
                      key={allocation.id}
                      className="flex items-center justify-between p-2 bg-gray-50 rounded"
                    >
                      {editingId === allocation.id ? (
                        <div className="flex-1 flex gap-2">
                          <input
                            type="text"
                            value={allocation.allocatedTo}
                            onChange={(e) =>
                              handleUpdateAllocation(allocation.id, { allocatedTo: e.target.value })
                            }
                            className="flex-1 px-2 py-1 border border-gray-300 rounded text-sm"
                            onBlur={() => setEditingId(null)}
                            autoFocus
                          />
                          <input
                            type="number"
                            min="1"
                            value={allocation.quantity}
                            onChange={(e) =>
                              handleUpdateAllocation(allocation.id, {
                                quantity: parseInt(e.target.value) || 1,
                              })
                            }
                            className="w-20 px-2 py-1 border border-gray-300 rounded text-sm"
                            onBlur={() => setEditingId(null)}
                          />
                          <span className="text-sm text-gray-600 px-2">
                            ${allocation.total.toFixed(2)}
                          </span>
                        </div>
                      ) : (
                        <>
                          <div className="flex-1">
                            <span className="font-medium">{allocation.allocatedTo}</span>
                            <span className="text-sm text-gray-600 ml-2">
                              Qty: {allocation.quantity} × ${(allocation.total / allocation.quantity).toFixed(2)} = ${allocation.total.toFixed(2)}
                            </span>
                          </div>
                          <div className="flex gap-2">
                            <button
                              onClick={() => setEditingId(allocation.id)}
                              className="text-blue-600 hover:text-blue-800 p-1"
                              title="Edit"
                            >
                              <FiEdit2 size={16} />
                            </button>
                            <button
                              onClick={() => handleDeleteAllocation(allocation.id)}
                              className="text-red-600 hover:text-red-800 p-1"
                              title="Delete"
                            >
                              <FiTrash2 size={16} />
                            </button>
                          </div>
                        </>
                      )}
                    </div>
                  ))}
                </div>
              )}

              {unallocatedQty > 0 && (
                <div className="mt-2 text-sm text-gray-500 italic">
                  {unallocatedQty} unit(s) not yet allocated
                </div>
              )}
            </div>
          ))}
        </div>
      )}

      <div className="mt-4 text-sm text-gray-600">
        <p>💡 Allocations help you track which line items are assigned to specific buildings, units, or areas.</p>
      </div>
    </div>
  );
}

