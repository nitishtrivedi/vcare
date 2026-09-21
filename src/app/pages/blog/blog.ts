import { Component, OnInit, signal } from '@angular/core';
import { RouterLink } from '@angular/router';
import type { Blog as BlogItem } from '../../models/blog.model';
import { ScrollReveal } from '../../directives/scroll-reveal';
import { BlogService } from '../../services/blog';

@Component({
  selector: 'app-blog',
  imports: [RouterLink, ScrollReveal],
  templateUrl: './blog.html',
  styleUrl: './blog.scss',
})
export class Blog implements OnInit {
  readonly blogs = signal<BlogItem[]>([]);

  readonly isLoading = signal(true);

  readonly errorMessage = signal('');

  constructor(private readonly blogService: BlogService) {}

  resolveImageUrl(path: string | null): string | null {
    return this.blogService.resolveImageUrl(path);
  }

  async ngOnInit(): Promise<void> {
    await this.loadBlogs();
  }

  async loadBlogs(): Promise<void> {
    this.isLoading.set(true);
    this.errorMessage.set('');

    try {
      const blogs = await this.blogService.getBlogs();

      this.blogs.set(blogs);
    } catch (error) {
      this.errorMessage.set(error instanceof Error ? error.message : 'Unable to load the blog.');
    } finally {
      this.isLoading.set(false);
    }
  }

  formatDate(value: string): string {
    const date = new Date(value);

    if (Number.isNaN(date.getTime())) {
      return value;
    }

    return new Intl.DateTimeFormat('en-IN', {
      day: 'numeric',
      month: 'long',
      year: 'numeric',
    }).format(date);
  }

  getExcerpt(content: string): string {
    const text = content
      .replace(/<[^>]*>/g, ' ')
      .replace(/\s+/g, ' ')
      .trim();

    if (text.length <= 180) {
      return text;
    }

    return text.slice(0, 180).trim() + '…';
  }
}
