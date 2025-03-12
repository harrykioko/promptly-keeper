
import * as React from 'react';
import { Button } from "@/components/ui/button";
import { User } from '@supabase/supabase-js';
import { Loader2 } from 'lucide-react';
import { useProfileForm, Profile } from '@/hooks/useProfileForm';
import AvatarUpload from '@/components/profile/AvatarUpload';
import ProfileDetails from '@/components/profile/ProfileDetails';

interface ProfileFormProps {
  user: User;
  onProfileUpdate?: (profile: Profile) => void;
}

const ProfileForm = ({ user, onProfileUpdate }: ProfileFormProps) => {
  const {
    profile,
    setProfile,
    loading,
    uploading,
    setUploading,
    saving,
    handleChange,
    handleSubmit
  } = useProfileForm(user, onProfileUpdate);

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
        <AvatarUpload 
          user={user}
          profile={profile}
          setProfile={setProfile}
          uploading={uploading}
          setUploading={setUploading}
        />
        
        <ProfileDetails 
          user={user}
          profile={profile}
          handleChange={handleChange}
        />
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
