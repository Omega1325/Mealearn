import { motion } from 'framer-motion';
import { Home, Scan, Gift, User } from 'lucide-react';
import { useApp } from '../context/AppContext';
import { Page } from '../types';

export function FloatingBottomNav() {
  const { currentPage, setCurrentPage } = useApp();

  const navItems: { page: Page; icon: typeof Home; label: string }[] = [
    { page: 'dashboard', icon: Home, label: 'Accueil' },
    { page: 'store', icon: Gift, label: 'Store' },
    { page: 'profile', icon: User, label: 'Profil' },
  ];

  return (
    <motion.nav
      initial={{ y: 100 }}
      animate={{ y: 0 }}
      className="fixed bottom-0 left-0 right-0 z-50 flex justify-center px-6 py-6"
    >
      <div className="bg-white/80 backdrop-blur-xl rounded-[32px] shadow-2xl border border-gray-200/50 px-6 py-4 flex items-center gap-3 w-full max-w-sm">
        {navItems.slice(0, 2).map((item) => (
          <NavButton
            key={item.page}
            page={item.page}
            icon={item.icon}
            label={item.label}
            isActive={currentPage === item.page}
            onClick={() => setCurrentPage(item.page)}
          />
        ))}

        <motion.button
          onClick={() => setCurrentPage('scan')}
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
          className="relative mx-2"
        >
          <div className="w-16 h-16 rounded-full bg-gradient-to-br from-[#4C7C32] to-[#3a5f27] shadow-xl flex items-center justify-center">
            <Scan className="w-7 h-7 text-white" strokeWidth={2.5} />
          </div>
          {currentPage === 'scan' && (
            <motion.div
              layoutId="active-indicator"
              className="absolute -bottom-1 left-1/2 -translate-x-1/2 w-2 h-2 rounded-full bg-[#4C7C32]"
            />
          )}
        </motion.button>

        {navItems.slice(2).map((item) => (
          <NavButton
            key={item.page}
            page={item.page}
            icon={item.icon}
            label={item.label}
            isActive={currentPage === item.page}
            onClick={() => setCurrentPage(item.page)}
          />
        ))}
      </div>
    </motion.nav>
  );
}

function NavButton({
  page,
  icon: Icon,
  label,
  isActive,
  onClick,
}: {
  page: Page;
  icon: typeof Home;
  label: string;
  isActive: boolean;
  onClick: () => void;
}) {
  return (
    <motion.button
      onClick={onClick}
      whileHover={{ scale: 1.1 }}
      whileTap={{ scale: 0.95 }}
      className="relative flex flex-col items-center gap-1 px-4 py-2"
    >
      <Icon
        className={`w-6 h-6 ${isActive ? 'text-[#4C7C32]' : 'text-gray-500'}`}
        strokeWidth={isActive ? 2.5 : 2}
      />
      <span
        className={`text-xs font-medium ${isActive ? 'text-[#4C7C32]' : 'text-gray-500'}`}
      >
        {label}
      </span>
      {isActive && (
        <motion.div
          layoutId="active-indicator"
          className="absolute -bottom-1 left-1/2 -translate-x-1/2 w-2 h-2 rounded-full bg-[#4C7C32]"
        />
      )}
    </motion.button>
  );
}
