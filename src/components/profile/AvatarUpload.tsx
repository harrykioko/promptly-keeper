
import React from 'react';
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { Upload, Loader2 } from 'lucide-react';
import { supabase } from '@/integrations/supabase/client';
import { useToast } from "@/components/ui/use-toast";
import { User } from '@supabase/supabase-js';
import { Profile } from '@/hooks/useProfileForm';

interface AvatarUploadProps {
  user: User;
  profile: Profile;
  setProfile: React.Dispatch<React.SetStateAction<Profile>>;
  uploading: boolean;
  setUploading: React.Dispatch<React.SetStateAction<boolean>>;
}

const AvatarUpload = ({ user, profile, setProfile, uploading, setUploading }: AvatarUploadProps) => {
  const { toast } = useToast();

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

  return (
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
  );
};

export default AvatarUpload;
