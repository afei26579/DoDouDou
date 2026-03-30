import { Link } from 'react-router-dom';
import { Camera, FileText, ChevronRight } from 'lucide-react';
import BottomNav from '../components/BottomNav';

export default function Home() {
  // TODO: 从 API 获取未完成作品
  const hasUnfinishedWork = false;
  const unfinishedWork = {
    id: '1',
    name: '皮卡丘',
    thumbnail: '',
    status: '制作中',
    progress: 45
  };

  // TODO: 从 API 获取推荐模板
  const recommendedTemplates = [
    { id: '1', name: '模板 A', thumbnail: '', difficulty: '简单', time: '15分钟' },
    { id: '2', name: '模板 B', thumbnail: '', difficulty: '中等', time: '30分钟' },
    { id: '3', name: '模板 C', thumbnail: '', difficulty: '简单', time: '20分钟' }
  ];

  return (
    <div className="min-h-screen bg-gray-50 pb-20">
      {/* 顶部欢迎区 */}
      <div className="bg-white px-4 py-6">
        <h1 className="text-xl font-medium text-gray-900">
          今天也做一件喜欢的作品吧 ☀️
        </h1>
      </div>

      <div className="px-4 py-4 space-y-4">
        {/* 继续未完成作品卡片 */}
        {hasUnfinishedWork && (
          <div className="bg-white rounded-lg p-4 shadow-sm">
            <div className="text-sm text-gray-500 mb-3">继续未完成</div>
            <div className="flex items-center gap-3">
              <div className="w-16 h-16 bg-gray-200 rounded-lg flex-shrink-0">
                {unfinishedWork.thumbnail && (
                  <img
                    src={unfinishedWork.thumbnail}
                    alt={unfinishedWork.name}
                    className="w-full h-full object-cover rounded-lg"
                  />
                )}
              </div>
              <div className="flex-1 min-w-0">
                <h3 className="font-medium text-gray-900 truncate">
                  {unfinishedWork.name}
                </h3>
                <p className="text-sm text-gray-500">
                  {unfinishedWork.status} · 进度 {unfinishedWork.progress}%
                </p>
              </div>
              <Link
                to={`/works/${unfinishedWork.id}`}
                className="px-4 py-2 bg-blue-500 text-white text-sm rounded-lg hover:bg-blue-600 transition-colors flex-shrink-0"
              >
                继续制作
              </Link>
            </div>
          </div>
        )}

        {/* 新建作品入口 */}
        <div className="grid grid-cols-2 gap-3">
          {/* 导入图片 */}
          <Link
            to="/convert/upload"
            className="bg-white rounded-lg p-4 shadow-sm hover:shadow-md transition-shadow"
          >
            <div className="flex flex-col items-center text-center space-y-3">
              <div className="w-12 h-12 bg-blue-50 rounded-full flex items-center justify-center">
                <Camera className="w-6 h-6 text-blue-500" />
              </div>
              <div>
                <h3 className="font-medium text-gray-900 mb-1">导入图片</h3>
                <p className="text-xs text-gray-500">转拼豆图</p>
              </div>
              <button className="w-full py-2 bg-gray-50 text-sm text-gray-700 rounded-lg hover:bg-gray-100 transition-colors">
                导入图片
              </button>
            </div>
          </Link>

          {/* 从模板开始 */}
          <Link
            to="/templates"
            className="bg-white rounded-lg p-4 shadow-sm hover:shadow-md transition-shadow"
          >
            <div className="flex flex-col items-center text-center space-y-3">
              <div className="w-12 h-12 bg-green-50 rounded-full flex items-center justify-center">
                <FileText className="w-6 h-6 text-green-500" />
              </div>
              <div>
                <h3 className="font-medium text-gray-900 mb-1">从模板</h3>
                <p className="text-xs text-gray-500">开始</p>
              </div>
              <button className="w-full py-2 bg-gray-50 text-sm text-gray-700 rounded-lg hover:bg-gray-100 transition-colors">
                浏览模板
              </button>
            </div>
          </Link>
        </div>

        {/* 今日推荐 */}
        <div className="bg-white rounded-lg p-4 shadow-sm">
          <h2 className="font-medium text-gray-900 mb-3">今日推荐</h2>
          <div className="flex gap-3 overflow-x-auto pb-2 -mx-4 px-4">
            {recommendedTemplates.map((template) => (
              <Link
                key={template.id}
                to={`/templates/${template.id}`}
                className="flex-shrink-0 w-32"
              >
                <div className="aspect-square bg-gray-200 rounded-lg mb-2">
                  {template.thumbnail && (
                    <img
                      src={template.thumbnail}
                      alt={template.name}
                      className="w-full h-full object-cover rounded-lg"
                    />
                  )}
                </div>
                <h3 className="text-sm font-medium text-gray-900 truncate">
                  {template.name}
                </h3>
                <p className="text-xs text-gray-500">
                  {template.difficulty} · {template.time}
                </p>
              </Link>
            ))}
            <Link
              to="/templates"
              className="flex-shrink-0 w-32 aspect-square bg-gray-50 rounded-lg flex flex-col items-center justify-center text-gray-400 hover:bg-gray-100 transition-colors"
            >
              <ChevronRight className="w-6 h-6" />
              <span className="text-xs mt-1">查看更多</span>
            </Link>
          </div>
        </div>
      </div>

      {/* 底部导航 */}
      <BottomNav />
    </div>
  );
}
