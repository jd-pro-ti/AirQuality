const Loader = () => {
  return (
    <div className="min-h-screen flex items-center justify-center bg-white dark:bg-gray-900">
      <div className="text-center">
        <div className="w-12 h-12 border-4 border-blue-600 border-t-transparent rounded-full animate-spin mx-auto mb-3"></div>
        <p className="text-gray-600 dark:text-gray-300 text-sm">Cargando datos de calidad del aire...</p>
      </div>
    </div>
  );
};

export default Loader;