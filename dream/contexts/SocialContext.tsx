import React, { createContext, useContext, useState } from 'react';

interface Team {
  id: string;
  name: string;
  avatar: string;
  wins: number;
  losses: number;
  followers: number;
}

interface SocialContextType {
  followedTeams: Team[];
  followTeam: (team: Team) => void;
  unfollowTeam: (teamId: string) => void;
  isFollowing: (teamId: string) => boolean;
}

const SocialContext = createContext<SocialContextType | undefined>(undefined);

export const SocialProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [followedTeams, setFollowedTeams] = useState<Team[]>([]);

  const followTeam = (team: Team) => {
    setFollowedTeams(prev => {
      if (prev.find(t => t.id === team.id)) {
        return prev;
      }
      return [...prev, team];
    });
  };

  const unfollowTeam = (teamId: string) => {
    setFollowedTeams(prev => prev.filter(team => team.id !== teamId));
  };

  const isFollowing = (teamId: string) => {
    return followedTeams.some(team => team.id === teamId);
  };

  return (
    <SocialContext.Provider value={{
      followedTeams,
      followTeam,
      unfollowTeam,
      isFollowing,
    }}>
      {children}
    </SocialContext.Provider>
  );
};

export const useSocial = () => {
  const context = useContext(SocialContext);
  if (context === undefined) {
    throw new Error('useSocial must be used within a SocialProvider');
  }
  return context;
};