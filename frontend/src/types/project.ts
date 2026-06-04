export type ProjectStatus = 'active' | 'pending' | 'archived' | 'approved';

export interface Project {
  id?: number;
  externalId?: string;
  title: string;
  abstract?: string;
  status?: ProjectStatus;
  sponsor?: string;
  year?: number;
  type?: string;
  themes?: string[];
  ods?: number[];
  currentStage?: number;
  source?: string;
}