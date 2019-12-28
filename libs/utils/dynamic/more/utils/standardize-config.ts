import { Layout } from '../../layout.interface';

/**
 * Makes a copy of the config and adds any default required properties.
 */
export function standardizeConfig(layout: Layout): Layout {
  const children = layout?.children.map(standardizeConfig);

  return children
    ? {...layout, children}
    : {...layout};
}
