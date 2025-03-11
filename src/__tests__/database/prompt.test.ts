import { supabase } from '@/lib/supabase';
import { mockPrompt, mockSupabaseFrom, resetMocks } from './testUtils';
import { Prompt } from '@/types/database';

// Mock the Supabase client
jest.mock('@/lib/supabase', () => ({
  supabase: {
    from: jest.fn(),
  },
}));

describe('Prompt Database Operations', () => {
  // Reset mocks before each test
  beforeEach(() => {
    resetMocks();
  });

  describe('fetchPrompts', () => {
    it('should fetch prompts for a user', async () => {
      // Arrange
      const mockPrompts = [mockPrompt(), mockPrompt({ id: 'test-prompt-id-2' })];
      const { mockSelect, mockEq } = mockSupabaseFrom('prompts', mockPrompts);

      // Act
      const fetchPrompts = async (userId: string) => {
        const { data, error } = await supabase
          .from('prompts')
          .select('*')
          .eq('user_id', userId);

        if (error) {
          throw error;
        }

        return data as Prompt[];
      };

      const result = await fetchPrompts('test-user-id');

      // Assert
      expect(supabase.from).toHaveBeenCalledWith('prompts');
      expect(mockSelect).toHaveBeenCalledWith('*');
      expect(mockEq).toHaveBeenCalledWith('user_id', 'test-user-id');
      expect(result).toEqual(mockPrompts);
    });
  });

  describe('fetchPromptById', () => {
    it('should fetch a prompt by ID', async () => {
      // Arrange
      const mockPromptData = mockPrompt();
      const { mockSelect, mockEq, mockSingle } = mockSupabaseFrom('prompts', mockPromptData);

      // Act
      const fetchPromptById = async (promptId: string) => {
        const { data, error } = await supabase
          .from('prompts')
          .select('*')
          .eq('id', promptId)
          .single();

        if (error) {
          throw error;
        }

        return data as Prompt;
      };

      const result = await fetchPromptById('test-prompt-id');

      // Assert
      expect(supabase.from).toHaveBeenCalledWith('prompts');
      expect(mockSelect).toHaveBeenCalledWith('*');
      expect(mockEq).toHaveBeenCalledWith('id', 'test-prompt-id');
      expect(mockSingle).toHaveBeenCalled();
      expect(result).toEqual(mockPromptData);
    });
  });

  describe('createPrompt', () => {
    it('should create a new prompt', async () => {
      // Arrange
      const newPrompt = mockPrompt();
      const { mockInsert } = mockSupabaseFrom('prompts', newPrompt);

      // Act
      const createPrompt = async (prompt: Prompt) => {
        const { data, error } = await supabase
          .from('prompts')
          .insert(prompt);

        if (error) {
          throw error;
        }

        return data as Prompt;
      };

      const result = await createPrompt(newPrompt);

      // Assert
      expect(supabase.from).toHaveBeenCalledWith('prompts');
      expect(mockInsert).toHaveBeenCalledWith(newPrompt);
      expect(result).toEqual(newPrompt);
    });
  });

  describe('updatePrompt', () => {
    it('should update a prompt', async () => {
      // Arrange
      const mockPromptData = mockPrompt();
      const updatedPrompt = { ...mockPromptData, title: 'Updated Title', content: 'Updated content' };
      const { mockUpdate, mockEq } = mockSupabaseFrom('prompts', updatedPrompt);

      // Act
      const updatePrompt = async (promptId: string, updates: Partial<Prompt>) => {
        const { data, error } = await supabase
          .from('prompts')
          .update(updates)
          .eq('id', promptId);

        if (error) {
          throw error;
        }

        return data as Prompt;
      };

      const result = await updatePrompt('test-prompt-id', { 
        title: 'Updated Title', 
        content: 'Updated content' 
      });

      // Assert
      expect(supabase.from).toHaveBeenCalledWith('prompts');
      expect(mockUpdate).toHaveBeenCalledWith({ 
        title: 'Updated Title', 
        content: 'Updated content' 
      });
      expect(mockEq).toHaveBeenCalledWith('id', 'test-prompt-id');
      expect(result).toEqual(updatedPrompt);
    });
  });

  describe('deletePrompt', () => {
    it('should delete a prompt', async () => {
      // Arrange
      const mockPromptData = mockPrompt();
      const { mockDelete, mockEq } = mockSupabaseFrom('prompts', mockPromptData);

      // Act
      const deletePrompt = async (promptId: string) => {
        const { data, error } = await supabase
          .from('prompts')
          .delete()
          .eq('id', promptId);

        if (error) {
          throw error;
        }

        return data;
      };

      await deletePrompt('test-prompt-id');

      // Assert
      expect(supabase.from).toHaveBeenCalledWith('prompts');
      expect(mockDelete).toHaveBeenCalled();
      expect(mockEq).toHaveBeenCalledWith('id', 'test-prompt-id');
    });
  });
}); 