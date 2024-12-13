import { LimitedFrameRateCanvas } from '@basmilius/effects-common';
import { MULBERRY } from './consts';
import type { Snowflake } from './snowflake';

export class SnowSimulation extends LimitedFrameRateCanvas {
    readonly #fillStyle: string;
    readonly #maxParticles: number;
    readonly #size: number = 6;
    readonly #speed: number;
    #angle: number = 0;
    #ratio: number = 1;
    #snowFlakes: Snowflake[] = [];

    constructor(canvas: HTMLCanvasElement, options: CanvasRenderingContext2DSettings = {colorSpace: 'display-p3'}) {
        super(canvas, 60, options);

        this.canvas.style.position = 'absolute';
        this.canvas.style.top = '0';
        this.canvas.style.left = '0';
        this.canvas.style.height = '100%';
        this.canvas.style.width = '100%';

        this.#fillStyle = canvas.dataset.fillStyle || 'rgb(255 255 255 / .75)';
        this.#maxParticles = parseInt(canvas.dataset.particles || '200');
        this.#size = parseFloat(canvas.dataset.size || '6.0');
        this.#speed = parseFloat(canvas.dataset.speed || '2.0');

        if (this.isSmall) {
            this.#maxParticles /= 2;
        }

        for (let i = 0; i < this.#maxParticles; ++i) {
            this.#snowFlakes.push({
                x: MULBERRY.next(),
                y: MULBERRY.next() - 1,
                density: MULBERRY.next() * this.#maxParticles,
                radius: MULBERRY.next() * this.#size + 2
            });
        }
    }

    draw(): void {
        this.canvas.height = this.height;
        this.canvas.width = this.width;

        this.context.clearRect(0, 0, this.width, this.height);
        this.context.fillStyle = this.#fillStyle;

        this.context.beginPath();

        this.#snowFlakes.forEach(s => {
            this.context.moveTo(s.x * this.width, s.y * this.height);
            this.context.arc(s.x * this.width, s.y * this.height, s.radius * this.#ratio, 0, Math.PI * 2, true);
        });

        this.context.fill();
    }

    tick(): void {
        let speedFactor = (this.height / (420 * this.#ratio) / this.#speed) * this.deltaFactor;

        this.#angle += 0.02 * speedFactor;

        this.#snowFlakes.forEach((s, index) => {
            s.x += (Math.sin(this.#angle + s.density) * 2) / (5000 * speedFactor);
            s.y += (Math.cos(this.#angle + s.density) + 1 + s.radius / 2) / (1000 * speedFactor);

            if (s.x > 1.05 || s.x < -0.05 || s.y > 1.05) {
                if (index % 3 > 0) {
                    this.#snowFlakes[index].x = MULBERRY.next();
                    this.#snowFlakes[index].y = -0.05;
                } else if (Math.sin(this.#angle) > 0) {
                    this.#snowFlakes[index].x = -0.05;
                    this.#snowFlakes[index].y = MULBERRY.next();
                } else {
                    this.#snowFlakes[index].x = 1.05;
                    this.#snowFlakes[index].y = MULBERRY.next();
                }
            }
        });
    }
}
