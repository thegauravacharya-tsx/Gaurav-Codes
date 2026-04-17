export default function VideoLoading() {
  return (
    <div className="max-w-[1200px] mx-auto space-y-8 animate-pulse">
      <div className="h-10 w-32 bg-blue-500/10 rounded-full mb-4"></div>
      <div className="h-16 w-3/4 bg-gray-800 rounded-lg"></div>
      <div className="w-full aspect-video bg-gray-900 border border-gray-800 rounded-xl"></div>
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        <div className="lg:col-span-2 space-y-4">
          <div className="h-40 bg-gray-800 rounded-lg w-full"></div>
        </div>
        <div className="lg:col-span-1 h-64 bg-gray-900 rounded-lg"></div>
      </div>
    </div>
  );
}