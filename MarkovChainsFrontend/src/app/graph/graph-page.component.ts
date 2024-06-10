import {
  ChangeDetectorRef,
  Component,
  ElementRef,
  OnInit,
  ViewChild,
  OnDestroy
} from '@angular/core';
import { Edge, Graph, Node } from '@swimlane/ngx-graph';
import { Subject } from 'rxjs';
import { NavService } from '../component/nav/nav.service';
import { GraphDataService } from 'src/app/graph/data-access/GraphDataService';
import { GraphComponent } from './ui/graph.component';
import { MatrixAndVectorService } from '../matrix/service/matrix-and-vector-service';
import { interval, Subscription } from 'rxjs';
import { HttpClient } from '@angular/common/http';

@Component({
  selector: 'app-graph-page',
  templateUrl: './graph-page.component.html',
  styleUrls: ['./graph-page.component.css'],
})
export class GraphPageComponent implements OnInit {
  @ViewChild('graphContainer') graphContainer!: ElementRef;
  @ViewChild(GraphComponent) graphComponent!: GraphComponent;
  sidebarOpened: boolean = true;
  //currentState: string = "1";

  SimulationIsExpanded = false;
  autoStepActive: boolean = false;
  speed: number = 5000; // Default speed in ms (5 second)
  autoStepSubscription: Subscription | null = null;

  currentState: string = "1";
  previousState: string = "1";
  highlightedEdge: string = "1";

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

  constructor(private cdr: ChangeDetectorRef, private navService: NavService, private graphDataService: GraphDataService, private matrixAndVectorService: MatrixAndVectorService, private http: HttpClient) {}

  toggleSidebar() {
      this.sidebarOpened = !this.sidebarOpened;
  }

    toggleSimulation() {
      this.SimulationIsExpanded = true;
    }

  ngOnInit() {
    this.navService.toggleSidebarEvent.subscribe(() => {
      this.toggleSidebar();
    });
  }

  getNodesAndEdges() {
    this.graphComponent.getNodesAndEdges();
  }

  setInterpolationType(curveType: any) {
    this.graphComponent.setInterpolationType(curveType);
  }

  updateGraph() {
    this.graphComponent.updateGraph();
  }

  centerGraph() {
    this.graphComponent.centerGraph();
  }

  zoomToFit() {
    this.graphComponent.zoomToFit();
  }

  updateGraphData() {
    this.matrixAndVectorService.getNodesAndEdges().subscribe((data) => {
      this.graph = data;

      this.currentState = "";
      this.previousState = "";
      this.highlightedEdge = "";
    });
  }

  protected readonly GraphComponent = GraphComponent;


  nextStateClicked() {
    if(!this.graphComponent.highlightedInSimulation){
        const steps = 1; // Zawsze przekazujemy 1 krok

        this.http.post<any>('/markovchain/next-state', steps).subscribe(response => {
          this.updateState(response.toString());
        });
    }

  }

  updateState(newState: string) {
    this.previousState = this.currentState;
    this.currentState = newState;

    this.resetPreviousNodeColor();
    this.highlightCurrentNode();
  }

  resetPreviousNodeColor() {
    const previousNode = this.graph.nodes.find(node => node.id === this.previousState);
    if (previousNode) {
      previousNode.data.color = "#a8385d";
      this.graphDataService.highlightNode('-1', '');
    }
  }

  highlightCurrentNode() {
    const currentNode = this.graph.nodes.find(node => node.id === this.currentState);
    if (currentNode) {
      const currentEdge = this.graph.edges.find(edge => edge.source === this.previousState && edge.target === this.currentState);

      if (currentEdge) {
        this.highlightEdgeAndNode(currentEdge, currentNode);
      } else {
        this.highlightNode(currentNode);
      }
    }
  }

  highlightEdgeAndNode(edge: any, node: any) {
    this.graphComponent.highlightedInSimulation = true;
    this.graphComponent.highlightedEdge = edge;
    this.graphDataService.highlightEdge(edge.source, edge.target, this.graphComponent.color1);

    setTimeout(() => {
      this.graphComponent.highlightedInSimulation = false;
      this.graphComponent.highlightedEdge = null;
      this.graphDataService.highlightEdge('-1', '-1', '');
      this.highlightNode(node);
    }, this.speed / 2);
  }

  highlightNode(node: any) {
    const originalColor = node.data.color;
    node.data.color = this.graphComponent.color1;
    this.graphDataService.highlightNode(node.id, this.graphComponent.color1);
  }


  toggleAutoStep() {
      this.autoStepActive = !this.autoStepActive;
      if (this.autoStepActive) {
        this.startAutoStep();
      } else {
        this.stopAutoStep();
      }
    }

    startAutoStep() {
      this.autoStepSubscription = interval(this.speed).subscribe(() => this.nextStateClicked());
    }

    stopAutoStep() {
      if (this.autoStepSubscription) {
        this.autoStepSubscription.unsubscribe();
      }
    }

    updateSpeed(event: any) {
      this.speed = 10000 / event.target.value; // Przeliczanie wartości suwaka na prędkość
      if (this.autoStepActive) {
        this.stopAutoStep();
        this.startAutoStep();
      }
    }

    ngOnDestroy() {
      if (this.autoStepSubscription) {
        this.autoStepSubscription.unsubscribe();
      }
    }

}
