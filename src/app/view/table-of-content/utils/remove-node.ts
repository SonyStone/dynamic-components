export const removeNode = (node: Node): void => {
  if (node.parentNode !== null) {
    // We cannot use `Node.remove()` because of IE11.
    node.parentNode.removeChild(node);
  }
}