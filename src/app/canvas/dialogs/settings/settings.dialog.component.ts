import { Component, Inject } from '@angular/core';
import { MAT_DIALOG_DATA } from '@angular/material/dialog';
import {SettingsService} from "../../../_common/service/settings.service";

@Component({
  selector: 'app-settings-dialog',
  templateUrl: './settings.dialog.component.html',
  styleUrl: "./settings.dialog.component.scss"
})
export class SettingsDialogComponent {
  userInput: string = '';

  constructor(@Inject(MAT_DIALOG_DATA) public data: any, public settingsService: SettingsService) { }

  setHiddenNeurons(event: Event) {
    this.settingsService.setNumHiddenNeurons(+(event.target as HTMLInputElement).value);
  }

  setLearningRate(event: Event){
    this.settingsService.setLearningRate(+(event.target as HTMLInputElement).value);
  }

  setErrorTolerance(event: Event){
    this.settingsService.setErrorTolerance(+(event.target as HTMLInputElement).value);
  }

  setNumOfPoints(event: Event){
    this.settingsService.setNumPoints(+(event.target as HTMLInputElement).value);
  }
}
