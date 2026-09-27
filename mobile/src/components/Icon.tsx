import React from 'react';
import Svg, { Circle, Path, Rect } from 'react-native-svg';
import { ICONS, IconName } from '@/src/constants/icons';

type Props = {
  name: IconName;
  size?: number;
  color?: string;
  strokeWidth?: number;
};

/** Stroke icon, ported from the design canvas — no icon-font, no emoji. */
export function Icon({ name, size = 22, color = '#1F1D1A', strokeWidth = 1.8 }: Props) {
  const primitives = ICONS[name];
  return (
    <Svg width={size} height={size} viewBox="0 0 24 24" fill="none">
      {primitives.map((p, i) => {
        if (p.kind === 'path') {
          return (
            <Path
              key={i}
              d={p.d}
              stroke={color}
              strokeWidth={strokeWidth}
              strokeLinecap="round"
              strokeLinejoin="round"
            />
          );
        }
        if (p.kind === 'circle') {
          return <Circle key={i} cx={p.cx} cy={p.cy} r={p.r} stroke={color} strokeWidth={strokeWidth} />;
        }
        return (
          <Rect
            key={i}
            x={p.x}
            y={p.y}
            width={p.width}
            height={p.height}
            rx={p.rx ?? 0}
            stroke={color}
            strokeWidth={strokeWidth}
          />
        );
      })}
    </Svg>
  );
}
