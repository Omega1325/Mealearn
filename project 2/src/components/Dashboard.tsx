import { motion } from 'framer-motion';
import { Trophy, Flame, TrendingUp } from 'lucide-react';
import { useApp } from '../context/AppContext';
import { DiversityGauge } from './DiversityGauge';
import { DailyColorChallenge } from './DailyColorChallenge';

export function Dashboard() {
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

  return (
    <motion.div
      variants={container}
      initial="hidden"
      animate="show"
      className="pb-32 px-6 pt-8"
    >
      <motion.div variants={item} className="mb-8">
        <h1 className="text-3xl font-bold text-gray-900 mb-1">
          Bonjour, {userProfile.name}
        </h1>
        <p className="text-gray-600">Continuons votre voyage coloré</p>
      </motion.div>

      <motion.div variants={item} className="grid grid-cols-3 gap-4 mb-8">
        <StatCard
          icon={Trophy}
          label="Niveau"
          value={userProfile.level.toString()}
          subtitle={userProfile.levelName}
          color="from-amber-400 to-orange-500"
        />
        <StatCard
          icon={TrendingUp}
          label="Points"
          value={userProfile.points.toString()}
          color="from-[#4C7C32] to-[#3a5f27]"
        />
        <StatCard
          icon={Flame}
          label="Série"
          value={`${userProfile.streak}j`}
          color="from-orange-500 to-red-500"
        />
      </motion.div>

      <motion.div variants={item} className="mb-6">
        <DiversityGauge meals={userProfile.meals} />
      </motion.div>

      <motion.div variants={item} className="mb-6">
        <DailyColorChallenge meals={userProfile.meals} />
      </motion.div>

      <motion.div variants={item}>
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-xl font-bold text-gray-900">Repas récents</h2>
          <span className="text-sm text-gray-500">{userProfile.meals.length} repas</span>
        </div>
        <div className="space-y-3">
          {userProfile.meals.slice(0, 5).map((meal, index) => (
            <MealCard key={meal.id} meal={meal} delay={index * 0.05} />
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
  subtitle,
  color,
}: {
  icon: typeof Trophy;
  label: string;
  value: string;
  subtitle?: string;
  color: string;
}) {
  return (
    <div className="bg-white rounded-3xl p-4 shadow-lg border border-gray-100">
      <div className={`w-10 h-10 rounded-2xl bg-gradient-to-br ${color} flex items-center justify-center mb-3`}>
        <Icon className="w-5 h-5 text-white" strokeWidth={2.5} />
      </div>
      <div className="text-sm text-gray-500 mb-1">{label}</div>
      <div className="text-2xl font-bold text-gray-900">{value}</div>
      {subtitle && <div className="text-xs text-gray-400 mt-1">{subtitle}</div>}
    </div>
  );
}

function MealCard({ meal, delay }: { meal: any; delay: number }) {
  return (
    <motion.div
      initial={{ opacity: 0, x: -20 }}
      animate={{ opacity: 1, x: 0 }}
      transition={{ delay }}
      className="bg-white rounded-3xl p-4 shadow-lg border border-gray-100 flex items-center gap-4"
    >
      <img
        src={meal.imageUrl}
        alt={meal.name}
        className="w-20 h-20 rounded-2xl object-cover"
      />
      <div className="flex-1">
        <h3 className="font-semibold text-gray-900 mb-1">{meal.name}</h3>
        <div className="flex gap-1.5 mb-2">
          {meal.colors.map((color: string) => (
            <div
              key={color}
              className={`w-5 h-5 rounded-full ${getColorClass(color)}`}
            />
          ))}
        </div>
        <div className="text-xs text-gray-500">
          {new Date(meal.date).toLocaleDateString('fr-FR')}
        </div>
      </div>
      <div className="text-right">
        <div className="text-2xl font-bold text-[#4C7C32]">+{meal.points}</div>
        <div className="text-xs text-gray-500">points</div>
      </div>
    </motion.div>
  );
}

function getColorClass(color: string): string {
  const colors: Record<string, string> = {
    red: 'bg-red-500',
    orange: 'bg-orange-500',
    yellow: 'bg-yellow-400',
    green: 'bg-green-500',
    purple: 'bg-purple-500',
  };
  return colors[color] || 'bg-gray-500';
}
