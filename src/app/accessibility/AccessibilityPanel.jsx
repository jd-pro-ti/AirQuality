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
      {/* Botón flotante minimalista */}
      <button
        onClick={() => setIsOpen(true)}
        className="fixed bottom-8 right-8 z-50 w-12 h-12 bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 text-gray-600 dark:text-gray-300 rounded-full shadow-lg hover:shadow-xl flex items-center justify-center transition-all duration-300 hover:scale-110 cursor-pointer group"
        aria-label="Panel de accesibilidad"
      >
        <svg className="w-5 h-5 group-hover:rotate-90 transition-transform duration-300" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6V4m0 2a2 2 0 100 4m0-4a2 2 0 110 4m-6 8a2 2 0 100-4m0 4a2 2 0 100 4m0-4v2m0-6V4m6 6v10m6-2a2 2 0 100-4m0 4a2 2 0 100 4m0-4v2m0-6V4" />
        </svg>
      </button>

      {/* Panel modal profesional */}
      {isOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
          {/* Backdrop sutil */}
          <div 
            className="absolute inset-0 bg-black/40 backdrop-blur-sm transition-opacity duration-300"
            onClick={() => setIsOpen(false)}
          />
          
          {/* Panel principal */}
          <div className="relative bg-white dark:bg-gray-900 rounded-2xl shadow-2xl border border-gray-200 dark:border-gray-700 w-full max-w-md transform transition-all duration-300 scale-95 hover:scale-100">
            
            {/* Header elegante */}
            <div className="px-6 py-5 border-b border-gray-200 dark:border-gray-700">
              <div className="flex items-center justify-between">
                <div className="flex items-center space-x-3">
                  <div className="w-10 h-10 bg-blue-50 dark:bg-blue-900/30 rounded-lg flex items-center justify-center">
                    <svg className="w-5 h-5 text-blue-600 dark:text-blue-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6V4m0 2a2 2 0 100 4m0-4a2 2 0 110 4m-6 8a2 2 0 100-4m0 4a2 2 0 100 4m0-4v2m0-6V4m6 6v10m6-2a2 2 0 100-4m0 4a2 2 0 100 4m0-4v2m0-6V4" />
                    </svg>
                  </div>
                  <div>
                    <h2 className="text-lg font-semibold text-gray-900 dark:text-white">Accesibilidad</h2>
                    <p className="text-sm text-gray-500 dark:text-gray-400">Personaliza tu experiencia</p>
                  </div>
                </div>
                <button
                  onClick={() => setIsOpen(false)}
                  className="w-8 h-8 hover:bg-gray-100 dark:hover:bg-gray-800 rounded-lg flex items-center justify-center transition-colors duration-200 cursor-pointer"
                  aria-label="Cerrar panel"
                >
                  <svg className="w-4 h-4 text-gray-500 dark:text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                  </svg>
                </button>
              </div>
            </div>

            {/* Contenido del panel */}
            <div className="p-6 space-y-6 max-h-96 overflow-y-auto">
              
              {/* Lectura de página */}
              <div>
                <div className="flex items-center justify-between mb-3">
                  <h3 className="text-base font-semibold text-gray-900 dark:text-white">Lectura de Página</h3>
                  <span className="text-xs bg-green-100 dark:bg-green-900/30 text-green-700 dark:text-green-400 px-2 py-1 rounded-full">
                    Nueva
                  </span>
                </div>
                <button
                  onClick={readPageContent}
                  className={`w-full px-4 py-3 rounded-lg font-medium transition-all duration-300 cursor-pointer border ${
                    isReading
                      ? 'bg-red-50 dark:bg-red-900/20 border-red-200 dark:border-red-800 text-red-700 dark:text-red-400 hover:bg-red-100 dark:hover:bg-red-900/30'
                      : 'bg-blue-50 dark:bg-blue-900/20 border-blue-200 dark:border-blue-800 text-blue-700 dark:text-blue-400 hover:bg-blue-100 dark:hover:bg-blue-900/30'
                  }`}
                >
                  <div className="flex items-center justify-center gap-2">
                    {isReading ? (
                      <>
                        <div className="w-2 h-2 bg-red-500 rounded-full animate-pulse"></div>
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
              <div>
                <h3 className="text-base font-semibold text-gray-900 dark:text-white mb-3">Tema de Color</h3>
                <button
                  onClick={toggleTheme}
                  className="w-full px-4 py-3 bg-gray-50 dark:bg-gray-800 hover:bg-gray-100 dark:hover:bg-gray-700 border border-gray-200 dark:border-gray-600 rounded-lg transition-all duration-300 cursor-pointer"
                >
                  <div className="flex items-center justify-between">
                    <span className="text-gray-700 dark:text-gray-300 font-medium">
                      {isDark ? '🌞 Cambiar a Modo Claro' : '🌙 Cambiar a Modo Oscuro'}
                    </span>
                    <div className={`w-12 h-6 rounded-full transition-colors duration-300 ${
                      isDark ? 'bg-blue-600' : 'bg-gray-300'
                    }`}>
                      <div className={`w-4 h-4 bg-white rounded-full transition-transform duration-300 transform ${
                        isDark ? 'translate-x-7' : 'translate-x-1'
                      } mt-1 shadow-sm`} />
                    </div>
                  </div>
                </button>
              </div>

              {/* Tamaño de texto */}
              <div>
                <h3 className="text-base font-semibold text-gray-900 dark:text-white mb-3">Tamaño de Texto</h3>
                <div className="grid grid-cols-4 gap-2">
                  {[
                    { size: 80, label: 'Pequeño' },
                    { size: 100, label: 'Normal' },
                    { size: 120, label: 'Grande' },
                    { size: 140, label: 'XL' }
                  ].map((item) => (
                    <button
                      key={item.size}
                      onClick={() => updateFontSize(item.size)}
                      className={`flex flex-col items-center justify-center p-3 rounded-lg border transition-all duration-300 cursor-pointer ${
                        fontSize === item.size 
                          ? 'bg-blue-50 dark:bg-blue-900/20 border-blue-200 dark:border-blue-800 text-blue-700 dark:text-blue-400' 
                          : 'bg-gray-50 dark:bg-gray-800 border-gray-200 dark:border-gray-600 text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700'
                      }`}
                    >
                      <span className="text-sm font-semibold">{item.size}%</span>
                      <span className="text-xs mt-1 text-gray-500 dark:text-gray-400">{item.label}</span>
                    </button>
                  ))}
                </div>
              </div>

              {/* Contraste */}
              <div>
                <h3 className="text-base font-semibold text-gray-900 dark:text-white mb-3">Contraste</h3>
                <button
                  onClick={toggleHighContrast}
                  className={`w-full px-4 py-3 rounded-lg border transition-all duration-300 cursor-pointer font-medium ${
                    highContrast
                      ? 'bg-amber-50 dark:bg-amber-900/20 border-amber-200 dark:border-amber-800 text-amber-700 dark:text-amber-400'
                      : 'bg-gray-50 dark:bg-gray-800 border-gray-200 dark:border-gray-600 text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700'
                  }`}
                >
                  <div className="flex items-center justify-between">
                    <span>🎨 {highContrast ? 'Contraste Alto Activado' : 'Activar Contraste Alto'}</span>
                    <div className={`w-6 h-6 rounded-full border-2 transition-colors duration-300 ${
                      highContrast 
                        ? 'bg-amber-500 border-amber-500' 
                        : 'bg-transparent border-gray-400 dark:border-gray-500'
                    }`} />
                  </div>
                </button>
              </div>

              {/* Reset */}
              <div className="pt-4 border-t border-gray-200 dark:border-gray-700">
                <button
                  onClick={resetAccessibility}
                  className="w-full px-4 py-3 bg-gray-50 dark:bg-gray-800 hover:bg-gray-100 dark:hover:bg-gray-700 border border-gray-200 dark:border-gray-600 rounded-lg text-gray-700 dark:text-gray-300 font-medium transition-all duration-300 cursor-pointer"
                >
                  <div className="flex items-center justify-center gap-2">
                    <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" />
                    </svg>
                    Restablecer Configuración
                  </div>
                </button>
              </div>
            </div>

            {/* Footer sutil */}
            <div className="px-6 py-4 bg-gray-50 dark:bg-gray-800/50 border-t border-gray-200 dark:border-gray-700 rounded-b-2xl">
              <p className="text-xs text-gray-500 dark:text-gray-400 text-center">
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