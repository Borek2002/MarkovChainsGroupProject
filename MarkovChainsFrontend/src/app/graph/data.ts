import { Edge, Node, ClusterNode } from '@swimlane/ngx-graph';

export const nodes: Node[] = [
  {
    id: 'first',
    label: 'A',
  },
  {
    id: 'second',
    label: 'B',
  },
  {
    id: 'c1',
    label: 'C1',
  },
  {
    id: 'c2',
    label: 'C2',
  },
];

export const clusters: ClusterNode[] = [
];

export const links: Edge[] = [
  {
    id: 'a',
    source: 'second',
    target: 'first',
    label: 'is parent of',
  },
  {
    id: 'b',
    source: 'first',
    target: 'c1',
    label: 'placeholder',
  },
  {
    id: 'c',
    source: 'first',
    target: 'c1',
    label: 'custom label',
  },
  {
    id: 'd',
    source: 'first',
    target: 'c2',
    label: 'custom label',
  },
];
