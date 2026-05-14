export type Src = string;

export interface Source {
  src: string;
  type: string;
  media: string;
}
export type Sources = Source[];

export type SrcObject = MediaSource | null;

export interface Track {
  kind: string;
  label: string;
  srclang: string;
  src: string;
  default: boolean;
  id: string;
}
export type Tracks = Track[];

export type PlaysInline = boolean;
