export const flattenTree = (root) => {
  const people = [];

  const dfs = (node, parentId = null) => {
    const children = node.children || [];
    people.push({
      _id: node.id,
      name: node.name,
      hindiName: node.hindiName || '',
      isLate: Boolean(node.isLate),
      isRoot: Boolean(node.isRoot),
      parentId,
      childrenIds: children.map((child) => child.id),
      isDeleted: false
    });

    for (const child of children) dfs(child, node.id);
  };

  dfs(root, null);
  return people;
};
