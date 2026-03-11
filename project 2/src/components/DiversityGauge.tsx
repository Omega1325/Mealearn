import { motion } from 'framer-motion';
import { Meal, ColorGroup } from '../types';

export function DiversityGauge({ meals }: { meals: Meal[] }) {
  const last7Days = meals.filter((meal) => {
    const daysDiff = Math.floor((Date.now() - new Date(meal.date).getTime()) / (1000 * 60 * 60 * 24));
    return daysDiff <= 7;
  });

  const uniqueColors = new Set<ColorGroup>();
  last7Days.forEach((meal) => {
    meal.colors.forEach((color) => uniqueColors.add(color));
  });

  const diversityScore = (uniqueColors.size / 5) * 100;
  const strokeDasharray = 314;
  const strokeDashoffset = strokeDasharray - (strokeDasharray * diversityScore) / 100;

  return (
    <div className="bg-gradient-to-br from-white to-gray-50 rounded-[32px] p-6 shadow-xl border border-gray-200/50">
      <h2 className="text-xl font-bold text-gray-900 mb-6">Score de Diversité</h2>

      <div className="flex flex-col items-center justify-center mb-8">
        <div className="relative w-40 h-28 flex items-center justify-center">
          <svg className="absolute transform -rotate-90" width="160" height="100" viewBox="0 0 160 100">
            <path
              d="M 10 80 A 70 70 0 0 1 150 80"
              fill="none"
              stroke="#e5e7eb"
              strokeWidth="14"
              strokeLinecap="round"
            />
            <motion.path
              d="M 10 80 A 70 70 0 0 1 150 80"
              fill="none"
              stroke="url(#gradient)"
              strokeWidth="14"
              strokeLinecap="round"
              strokeDasharray={strokeDasharray}
              initial={{ strokeDashoffset: strokeDasharray }}
              animate={{ strokeDashoffset }}
              transition={{ duration: 1.5, ease: 'easeOut' }}
            />
            <defs>
              <linearGradient id="gradient" x1="0%" y1="0%" x2="100%" y2="0%">
                <stop offset="0%" stopColor="#4C7C32" />
                <stop offset="50%" stopColor="#f97316" />
                <stop offset="100%" stopColor="#ef4444" />
              </linearGradient>
            </defs>
          </svg>

          <div className="text-center z-10">
            <motion.div
              initial={{ scale: 0 }}
              animate={{ scale: 1 }}
              transition={{ delay: 0.5, type: 'spring' }}
              className="text-4xl font-bold bg-gradient-to-r from-[#4C7C32] to-[#f97316] bg-clip-text text-transparent"
            >
              {Math.round(diversityScore)}%
            </motion.div>
            <div className="text-xs text-gray-500 mt-0.5">7 jours</div>
          </div>
        </div>
      </div>

      <div className="flex justify-center gap-2">
        {(['red', 'orange', 'yellow', 'green', 'purple'] as ColorGroup[]).map((color) => (
          <motion.div
            key={color}
            initial={{ scale: 0 }}
            animate={{ scale: 1 }}
            transition={{ delay: 0.3, type: 'spring' }}
            className={`w-8 h-8 rounded-full ${getColorClass(color)} ${
              uniqueColors.has(color) ? 'opacity-100 shadow-lg' : 'opacity-30'
            }`}
          />
        ))}
      </div>

      <div className="mt-4 text-center text-sm text-gray-600">
        {uniqueColors.size === 5 ? (
          <span className="text-[#4C7C32] font-semibold">Parfait! Toutes les couleurs consommées</span>
        ) : (
          <span>Il vous manque {5 - uniqueColors.size} couleur(s)</span>
        )}
      </div>
    </div>
  );
}

function getColorClass(color: ColorGroup): string {
  const colors: Record<ColorGroup, string> = {
    red: 'bg-red-500',
    orange: 'bg-orange-500',
    yellow: 'bg-yellow-400',
    green: 'bg-green-500',
    purple: 'bg-purple-500',
  };
  return colors[color];
}
