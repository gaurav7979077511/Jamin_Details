export const buildChildrenMap = (people) => {
  const map = new Map();
  for (const person of people) map.set(person._id, []);
  for (const person of people) {
    if (person.parentId && map.has(person.parentId)) {
      map.get(person.parentId).push(person._id);
    }
  }
  return map;
};

export const distributeDown = (nodeId, value, childrenMap, acc) => {
  const children = childrenMap.get(nodeId) || [];
  acc[nodeId] = (acc[nodeId] || 0) + value;
  if (!children.length) return;
  const share = value / children.length;
  for (const childId of children) distributeDown(childId, share, childrenMap, acc);
};

export const aggregateUp = (nodeId, value, parentMap, acc) => {
  acc[nodeId] = (acc[nodeId] || 0) + value;
  const parentId = parentMap.get(nodeId);
  if (parentId) aggregateUp(parentId, value, parentMap, acc);
};

export const recalculateTree = (rootId, totalRakba, people) => {
  const childrenMap = buildChildrenMap(people);
  const result = {};
  distributeDown(rootId, totalRakba, childrenMap, result);
  return result;
};
