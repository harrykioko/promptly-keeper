
import React, { useRef } from 'react';
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { Upload, Loader2 } from 'lucide-react';
import { supabase } from '@/integrations/supabase/client';
import { User } from '@supabase/supabase-js';
import { Profile } from '@/hooks/useProfileForm';
import { useFileUpload } from '@/hooks/useFileUpload';

interface AvatarUploadProps {
  user: User;
  profile: Profile;
  setProfile: React.Dispatch<React.SetStateAction<Profile>>;
  uploading: boolean;
  setUploading: React.Dispatch<React.SetStateAction<boolean>>;
}

const AvatarUpload = ({ user, profile, setProfile, uploading, setUploading }: AvatarUploadProps) => {
  const fileInputRef = useRef<HTMLInputElement>(null);
  
  const { upload } = useFileUpload({
    bucket: 'avatars',
    fileTypes: ['jpg', 'jpeg', 'png', 'gif', 'webp'],
    maxSizeMB: 2,
    onSuccess: async (avatarUrl) => {
      // Update profile with new avatar URL
      const { error: updateError } = await supabase
        .from('profiles')
        .update({ avatar_url: avatarUrl })
        .eq('id', user.id);
        
      if (!updateError) {
        setProfile(prev => ({ ...prev, avatar_url: avatarUrl }));
      }
      
      setUploading(false);
    },
    onError: () => {
      setUploading(false);
    }
  });

  const handleAvatarUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    try {
      if (!e.target.files || e.target.files.length === 0) {
        return;
      }
      
      setUploading(true);
      const file = e.target.files[0];
      await upload(file);
      
      // Reset file input
      if (fileInputRef.current) {
        fileInputRef.current.value = '';
      }
      
    } catch (error) {
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
            {uploading ? (
              <>
                <Loader2 className="h-4 w-4 animate-spin" />
                Uploading...
              </>
            ) : (
              <>
                <Upload className="h-4 w-4" />
                Upload avatar
              </>
            )}
          </div>
          <Input 
            id="avatar" 
            type="file" 
            accept="image/*" 
            className="hidden" 
            onChange={handleAvatarUpload}
            ref={fileInputRef}
            disabled={uploading}
          />
        </Label>
      </div>
    </div>
  );
};

export default AvatarUpload;
