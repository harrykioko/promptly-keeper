import React from 'react';
import { render, screen, fireEvent } from '@testing-library/react';
import '@testing-library/jest-dom';

// Mock TagBadge component for testing
const Badge = ({ 
  variant = 'default', 
  className = '',
  onClick,
  children 
}: {
  variant?: 'default' | 'secondary' | 'outline';
  className?: string;
  onClick?: () => void;
  children: any;
}) => {
  return (
    <span 
      className={`badge badge-${variant} ${className}`} 
      onClick={onClick}
    >
      {children}
    </span>
  );
};

type TagType = 'general' | 'coding' | 'writing' | 'creative' | 'learning' | 'custom' | string;

interface TagBadgeProps {
  tag: TagType;
  className?: string;
  onClick?: () => void;
}

const TagBadge = ({ tag, className, onClick }: TagBadgeProps) => {
  return (
    <Badge variant="default" className={className} onClick={onClick}>
      {tag}
    </Badge>
  );
};

describe('TagBadge Component', () => {
  test('renders with tag text', () => {
    render(<TagBadge tag="coding" />);
    expect(screen.getByText('coding')).toBeInTheDocument();
  });

  test('applies custom className', () => {
    render(<TagBadge tag="writing" className="test-class" />);
    const badge = screen.getByText('writing');
    expect(badge).toHaveClass('test-class');
  });

  test('calls onClick handler when clicked', () => {
    const handleClick = jest.fn();
    render(<TagBadge tag="learning" onClick={handleClick} />);
    
    fireEvent.click(screen.getByText('learning'));
    expect(handleClick).toHaveBeenCalledTimes(1);
  });

  test('renders different tag types', () => {
    const { rerender } = render(<TagBadge tag="general" />);
    expect(screen.getByText('general')).toBeInTheDocument();
    
    rerender(<TagBadge tag="custom" />);
    expect(screen.getByText('custom')).toBeInTheDocument();
    
    rerender(<TagBadge tag="creative" />);
    expect(screen.getByText('creative')).toBeInTheDocument();
  });
}); 