import type { Point } from './point';

export function distance(a: Point, b: Point): number {
    let x = a.x - b.x;
    let y = a.y - b.y;

    return Math.sqrt(Math.pow(x, 2) + Math.pow(y, 2));
}
