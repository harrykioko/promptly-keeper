import React from 'react';
import { render, screen, fireEvent } from '@testing-library/react';

// Simple button component for testing
function SimpleButton(props: {
  children: any;
  onClick?: () => void;
  disabled?: boolean;
  variant?: string;
}) {
  const { children, onClick, disabled, variant } = props;
  const className = variant === 'destructive' ? 'bg-destructive' : '';
  
  return (
    <button 
      onClick={onClick} 
      disabled={disabled}
      className={className}
      data-testid="simple-button"
    >
      {children}
    </button>
  );
}

describe('SimpleButton Component', () => {
  it('renders correctly', () => {
    render(<SimpleButton>Click me</SimpleButton>);
    expect(screen.getByTestId('simple-button')).toBeInTheDocument();
    expect(screen.getByText('Click me')).toBeInTheDocument();
  });

  it('handles click events', () => {
    const handleClick = jest.fn();
    render(<SimpleButton onClick={handleClick}>Click me</SimpleButton>);
    
    fireEvent.click(screen.getByTestId('simple-button'));
    expect(handleClick).toHaveBeenCalledTimes(1);
  });

  it('can be disabled', () => {
    render(<SimpleButton disabled>Click me</SimpleButton>);
    expect(screen.getByTestId('simple-button')).toBeDisabled();
  });

  it('applies variant classes correctly', () => {
    render(<SimpleButton variant="destructive">Delete</SimpleButton>);
    const button = screen.getByTestId('simple-button');
    expect(button).toHaveClass('bg-destructive');
  });
}); 