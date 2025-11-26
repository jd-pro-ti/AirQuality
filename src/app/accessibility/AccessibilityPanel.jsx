'use client';
import { useState } from 'react';
import { useTheme } from '@/context/ThemeContext';
import { useAccessibility } from './useAccessibility';

const AccessibilityPanel = () => {
  const [isOpen, setIsOpen] = useState(false);
  const { isDark, toggleTheme } = useTheme();

  const {
    fontSize,
    highContrast,
    isReading,
    updateFontSize,
    toggleHighContrast,
    readPageContent,
    resetAccessibility
  } = useAccessibility();

  return (
    <>
      {/* Botón flotante mejorado */}
      <button
        onClick={() => setIsOpen(true)}
        className="fixed bottom-6 right-6 z-50 w-14 h-14 bg-gradient-to-r from-blue-600 to-cyan-600 hover:from-blue-700 hover:to-cyan-700 text-white rounded-2xl shadow-2xl flex items-center justify-center transition-all duration-500 hover:scale-110 hover:rotate-12 group cursor-pointer"
        aria-label="Panel de accesibilidad"
      >
        <div className="relative">
          <svg className="w-7 h-7 transform group-hover:scale-110 transition-transform" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6V4m0 2a2 2 0 100 4m0-4a2 2 0 110 4m-6 8a2 2 0 100-4m0 4a2 2 0 100 4m0-4v2m0-6V4m6 6v10m6-2a2 2 0 100-4m0 4a2 2 0 100 4m0-4v2m0-6V4" />
          </svg>
          <div className="absolute -top-1 -right-1 w-3 h-3 bg-green-400 rounded-full animate-pulse"></div>
        </div>
      </button>

      {/* Panel mejorado */}
      {isOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
          {/* Backdrop con blur */}
          <div 
            className="absolute inset-0 bg-black/60 backdrop-blur-sm transition-opacity duration-500"
            onClick={() => setIsOpen(false)}
          />
          
          {/* Panel principal */}
          <div className="relative bg-white/95 dark:bg-gray-900/95 backdrop-blur-xl rounded-3xl shadow-2xl border border-white/20 dark:border-gray-700/50 w-full max-w-md transform transition-all duration-500 scale-95 hover:scale-100">
            
            {/* Header con gradiente */}
            <div className="bg-gradient-to-r from-blue-600 to-cyan-600 rounded-t-3xl p-6 text-white">
              <div className="flex items-center justify-between">
                <div className="flex items-center space-x-3">
                  <div className="w-10 h-10 bg-white/20 rounded-xl flex items-center justify-center backdrop-blur-sm">
                    <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6V4m0 2a2 2 0 100 4m0-4a2 2 0 110 4m-6 8a2 2 0 100-4m0 4a2 2 0 100 4m0-4v2m0-6V4m6 6v10m6-2a2 2 0 100-4m0 4a2 2 0 100 4m0-4v2m0-6V4" />
                    </svg>
                  </div>
                  <div>
                    <h2 className="text-xl font-bold">Accesibilidad</h2>
                    <p className="text-blue-100 text-sm opacity-90">Personaliza tu experiencia</p>
                  </div>
                </div>
                <button
                  onClick={() => setIsOpen(false)}
                  className="w-8 h-8 bg-white/20 hover:bg-white/30 rounded-lg flex items-center justify-center transition-all duration-300 hover:scale-110 cursor-pointer backdrop-blur-sm"
                  aria-label="Cerrar panel"
                >
                  <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                  </svg>
                </button>
              </div>
            </div>

            {/* Contenido del panel */}
            <div className="p-6 space-y-6 max-h-96 overflow-y-auto">
              
              {/* Lectura de página */}
              <div className="group">
                <div className="flex items-center justify-between mb-3">
                  <h3 className="text-lg font-semibold text-gray-900 dark:text-white flex items-center gap-2">
                    <span className="w-2 h-2 bg-green-500 rounded-full animate-pulse"></span>
                    Lectura de Página
                  </h3>
                  <span className="text-xs bg-blue-100 dark:bg-blue-900 text-blue-700 dark:text-blue-300 px-2 py-1 rounded-full">
                    Nueva
                  </span>
                </div>
                <button
                  onClick={readPageContent}
                  className={`w-full px-4 py-4 rounded-xl font-semibold transition-all duration-500 cursor-pointer group-hover:shadow-lg ${
                    isReading
                      ? 'bg-gradient-to-r from-red-500 to-pink-600 hover:from-red-600 hover:to-pink-700 text-white shadow-lg animate-pulse'
                      : 'bg-gradient-to-r from-green-500 to-emerald-600 hover:from-green-600 hover:to-emerald-700 text-white'
                  }`}
                >
                  <div className="flex items-center justify-center gap-2">
                    {isReading ? (
                      <>
                        <div className="w-2 h-2 bg-white rounded-full animate-ping"></div>
                        🛑 Detener Lectura
                      </>
                    ) : (
                      <>
                        📖 Leer Página Completa
                      </>
                    )}
                  </div>
                </button>
              </div>

              {/* Tema de color */}
              <div className="group">
                <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-3 flex items-center gap-2">
                  <span className="w-2 h-2 bg-purple-500 rounded-full"></span>
                  Tema de Color
                </h3>
                <button
                  onClick={toggleTheme}
                  className="w-full px-4 py-4 bg-gradient-to-r from-purple-500 to-indigo-600 hover:from-purple-600 hover:to-indigo-700 text-white rounded-xl font-semibold transition-all duration-500 cursor-pointer group-hover:shadow-lg"
                >
                  <div className="flex items-center justify-between">
                    <span>{isDark ? '🌞 Cambiar a Modo Claro' : '🌙 Cambiar a Modo Oscuro'}</span>
                    <div className={`w-14 h-7 bg-white/30 rounded-full p-1 transition-all duration-500 ${isDark ? 'bg-white/40' : ''}`}>
                      <div className={`w-5 h-5 bg-white rounded-full transition-transform duration-500 transform ${isDark ? 'translate-x-7' : 'translate-x-0'} shadow-lg`} />
                    </div>
                  </div>
                </button>
              </div>

              {/* Tamaño de texto */}
              <div className="group">
                <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-3 flex items-center gap-2">
                  <span className="w-2 h-2 bg-blue-500 rounded-full"></span>
                  Tamaño de Texto
                </h3>
                <div className="grid grid-cols-4 gap-3">
                  {[
                    { size: 80, label: 'Pequeño', color: 'from-gray-500 to-gray-600' },
                    { size: 100, label: 'Normal', color: 'from-blue-500 to-cyan-500' },
                    { size: 120, label: 'Grande', color: 'from-purple-500 to-pink-500' },
                    { size: 140, label: 'XL', color: 'from-orange-500 to-red-500' }
                  ].map((item) => (
                    <button
                      key={item.size}
                      onClick={() => updateFontSize(item.size)}
                      className={`flex flex-col items-center justify-center p-3 rounded-xl font-semibold text-white transition-all duration-300 cursor-pointer group-hover:shadow-lg ${
                        fontSize === item.size 
                          ? `bg-gradient-to-r ${item.color} shadow-lg scale-105` 
                          : 'bg-gray-300 dark:bg-gray-700 hover:bg-gray-400 dark:hover:bg-gray-600 text-gray-700 dark:text-gray-300'
                      }`}
                    >
                      <span className="text-lg font-bold">{item.size}%</span>
                      <span className="text-xs mt-1 opacity-90">{item.label}</span>
                    </button>
                  ))}
                </div>
              </div>

              {/* Contraste */}
              <div className="group">
                <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-3 flex items-center gap-2">
                  <span className="w-2 h-2 bg-yellow-500 rounded-full"></span>
                  Contraste
                </h3>
                <button
                  onClick={toggleHighContrast}
                  className={`w-full px-4 py-4 rounded-xl font-semibold transition-all duration-500 cursor-pointer group-hover:shadow-lg ${
                    highContrast
                      ? 'bg-gradient-to-r from-yellow-400 to-amber-500 text-gray-900 shadow-lg'
                      : 'bg-gradient-to-r from-yellow-500 to-amber-600 hover:from-yellow-600 hover:to-amber-700 text-gray-900'
                  }`}
                >
                  <div className="flex items-center justify-between">
                    <span>🎨 {highContrast ? 'Contraste Alto Activado' : 'Activar Contraste Alto'}</span>
                    <div className={`w-6 h-6 rounded-full border-2 ${highContrast ? 'bg-gray-900 border-gray-900' : 'bg-transparent border-gray-900'}`} />
                  </div>
                </button>
              </div>

              {/* Reset */}
              <div className="group pt-4 border-t border-gray-200 dark:border-gray-700">
                <button
                  onClick={resetAccessibility}
                  className="w-full px-4 py-4 bg-gradient-to-r from-gray-500 to-gray-700 hover:from-gray-600 hover:to-gray-800 text-white rounded-xl font-bold transition-all duration-500 cursor-pointer group-hover:shadow-lg transform hover:scale-105"
                >
                  <div className="flex items-center justify-center gap-2">
                    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" />
                    </svg>
                    Restablecer Configuración
                  </div>
                </button>
                <p className="text-xs text-gray-500 dark:text-gray-400 text-center mt-2">
                  Volverá a la configuración predeterminada
                </p>
              </div>
            </div>

            {/* Footer del panel */}
            <div className="px-6 py-4 bg-gray-50 dark:bg-gray-800/50 rounded-b-3xl border-t border-gray-200 dark:border-gray-700">
              <p className="text-xs text-gray-600 dark:text-gray-400 text-center">
                Configuraciones guardadas automáticamente
              </p>
            </div>
          </div>
        </div>
      )}
    </>
  );
};

export default AccessibilityPanel;