import { Component, Inject } from '@angular/core';
import { MAT_DIALOG_DATA } from '@angular/material/dialog';
import {CanvasService} from "../../../_common/service/canvas.service";
import {TrainingDataService} from "../../../_common/service/trainingData.service";
import {take} from "rxjs";

@Component({
  selector: 'app-vectorize-dialog',
  templateUrl: './vectorize.dialog.component.html',
  styleUrl: "./vectorize.dialog.component.scss"
})
export class VectorizeDialogComponent {
  symbol: string = '';
  constructor(
    @Inject(MAT_DIALOG_DATA) public data: any,
    private canvasService: CanvasService,
    private trainingDataService: TrainingDataService
  ) {}

  saveTrainingData() {
    this.canvasService.line.pipe(take(1)).subscribe((line) => {
      this.trainingDataService.addTrainingData(line, this.symbol);
    })
  }
}
