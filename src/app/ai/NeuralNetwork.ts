import {Point} from "../_common/model/point.model";
import {max} from "rxjs";
import {TrainingData} from "./TrainingData";
import {Layer} from "./Layer";

export class NeuralNetwork{
  layers!: Layer[];
  labels!: string[];

  constructor(layerSizes: number[], labels: string[]) {
    this.labels = labels;
    this.layers=[];
    for(let i = 0; i < layerSizes.length; i++){
      let numInputs;
      if(i === 0){
        numInputs = 4; // prvi layer ima 4 vhodov
      } else {
        numInputs = layerSizes[i -1];
      }
      this.layers.push( new Layer(layerSizes[i], numInputs));
    }
  }

  public predict(inputs: number[]): number[] { // Aktiviranje laeyers s vhodi
    let outputs = inputs;
    for (const layer of this.layers) {
      outputs = layer.feedForward(outputs);
    }
    return outputs;
  }

  public recognise(inputPoints: Point[]): string{ // InputPoint postane razumljivi za nevronsko mrezo
    let flattened: number[] = [];
    for(const point of inputPoints){
      flattened.push(point.x);
      flattened.push(point.y);
    }
    let predictedOutput = this.predict(flattened);
    let maxOutputIndex = predictedOutput.indexOf(Math.max(...predictedOutput));
    return this.labels[maxOutputIndex];
  }

  // Implementacija algoritma vzvratnega razširjanja
  public errorBackPropagationTraining(trainingData: TrainingData[], { learningRate = 0.25, errorTolerance = 0.005}: {learningRate?: number, errorTolerance?:number}): void{
    let error = Number.MAX_VALUE;
    while (error > errorTolerance) { // treniraj dokler error ne pade pod errorTolerance
      error = 0;
      for (const data of trainingData) {
        // Prehod naprej
        const actualOutput = this.predict(data.flattenedInputs);
        const expectedOutput = data.getExpectedOutput(this.labels);
        // Prehod nazaj
        let errors = expectedOutput.map((value, i) => value - actualOutput[i]); // Errors med actual in expectedOutput
        for (let j = this.layers.length - 1; j >= 0; j--) {
          const prevOutput = j - 1 >= 0 ? this.layers[j - 1].lastOutputs : data.flattenedInputs;
          errors = this.layers[j].backpropagate(prevOutput, errors, learningRate); // Azuriranje weights in biases
        }
        // Totalni error
        error += errors.reduce((sum, value) => sum + Math.abs(value), 0);
      }
      // Povprecni error
      error /= trainingData.length;
      if (Math.abs(error - errorTolerance) < 1e-8) {
        break;
      }
    }
  }
}
