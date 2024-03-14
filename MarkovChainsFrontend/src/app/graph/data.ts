import { Edge, Node, ClusterNode } from '@swimlane/ngx-graph';
import {color} from "d3";

export const nodes: Node[] = [
  {
    id: '1',
    label: 'S',
  },
  {
    id: '2',
    label: 'S',
  },
  {
    id: '3',
    label: 'S',
  },
  {
    id: '4',
    label: 'S',
  },
];

export const clusters: ClusterNode[] = [
];

export const links: Edge[] = [
  {
    id: 'E1',
    source: '2',
    target: '1',
    label: '0.4',
  },
  {
    id: 'E2',
    source: '1',
    target: '3',
    label: '0.5',
  },
  {
    id: 'E3',
    source: '1',
    target: '3',
    label: '0.1',
  },
  {
    id: 'E4',
    source: '1',
    target: '4',
    label: '0.3',
  },
];
