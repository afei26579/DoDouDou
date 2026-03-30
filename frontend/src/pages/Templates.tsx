import BottomNav from '../components/BottomNav';

export default function Templates() {
  return (
    <div className="min-h-screen bg-gray-50 pb-20">
      <div className="bg-white px-4 py-6 border-b">
        <h1 className="text-xl font-medium text-gray-900">模板库</h1>
      </div>

      <div className="px-4 py-4">
        <p className="text-gray-500 text-center py-8">模板库功能开发中...</p>
      </div>

      <BottomNav />
    </div>
  );
}
