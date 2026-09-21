export interface Blog {
  id: number;
  title: string;
  slug: string;
  author_name: string;
  content: string;
  featured_image: string | null;
  created_at: string;
  updated_at: string;
}

export interface BlogPayload {
  title: string;
  author_name: string;
  content: string;
  featured_image: string | null;
}

export interface AuthUser {
  id: number;
  username: string;
  role: string;
}

export interface AuthResponse {
  success: boolean;
  authenticated?: boolean;
  user?: AuthUser;
  message?: string;
}

export interface BlogListResponse {
  success: boolean;
  blogs?: Blog[];
  message?: string;
}

export interface BlogResponse {
  success: boolean;
  blog?: Blog;
  message?: string;
}

export interface GenericApiResponse {
  success: boolean;
  message?: string;
}
