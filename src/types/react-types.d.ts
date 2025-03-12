
import React from 'react';

// This file extends React types to fix import issues
declare module 'react' {
  export type FormEvent<T = Element> = React.FormEvent<T>;
  export type MouseEvent<T = Element, E = NativeMouseEvent> = React.MouseEvent<T, E>;
  export type ChangeEvent<T = Element> = React.ChangeEvent<T>;
  export type ComponentType<P = {}> = React.ComponentType<P>;
  export type SVGProps<T> = React.SVGProps<T>;
  export type ReactNode = React.ReactNode;
  export type ElementRef<T> = React.ElementRef<T>;
  export type ComponentPropsWithoutRef<T> = React.ComponentPropsWithoutRef<T>;
  export type HTMLAttributes<T> = React.HTMLAttributes<T>;
  export type ComponentProps<T> = React.ComponentProps<T>;
  export type ButtonHTMLAttributes<T> = React.ButtonHTMLAttributes<T>;
  export type KeyboardEvent<T = Element> = React.KeyboardEvent<T>;
  export type CSSProperties = React.CSSProperties;
  export type TextareaHTMLAttributes<T> = React.TextareaHTMLAttributes<T>;
  export type ThHTMLAttributes<T> = React.ThHTMLAttributes<T>;
  export type TdHTMLAttributes<T> = React.TdHTMLAttributes<T>;
  export type ReactElement<T = any> = React.ReactElement<T>;
}

// Add useId for older React versions
declare module 'react' {
  interface React {
    useId(): string;
  }
}
