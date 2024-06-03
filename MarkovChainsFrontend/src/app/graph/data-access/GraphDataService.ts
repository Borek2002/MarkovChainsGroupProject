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
  private highlightedNodeSubject: Subject<{ nodeId: string, color: string}> = new Subject<{ nodeId: string, color: string}>();
  highlightedNode$ = this.highlightedNodeSubject.asObservable();
  private highlightedLinkSubject: Subject<{ source: string; target: string; color: string }> =
    new Subject<{ source: string; target: string; color: string }>();
  highlightedLink$ = this.highlightedLinkSubject.asObservable();

  constructor(private http: HttpClient) {}

  updateHighlightedNode(nodeId: string, color: string) {
    this.highlightedNodeSubject.next({nodeId, color});
  }

  updateHighlightedLink(source: string, target: string, color: string) {
    this.highlightedLinkSubject.next({ source, target, color });
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
