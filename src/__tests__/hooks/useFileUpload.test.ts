import { renderHook, act } from '@testing-library/react';
import { useFileUpload } from '@/hooks/useFileUpload';
import { supabase } from '@/lib/supabase';

// Mock the Supabase client
jest.mock('@/lib/supabase', () => ({
  supabase: {
    storage: {
      from: jest.fn().mockReturnValue({
        upload: jest.fn().mockResolvedValue({ data: {}, error: null }),
        getPublicUrl: jest.fn().mockReturnValue({ data: { publicUrl: 'https://example.com/test.jpg' } }),
      }),
    },
  },
}));

// Mock the toast hook
jest.mock('@/components/ui/use-toast', () => ({
  useToast: jest.fn().mockReturnValue({
    toast: jest.fn(),
  }),
}));

describe('useFileUpload Hook', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  it('should initialize with default values', () => {
    const { result } = renderHook(() => useFileUpload({
      bucket: 'test-bucket',
    }));

    expect(result.current.uploading).toBe(false);
    expect(result.current.url).toBeNull();
    expect(result.current.error).toBeNull();
  });

  it('should handle file upload successfully', async () => {
    const onSuccess = jest.fn();
    const { result } = renderHook(() => useFileUpload({
      bucket: 'test-bucket',
      onSuccess,
    }));

    const file = new File(['test'], 'test.jpg', { type: 'image/jpeg' });
    
    await act(async () => {
      await result.current.upload(file);
    });

    expect(supabase.storage.from).toHaveBeenCalledWith('test-bucket');
    expect(result.current.url).toBe('https://example.com/test.jpg');
    expect(result.current.uploading).toBe(false);
    expect(onSuccess).toHaveBeenCalledWith('https://example.com/test.jpg', expect.any(String));
  });

  it('should validate file type', async () => {
    const onError = jest.fn();
    const { result } = renderHook(() => useFileUpload({
      bucket: 'test-bucket',
      fileTypes: ['png'],
      onError,
    }));

    const file = new File(['test'], 'test.jpg', { type: 'image/jpeg' });
    
    await act(async () => {
      await result.current.upload(file);
    });

    expect(result.current.error).not.toBeNull();
    expect(onError).toHaveBeenCalled();
  });

  it('should reset state', () => {
    const { result } = renderHook(() => useFileUpload({
      bucket: 'test-bucket',
    }));

    act(() => {
      // Manually set some values
      result.current.reset();
    });

    expect(result.current.uploading).toBe(false);
    expect(result.current.url).toBeNull();
    expect(result.current.error).toBeNull();
  });
}); 
