import { Link, useNavigate } from 'react-router-dom';
import { Camera, Search, Bell, ChevronRight } from 'lucide-react';
import { useState } from 'react';
import BottomNav from '../components/BottomNav';
import ActionSheet from '../components/ActionSheet';
import DraftLibraryModal from '../components/DraftLibraryModal';
import TemplateModal from '../components/TemplateModal';

export default function Home() {
  const navigate = useNavigate();
  const [showActionSheet, setShowActionSheet] = useState(false);
  const [showDraftLibrary, setShowDraftLibrary] = useState(false);
  const [showTemplateModal, setShowTemplateModal] = useState(false);

  // TODO: 从 API 获取未完成作品
  const hasUnfinishedWork = true;
  const unfinishedWork = {
    id: '1',
    name: '超级马里奥蘑菇',
    thumbnail: '/placeholder-mushroom.png',
    progress: 65,
    estimatedTime: '15分钟'
  };

  // TODO: 从 API 获取图纸库
  const drafts = [
    { id: '1', name: '皮卡丘图纸', thumbnail: '⚡', size: { width: 29, height: 29 }, colors: 14, createdAt: '2天前' },
    { id: '2', name: '小猫咪', thumbnail: '🐱', size: { width: 15, height: 15 }, colors: 8, createdAt: '5天前' },
    { id: '3', name: '爱心', thumbnail: '❤️', size: { width: 29, height: 29 }, colors: 3, createdAt: '1周前' }
  ];

  // TODO: 从 API 获取精选模板
  const featuredTemplates = [
    { id: '1', name: '柴犬挂件', thumbnail: '🐶', tag: '15分钟搞定', difficulty: '简单' },
    { id: '2', name: '樱花杯垫', thumbnail: '🌸', tag: '送朋友的礼物', difficulty: '中等' },
    { id: '3', name: '小恐龙', thumbnail: '🦖', tag: '桌面小摆件', difficulty: '简单' },
    { id: '4', name: '星空吊坠', thumbnail: '⭐', tag: '适合新手', difficulty: '简单' },
    { id: '5', name: '彩虹', thumbnail: '🌈', tag: '色彩丰富', difficulty: '中等' },
    { id: '6', name: '小熊', thumbnail: '🐻', tag: '可爱治愈', difficulty: '简单' }
  ];

  // TODO: 从 API 获取灵感画廊
  const inspirationGallery = [
    { id: '1', name: '柴犬挂件', tag: '15分钟搞定', thumbnail: '/placeholder-dog.png' },
    { id: '2', name: '樱花杯垫', tag: '送朋友的礼物', thumbnail: '/placeholder-sakura.png' },
    { id: '3', name: '小恐龙摆件', tag: '桌面小摆件', thumbnail: '/placeholder-dino.png' },
    { id: '4', name: '星空吊坠', tag: '适合新手', thumbnail: '/placeholder-star.png' }
  ];

  const actionSheetOptions = [
    {
      icon: '📷',
      label: '拍照转图纸',
      sublabel: '调用相机拍照',
      onClick: () => navigate('/create?mode=camera')
    },
    {
      icon: '🖼️',
      label: '从相册选择',
      sublabel: '选择已有图片',
      onClick: () => navigate('/create?mode=gallery')
    },
    {
      icon: '📁',
      label: '我的图纸库',
      badge: drafts.length > 0 ? `${drafts.length}张` : undefined,
      sublabel: drafts.length === 0 ? '暂无图纸' : undefined,
      onClick: () => setShowDraftLibrary(true),
      disabled: drafts.length === 0
    },
    {
      icon: '🎨',
      label: '从模板开始',
      sublabel: '精选新手友好模板',
      onClick: () => setShowTemplateModal(true)
    }
  ];

  return (
    <div className="min-h-screen bg-[#F5F5F7] pb-20">
      {/* 极简导航栏 */}
      <header className="bg-white border-b border-gray-100">
        <div className="max-w-screen-xl mx-auto px-4 h-14 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <div className="w-6 h-6 bg-[#1C1C1E] rounded-md"></div>
            <span className="text-base font-medium text-[#1C1C1E] tracking-tight">拼豆豆助手</span>
          </div>
          <div className="flex items-center gap-4">
            <button className="p-1.5 hover:bg-gray-50 rounded-lg transition-colors">
              <Search className="w-5 h-5 text-gray-600" strokeWidth={1.5} />
            </button>
            <button className="p-1.5 hover:bg-gray-50 rounded-lg transition-colors relative">
              <Bell className="w-5 h-5 text-gray-600" strokeWidth={1.5} />
              <span className="absolute top-1 right-1 w-1.5 h-1.5 bg-red-500 rounded-full"></span>
            </button>
          </div>
        </div>
      </header>

      <div className="max-w-screen-xl mx-auto px-4 py-6 space-y-8">
        {/* 魔法底板 - The Magic Canvas */}
        <div className="relative">
          <button
            onClick={() => setShowActionSheet(true)}
            className="w-full relative bg-white rounded-3xl overflow-hidden shadow-[0_2px_16px_rgba(0,0,0,0.04)] hover:shadow-[0_4px_24px_rgba(0,0,0,0.06)] transition-all duration-500 cursor-pointer group"
            style={{
              minHeight: '280px',
              backgroundImage: `radial-gradient(circle, #E5E5E7 1.5px, transparent 1.5px)`,
              backgroundSize: '20px 20px',
              backgroundPosition: '0 0'
            }}
          >
            {/* 微凹效果叠加层 */}
            <div
              className="absolute inset-0 opacity-30"
              style={{
                background: 'radial-gradient(circle at 50% 50%, transparent 0%, rgba(0,0,0,0.02) 100%)'
              }}
            ></div>

            {/* 主内容区 */}
            <div className="relative z-10 flex flex-col items-center justify-center py-16 px-6">
              {/* 相机图标 */}
              <div className="mb-6 transform group-hover:scale-105 transition-transform duration-500">
                <div className="w-20 h-20 bg-[#1C1C1E] rounded-2xl flex items-center justify-center shadow-lg">
                  <Camera className="w-10 h-10 text-white" strokeWidth={1.5} />
                </div>
              </div>

              {/* 主文案 */}
              <h2 className="text-2xl font-semibold text-[#1C1C1E] mb-2 tracking-tight">
                + 唤醒灵感
              </h2>

              {/* 副文案 */}
              <p className="text-sm text-gray-500 mb-8">
                拍照 或 从相册导入图片
              </p>

              <span className="text-xs text-gray-400 font-light">
                AI 魔法,一键生成专属图纸
              </span>
            </div>

            {/* 新手入口 */}
            <div className="absolute top-4 right-4 z-20">
              <Link
                to="/tutorial"
                className="text-xs text-gray-400 hover:text-gray-600 transition-colors flex items-center gap-1"
                onClick={(e) => e.stopPropagation()}
              >
                新手？点击体验 10 分钟入门
                <ChevronRight className="w-3 h-3" />
              </Link>
            </div>
          </button>
        </div>

        {/* 正在进行 - In Progress */}
        {hasUnfinishedWork && (
          <div className="space-y-3">
            <div className="flex items-center justify-between px-1">
              <h3 className="text-base font-medium text-[#1C1C1E]">正在进行</h3>
              <Link to="/works" className="text-sm text-gray-400 hover:text-gray-600 transition-colors flex items-center gap-0.5">
                全部
                <ChevronRight className="w-4 h-4" />
              </Link>
            </div>

            <Link to={`/works/${unfinishedWork.id}`}>
              <div className="bg-white rounded-2xl p-5 shadow-[0_2px_12px_rgba(0,0,0,0.04)] hover:shadow-[0_4px_20px_rgba(0,0,0,0.08)] transition-all duration-300 cursor-pointer group">
                <div className="flex items-center gap-4">
                  {/* 立体质感缩略图 */}
                  <div className="relative flex-shrink-0">
                    <div
                      className="w-20 h-20 rounded-xl bg-gradient-to-br from-gray-100 to-gray-50 flex items-center justify-center shadow-[0_4px_12px_rgba(0,0,0,0.08),inset_0_1px_2px_rgba(255,255,255,0.8)]"
                      style={{
                        backgroundImage: `radial-gradient(circle, #D1D1D6 1px, transparent 1px)`,
                        backgroundSize: '8px 8px'
                      }}
                    >
                      <span className="text-3xl">🍄</span>
                    </div>
                  </div>

                  {/* 作品信息 */}
                  <div className="flex-1 min-w-0">
                    <h4 className="text-lg font-semibold text-[#1C1C1E] mb-2 tracking-tight">
                      {unfinishedWork.name}
                    </h4>

                    {/* 进度条 */}
                    <div className="mb-1.5">
                      <div className="h-1 bg-gray-100 rounded-full overflow-hidden">
                        <div
                          className="h-full bg-[#1C1C1E] rounded-full transition-all duration-500"
                          style={{ width: `${unfinishedWork.progress}%` }}
                        ></div>
                      </div>
                    </div>

                    <p className="text-xs text-gray-400">
                      距完成约 {unfinishedWork.estimatedTime}
                    </p>
                  </div>

                  {/* 继续箭头 */}
                  <div className="flex-shrink-0 text-gray-300 group-hover:text-[#1C1C1E] group-hover:translate-x-1 transition-all duration-300">
                    <span className="text-sm font-light">继续</span>
                    <ChevronRight className="w-5 h-5 inline ml-0.5" strokeWidth={1.5} />
                  </div>
                </div>
              </div>
            </Link>
          </div>
        )}

        {/* 灵感画廊 - Inspiration Gallery */}
        <div className="space-y-4">
          <div className="px-1">
            <h3 className="text-base font-medium text-[#1C1C1E]">灵感画廊</h3>
          </div>

          {/* 横向滑动画廊 */}
          <div className="flex gap-4 overflow-x-auto pb-2 -mx-4 px-4 scrollbar-hide">
            {inspirationGallery.map((item, index) => (
              <Link
                key={item.id}
                to={`/templates/${item.id}`}
                className="flex-shrink-0 group"
                style={{
                  animation: `fadeInUp 0.6s ease-out ${index * 0.1}s both`
                }}
              >
                <div className="w-40">
                  {/* 悬浮图案 */}
                  <div
                    className="relative aspect-square rounded-2xl mb-3 overflow-hidden shadow-[0_8px_24px_rgba(0,0,0,0.08)] group-hover:shadow-[0_12px_32px_rgba(0,0,0,0.12)] transition-all duration-500 group-hover:-translate-y-1"
                    style={{
                      backgroundImage: `radial-gradient(circle, #E0E0E5 1px, transparent 1px)`,
                      backgroundSize: '12px 12px',
                      backgroundColor: '#FAFAFA'
                    }}
                  >
                    <div className="absolute inset-0 flex items-center justify-center text-6xl">
                      {index === 0 && '🐶'}
                      {index === 1 && '🌸'}
                      {index === 2 && '🦖'}
                      {index === 3 && '⭐'}
                    </div>
                  </div>

                  {/* 情感化文案 */}
                  <h4 className="text-sm font-medium text-[#1C1C1E] mb-1 tracking-tight">
                    {item.name}
                  </h4>
                  <p className="text-xs text-gray-400">
                    {item.tag}
                  </p>
                </div>
              </Link>
            ))}
          </div>
        </div>
      </div>

      {/* 底部导航 */}
      <BottomNav />

      {/* Action Sheet */}
      <ActionSheet
        isOpen={showActionSheet}
        onClose={() => setShowActionSheet(false)}
        title="开始创作"
        options={actionSheetOptions}
      />

      {/* Draft Library Modal */}
      <DraftLibraryModal
        isOpen={showDraftLibrary}
        onClose={() => setShowDraftLibrary(false)}
        drafts={drafts}
        onSelectDraft={(draftId) => navigate(`/editor/${draftId}`)}
        onUpload={() => navigate('/create?mode=upload')}
      />

      {/* Template Modal */}
      <TemplateModal
        isOpen={showTemplateModal}
        onClose={() => setShowTemplateModal(false)}
        templates={featuredTemplates}
        onSelectTemplate={(templateId) => navigate(`/templates/${templateId}`)}
        onViewMore={() => navigate('/community')}
      />

      {/* 动画定义 */}
      <style>{`
        @keyframes fadeInUp {
          from {
            opacity: 0;
            transform: translateY(20px);
          }
          to {
            opacity: 1;
            transform: translateY(0);
          }
        }

        .scrollbar-hide::-webkit-scrollbar {
          display: none;
        }

        .scrollbar-hide {
          -ms-overflow-style: none;
          scrollbar-width: none;
        }
      `}</style>
    </div>
  );
}
