import { motion } from 'framer-motion';
import { Check } from 'lucide-react';
import { Meal, ColorGroup } from '../types';

export function DailyColorChallenge({ meals }: { meals: Meal[] }) {
  const today = new Date();
  today.setHours(0, 0, 0, 0);

  const todayMeals = meals.filter((meal) => {
    const mealDate = new Date(meal.date);
    mealDate.setHours(0, 0, 0, 0);
    return mealDate.getTime() === today.getTime();
  });

  const todayColors = new Set<ColorGroup>();
  todayMeals.forEach((meal) => {
    meal.colors.forEach((color) => todayColors.add(color));
  });

  const colorGroups: { color: ColorGroup; label: string; example: string }[] = [
    { color: 'red', label: 'Rouge', example: 'Tomates, fraises' },
    { color: 'orange', label: 'Orange', example: 'Carottes, oranges' },
    { color: 'yellow', label: 'Jaune', example: 'Bananes, maïs' },
    { color: 'green', label: 'Vert', example: 'Épinards, kiwi' },
    { color: 'purple', label: 'Violet', example: 'Aubergines, myrtilles' },
  ];

  return (
    <div className="bg-gradient-to-br from-white to-gray-50 rounded-[32px] p-6 shadow-xl border border-gray-200/50">
      <div className="flex items-center justify-between mb-6">
        <h2 className="text-xl font-bold text-gray-900">Défi Quotidien</h2>
        <div className="text-sm font-medium text-[#4C7C32]">
          {todayColors.size}/5 couleurs
        </div>
      </div>

      <div className="space-y-3">
        {colorGroups.map((group, index) => {
          const isCompleted = todayColors.has(group.color);
          return (
            <motion.div
              key={group.color}
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: index * 0.1 }}
              className={`relative bg-white rounded-2xl p-4 border-2 transition-all ${
                isCompleted
                  ? 'border-[#4C7C32] shadow-md'
                  : 'border-gray-200 opacity-60'
              }`}
            >
              <div className="flex items-center gap-4">
                <div className="relative">
                  <div
                    className={`w-12 h-12 rounded-xl ${getColorClass(group.color)} shadow-lg`}
                  />
                  {isCompleted && (
                    <motion.div
                      initial={{ scale: 0 }}
                      animate={{ scale: 1 }}
                      className="absolute -top-1 -right-1 w-6 h-6 bg-[#4C7C32] rounded-full flex items-center justify-center shadow-lg"
                    >
                      <Check className="w-4 h-4 text-white" strokeWidth={3} />
                    </motion.div>
                  )}
                </div>

                <div className="flex-1">
                  <div className="font-semibold text-gray-900 mb-0.5">
                    {group.label}
                  </div>
                  <div className="text-xs text-gray-500">{group.example}</div>
                </div>

                {isCompleted && (
                  <motion.div
                    initial={{ scale: 0 }}
                    animate={{ scale: 1 }}
                    className="text-2xl"
                  >
                    ✓
                  </motion.div>
                )}
              </div>
            </motion.div>
          );
        })}
      </div>

      {todayColors.size === 5 && (
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          className="mt-6 p-4 bg-gradient-to-r from-[#4C7C32] to-[#3a5f27] rounded-2xl text-white text-center"
        >
          <div className="text-2xl mb-1">🎉</div>
          <div className="font-semibold">Défi complété!</div>
          <div className="text-sm opacity-90">+50 points bonus</div>
        </motion.div>
      )}
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
