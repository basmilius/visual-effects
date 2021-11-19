import { Point } from "@basmilius/effects-common";
import { MULBERRY } from "./consts";

export class Explosion extends EventTarget {
    public readonly position: Point;
    public alpha: number;
    public readonly angle: number;
    public readonly brightness: number;
    public readonly decay: number;
    public readonly friction: number = 0.95;
    public readonly gravity: number = 1;
    public readonly hue: number;
    public readonly lineWidth: number;
    public speed: number;
    public readonly trail: Point[] = [];
    public readonly trailMemory: number = 5;

    constructor(position: Point, hue: number, lineWidth: number) {
        super();

        this.position = {...position};
        this.alpha = 1;
        this.angle = MULBERRY.nextBetween(0, Math.PI * 2);
        this.brightness = MULBERRY.nextBetween(50, 80);
        this.decay = MULBERRY.nextBetween(0.015, 0.03);
        this.hue = hue + MULBERRY.nextBetween(-50, 50);
        this.lineWidth = lineWidth;
        this.speed = MULBERRY.nextBetween(1, 10);

        while (this.trailMemory--) {
            this.trail.push({...position});
        }
    }

    draw(ctx: CanvasRenderingContext2D): void {
        const trailEnd = this.trail[this.trail.length - 1];

        ctx.beginPath();
        ctx.moveTo(trailEnd.x, trailEnd.y);
        ctx.lineTo(this.position.x, this.position.y);
        ctx.lineCap = "round";
        ctx.lineWidth = this.lineWidth;
        ctx.strokeStyle = `hsla(${this.hue}, 100%, ${this.brightness}%, ${this.alpha})`;
        ctx.stroke();
    }

    tick(): void {
        this.trail.pop();
        this.trail.unshift({...this.position});
        this.speed *= this.friction;

        this.position.x += Math.cos(this.angle) * this.speed;
        this.position.y += Math.sin(this.angle) * this.speed + this.gravity;

        this.alpha -= this.decay;

        if (this.alpha <= this.decay) {
            this.dispatchEvent(new CustomEvent("remove"));
        }
    }
}
