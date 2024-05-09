import {emit} from "@angular-devkit/build-angular/src/tools/esbuild/angular/compilation/parallel-worker";
import {EventEmitter, Injectable} from "@angular/core";
import {BehaviorSubject, Subject} from "rxjs";

@Injectable({ providedIn: 'root' })
export class SettingsService {
  private errorTolerance = new BehaviorSubject<number>(0);
  private learningRate = new BehaviorSubject<number>(0);
  private numPoints = new BehaviorSubject<number>(0);
  private numHiddenNeurons = new BehaviorSubject<number>(0);

  readonly errorTolerance$ = this.errorTolerance.asObservable();
  readonly learningRate$ = this.learningRate.asObservable();
  readonly numPoints$ = this.numPoints.asObservable();
  readonly numHiddenNeurons$ = this.numHiddenNeurons.asObservable();

  setErrorTolerance(value: number) {
    this.errorTolerance.next(value);
  }

  setLearningRate(value: number) {
    this.learningRate.next(value);
  }

  setNumPoints(value: number) {
    this.numPoints.next(value);
  }

  setNumHiddenNeurons(value: number) {
    this.numHiddenNeurons.next(value);
  }

  getLearningRate() { return this.learningRate.value }
  getErrorTolerance() { return this.errorTolerance.value }
  getNumOfPoints() { return this.numPoints.value }
  getHiddenNeuronsAmount() { return this.numHiddenNeurons.value }
}
