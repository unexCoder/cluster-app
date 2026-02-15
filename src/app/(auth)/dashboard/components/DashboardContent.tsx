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
import VenueProfileCreate from './views/VenueProfileCreate';
import EventCreate from './views/EventCreate';
import { fetchArtistByUserIdAction, fetchArtistByIdAction } from '@/app/actions/artists';
import VenueProfileUpdate from './views/VenueProfileUpdate';
import { getVenueByIdAction } from '@/app/actions/venues';
import EmailComposer from './views/EmailComposer';
import EventEdit from './views/EventEdit';
import { fetchEventByIdAction } from '@/app/actions/events';
import BrowseArtistEventLink from './views/BrowseArtistEventLink';
import ArtistEventLinkCreate from './views/ArtistEventLinkCreate';
import ArtistEventLinkEdit from './views/ArtistEventLinkEdit';
import PerformanceDetail from './views/PerformanceDetail';
import { getEventArtistPerformanceByIdAction } from '@/app/actions/artist-event-link';

interface DashboardContentProps {
  activeView: string;
  userId: string; // Añadir userId como prop
  artistId?: string | null;
  venueId?: string | null;
  eventId?: string | null;
  performanceId?: string | null;
  onNavigate(view: string, artistId?: string | null, eventId?: string | null): void;
}

export default function DashboardContent({ activeView, userId, artistId, venueId, eventId, performanceId, onNavigate }: DashboardContentProps) {
  const [artistProfile, setArtistProfile] = useState<any>(null);
  const [loadingProfile, setLoadingProfile] = useState(false);
  const [venueProfile, setVenueProfile] = useState<any>(null);
  const [eventData, setEventData] = useState<any>(null);
  const [performanceData, setPerformanceData] = useState<any>(null);

  // Fetch artist profile when needed
  useEffect(() => {
    if (activeView === 'Update Artist Profile' || activeView === 'Artist Profile') {
      setLoadingProfile(true);
      setArtistProfile(null); // Reset profile

      if (artistId) {
        // Admin viewing specific artist
        fetchArtistByIdAction(artistId)
          .then(result => {
            if (result.success && result.profile) {
              setArtistProfile(result.profile);
            }
          })
          .finally(() => setLoadingProfile(false));
      } else if (userId) {
        // User viewing their own profile
        fetchArtistByUserIdAction(userId)
          .then(result => {
            if (result.success && result.profile) {
              setArtistProfile(result.profile[0]);
            }
          })
          .finally(() => setLoadingProfile(false));
      } else {
        setLoadingProfile(false);
      }
    }
  }, [userId, artistId, activeView]);

  // Fetch venue profile when needed
  useEffect(() => {
    if (activeView === 'Venue Profile Edit') {
      setLoadingProfile(true);
      setVenueProfile(null); // Reset profile
      if (venueId) {
        getVenueByIdAction(venueId)
          .then(result => {
            if (result.success && result.venue) {
              setVenueProfile(result.venue);
            }
          })
          .finally(() => setLoadingProfile(false));
      } else {
        setLoadingProfile(false);
      }
    }
  }, [venueId, activeView]);

  // Fetch event data when needed
  useEffect(() => {
    if (activeView === 'Event Edit' && eventId) {
      setLoadingProfile(true)
      setEventData(null)

      fetchEventByIdAction(eventId)
        .then((data) => {
          if (data.success && data.event) {
            setEventData(data.event)  // ← unwrap here
          }
        })
        .catch((err) => console.error('Failed to fetch event:', err))
        .finally(() => setLoadingProfile(false))
    }
  }, [activeView, eventId])

  // Fetch performance data when needed
  useEffect(() => {
    if (activeView === 'Artist Event Link Edit' && performanceId) {
      setLoadingProfile(true)
      setPerformanceData(null)

      getEventArtistPerformanceByIdAction(performanceId)
        .then((data) => {
          if (data.success && data.performance) {
            setPerformanceData(data.performance)  // ← unwrap here
          }
        })
        .catch((err) => console.error('Failed to fetch performances:', err))
        .finally(() => setLoadingProfile(false))
    }
  }, [activeView, performanceId])

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
        return <BrowseArtists onNavigate={onNavigate} />;
      case 'Mailing List':
        return <MailingList />;
      case 'Cluster Managment':
        return <div>Cluster Management</div>;
      case 'Event List':
        return <BrowseEvents onNavigate={onNavigate} />;
      case 'Event Create':
        return <EventCreate userId={userId} onNavigate={onNavigate} />;
      case 'Event Edit':
        // return <div>Event Edit</div>
        if (!eventId) return <div>Event ID not available</div>;
        if (loadingProfile) return <div>Loading event...</div>;
        if (!eventData) return <div>No event found</div>;
        return <EventEdit
          eventId={eventId}
          onNavigate={onNavigate}
          initialData={eventData}
        />
      case 'Venues':
        return <BrowseVenues onNavigate={onNavigate} />;
      case 'Create Venue Profile':
        return <VenueProfileCreate onNavigate={onNavigate} />
      case 'Venue Profile Edit':
        if (!venueId) return <div>Venue ID not available</div>;
        if (loadingProfile) return <div>Loading profile...</div>;
        if (!venueProfile) return <div>No venue profile found</div>;
        return <VenueProfileUpdate
          venueId={venueId}
          onNavigate={onNavigate}
          initialData={venueProfile}
        />
      case 'Artist > Event Link':
        return <BrowseArtistEventLink onNavigate={onNavigate} />
      case 'Artist Event Link Create':
        return <ArtistEventLinkCreate onNavigate={onNavigate} />
      case 'Artist Event Link Edit':
        if (!performanceId) return <div>Performance ID not available</div>;
        if (loadingProfile) return <div>Loading profile...</div>;
        if (!performanceData) return <div>No performance data found</div>;
        return <ArtistEventLinkEdit
          performanceId={performanceId}
          onNavigate={onNavigate}
          initialData={performanceData}
        />
      case 'Performance Detail':
        if (!performanceId) return <div>Performance ID not available</div>;
        return <PerformanceDetail 
        performanceId={performanceId} 
        onNavigate={onNavigate}       
        artistId={artistId ?? undefined}   // ← pass it through
      />
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
      case 'Email':
        return <EmailComposer />;
      // return <div>Send Email</div>;
      // Artist dashboard
      case 'Artist Profile':
        if (loadingProfile) return <div>Loading profile...</div>;

        if (artistId) {
          // Admin viewing specific artist
          if (!artistProfile) return <div>No artist profile found</div>;
          return <ArtistProfile userId={artistProfile.user_id} profile={artistProfile} onNavigate={onNavigate} />;
        } else {
          // User viewing their own profile
          return userId ? (
            <ArtistProfile userId={userId} onNavigate={onNavigate} />
          ) : (
            <div>User ID not available</div>
          );
        }

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
            userId={artistProfile.user_id}
            artistId={artistProfile.id}
            initialData={artistProfile}
            onNavigate={onNavigate}
          />
        ) : (
          <div>User ID not available</div>
        );

      case 'Gigs List':
        if (!userId) return <div>User ID not available</div>;
        if (!artistId) return <div>Artist profile not found</div>;
        return (
          <BrowseArtistEventLink
            artistId={artistId ?? undefined}
            onNavigate={onNavigate}
          />
        );

      default:
        return <div>Select an option from the menu</div>;
    }
  };

  return <>{renderView()}</>;
}