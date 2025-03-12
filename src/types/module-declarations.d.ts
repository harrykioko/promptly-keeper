// Module declarations to fix linter errors
declare module 'react' {
  export function useState<T>(initialState: T | (() => T)): [T, (newState: T | ((prevState: T) => T)) => void];
  export const useEffect: any;
  export const useCallback: any;
  export const useMemo: any;
  export const useRef: any;
  export const createContext: any;
  export const useContext: any;
  export const Fragment: any;
  export const forwardRef: any;
  export const memo: any;
  export const Component: any;
}

declare module '@tanstack/react-query' {
  export class QueryClient {
    constructor(config?: any);
  }
  export function QueryClientProvider(props: any): any;
  export function useQuery(options: any): any;
  export function useMutation(options: any): any;
  export function useQueryClient(): any;
}

declare module '@/components/ui/use-toast' {
  export function useToast(): {
    toast: (options: any) => void;
  };
}

declare module '@/components/TagBadge' {
  export type TagType = string;
} 
