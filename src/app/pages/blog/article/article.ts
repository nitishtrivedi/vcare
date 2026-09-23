import { Component, OnInit, signal } from '@angular/core';
import { ActivatedRoute, RouterLink } from '@angular/router';
import type { Blog as BlogItem } from '../../../models/blog.model';
import { ScrollReveal } from '../../../directives/scroll-reveal';
import { BlogService } from '../../../services/blog';
import { Seo } from '../../../services/seo';

@Component({
  selector: 'app-article',
  imports: [RouterLink, ScrollReveal],
  templateUrl: './article.html',
  styleUrl: './article.scss',
})
export class Article implements OnInit {
  readonly blog = signal<BlogItem | null>(null);

  readonly isLoading = signal(true);

  readonly errorMessage = signal('');

  constructor(
    private readonly route: ActivatedRoute,
    private readonly blogService: BlogService,
    private readonly seoService: Seo,
  ) {}

  resolveImageUrl(path: string | null): string | null {
    return this.blogService.resolveImageUrl(path);
  }

  private updateArticleSeo(post: BlogItem): void {
    const url = `https://vcarepreschool.in/blog/${post.slug}`;

    const description = post.content
      .replace(/<[^>]*>/g, ' ')
      .replace(/\s+/g, ' ')
      .trim()
      .slice(0, 155);

    const image = post.featured_image
      ? this.blogService.resolveImageUrl(post.featured_image)
      : null;

    this.seoService.update({
      title: `${post.title} | V Care Journal`,
      description,
      canonical: url,
      image: image ?? undefined,
      robots: 'index,follow',
    });
  }
  async ngOnInit(): Promise<void> {
    const slug = this.route.snapshot.paramMap.get('slug');

    if (!slug) {
      this.errorMessage.set('Article not found.');

      this.isLoading.set(false);

      return;
    }

    try {
      const blog = await this.blogService.getBlogBySlug(slug);

      if (!blog) {
        this.errorMessage.set('Article not found.');

        return;
      }

      this.blog.set(blog);
      this.updateArticleSeo(blog);
    } catch (error) {
      this.errorMessage.set(
        error instanceof Error ? error.message : 'Unable to load this article.',
      );
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
}
