import { useEstimate } from '../../contexts/EstimateContext';
import type { LineItem } from '../../types/estimate';

const COMMON_ITEMS = [
  { category: 'Hardware', description: 'Hinges', unitCost: 54.32 },
  { category: 'Hardware', description: 'Door Closers', unitCost: 125.00 },
  { category: 'Hardware', description: 'Locksets', unitCost: 85.00 },
  { category: 'Hardware', description: 'Screws', unitCost: 50.00 },
  { category: 'Doors', description: 'Interior Door', unitCost: 350.00 },
  { category: 'Doors', description: 'Exterior Door', unitCost: 650.00 },
  { category: 'Millwork', description: 'Base Trim', unitCost: 12.50 },
  { category: 'Millwork', description: 'Crown Molding', unitCost: 18.75 },
  { category: 'Millwork', description: 'Door Casing', unitCost: 15.00 },
  { category: 'Millwork', description: 'Window Casing', unitCost: 14.50 },
];

export function QuickAddChips() {
  const { estimate, addLineItem } = useEstimate();

  if (!estimate) return null;

  const handleQuickAdd = (item: typeof COMMON_ITEMS[0]) => {
    const newItem: LineItem = {
      id: `quick_${Date.now()}`,
      category: item.category,
      description: item.description,
      quantity: 1,
      unitCost: item.unitCost,
      total: item.unitCost,
    };
    addLineItem(newItem);
  };

  return (
    <div className="bg-white p-4 rounded-lg shadow">
      <h3 className="text-sm font-semibold mb-3 text-gray-700">Quick Add Common Items</h3>
      <div className="flex flex-wrap gap-2">
        {COMMON_ITEMS.map((item, index) => (
          <button
            key={index}
            onClick={() => handleQuickAdd(item)}
            className="px-3 py-1.5 text-sm bg-gray-100 hover:bg-brand-green hover:text-white text-gray-700 rounded-full transition-colors border border-gray-300 hover:border-brand-green"
          >
            + {item.description}
          </button>
        ))}
      </div>
      <p className="text-xs text-gray-500 mt-3">
        Click any item to add it to your estimate. You can edit quantity and price after adding.
      </p>
    </div>
  );
}







