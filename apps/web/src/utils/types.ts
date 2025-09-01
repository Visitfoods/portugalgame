export type Vec2 = { x: number; y: number };

export type GameState = 'idle' | 'running' | 'finished';

export type ItemKind = 'good' | 'bad';

export interface SpawnedItem {
  id: number;
  kind: ItemKind;
  pos: Vec2; // in px (canvas coords)
  vel: Vec2; // px/s
  radius: number; // px
}

export interface MouthEllipse {
  cx: number; // px
  cy: number; // px
  rx: number; // px (horizontal radius)
  ry: number; // px (vertical radius)
}
