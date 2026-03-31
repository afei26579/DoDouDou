import { Search, Heart } from 'lucide-react';
import BottomNav from '../components/BottomNav';

export default function Community() {
  const templates = [
    { id: '1', name: '柴犬挂件', thumbnail: '🐶', likes: 234, difficulty: '简单' },
    { id: '2', name: '樱花杯垫', thumbnail: '🌸', likes: 189, difficulty: '中等' },
    { id: '3', name: '小恐龙', thumbnail: '🦖', likes: 156, difficulty: '简单' },
    { id: '4', name: '星空吊坠', thumbnail: '⭐', likes: 142, difficulty: '简单' },
    { id: '5', name: '彩虹', thumbnail: '🌈', likes: 128, difficulty: '中等' },
    { id: '6', name: '小熊', thumbnail: '🐻', likes: 115, difficulty: '简单' }
  ];

  return (
    <div className="min-h-screen bg-[#F5F5F7] pb-20">
      {/* Header */}
      <header className="bg-white border-b border-gray-100">
        <div className="max-w-screen-xl mx-auto px-4 h-14 flex items-center justify-between">
          <h1 className="text-base font-medium text-[#1C1C1E]">社区</h1>
          <button className="p-1.5 hover:bg-gray-50 rounded-lg transition-colors">
            <Search className="w-5 h-5 text-gray-600" strokeWidth={1.5} />
          </button>
        </div>
      </header>

      <div className="max-w-screen-xl mx-auto px-4 py-6">
        {/* Tabs */}
        <div className="flex gap-4 mb-6 overflow-x-auto">
          <button className="px-4 py-2 bg-[#1C1C1E] text-white rounded-xl text-sm font-medium whitespace-nowrap">
            模板广场
          </button>
          <button className="px-4 py-2 bg-white text-gray-600 rounded-xl text-sm font-medium whitespace-nowrap hover:bg-gray-50 transition-colors">
            热门作品
          </button>
          <button className="px-4 py-2 bg-white text-gray-600 rounded-xl text-sm font-medium whitespace-nowrap hover:bg-gray-50 transition-colors">
            新手教程
          </button>
        </div>

        {/* Template Grid */}
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
          {templates.map((template) => (
            <div
              key={template.id}
              className="bg-white rounded-2xl overflow-hidden shadow-sm hover:shadow-md transition-all duration-300 cursor-pointer group"
            >
              {/* Thumbnail */}
              <div
                className="relative aspect-square"
                style={{
                  backgroundImage: `radial-gradient(circle, #E0E0E5 1px, transparent 1px)`,
                  backgroundSize: '12px 12px',
                  backgroundColor: '#FAFAFA'
                }}
              >
                <div className="absolute inset-0 flex items-center justify-center text-6xl group-hover:scale-110 transition-transform duration-300">
                  {template.thumbnail}
                </div>
                <div className="absolute top-2 right-2 bg-white/90 backdrop-blur-sm px-2 py-1 rounded-lg">
                  <span className="text-xs text-gray-600">{template.difficulty}</span>
                </div>
              </div>

              {/* Info */}
              <div className="p-3">
                <h3 className="text-sm font-medium text-[#1C1C1E] mb-2 truncate">
                  {template.name}
                </h3>
                <div className="flex items-center gap-1 text-gray-400">
                  <Heart className="w-3.5 h-3.5" />
                  <span className="text-xs">{template.likes}</span>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>

      <BottomNav />
    </div>
  );
}
