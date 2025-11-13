import type { LineItem, Allocation } from '../types/estimate';

export function calculateLineItemTotal(item: LineItem): number {
  return item.quantity * item.unitCost;
}

export function calculateCategorySubtotal(items: LineItem[], category: string): number {
  return items
    .filter(item => item.category === category)
    .reduce((sum, item) => sum + item.total, 0);
}

export function calculateGrandTotal(items: LineItem[]): number {
  return items.reduce((sum, item) => sum + item.total, 0);
}

export function calculateAllocationTotal(allocations: Allocation[]): number {
  return allocations.reduce((sum, alloc) => sum + alloc.total, 0);
}

export function getUnallocatedQuantity(
  lineItemQuantity: number,
  allocations: Allocation[]
): number {
  const allocated = allocations.reduce((sum, alloc) => sum + alloc.quantity, 0);
  return lineItemQuantity - allocated;
}
