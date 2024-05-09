import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';

import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { provideAnimationsAsync } from '@angular/platform-browser/animations/async';
import {CanvasComponent} from "./canvas/canvas.component";
import {MatButtonToggle} from "@angular/material/button-toggle";
import {MatButton, MatFabButton, MatIconButton} from "@angular/material/button";
import {MatIcon} from "@angular/material/icon";
import {VectorizeDialogComponent} from "./canvas/dialogs/vectorize/vectorize.dialog.component";
import {MatDialogActions, MatDialogClose, MatDialogContent, MatDialogTitle} from "@angular/material/dialog";
import {FormsModule} from "@angular/forms";
import {MatFormField, MatLabel} from "@angular/material/form-field";
import {MatInput} from "@angular/material/input";
import {MatTooltip} from "@angular/material/tooltip";
import {SettingsDialogComponent} from "./canvas/dialogs/settings/settings.dialog.component";
import {RecogniseDialogComponent} from "./canvas/dialogs/recognise/recognise-dialog.component";

@NgModule({
  declarations: [
    AppComponent,
    CanvasComponent,
    VectorizeDialogComponent,
    SettingsDialogComponent,
    RecogniseDialogComponent
  ],
  imports: [
    BrowserModule,
    AppRoutingModule,
    MatButtonToggle,
    MatButton,
    MatIcon,
    MatFabButton,
    MatDialogClose,
    MatDialogTitle,
    MatDialogContent,
    MatDialogActions,
    FormsModule,
    MatFormField,
    MatInput,
    MatIconButton,
    MatTooltip,
    MatLabel
  ],
  providers: [
    provideAnimationsAsync()
  ],
  bootstrap: [AppComponent]
})
export class AppModule { }
