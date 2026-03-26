import { Link } from 'react-router-dom';

export default function Home() {
  return (
    <div className="min-h-screen bg-gray-50 flex flex-col items-center justify-center p-4">
      <div className="max-w-4xl w-full">
        <h1 className="text-4xl md:text-6xl font-bold text-center mb-4 text-gray-900">
          拼豆豆助手
        </h1>
        <p className="text-xl text-center text-gray-600 mb-12">
          从灵感到成品的创作伙伴
        </p>

        <div className="grid md:grid-cols-2 gap-6 mb-8">
          <Link
            to="/convert"
            className="bg-white p-8 rounded-lg shadow-md hover:shadow-lg transition-shadow"
          >
            <div className="text-4xl mb-4">📷</div>
            <h2 className="text-2xl font-semibold mb-2">导入图片</h2>
            <p className="text-gray-600">
              上传你喜欢的图片，自动生成适合拼豆的方案
            </p>
          </Link>

          <Link
            to="/templates"
            className="bg-white p-8 rounded-lg shadow-md hover:shadow-lg transition-shadow"
          >
            <div className="text-4xl mb-4">📋</div>
            <h2 className="text-2xl font-semibold mb-2">从模板开始</h2>
            <p className="text-gray-600">
              选择精选模板，快速开始你的第一件作品
            </p>
          </Link>
        </div>

        <div className="bg-white p-6 rounded-lg shadow-md">
          <h3 className="text-lg font-semibold mb-4">今日推荐</h3>
          <div className="grid grid-cols-3 gap-4">
            {[1, 2, 3].map((i) => (
              <div key={i} className="aspect-square bg-gray-200 rounded-lg"></div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
