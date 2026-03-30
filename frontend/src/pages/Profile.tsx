import { Link } from 'react-router-dom';
import { Heart, Settings, Crown, MessageCircle, Info } from 'lucide-react';
import BottomNav from '../components/BottomNav';

export default function Profile() {
  return (
    <div className="min-h-screen bg-gray-50 pb-20">
      {/* 用户信息 */}
      <div className="bg-white px-4 py-6">
        <div className="flex items-center gap-4">
          <div className="w-16 h-16 bg-gray-200 rounded-full flex items-center justify-center text-2xl">
            👤
          </div>
          <div className="flex-1">
            <h2 className="font-medium text-gray-900">用户昵称</h2>
            <div className="flex items-center gap-2 mt-1">
              <span className="text-sm text-gray-500">免费版</span>
              <span className="text-gray-300">|</span>
              <Link
                to="/membership"
                className="text-sm text-blue-500 hover:text-blue-600"
              >
                升级专业版 →
              </Link>
            </div>
          </div>
        </div>
      </div>

      {/* 菜单列表 */}
      <div className="mt-2 bg-white">
        <Link
          to="/favorites"
          className="flex items-center gap-3 px-4 py-4 hover:bg-gray-50 transition-colors border-b border-gray-100"
        >
          <Heart className="w-5 h-5 text-gray-600" />
          <span className="flex-1 text-gray-900">我的收藏</span>
        </Link>

        <Link
          to="/settings"
          className="flex items-center gap-3 px-4 py-4 hover:bg-gray-50 transition-colors border-b border-gray-100"
        >
          <Settings className="w-5 h-5 text-gray-600" />
          <span className="flex-1 text-gray-900">使用偏好</span>
        </Link>

        <Link
          to="/membership"
          className="flex items-center gap-3 px-4 py-4 hover:bg-gray-50 transition-colors"
        >
          <Crown className="w-5 h-5 text-gray-600" />
          <span className="flex-1 text-gray-900">会员中心</span>
        </Link>
      </div>

      <div className="mt-2 bg-white">
        <Link
          to="/feedback"
          className="flex items-center gap-3 px-4 py-4 hover:bg-gray-50 transition-colors border-b border-gray-100"
        >
          <MessageCircle className="w-5 h-5 text-gray-600" />
          <span className="flex-1 text-gray-900">帮助与反馈</span>
        </Link>

        <Link
          to="/about"
          className="flex items-center gap-3 px-4 py-4 hover:bg-gray-50 transition-colors"
        >
          <Info className="w-5 h-5 text-gray-600" />
          <span className="flex-1 text-gray-900">关于我们</span>
        </Link>
      </div>

      {/* 版本信息 */}
      <div className="px-4 py-6 text-center text-sm text-gray-400">
        当前版本 v1.0.0
      </div>

      <BottomNav />
    </div>
  );
}
