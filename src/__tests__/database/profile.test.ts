import { supabase } from '@/lib/supabase';
import { mockProfile, mockSupabaseFrom, resetMocks } from './testUtils';
import { Profile } from '@/types/database';

// Mock the Supabase client
jest.mock('@/lib/supabase', () => ({
  supabase: {
    from: jest.fn(),
    auth: {
      getSession: jest.fn(),
      onAuthStateChange: jest.fn(),
    },
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

    it('should handle errors when fetching a profile', async () => {
      // Arrange
      const mockError = new Error('Profile not found');
      
      // @ts-ignore - Mocking the Supabase client
      supabase.from.mockImplementation(() => ({
        select: jest.fn().mockReturnThis(),
        eq: jest.fn().mockReturnThis(),
        single: jest.fn().mockResolvedValue({ data: null, error: mockError }),
      }));

      // Act & Assert
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

      await expect(fetchProfile('test-user-id')).rejects.toThrow('Profile not found');
    });
  });

  describe('updateProfile', () => {
    it('should update a profile', async () => {
      // Arrange
      const mockProfileData = mockProfile();
      const updatedProfile = { ...mockProfileData, first_name: 'Updated', last_name: 'Name' };
      const { mockUpdate, mockEq } = mockSupabaseFrom('profiles', updatedProfile);

      // Act
      const updateProfile = async (userId: string, updates: Partial<Profile>) => {
        const { data, error } = await supabase
          .from('profiles')
          .update(updates)
          .eq('id', userId);

        if (error) {
          throw error;
        }

        return data as Profile;
      };

      const result = await updateProfile('test-user-id', { 
        first_name: 'Updated', 
        last_name: 'Name' 
      });

      // Assert
      expect(supabase.from).toHaveBeenCalledWith('profiles');
      expect(mockUpdate).toHaveBeenCalledWith({ 
        first_name: 'Updated', 
        last_name: 'Name' 
      });
      expect(mockEq).toHaveBeenCalledWith('id', 'test-user-id');
      expect(result).toEqual(updatedProfile);
    });
  });

  describe('createProfile', () => {
    it('should create a new profile', async () => {
      // Arrange
      const newProfile = mockProfile();
      const { mockInsert } = mockSupabaseFrom('profiles', newProfile);

      // Act
      const createProfile = async (profile: Profile) => {
        const { data, error } = await supabase
          .from('profiles')
          .insert(profile);

        if (error) {
          throw error;
        }

        return data as Profile;
      };

      const result = await createProfile(newProfile);

      // Assert
      expect(supabase.from).toHaveBeenCalledWith('profiles');
      expect(mockInsert).toHaveBeenCalledWith(newProfile);
      expect(result).toEqual(newProfile);
    });
  });
}); 
