import {
  AfterViewInit,
  Component,
  EventEmitter,
  Injectable,
  Input,
  OnDestroy,
  OnInit,
  Output,
} from '@angular/core';
import {
  ClusterNode,
  DagreNodesOnlyLayout,
  Edge,
  Graph,
  Layout,
  Node,
} from '@swimlane/ngx-graph';
import { Subject, Subscription } from 'rxjs';
import { GraphDataService } from '../data-access/GraphDataService';
import * as shape from 'd3-shape';
import { MatrixAndVectorService } from '../../matrix/service/matrix-and-vector-service';

@Injectable({ providedIn: 'root' })
@Component({
  selector: 'app-graph',
  styles: [
    `
      .graph-container {
        width: 100vw;
        height: 100vh;
      }
    `,
  ],
  templateUrl: `./graph.component.html`,
})
export class GraphComponent implements OnInit, OnDestroy, AfterViewInit {
  protected readonly Math = Math;

  @Input({ required: true }) graph: Graph = {
    nodes: [],
    edges: [],
  };

  private graphUpdateSubscription?: Subscription;

  layout: string | Layout = new DagreNodesOnlyLayout();
  curveType: string = 'curveBundle';
  curve: any = shape.curveBundle;

  draggingEnabled: boolean = true;
  panningEnabled: boolean = true;
  zoomEnabled: boolean = true;
  zoomSpeed: number = 0.1;
  minZoomLevel: number = 0.1;
  maxZoomLevel: number = 4.0;
  @Input() panOnZoom: boolean = false;
  @Input() autoZoom: boolean = false;
  @Input() autoCenter: boolean = false;

  update$: Subject<boolean> = new Subject();
  center$: Subject<boolean> = new Subject();
  zoomToFit$: Subject<boolean> = new Subject();

  private selectedSourceNode: Node | null = null;
  private selectedTargetNode: Node | null = null;
  private createEdgeMode: boolean = false;
  private selectedNode: Node | null = null;
  private selectedEdge: Edge | null = null;

  hoveredEdge: Edge | null = null;
  @Output() nodeHover: EventEmitter<string> = new EventEmitter<string>();
  @Output() edgeHover: EventEmitter<string> = new EventEmitter<string>();

  setInterpolationType(curveType: any) {
    this.curveType = curveType;
    if (curveType === 'Bundle') {
      this.curve = shape.curveBundle.beta(1);
    }
    if (curveType === 'Cardinal') {
      this.curve = shape.curveCardinal;
    }
    if (curveType === 'Catmull Rom') {
      this.curve = shape.curveCatmullRom;
    }
    if (curveType === 'Monotone X') {
      this.curve = shape.curveMonotoneX;
    }
    if (curveType === 'Natural') {
      this.curve = shape.curveNatural;
    }
  }

  constructor(
    private graphDataService: GraphDataService,
    private matrixAndVectorService: MatrixAndVectorService
  ) {}

  ngOnInit() {
    this.setInterpolationType(this.curveType);
    this.getNodesAndEdges();
  }

  ngAfterViewInit() {
    this.center$.next(true);
  }

  ngOnDestroy(): void {
    this.graphUpdateSubscription?.unsubscribe();
  }

  handleNodeClick(node: Node) {
    if (this.createEdgeMode) {
      if (!this.selectedSourceNode) {
        // Ustaw bieżący węzeł jako źródło
        this.selectedSourceNode = node;
        this.selectedSourceNode.data.color = '#069d0c';
      } else {
        // Ustaw bieżący węzeł jako cel, jeśli różni się od źródła
        this.selectedTargetNode = node;

        // Dodaj nową krawędź
        const newEdge: Edge = {
          id: 'edge' + (this.graph.nodes.length + 1),
          source: this.selectedSourceNode.id,
          target: this.selectedTargetNode.id,
        };
        this.graphDataService.addEdge(newEdge);
        this.update$.next(true);

        // Zresetuj wybór węzłów i wyłącz tryb dodawania krawędzi
        this.selectedSourceNode = null;
        this.selectedTargetNode = null;
        this.createEdgeMode = false;
      }
    }
  }

  handleNodeDoubleClick(node: Node) {
    this.selectedNode = node;
  }

  handleNodeMouseEnter(node: Node) {
    node.data.hover = true;
    this.graphDataService.updateHighlightedNode(node.id);
  }

  handleNodeMouseLeave(node: Node) {
    node.data.hover = false;
    this.graphDataService.updateHighlightedNode('-1');
  }

  handleEdgeDoubleClick(edge: Edge) {
    this.selectedEdge = edge;
  }

  handleEdgeMouseEnter(edge: Edge) {
    this.hoveredEdge = edge;
    this.graphDataService.updateHighlightedLink(edge.source, edge.target);
  }

  handleEdgeMouseLeave(edge: Edge) {
    this.hoveredEdge = null;
    this.graphDataService.updateHighlightedLink('-1', '-1');
  }

  getLineWidth(label: string): number {
    const numberValue: number = parseFloat(label);
    return numberValue * 5;
  }

  toggleCreateEdgeMode() {
    this.createEdgeMode = !this.createEdgeMode;
  }

  updateGraph() {
    this.update$.next(true);
  }

  centerGraph() {
    this.center$.next(true);
  }

  zoomToFit() {
    this.zoomToFit$.next(true);
  }

  getNodesAndEdges() {
    this.matrixAndVectorService.getNodesAndEdges().subscribe((data) => {
      this.graph.nodes = data.nodes;
      this.graph.edges = data.edges;
      this.update$.next(true);
    });
  }
}
