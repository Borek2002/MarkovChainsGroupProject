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
  private highlightedNodeSubject: Subject<string> = new Subject<string>();
  highlightedNode$ = this.highlightedNodeSubject.asObservable();
  private highlightedLinkSubject: Subject<{ source: string; target: string }> =
    new Subject<{ source: string; target: string }>();
  highlightedLink$ = this.highlightedLinkSubject.asObservable();

  constructor(private http: HttpClient) {}

  updateHighlightedNode(nodeId: string) {
    this.highlightedNodeSubject.next(nodeId);
  }

  updateHighlightedLink(source: string, target: string) {
    this.highlightedLinkSubject.next({ source, target });
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
