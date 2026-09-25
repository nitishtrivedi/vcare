import { Component, HostListener, signal } from '@angular/core';
import { RouterLink } from '@angular/router';

interface NavChild {
  label: string;
  route: string;
}

interface NavLink {
  label: string;
  route?: string;
  fragment?: string;
  children?: NavChild[];
}

@Component({
  selector: 'app-navbar',
  imports: [RouterLink],
  templateUrl: './navbar.html',
  styleUrl: './navbar.scss',
})
export class Navbar {
  readonly isMenuOpen = signal(false);
  readonly isScrolled = signal(false);

  /** Which top-level item's dropdown is open (desktop click/keyboard + mobile accordion) */
  readonly openDropdown = signal<string | null>(null);

  // NOTE: 'Preschool' is a single unified page for now (Playgroup/Nursery/Jr KG/
  // Sr KG all live on one page). Split back into a dropdown with individual
  // routes later if the client wants separate pages per class.
  readonly links: NavLink[] = [
    { label: 'Home', route: '/' },
    {
      label: 'Programs',
      children: [
        { label: 'Preschool', route: '/programs/preschool-program' },
        { label: 'After School', route: '/programs/after-school-program' },
        { label: 'Parent Toddler', route: '/programs/parent-toddler-program' },
        { label: 'Daycare', route: '/programs/daycare-program' },
      ],
    },
    { label: 'Zero Fees Model', route: '/about/zero-fee-model' },

    { label: 'Franchise', route: '/franchise' },
    {
      label: 'About V Care',
      children: [
        { label: 'About Us', route: '/about-us' },
        // { label: 'Our Team', route: '/about/team' },
        // { label: 'Achievements', route: '/about/achievements' },
        // { label: 'Teaching Methodology', route: '/about/methodology' },
        { label: 'Blog', route: '/blog' },
        { label: 'FAQ', route: '/about/faq' },
      ],
    },
    { label: 'Gallery', route: '/gallery' },
    { label: 'Contact', route: '/contact' },
  ];

  toggleMenu(): void {
    this.isMenuOpen.update((open) => !open);
    if (!this.isMenuOpen()) {
      this.openDropdown.set(null);
    }
  }

  closeMenu(): void {
    this.isMenuOpen.set(false);
    this.openDropdown.set(null);
  }

  /** Used for both desktop click-toggle and mobile accordion */
  toggleDropdown(label: string): void {
    this.openDropdown.update((current) => (current === label ? null : label));
  }

  openDropdownOnHover(label: string): void {
    this.openDropdown.set(label);
  }

  closeDropdownOnLeave(): void {
    this.openDropdown.set(null);
  }

  @HostListener('window:scroll')
  onScroll(): void {
    this.isScrolled.set(window.scrollY > 12);
  }

  @HostListener('document:keydown.escape')
  onEscape(): void {
    this.openDropdown.set(null);
  }
}
