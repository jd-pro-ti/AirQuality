const AqiCard = ({ title, description, value, trend, icon, gradient = "from-blue-500 to-cyan-500" }) => {
  return (
    <div className="group relative">
      <div className="absolute -inset-0.5 bg-gradient-to-r from-blue-600 to-cyan-600 rounded-2xl blur opacity-30 group-hover:opacity-100 transition duration-1000 group-hover:duration-200 animate-tilt"></div>
      <div className="relative bg-white dark:bg-gray-800 rounded-xl p-6 shadow-xl border border-gray-200 dark:border-gray-700 hover:shadow-2xl transition-all duration-500 group-hover:scale-105">
        <div className="flex items-start justify-between mb-4">
          <div className={`text-3xl p-3 rounded-xl bg-gradient-to-r ${gradient} text-white shadow-lg`}>
            {icon}
          </div>
          <div className="text-right">
            <div className="text-2xl font-bold bg-gradient-to-r from-blue-600 to-cyan-600 bg-clip-text text-transparent">
              {value}
            </div>
            <div className="text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wide mt-1">
              Precisión
            </div>
          </div>
        </div>
        
        <h3 className="text-xl font-bold text-gray-900 dark:text-white mb-3 group-hover:text-blue-600 dark:group-hover:text-blue-400 transition-colors">
          {title}
        </h3>
        
        <p className="text-gray-600 dark:text-gray-300 leading-relaxed">
          {description}
        </p>
        
        <div className="mt-4 pt-4 border-t border-gray-200 dark:border-gray-700">
          <div className="flex items-center text-sm text-gray-500 dark:text-gray-400">
            <div className="w-2 h-2 bg-green-500 rounded-full mr-2 animate-pulse"></div>
            Sistema activo y monitorizando
          </div>
        </div>
      </div>
    </div>
  );
};

export default AqiCard;