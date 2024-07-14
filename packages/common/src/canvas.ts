export class LimitedFrameRateCanvas {
    readonly #canvas: HTMLCanvasElement;
    readonly #context: CanvasRenderingContext2D;
    readonly #frameRate: number;
    readonly #target: number;
    #current: number = 0;
    #delta: number = 0;
    #frame: number = 0;
    #now: number = 0;
    #then: number = 0;
    #ticks: number = 0;
    #isStopped: boolean = false;
    #height: number = 540;
    #width: number = 960;

    get canvas(): HTMLCanvasElement {
        return this.#canvas;
    }

    get context(): CanvasRenderingContext2D {
        return this.#context;
    }

    get delta(): number {
        return this.#delta;
    }

    get deltaFactor(): number {
        return this.#then === 0 ? 1 : this.#target / this.#delta;
    }

    get frameRate(): number {
        return this.#frameRate;
    }

    get isSmall(): boolean {
        return innerWidth < 991; // dirty little fix :-)
    }

    get ticks(): number {
        return this.#ticks;
    }

    get height(): number {
        return this.#height;
    }

    get width(): number {
        return this.#width;
    }

    constructor(canvas: HTMLCanvasElement, frameRate: number, options: CanvasRenderingContext2DSettings = {colorSpace: 'display-p3'}) {
        this.#canvas = canvas;
        this.#context = canvas.getContext('2d', options);
        this.#frameRate = frameRate;
        this.#target = 1000 / frameRate;

        this.onVisibilityChange = this.onVisibilityChange.bind(this);
        this.onResize = this.onResize.bind(this);

        document.addEventListener('visibilitychange', this.onVisibilityChange, {passive: true});
        window.addEventListener('resize', this.onResize, {passive: true});
    }

    loop(): void {
        if (this.#isStopped) {
            return;
        }

        this.#current = Date.now();
        this.#frame = requestAnimationFrame(this.loop.bind(this));

        if (this.#then > 0 && this.#current - this.#then + 1 < this.#target) {
            return;
        }

        this.#now = this.#current;
        this.#delta = this.#now - this.#then;

        ++this.#ticks;

        this.tick();
        this.draw();

        this.#then = this.#now;
    }

    start(): void {
        this.onResize();

        this.#isStopped = false;
        this.#frame = requestAnimationFrame(this.loop.bind(this));
    }

    stop(): void {
        this.#isStopped = true;
        cancelAnimationFrame(this.#frame);
    }

    draw(): void {
        throw new Error('LimitedFrameRateCanvas::draw() should be overwritten.');
    }

    tick(): void {
        throw new Error('LimitedFrameRateCanvas::tick() should be overwritten.');
    }

    destroy(): void {
        document.removeEventListener('visibilitychange', this.onVisibilityChange);
        window.removeEventListener('resize', this.onResize);
    }

    onResize(): void {
        const {width, height} = this.#canvas.getBoundingClientRect();
        this.#height = height;
        this.#width = width;
    }

    onVisibilityChange(): void {
        cancelAnimationFrame(this.#frame);

        if (document.visibilityState === 'visible') {
            this.#then = 0;
            this.start();
        } else {
            this.#then = 0;
            this.stop();
        }
    }
}
