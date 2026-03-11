import { motion } from 'framer-motion';
import { Trophy, Flame, TrendingUp, Award } from 'lucide-react';
import { useApp } from '../context/AppContext';
import { BarChart, Bar, XAxis, YAxis, ResponsiveContainer, Cell } from 'recharts';
import { ColorGroup } from '../types';

export function ProfilePage() {
  const { userProfile } = useApp();

  const container = {
    hidden: { opacity: 0 },
    show: {
      opacity: 1,
      transition: {
        staggerChildren: 0.1,
      },
    },
  };

  const item = {
    hidden: { opacity: 0, y: 20 },
    show: { opacity: 1, y: 0 },
  };

  const colorData = getColorConsumptionData(userProfile.meals);
  const levelProgress = ((userProfile.level % 5) / 5) * 100;

  return (
    <motion.div
      variants={container}
      initial="hidden"
      animate="show"
      className="pb-32 px-6 pt-8"
    >
      <motion.div variants={item} className="text-center mb-8">
        <div className="w-24 h-24 bg-gradient-to-br from-[#4C7C32] to-[#3a5f27] rounded-[32px] mx-auto mb-4 flex items-center justify-center shadow-2xl">
          <span className="text-4xl font-bold text-white">
            {userProfile.name.charAt(0)}
          </span>
        </div>
        <h1 className="text-3xl font-bold text-gray-900 mb-1">{userProfile.name}</h1>
        <div className="text-lg text-gray-600 font-medium">{userProfile.levelName}</div>
      </motion.div>

      <motion.div variants={item} className="grid grid-cols-3 gap-4 mb-8">
        <StatCard icon={Trophy} label="Niveau" value={userProfile.level.toString()} color="from-amber-400 to-orange-500" />
        <StatCard icon={TrendingUp} label="Points" value={userProfile.points.toString()} color="from-[#4C7C32] to-[#3a5f27]" />
        <StatCard icon={Flame} label="Série" value={`${userProfile.streak}j`} color="from-orange-500 to-red-500" />
      </motion.div>

      <motion.div variants={item} className="bg-white rounded-[32px] p-6 shadow-xl border border-gray-200/50 mb-6">
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-xl font-bold text-gray-900">Progression</h2>
          <span className="text-sm text-gray-500">Niveau {userProfile.level}</span>
        </div>

        <div className="relative h-3 bg-gray-200 rounded-full overflow-hidden mb-4">
          <motion.div
            initial={{ width: 0 }}
            animate={{ width: `${levelProgress}%` }}
            transition={{ duration: 1, ease: 'easeOut' }}
            className="absolute inset-y-0 left-0 bg-gradient-to-r from-[#4C7C32] to-[#f97316] rounded-full"
          />
        </div>

        <div className="grid grid-cols-4 gap-3">
          {['Novice', 'Apprenti', 'Chef', 'Ambassadeur'].map((level, index) => (
            <LevelBadge
              key={level}
              name={level}
              level={index * 5 + 1}
              isUnlocked={userProfile.level >= index * 5 + 1}
              delay={index * 0.1}
            />
          ))}
        </div>
      </motion.div>

      <motion.div variants={item} className="bg-white rounded-[32px] p-6 shadow-xl border border-gray-200/50 mb-6">
        <h2 className="text-xl font-bold text-gray-900 mb-6">Consommation par couleur</h2>
        <div className="h-48">
          <ResponsiveContainer width="100%" height="100%">
            <BarChart data={colorData}>
              <XAxis dataKey="name" tick={{ fill: '#6b7280', fontSize: 12 }} />
              <YAxis tick={{ fill: '#6b7280', fontSize: 12 }} />
              <Bar dataKey="count" radius={[12, 12, 0, 0]}>
                {colorData.map((entry, index) => (
                  <Cell key={`cell-${index}`} fill={entry.color} />
                ))}
              </Bar>
            </BarChart>
          </ResponsiveContainer>
        </div>
        <p className="text-sm text-gray-500 text-center mt-4">7 derniers jours</p>
      </motion.div>

      <motion.div variants={item} className="bg-white rounded-[32px] p-6 shadow-xl border border-gray-200/50 mb-6">
        <div className="flex items-center gap-3 mb-6">
          <div className="w-10 h-10 bg-gradient-to-br from-purple-400 to-pink-500 rounded-2xl flex items-center justify-center">
            <Award className="w-6 h-6 text-white" />
          </div>
          <h2 className="text-xl font-bold text-gray-900">Badges</h2>
        </div>

        <div className="grid grid-cols-2 gap-4">
          {userProfile.badges.map((badge, index) => (
            <BadgeCard key={badge.id} badge={badge} delay={index * 0.1} />
          ))}
        </div>
      </motion.div>

      <motion.div variants={item} className="bg-white rounded-[32px] p-6 shadow-xl border border-gray-200/50">
        <h2 className="text-xl font-bold text-gray-900 mb-4">Galerie de repas</h2>
        <div className="grid grid-cols-3 gap-3">
          {userProfile.meals.slice(0, 9).map((meal, index) => (
            <motion.div
              key={meal.id}
              initial={{ opacity: 0, scale: 0.8 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ delay: index * 0.05 }}
              className="aspect-square rounded-2xl overflow-hidden shadow-md"
            >
              <img src={meal.imageUrl} alt={meal.name} className="w-full h-full object-cover" />
            </motion.div>
          ))}
        </div>
      </motion.div>
    </motion.div>
  );
}

function StatCard({
  icon: Icon,
  label,
  value,
  color,
}: {
  icon: typeof Trophy;
  label: string;
  value: string;
  color: string;
}) {
  return (
    <div className="bg-white rounded-3xl p-4 shadow-lg border border-gray-100">
      <div className={`w-10 h-10 rounded-2xl bg-gradient-to-br ${color} flex items-center justify-center mb-3`}>
        <Icon className="w-5 h-5 text-white" strokeWidth={2.5} />
      </div>
      <div className="text-sm text-gray-500 mb-1">{label}</div>
      <div className="text-2xl font-bold text-gray-900">{value}</div>
    </div>
  );
}

function LevelBadge({
  name,
  level,
  isUnlocked,
  delay,
}: {
  name: string;
  level: number;
  isUnlocked: boolean;
  delay: number;
}) {
  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.8 }}
      animate={{ opacity: 1, scale: 1 }}
      transition={{ delay }}
      className={`text-center p-3 rounded-2xl ${
        isUnlocked ? 'bg-gradient-to-br from-[#4C7C32]/10 to-[#f97316]/10' : 'bg-gray-50'
      }`}
    >
      <div className={`text-2xl mb-1 ${isUnlocked ? '' : 'grayscale opacity-40'}`}>
        {level === 1 ? '🌱' : level === 5 ? '🌿' : level === 10 ? '👨‍🍳' : '🏆'}
      </div>
      <div className={`text-xs font-semibold ${isUnlocked ? 'text-gray-900' : 'text-gray-400'}`}>
        {name}
      </div>
      <div className={`text-xs ${isUnlocked ? 'text-gray-500' : 'text-gray-400'}`}>Niv. {level}</div>
    </motion.div>
  );
}

function BadgeCard({ badge, delay }: { badge: any; delay: number }) {
  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.8 }}
      animate={{ opacity: 1, scale: 1 }}
      transition={{ delay }}
      className={`p-4 rounded-2xl border-2 ${
        badge.unlocked
          ? 'bg-gradient-to-br from-white to-gray-50 border-[#4C7C32] shadow-lg'
          : 'bg-gray-50 border-gray-200 opacity-50'
      }`}
    >
      <div className={`text-4xl mb-2 ${badge.unlocked ? '' : 'grayscale'}`}>{badge.icon}</div>
      <div className={`font-semibold text-sm mb-1 ${badge.unlocked ? 'text-gray-900' : 'text-gray-400'}`}>
        {badge.name}
      </div>
      <div className={`text-xs ${badge.unlocked ? 'text-gray-600' : 'text-gray-400'}`}>
        {badge.description}
      </div>
    </motion.div>
  );
}

function getColorConsumptionData(meals: any[]) {
  const last7Days = meals.filter((meal) => {
    const daysDiff = Math.floor((Date.now() - new Date(meal.date).getTime()) / (1000 * 60 * 60 * 24));
    return daysDiff <= 7;
  });

  const colorCounts: Record<ColorGroup, number> = {
    red: 0,
    orange: 0,
    yellow: 0,
    green: 0,
    purple: 0,
  };

  last7Days.forEach((meal) => {
    meal.colors.forEach((color: ColorGroup) => {
      colorCounts[color]++;
    });
  });

  return [
    { name: 'Rouge', count: colorCounts.red, color: '#ef4444' },
    { name: 'Orange', count: colorCounts.orange, color: '#f97316' },
    { name: 'Jaune', count: colorCounts.yellow, color: '#facc15' },
    { name: 'Vert', count: colorCounts.green, color: '#4C7C32' },
    { name: 'Violet', count: colorCounts.purple, color: '#a855f7' },
  ];
}
