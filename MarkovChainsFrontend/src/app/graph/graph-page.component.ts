import {
    ChangeDetectorRef,
    Component,
    ElementRef,
    OnInit,
    ViewChild
} from '@angular/core';
import {
    Edge, Graph,
    Node,
} from '@swimlane/ngx-graph';
import {Subject} from "rxjs";
import {NavService} from "../component/nav/nav.service";
import {GraphDataService} from "src/app/graph/data-access/GraphDataService"
import {GraphComponent} from "./ui/graph.component";
import {MatrixAndVectorService} from "../matrix/service/matrix-and-vector-service";
import {ActivatedRoute} from "@angular/router";

@Component({
  selector: 'app-graph-page',
  templateUrl: './graph-page.component.html',
  styleUrls: ['./graph-page.component.css']
})
export class GraphPageComponent implements OnInit{
  @ViewChild('graphContainer') graphContainer!: ElementRef;
  @ViewChild(GraphComponent) graphComponent!: GraphComponent;
  sidebarOpened: boolean = true;

  curveType: string = 'curveBundle';

  interpolationTypes = ['Bundle', 'Cardinal', 'Catmull Rom', 'Monotone X', 'Natural'];

  panOnZoom: boolean = false;
  autoZoom: boolean = false;
  autoCenter: boolean = false;

  selectedNode: Node | null = null;
  selectedEdge: Edge | null = null;

  graph: Graph = {
    nodes: [],
    edges: []
  }

  // Deklaracja obiektu Subject do wywoływania aktualizacji widoku
  private updateGraph$: Subject<boolean> = new Subject<boolean>();

  constructor(private cdr: ChangeDetectorRef, private navService: NavService, private graphDataService: GraphDataService, private matrixAndVectorService: MatrixAndVectorService) {}

  toggleSidebar() {
      this.sidebarOpened = !this.sidebarOpened;
  }


  ngOnInit() {
    this.navService.toggleSidebarEvent.subscribe(() => {
      this.toggleSidebar();
    });
  }

  getMatrixAndVector(){
    this.graphComponent.getMatrixAndVector();
  }

  setInterpolationType(curveType:any){
    this.graphComponent.setInterpolationType(curveType);
  }

  updateGraph(){
    this.graphComponent.updateGraph();
  }

  centerGraph(){
    this.graphComponent.centerGraph();
  }

  zoomToFit(){
    this.graphComponent.zoomToFit();
  }

  updateGraphData() {
    this.matrixAndVectorService.getMatrixAndVector().subscribe(data => {
      this.graph = data;
    })
  }

  protected readonly GraphComponent = GraphComponent;
}
