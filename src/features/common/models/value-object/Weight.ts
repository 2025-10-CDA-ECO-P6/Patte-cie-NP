export class Weight {
  private constructor(private readonly value: number) {}

  static create(value: number): Weight {
    if (value <= 0) {
      throw new Error("Weight must be greater than 0");
    }

    // max 2 décimales (ex: kg)
    if (!Number.isFinite(value)) {
      throw new Error("Invalid weight value");
    }

    return new Weight(Number(value.toFixed(2)));
  }

  getValue(): number {
    return this.value;
  }
}
