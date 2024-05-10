import {BehaviorSubject, pipe, Subject} from "rxjs";
import {Point} from "../model/point.model";
import {Injectable} from "@angular/core";

@Injectable({ providedIn: 'root' })
export class CanvasService {
  private $line = new BehaviorSubject<Point[]>([]);
  private $lastAddedPoint = new Subject<Point>();

  readonly line = this.$line.asObservable();
  readonly lastAddedPoint = this.$lastAddedPoint.asObservable();


  clear() {
    this.$line.next([]);
  }

  addPoint(x: number, y: number) {
    const points = this.$line.value;
    points.push({ x, y });

    this.$line.next(points);
    this.$lastAddedPoint.next({ x, y });
  }

  vectorize(pointAmount: number) { // Vektorizacija znakov
    const oldPoints = this.$line.value;
    if (oldPoints.length === 0 || pointAmount < 2) return;
    const newPoints: Point[] = [ oldPoints[0] ]; // fix prvo tocko
    let step = Math.floor(oldPoints.length / pointAmount); // kolko indexsov preskocim do naslednje index ticke
    if (step === 0) step = 1;
    let currPointIndex = 0;

    while (newPoints.length < pointAmount - 1) {
      const p1 = oldPoints[currPointIndex];
      currPointIndex += step;
      if (currPointIndex >= oldPoints.length) currPointIndex = oldPoints.length - 1;
      const p2 = oldPoints[currPointIndex];
      newPoints.push({ x: (p1.x + p2.x) / 2, y: (p1.y + p2.y) / 2 })
    }
    newPoints.push(oldPoints[oldPoints.length-1]); // fix zadno tocko

    this.$line.next(newPoints);
  }

  getLine() {
    return this.$line.value;
  }

  getNormalizedLine() {
    return this.normalizeLine(this.$line.value);
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
