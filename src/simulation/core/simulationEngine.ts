interface Simulator<T> {
  tick(deltaTimeSec: number): T;
  isFinished(): boolean;
}

type TickHandler<T> = (state: T) => Promise<void> | void;

export class SimulationEngine<T> {
  private running = false;

  constructor(
    private readonly simulator: Simulator<T>,
    private readonly onTick: TickHandler<T>,
    private readonly intervalMs = 1000,
  ) {}

  async start(): Promise<void> {
    this.running = true;

    console.log('Simulation started');

    while (this.running && !this.simulator.isFinished()) {
      const deltaTimeSec = this.intervalMs / 1000;

      const state = this.simulator.tick(deltaTimeSec);

      await this.onTick(state);

      await this.sleep(this.intervalMs);
    }

    console.log('Simulation finished');
  }

  stop(): void {
    this.running = false;
  }

  private sleep(ms: number) {
    return new Promise<void>((resolve) => {
      setTimeout(resolve, ms);
    });
  }
}
