/**
 * get selected menu key path
 * @param selectedKey
 * @param menus
 */
export function getSelectedMenuKeyPath(selectedKey: string, menus: App.Global.AntdMenu[]) {
  const keyPath: string[] = [];

  menus.some(menu => {
    const path = findTreePath(selectedKey, menu as TreeNode);

    const find = Boolean(path?.length);

    if (find) {
      keyPath.push(...path!);
    }

    return find;
  });

  return keyPath;
}

interface TreeNode {
  key: string;
  children?: TreeNode[];
}

function findTreePath(targetKey: string, tree: TreeNode): string[] | null {
  const path: string[] = [];

  function dfs(node: TreeNode): boolean {
    path.push(node.key);

    if (node.key === targetKey) {
      return true;
    }

    if (node.children) {
      for (const child of node.children) {
        if (dfs(child)) {
          return true;
        }
      }
    }

    path.pop();

    return false;
  }

  if (dfs(tree)) {
    return path;
  }

  return null;
}
