import { createContext, useContext, useState, ReactNode } from 'react';
import { UserProfile, Meal, Badge, Reward, Page, ColorGroup } from '../types';

interface AppContextType {
  currentPage: Page;
  setCurrentPage: (page: Page) => void;
  userProfile: UserProfile;
  addMeal: (meal: Meal) => void;
  rewards: Reward[];
  claimReward: (rewardId: string) => void;
}

const AppContext = createContext<AppContextType | undefined>(undefined);

const initialMeals: Meal[] = [
  {
    id: '1',
    name: 'Salade Arc-en-ciel',
    imageUrl: 'https://images.unsplash.com/photo-1512621776951-a57141f2eefd?w=800&q=80',
    date: new Date(Date.now() - 1 * 24 * 60 * 60 * 1000),
    colors: ['red', 'orange', 'yellow', 'green', 'purple'],
    points: 120,
  },
  {
    id: '2',
    name: 'Buddha Bowl',
    imageUrl: 'https://images.unsplash.com/photo-1546069901-ba9599a7e63c?w=800&q=80',
    date: new Date(Date.now() - 2 * 24 * 60 * 60 * 1000),
    colors: ['green', 'yellow', 'orange', 'red'],
    points: 95,
  },
  {
    id: '3',
    name: 'Poké Bowl Saumon',
    imageUrl: 'https://images.unsplash.com/photo-1546069901-d5bfd2cbfb1f?w=800&q=80',
    date: new Date(Date.now() - 3 * 24 * 60 * 60 * 1000),
    colors: ['red', 'orange', 'green'],
    points: 80,
  },
  {
    id: '4',
    name: 'Assiette Méditerranéenne',
    imageUrl: 'https://images.unsplash.com/photo-1540189549336-e6e99c3679fe?w=800&q=80',
    date: new Date(Date.now() - 4 * 24 * 60 * 60 * 1000),
    colors: ['red', 'green', 'yellow'],
    points: 75,
  },
  {
    id: '5',
    name: 'Bowl Végétarien',
    imageUrl: 'https://images.unsplash.com/photo-1511690656952-34342bb7c2f2?w=800&q=80',
    date: new Date(Date.now() - 5 * 24 * 60 * 60 * 1000),
    colors: ['green', 'orange', 'purple'],
    points: 85,
  },
];

const initialBadges: Badge[] = [
  {
    id: '1',
    name: 'Arc-en-ciel',
    icon: '🌈',
    description: 'Mangé les 5 couleurs en un repas',
    unlocked: true,
  },
  {
    id: '2',
    name: 'Early Bird',
    icon: '🌅',
    description: 'Petit-déjeuner sain 7 jours consécutifs',
    unlocked: true,
  },
  {
    id: '3',
    name: 'Explorateur',
    icon: '🗺️',
    description: 'Essayé 10 restaurants différents',
    unlocked: false,
  },
  {
    id: '4',
    name: 'Marathonien',
    icon: '🏃',
    description: 'Série de 30 jours',
    unlocked: false,
  },
];

const initialRewards: Reward[] = [
  {
    id: '1',
    name: 'Coupon 10€',
    description: 'Réduction sur votre prochain repas',
    cost: 1000,
    image: 'https://images.unsplash.com/photo-1555939594-58d7cb561ad1?w=400&q=80',
    status: 'available',
  },
  {
    id: '2',
    name: 'Gourde Premium',
    description: 'Gourde isotherme écologique',
    cost: 2500,
    image: 'https://images.unsplash.com/photo-1602143407151-7111542de6e8?w=400&q=80',
    status: 'available',
  },
  {
    id: '3',
    name: 'Set Couverts Bambou',
    description: 'Kit couverts réutilisables',
    cost: 1500,
    image: 'https://images.unsplash.com/photo-1606761568499-6d2451b23c66?w=400&q=80',
    status: 'available',
  },
  {
    id: '4',
    name: 'Cashback 50€',
    description: 'Remboursement sur votre compte',
    cost: 5000,
    image: 'https://images.unsplash.com/photo-1579621970563-ebec7560ff3e?w=400&q=80',
    status: 'locked',
    requiredLevel: 15,
  },
];

export function AppProvider({ children }: { children: ReactNode }) {
  const [currentPage, setCurrentPage] = useState<Page>('dashboard');
  const [userProfile, setUserProfile] = useState<UserProfile>({
    name: 'Alexandre',
    level: 12,
    levelName: 'Ambassadeur',
    points: 4500,
    streak: 5,
    meals: initialMeals,
    badges: initialBadges,
  });
  const [rewards, setRewards] = useState<Reward[]>(initialRewards);

  const addMeal = (meal: Meal) => {
    setUserProfile((prev) => ({
      ...prev,
      meals: [meal, ...prev.meals],
      points: prev.points + meal.points,
    }));
  };

  const claimReward = (rewardId: string) => {
    const reward = rewards.find((r) => r.id === rewardId);
    if (reward && reward.status === 'available' && userProfile.points >= reward.cost) {
      setRewards((prev) =>
        prev.map((r) => (r.id === rewardId ? { ...r, status: 'claimed' as const } : r))
      );
      setUserProfile((prev) => ({
        ...prev,
        points: prev.points - reward.cost,
      }));
    }
  };

  return (
    <AppContext.Provider
      value={{
        currentPage,
        setCurrentPage,
        userProfile,
        addMeal,
        rewards,
        claimReward,
      }}
    >
      {children}
    </AppContext.Provider>
  );
}

export function useApp() {
  const context = useContext(AppContext);
  if (context === undefined) {
    throw new Error('useApp must be used within an AppProvider');
  }
  return context;
}
