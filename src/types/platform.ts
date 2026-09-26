export type DrawMode = 'fill' | 'stroke';
export type Direction = 'X+' | 'X-' | 'Y+' | 'Y-' | 'Z+' | 'Z-';

export interface Point { x: number; y: number }
export interface Stroke { points: Point[]; width: number; mode: DrawMode }
export interface DrawingDocument { version: 1; widthMm: number; heightMm: number; strokes: Stroke[] }
export interface MagneticCell { strength: number; direction: Direction }
export interface Magnetization2D { version: 1; columns: number; rows: number; cells: Record<string, MagneticCell> }
export interface DiwPrinterProfile { bedWidthMm: number; bedHeightMm: number; nozzleDiameterMm: number; lineWidthMm: number; layerHeightMm: number; speedMmMin: number; extrusionPerMm: number; emitExtrusion: boolean; pathAngleDeg: number }
export const DEFAULT_PROFILE: DiwPrinterProfile = { bedWidthMm: 100, bedHeightMm: 100, nozzleDiameterMm: 1.63, lineWidthMm: 1.63, layerHeightMm: 0.8, speedMmMin: 900, extrusionPerMm: 0.32, emitExtrusion: true, pathAngleDeg: 0 };
export const DIRECTIONS: Direction[] = ['X+', 'X-', 'Y+', 'Y-', 'Z+', 'Z-'];
export const cellKey = (x: number, y: number) => `${x}:${y}`;
