import { Upload, Trash2, Edit3, Share2 } from 'lucide-react';
import { useEffect, useState } from 'react';

interface Draft {
  id: string;
  name: string;
  thumbnail: string;
  size: { width: number; height: number };
  colors: number;
  createdAt: string;
}

interface DraftLibraryModalProps {
  isOpen: boolean;
  onClose: () => void;
  drafts: Draft[];
  onSelectDraft: (draftId: string) => void;
  onUpload: () => void;
}

export default function DraftLibraryModal({
  isOpen,
  onClose,
  drafts,
  onSelectDraft,
  onUpload
}: DraftLibraryModalProps) {
  const [showContextMenu, setShowContextMenu] = useState<string | null>(null);

  useEffect(() => {
    if (isOpen) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = '';
    }
    return () => {
      document.body.style.overflow = '';
    };
  }, [isOpen]);

  if (!isOpen) return null;

  const handleLongPress = (draftId: string) => {
    setShowContextMenu(draftId);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
      {/* Backdrop */}
      <div
        className="absolute inset-0 bg-black/40 backdrop-blur-sm"
        onClick={onClose}
      ></div>

      {/* Modal */}
      <div className="relative w-full max-w-2xl bg-white rounded-3xl shadow-2xl animate-scale-in overflow-hidden">
        {/* Header */}
        <div className="flex items-center justify-between px-6 py-4 border-b border-gray-100">
          <button
            onClick={onClose}
            className="flex items-center gap-2 text-gray-600 hover:text-gray-900 transition-colors"
          >
            <span className="text-lg">←</span>
            <span className="text-base">返回</span>
          </button>
          <h3 className="text-lg font-semibold text-[#1C1C1E]">我的图纸库</h3>
          <button
            onClick={() => {
              onUpload();
              onClose();
            }}
            className="flex items-center gap-1 text-blue-600 hover:text-blue-700 transition-colors"
          >
            <Upload className="w-4 h-4" />
            <span className="text-sm font-medium">上传</span>
          </button>
        </div>

        {/* Content */}
        <div className="p-6 overflow-y-auto" style={{ maxHeight: '60vh' }}>
          {drafts.length === 0 ? (
            <div className="text-center py-12">
              <div className="text-6xl mb-4">📁</div>
              <p className="text-gray-400 mb-2">暂无图纸</p>
              <p className="text-sm text-gray-300">先转换一张图片吧</p>
            </div>
          ) : (
            <div className="flex gap-4 overflow-x-auto pb-2">
              {drafts.map((draft) => (
                <div
                  key={draft.id}
                  className="flex-shrink-0 w-48 cursor-pointer group"
                  onClick={() => {
                    onSelectDraft(draft.id);
                    onClose();
                  }}
                  onContextMenu={(e) => {
                    e.preventDefault();
                    handleLongPress(draft.id);
                  }}
                >
                  {/* Thumbnail */}
                  <div
                    className="relative aspect-square rounded-2xl mb-3 overflow-hidden shadow-lg group-hover:shadow-xl transition-all duration-300"
                    style={{
                      backgroundImage: `radial-gradient(circle, #E0E0E5 1px, transparent 1px)`,
                      backgroundSize: '12px 12px',
                      backgroundColor: '#FAFAFA'
                    }}
                  >
                    <div className="absolute inset-0 flex items-center justify-center text-6xl">
                      {draft.thumbnail}
                    </div>
                  </div>

                  {/* Info */}
                  <h4 className="text-sm font-medium text-[#1C1C1E] mb-1 truncate">
                    {draft.name}
                  </h4>
                  <p className="text-xs text-gray-400">
                    {draft.size.width}×{draft.size.height}
                  </p>
                  <p className="text-xs text-gray-400">
                    {draft.colors}色
                  </p>
                  <p className="text-xs text-gray-300 mt-1">
                    {draft.createdAt}
                  </p>
                </div>
              ))}
            </div>
          )}

          {/* Hint */}
          {drafts.length > 0 && (
            <div className="mt-6 text-center">
              <p className="text-xs text-gray-400">点击图纸直接进入编辑器</p>
              <p className="text-xs text-gray-400">长按可删除或重命名</p>
            </div>
          )}
        </div>
      </div>

      {/* Context Menu */}
      {showContextMenu && (
        <div className="fixed inset-0 z-60 flex items-center justify-center">
          <div
            className="absolute inset-0 bg-black/20"
            onClick={() => setShowContextMenu(null)}
          ></div>
          <div className="relative bg-white rounded-2xl shadow-2xl p-2 min-w-[200px]">
            <button className="w-full flex items-center gap-3 px-4 py-3 hover:bg-gray-50 rounded-xl transition-colors text-left">
              <Edit3 className="w-4 h-4 text-gray-600" />
              <span className="text-sm text-gray-700">重命名</span>
            </button>
            <button className="w-full flex items-center gap-3 px-4 py-3 hover:bg-gray-50 rounded-xl transition-colors text-left">
              <Share2 className="w-4 h-4 text-gray-600" />
              <span className="text-sm text-gray-700">分享到社区</span>
            </button>
            <button className="w-full flex items-center gap-3 px-4 py-3 hover:bg-red-50 rounded-xl transition-colors text-left">
              <Trash2 className="w-4 h-4 text-red-600" />
              <span className="text-sm text-red-600">删除</span>
            </button>
          </div>
        </div>
      )}

      <style>{`
        @keyframes scale-in {
          from {
            opacity: 0;
            transform: scale(0.95);
          }
          to {
            opacity: 1;
            transform: scale(1);
          }
        }
        .animate-scale-in {
          animation: scale-in 0.2s ease-out;
        }
      `}</style>
    </div>
  );
}
