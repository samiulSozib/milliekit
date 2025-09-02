// React Imports
import type { ReactNode } from 'react';

export interface SimpleObject<T = unknown> {
  [k: string]: T;
}

// eslint-disable-next-line @typescript-eslint/no-unsafe-function-type, @typescript-eslint/no-explicit-any
export type ArgumentType<F extends Function> = F extends (...args: infer A) => any ? A[0] : never;

export type EmptyObject = Record<string, never>;

export type SimpleFunction = () => void;

export type QueriesType = SimpleObject<string | number | undefined | (string | undefined)[]>;

export type Mode = 'system' | 'light' | 'dark';

export type SystemMode = 'light' | 'dark';

export type Direction = 'ltr' | 'rtl';

export type ChildrenType = {
  children: ReactNode;
};

export type GetListExtraDataType = {
  current_page: number;
  last_page: number;
  total: number;
};

// eslint-disable-next-line @typescript-eslint/no-explicit-any
export type ServerGetListResponseType<T extends Record<string, any>> = {
  items: T[];
  data: GetListExtraDataType;
};

export type ServerEntityGetDetailsResponseType<T> = {
  item: T;
};

