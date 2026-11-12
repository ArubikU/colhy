export interface TeamMember {
  name: string;
  role: string;
}

export interface Quote {
  id: string;
  consultant_id: string;
  user_id?: string;
  description: string;
  price_per_hour: number;
  technologies: string[];
  team_members: TeamMember[];
  extra_details?: string;
  min_hours?: number;
  quote_content?: string;
  status: 'draft' | 'pending' | 'sent' | 'accepted' | 'rejected';
  created_at: string;
  updated_at: string;
  attachments?: string[];
}

export interface UserProfile {
  id: string;
  email: string;
  role: 'consultant' | 'client';
  created_at: string;
  updated_at: string;
}
