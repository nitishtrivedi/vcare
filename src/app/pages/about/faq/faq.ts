import { Component, signal } from '@angular/core';
import { RouterLink } from '@angular/router';
import { ScrollReveal } from '../../../directives/scroll-reveal';

interface FaqItem {
  question: string;
  answer: string;
}

interface FaqCategory {
  title: string;
  accent: string;
  icon: 'general' | 'admissions' | 'zero-fee' | 'safety';
  items: FaqItem[];
}

@Component({
  selector: 'app-faq',
  imports: [RouterLink, ScrollReveal],
  templateUrl: './faq.html',
  styleUrl: './faq.scss',
})
export class Faq {
  readonly categories: FaqCategory[] = [
    {
      title: 'General & Curriculum',
      accent: '#EB2027',
      icon: 'general',
      items: [
        {
          question: 'What age groups does V Care welcome?',
          answer:
            'From 6 months to 8 years \u2014 spanning our Parent Toddler Program, Playgroup, Nursery, Junior KG, Senior KG and After School Program.',
        },
        {
          question: 'What teaching approach does V Care follow?',
          answer:
            'We blend the Finnish Educare Model, Reggio Emilia and Montessori practices with the Early Years Learning Framework, focusing on experiential, play-based learning rather than rote memorisation.',
        },
        {
          question: 'Where is V Care located?',
          answer: 'Our preschool and activity centre is in Karvenagar, Pune, Maharashtra.',
        },
        {
          question: 'What are your operating days?',
          answer:
            'We\u2019re open Monday to Saturday. The centre remains closed on the 2nd and last Saturday of every month.',
        },
      ],
    },
    {
      title: 'Admissions & Programs',
      accent: '#F69220',
      icon: 'admissions',
      items: [
        {
          question: 'What programs does V Care offer?',
          answer:
            'Parent Toddler Program (6 months\u20132 years), Playgroup, Nursery, Junior KG and Senior KG under our Preschool Program, the After School Program, and Daycare.',
        },
        {
          question: 'What is the adult-to-child ratio?',
          answer:
            'We maintain a 1:5 adult-to-child ratio in our Daycare, so every child gets adequate, personal attention.',
        },
        {
          question: 'How do I enrol my child?',
          answer:
            'Call us at +91 97650 76513 or send an enquiry through our contact form, and our admissions team will guide you through the visit and documentation.',
        },
        {
          question: 'Can I visit the campus before enrolling?',
          answer:
            'Absolutely \u2014 we encourage it. Book a time that works for you and we\u2019ll walk you through the classrooms and activities in person.',
        },
      ],
    },
    {
      title: 'Zero Fee Model',
      accent: '#3BB44A',
      icon: 'zero-fee',
      items: [
        {
          question: 'What exactly is the Zero Fee Model?',
          answer:
            'Instead of tuition fees, you place a one-time Refundable Education Deposit (RED) of \u20B92,00,000 at admission. Your child studies with zero monthly or annual fees for the entire journey, and the full deposit is returned at the end.',
        },
        {
          question: 'When do I get my deposit back?',
          answer:
            'On completion of Senior KG \u2014 after your child\u2019s full 4-year journey through Playgroup, Nursery, Junior KG and Senior KG.',
        },
        {
          question: 'What if we need to leave before the program ends?',
          answer:
            'A pro-rated settlement applies, with a transparent early-exit clause explained upfront in the deposit agreement.',
        },
        {
          question: 'Is this a fee or an investment product?',
          answer:
            'Neither \u2014 it\u2019s a pure, time-bound refundable deposit, legally documented, and never tied to school performance or profits.',
        },
      ],
    },
    {
      title: 'Daycare, Fees & Safety',
      accent: '#006FB9',
      icon: 'safety',
      items: [
        {
          question: 'What are the Daycare timings and charges?',
          answer:
            'Daycare covers children from 6 months to 8 years in flexible slots \u2014 from 2 hours (\u20B93,500/month) up to 10 hours (\u20B915,000/month), with a pay-per-day option also available for parents without registration.',
        },
        {
          question: 'What meals are provided during Daycare?',
          answer:
            'We follow mindful eating routines with breakfast, lunch and snacks, and coordinate directly with parents on any dietary needs.',
        },
        {
          question: 'How do you ensure child safety on campus?',
          answer:
            'Our premises are CCTV-monitored with hygienic, soft-flooring play areas, and every child is looked after by trained, caring educators throughout the day.',
        },
        {
          question: 'What is your late pickup and late payment policy?',
          answer:
            'Fees are due on or before the 5th of every month. Late payments and pickups beyond scheduled hours carry a small daily/hourly charge, shared with you clearly at admission.',
        },
      ],
    },
  ];

  private readonly openKeys = signal<Set<string>>(new Set());

  toggle(key: string): void {
    this.openKeys.update((current) => {
      const next = new Set(current);
      if (next.has(key)) {
        next.delete(key);
      } else {
        next.add(key);
      }
      return next;
    });
  }

  isOpen(key: string): boolean {
    return this.openKeys().has(key);
  }
}
