export interface ShortenedLink {
  link: string;
  id?: string;
  long_url?: string;
  archived?: boolean;
  created_at?: string;
  custom_bitlinks?: string[];
  tags?: string[];
  references?: Record<string, string>;
}
