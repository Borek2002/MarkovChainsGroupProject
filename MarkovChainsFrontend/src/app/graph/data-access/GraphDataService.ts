import {Injectable} from "@angular/core";
import {Edge, Node} from "@swimlane/ngx-graph";

@Injectable({
  providedIn: 'root'
})
export class GraphDataService {
  private nodes: Node[] = [];
  private links: Edge[] = [];

  constructor() {}

  getNodes(): Node[] {
    return this.nodes;
  }

  getLinks(): Edge[] {
    return this.links;
  }

  updateNodes(nodes: Node[]) {
    this.nodes = nodes;
  }

  updateLinks(links: Edge[]) {
    this.links = links;
  }

  addNode(newNode: Node) {
    this.nodes.push(newNode);
  }

  addEdge(newEdge: Edge) {
    this.links.push(newEdge);
  }

}
