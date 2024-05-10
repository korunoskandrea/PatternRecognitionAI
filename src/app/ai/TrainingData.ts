import {Point} from "../_common/model/point.model";

export class TrainingData {
  inputPoints!: Point[];
  symbol!: string;

  constructor(inputPoints: Point[], symbol:string) {
    this.inputPoints = inputPoints;
    this.symbol = symbol;
  }

  get flattenedInputs(): number[]{ // pretvorba inputPoint v stevila
    let flattened: number[] = [];
    for(const point of this.inputPoints){
      flattened.push(point.x);
      flattened.push(point.y);
    }
    return flattened;
  }

  public getExpectedOutput(labels: string[]): number[]{
    let expectedOutputVec: number[] = new Array(labels.length).fill(0.0);
    const index = labels.indexOf(this.symbol);
    if(index !== -1){ // simbol je prisoten v seznamu labels ->  vrednost = 1 v expectedOutputVec na tem indeksu
      expectedOutputVec[index] = 1;
    }
    return expectedOutputVec;
  }
}
