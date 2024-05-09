import {Injectable} from "@angular/core";
import {BehaviorSubject} from "rxjs";
import {TrainingData} from "../../ai/TrainingData";
import {Point} from "../model/point.model";

@Injectable({ providedIn: "root"})
export class TrainingDataService {
  private trainingDataList = new BehaviorSubject<TrainingData[]>([]);
  readonly trainingDataList$ = this.trainingDataList.asObservable();

  addTrainingData(line: Point[], symbol:string) {
    const normalized = this.normalizeLine(line);
    const trainingDataList = this.trainingDataList.value;
    trainingDataList.push(new TrainingData(normalized, symbol));
    this.trainingDataList.next(trainingDataList);
  }

  private normalizeLine(line: Point[]): Point[] {
    const normalized: Point[] = [];

    const maxX: number = line.sort((a, b) => b.x - a.x)[0].x;
    const minX: number = line.sort((a, b) => a.x - b.x)[0].x;
    const maxY: number = line.sort((a, b) => b.y - a.y)[0].y;
    const minY: number = line.sort((a, b) => a.y - b.y)[0].y;

    for (const point of line) {
      const normalizedX = (point.x - minX) / (maxX - minX);
      const normalizedY = (point.y - minY) / (maxY - minY);
      normalized.push({ x: normalizedX, y: normalizedY });
    }


    return normalized;
  }
}
