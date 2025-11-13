export interface VoiceParsedItem {
  description: string;
  quantity: number;
  unitCost: number;
  confidence: number;
  needsReview: boolean;
}

export interface VoiceParsedProjectDetails {
  projectName?: string;
  client?: string;
  address?: string;
  projectType?: 'Multi-Family' | 'Townhome' | 'Commercial TI';
  buildings?: number;
  units?: number;
  bidDate?: string;
}

export interface VoiceParsedScope {
  inclusions?: string[];
  exclusions?: string[];
  deliveryTerms?: string[];
  comments?: string;
}

export interface VoiceParseResult {
  type: 'lineItems' | 'projectDetails' | 'scope' | 'mixed';
  items?: VoiceParsedItem[];
  projectDetails?: VoiceParsedProjectDetails;
  scope?: VoiceParsedScope;
  success: boolean;
  error?: string;
}
