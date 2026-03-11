import { AnimatePresence, motion } from 'framer-motion';
import { AppProvider, useApp } from './context/AppContext';
import { FloatingBottomNav } from './components/FloatingBottomNav';
import { Dashboard } from './components/Dashboard';
import { ScanPage } from './components/ScanPage';
import { StorePage } from './components/StorePage';
import { ProfilePage } from './components/ProfilePage';

function AppContent() {
  const { currentPage } = useApp();

  const pageVariants = {
    initial: { opacity: 0, x: 20 },
    animate: { opacity: 1, x: 0 },
    exit: { opacity: 0, x: -20 },
  };

  return (
    /* 1. Ajout de overflow-x-hidden pour éviter le décalage horizontal pendant l'animation */
    <div className="min-h-screen bg-gradient-to-br from-gray-50 via-gray-100 to-gray-50 overflow-x-hidden relative">
      <AnimatePresence mode="wait">
        <motion.div
          key={currentPage}
          variants={pageVariants}
          initial="initial"
          animate="animate"
          exit="exit"
          transition={{ duration: 0.3 }}
          /* 2. AJUSTEMENTS CLÉS :
             - w-full : occupe toute la largeur
             - max-w-md : empêche d'être trop large sur tablette/PC (adapte à max-w-2xl si tu veux plus large)
             - mx-auto : centre le bloc horizontalement
             - px-4 : ajoute une marge de sécurité sur les côtés pour mobile
             - pb-32 : laisse de la place pour que le contenu ne passe pas SOUS la FloatingBottomNav
          */
          className="w-full max-w-md mx-auto px-4 pb-32"
        >
          {currentPage === 'dashboard' && <Dashboard />}
          {currentPage === 'scan' && <ScanPage />}
          {currentPage === 'store' && <StorePage />}
          {currentPage === 'profile' && <ProfilePage />}
        </motion.div>
      </AnimatePresence>

      {/* 3. Assure-toi que ce composant a un z-index élevé dans son propre code */}
      <FloatingBottomNav />
    </div>
  );
}

function App() {
  return (
    <AppProvider>
      <AppContent />
    </AppProvider>
  );
}

export default App;
