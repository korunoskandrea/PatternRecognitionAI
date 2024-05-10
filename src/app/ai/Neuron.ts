export class Neuron {
  weights!: Array<number>;
  bias!: number;
  output!: number;

  constructor(numberInputs: number) {
    this.weights = [];
    for (let i = 0; i < numberInputs; i++) {
      this.weights.push(Math.random() * 2 - 1);
    }
    this.bias = 0.0;
  }

  public activate(inputs: Array<number>):number{ // Racunanje izhod nevronov
    let sum: number = 0.0;
    for (let i = 0; i < this.weights.length; i++) {
      sum += this.weights[i] * inputs[i];
    }
    sum += this.bias;
    this.output = 1 / (1 + Math.exp(-sum));
    return this.output;
  }

  public derivative(): number{ // Derivative uporabljeno v backpropagation
    return this.output * (1 - this.output);
  }

  public sigmoidDerivative(value: number ){
    return value * (1 - value);
  }
}
