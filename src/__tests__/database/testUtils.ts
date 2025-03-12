import { supabase } from '@/lib/supabase';
import { 
  Profile, 
  Prompt, 
  Category, 
  PromptVersion, 
  PromptUsage,
  SharedPrompt,
  User,
  Tag,
  PromptTag,
  Template,
  TemplatePrompt
} from '@/types/database';

// Mock data generators
export const mockUser = (overrides = {}): User => ({
  id: 'test-user-id',
  created_at: new Date().toISOString(),
  email: 'test@example.com',
  name: 'Test User',
  avatar_url: null,
  preferences: null,
  ...overrides
});

export const mockProfile = (overrides = {}): Profile => ({
  id: 'test-profile-id',
  created_at: new Date().toISOString(),
  first_name: 'Test',
  last_name: 'User',
  avatar_url: null,
  email: 'test@example.com',
  ...overrides
});

export const mockPrompt = (overrides = {}): Prompt => ({
  id: 'test-prompt-id',
  created_at: new Date().toISOString(),
  updated_at: new Date().toISOString(),
  title: 'Test Prompt',
  content: 'This is a test prompt content',
  user_id: 'test-user-id',
  is_public: false,
  category_id: null,
  tags: null,
  version: 1,
  is_favorite: false,
  usage_count: 0,
  last_used_at: null,
  ...overrides
});

export const mockCategory = (overrides = {}): Category => ({
  id: 'test-category-id',
  created_at: new Date().toISOString(),
  name: 'Test Category',
  description: 'Test category description',
  user_id: 'test-user-id',
  color: '#FF5733',
  icon: 'folder',
  ...overrides
});

// Mock Supabase responses
export const mockSupabaseFrom = (tableName: string, mockData: any) => {
  const mockSelect = jest.fn().mockReturnThis();
  const mockInsert = jest.fn().mockReturnThis();
  const mockUpdate = jest.fn().mockReturnThis();
  const mockDelete = jest.fn().mockReturnThis();
  const mockEq = jest.fn().mockReturnThis();
  const mockSingle = jest.fn().mockResolvedValue({ data: mockData, error: null });
  const mockExecute = jest.fn().mockResolvedValue({ data: mockData, error: null });

  // @ts-ignore - Mocking the Supabase client
  supabase.from.mockImplementation((table) => {
    if (table === tableName) {
      return {
        select: mockSelect,
        insert: mockInsert,
        update: mockUpdate,
        delete: mockDelete,
        eq: mockEq,
        single: mockSingle,
        execute: mockExecute,
      };
    }
    return {
      select: jest.fn().mockReturnThis(),
      insert: jest.fn().mockReturnThis(),
      update: jest.fn().mockReturnThis(),
      delete: jest.fn().mockReturnThis(),
      eq: jest.fn().mockReturnThis(),
      single: jest.fn().mockResolvedValue({ data: null, error: null }),
      execute: jest.fn().mockResolvedValue({ data: null, error: null }),
    };
  });

  return {
    mockSelect,
    mockInsert,
    mockUpdate,
    mockDelete,
    mockEq,
    mockSingle,
    mockExecute,
  };
};

// Helper to reset all mocks
export const resetMocks = () => {
  jest.clearAllMocks();
}; 
