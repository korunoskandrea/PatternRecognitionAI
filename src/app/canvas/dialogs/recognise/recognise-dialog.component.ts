import {Component, Inject} from "@angular/core";
import {MAT_DIALOG_DATA} from "@angular/material/dialog";

@Component({
  selector: 'app-recognise-dialog',
  templateUrl: './recognise-dialog.component.html',
  styleUrl: './recognise-dialog.component.scss'
})
export class RecogniseDialogComponent{
  constructor(@Inject(MAT_DIALOG_DATA) public data: any) {}

}
