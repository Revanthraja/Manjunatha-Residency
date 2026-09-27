// Stroke-icon path data, ported 1:1 from the design canvas mockups so the
// app renders the same glyphs (viewBox 0 0 24 24, stroke-based).

export type IconName =
  | 'home'
  | 'units'
  | 'bill'
  | 'wrench'
  | 'more'
  | 'user'
  | 'phone'
  | 'right'
  | 'left'
  | 'plus'
  | 'camera'
  | 'bolt'
  | 'share'
  | 'copy'
  | 'down'
  | 'doc'
  | 'signOut';

// Each entry is a list of path `d` strings, OR a shape descriptor for
// non-path primitives (circle/rect) used by a couple of icons.
export type IconPrimitive =
  | { kind: 'path'; d: string }
  | { kind: 'circle'; cx: number; cy: number; r: number }
  | { kind: 'rect'; x: number; y: number; width: number; height: number; rx?: number };

export const ICONS: Record<IconName, IconPrimitive[]> = {
  home: [{ kind: 'path', d: 'M3 10.5 12 3l9 7.5V21h-6v-6H9v6H3z' }],
  units: [
    { kind: 'rect', x: 4, y: 3, width: 16, height: 18, rx: 1.5 },
    { kind: 'path', d: 'M9 7h1M14 7h1M9 11h1M14 11h1M9 15h1M14 15h1' },
  ],
  bill: [
    { kind: 'path', d: 'M6 3h12v18l-3-2-3 2-3-2-3 2z' },
    { kind: 'path', d: 'M9 8h6M9 12h6' },
  ],
  wrench: [{ kind: 'path', d: 'M14.7 6.3a4 4 0 0 0-5.4 5.4L4 17l3 3 5.3-5.3a4 4 0 0 0 5.4-5.4l-2.5 2.5-2.5-.5-.5-2.5z' }],
  more: [
    { kind: 'circle', cx: 5, cy: 12, r: 1.2 },
    { kind: 'circle', cx: 12, cy: 12, r: 1.2 },
    { kind: 'circle', cx: 19, cy: 12, r: 1.2 },
  ],
  user: [
    { kind: 'circle', cx: 12, cy: 8, r: 4 },
    { kind: 'path', d: 'M4 21c1.5-4 4.5-6 8-6s6.5 2 8 6' },
  ],
  phone: [{ kind: 'path', d: 'M5 4h4l2 5-2.5 1.5a11 11 0 0 0 5 5L15 13l5 2v4a2 2 0 0 1-2 2A16 16 0 0 1 3 6a2 2 0 0 1 2-2' }],
  right: [{ kind: 'path', d: 'm9 6 6 6-6 6' }],
  left: [{ kind: 'path', d: 'M15 18l-6-6 6-6' }],
  plus: [{ kind: 'path', d: 'M12 5v14M5 12h14' }],
  camera: [
    { kind: 'path', d: 'M4 8h3l2-3h6l2 3h3v11H4z' },
    { kind: 'circle', cx: 12, cy: 13, r: 3.5 },
  ],
  bolt: [{ kind: 'path', d: 'M13 3 5 14h6l-1 7 8-11h-6z' }],
  share: [{ kind: 'path', d: 'M12 3v12M7 8l5-5 5 5M5 14v6h14v-6' }],
  copy: [
    { kind: 'rect', x: 8, y: 8, width: 12, height: 12, rx: 2 },
    { kind: 'path', d: 'M16 8V5a1 1 0 0 0-1-1H5a1 1 0 0 0-1 1v10a1 1 0 0 0 1 1h3' },
  ],
  down: [{ kind: 'path', d: 'm6 9 6 6 6-6' }],
  doc: [
    { kind: 'path', d: 'M7 3h7l4 4v14H7z' },
    { kind: 'path', d: 'M14 3v4h4' },
  ],
  signOut: [
    { kind: 'path', d: 'M15 4h3a2 2 0 0 1 2 2v12a2 2 0 0 1-2 2h-3M10 16l5-4-5-4M15 12H3' },
  ],
};
