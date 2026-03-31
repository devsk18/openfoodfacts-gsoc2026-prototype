import { render, type ComponentType } from 'preact';

export class Renderer {
  static mount<P extends object>(
    Component: ComponentType<P>,
    container: Element,
    props?: P
  ) {
    render(<Component {...(props ?? ({} as P))} />, container);
  }

  static unmount(container: Element) {
    render(null, container);
  }
}