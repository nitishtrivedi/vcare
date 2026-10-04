import { describe, it, expect } from 'vitest';
import { ComponentFixture, TestBed } from '@angular/core/testing';
import { Events } from './events';
import { provideHttpClient } from '@angular/common/http';
import { provideHttpClientTesting } from '@angular/common/http/testing';

describe('Events', () => {
  let component: Events;
  let fixture: ComponentFixture<Events>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [Events],
      providers: [provideHttpClient(), provideHttpClientTesting()],
    }).compileComponents();

    fixture = TestBed.createComponent(Events);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should initialize with default values', () => {
    expect(component.albums()).toEqual([]);
    expect(component.categories()).toEqual([]);
    expect(component.selectedCategory()).toBe('all');
    expect(component.isLightboxOpen()).toBe(false);
  });

  it('should filter albums by category', () => {
    const mockAlbums = [
      {
        id: '1',
        title: 'Test 1',
        description: 'Desc 1',
        date: '2024-01-01',
        category: 'celebrations',
        thumbnail: '/test1.jpg',
        images: [],
      },
      {
        id: '2',
        title: 'Test 2',
        description: 'Desc 2',
        date: '2024-02-01',
        category: 'sports',
        thumbnail: '/test2.jpg',
        images: [],
      },
    ];

    component.albums.set(mockAlbums);
    component.filterByCategory('celebrations');

    expect(component.filteredAlbums().length).toBe(1);
    expect(component.filteredAlbums()[0].category).toBe('celebrations');
  });

  it('should show all albums when filtering by "all"', () => {
    const mockAlbums = [
      {
        id: '1',
        title: 'Test 1',
        description: 'Desc 1',
        date: '2024-01-01',
        category: 'celebrations',
        thumbnail: '/test1.jpg',
        images: [],
      },
      {
        id: '2',
        title: 'Test 2',
        description: 'Desc 2',
        date: '2024-02-01',
        category: 'sports',
        thumbnail: '/test2.jpg',
        images: [],
      },
    ];

    component.albums.set(mockAlbums);
    component.filterByCategory('celebrations');
    component.filterByCategory('all');

    expect(component.filteredAlbums().length).toBe(2);
  });

  it('should open lightbox when album is selected', () => {
    const mockAlbum = {
      id: '1',
      title: 'Test Album',
      description: 'Test Description',
      date: '2024-01-01',
      category: 'celebrations',
      thumbnail: '/test.jpg',
      images: [
        { src: '/img1.jpg', alt: 'Image 1', caption: 'Caption 1' },
        { src: '/img2.jpg', alt: 'Image 2', caption: 'Caption 2' },
      ],
    };

    component.openAlbum(mockAlbum);

    expect(component.isLightboxOpen()).toBe(true);
    expect(component.selectedAlbum()).toEqual(mockAlbum);
    expect(component.selectedImageIndex()).toBe(0);
  });

  it('should close lightbox', () => {
    const mockAlbum = {
      id: '1',
      title: 'Test Album',
      description: 'Test Description',
      date: '2024-01-01',
      category: 'celebrations',
      thumbnail: '/test.jpg',
      images: [],
    };

    component.openAlbum(mockAlbum);
    component.closeLightbox();

    expect(component.isLightboxOpen()).toBe(false);
    expect(component.selectedAlbum()).toBeNull();
  });

  it('should navigate to next image', () => {
    const mockAlbum = {
      id: '1',
      title: 'Test Album',
      description: 'Test Description',
      date: '2024-01-01',
      category: 'celebrations',
      thumbnail: '/test.jpg',
      images: [
        { src: '/img1.jpg', alt: 'Image 1', caption: 'Caption 1' },
        { src: '/img2.jpg', alt: 'Image 2', caption: 'Caption 2' },
      ],
    };

    component.openAlbum(mockAlbum);
    component.nextImage();

    expect(component.selectedImageIndex()).toBe(1);
  });

  it('should navigate to previous image', () => {
    const mockAlbum = {
      id: '1',
      title: 'Test Album',
      description: 'Test Description',
      date: '2024-01-01',
      category: 'celebrations',
      thumbnail: '/test.jpg',
      images: [
        { src: '/img1.jpg', alt: 'Image 1', caption: 'Caption 1' },
        { src: '/img2.jpg', alt: 'Image 2', caption: 'Caption 2' },
      ],
    };

    component.openAlbum(mockAlbum);
    component.selectedImageIndex.set(1);
    component.prevImage();

    expect(component.selectedImageIndex()).toBe(0);
  });

  it('should format date correctly', () => {
    const formatted = component.formatDate('2024-03-15');
    expect(formatted).toContain('March');
    expect(formatted).toContain('15');
    expect(formatted).toContain('2024');
  });
});
