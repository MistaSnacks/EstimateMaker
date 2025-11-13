import { useState } from 'react';
import { useEstimate } from '../../contexts/EstimateContext';
import { FiPlus, FiTrash2 } from 'react-icons/fi';

const DEFAULT_INCLUSIONS = [
  'All materials specified in the line items above',
  'Standard installation per industry best practices',
  'Warranty on all installed products per manufacturer specs',
];

const DEFAULT_EXCLUSIONS = [
  'Electrical or plumbing work unless specifically noted',
  'Permits and inspection fees',
  'Structural modifications or repairs',
];

const DEFAULT_DELIVERY_TERMS = [
  'Client to provide safe access to delivery location',
  'Delivery during normal business hours (M-F)',
  'Lead time: 6-8 weeks from confirmation',
];

export function ScopeDetailsEditor() {
  const { estimate, updateScope } = useEstimate();
  const [newInclusion, setNewInclusion] = useState('');
  const [newExclusion, setNewExclusion] = useState('');
  const [newTerm, setNewTerm] = useState('');
  const [comments, setComments] = useState(estimate?.scope.comments || '');

  if (!estimate) return null;

  const handleAddItem = (type: 'inclusions' | 'exclusions' | 'deliveryTerms', value: string) => {
    if (!value.trim()) return;
    
    const current = estimate.scope[type] || [];
    updateScope({ [type]: [...current, value.trim()] });
    
    if (type === 'inclusions') setNewInclusion('');
    if (type === 'exclusions') setNewExclusion('');
    if (type === 'deliveryTerms') setNewTerm('');
  };

  const handleDeleteItem = (type: 'inclusions' | 'exclusions' | 'deliveryTerms', index: number) => {
    const current = estimate.scope[type] || [];
    updateScope({ [type]: current.filter((_, i) => i !== index) });
  };

  const handleLoadDefaults = (type: 'inclusions' | 'exclusions' | 'deliveryTerms') => {
    const defaults = type === 'inclusions' ? DEFAULT_INCLUSIONS :
                    type === 'exclusions' ? DEFAULT_EXCLUSIONS :
                    DEFAULT_DELIVERY_TERMS;
    updateScope({ [type]: [...defaults] });
  };

  const handleCommentsChange = (value: string) => {
    setComments(value);
    updateScope({ comments: value });
  };

  const renderListEditor = (
    title: string,
    items: string[],
    newValue: string,
    setNewValue: (v: string) => void,
    type: 'inclusions' | 'exclusions' | 'deliveryTerms'
  ) => (
    <div className="space-y-2">
      <div className="flex justify-between items-center">
        <h4 className="font-semibold">{title}</h4>
        <button
          onClick={() => handleLoadDefaults(type)}
          className="text-sm text-brand-green hover:text-brand-greenDark"
        >
          Load Defaults
        </button>
      </div>
      <div className="space-y-1">
        {items.map((item, index) => (
          <div key={index} className="flex items-center gap-2 group">
            <span className="text-brand-green">•</span>
            <span className="flex-1">{item}</span>
            <button
              onClick={() => handleDeleteItem(type, index)}
              className="opacity-0 group-hover:opacity-100 text-red-600 hover:text-red-800"
            >
              <FiTrash2 size={14} />
            </button>
          </div>
        ))}
      </div>
      <div className="flex gap-2">
        <input
          type="text"
          value={newValue}
          onChange={(e) => setNewValue(e.target.value)}
          onKeyDown={(e) => {
            if (e.key === 'Enter') {
              e.preventDefault();
              handleAddItem(type, newValue);
            }
          }}
          placeholder={`Add ${title.toLowerCase()}...`}
          className="flex-1 px-3 py-1.5 border border-gray-300 rounded focus:outline-none focus:ring-1 focus:ring-brand-green"
        />
        <button
          onClick={() => handleAddItem(type, newValue)}
          className="px-3 py-1.5 bg-brand-green text-white rounded hover:bg-brand-greenDark transition-colors"
        >
          <FiPlus size={16} />
        </button>
      </div>
    </div>
  );

  return (
    <div className="bg-white p-6 rounded-lg shadow">
      <h2 className="text-xl font-semibold mb-4">Scope Details</h2>

      <div className="space-y-6">
        {renderListEditor(
          'Inclusions',
          estimate.scope.inclusions,
          newInclusion,
          setNewInclusion,
          'inclusions'
        )}

        <div className="border-t pt-4">
          {renderListEditor(
            'Exclusions',
            estimate.scope.exclusions,
            newExclusion,
            setNewExclusion,
            'exclusions'
          )}
        </div>

        <div className="border-t pt-4">
          {renderListEditor(
            'Delivery Terms',
            estimate.scope.deliveryTerms,
            newTerm,
            setNewTerm,
            'deliveryTerms'
          )}
        </div>

        <div className="border-t pt-4">
          <h4 className="font-semibold mb-2">Additional Comments</h4>
          <textarea
            value={comments}
            onChange={(e) => handleCommentsChange(e.target.value)}
            placeholder="Add any additional notes, special instructions, or comments..."
            rows={4}
            className="w-full px-3 py-2 border border-gray-300 rounded focus:outline-none focus:ring-1 focus:ring-brand-green"
          />
        </div>
      </div>
    </div>
  );
}
