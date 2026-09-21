import { Component } from '@angular/core';
import { RouterLink } from '@angular/router';
import { WaveDivider } from '../wave-divider/wave-divider';

interface FooterLink {
  label: string;
  fragment: string;
}

interface ContactRow {
  icon: 'pin' | 'phone' | 'mail' | 'clock';
  lines: string[];
}

@Component({
  selector: 'app-footer',
  imports: [RouterLink, WaveDivider],
  templateUrl: './footer.html',
  styleUrl: './footer.scss',
})
export class Footer {
  readonly year = new Date().getFullYear();
  readonly tagline = 'A home away from home, for little learners.';
  readonly quickLinks: FooterLink[] = [
    { label: 'Home', fragment: 'home' },
    { label: 'Programs', fragment: 'programs' },
    { label: 'Why V Care', fragment: 'why-us' },
    { label: 'Parent Voices', fragment: 'voices' },
    { label: 'Contact', fragment: 'contact' },
  ];

  readonly contactRows: ContactRow[] = [
    {
      icon: 'pin',
      lines: [
        'Survey No 20/2+3, Jayshree Nivas,',
        'Shivshahi Colony, Canal Rd, Karvenagar,',
        'Pune, Maharashtra 411052',
      ],
    },
    { icon: 'phone', lines: ['+91 97650 76513'] },
    { icon: 'mail', lines: ['vcareeducationpune@gmail.com'] },
    { icon: 'clock', lines: ['Monday to Saturday: 9:00 AM – 6:00 PM'] },
  ];
}
