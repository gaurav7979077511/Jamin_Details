import dagre from 'dagre';

export const buildMaps = (members) => {
  const byId = new Map(members.map((m) => [m._id, m]));
  const childrenMap = new Map();
  members.forEach((m) => childrenMap.set(m._id, []));
  members.forEach((m) => {
    if (m.parentId && childrenMap.has(m.parentId)) childrenMap.get(m.parentId).push(m._id);
  });
  return { byId, childrenMap };
};

export const getVisibleIds = (rootId, childrenMap, collapsed) => {
  const visible = [];
  const stack = [rootId];
  while (stack.length) {
    const id = stack.pop();
    visible.push(id);
    if (collapsed[id]) continue;
    const children = childrenMap.get(id) || [];
    for (let i = children.length - 1; i >= 0; i--) stack.push(children[i]);
  }
  return visible;
};

export const makeFlow = (members, collapsed, distributions = {}) => {
  const { byId, childrenMap } = buildMaps(members);
  const root = members.find((m) => m.isRoot) || members[0];
  if (!root) return { nodes: [], edges: [] };
  const visibleIds = new Set(getVisibleIds(root._id, childrenMap, collapsed));

  const nodes = [];
  const edges = [];

  visibleIds.forEach((id) => {
    const person = byId.get(id);
    nodes.push({ id, data: { person, share: distributions[id] || 0 }, position: { x: 0, y: 0 }, type: 'default' });
  });

  members.forEach((m) => {
    if (m.parentId && visibleIds.has(m._id) && visibleIds.has(m.parentId)) {
      edges.push({ id: `${m.parentId}-${m._id}`, source: m.parentId, target: m._id, animated: false });
    }
  });

  const g = new dagre.graphlib.Graph();
  g.setDefaultEdgeLabel(() => ({}));
  g.setGraph({ rankdir: 'TB' });

  nodes.forEach((node) => g.setNode(node.id, { width: 240, height: 110 }));
  edges.forEach((edge) => g.setEdge(edge.source, edge.target));
  dagre.layout(g);

  nodes.forEach((node) => {
    const p = g.node(node.id);
    node.position = { x: p.x, y: p.y };
  });

  return { nodes, edges, allIds: members.map((m) => m._id) };
};
