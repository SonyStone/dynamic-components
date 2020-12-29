export interface Component {
  [key: string]: any;
  copy?(src: Component): void;
}
