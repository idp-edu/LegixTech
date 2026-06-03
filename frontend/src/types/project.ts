export type ProjectStatus = 'active' | 'pending' | 'archived' | 'approved';

export interface Project {
  id: string;
  title: string;
  year: string;
  status: ProjectStatus;
  trending?: boolean;
  category: string;
  summary: string;
  impact: string[];
  affected: string[];
  sponsor: string;
  introduced: string;
}

export type UserType = 'google' | 'biometric' | 'guest' | null;
