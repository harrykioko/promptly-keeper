
import * as React from 'react';
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { Profile } from '@/types/database';
import { User } from '@supabase/supabase-js';

interface ProfileDetailsProps {
  user: User;
  profile: Profile;
  handleChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
}

const ProfileDetails = ({ user, profile, handleChange }: ProfileDetailsProps) => {
  return (
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
  );
};

export default ProfileDetails;
