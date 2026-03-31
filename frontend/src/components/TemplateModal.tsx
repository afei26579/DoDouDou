import { X, ChevronRight } from 'lucide-react';
import { useEffect } from 'react';

interface Template {
  id: string;
  name: string;
  thumbnail: string;
  tag: string;
  difficulty: string;
}

interface TemplateModalProps {
  isOpen: boolean;
  onClose: () => void;
  templates: Template[];
  onSelectTemplate: (templateId: string) => void;
  onViewMore: () => void;
}

export default function TemplateModal({
  isOpen,
  onClose,
  templates,
  onSelectTemplate,
  onViewMore
}: TemplateModalProps) {
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
          <h3 className="text-lg font-semibold text-[#1C1C1E]">精选模板</h3>
          <button
            onClick={onClose}
            className="p-2 hover:bg-gray-100 rounded-full transition-colors"
          >
            <X className="w-5 h-5 text-gray-500" />
          </button>
        </div>

        {/* Content */}
        <div className="p-6 overflow-y-auto" style={{ maxHeight: '60vh' }}>
          {/* Template Grid */}
          <div className="grid grid-cols-3 gap-4 mb-6">
            {templates.map((template) => (
              <button
                key={template.id}
                onClick={() => {
                  onSelectTemplate(template.id);
                  onClose();
                }}
                className="group text-left"
              >
                {/* Thumbnail */}
                <div
                  className="relative aspect-square rounded-2xl mb-3 overflow-hidden shadow-lg group-hover:shadow-xl transition-all duration-300 group-hover:-translate-y-1"
                  style={{
                    backgroundImage: `radial-gradient(circle, #E0E0E5 1px, transparent 1px)`,
                    backgroundSize: '12px 12px',
                    backgroundColor: '#FAFAFA'
                  }}
                >
                  <div className="absolute inset-0 flex items-center justify-center text-5xl">
                    {template.thumbnail}
                  </div>

                  {/* Difficulty Badge */}
                  <div className="absolute top-2 right-2 bg-white/90 backdrop-blur-sm px-2 py-1 rounded-lg">
                    <span className="text-xs text-gray-600">{template.difficulty}</span>
                  </div>
                </div>

                {/* Info */}
                <h4 className="text-sm font-medium text-[#1C1C1E] mb-1 truncate">
                  {template.name}
                </h4>
                <p className="text-xs text-gray-400">{template.tag}</p>
              </button>
            ))}
          </div>

          {/* View More Button */}
          <button
            onClick={() => {
              onViewMore();
              onClose();
            }}
            className="w-full py-3 text-base font-medium text-blue-600 hover:bg-blue-50 rounded-xl transition-colors flex items-center justify-center gap-2"
          >
            查看更多模板
            <ChevronRight className="w-5 h-5" />
          </button>
        </div>
      </div>

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
