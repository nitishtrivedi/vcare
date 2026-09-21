import { Injectable } from '@angular/core';
import {
  Blog,
  BlogListResponse,
  BlogPayload,
  BlogResponse,
  GenericApiResponse,
} from '../models/blog.model';
import { AuthService } from './auth';

@Injectable({
  providedIn: 'root',
})
export class BlogService {
  private readonly apiBaseUrl: string;

  constructor(private readonly authService: AuthService) {
    this.apiBaseUrl = this.authService.apiUrl;
  }

  private async parseJson<T>(response: Response): Promise<T> {
    try {
      return (await response.json()) as T;
    } catch {
      throw new Error('Invalid response from server.');
    }
  }

  async getBlogs(): Promise<Blog[]> {
    const response = await fetch(`${this.apiBaseUrl}/blogs.php`, {
      method: 'GET',
      credentials: 'include',
      headers: {
        Accept: 'application/json',
      },
    });

    const result = await this.parseJson<BlogListResponse>(response);

    if (!response.ok || !result.success) {
      throw new Error(result.message ?? 'Unable to load blogs.');
    }

    return result.blogs ?? [];
  }

  async getBlogBySlug(slug: string): Promise<Blog | null> {
    const url = `${this.apiBaseUrl}/blogs.php?slug=` + encodeURIComponent(slug);

    const response = await fetch(url, {
      method: 'GET',
      credentials: 'include',
      headers: {
        Accept: 'application/json',
      },
    });

    const result = await this.parseJson<BlogResponse>(response);

    if (!response.ok || !result.success) {
      return null;
    }

    return result.blog ?? null;
  }

  async getBlogById(id: number): Promise<Blog | null> {
    const url = `${this.apiBaseUrl}/blogs.php?id=` + encodeURIComponent(id);

    const response = await fetch(url, {
      method: 'GET',
      credentials: 'include',
      headers: {
        Accept: 'application/json',
      },
    });

    const result = await this.parseJson<BlogResponse>(response);

    if (!response.ok || !result.success) {
      return null;
    }

    return result.blog ?? null;
  }

  async createBlog(payload: BlogPayload): Promise<Blog> {
    const response = await fetch(`${this.apiBaseUrl}/blogs.php`, {
      method: 'POST',
      credentials: 'include',
      headers: {
        Accept: 'application/json',
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(payload),
    });

    const result = await this.parseJson<BlogResponse>(response);

    if (!response.ok || !result.success || !result.blog) {
      throw new Error(result.message ?? 'Unable to create blog.');
    }

    return result.blog;
  }

  async updateBlog(id: number, payload: BlogPayload): Promise<Blog> {
    const response = await fetch(`${this.apiBaseUrl}/blogs.php`, {
      method: 'PUT',
      credentials: 'include',
      headers: {
        Accept: 'application/json',
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        id,
        ...payload,
      }),
    });

    const result = await this.parseJson<BlogResponse>(response);

    if (!response.ok || !result.success || !result.blog) {
      throw new Error(result.message ?? 'Unable to update blog.');
    }

    return result.blog;
  }

  async deleteBlog(id: number): Promise<void> {
    const url = `${this.apiBaseUrl}/blogs.php?id=` + encodeURIComponent(id);

    const response = await fetch(url, {
      method: 'DELETE',
      credentials: 'include',
      headers: {
        Accept: 'application/json',
      },
    });

    const result = await this.parseJson<GenericApiResponse>(response);

    if (!response.ok || !result.success) {
      throw new Error(result.message ?? 'Unable to delete blog.');
    }
  }

  // async uploadImage(file: File): Promise<string> {
  //   const formData = new FormData();

  //   formData.append('image', file);

  //   const response = await fetch(`${this.apiBaseUrl}/blog-upload.php`, {
  //     method: 'POST',
  //     credentials: 'include',
  //     headers: {
  //       Accept: 'application/json',
  //     },
  //     body: formData,
  //   });

  //   const result = await this.parseJson<{
  //     success: boolean;
  //     url?: string;
  //     message?: string;
  //   }>(response);

  //   if (!response.ok || !result.success || !result.url) {
  //     throw new Error(result.message ?? 'Unable to upload image.');
  //   }

  //   return result.url;
  // }

  async uploadImage(file: File): Promise<string> {
    const formData = new FormData();
    formData.append('image', file);

    const response = await fetch(`${this.apiBaseUrl}/blog-upload.php`, {
      method: 'POST',
      credentials: 'include',
      headers: { Accept: 'application/json' },
      body: formData,
    });

    const result = await this.parseJson<{
      success: boolean;
      message?: string;
      image?: {
        url: string;
        filename: string;
        mime_type: string;
        width: number;
        height: number;
        size: number;
      };
    }>(response);

    if (!response.ok || !result.success || !result.image?.url) {
      throw new Error(result.message ?? 'Unable to upload image.');
    }

    return result.image.url;
  }

  /**
   * Stored image paths (e.g. from blog-upload.php) are relative to the
   * PHP server's document root ("assets/images/blog/xxx.jpg"). In production
   * the Angular app and API share an origin, so the relative path just works.
   * On localhost, the API lives on a different origin (dev.vcarepreschool.in),
   * so relative paths need that origin prefixed or the image 404s.
   */
  resolveImageUrl(path: string | null | undefined): string | null {
    if (!path) {
      return null;
    }

    if (/^https?:\/\//i.test(path)) {
      return path;
    }

    if (this.apiBaseUrl.startsWith('http')) {
      const origin = this.apiBaseUrl.replace(/\/api\/?$/, '');
      return `${origin}/${path.replace(/^\//, '')}`;
    }

    return path;
  }
}
