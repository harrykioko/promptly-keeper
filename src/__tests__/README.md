# Database Testing Setup

This directory contains tests for database operations in the Promptly application. The tests are designed to verify that database interactions work correctly and to catch issues early.

## Setup

To run the tests, you need to install the following dependencies:

```bash
npm install --save-dev jest @types/jest ts-jest jest-environment-jsdom @testing-library/react @testing-library/jest-dom @testing-library/user-event
```

Or if you prefer yarn:

```bash
yarn add --dev jest @types/jest ts-jest jest-environment-jsdom @testing-library/react @testing-library/jest-dom @testing-library/user-event
```

## Running Tests

Add the following script to your `package.json`:

```json
"scripts": {
  "test": "jest",
  "test:watch": "jest --watch",
  "test:coverage": "jest --coverage"
}
```

Then run the tests with:

```bash
npm test
```

## Test Structure

The tests are organized as follows:

- `setup.ts`: Global setup for Jest tests, including mocking the Supabase client.
- `database/`: Tests for database operations.
  - `testUtils.ts`: Utility functions for database testing, including mock data generators.
  - `profile.test.ts`: Tests for profile operations.
  - `prompt.test.ts`: Tests for prompt operations.
  - `database-service.test.ts`: Tests for the database service.

## Mocking Strategy

The tests use Jest's mocking capabilities to mock the Supabase client. This allows us to test database operations without actually connecting to a database.

The mocking strategy is as follows:

1. Mock the Supabase client in `setup.ts`.
2. Create mock data generators in `testUtils.ts`.
3. Use the mock data generators to create test data.
4. Mock the Supabase client's methods to return the test data.
5. Test the database operations using the mocked client.

## Adding New Tests

To add a new test:

1. Create a new test file in the appropriate directory.
2. Import the necessary dependencies and mock data generators.
3. Mock the Supabase client's methods to return the test data.
4. Write tests for the database operations.

## Best Practices

- Keep tests focused on a single unit of functionality.
- Use descriptive test names that explain what is being tested.
- Use the Arrange-Act-Assert pattern to structure tests.
- Reset mocks between tests to avoid test pollution.
- Use mock data generators to create test data.
- Test both success and error cases.

## Example Test

```typescript
import { supabase } from '@/lib/supabase';
import { mockProfile, mockSupabaseFrom, resetMocks } from './testUtils';
import { Profile } from '@/types/database';

// Mock the Supabase client
jest.mock('@/lib/supabase', () => ({
  supabase: {
    from: jest.fn(),
  },
}));

describe('Profile Database Operations', () => {
  // Reset mocks before each test
  beforeEach(() => {
    resetMocks();
  });

  describe('fetchProfile', () => {
    it('should fetch a profile by user ID', async () => {
      // Arrange
      const mockProfileData = mockProfile();
      const { mockSelect, mockEq, mockSingle } = mockSupabaseFrom('profiles', mockProfileData);

      // Act
      const fetchProfile = async (userId: string) => {
        const { data, error } = await supabase
          .from('profiles')
          .select('*')
          .eq('id', userId)
          .single();

        if (error) {
          throw error;
        }

        return data as Profile;
      };

      const result = await fetchProfile('test-user-id');

      // Assert
      expect(supabase.from).toHaveBeenCalledWith('profiles');
      expect(mockSelect).toHaveBeenCalledWith('*');
      expect(mockEq).toHaveBeenCalledWith('id', 'test-user-id');
      expect(mockSingle).toHaveBeenCalled();
      expect(result).toEqual(mockProfileData);
    });
  });
});
``` 