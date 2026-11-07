import { Children, cloneElement, isValidElement } from "react";

// Wraps every word in a masked span so headings can slide up word by word.
// Works through nested elements (e.g. <em>), so highlighted words keep their style.
// The parent needs the `data-split` attribute; it gets `is-in` when scrolled into view.
export default function Split({ children, step = 55 }) {
  const counter = { n: 0 };

  const walk = (node, path) => {
    if (typeof node === "string") {
      return node
        .split(/(\s+)/)
        .filter(Boolean)
        .map((tok, i) =>
          /^\s+$/.test(tok) ? (
            tok
          ) : (
            <span className="w" key={`${path}-${i}`}>
              <span className="wi" style={{ "--i": counter.n++, "--step": `${step}ms` }}>
                {tok}
              </span>
            </span>
          ),
        );
    }
    if (isValidElement(node)) {
      return cloneElement(
        node,
        { key: path },
        ...Children.toArray(node.props.children).map((c, i) => walk(c, `${path}.${i}`)),
      );
    }
    return node;
  };

  return <>{Children.toArray(children).map((c, i) => walk(c, String(i)))}</>;
}
