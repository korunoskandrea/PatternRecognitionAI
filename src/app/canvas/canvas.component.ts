import {AfterViewInit, Component, ElementRef, OnDestroy, OnInit, ViewChild} from "@angular/core";
import { Direction } from "./Direction";
import {combineLatestAll, combineLatestWith, concatMap, forkJoin, fromEvent, Subscription, take, takeUntil} from "rxjs";
import {combineLatest, tap} from "rxjs/operators";
import {CanvasService} from "../_common/service/canvas.service";
import {MatDialog} from "@angular/material/dialog";
import {VectorizeDialogComponent} from "./dialogs/vectorize/vectorize.dialog.component";
import {SettingsService} from "../_common/service/settings.service";
import {SettingsDialogComponent} from "./dialogs/settings/settings.dialog.component";
import {NeuralNetwork} from "../ai/NeuralNetwork";
import {NeuralNetworkService} from "../_common/service/neural-network.service";
import {ActivatedRoute, Router} from "@angular/router";
import {RecogniseDialogComponent} from "./dialogs/recognise/recognise-dialog.component";
export const DistanceConfig: { [key in Direction]: { x: number; y: number } } = {
  [Direction.up]: { x: 0, y: -10 },
  [Direction.left]: { x: -10, y: 0 },
  [Direction.down]: { x: 0, y: 10 },
  [Direction.right]: { x: 10, y: 0 }
};

@Component({
  selector: 'app-canvas',
  templateUrl: './canvas.component.html',
  styleUrls: ['./canvas.component.scss']
})
export class CanvasComponent implements OnInit, AfterViewInit, OnDestroy {
  private canvasSubscription?: Subscription;
  recognizeMode = false;

  cx: CanvasRenderingContext2D | null = null;

  @ViewChild("myCanvas", { static: false }) canvas?: ElementRef<HTMLCanvasElement>;

  constructor(
    private canvasService: CanvasService,
    private dialog: MatDialog,
    public settingsService: SettingsService,
    public neuralNetworkService: NeuralNetworkService,
    private route: ActivatedRoute,
    private router: Router
  ) {
    this.route.queryParams.subscribe((params) => {
      if ('recognize' in params) {
        this.recognizeMode = params['recognize'];
      }
    })
  }

  ngOnInit(): void {
    this.canvasSubscription = this.canvasService.lastAddedPoint.subscribe((point) => {
      this.draw(point.x, point.y);
    });
  }

  ngOnDestroy() {
    this.canvasSubscription?.unsubscribe();
  }

  ngAfterViewInit(): void {
    if (!this.canvas) return;
    const canvasEl: HTMLCanvasElement = this.canvas.nativeElement;
    this.cx = canvasEl.getContext("2d");

    const mouseDown$ = fromEvent<MouseEvent>(canvasEl, "mousedown");
    const mouseMove$ = fromEvent<MouseEvent>(canvasEl, "mousemove");
    const mouseUp$ = fromEvent<MouseEvent>(canvasEl, "mouseup");

    mouseDown$.pipe(
      tap((e: MouseEvent) => {
        if (this.cx) {
          this.cx.beginPath(); // Begin a new path
          this.cx.moveTo(e.offsetX, e.offsetY);
        }
      }),
      concatMap(() => mouseMove$.pipe(takeUntil(mouseUp$)))
    ).subscribe((e: MouseEvent) => this.canvasService.addPoint(e.offsetX, e.offsetY));
  }

  draw(offsetX: number, offsetY: number): void {
    if (!this.cx) return;
    this.cx.lineTo(offsetX, offsetY);
    this.cx.stroke();
  }

  refreshClicked(): void {
    if (!this.canvas) return;
    const canvas = (this.canvas.nativeElement as HTMLCanvasElement);
    if (this.cx) {
      this.cx.clearRect(0, 0, canvas.width, canvas.height);
      this.canvasService.clear();
    }
  }

  vectorize(numberOfPoints: number ) { // risanje vektorizacija
    if (!this.canvas || this.cx === null) return;
    this.canvasService.vectorize(numberOfPoints);
    const canvas = (this.canvas.nativeElement as HTMLCanvasElement);
    this.canvasService.line.pipe(take(1)).subscribe((points) => {
      this.cx!.clearRect(0, 0, canvas.width, canvas.height);
      this.cx!.canvas.width = this.cx!.canvas.width;
      for (const point of points) {
        this.draw(point.x, point.y);
        this.cx!.fillStyle = '#FF0000';
        this.cx!.fillRect(point.x, point.y, 5, 5);
        this.cx!.fillStyle = '#000000';
      }
    });
    this.openVectorizeDialog();
  }

  openVectorizeDialog(): void {
    const dialogRef = this.dialog.open(VectorizeDialogComponent, {
      width: '300px',
      data: {message: "Write what have you drawn"}
    });

    dialogRef.afterClosed().subscribe(userInput => {
      this.refreshClicked();
    });
  }

  settingsClicked(): void {
    const dialogRef = this.dialog.open(SettingsDialogComponent,{
      width: '300px',
      data: {message: "Settings required for learning"}
    });
    dialogRef.afterClosed().subscribe(userInput => {
    });
  }

  trainClicked() {
    this.neuralNetworkService.learn();
    this.neuralNetworkService.isLearning$.subscribe((isLearning) => {
      this.router.navigate([], {
        relativeTo: this.route,
        queryParams: {
          recognize: !isLearning
        }
      })
    });
  }

  recogniseClicked() {
    this.neuralNetworkService.recognise();
    const dialogRef = this.dialog.open(RecogniseDialogComponent, {
      width: '300px',
      data: { symbol: this.neuralNetworkService.recogniseSymbol() } // Pass the symbol to the dialog
    });
    dialogRef.afterClosed().subscribe(userInput => {
    });
    this.refreshClicked();
  }
}

