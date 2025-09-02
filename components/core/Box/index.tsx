import { ElementType, ReactElement, ComponentProps } from 'react';
export type ValidTags = keyof React.JSX.IntrinsicElements;

export interface BoxProps<T extends ValidTags = 'div'> {
  tag?: T;
  customRef?: ComponentProps<T>['ref'];
}

const Box = <T extends ValidTags = 'div'>({
  tag,
  customRef,
  ...props
}: BoxProps<T> & React.JSX.IntrinsicElements[T]): ReactElement => {
  const Tag = (tag || 'div') as ElementType;

  return <Tag {...props} />;
};

export default Box;
