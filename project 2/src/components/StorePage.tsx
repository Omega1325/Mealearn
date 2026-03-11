import { motion } from 'framer-motion';
import { Lock, Check, Sparkles } from 'lucide-react';
import { useApp } from '../context/AppContext';
import { Reward } from '../types';

export function StorePage() {
  const { userProfile, rewards, claimReward } = useApp();

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
        <h1 className="text-3xl font-bold text-gray-900 mb-2">Store</h1>
        <div className="flex items-center gap-2">
          <div className="flex items-center gap-2 bg-gradient-to-r from-[#4C7C32] to-[#3a5f27] text-white px-6 py-3 rounded-[20px] shadow-lg">
            <Sparkles className="w-5 h-5" />
            <span className="font-bold text-xl">{userProfile.points}</span>
            <span className="text-sm opacity-90">points</span>
          </div>
        </div>
      </motion.div>

      <motion.div variants={item} className="mb-6">
        <h2 className="text-lg font-semibold text-gray-900 mb-4">Récompenses disponibles</h2>
        <div className="grid grid-cols-1 gap-4">
          {rewards.map((reward, index) => (
            <RewardCard
              key={reward.id}
              reward={reward}
              userPoints={userProfile.points}
              userLevel={userProfile.level}
              onClaim={() => claimReward(reward.id)}
              delay={index * 0.1}
            />
          ))}
        </div>
      </motion.div>

      <motion.div
        variants={item}
        className="bg-gradient-to-br from-orange-50 to-orange-100 rounded-[32px] p-6 border border-orange-200"
      >
        <div className="text-4xl mb-3">💡</div>
        <h3 className="font-bold text-gray-900 mb-2">Gagnez plus de points</h3>
        <p className="text-sm text-gray-700">
          Scannez vos repas quotidiennement et complétez le défi des 5 couleurs pour accumuler des points rapidement!
        </p>
      </motion.div>
    </motion.div>
  );
}

function RewardCard({
  reward,
  userPoints,
  userLevel,
  onClaim,
  delay,
}: {
  reward: Reward;
  userPoints: number;
  userLevel: number;
  onClaim: () => void;
  delay: number;
}) {
  const isLocked = reward.status === 'locked' || (reward.requiredLevel && userLevel < reward.requiredLevel);
  const isClaimed = reward.status === 'claimed';
  const canAfford = userPoints >= reward.cost;

  return (
    <motion.div
      initial={{ opacity: 0, x: -20 }}
      animate={{ opacity: 1, x: 0 }}
      transition={{ delay }}
      className={`bg-white rounded-3xl overflow-hidden shadow-lg border ${
        isClaimed
          ? 'border-green-200 opacity-75'
          : isLocked
          ? 'border-gray-200 opacity-60'
          : 'border-gray-200'
      }`}
    >
      <div className="flex gap-4 p-4">
        <div className="relative flex-shrink-0">
          <img
            src={reward.image}
            alt={reward.name}
            className={`w-24 h-24 object-cover rounded-2xl ${isLocked || isClaimed ? 'grayscale' : ''}`}
          />
          {isLocked && (
            <div className="absolute inset-0 bg-black/40 rounded-2xl flex items-center justify-center">
              <Lock className="w-8 h-8 text-white" />
            </div>
          )}
          {isClaimed && (
            <div className="absolute inset-0 bg-green-500/40 rounded-2xl flex items-center justify-center">
              <Check className="w-8 h-8 text-white" strokeWidth={3} />
            </div>
          )}
        </div>

        <div className="flex-1 min-w-0">
          <h3 className="font-bold text-gray-900 mb-1 truncate">{reward.name}</h3>
          <p className="text-sm text-gray-600 mb-3 line-clamp-2">{reward.description}</p>

          <div className="flex items-center justify-between gap-2">
            <div className="flex items-center gap-2">
              <Sparkles className="w-4 h-4 text-[#4C7C32]" />
              <span className="font-bold text-[#4C7C32]">{reward.cost}</span>
              <span className="text-xs text-gray-500">pts</span>
            </div>

            {isClaimed ? (
              <div className="px-4 py-2 bg-green-100 text-green-700 text-sm font-semibold rounded-xl">
                Réclamé
              </div>
            ) : isLocked ? (
              <div className="px-4 py-2 bg-gray-100 text-gray-600 text-sm font-semibold rounded-xl flex items-center gap-2">
                <Lock className="w-4 h-4" />
                Niv. {reward.requiredLevel}
              </div>
            ) : canAfford ? (
              <motion.button
                onClick={onClaim}
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                className="px-4 py-2 bg-gradient-to-r from-[#4C7C32] to-[#3a5f27] text-white text-sm font-semibold rounded-xl shadow-md"
              >
                Réclamer
              </motion.button>
            ) : (
              <div className="px-4 py-2 bg-gray-100 text-gray-500 text-sm font-semibold rounded-xl">
                Insuffisant
              </div>
            )}
          </div>

          {isLocked && reward.requiredLevel && (
            <div className="mt-2 text-xs text-gray-500">
              Débloqué au niveau {reward.requiredLevel}
            </div>
          )}
        </div>
      </div>
    </motion.div>
  );
}
