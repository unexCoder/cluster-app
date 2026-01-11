// components/DashboardContent.tsx
import React, { useEffect, useState } from 'react';
import BrowseUsers from './views/BrowseUsers';
import MailingList from './views/MailingList';
import BrowseArtists from './views/BrowseArtists';
import BrowseEvents from './views/BrowseEvents';
import BrowseVenues from './views/BrowseVenues';
import DisplayProfile from './views/DisplayProfile';
import UpdateProfile from './views/UpdateProfile';
import ChangePassword from './views/ChangePassword';
import ArtistProfile from './views/ArtistProfile';
import ArtistProfileCreate from './views/ArtistProfileCreate';
import ArtistProfileUpdate from './views/ArtistProfileUpdate';
import { fetchArtistByUserIdAction } from '@/app/actions/artists';

interface DashboardContentProps {
  activeView: string;
  userId?: string; // Añadir userId como prop
  onNavigate(view: string): void; // Añadir prop: string
}

export default function DashboardContent({ activeView, userId, onNavigate }: DashboardContentProps) {
  const [artistProfile, setArtistProfile] = useState<any>(null);
  const [loadingProfile, setLoadingProfile] = useState(false);

  // Fetch artist profile when needed
  useEffect(() => {
    if (userId && activeView === 'Update Artist Profile') {
      setLoadingProfile(true);
      fetchArtistByUserIdAction(userId)
        .then(result => {
          if (result.success && result.profile) {
            setArtistProfile(result.profile[0]); // profile is an array
          }
        })
        .finally(() => setLoadingProfile(false));
    }
  }, [userId, activeView]);

  // Función que retorna el componente basado en la vista activa
  const renderView = () => {
    switch (activeView) {
      case 'System Settings':
        return <div>System Settings</div>;
      case 'User Managment':
        return <div>User Managment</div>;
      case 'Browse Users':
        return <BrowseUsers />;
      case 'Browse Artists':
        return <BrowseArtists onNavigate={onNavigate}/>;
      case 'Mailing List':
        return <MailingList />;
      case 'Cluster Managment':
        return <div>Cluster Management</div>;
      case 'Event List':
        return <BrowseEvents />;
      case 'Venues':
        return <BrowseVenues />;
      case 'Financial Control':
        return <div>Financial Control</div>;
      case 'Analitics':
        return <div>Analytics</div>;
      case 'Security Logs':
        return <div>Security Logs</div>;
      case 'Profile':
        return userId ? <DisplayProfile userId={userId} onNavigate={onNavigate} /> : <div>User ID not available</div>;
      case 'Update Profile':
        return userId ? (
          <UpdateProfile userId={userId} onNavigate={onNavigate} />
        ) : (
          <div>User ID not available</div>
        );
      case 'Change Password':
        return userId ? (
          <ChangePassword userId={userId} onNavigate={onNavigate} />
        ) : (
          <div>User ID not available</div>
        );

      // artist dashboard
      case 'Artist Profile':
        return userId ? (
          <ArtistProfile userId={userId} onNavigate={onNavigate} />
        ) : (
          <div>User ID not available</div>
        );

      case 'Create Artist Profile':
        return userId ? (
          <ArtistProfileCreate
            userId={userId}
            onNavigate={onNavigate}
          />
        ) : (
          <div>User ID not available</div>
        );
      
        case 'Update Artist Profile':
          if (!userId) return <div>User ID not available</div>;
          if (loadingProfile) return <div>Loading profile...</div>;
          if (!artistProfile) return <div>No artist profile found</div>;
        return userId ? (
          <ArtistProfileUpdate
            userId={userId}
            artistId={artistProfile.id}
            initialData={artistProfile}
            onNavigate={onNavigate}
          />
        ) : (
          <div>User ID not available</div>
        );

      default:
        return <div>Select an option from the menu</div>;
    }
  };

  return <>{renderView()}</>;
}