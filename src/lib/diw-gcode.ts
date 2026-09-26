import type { DiwPrinterProfile, Direction, Magnetization2D, Point } from '../types/platform';

export interface PathSegment { start: Point; end: Point; strength: number; direction: Direction }

export function buildSegments(doc: { widthMm: number; heightMm: number }, grid: Magnetization2D, profile: DiwPrinterProfile): PathSegment[] {
  const segments: PathSegment[] = [];
  const cellW = doc.widthMm / grid.columns;
  const cellH = doc.heightMm / grid.rows;
  const angle = (profile.pathAngleDeg * Math.PI) / 180;
  const dx = Math.cos(angle);
  const dy = Math.sin(angle);
  for (let y = 0; y < grid.rows; y += 1) {
    const active = Array.from({ length: grid.columns }, (_, x) => grid.cells[`${x}:${y}`]).map((cell, x) => ({ cell, x })).filter(({ cell }) => cell);
    for (const { cell, x } of active) {
      const minX = x * cellW;
      const maxX = (x + 1) * cellW;
      const minY = y * cellH;
      const maxY = (y + 1) * cellH;
      const cx = (minX + maxX) / 2;
      const cy = (minY + maxY) / 2;
      const halfLength = Math.min((cellW / 2) / Math.max(Math.abs(dx), 0.001), (cellH / 2) / Math.max(Math.abs(dy), 0.001));
      const length = Number.isFinite(halfLength) ? halfLength : Math.max(cellW, cellH);
      const start = { x: Math.max(minX, Math.min(maxX, cx - dx * length)), y: Math.max(minY, Math.min(maxY, cy - dy * length)) };
      const end = { x: Math.max(minX, Math.min(maxX, cx + dx * length)), y: Math.max(minY, Math.min(maxY, cy + dy * length)) };
      if (Math.hypot(end.x - start.x, end.y - start.y) >= Math.min(profile.lineWidthMm, cellW, cellH)) segments.push({ start, end, strength: cell.strength, direction: cell.direction });
    }
  }
  return segments;
}

function fmt(value: number) { return value.toFixed(3); }

export function generateGcode(segments: PathSegment[], profile: DiwPrinterProfile): string {
  const lines = ['; 4D-DRAWING DIW v0.1', `; BED ${profile.bedWidthMm}x${profile.bedHeightMm}mm NOZZLE ${profile.nozzleDiameterMm}mm`, 'G21', 'G90', 'M82', `G1 Z${fmt(profile.layerHeightMm)} F300`, 'MAG_OFF'];
  let current: { strength: number; direction: Direction } | undefined;
  let e = 0;
  for (const segment of segments) {
    if (!current || current.strength !== segment.strength || current.direction !== segment.direction) {
      if (current) lines.push('MAG_OFF');
      lines.push(`MAG_ON S=${Math.round(segment.strength)} DIR=${segment.direction}`);
      current = { strength: segment.strength, direction: segment.direction };
    }
    lines.push(`G0 X${fmt(segment.start.x)} Y${fmt(segment.start.y)} F${profile.speedMmMin}`);
    const distance = Math.hypot(segment.end.x - segment.start.x, segment.end.y - segment.start.y);
    if (profile.emitExtrusion) { e += distance * profile.extrusionPerMm; lines.push(`G1 X${fmt(segment.end.x)} Y${fmt(segment.end.y)} E${fmt(e)} F${profile.speedMmMin}`); }
    else lines.push(`G1 X${fmt(segment.end.x)} Y${fmt(segment.end.y)} F${profile.speedMmMin}`);
  }
  lines.push('MAG_OFF', 'G0 Z5 F300', 'M84');
  return `${lines.join('\n')}\n`;
}
