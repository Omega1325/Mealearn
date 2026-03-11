import { useState, useRef, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Camera, X, Sparkles } from 'lucide-react';
import { useApp } from '../context/AppContext';
import { ColorGroup } from '../types';

export function ScanPage() {
  const [isScanning, setIsScanning] = useState(false);
  const [showCamera, setShowCamera] = useState(false);
  const [scanProgress, setScanProgress] = useState(0);
  const [showResult, setShowResult] = useState(false);
  const [capturedImage, setCapturedImage] = useState<string | null>(null);
  const videoRef = useRef<HTMLVideoElement>(null);
  const streamRef = useRef<MediaStream | null>(null);
  const { addMeal, setCurrentPage } = useApp();

  const startCamera = async () => {
    try {
      const stream = await navigator.mediaDevices.getUserMedia({
        video: { facingMode: 'environment', width: { ideal: 1280 }, height: { ideal: 720 } },
      });
      if (videoRef.current) {
        videoRef.current.srcObject = stream;
        streamRef.current = stream;
      }
      setShowCamera(true);
    } catch (error) {
      console.error('Camera access denied', error);
      alert('Impossible d\'accéder à la caméra. Veuillez autoriser l\'accès.');
    }
  };

  const stopCamera = () => {
    if (streamRef.current) {
      streamRef.current.getTracks().forEach((track) => track.stop());
      streamRef.current = null;
    }
    setShowCamera(false);
    setIsScanning(false);
    setScanProgress(0);
  };

  const capturePhoto = () => {
    if (!videoRef.current) return;

    const canvas = document.createElement('canvas');
    canvas.width = videoRef.current.videoWidth;
    canvas.height = videoRef.current.videoHeight;
    const ctx = canvas.getContext('2d');
    if (ctx) {
      ctx.drawImage(videoRef.current, 0, 0);
      const imageData = canvas.toDataURL('image/jpeg');
      setCapturedImage(imageData);
    }

    setIsScanning(true);
    setScanProgress(0);

    const interval = setInterval(() => {
      setScanProgress((prev) => {
        if (prev >= 100) {
          clearInterval(interval);
          setTimeout(() => {
            stopCamera();
            setShowResult(true);
          }, 300);
          return 100;
        }
        return prev + 5;
      });
    }, 40);
  };

  const handleConfirmMeal = () => {
    const detectedColors: ColorGroup[] = ['red', 'orange', 'green', 'purple'];
    const points = detectedColors.length * 25;

    const newMeal = {
      id: Date.now().toString(),
      name: 'Poké Bowl',
      imageUrl: capturedImage || 'https://images.unsplash.com/photo-1546069901-d5bfd2cbfb1f?w=800&q=80',
      date: new Date(),
      colors: detectedColors,
      points,
    };

    addMeal(newMeal);
    setShowResult(false);
    setCapturedImage(null);
    setCurrentPage('dashboard');
  };

  useEffect(() => {
    return () => {
      if (streamRef.current) {
        streamRef.current.getTracks().forEach((track) => track.stop());
      }
    };
  }, []);

  return (
    <div className="min-h-screen pb-32 pt-8">
      <AnimatePresence mode="wait">
        {!showCamera && !showResult && (
          <motion.div
            key="start"
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.9 }}
            className="px-6 flex flex-col items-center justify-center min-h-[80vh]"
          >
            <motion.div
              animate={{
                scale: [1, 1.05, 1],
                rotate: [0, 5, -5, 0],
              }}
              transition={{
                duration: 3,
                repeat: Infinity,
                ease: 'easeInOut',
              }}
              className="w-32 h-32 mb-8 bg-gradient-to-br from-[#4C7C32] to-[#3a5f27] rounded-[32px] flex items-center justify-center shadow-2xl"
            >
              <Camera className="w-16 h-16 text-white" strokeWidth={2} />
            </motion.div>

            <h1 className="text-3xl font-bold text-gray-900 mb-4 text-center">
              Scanner un repas
            </h1>
            <p className="text-gray-600 text-center mb-8 max-w-sm">
              Prenez une photo de votre repas et découvrez sa diversité de couleurs
            </p>

            <motion.button
              onClick={startCamera}
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              className="px-8 py-4 bg-gradient-to-r from-[#4C7C32] to-[#3a5f27] text-white font-semibold rounded-[24px] shadow-xl flex items-center gap-3"
            >
              <Camera className="w-6 h-6" />
              Démarrer la caméra
            </motion.button>
          </motion.div>
        )}

        {showCamera && (
          <motion.div
            key="camera"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-black z-50"
          >
            <video
              ref={videoRef}
              autoPlay
              playsInline
              className="w-full h-full object-cover"
            />

            {isScanning && (
              <motion.div
                initial={{ top: '0%' }}
                animate={{ top: `${scanProgress}%` }}
                className="absolute left-0 right-0 h-1 bg-gradient-to-r from-[#4C7C32] to-[#f97316] shadow-lg"
                style={{ boxShadow: '0 0 20px rgba(76, 124, 50, 0.8)' }}
              />
            )}

            <div className="absolute top-8 left-6 right-6 flex items-center justify-between">
              <motion.button
                onClick={stopCamera}
                whileHover={{ scale: 1.1 }}
                whileTap={{ scale: 0.9 }}
                className="w-12 h-12 bg-black/50 backdrop-blur-lg rounded-full flex items-center justify-center"
              >
                <X className="w-6 h-6 text-white" />
              </motion.button>

              <div className="text-white text-lg font-semibold bg-black/50 backdrop-blur-lg px-6 py-3 rounded-full">
                {isScanning ? 'Analyse en cours...' : 'Cadrez votre repas'}
              </div>
            </div>

            {!isScanning && (
              <div className="absolute bottom-8 left-1/2 -translate-x-1/2">
                <motion.button
                  onClick={capturePhoto}
                  whileHover={{ scale: 1.1 }}
                  whileTap={{ scale: 0.9 }}
                  className="w-20 h-20 bg-white rounded-full shadow-2xl flex items-center justify-center"
                >
                  <div className="w-16 h-16 border-4 border-gray-300 rounded-full" />
                </motion.button>
              </div>
            )}

            {isScanning && (
              <div className="absolute bottom-8 left-1/2 -translate-x-1/2 text-white text-center">
                <motion.div
                  animate={{ rotate: 360 }}
                  transition={{ duration: 2, repeat: Infinity, ease: 'linear' }}
                  className="w-16 h-16 mx-auto mb-4"
                >
                  <Sparkles className="w-16 h-16" />
                </motion.div>
                <div className="text-2xl font-bold mb-2">{Math.round(scanProgress)}%</div>
                <div className="text-sm opacity-75">Analyse des couleurs...</div>
              </div>
            )}
          </motion.div>
        )}

        {showResult && (
          <ResultModal
            capturedImage={capturedImage}
            onConfirm={handleConfirmMeal}
            onRetake={() => {
              setShowResult(false);
              setCapturedImage(null);
              startCamera();
            }}
          />
        )}
      </AnimatePresence>
    </div>
  );
}

function ResultModal({
  capturedImage,
  onConfirm,
  onRetake,
}: {
  capturedImage: string | null;
  onConfirm: () => void;
  onRetake: () => void;
}) {
  const detectedColors: ColorGroup[] = ['red', 'orange', 'green', 'purple'];
  const points = detectedColors.length * 25;

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      className="fixed inset-0 bg-black/80 backdrop-blur-sm z-50 flex items-center justify-center p-6"
    >
      <motion.div
        initial={{ scale: 0.8, y: 50 }}
        animate={{ scale: 1, y: 0 }}
        className="bg-white rounded-[32px] p-8 max-w-lg w-full shadow-2xl"
      >
        <motion.div
          initial={{ scale: 0 }}
          animate={{ scale: 1 }}
          transition={{ delay: 0.2, type: 'spring' }}
          className="text-center mb-6"
        >
          <div className="text-6xl mb-4">🎉</div>
          <h2 className="text-3xl font-bold text-gray-900 mb-2">Poké Bowl détecté!</h2>
          <p className="text-gray-600">Analyse de la diversité terminée</p>
        </motion.div>

        {capturedImage && (
          <img
            src={capturedImage}
            alt="Repas scanné"
            className="w-full h-48 object-cover rounded-3xl mb-6"
          />
        )}

        <div className="bg-gradient-to-br from-gray-50 to-white rounded-3xl p-6 mb-6">
          <div className="text-center mb-4">
            <div className="text-5xl font-bold text-[#4C7C32] mb-2">+{points}</div>
            <div className="text-gray-600 font-medium">points gagnés</div>
          </div>

          <div className="flex justify-center gap-3 mb-4">
            {detectedColors.map((color, index) => (
              <motion.div
                key={color}
                initial={{ scale: 0, rotate: -180 }}
                animate={{ scale: 1, rotate: 0 }}
                transition={{ delay: 0.3 + index * 0.1, type: 'spring' }}
                className={`w-10 h-10 rounded-full ${getColorClass(color)} shadow-lg`}
              />
            ))}
          </div>

          <div className="text-center text-sm text-gray-600">
            {detectedColors.length} groupe{detectedColors.length > 1 ? 's' : ''} de couleurs détecté{detectedColors.length > 1 ? 's' : ''}
          </div>
        </div>

        <div className="flex gap-3">
          <motion.button
            onClick={onRetake}
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
            className="flex-1 py-4 bg-gray-100 text-gray-900 font-semibold rounded-2xl"
          >
            Reprendre
          </motion.button>
          <motion.button
            onClick={onConfirm}
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
            className="flex-1 py-4 bg-gradient-to-r from-[#4C7C32] to-[#3a5f27] text-white font-semibold rounded-2xl shadow-lg"
          >
            Confirmer
          </motion.button>
        </div>
      </motion.div>
    </motion.div>
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
