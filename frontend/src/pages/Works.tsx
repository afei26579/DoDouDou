import BottomNav from '../components/BottomNav';

export default function Works() {
  return (
    <div className="min-h-screen bg-gray-50 pb-20">
      <div className="bg-white px-4 py-6 border-b">
        <h1 className="text-xl font-medium text-gray-900">我的作品</h1>
      </div>

      <div className="px-4 py-4">
        <div className="text-center py-16">
          <div className="text-6xl mb-4">📭</div>
          <p className="text-gray-500 mb-6">还没有作品呢</p>
          <button className="px-6 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600 transition-colors">
            开始第一个作品 →
          </button>
        </div>
      </div>

      <BottomNav />
    </div>
  );
}
