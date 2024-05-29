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
    });
  }

  protected readonly GraphComponent = GraphComponent;


  nextStateClicked() {
    const steps = 1; // Zawsze przekazujemy 1 krok
    this.http.post<any>('/markovchain/next-state', steps).subscribe(response => {
      this.previousState = this.currentState;
      this.currentState = response.toString();

      const previousNode = this.graph.nodes.find(node => node.id === this.previousState);
      const currentNode = this.graph.nodes.find(node => node.id === this.currentState);

      if (previousNode) {
        // Resetujemy kolor poprzedniego węzła
        previousNode.data.color = "#a8385d";
      }

      if (currentNode) {
        // Podświetlamy krawędź prowadzącą do nowego węzła
        const edge = this.graph.edges.find(edge => edge.source === this.previousState && edge.target === this.currentState);

        if (edge) {
          //edge.data.color = '#FFFF00'; // Podświetlamy krawędź na czerwono

          setTimeout(() => {
            // Gasimy krawędź po 2 sekundach
            //edge.data.color = 'gray';

            // Podświetlamy nowy węzeł
            const originalColor = currentNode.data.color;
            currentNode.data.color = '#FFFF00';


          }, this.speed/2);
        } else {
          // Jeśli nie znaleziono krawędzi, podświetlamy nowy węzeł od razu
          const originalColor = currentNode.data.color;
          currentNode.data.color = '#FFFF00';


        }
      }
    });
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
