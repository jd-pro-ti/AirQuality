import React from 'react';
import Link from 'next/link';
const Footer = () => {
  return (
    <footer className="bg-gray-50 dark:bg-gray-800 border-t border-gray-200 dark:border-gray-700 transition-colors duration-300">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
          {/* Company Info */}
          <div className="col-span-1 md:col-span-2">
            <div className="flex items-center space-x-2 mb-3">
              <div className="w-6 h-6 bg-blue-500 rounded-full flex items-center justify-center">
                <span className="text-white font-bold text-xs">AQ</span>
              </div>
              <span className="text-lg font-bold text-gray-900 dark:text-white">
                Air Quality
              </span>
            </div>
            <p className="text-gray-600 dark:text-gray-400 mb-3 max-w-md text-sm">
              Sistema de monitoreo y predicción de la calidad del aire. 
              Proporcionamos datos precisos y recomendaciones para mejorar 
              la salud ambiental.
            </p>
          </div>

          {/* Quick Links */}
          <div>
            <h3 className="text-sm font-semibold text-gray-900 dark:text-white uppercase tracking-wider mb-3">
              Enlaces Rápidos
            </h3>
            <ul className="space-y-1">
              <li>
                <Link href="/predicciones" className="text-gray-600 dark:text-gray-400 hover:text-blue-600 dark:hover:text-blue-400 transition-colors text-sm">
                  Predicciones
                </Link>
              </li>
              <li>
                <Link href="/recomendaciones" className="text-gray-600 dark:text-gray-400 hover:text-blue-600 dark:hover:text-blue-400 transition-colors text-sm">
                  Recomendaciones
                </Link>
              </li>
              <li>
                <Link href="/mapa" className="text-gray-600 dark:text-gray-400 hover:text-blue-600 dark:hover:text-blue-400 transition-colors text-sm">
                  Mapa Interactivo
                </Link>
              </li>
              <li>
                <Link href="/capacitacion" className="text-gray-600 dark:text-gray-400 hover:text-blue-600 dark:hover:text-blue-400 transition-colors text-sm">
                  Capacitación
                </Link>
              </li>
            </ul>
          </div>

          {/* Contact Info */}
          <div>
            <h3 className="text-sm font-semibold text-gray-900 dark:text-white uppercase tracking-wider mb-3">
              Contacto
            </h3>
            <ul className="space-y-1 text-gray-600 dark:text-gray-400 text-sm">
              <li>airquality.com</li>
              <li>4471052548</li>
              <li>Maravatio Michoacan</li>
            </ul>
          </div>
        </div>

        <div className="mt-6 pt-6 border-t border-gray-200 dark:border-gray-700">
          <p className="text-center text-gray-500 dark:text-gray-400 text-sm">
            © {new Date().getFullYear()} Air Quality. Todos los derechos reservados.
          </p>
        </div>
      </div>
    </footer>
  );
};

export default Footer;