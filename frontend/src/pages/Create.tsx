import { useSearchParams, useNavigate } from 'react-router-dom';
import { ArrowLeft } from 'lucide-react';
import BottomNav from '../components/BottomNav';

export default function Create() {
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();
  const mode = searchParams.get('mode');

  return (
    <div className="min-h-screen bg-[#F5F5F7] pb-20">
      {/* Header */}
      <header className="bg-white border-b border-gray-100">
        <div className="max-w-screen-xl mx-auto px-4 h-14 flex items-center justify-between">
          <button
            onClick={() => navigate(-1)}
            className="flex items-center gap-2 text-gray-600 hover:text-gray-900 transition-colors"
          >
            <ArrowLeft className="w-5 h-5" />
            <span className="text-base">返回</span>
          </button>
          <h1 className="text-base font-medium text-[#1C1C1E]">创作</h1>
          <div className="w-16"></div>
        </div>
      </header>

      <div className="max-w-screen-xl mx-auto px-4 py-8">
        <div className="bg-white rounded-3xl p-8 shadow-sm text-center">
          <div className="text-6xl mb-4">
            {mode === 'camera' && '📷'}
            {mode === 'gallery' && '🖼️'}
            {mode === 'upload' && '📤'}
            {!mode && '🎨'}
          </div>
          <h2 className="text-xl font-semibold text-[#1C1C1E] mb-2">
            {mode === 'camera' && '拍照转图纸'}
            {mode === 'gallery' && '从相册选择'}
            {mode === 'upload' && '上传图纸'}
            {!mode && '开始创作'}
          </h2>
          <p className="text-gray-400 mb-6">
            此功能正在开发中...
          </p>
          <button
            onClick={() => navigate('/')}
            className="px-6 py-3 bg-[#1C1C1E] text-white rounded-xl hover:bg-gray-800 transition-colors"
          >
            返回首页
          </button>
        </div>
      </div>

      <BottomNav />
    </div>
  );
}
