declare module "@mhf/date-picker/build/date-picker" {
  export interface DatePicker extends HTMLElement {
    activeDate?: string | Date;
  }
}

declare namespace JSX {
  interface IntrinsicElements {
    "date-picker": React.DetailedHTMLProps<
      React.HTMLAttributes<HTMLElement>,
      HTMLElement
    > & {
      solar?: boolean;
    };
  }
}
