import {Injectable} from "@angular/core";
import {Edge, Graph, Node} from "@swimlane/ngx-graph";
import {HttpClient} from "@angular/common/http";
import {map} from "rxjs";

@Injectable({
  providedIn: 'root'
})
export class GraphDataService {
  private nodes: Node[] = [];
  private links: Edge[] = [];


  constructor(private http: HttpClient) {}

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
