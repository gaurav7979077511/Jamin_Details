export default function TreeNode({ node, depth = 0 }) {
  return (
    <div className={depth > 0 ? 'ml-4 border-l border-slate-200 pl-4' : ''}>
      <div className="rounded-md border border-slate-200 bg-white px-3 py-2 shadow-sm">
        <p className="font-medium">{node.englishName}</p>
        <p className="text-sm text-slate-600">{node.hindiName}</p>
      </div>

      {node.children?.length > 0 && (
        <div className="mt-2 space-y-2">
          {node.children.map((child) => (
            <TreeNode
              key={`${node.englishName}-${child.englishName}`}
              node={child}
              depth={depth + 1}
            />
          ))}
        </div>
      )}
    </div>
  );
}
