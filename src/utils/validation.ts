import type { Estimate } from '../types/estimate';

export interface ValidationError {
  field: string;
  message: string;
}

export function validateEstimate(estimate: Partial<Estimate>): ValidationError[] {
  const errors: ValidationError[] = [];

  if (!estimate.projectName?.trim()) {
    errors.push({ field: 'projectName', message: 'Project name is required' });
  }

  if (!estimate.client?.trim()) {
    errors.push({ field: 'client', message: 'Client is required' });
  }

  if (!estimate.address?.trim()) {
    errors.push({ field: 'address', message: 'Address is required' });
  }

  if (!estimate.bidDate) {
    errors.push({ field: 'bidDate', message: 'Bid date is required' });
  }

  if (!estimate.projectType) {
    errors.push({ field: 'projectType', message: 'Project type is required' });
  }

  if (estimate.buildings && estimate.buildings < 1) {
    errors.push({ field: 'buildings', message: 'Buildings must be at least 1' });
  }

  if (estimate.units && estimate.units < 1) {
    errors.push({ field: 'units', message: 'Units must be at least 1' });
  }

  return errors;
}

export function isEstimateComplete(estimate: Partial<Estimate>): boolean {
  const errors = validateEstimate(estimate);
  return errors.length === 0 && 
         (estimate.lineItems?.length || 0) > 0 &&
         (calculateGrandTotal(estimate.lineItems || [])) > 0;
}

function calculateGrandTotal(items: any[]): number {
  return items.reduce((sum, item) => sum + item.total, 0);
}
