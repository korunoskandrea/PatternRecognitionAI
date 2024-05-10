import {Neuron} from "./Neuron";

export class Layer {
  neurons!: Neuron[];
  lastOutputs!: number[];

  constructor(numNeurons: number, numInputs:number) {
    this.neurons = Array.from({ length: numNeurons }, () => new Neuron(numInputs));
  }

  public feedForward(inputs: number[]): number[]{ // Aktiviranje nevron v layer in shramba izhodov v list
    return this.lastOutputs = this.neurons.map(neuron => neuron.activate(inputs));
  }

  public backpropagate(inputs: number[], errors: number[], learningRate: number): number[]{
    const prevErrors: number[] = Array(this.neurons[0].weights.length).fill(0.0);

    for (let i = 0; i < this.neurons.length; i++){
      const neuron: Neuron = this.neurons[i];
      const delta: number = errors[i] * neuron.derivative(); // Error gradient
      for (let j: number = 0; j < neuron.weights.length; j++){
        prevErrors[j] += delta * neuron.weights[j];
        neuron.weights[j] += learningRate * delta *inputs[j];
      }
      neuron.bias += learningRate * delta
    }
    return  prevErrors;
  }
}
