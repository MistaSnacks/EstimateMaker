import { useEstimate } from '../../contexts/EstimateContext';
import { FiCheck, FiAlertCircle, FiCheckCircle } from 'react-icons/fi';
import { calculateGrandTotal } from '../../utils/calculations';
import { validateEstimate } from '../../utils/validation';

export function ProgressPanel() {
  const { estimate } = useEstimate();

  if (!estimate) return null;

  const validationErrors = validateEstimate(estimate);
  const grandTotal = calculateGrandTotal(estimate.lineItems);

  const checks = [
    {
      id: 'project-details',
      label: 'Project details complete',
      completed: validationErrors.length === 0,
      details: validationErrors.length > 0 ? `${validationErrors.length} field(s) missing` : null,
    },
    {
      id: 'line-items',
      label: 'Line items added',
      completed: estimate.lineItems.length > 0,
      details: estimate.lineItems.length > 0 ? `${estimate.lineItems.length} item(s)` : 'No items yet',
    },
    {
      id: 'grand-total',
      label: 'Grand total > $0',
      completed: grandTotal > 0,
      details: `$${grandTotal.toFixed(2)}`,
    },
    {
      id: 'allocations',
      label: 'Allocations assigned',
      completed: estimate.allocations.length > 0 || estimate.lineItems.length === 0,
      details: estimate.allocations.length > 0 ? `${estimate.allocations.length} allocation(s)` : 'Optional',
    },
    {
      id: 'scope',
      label: 'Scope details filled',
      completed: estimate.scope.inclusions.length > 0 || estimate.scope.exclusions.length > 0 || estimate.scope.deliveryTerms.length > 0,
      details: estimate.scope.inclusions.length + estimate.scope.exclusions.length + estimate.scope.deliveryTerms.length > 0 
        ? `${estimate.scope.inclusions.length + estimate.scope.exclusions.length + estimate.scope.deliveryTerms.length} item(s)` 
        : 'Optional',
    },
  ];

  const completedCount = checks.filter(c => c.completed).length;
  const totalCount = checks.length;
  const isReady = completedCount === totalCount;

  return (
    <div className="bg-white p-6 rounded-lg shadow sticky top-6">
      <div className="flex items-center justify-between mb-4">
        <h3 className="text-lg font-semibold">Progress</h3>
        <div className="flex items-center gap-2">
          {isReady ? (
            <FiCheckCircle className="text-brand-green" size={20} />
          ) : (
            <span className="text-sm text-gray-600">{completedCount}/{totalCount}</span>
          )}
        </div>
      </div>

      {/* Progress Bar */}
      <div className="mb-4">
        <div className="w-full bg-gray-200 rounded-full h-2">
          <div 
            className="bg-brand-green h-2 rounded-full transition-all duration-300"
            style={{ width: `${(completedCount / totalCount) * 100}%` }}
          />
        </div>
      </div>

      {/* Checklist */}
      <div className="space-y-3">
        {checks.map(check => (
          <div key={check.id} className="flex items-start gap-3">
            <div className="flex-shrink-0 mt-0.5">
              {check.completed ? (
                <FiCheck className="text-brand-green" size={18} />
              ) : (
                <FiAlertCircle className="text-red-500" size={18} />
              )}
            </div>
            <div className="flex-1 min-w-0">
              <div className={`text-sm font-medium ${check.completed ? 'text-gray-700' : 'text-red-600'}`}>
                {check.label}
              </div>
              {check.details && (
                <div className="text-xs text-gray-500 mt-0.5">
                  {check.details}
                </div>
              )}
            </div>
          </div>
        ))}
      </div>

      {/* Ready Status */}
      {isReady ? (
        <div className="mt-4 p-3 bg-green-50 border border-green-200 rounded-lg">
          <p className="text-sm text-green-800 font-medium">
            ✓ Ready to generate PDF
          </p>
        </div>
      ) : (
        <div className="mt-4 p-3 bg-red-50 border border-red-200 rounded-lg">
          <p className="text-sm text-red-800 font-medium">
            Complete required items to generate PDF
          </p>
        </div>
      )}
    </div>
  );
}







