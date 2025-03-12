import React, { useState, useRef, useEffect } from 'react';
import { cn } from '@/lib/utils';
import { 
  Bold, Italic, List, ListOrdered, Link, Image, Code, 
  Heading1, Heading2, Quote, Undo, Redo, AlignLeft, AlignCenter, AlignRight
} from 'lucide-react';

interface GlassRichTextEditorProps {
  value: string;
  onChange: (value: string) => void;
  placeholder?: string;
  minHeight?: string;
  maxHeight?: string;
  disabled?: boolean;
  className?: string;
  error?: string;
  label?: string;
  required?: boolean;
}

export const GlassRichTextEditor = ({
  value,
  onChange,
  placeholder = 'Write something...',
  minHeight = '200px',
  maxHeight = '500px',
  disabled = false,
  className = '',
  error,
  label,
  required = false,
}: GlassRichTextEditorProps) => {
  const [isFocused, setIsFocused] = useState(false);
  const textareaRef = useRef<HTMLTextAreaElement>(null);
  const [selectionStart, setSelectionStart] = useState(0);
  const [selectionEnd, setSelectionEnd] = useState(0);
  
  // History management without generic type parameters
  const [history, setHistory] = useState(() => [value]);
  const [historyIndex, setHistoryIndex] = useState(0);

  // Save selection state when textarea is focused
  const saveSelection = () => {
    if (textareaRef.current) {
      setSelectionStart(textareaRef.current.selectionStart);
      setSelectionEnd(textareaRef.current.selectionEnd);
    }
  };

  // Add to history when value changes
  useEffect(() => {
    if (value !== history[historyIndex]) {
      const newHistory = history.slice(0, historyIndex + 1);
      newHistory.push(value);
      setHistory(newHistory);
      setHistoryIndex(newHistory.length - 1);
    }
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [value, historyIndex]);

  // Format functions
  const formatText = (formatType: string) => {
    if (disabled || !textareaRef.current) return;

    const textarea = textareaRef.current;
    const start = textarea.selectionStart;
    const end = textarea.selectionEnd;
    const selectedText = value.substring(start, end);
    let newText = '';
    let newCursorPos = 0;

    switch (formatType) {
      case 'bold':
        newText = value.substring(0, start) + `**${selectedText}**` + value.substring(end);
        newCursorPos = selectedText.length ? end + 4 : start + 2;
        break;
      case 'italic':
        newText = value.substring(0, start) + `*${selectedText}*` + value.substring(end);
        newCursorPos = selectedText.length ? end + 2 : start + 1;
        break;
      case 'h1':
        newText = value.substring(0, start) + `# ${selectedText}` + value.substring(end);
        newCursorPos = selectedText.length ? end + 2 : start + 2;
        break;
      case 'h2':
        newText = value.substring(0, start) + `## ${selectedText}` + value.substring(end);
        newCursorPos = selectedText.length ? end + 3 : start + 3;
        break;
      case 'quote':
        newText = value.substring(0, start) + `> ${selectedText}` + value.substring(end);
        newCursorPos = selectedText.length ? end + 2 : start + 2;
        break;
      case 'code':
        newText = value.substring(0, start) + '`' + selectedText + '`' + value.substring(end);
        newCursorPos = selectedText.length ? end + 2 : start + 1;
        break;
      case 'link':
        newText = value.substring(0, start) + `[${selectedText}](url)` + value.substring(end);
        newCursorPos = selectedText.length ? end + 6 : start + 1;
        break;
      case 'image':
        newText = value.substring(0, start) + `![${selectedText}](url)` + value.substring(end);
        newCursorPos = selectedText.length ? end + 7 : start + 2;
        break;
      case 'ul':
        newText = value.substring(0, start) + `- ${selectedText}` + value.substring(end);
        newCursorPos = selectedText.length ? end + 2 : start + 2;
        break;
      case 'ol':
        newText = value.substring(0, start) + `1. ${selectedText}` + value.substring(end);
        newCursorPos = selectedText.length ? end + 3 : start + 3;
        break;
      default:
        return;
    }

    onChange(newText);
    
    // Set cursor position after state update
    setTimeout(() => {
      if (textareaRef.current) {
        textareaRef.current.focus();
        textareaRef.current.setSelectionRange(newCursorPos, newCursorPos);
      }
    }, 0);
  };

  const handleUndo = () => {
    if (historyIndex > 0) {
      setHistoryIndex(historyIndex - 1);
      onChange(history[historyIndex - 1]);
    }
  };

  const handleRedo = () => {
    if (historyIndex < history.length - 1) {
      setHistoryIndex(historyIndex + 1);
      onChange(history[historyIndex + 1]);
    }
  };

  const ToolbarButton = ({ icon, label, onClick }: { icon: JSX.Element, label: string, onClick: () => void }) => (
    <button
      type="button"
      onClick={onClick}
      disabled={disabled}
      className={cn(
        'p-1.5 rounded-md transition-colors',
        disabled 
          ? 'text-neutral-400 cursor-not-allowed' 
          : 'text-neutral-600 hover:text-primary-600 hover:bg-primary-50/50'
      )}
      aria-label={label}
      title={label}
    >
      {icon}
    </button>
  );

  return (
    <div className={cn('w-full', className)}>
      {label && (
        <label className="block text-sm font-medium text-neutral-700 mb-1">
          {label}
          {required && <span className="text-error-500 ml-1">*</span>}
        </label>
      )}
      
      <div
        className={cn(
          'bg-white/70 backdrop-blur-sm border rounded-lg transition-all duration-200',
          isFocused ? 'border-primary-400 ring-2 ring-primary-100' : 'border-neutral-200',
          error ? 'border-error-300 ring-2 ring-error-100' : '',
          disabled ? 'bg-neutral-50/70 cursor-not-allowed' : '',
        )}
      >
        {/* Toolbar */}
        <div className="flex flex-wrap items-center gap-0.5 p-1 border-b border-neutral-200/70">
          <ToolbarButton 
            icon={<Bold className="h-4 w-4" />} 
            label="Bold" 
            onClick={() => formatText('bold')} 
          />
          <ToolbarButton 
            icon={<Italic className="h-4 w-4" />} 
            label="Italic" 
            onClick={() => formatText('italic')} 
          />
          <div className="h-4 w-px mx-1 bg-neutral-200" />
          <ToolbarButton 
            icon={<Heading1 className="h-4 w-4" />} 
            label="Heading 1" 
            onClick={() => formatText('h1')} 
          />
          <ToolbarButton 
            icon={<Heading2 className="h-4 w-4" />} 
            label="Heading 2" 
            onClick={() => formatText('h2')} 
          />
          <div className="h-4 w-px mx-1 bg-neutral-200" />
          <ToolbarButton 
            icon={<List className="h-4 w-4" />} 
            label="Bullet List" 
            onClick={() => formatText('ul')} 
          />
          <ToolbarButton 
            icon={<ListOrdered className="h-4 w-4" />} 
            label="Numbered List" 
            onClick={() => formatText('ol')} 
          />
          <div className="h-4 w-px mx-1 bg-neutral-200" />
          <ToolbarButton 
            icon={<Quote className="h-4 w-4" />} 
            label="Quote" 
            onClick={() => formatText('quote')} 
          />
          <ToolbarButton 
            icon={<Code className="h-4 w-4" />} 
            label="Code" 
            onClick={() => formatText('code')} 
          />
          <div className="h-4 w-px mx-1 bg-neutral-200" />
          <ToolbarButton 
            icon={<Link className="h-4 w-4" />} 
            label="Link" 
            onClick={() => formatText('link')} 
          />
          <ToolbarButton 
            icon={<Image className="h-4 w-4" />} 
            label="Image" 
            onClick={() => formatText('image')} 
          />
          <div className="ml-auto flex items-center">
            <ToolbarButton 
              icon={<Undo className="h-4 w-4" />} 
              label="Undo" 
              onClick={handleUndo} 
            />
            <ToolbarButton 
              icon={<Redo className="h-4 w-4" />} 
              label="Redo" 
              onClick={handleRedo} 
            />
          </div>
        </div>
        
        {/* Editor */}
        <textarea
          ref={textareaRef}
          value={value}
          onChange={(e) => onChange(e.target.value)}
          onFocus={() => setIsFocused(true)}
          onBlur={() => setIsFocused(false)}
          onSelect={saveSelection}
          placeholder={placeholder}
          disabled={disabled}
          className={cn(
            'w-full p-3 bg-transparent resize-none',
            'focus:outline-none focus:ring-0',
            'text-neutral-800 placeholder-neutral-400',
            disabled ? 'cursor-not-allowed' : ''
          )}
          style={{ 
            minHeight, 
            maxHeight,
            fontFamily: 'ui-monospace, SFMono-Regular, Menlo, Monaco, Consolas, monospace'
          }}
          aria-invalid={!!error}
          aria-describedby={error ? 'editor-error' : undefined}
        />
      </div>
      
      {error && (
        <p id="editor-error" className="mt-1.5 text-sm text-error-600">
          {error}
        </p>
      )}
      
      <div className="mt-1 text-xs text-neutral-500">
        Supports Markdown formatting
      </div>
    </div>
  );
}; 
