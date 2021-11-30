export class LimitedFrameRateCanvas {
    private readonly _canvas: HTMLCanvasElement;
    private readonly _context: CanvasRenderingContext2D;
    private _current: number = 0;
    private _delta: number = 0;
    private _frame: number = 0;
    private readonly _frameRate: number;
    private _now: number = 0;
    private readonly _target: number;
    private _then: number = 0;
    private _ticks: number = 0;
    private _isStopped: boolean = false;

    private _height: number = 540;
    private _width: number = 960;

    private readonly _boundOnVisibilityChange: (evt: Event) => void;
    private readonly _boundOnResize: (evt: Event) => void;

    public get canvas(): HTMLCanvasElement {
        return this._canvas;
    }

    public get context(): CanvasRenderingContext2D {
        return this._context;
    }

    public get delta(): number {
        return this._delta;
    }

    public get deltaFactor(): number {
        return this._then === 0 ? 1 : this._target / this._delta;
    }

    public get frameRate(): number {
        return this._frameRate;
    }

    public get isSmall(): boolean {
        return innerWidth < 991; // dirty little fix :-)
    }

    public get ticks(): number {
        return this._ticks;
    }

    public get height(): number {
        return this._height;
    }

    public get width(): number {
        return this._width;
    }

    constructor(canvas: HTMLCanvasElement, frameRate: number) {
        this._canvas = canvas;
        this._context = canvas.getContext("2d", {colorSpace: "display-p3"});
        this._frameRate = frameRate;
        this._target = 1000 / frameRate;

        this._boundOnVisibilityChange = this.onVisibilityChange.bind(this);
        this._boundOnResize = this.onResize.bind(this);

        document.addEventListener("visibilitychange", this._boundOnVisibilityChange, {passive: true});
        window.addEventListener("resize", this._boundOnResize, {passive: true});
    }

    loop(): void {
        if (this._isStopped) {
            return;
        }

        this._current = Date.now();
        this._frame = requestAnimationFrame(this.loop.bind(this));

        if (this._then > 0 && this._current - this._then + 1 < this._target) {
            return;
        }

        this._now = this._current;
        this._delta = this._now - this._then;

        ++this._ticks;

        this.tick();
        this.draw();

        this._then = this._now;
    }

    start(): void {
        this.onResize();

        this._isStopped = false;
        this._frame = requestAnimationFrame(this.loop.bind(this));
    }

    stop(): void {
        this._isStopped = true;
        cancelAnimationFrame(this._frame);
    }

    draw(): void {
        throw new Error("LimitedFrameRateCanvas::draw() should be overwritten.")
    }

    tick(): void {
        throw new Error("LimitedFrameRateCanvas::tick() should be overwritten.")
    }

    destroy(): void {
        document.removeEventListener("visibilitychange", this._boundOnVisibilityChange);
        window.removeEventListener("resize", this._boundOnResize);
    }

    onResize(): void {
        const {width, height} = this._canvas.getBoundingClientRect();
        this._height = height;
        this._width = width;
    }

    onVisibilityChange(): void {
        cancelAnimationFrame(this._frame);

        if (document.visibilityState === "visible") {
            this._then = 0;
            this.start();
        } else {
            this._then = 0;
            this.stop();
        }
    }
}
