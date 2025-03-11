
import React, { useState, useEffect } from 'react';
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { supabase } from '@/integrations/supabase/client';
import { useToast } from "@/components/ui/use-toast";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { User } from '@supabase/supabase-js';
import { Loader2, Upload } from 'lucide-react';

interface Profile {
  id: string;
  first_name: string | null;
  last_name: string | null;
  avatar_url: string | null;
}

interface ProfileFormProps {
  user: User;
  onProfileUpdate?: (profile: Profile) => void;
}

const ProfileForm = ({ user, onProfileUpdate }: ProfileFormProps) => {
  const [profile, setProfile] = useState<Profile>({
    id: user.id,
    first_name: '',
    last_name: '',
    avatar_url: null,
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
          setProfile({
            id: data.id,
            first_name: data.first_name,
            last_name: data.last_name,
            avatar_url: data.avatar_url,
          });
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

  const handleAvatarUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    try {
      if (!e.target.files || e.target.files.length === 0) {
        return;
      }
      
      const file = e.target.files[0];
      const fileExt = file.name.split('.').pop();
      const fileName = `${user.id}-${Math.random().toString(36).substring(2)}.${fileExt}`;
      const filePath = `${fileName}`;
      
      setUploading(true);
      
      const { error: uploadError } = await supabase.storage
        .from('avatars')
        .upload(filePath, file);
        
      if (uploadError) {
        throw uploadError;
      }
      
      const { data } = supabase.storage
        .from('avatars')
        .getPublicUrl(filePath);
        
      const avatarUrl = data.publicUrl;
      
      // Update profile with new avatar URL
      const { error: updateError } = await supabase
        .from('profiles')
        .update({ avatar_url: avatarUrl })
        .eq('id', user.id);
        
      if (updateError) {
        throw updateError;
      }
      
      setProfile(prev => ({ ...prev, avatar_url: avatarUrl }));
      
      toast({
        title: "Avatar updated",
        description: "Your profile picture has been updated successfully.",
      });
      
    } catch (error: any) {
      console.error('Error uploading avatar:', error);
      toast({
        title: "Avatar upload failed",
        description: error.message,
        variant: "destructive",
      });
    } finally {
      setUploading(false);
    }
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

  if (loading) {
    return (
      <div className="flex justify-center items-center p-8">
        <Loader2 className="h-8 w-8 animate-spin text-primary" />
        <span className="ml-2">Loading profile...</span>
      </div>
    );
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-8">
      <div className="space-y-6">
        <div className="flex flex-col items-center space-y-4">
          <Avatar className="h-24 w-24">
            <AvatarImage src={profile.avatar_url || ''} alt={profile.first_name || 'User'} />
            <AvatarFallback>
              {profile.first_name ? profile.first_name[0] : user.email?.[0]?.toUpperCase()}
            </AvatarFallback>
          </Avatar>
          
          <div className="flex items-center">
            <Label htmlFor="avatar" className="cursor-pointer">
              <div className="flex items-center gap-2 text-sm font-medium px-3 py-2 rounded-md bg-secondary hover:bg-secondary/80 transition-colors">
                <Upload className="h-4 w-4" />
                {uploading ? 'Uploading...' : 'Upload avatar'}
              </div>
              <Input 
                id="avatar" 
                type="file" 
                accept="image/*" 
                className="hidden" 
                onChange={handleAvatarUpload}
                disabled={uploading}
              />
            </Label>
          </div>
        </div>
        
        <div className="space-y-4">
          <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
            <div className="space-y-2">
              <Label htmlFor="first_name">First Name</Label>
              <Input
                id="first_name"
                name="first_name"
                value={profile.first_name || ''}
                onChange={handleChange}
                placeholder="Your first name"
              />
            </div>
            
            <div className="space-y-2">
              <Label htmlFor="last_name">Last Name</Label>
              <Input
                id="last_name"
                name="last_name"
                value={profile.last_name || ''}
                onChange={handleChange}
                placeholder="Your last name"
              />
            </div>
          </div>
          
          <div className="space-y-2">
            <Label htmlFor="email">Email</Label>
            <Input
              id="email"
              type="email"
              value={user.email || ''}
              disabled
              className="bg-muted"
            />
            <p className="text-xs text-muted-foreground">Email cannot be changed.</p>
          </div>
        </div>
      </div>
      
      <Button type="submit" disabled={saving}>
        {saving ? (
          <>
            <Loader2 className="mr-2 h-4 w-4 animate-spin" />
            Saving...
          </>
        ) : (
          'Save Changes'
        )}
      </Button>
    </form>
  );
};

export default ProfileForm;
