import {AfterViewInit, Component, Injectable, Input, OnInit} from "@angular/core";
import {ClusterNode, DagreNodesOnlyLayout, Edge, Layout, Node} from "@swimlane/ngx-graph";
import {Subject} from "rxjs";
import {GraphDataService} from "../data-access/GraphDataService";
import * as shape from "d3-shape";

@Injectable({ providedIn: 'root' })
@Component({
    selector: "app-graph",
    styles: [`.graph-container {
        width: 100vw;
        height: 100vh;
    }`],
    templateUrl: `./graph.component.html`,
})
export class GraphComponent implements OnInit{

    protected readonly Math = Math;

    nodes: Node[] = [];
    links: Edge[] = [];

    layout: string | Layout = new DagreNodesOnlyLayout();
    curveType: string = 'curveBundle';
    curve: any = shape.curveBundle;

    draggingEnabled: boolean = true;
    panningEnabled: boolean = true;
    zoomEnabled: boolean = true;
    zoomSpeed: number = 0.1;
    minZoomLevel: number = 0.1;
    maxZoomLevel: number = 4.0;
    panOnZoom: boolean = false;
    autoZoom: boolean = false;
    autoCenter: boolean = false;

    update$: Subject<boolean> = new Subject();
    center$: Subject<boolean> = new Subject();
    zoomToFit$: Subject<boolean> = new Subject();

    private selectedSourceNode: Node | null = null;
    private selectedTargetNode: Node | null = null;
    private createEdgeMode: boolean = false;
    private selectedNode: Node | null = null;
    private selectedEdge: Edge | null = null;


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

    constructor(private graphDataService: GraphDataService) {}

    ngOnInit() {
        this.setInterpolationType(this.curveType);
        this.nodes = this.graphDataService.getNodes();
        this.links = this.graphDataService.getLinks();
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
                    id: 'edge' + (this.nodes.length + 1),
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
    }

    handleNodeMouseLeave(node: Node) {
        node.data.hover = false;
    }

    handleEdgeDoubleClick(edge: Edge) {
        this.selectedEdge = edge;
    }

    getLineWidth(label: string): number {
        const numberValue: number = parseFloat(label);
        return numberValue * 5;
    }

    toggleCreateEdgeMode(){
        this.createEdgeMode = !this.createEdgeMode;
    }

    updateGraph(){
        this.update$.next(true);
    }

    centerGraph(){
        this.center$.next(true);
    }

    zoomToFit(){
        this.zoomToFit$.next(true);
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
