import React from 'react';
import { cn } from '@/lib/utils';
import { ChevronRight, Home } from 'lucide-react';

export interface BreadcrumbItem {
  label: string;
  href?: string;
  icon?: JSX.Element;
}

interface GlassBreadcrumbsProps {
  items: BreadcrumbItem[];
  homeHref?: string;
  showHomeIcon?: boolean;
  className?: string;
  separator?: JSX.Element;
  maxItems?: number;
  itemClassName?: string;
  activeItemClassName?: string;
}

export const GlassBreadcrumbs = ({
  items,
  homeHref = '/',
  showHomeIcon = true,
  className = '',
  separator = <ChevronRight className="h-4 w-4 text-neutral-400" />,
  maxItems = 0,
  itemClassName = '',
  activeItemClassName = '',
}: GlassBreadcrumbsProps) => {
  // Handle truncation if maxItems is specified
  const displayedItems = maxItems > 0 && items.length > maxItems
    ? [
        ...items.slice(0, Math.max(1, maxItems - 2)),
        { label: '...', href: undefined },
        items[items.length - 1]
      ]
    : items;

  return (
    <nav aria-label="Breadcrumbs" className={cn('flex', className)}>
      <ol className="flex items-center space-x-1 md:space-x-2">
        {/* Home item */}
        {showHomeIcon && (
          <>
            <li>
              <a
                href={homeHref}
                className={cn(
                  'flex items-center text-sm text-neutral-600 hover:text-primary-600 transition-colors',
                  'bg-white/40 backdrop-blur-sm px-2 py-1 rounded-md',
                  'hover:bg-white/60'
                )}
                aria-label="Home"
              >
                <Home className="h-4 w-4" />
              </a>
            </li>
            <li className="flex items-center">{separator}</li>
          </>
        )}
        
        {/* Breadcrumb items */}
        {displayedItems.map((item, index) => {
          const isLast = index === displayedItems.length - 1;
          
          return (
            <React.Fragment key={index}>
              <li>
                {item.href && !isLast ? (
                  <a
                    href={item.href}
                    className={cn(
                      'flex items-center text-sm text-neutral-600 hover:text-primary-600 transition-colors',
                      'bg-white/40 backdrop-blur-sm px-2 py-1 rounded-md',
                      'hover:bg-white/60',
                      itemClassName
                    )}
                  >
                    {item.icon && <span className="mr-1.5">{item.icon}</span>}
                    <span>{item.label}</span>
                  </a>
                ) : (
                  <span
                    className={cn(
                      'flex items-center text-sm font-medium',
                      isLast 
                        ? cn(
                            'text-primary-700 bg-primary-50/70 backdrop-blur-sm px-2 py-1 rounded-md',
                            activeItemClassName
                          )
                        : 'text-neutral-500 px-2 py-1',
                      itemClassName
                    )}
                    aria-current={isLast ? 'page' : undefined}
                  >
                    {item.icon && <span className="mr-1.5">{item.icon}</span>}
                    <span>{item.label}</span>
                  </span>
                )}
              </li>
              
              {!isLast && (
                <li className="flex items-center">{separator}</li>
              )}
            </React.Fragment>
          );
        })}
      </ol>
    </nav>
  );
}; 