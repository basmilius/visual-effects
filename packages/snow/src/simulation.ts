import { LimitedFrameRateCanvas } from "@basmilius/effects-common";
import { MULBERRY } from "./consts";
import { Snowflake } from "./snowflake";

export class SnowSimulation extends LimitedFrameRateCanvas {
    private readonly fillStyle: string;
    private readonly maxParticles: number;
    private snowFlakes: Snowflake[];
    private readonly speed: number;

    private angle: number = 0;
    private ratio: number = 1;

    constructor(canvas: HTMLCanvasElement) {
        super(canvas, 60);

        this.canvas.style.position = "absolute";
        this.canvas.style.top = "0";
        this.canvas.style.left = "0";
        this.canvas.style.height = "100%";
        this.canvas.style.width = "100%";

        this.fillStyle = canvas.dataset.fillStyle || "rgb(255 255 255 / .75)";
        this.maxParticles = parseInt(canvas.dataset.particles || "200");
        this.snowFlakes = [];
        this.speed = parseFloat(canvas.dataset.speed || "2.0");

        if (this.isSmall) {
            this.maxParticles /= 2;
        }

        for (let i = 0; i < this.maxParticles; ++i) {
            this.snowFlakes.push({
                x: MULBERRY.next(),
                y: MULBERRY.next() - 1,
                density: MULBERRY.next() * this.maxParticles,
                radius: MULBERRY.next() * 6 + 2,
            });
        }
    }

    draw(): void {
        this.canvas.height = this.height;
        this.canvas.width = this.width;

        this.context.clearRect(0, 0, this.width, this.height);
        this.context.fillStyle = this.fillStyle;

        this.context.beginPath();

        this.snowFlakes.forEach(snowFlake => {
            this.context.moveTo(snowFlake.x * this.width, snowFlake.y * this.height);
            this.context.arc(snowFlake.x * this.width, snowFlake.y * this.height, snowFlake.radius * this.ratio, 0, Math.PI * 2, true);
        });

        this.context.fill();
    }

    tick(): void {
        let speedFactor = (this.height / (420 * this.ratio) / this.speed) * this.deltaFactor;

        this.angle += 0.02 * speedFactor;

        this.snowFlakes.forEach((snowFlake, index) => {
            snowFlake.x += (Math.sin(this.angle + snowFlake.density) * 2) / (5000 * speedFactor);
            snowFlake.y += (Math.cos(this.angle + snowFlake.density) + 1 + snowFlake.radius / 2) / (1000 * speedFactor);

            if (snowFlake.x > 1.05 || snowFlake.x < -0.05 || snowFlake.y > 1.05) {
                if (index % 3 > 0) {
                    this.snowFlakes[index].x = MULBERRY.next();
                    this.snowFlakes[index].y = -0.05;
                } else if (Math.sin(this.angle) > 0) {
                    this.snowFlakes[index].x = -0.05;
                    this.snowFlakes[index].y = MULBERRY.next();
                } else {
                    this.snowFlakes[index].x = 1.05;
                    this.snowFlakes[index].y = MULBERRY.next();
                }
            }
        });
    }
}
