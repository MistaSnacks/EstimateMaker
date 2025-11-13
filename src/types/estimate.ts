export type ProjectType = 'Multi-Family' | 'Townhome' | 'Commercial TI';
export type EstimateStatus = 'draft' | 'sent' | 'archived';

export interface LineItem {
  id: string;
  category: string;
  description: string;
  quantity: number;
  unitCost: number;
  total: number; // auto-calculated
}

export interface Allocation {
  id: string;
  lineItemId: string;
  allocatedTo: string; // e.g., "Building 1", "Exterior", "Common Areas"
  quantity: number;
  total: number;
}

export interface ScopeDetails {
  inclusions: string[];
  exclusions: string[];
  deliveryTerms: string[];
  comments: string;
}

export interface Estimate {
  id: string;
  projectName: string;
  address: string;
  client: string;
  bidDate: string;
  projectType: ProjectType;
  buildings: number;
  units: number;
  lineItems: LineItem[];
  allocations: Allocation[];
  scope: ScopeDetails;
  status: EstimateStatus;
  createdAt: string;
  updatedAt: string;
}
