import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';

interface AnalysisLoadingStateProps {
  onComplete?: () => void;
}

const AnalysisLoadingState: React.FC<AnalysisLoadingStateProps> = ({ onComplete }) => {
  const [currentStep, setCurrentStep] = useState(0);
  
  const steps = [
    "Finalizing Interview Data...",
    "Evaluating Code Complexity...", 
    "Transcribing Audio Responses...",
    "Generating Integrity Audit...",
    "Assembling Final Report..."
  ];

  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentStep((prev) => {
        if (prev >= steps.length - 1) {
          clearInterval(interval);
          setTimeout(() => {
            onComplete?.();
          }, 1000);
          return prev;
        }
        return prev + 1;
      });
    }, 2000);

    return () => clearInterval(interval);
  }, [onComplete]);

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900 flex items-center justify-center p-4">
      <div className="max-w-md w-full">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="bg-slate-800/50 backdrop-blur-xl border border-slate-700 rounded-3xl p-8 shadow-2xl"
        >
          {/* Header */}
          <div className="text-center mb-8">
            <div className="w-16 h-16 bg-gradient-to-r from-blue-500 to-purple-600 rounded-full flex items-center justify-center mx-auto mb-4">
              <motion.div
                animate={{ rotate: 360 }}
                transition={{ duration: 2, repeat: Infinity, ease: "linear" }}
                className="w-8 h-8 border-2 border-white border-t-transparent rounded-full"
              />
            </div>
            <h2 className="text-2xl font-bold text-white mb-2">🦁 Master Lion Analysis</h2>
            <p className="text-slate-400 text-sm">Processing your interview performance</p>
          </div>

          {/* Progress Steps */}
          <div className="space-y-4">
            {steps.map((step, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: index * 0.1 }}
                className={`flex items-center space-x-3 p-3 rounded-xl transition-all ${
                  index <= currentStep 
                    ? 'bg-blue-500/20 border border-blue-500/50' 
                    : 'bg-slate-700/30 border border-slate-700/50'
                }`}
              >
                <div className={`w-6 h-6 rounded-full flex items-center justify-center text-sm font-medium ${
                  index < currentStep 
                    ? 'bg-green-500 text-white' 
                    : index === currentStep 
                    ? 'bg-blue-500 text-white' 
                    : 'bg-slate-600 text-slate-400'
                }`}>
                  {index < currentStep ? '✓' : index + 1}
                </div>
                <span className={`text-sm ${
                  index <= currentStep ? 'text-white' : 'text-slate-400'
                }`}>
                  {step}
                </span>
                {index === currentStep && (
                  <motion.div
                    initial={{ width: 0 }}
                    animate={{ width: '100%' }}
                    transition={{ duration: 1.8, ease: "easeInOut" }}
                    className="absolute left-0 bottom-0 h-0.5 bg-blue-500 rounded-full"
                  />
                )}
              </motion.div>
            ))}
          </div>

          {/* Current Status */}
          <div className="mt-6 text-center">
            <motion.p
              key={currentStep}
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              className="text-blue-400 text-sm font-medium"
            >
              {steps[currentStep]}
            </motion.p>
          </div>
        </motion.div>
      </div>
    </div>
  );
};

export default AnalysisLoadingState;
