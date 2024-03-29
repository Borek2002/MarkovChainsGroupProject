import {
    ChangeDetectorRef,
    Component,
    ElementRef,
    OnInit,
    ViewChild
} from '@angular/core';
import {
  Edge,
  Node,
} from '@swimlane/ngx-graph';
import {Subject} from "rxjs";
import {NavService} from "../component/nav/nav.service";
import {GraphDataService} from "src/app/graph/data-access/GraphDataService"
import {GraphComponent} from "./ui/graph.component";

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

  selectedSourceNode: Node | null = null;
  selectedTargetNode: Node | null = null;
  selectedNode: Node | null = null;
  selectedEdge: Edge | null = null;

  // Deklaracja obiektu Subject do wywoływania aktualizacji widoku
  private updateGraph$: Subject<boolean> = new Subject<boolean>();

  constructor(private cdr: ChangeDetectorRef, private navService: NavService, private graphDataService: GraphDataService) {}

  toggleSidebar() {
      this.sidebarOpened = !this.sidebarOpened;
  }


  ngOnInit() {
    this.navService.toggleSidebarEvent.subscribe(() => {
      this.toggleSidebar();
    });
  }


  setInterpolationType(curveType:any){
    this.graphComponent.setInterpolationType(curveType);
  }

  onCreateNodeClick() {
    // Dodaj nowy węzeł do struktury danych
    const newNode: Node = {
      id: '' + (this.graphDataService.getNodes().length + 1),
      label: 'S',
    };
    this.graphDataService.addNode(newNode);
    this.graphComponent.updateGraph();
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

  onCreateEdgeClick() {
    this.graphComponent.toggleCreateEdgeMode();
  }

  updateNodes(nodes: Node[]){
    this.graphDataService.updateNodes(nodes);
  }

  updateLinks(links: Edge[]){
    this.graphDataService.updateLinks(links);
  }

  onNodeClick(node: Node) {
    this.graphComponent.handleNodeClick(node);
  }

  onNodeDoubleClick(node: Node) {
    this.graphComponent.handleNodeDoubleClick(node);
  }

  onNodeMouseEnter(node: Node) {
    this.graphComponent.handleNodeMouseEnter(node);
  }

  onNodeMouseLeave(node: Node) {
    this.graphComponent.handleNodeMouseLeave(node);
  }

  onEdgeDoubleClick(edge: Edge) {
    this.graphComponent.handleEdgeDoubleClick(edge);
  }

  getLineWidth(label: string){
    this.graphComponent.getLineWidth(label);
  }

}
