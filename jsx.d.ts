declare namespace React {
  declare namespace JSX {
    type Elm = React.HTMLAttributes<HTMLElement> & { class?: string };
    interface IntrinsicElements {
      [elemName: string]: React.DetailedHTMLProps<Elm, HTMLElement>,
    }
  }
}
