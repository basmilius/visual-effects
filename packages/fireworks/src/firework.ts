import { distance, Point } from "@basmilius/effects-common";
import { MULBERRY } from "./consts";

export class Firework extends EventTarget {
    public readonly position: Point;
    public readonly startPosition: Point;
    public readonly targetPosition: Point;
    public readonly acceleration: number = 1.05;
    public readonly angle: number;
    public readonly brightness: number = MULBERRY.nextBetween(50, 70);
    public readonly distance: number;
    public distanceTraveled: number = 0;
    public readonly hue: number;
    public readonly lineWidth: number;
    public speed: number = 1;
    public targetRadius: number = 1;
    public readonly trail: Point[] = [];
    public readonly trailMemory: number = 3;

    constructor(start: Point, target: Point, hue: number, lineWidth: number) {
        super();

        this.hue = hue;
        this.lineWidth = lineWidth;
        this.position = {...start};
        this.startPosition = {...start};
        this.targetPosition = {...target};
        this.angle = Math.atan2(target.y - start.y, target.x - start.x);
        this.distance = distance(start, target);

        while (this.trailMemory--) {
            this.trail.push({...start});
        }
    }

    draw(ctx: CanvasRenderingContext2D): void {
        const hue = this.hue + MULBERRY.nextBetween(-50, 50);
        const trailEnd = this.trail[this.trail.length - 1];

        ctx.beginPath();
        ctx.moveTo(trailEnd.x, trailEnd.y);
        ctx.lineTo(this.position.x, this.position.y);
        ctx.lineCap = "round";
        ctx.lineWidth = this.lineWidth;
        ctx.strokeStyle = `hsl(${hue}, 100%, ${this.brightness}%)`;
        ctx.stroke();
    }

    tick(): void {
        this.trail.pop();
        this.trail.unshift({...this.position});

        if (this.targetRadius < 8) {
            this.targetRadius += 0.3;
        } else {
            this.targetRadius = 1;
        }

        this.speed *= this.acceleration;

        let x = Math.cos(this.angle) * this.speed;
        let y = Math.sin(this.angle) * this.speed;

        this.distanceTraveled = distance(this.startPosition, {
            x: this.position.x + x,
            y: this.position.y + y
        });

        if (this.distanceTraveled >= this.distance) {
            this.dispatchEvent(new CustomEvent("remove"));
        } else {
            this.position.x += x;
            this.position.y += y;
        }
    }
}
