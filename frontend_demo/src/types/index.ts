// Enterprise types
export interface Enterprise {
  id: number;
  name: string;
  unifiedCode: string;
  legalRep: string;
  registeredCapital: number;
  registrationDate: string; // ISO date string
  businessStatus: string;
  industryType: string;
  subIndustry: string;
  region: string;
  city: string;
  employeeCount: number;
  annualRevenue: number;
  website: string;
  contactPerson: string;
  contactPhone: string;
  contactEmail: string;
  remarks: string;
  dynamicAttributes: Record<string, any>; // Flexible attributes
  createdAt: string; // ISO date string
  updatedAt: string; // ISO date string
  financings: Financing[];
  aiApplications: AiApplication[];
  baiduAiUsage: BaiduAiUsage | null;
  operationalTags: OperationalTag[];
}

export interface Financing {
  id: number;
  enterpriseId: number;
  round: string;
  amountRaised: number;
  currency: string;
  financingDate: string; // ISO date string
  investorNames: string;
  valuationAfter: number;
}

export interface AiApplication {
  id: number;
  enterpriseId: number;
  aiScenario: string;
  aiApplicationDesc: string;
  implementationStage: 'pilot' | 'production' | 'scaled';
  deploymentDate: string; // ISO date string
  estimatedRoi: number;
  challengesEncountered: string;
}

export interface BaiduAiUsage {
  id: number;
  enterpriseId: number;
  baiduAiProductsUsed: string[];
  usageLevel: 'none' | 'evaluating' | 'production' | 'extensive';
  adoptionDate: string; // ISO date string
  primaryUseCase: string;
  satisfactionRating: number;
  notes: string;
}

export interface OperationalTag {
  id: number;
  enterpriseId: number;
  tagName: string;
  assignedBy: string;
  assignedDate: string; // ISO date string
}

// Task types
export interface Task {
  id: number;
  title: string;
  description: string;
  enterpriseId: number;
  assignedTo: string;
  priority: 'low' | 'medium' | 'high';
  status: 'todo' | 'in-progress' | 'done';
  dueDate: string; // ISO date string
  createdAt: string; // ISO date string
  updatedAt: string; // ISO date string
}

// Import/Export types
export interface ImportJob {
  id: number;
  fileName: string;
  status: 'processing' | 'completed' | 'failed';
  totalRows: number;
  processedRows: number;
  successRows: number;
  errorRows: number;
  errorMessage?: string;
  createdAt: string; // ISO date string
  completedAt?: string; // ISO date string
}

// Filter types
export interface EnterpriseFilter {
  search?: string;
  industryType?: string;
  region?: string;
  city?: string;
  employeeRange?: [number, number];
  revenueRange?: [number, number];
  fundingStage?: string;
  aiUsage?: string;
  dateRange?: [string, string]; // [startDate, endDate]
}

// Chart/Analytics types
export interface ChartDataItem {
  name: string;
  value: number;
}