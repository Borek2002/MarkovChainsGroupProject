import {ChangeDetectorRef, Component, ElementRef, OnInit, TemplateRef, ViewChild} from '@angular/core';
import { nodes, clusters, links } from './data';
import * as shape from 'd3-shape';
import {transition} from "d3-transition";
import { Edge, Node, ClusterNode, Layout } from '@swimlane/ngx-graph';
import {Subject} from "rxjs";

@Component({
  selector: 'app-graph',
  templateUrl: './graph.component.html',
  styleUrls: ['./graph.component.css']
})
export class GraphComponent implements OnInit{
  @ViewChild('graphContainer') graphContainer!: ElementRef;

  nodes: Node[] = nodes;
  clusters: ClusterNode[] = clusters;
  links: Edge[] = links;

  constructor(private cdr: ChangeDetectorRef) {}

  layout: string | Layout = 'dagre';
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
  curveType: string = 'Bundle';
  curve: any = shape.curveLinear;
  interpolationTypes = [
    'Bundle',
    'Cardinal',
    'Catmull Rom',
    'Linear',
    'Monotone X',
    'Monotone Y',
    'Natural',
    'Step',
    'Step After',
    'Step Before',
  ];

  draggingEnabled: boolean = true;
  panningEnabled: boolean = true;
  zoomEnabled: boolean = true;
  //isAddNodeEnabled: boolean = true;

  zoomSpeed: number = 0.1;
  minZoomLevel: number = 0.1;
  maxZoomLevel: number = 4.0;
  panOnZoom: boolean = true;

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

  ngOnInit() {
    this.setInterpolationType(this.curveType);
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
    if (curveType === 'Linear') {
      this.curve = shape.curveLinear;
    }
    if (curveType === 'Monotone X') {
      this.curve = shape.curveMonotoneX;
    }
    if (curveType === 'Monotone Y') {
      this.curve = shape.curveMonotoneY;
    }
    if (curveType === 'Natural') {
      this.curve = shape.curveNatural;
    }
    if (curveType === 'Step') {
      this.curve = shape.curveStep;
    }
    if (curveType === 'Step After') {
      this.curve = shape.curveStepAfter;
    }
    if (curveType === 'Step Before') {
      this.curve = shape.curveStepBefore;
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
      id: 'node' + (this.nodes.length + 1),
      label: 'New Node',
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
      } else if (
        !this.selectedTargetNode &&
        this.selectedSourceNode.id !== node.id
      ) {
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
}
