import { LimitedFrameRateCanvas, Point } from '@basmilius/effects-common';
import { MULBERRY } from './consts';
import { Explosion } from './explosion';
import { Firework } from './firework';

export class FireworkSimulation extends LimitedFrameRateCanvas {
    #explosions: Explosion[] = [];
    #fireworks: Firework[] = [];
    #hue: number = 120;
    #positionRandom = MULBERRY.fork();
    readonly #lineWidth: number;

    constructor(canvas: HTMLCanvasElement, lineWidth: number = 6, options: CanvasRenderingContext2DSettings = {colorSpace: 'display-p3'}) {
        super(canvas, 60, options);

        this.#lineWidth = lineWidth;

        this.canvas.style.position = 'absolute';
        this.canvas.style.top = '0';
        this.canvas.style.left = '0';
        this.canvas.style.height = '100%';
        this.canvas.style.width = '100%';
    }

    draw(): void {
        this.canvas.height = this.height;
        this.canvas.width = this.width;

        this.context.globalCompositeOperation = 'destination-out';
        this.context.fillStyle = 'rgba(0, 0, 0, 0.5)';
        this.context.fillRect(0, 0, this.width, this.height);
        this.context.globalCompositeOperation = 'lighter';

        this.#explosions.forEach(e => e.draw(this.context));
        this.#fireworks.forEach(f => f.draw(this.context));
    }

    tick(): void {
        if (this.#fireworks.length < 6 && this.ticks % (this.isSmall ? 60 : 30) === 0) {
            let count = MULBERRY.nextBetween(1, 100) < 10 ? 2 : 1;

            while (count--) {
                this.#hue = MULBERRY.nextBetween(0, 360);
                this.#createFirework();
            }
        }

        this.#explosions.forEach(e => e.tick());
        this.#fireworks.forEach(f => f.tick());
    }

    #createExplosion(position: Point, hue: number): void {
        let particles: number = 30;

        while (particles--) {
            const explosion = new Explosion(position, hue, this.#lineWidth);

            explosion.addEventListener('remove', () => this.#explosions.splice(this.#explosions.indexOf(explosion), 1), {once: true});

            this.#explosions.push(explosion);
        }
    }

    #createFirework(position?: Point): void {
        const hue = this.#hue;
        const x = position?.x || this.#positionRandom.nextBetween(innerWidth * .1, this.width - innerWidth * .1);
        const y = position?.y || this.height * .1 + this.#positionRandom.nextBetween(0, this.height * .5);

        const firework = new Firework({x: x * .5 + innerWidth / 4, y: this.height}, {x, y}, hue, this.#lineWidth);

        firework.addEventListener('remove', () => {
            this.#fireworks.splice(this.#fireworks.indexOf(firework), 1);
            this.#createExplosion(firework.position, hue);
        }, {once: true});

        this.#fireworks.push(firework);
    }
}
