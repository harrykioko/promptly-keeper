import React, { useState } from 'react';
import { cn } from '@/lib/utils';
import { Copy, Check, Terminal, Code } from 'lucide-react';

interface GlassCodeBlockProps {
  code: string;
  language?: string;
  showLineNumbers?: boolean;
  title?: string;
  className?: string;
  maxHeight?: string;
  variant?: 'default' | 'terminal';
  onCopy?: () => void;
}

export const GlassCodeBlock = ({
  code,
  language = 'plaintext',
  showLineNumbers = false,
  title,
  className = '',
  maxHeight = '400px',
  variant = 'default',
  onCopy,
}: GlassCodeBlockProps) => {
  const [copied, setCopied] = useState(false);

  const handleCopy = () => {
    navigator.clipboard.writeText(code);
    setCopied(true);
    onCopy?.();
    
    setTimeout(() => {
      setCopied(false);
    }, 2000);
  };

  const formatCode = () => {
    if (!showLineNumbers) return code;

    return code.split('\n').map((line, i) => (
      <div key={i} className="table-row">
        <span className="table-cell pr-4 text-right text-neutral-400 select-none">{i + 1}</span>
        <span className="table-cell">{line || ' '}</span>
      </div>
    ));
  };

  const isTerminal = variant === 'terminal';

  return (
    <div
      className={cn(
        'rounded-lg overflow-hidden border backdrop-blur-sm',
        isTerminal 
          ? 'bg-neutral-900/90 border-neutral-700' 
          : 'bg-white/70 border-neutral-200',
        className
      )}
    >
      {/* Header */}
      <div className={cn(
        'flex items-center justify-between px-4 py-2 border-b',
        isTerminal 
          ? 'bg-neutral-800/90 border-neutral-700 text-neutral-200' 
          : 'bg-neutral-50/70 border-neutral-200 text-neutral-700'
      )}>
        <div className="flex items-center gap-2">
          {isTerminal ? (
            <Terminal className="h-4 w-4" />
          ) : (
            <Code className="h-4 w-4" />
          )}
          <span className="text-sm font-medium">
            {title || (isTerminal ? 'Terminal' : language)}
          </span>
        </div>
        <button
          onClick={handleCopy}
          className={cn(
            'p-1.5 rounded-md transition-colors',
            isTerminal 
              ? 'hover:bg-neutral-700/70 text-neutral-400 hover:text-neutral-200' 
              : 'hover:bg-neutral-100/70 text-neutral-500 hover:text-neutral-700'
          )}
          aria-label="Copy code"
          title="Copy code"
        >
          {copied ? (
            <Check className="h-4 w-4 text-green-500" />
          ) : (
            <Copy className="h-4 w-4" />
          )}
        </button>
      </div>
      
      {/* Code content */}
      <div
        className={cn(
          'overflow-auto p-4 font-mono text-sm',
          isTerminal ? 'text-neutral-200' : 'text-neutral-800'
        )}
        style={{ maxHeight }}
      >
        {showLineNumbers ? (
          <div className="table w-full">
            {formatCode()}
          </div>
        ) : (
          <pre className="whitespace-pre-wrap break-words">{code}</pre>
        )}
      </div>
    </div>
  );
}; 