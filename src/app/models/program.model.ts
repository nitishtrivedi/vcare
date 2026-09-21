export interface LearningChip {
  label: string;
}

export interface DetailRow {
  icon: 'duration' | 'routine' | 'safety';
  accent: string;
  title: string;
  description: string;
}

export interface TimingBlock {
  label: string;
  timing: string;
  duration: string;
  days: string;
  meals: string;
}

export interface ProgramClass {
  name: string;
  color: string;
  eligibility: string;
  aims: string[];
  // half: TimingBlock;
  // full: TimingBlock;
  schedules: ProgramSchedule[];
}

export interface ProgramSchedule {
  label: string;
  timing: string;
  duration: string;
  days: string;
  meals: string;
}

// AFTER SCHOOL
export interface LearningChip {
  label: string;
}

export interface DetailRow {
  icon: 'duration' | 'routine' | 'safety';
  accent: string;
  title: string;
  description: string;
}

export interface TimingBlock {
  label: string;
  timing: string;
  duration: string;
  days: string;
  meals: string;
}

export interface ProgramClass {
  name: string;
  color: string;
  eligibility: string;
  aims: string[];
  half: TimingBlock;
  full: TimingBlock;
}

// ⬇ NEW — for After School Program page
export interface AimCard {
  title: string;
  accent: string;
  description: string;
}

export interface FactItem {
  icon: 'age' | 'timing' | 'days' | 'duration';
  label: string;
  value: string;
}

export interface HighlightItem {
  title: string;
  subtitle: string;
  accent: string;
  icon: 'move' | 'art' | 'logic' | 'life' | 'meal';
}

export interface PricingTier {
  hours: string;
  monthly: string;
}

//Parent Toddler Program
// ⬇ NEW — for Parent Toddler Program page
export interface BenefitCircle {
  text: string;
  accent: string;
}

export interface WhyPoint {
  title: string;
  tint: string;
  ring: string;
}

// ⬇ NEW — for Daycare Program page
export interface HighlightCircle {
  text: string;
  accent: string;
}

export type ScheduleIcon =
  | 'play'
  | 'blocks'
  | 'meal'
  | 'circle'
  | 'art'
  | 'group'
  | 'book'
  | 'rest'
  | 'milk'
  | 'table'
  | 'snack'
  | 'freshen'
  | 'reflect'
  | 'fruit';

export interface ScheduleBlock {
  time: string;
  label: string;
  icon: ScheduleIcon;
  accent: string;
}
