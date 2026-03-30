import { Link, useLocation } from 'react-router-dom';

interface TabItem {
  path: string;
  label: string;
  icon: string;
}

const tabs: TabItem[] = [
  { path: '/', label: '首页', icon: '🏠' },
  { path: '/templates', label: '模板库', icon: '📋' },
  { path: '/works', label: '我的作品', icon: '🎨' },
  { path: '/profile', label: '我的', icon: '👤' },
];

export default function BottomNav() {
  const location = useLocation();

  return (
    <nav className="fixed bottom-0 left-0 right-0 bg-white border-t border-gray-200 safe-area-bottom">
      <div className="flex justify-around items-center h-16 max-w-screen-xl mx-auto">
        {tabs.map((tab) => {
          const isActive = location.pathname === tab.path;
          return (
            <Link
              key={tab.path}
              to={tab.path}
              className={`flex flex-col items-center justify-center flex-1 h-full transition-colors ${
                isActive
                  ? 'text-blue-600'
                  : 'text-gray-600 hover:text-gray-900'
              }`}
            >
              <span className="text-2xl mb-1">{tab.icon}</span>
              <span className="text-xs font-medium">{tab.label}</span>
            </Link>
          );
        })}
      </div>
    </nav>
  );
}
