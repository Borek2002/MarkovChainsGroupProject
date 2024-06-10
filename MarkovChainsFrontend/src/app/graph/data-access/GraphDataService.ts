import { Injectable } from '@angular/core';
import { Edge, Graph, Node } from '@swimlane/ngx-graph';
import { HttpClient } from '@angular/common/http';
import { Subject, map } from 'rxjs';
import { TagContentType } from '@angular/compiler';

@Injectable({
  providedIn: 'root',
})
export class GraphDataService {
  private nodes: Node[] = [];
  private links: Edge[] = [];
  private highlightedNodeSubject: Subject<{ nodeId: string, color: string, isSimulation: boolean }> = new Subject<{ nodeId: string, color: string, isSimulation: boolean }>();
  highlightedNode$ = this.highlightedNodeSubject.asObservable();

  private highlightedLinkSubject: Subject<{ source: string; target: string; color: string, isSimulation: boolean }> = new Subject<{ source: string; target: string; color: string, isSimulation: boolean }>();
  highlightedLink$ = this.highlightedLinkSubject.asObservable();


  constructor(private http: HttpClient) {}

  // Emitowanie danych dla podświetlenia przez symulację
  highlightNode(nodeId: string, color: string) {
    this.highlightedNodeSubject.next({nodeId, color, isSimulation: true });
  }

  highlightEdge(source: string, target: string, color: string) {
    this.highlightedLinkSubject.next({ source, target, color, isSimulation: true });
  }

  // Emitowanie danych dla podświetlenia przez najechanie kursorem
  hoverNode(nodeId: string, color: string) {
    this.highlightedNodeSubject.next({nodeId, color, isSimulation: false });
  }

  hoverEdge(source: string, target: string, color: string) {
    this.highlightedLinkSubject.next({ source, target, color, isSimulation: false });
  }


  getNodes(): Node[] {
    return this.nodes;
  }

  getLinks(): Edge[] {
    return this.links;
  }

  updateGraphData(graph: Graph) {
    this.nodes = graph.nodes;
    this.links = graph.edges;
  }

  addNode(newNode: Node) {
    this.nodes.push(newNode);
  }

  addEdge(newEdge: Edge) {
    this.links.push(newEdge);
  }
}
