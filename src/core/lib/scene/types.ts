import { Change as DChange } from 'diff';

export interface Change extends DChange {
  unchanged: boolean;
}

export interface IdentifiableChange extends Change {
  key: string;
}

export interface Diff {
  value: string;
  changes: IdentifiableChange[];
}

export interface Transition {
  initial: Diff;
  animate: Diff;
}

export interface Frame {
  key: string;
  index: number;
  line: string;
  prev: string | null;
  next: string | null;
  transition: Transition;
}
