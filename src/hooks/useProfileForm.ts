
import { useState, useEffect } from 'react';
import { supabase } from '@/lib/supabase';
import { useToast } from "@/components/ui/use-toast";
import { User as SupabaseUser } from '@supabase/supabase-js';
import { Profile } from '@/types/database';

export { Profile }; // Export the Profile type

export const useProfileForm = (user: SupabaseUser, onProfileUpdate?: (profile: Profile) => void) => {
  const [profile, setProfile] = useState<Profile>({
    id: user.id,
    created_at: new Date().toISOString(),
    first_name: '',
    last_name: '',
    avatar_url: null,
    email: user.email || '',
  });
  const [loading, setLoading] = useState(true);
  const [uploading, setUploading] = useState(false);
  const [saving, setSaving] = useState(false);
  const { toast } = useToast();

  useEffect(() => {
    async function fetchProfile() {
      try {
        setLoading(true);
        const { data, error } = await supabase
          .from('profiles')
          .select('*')
          .eq('id', user.id)
          .single();

        if (error) {
          console.error('Error fetching profile:', error);
          toast({
            title: "Error loading profile",
            description: error.message,
            variant: "destructive",
          });
          return;
        }

        if (data) {
          setProfile(data as Profile);
        }
      } catch (error) {
        console.error('Error fetching profile:', error);
      } finally {
        setLoading(false);
      }
    }

    fetchProfile();
  }, [user.id, toast]);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setProfile(prev => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      setSaving(true);
      
      const { first_name, last_name } = profile;
      
      const { error } = await supabase
        .from('profiles')
        .update({
          first_name,
          last_name,
          updated_at: new Date().toISOString(),
        })
        .eq('id', user.id);
        
      if (error) {
        throw error;
      }
      
      toast({
        title: "Profile updated",
        description: "Your profile has been updated successfully.",
      });
      
      if (onProfileUpdate) {
        onProfileUpdate(profile);
      }
      
    } catch (error: any) {
      console.error('Error updating profile:', error);
      toast({
        title: "Profile update failed",
        description: error.message,
        variant: "destructive",
      });
    } finally {
      setSaving(false);
    }
  };

  return {
    profile,
    setProfile,
    loading,
    uploading,
    setUploading,
    saving,
    handleChange,
    handleSubmit
  };
};
