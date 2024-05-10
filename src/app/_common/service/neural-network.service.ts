import {Injectable} from "@angular/core";
import {NeuralNetwork} from "../../ai/NeuralNetwork";
import {TrainingDataService} from "./trainingData.service";
import {SettingsService} from "./settings.service";
import {BehaviorSubject, combineLatest, Subject, take, takeLast} from "rxjs";
import {log} from "@angular-devkit/build-angular/src/builders/ssr-dev-server";
import {CanvasService} from "./canvas.service";

@Injectable({ providedIn: 'root' })
export class NeuralNetworkService {
  private neuralNetwork = new BehaviorSubject<NeuralNetwork | null>(null)
  private isLearning = new BehaviorSubject<boolean>(false);

  readonly isLearning$ = this.isLearning.asObservable();
  readonly neuralNetwork$ = this.neuralNetwork.asObservable();

  constructor(
    private trainingDataService: TrainingDataService,
    private settingsService: SettingsService,
    private canvasService: CanvasService
  ) {}

  learn() {
    this.isLearning.next(true);
    this.trainingDataService.trainingDataList$.pipe(take(1)).subscribe((trainingData) => {
      const pointAmount = this.settingsService.getNumOfPoints();
      const errorTolerance = this.settingsService.getErrorTolerance();
      const learningRate = this.settingsService.getLearningRate();
      const hiddenNeuronsAmount = this.settingsService.getHiddenNeuronsAmount();

      const labels = trainingData.map((data) => data.symbol);
      const uniqueLabels: string[] = [];
      for (const label of labels) {
        if (uniqueLabels.indexOf(label) < 0) {
          uniqueLabels.push(label);
        }
      }
      const neuronNetwork = new NeuralNetwork([ pointAmount,  hiddenNeuronsAmount, uniqueLabels.length ], uniqueLabels);
      // start learning
      neuronNetwork.errorBackPropagationTraining(trainingData, {
        learningRate: learningRate,
        errorTolerance: errorTolerance
      });
      this.neuralNetwork.next(neuronNetwork);
      this.isLearning.next(false);
    });
  }

  recognise(){
    const symbol = this.neuralNetwork.value?.recognise(this.canvasService.getNormalizedLine());
  }
  recogniseSymbol() {
    return this.neuralNetwork.value?.recognise(this.canvasService.getNormalizedLine());
  }
}
