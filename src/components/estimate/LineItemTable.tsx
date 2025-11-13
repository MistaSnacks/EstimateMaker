import React, { useState } from 'react';
import { useEstimate } from '../../contexts/EstimateContext';
import { Button } from '../common/Button';
import { FiPlus, FiTrash2 } from 'react-icons/fi';
import { calculateGrandTotal } from '../../utils/calculations';
import type { LineItem } from '../../types/estimate';

export function LineItemTable() {
  const { estimate, addLineItem, updateLineItem, deleteLineItem } = useEstimate();
  const [editingId, setEditingId] = useState<string | null>(null);
  const [editingField, setEditingField] = useState<string>('');

  if (!estimate) return null;

  const grandTotal = calculateGrandTotal(estimate.lineItems);

  const categories = Array.from(new Set(estimate.lineItems.map(item => item.category)));
  const categoriesWithSubtotals = categories.map(cat => {
    const items = estimate.lineItems.filter(item => item.category === cat);
    const subtotal = items.reduce((sum, item) => sum + item.total, 0);
    return { category: cat, items, subtotal };
  });

  const handleAddItem = () => {
    const newItem: LineItem = {
      id: `item_${Date.now()}`,
      category: 'General',
      description: '',
      quantity: 1,
      unitCost: 0,
      total: 0,
    };
    addLineItem(newItem);
    setEditingId(newItem.id);
    setEditingField('category');
  };

  const handleFieldChange = (id: string, field: keyof LineItem, value: string | number) => {
    updateLineItem(id, { [field]: value });
  };

  const renderEditableCell = (item: LineItem, field: 'description' | 'category' | 'quantity' | 'unitCost') => {
    const isEditing = editingId === item.id && editingField === field;
    const value = item[field];

    if (isEditing) {
      return (
        <input
          type={field === 'quantity' || field === 'unitCost' ? 'number' : 'text'}
          value={value}
          onChange={(e) => {
            const newValue = field === 'quantity' || field === 'unitCost' 
              ? parseFloat(e.target.value) || 0
              : e.target.value;
            handleFieldChange(item.id, field, newValue);
          }}
          onBlur={() => {
            setEditingId(null);
            setEditingField('');
          }}
          onKeyDown={(e) => {
            if (e.key === 'Enter') {
              setEditingId(null);
              setEditingField('');
            }
          }}
          className="w-full px-2 py-1 border border-brand-green rounded focus:outline-none focus:ring-1 focus:ring-brand-green"
          autoFocus
        />
      );
    }

    return (
      <div
        className="px-2 py-1 cursor-pointer hover:bg-gray-100 rounded"
        onDoubleClick={() => {
          setEditingId(item.id);
          setEditingField(field);
        }}
      >
        {typeof value === 'number' ? (
          field === 'unitCost' ? `$${value.toFixed(2)}` : value.toString()
        ) : (
          value || <span className="text-gray-400">Click to edit</span>
        )}
      </div>
    );
  };

  return (
    <div className="bg-white p-6 rounded-lg shadow">
      <div className="flex justify-between items-center mb-4">
        <h2 className="text-xl font-semibold">Line Items</h2>
        <Button onClick={handleAddItem} size="sm">
          <FiPlus className="inline mr-1" />
          Add Item
        </Button>
      </div>

      {estimate.lineItems.length === 0 ? (
        <div className="text-center py-8 text-gray-500">
          <p>No line items yet. Click "Add Item" or use voice input to get started.</p>
        </div>
      ) : (
        <>
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="bg-gray-100 border-b">
                  <th className="text-left p-2">Category</th>
                  <th className="text-left p-2">Description</th>
                  <th className="text-right p-2">Quantity</th>
                  <th className="text-right p-2">Unit Cost</th>
                  <th className="text-right p-2">Total</th>
                  <th className="w-12"></th>
                </tr>
              </thead>
              <tbody>
                {categoriesWithSubtotals.map(({ category, items, subtotal }) => (
                  <React.Fragment key={category}>
                    {items.map((item) => (
                      <tr key={item.id} className="border-b hover:bg-gray-50">
                        <td className="p-2">{renderEditableCell(item, 'category')}</td>
                        <td className="p-2">{renderEditableCell(item, 'description')}</td>
                        <td className="p-2 text-right">{renderEditableCell(item, 'quantity')}</td>
                        <td className="p-2 text-right">{renderEditableCell(item, 'unitCost')}</td>
                        <td className="p-2 text-right font-medium">${item.total.toFixed(2)}</td>
                        <td className="p-2">
                          <button
                            onClick={() => deleteLineItem(item.id)}
                            className="text-red-600 hover:text-red-800 p-1"
                            title="Delete"
                          >
                            <FiTrash2 size={16} />
                          </button>
                        </td>
                      </tr>
                    ))}
                    <tr className="bg-gray-50 border-b-2 border-gray-300">
                      <td colSpan={4} className="p-2 text-right font-semibold">
                        {category} Subtotal:
                      </td>
                      <td className="p-2 text-right font-semibold">${subtotal.toFixed(2)}</td>
                      <td></td>
                    </tr>
                  </React.Fragment>
                ))}
                <tr className="bg-brand-green text-white font-bold">
                  <td colSpan={4} className="p-3 text-right">
                    Grand Total:
                  </td>
                  <td className="p-3 text-right text-lg">${grandTotal.toFixed(2)}</td>
                  <td></td>
                </tr>
              </tbody>
            </table>
          </div>

          <div className="mt-4 text-sm text-gray-600">
            <p>💡 Double-click any cell to edit. Use voice input or the "Add Item" button to add more items.</p>
          </div>
        </>
      )}
    </div>
  );
}
