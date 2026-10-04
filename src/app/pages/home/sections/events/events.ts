import { Component, OnInit, signal } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { CommonModule } from '@angular/common';
import { ScrollReveal } from '../../../../directives/scroll-reveal';

interface EventImage {
  src: string;
  alt: string;
  caption: string;
}

interface Album {
  id: string;
  title: string;
  description: string;
  date: string;
  category: string;
  thumbnail: string;
  images: EventImage[];
}

interface Category {
  id: string;
  name: string;
  icon: string;
}

interface EventManifest {
  albums: Album[];
  categories: Category[];
}

@Component({
  selector: 'app-events',
  imports: [CommonModule, ScrollReveal],
  templateUrl: './events.html',
  styleUrl: './events.scss',
})
export class Events implements OnInit {
  albums = signal<Album[]>([]);
  categories = signal<Category[]>([]);
  selectedCategory = signal<string>('all');
  filteredAlbums = signal<Album[]>([]);
  selectedAlbum = signal<Album | null>(null);
  selectedImageIndex = signal<number>(0);
  isLightboxOpen = signal<boolean>(false);

  constructor(private http: HttpClient) {}

  ngOnInit() {
    this.loadManifest();
  }

  loadManifest() {
    this.http.get<EventManifest>('/assets/images/events/manifest.json').subscribe({
      next: (data) => {
        // Sort albums by date (newest first)
        const sortedAlbums = [...data.albums].sort(
          (a, b) => new Date(b.date).getTime() - new Date(a.date).getTime()
        );
        this.albums.set(sortedAlbums);
        this.categories.set(data.categories);
        this.filteredAlbums.set(sortedAlbums);
      },
      error: (err) => {
        console.error('Failed to load events manifest:', err);
      },
    });
  }

  filterByCategory(categoryId: string) {
    this.selectedCategory.set(categoryId);
    if (categoryId === 'all') {
      this.filteredAlbums.set(this.albums());
    } else {
      this.filteredAlbums.set(this.albums().filter((album) => album.category === categoryId));
    }
  }

  openAlbum(album: Album) {
    this.selectedAlbum.set(album);
    this.selectedImageIndex.set(0);
    this.isLightboxOpen.set(true);
    document.body.classList.add('lightbox-open');
  }

  closeLightbox() {
    this.isLightboxOpen.set(false);
    this.selectedAlbum.set(null);
    document.body.classList.remove('lightbox-open');
  }

  nextImage() {
    const album = this.selectedAlbum();
    if (!album) return;
    const currentIndex = this.selectedImageIndex();
    if (currentIndex < album.images.length - 1) {
      this.selectedImageIndex.set(currentIndex + 1);
    }
  }

  prevImage() {
    const currentIndex = this.selectedImageIndex();
    if (currentIndex > 0) {
      this.selectedImageIndex.set(currentIndex - 1);
    }
  }

  formatDate(dateString: string): string {
    const date = new Date(dateString);
    return date.toLocaleDateString('en-US', { year: 'numeric', month: 'long', day: 'numeric' });
  }
}
