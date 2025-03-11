# Testing Guide for Promptly

This document provides guidelines for writing and running tests in the Promptly application.

## Setup Summary

We've set up a comprehensive testing environment for the Promptly application:

1. **Jest Configuration**: Created a TypeScript-based Jest configuration in `jest.config.ts`
2. **Setup File**: Added a global setup file in `src/jest.setup.ts` with testing-library extensions
3. **Test Structure**: Organized tests in `src/__tests__` directory with subdirectories for components, hooks, and database operations
4. **Sample Tests**: Created sample tests for components, hooks, and database operations
5. **TypeScript Configuration**: Added a dedicated `tsconfig.jest.json` for Jest tests

## Setup

The project uses Jest and React Testing Library for testing. The setup includes:

- **Jest**: Test runner and assertion library
- **ts-jest**: TypeScript support for Jest
- **React Testing Library**: For testing React components
- **jest-dom**: Custom DOM element matchers

## Running Tests

You can run tests using the following npm scripts:

```bash
# Run all tests
npm test

# Run tests in watch mode (useful during development)
npm run test:watch

# Run tests with coverage report
npm run test:coverage

# Run tests in CI mode
npm run test:ci
```

## Test Structure

Tests are organized in the `src/__tests__` directory, mirroring the structure of the source code:

- `src/__tests__/components/`: Tests for React components
- `src/__tests__/hooks/`: Tests for custom hooks
- `src/__tests__/database/`: Tests for database operations

## Writing Tests

### Component Tests

For testing React components, use React Testing Library:

```tsx
import { render, screen, fireEvent } from '@testing-library/react';
import { Button } from '@/components/ui/button';

describe('Button Component', () => {
  it('renders correctly', () => {
    render(<Button>Click me</Button>);
    expect(screen.getByRole('button')).toBeInTheDocument();
  });

  it('handles click events', () => {
    const handleClick = jest.fn();
    render(<Button onClick={handleClick}>Click me</Button>);
    
    fireEvent.click(screen.getByRole('button'));
    expect(handleClick).toHaveBeenCalledTimes(1);
  });
});
```

### Hook Tests

For testing custom hooks, use the `renderHook` function:

```tsx
import { renderHook, act } from '@testing-library/react';
import { useCounter } from '@/hooks/useCounter';

describe('useCounter Hook', () => {
  it('should increment counter', () => {
    const { result } = renderHook(() => useCounter());
    
    act(() => {
      result.current.increment();
    });
    
    expect(result.current.count).toBe(1);
  });
});
```

### Database Tests

For testing database operations, mock the Supabase client:

```tsx
import { supabase } from '@/lib/supabase';
import { profileService } from '@/services/database';

// Mock the Supabase client
jest.mock('@/lib/supabase', () => ({
  supabase: {
    from: jest.fn(),
  },
}));

describe('Profile Service', () => {
  it('should fetch a profile', async () => {
    // Mock implementation
    supabase.from.mockImplementation(() => ({
      select: jest.fn().mockReturnThis(),
      eq: jest.fn().mockReturnThis(),
      single: jest.fn().mockResolvedValue({ data: { id: '123' }, error: null }),
    }));
    
    const result = await profileService.fetchProfile('123');
    expect(result).toEqual({ id: '123' });
  });
});
```

## Best Practices

1. **Test Behavior, Not Implementation**: Focus on what the component/hook does, not how it does it.
2. **Use Descriptive Test Names**: Make it clear what is being tested.
3. **Arrange-Act-Assert Pattern**: Structure tests with setup, action, and verification.
4. **Mock External Dependencies**: Use Jest's mocking capabilities for external services.
5. **Test Edge Cases**: Include tests for error states and boundary conditions.
6. **Keep Tests Independent**: Each test should run in isolation.
7. **Aim for High Coverage**: Strive for comprehensive test coverage.

## Debugging Tests

If tests are failing, you can debug them by:

1. Using `console.log` statements in your tests
2. Running tests in watch mode with `npm run test:watch`
3. Using the `--verbose` flag: `npx jest --verbose`
4. Inspecting the DOM with `screen.debug()`

## Continuous Integration

Tests are automatically run in CI/CD pipelines using the `npm run test:ci` command, which generates coverage reports and fails if coverage thresholds are not met. 