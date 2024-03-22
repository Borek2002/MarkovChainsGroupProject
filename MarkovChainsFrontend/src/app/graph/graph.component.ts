import {ChangeDetectorRef, Component, ElementRef, OnInit, TemplateRef, ViewChild} from '@angular/core';
import { nodes, clusters, links } from './data';
import * as shape from 'd3-shape';
import {
  Edge,
  Node,
  ClusterNode,
  Layout,
  DagreLayout,
  DagreNodesOnlyLayout,
  Graph,
  D3ForceDirectedLayout, ColaForceDirectedLayout
} from '@swimlane/ngx-graph';
import {Subject} from "rxjs";
import {NavService} from "../component/nav/nav.service";
import {MatrixEditComponent} from "../matrix/view/matrix-edit/matrix-edit.component";

@Component({
  selector: 'app-graph',
  templateUrl: './graph.component.html',
  styleUrls: ['./graph.component.css']
})
export class GraphComponent implements OnInit{
  @ViewChild('graphContainer') graphContainer!: ElementRef;
  sidebarOpened: boolean = true;
  protected readonly Math = Math;

  nodes: Node[] = nodes;
  clusters: ClusterNode[] = clusters;
  links: Edge[] = links;
  constructor(private cdr: ChangeDetectorRef, private navService: NavService) {}

  updateNodes(nodes: any[]) {
    this.nodes = nodes;
    // Optionally, perform any additional logic if needed
  }

  // Method to handle links updated event
  updateLinks(links: any[]) {
    this.links = links;
    // Optionally, perform any additional logic if needed
  }

  toggleSidebar() {
    this.sidebarOpened = !this.sidebarOpened;
  }

  layout: string | Layout = 'd3ForceDirected';

  layouts: any[] = [
    {
      label: 'Dagre',
      value: 'dagre',
    },
    {
      label: 'Dagre Cluster',
      value: 'dagreCluster',
      isClustered: true,
    },
    {
      label: 'Cola Force Directed',
      value: 'colaForceDirected',
      isClustered: true,
    },
    {
      label: 'D3 Force Directed',
      value: 'd3ForceDirected',
    },
  ];

  // line interpolation
  curveType: string = 'curveBundle';
  curve: any = shape.curveBundle;
  interpolationTypes = [
    'Bundle',
    'Cardinal',
    'Catmull Rom',
    'Monotone X',
    'Natural',
  ];

  draggingEnabled: boolean = true;
  panningEnabled: boolean = true;
  zoomEnabled: boolean = true;
  //isAddNodeEnabled: boolean = true;

  zoomSpeed: number = 0.1;
  minZoomLevel: number = 0.1;
  maxZoomLevel: number = 4.0;


  panOnZoom: boolean = false;
  autoZoom: boolean = false;
  autoCenter: boolean = false;

  update$: Subject<boolean> = new Subject();
  center$: Subject<boolean> = new Subject();
  zoomToFit$: Subject<boolean> = new Subject();

  isAddEdgeEnabled: boolean = false;
  selectedSourceNode: Node | null = null;
  selectedTargetNode: Node | null = null;
  selectedNode: Node | null = null;
  selectedEdge: Edge | null = null;

  // Deklaracja zmiennych dla operacji przeciągania
  private dragging: boolean = false;
  private lastDraggedPosition: [number, number] = [0, 0];

  // Deklaracja obiektu Subject do wywoływania aktualizacji widoku
  private updateGraph$: Subject<boolean> = new Subject<boolean>();


  ngOnInit() {
    this.setInterpolationType(this.curveType);
    this.navService.toggleSidebarEvent.subscribe(() => {
      this.toggleSidebar();
    });
  }

  // Funkcja wywoływana przy rozpoczęciu operacji przeciągania
  onDraggingStart(event: any): void {
    this.dragging = true;
    console.log("poczatek przesuwania")
  }

  // Funkcja wywoływana w trakcie operacji przeciągania węzła
  onDraggingNode(event: any): void {
    this.updateGraph$.next(true);
  }

  onDraggingEnd(event: any): void {
    this.dragging = false;
    this.lastDraggedPosition = [event.transform.x, event.transform.y];
    this.updateGraph$.next(true);
  }

  setInterpolationType(curveType:any) {
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

  setLayout(layoutName: string): void {
    const layout = this.layouts.find((l) => l.value === layoutName);
    this.layout = layoutName;
    if (!layout.isClustered) {
      this.clusters = [];
    } else {
      this.clusters = clusters;
    }
  }

  addNode() {
    /*if (this.isAddNodeEnabled) {
      // Pobierz pozycję kliknięcia myszką względem elementu, na którym wystąpiło zdarzenie
      const xPos = event.offsetX;
      const yPos = event.offsetY;*/

    // Dodaj nowy węzeł do struktury danych
    const newNode: Node = {
      id: '' + (this.nodes.length + 1),
      label: 'S',
      //position: { x: xPos, y: yPos },
    };
    this.nodes.push(newNode);
    this.update$.next(true);
    //}
  }
  addEdge() {
    this.isAddEdgeEnabled = true;
  }

  onNodeClick(node: Node) {
    if (this.isAddEdgeEnabled) {
      if (!this.selectedSourceNode) {
        // Ustaw bieżący węzeł jako źródło
        this.selectedSourceNode = node;
        this.selectedSourceNode.data.color = '#069d0c';
      }
      else
      {
        // Ustaw bieżący węzeł jako cel, jeśli różni się od źródła
        this.selectedTargetNode = node;

        // Dodaj nową krawędź
        const newEdge: Edge = {
          id: 'edge' + (this.links.length + 1),
          source: this.selectedSourceNode.id,
          target: this.selectedTargetNode.id,
        };
        this.links.push(newEdge);
        this.update$.next(true);

        // Zresetuj wybór węzłów i wyłącz tryb dodawania krawędzi
        this.selectedSourceNode = null;
        this.selectedTargetNode = null;
        this.isAddEdgeEnabled = false;
      }
    }
  }

  onNodeDoubleClick(node: Node) {
    this.selectedNode = node;
  }

  onNodeMouseEnter(node: Node){
    node.data.hover = true;
  }

  onNodeMouseLeave(node: Node){
    node.data.hover = false;
  }

  onEdgeDoubleClick(edge: Edge) {
    this.selectedEdge = edge;
  }


  updateNodeLabel(newLabel: string) {
    if (this.selectedNode) {
      this.selectedNode.label = newLabel;
      this.selectedNode = null;
    }
  }

  updateEdgeLabel(newLabel: string) {
    if (this.selectedEdge) {
      this.selectedEdge.label = newLabel;
      this.selectedEdge = null;
    }
  }

  getLineWidth(label: string): number {
    const numberValue: number = parseFloat(label);
    return numberValue * 5;
  }

}
