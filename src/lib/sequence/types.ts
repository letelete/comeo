export type TransitionType = 'instant' | 'typewriter';

export interface Transition {
  in?: TransitionType;
  out?: TransitionType;
}

export type ActionBlock =
  | string
  | {
      content: string;
      transition?: Transition;
    };

export interface Action {
  line: string;
  transition?: Transition;
  blocks: ActionBlock[];
}

export type Scene = Action[];

export type Script = Scene[];

export interface FrameBlockToken {
  key: string;
  value: string;
}

export interface FrameBlock {
  key: string;
  order: number;
  transition?: Transition;
  tokens: FrameBlockToken[];
}

export interface Frame {
  key: string;
  line: string;
  blocks: FrameBlock[];
  prev: string | null;
  next: string | null;
}

export interface Sequence {
  key: string;
  frames: Frame[];
}
