
import React from 'react';
import { useAuth } from '@/components/AuthProvider';

const Profile = () => {
  const { user } = useAuth();

  return (
    <div className="container mx-auto px-4">
      <h1 className="text-4xl font-bold mb-8">Profile</h1>
      <div className="bg-card rounded-lg p-6 shadow-sm">
        <p className="text-muted-foreground">Email: {user?.email}</p>
      </div>
    </div>
  );
};

export default Profile;
