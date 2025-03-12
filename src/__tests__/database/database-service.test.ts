import { supabase } from '@/lib/supabase';
import { profileService, promptService, categoryService } from '@/services/database';
import { mockProfile, mockPrompt, mockCategory, resetMocks } from './testUtils';

// Mock the Supabase client
jest.mock('@/lib/supabase', () => ({
  supabase: {
    from: jest.fn(),
  },
}));

describe('Database Service', () => {
  beforeEach(() => {
    resetMocks();
  });

  describe('profileService', () => {
    it('should fetch a profile', async () => {
      // Arrange
      const mockProfileData = mockProfile();
      
      // @ts-ignore - Mocking the Supabase client
      supabase.from.mockImplementation((table) => {
        if (table === 'profiles') {
          return {
            select: jest.fn().mockReturnThis(),
            eq: jest.fn().mockReturnThis(),
            single: jest.fn().mockResolvedValue({ data: mockProfileData, error: null }),
          };
        }
        return {
          select: jest.fn().mockReturnThis(),
          eq: jest.fn().mockReturnThis(),
          single: jest.fn().mockResolvedValue({ data: null, error: null }),
        };
      });

      // Act
      const result = await profileService.fetchProfile('test-user-id');

      // Assert
      expect(supabase.from).toHaveBeenCalledWith('profiles');
      expect(result).toEqual(mockProfileData);
    });

    it('should create a profile', async () => {
      // Arrange
      const newProfile = mockProfile();
      
      // @ts-ignore - Mocking the Supabase client
      supabase.from.mockImplementation((table) => {
        if (table === 'profiles') {
          return {
            insert: jest.fn().mockReturnThis(),
            select: jest.fn().mockReturnThis(),
            single: jest.fn().mockResolvedValue({ data: newProfile, error: null }),
          };
        }
        return {
          insert: jest.fn().mockReturnThis(),
          select: jest.fn().mockReturnThis(),
          single: jest.fn().mockResolvedValue({ data: null, error: null }),
        };
      });

      // Act
      const result = await profileService.createProfile(newProfile);

      // Assert
      expect(supabase.from).toHaveBeenCalledWith('profiles');
      expect(result).toEqual(newProfile);
    });
  });

  describe('promptService', () => {
    it('should fetch prompts for a user', async () => {
      // Arrange
      const mockPrompts = [mockPrompt(), mockPrompt({ id: 'test-prompt-id-2' })];
      
      // @ts-ignore - Mocking the Supabase client
      supabase.from.mockImplementation((table) => {
        if (table === 'prompts') {
          return {
            select: jest.fn().mockReturnThis(),
            eq: jest.fn().mockReturnThis(),
            order: jest.fn().mockResolvedValue({ data: mockPrompts, error: null }),
          };
        }
        return {
          select: jest.fn().mockReturnThis(),
          eq: jest.fn().mockReturnThis(),
          order: jest.fn().mockResolvedValue({ data: null, error: null }),
        };
      });

      // Act
      const result = await promptService.fetchPrompts('test-user-id');

      // Assert
      expect(supabase.from).toHaveBeenCalledWith('prompts');
      expect(result).toEqual(mockPrompts);
    });

    it('should create a prompt', async () => {
      // Arrange
      const newPrompt = mockPrompt();
      
      // @ts-ignore - Mocking the Supabase client
      supabase.from.mockImplementation((table) => {
        if (table === 'prompts') {
          return {
            insert: jest.fn().mockReturnThis(),
            select: jest.fn().mockReturnThis(),
            single: jest.fn().mockResolvedValue({ data: newPrompt, error: null }),
          };
        }
        return {
          insert: jest.fn().mockReturnThis(),
          select: jest.fn().mockReturnThis(),
          single: jest.fn().mockResolvedValue({ data: null, error: null }),
        };
      });

      // Act
      const result = await promptService.createPrompt(newPrompt);

      // Assert
      expect(supabase.from).toHaveBeenCalledWith('prompts');
      expect(result).toEqual(newPrompt);
    });
  });

  describe('categoryService', () => {
    it('should fetch categories for a user', async () => {
      // Arrange
      const mockCategories = [mockCategory(), mockCategory({ id: 'test-category-id-2' })];
      
      // @ts-ignore - Mocking the Supabase client
      supabase.from.mockImplementation((table) => {
        if (table === 'categories') {
          return {
            select: jest.fn().mockReturnThis(),
            eq: jest.fn().mockReturnThis(),
            order: jest.fn().mockResolvedValue({ data: mockCategories, error: null }),
          };
        }
        return {
          select: jest.fn().mockReturnThis(),
          eq: jest.fn().mockReturnThis(),
          order: jest.fn().mockResolvedValue({ data: null, error: null }),
        };
      });

      // Act
      const result = await categoryService.fetchCategories('test-user-id');

      // Assert
      expect(supabase.from).toHaveBeenCalledWith('categories');
      expect(result).toEqual(mockCategories);
    });
  });
}); 
