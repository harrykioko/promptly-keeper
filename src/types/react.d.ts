import * as React from 'react';

declare module 'react' {
  // Event types
  export type FormEvent<T = Element> = React.SyntheticEvent<T, Event>;
  export type MouseEvent<T = Element> = React.SyntheticEvent<T, MouseEvent>;
  export type ChangeEvent<T = Element> = React.SyntheticEvent<T, Event>;
  export type KeyboardEvent<T = Element> = React.SyntheticEvent<T, KeyboardEvent>;
  
  // Component types
  export type ElementRef<T> = React.RefObject<T>;
  export type ComponentProps<T extends React.ElementType> = React.ComponentPropsWithoutRef<T>;
  export type ComponentPropsWithoutRef<T extends React.ElementType> = React.ComponentPropsWithoutRef<T>;
  export type HTMLAttributes<T> = React.HTMLAttributes<T>;
  export type ButtonHTMLAttributes<T> = React.ButtonHTMLAttributes<T>;
  export type TextareaHTMLAttributes<T> = React.TextareaHTMLAttributes<T>;
  export type ThHTMLAttributes<T> = React.ThHTMLAttributes<T>;
  export type TdHTMLAttributes<T> = React.TdHTMLAttributes<T>;
  
  // Other React types
  export type FunctionComponent<P = {}> = React.FC<P>;
  export type SVGAttributes<T> = React.SVGAttributes<T>;
  export type ReactNode = React.ReactNode;
  export type ReactElement<P = any> = React.ReactElement<P>;
  export type CSSProperties = React.CSSProperties;
  
  // React Hook
  export const useId: () => string;
}
