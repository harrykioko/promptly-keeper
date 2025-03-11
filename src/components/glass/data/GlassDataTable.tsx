import React, { useState, useMemo } from 'react';
import { cn } from '@/lib/utils';
import { ChevronDown, ChevronUp, ChevronsUpDown, ArrowUpDown } from 'lucide-react';

export interface Column<T> {
  id: string;
  header: string | JSX.Element;
  accessorKey?: keyof T;
  accessorFn?: (row: T) => any;
  cell?: (info: { row: T; value: any }) => JSX.Element | string | number | null;
  enableSorting?: boolean;
  className?: string;
}

interface GlassDataTableProps<T> {
  data: T[];
  columns: Column<T>[];
  className?: string;
  enableSorting?: boolean;
  enablePagination?: boolean;
  pageSize?: number;
  emptyMessage?: string;
  isLoading?: boolean;
  loadingRows?: number;
  rowClassName?: string | ((row: T, index: number) => string);
  headerClassName?: string;
  bodyClassName?: string;
  footerClassName?: string;
  onRowClick?: (row: T) => void;
}

export function GlassDataTable<T>({
  data,
  columns,
  className = '',
  enableSorting = true,
  enablePagination = true,
  pageSize = 10,
  emptyMessage = 'No data available',
  isLoading = false,
  loadingRows = 5,
  rowClassName,
  headerClassName,
  bodyClassName,
  footerClassName,
  onRowClick,
}: GlassDataTableProps<T>) {
  const [sorting, setSorting] = useState<{ id: string; desc: boolean } | null>(null);
  const [currentPage, setCurrentPage] = useState(1);

  // Sort data if sorting is enabled and a column is selected for sorting
  const sortedData = useMemo(() => {
    if (!sorting || !enableSorting) return data;

    return [...data].sort((a, b) => {
      const column = columns.find(col => col.id === sorting.id);
      if (!column) return 0;

      let valueA, valueB;

      if (column.accessorFn) {
        valueA = column.accessorFn(a);
        valueB = column.accessorFn(b);
      } else if (column.accessorKey) {
        valueA = a[column.accessorKey];
        valueB = b[column.accessorKey];
      } else {
        return 0;
      }

      // Handle different value types
      if (valueA === valueB) return 0;
      
      if (valueA === null || valueA === undefined) return sorting.desc ? 1 : -1;
      if (valueB === null || valueB === undefined) return sorting.desc ? -1 : 1;
      
      if (typeof valueA === 'string' && typeof valueB === 'string') {
        return sorting.desc 
          ? valueB.localeCompare(valueA) 
          : valueA.localeCompare(valueB);
      }
      
      return sorting.desc 
        ? (valueB < valueA ? -1 : 1)
        : (valueA < valueB ? -1 : 1);
    });
  }, [data, columns, sorting, enableSorting]);

  // Paginate data if pagination is enabled
  const paginatedData = useMemo(() => {
    if (!enablePagination) return sortedData;
    
    const startIndex = (currentPage - 1) * pageSize;
    return sortedData.slice(startIndex, startIndex + pageSize);
  }, [sortedData, currentPage, pageSize, enablePagination]);

  // Calculate total pages
  const totalPages = useMemo(() => {
    if (!enablePagination) return 1;
    return Math.max(1, Math.ceil(sortedData.length / pageSize));
  }, [sortedData.length, pageSize, enablePagination]);

  // Handle sorting
  const handleSort = (columnId: string) => {
    if (!enableSorting) return;
    
    const column = columns.find(col => col.id === columnId);
    if (!column || column.enableSorting === false) return;

    setSorting(prev => {
      if (prev?.id !== columnId) return { id: columnId, desc: false };
      if (prev.desc) return null;
      return { id: columnId, desc: true };
    });
  };

  // Handle page change
  const handlePageChange = (page: number) => {
    setCurrentPage(Math.max(1, Math.min(page, totalPages)));
  };

  // Get cell value
  const getCellValue = (row: T, column: Column<T>) => {
    if (column.cell) {
      const value = column.accessorKey 
        ? row[column.accessorKey] 
        : column.accessorFn 
          ? column.accessorFn(row) 
          : undefined;
      
      return column.cell({ row, value });
    }

    if (column.accessorFn) {
      return column.accessorFn(row);
    }

    if (column.accessorKey) {
      return row[column.accessorKey];
    }

    return null;
  };

  // Get sort icon
  const getSortIcon = (columnId: string) => {
    if (!sorting || sorting.id !== columnId) {
      return <ChevronsUpDown className="h-4 w-4 text-neutral-400" />;
    }
    
    return sorting.desc 
      ? <ChevronDown className="h-4 w-4 text-primary-600" />
      : <ChevronUp className="h-4 w-4 text-primary-600" />;
  };

  // Render loading skeleton
  const renderLoadingSkeleton = () => {
    return Array.from({ length: loadingRows }).map((_, rowIndex) => (
      <tr key={`loading-row-${rowIndex}`} className="animate-pulse">
        {columns.map((column, colIndex) => (
          <td 
            key={`loading-cell-${rowIndex}-${colIndex}`}
            className={cn(
              'px-4 py-3 border-b border-neutral-200/50',
              column.className
            )}
          >
            <div className="h-4 bg-neutral-200/70 rounded w-3/4" />
          </td>
        ))}
      </tr>
    ));
  };

  // Render pagination controls
  const renderPagination = () => {
    if (!enablePagination || totalPages <= 1) return null;

    return (
      <div className={cn(
        'flex items-center justify-between px-4 py-3 bg-white/50 backdrop-blur-sm border-t border-neutral-200/50 rounded-b-lg',
        footerClassName
      )}>
        <div className="flex-1 flex justify-between sm:hidden">
          <button
            onClick={() => handlePageChange(currentPage - 1)}
            disabled={currentPage === 1}
            className={cn(
              'relative inline-flex items-center px-4 py-2 text-sm font-medium rounded-md',
              'bg-white/70 backdrop-blur-sm border border-neutral-300',
              'text-neutral-700 hover:bg-neutral-50',
              currentPage === 1 && 'opacity-50 cursor-not-allowed'
            )}
          >
            Previous
          </button>
          <button
            onClick={() => handlePageChange(currentPage + 1)}
            disabled={currentPage === totalPages}
            className={cn(
              'ml-3 relative inline-flex items-center px-4 py-2 text-sm font-medium rounded-md',
              'bg-white/70 backdrop-blur-sm border border-neutral-300',
              'text-neutral-700 hover:bg-neutral-50',
              currentPage === totalPages && 'opacity-50 cursor-not-allowed'
            )}
          >
            Next
          </button>
        </div>
        <div className="hidden sm:flex-1 sm:flex sm:items-center sm:justify-between">
          <div>
            <p className="text-sm text-neutral-700">
              Showing <span className="font-medium">{Math.min((currentPage - 1) * pageSize + 1, sortedData.length)}</span> to{' '}
              <span className="font-medium">{Math.min(currentPage * pageSize, sortedData.length)}</span> of{' '}
              <span className="font-medium">{sortedData.length}</span> results
            </p>
          </div>
          <div>
            <nav className="relative z-0 inline-flex rounded-md shadow-sm -space-x-px" aria-label="Pagination">
              <button
                onClick={() => handlePageChange(1)}
                disabled={currentPage === 1}
                className={cn(
                  'relative inline-flex items-center px-2 py-2 rounded-l-md border text-sm font-medium',
                  'bg-white/70 backdrop-blur-sm border-neutral-300',
                  'text-neutral-500 hover:bg-neutral-50',
                  currentPage === 1 && 'opacity-50 cursor-not-allowed'
                )}
              >
                <span className="sr-only">First Page</span>
                <span className="text-xs">First</span>
              </button>
              <button
                onClick={() => handlePageChange(currentPage - 1)}
                disabled={currentPage === 1}
                className={cn(
                  'relative inline-flex items-center px-2 py-2 border text-sm font-medium',
                  'bg-white/70 backdrop-blur-sm border-neutral-300',
                  'text-neutral-500 hover:bg-neutral-50',
                  currentPage === 1 && 'opacity-50 cursor-not-allowed'
                )}
              >
                <span className="sr-only">Previous</span>
                <ChevronUp className="h-4 w-4 rotate-90" />
              </button>
              
              {/* Page numbers */}
              {Array.from({ length: Math.min(5, totalPages) }).map((_, i) => {
                let pageNum;
                
                // Calculate which page numbers to show
                if (totalPages <= 5) {
                  pageNum = i + 1;
                } else if (currentPage <= 3) {
                  pageNum = i + 1;
                } else if (currentPage >= totalPages - 2) {
                  pageNum = totalPages - 4 + i;
                } else {
                  pageNum = currentPage - 2 + i;
                }
                
                if (pageNum <= 0 || pageNum > totalPages) return null;
                
                return (
                  <button
                    key={pageNum}
                    onClick={() => handlePageChange(pageNum)}
                    aria-current={currentPage === pageNum ? 'page' : undefined}
                    className={cn(
                      'relative inline-flex items-center px-4 py-2 border text-sm font-medium',
                      currentPage === pageNum
                        ? 'z-10 bg-primary-50/70 backdrop-blur-sm border-primary-300 text-primary-600'
                        : 'bg-white/70 backdrop-blur-sm border-neutral-300 text-neutral-500 hover:bg-neutral-50'
                    )}
                  >
                    {pageNum}
                  </button>
                );
              })}
              
              <button
                onClick={() => handlePageChange(currentPage + 1)}
                disabled={currentPage === totalPages}
                className={cn(
                  'relative inline-flex items-center px-2 py-2 border text-sm font-medium',
                  'bg-white/70 backdrop-blur-sm border-neutral-300',
                  'text-neutral-500 hover:bg-neutral-50',
                  currentPage === totalPages && 'opacity-50 cursor-not-allowed'
                )}
              >
                <span className="sr-only">Next</span>
                <ChevronDown className="h-4 w-4 rotate-90" />
              </button>
              <button
                onClick={() => handlePageChange(totalPages)}
                disabled={currentPage === totalPages}
                className={cn(
                  'relative inline-flex items-center px-2 py-2 rounded-r-md border text-sm font-medium',
                  'bg-white/70 backdrop-blur-sm border-neutral-300',
                  'text-neutral-500 hover:bg-neutral-50',
                  currentPage === totalPages && 'opacity-50 cursor-not-allowed'
                )}
              >
                <span className="sr-only">Last Page</span>
                <span className="text-xs">Last</span>
              </button>
            </nav>
          </div>
        </div>
      </div>
    );
  };

  return (
    <div className={cn(
      'overflow-hidden rounded-lg border border-neutral-200/70 bg-white/60 backdrop-blur-sm',
      className
    )}>
      <div className="overflow-x-auto">
        <table className="min-w-full divide-y divide-neutral-200/70">
          <thead className={cn(
            'bg-neutral-50/80 backdrop-blur-sm',
            headerClassName
          )}>
            <tr>
              {columns.map((column) => (
                <th
                  key={column.id}
                  scope="col"
                  className={cn(
                    'px-4 py-3 text-left text-xs font-medium text-neutral-500 uppercase tracking-wider',
                    'border-b border-neutral-200/50',
                    column.enableSorting !== false && enableSorting ? 'cursor-pointer select-none' : '',
                    column.className
                  )}
                  onClick={() => column.enableSorting !== false && handleSort(column.id)}
                >
                  <div className="flex items-center space-x-1">
                    <span>{column.header}</span>
                    {column.enableSorting !== false && enableSorting && (
                      <span className="flex items-center">
                        {getSortIcon(column.id)}
                      </span>
                    )}
                  </div>
                </th>
              ))}
            </tr>
          </thead>
          <tbody className={cn(
            'bg-white/40 backdrop-blur-sm divide-y divide-neutral-200/50',
            bodyClassName
          )}>
            {isLoading ? (
              renderLoadingSkeleton()
            ) : paginatedData.length === 0 ? (
              <tr>
                <td
                  colSpan={columns.length}
                  className="px-4 py-8 text-center text-sm text-neutral-500"
                >
                  {emptyMessage}
                </td>
              </tr>
            ) : (
              paginatedData.map((row, rowIndex) => (
                <tr
                  key={rowIndex}
                  className={cn(
                    onRowClick ? 'cursor-pointer hover:bg-neutral-50/70' : '',
                    typeof rowClassName === 'function' ? rowClassName(row, rowIndex) : rowClassName
                  )}
                  onClick={() => onRowClick && onRowClick(row)}
                >
                  {columns.map((column) => (
                    <td
                      key={`${rowIndex}-${column.id}`}
                      className={cn(
                        'px-4 py-3 text-sm text-neutral-800 border-b border-neutral-200/50',
                        column.className
                      )}
                    >
                      {getCellValue(row, column)}
                    </td>
                  ))}
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>
      
      {renderPagination()}
    </div>
  );
} 