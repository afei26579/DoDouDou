import { X } from 'lucide-react';
import { useEffect } from 'react';

interface ActionSheetOption {
  icon: string;
  label: string;
  sublabel?: string;
  badge?: string;
  onClick: () => void;
  disabled?: boolean;
}

interface ActionSheetProps {
  isOpen: boolean;
  onClose: () => void;
  title: string;
  options: ActionSheetOption[];
}

export default function ActionSheet({ isOpen, onClose, title, options }: ActionSheetProps) {
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
    <div className="fixed inset-0 z-50 flex items-end justify-center">
      {/* Backdrop */}
      <div
        className="absolute inset-0 bg-black/40 backdrop-blur-sm transition-opacity"
        onClick={onClose}
      ></div>

      {/* Sheet */}
      <div
        className="relative w-full max-w-screen-xl bg-white rounded-t-3xl shadow-2xl animate-slide-up"
        style={{ maxHeight: '80vh' }}
      >
        {/* Header */}
        <div className="flex items-center justify-between px-6 py-4 border-b border-gray-100">
          <h3 className="text-lg font-semibold text-[#1C1C1E]">{title}</h3>
          <button
            onClick={onClose}
            className="p-2 hover:bg-gray-100 rounded-full transition-colors"
          >
            <X className="w-5 h-5 text-gray-500" />
          </button>
        </div>

        {/* Options */}
        <div className="overflow-y-auto" style={{ maxHeight: 'calc(80vh - 80px)' }}>
          {options.map((option, index) => (
            <button
              key={index}
              onClick={() => {
                if (!option.disabled) {
                  option.onClick();
                  onClose();
                }
              }}
              disabled={option.disabled}
              className={`w-full flex items-center gap-4 px-6 py-4 hover:bg-gray-50 transition-colors border-b border-gray-50 last:border-b-0 ${
                option.disabled ? 'opacity-50 cursor-not-allowed' : ''
              }`}
            >
              <span className="text-3xl flex-shrink-0">{option.icon}</span>
              <div className="flex-1 text-left">
                <div className="flex items-center gap-2">
                  <span className="text-base font-medium text-[#1C1C1E]">{option.label}</span>
                  {option.badge && (
                    <span className="text-xs text-gray-400 bg-gray-100 px-2 py-0.5 rounded-full">
                      {option.badge}
                    </span>
                  )}
                </div>
                {option.sublabel && (
                  <p className="text-sm text-gray-400 mt-0.5">{option.sublabel}</p>
                )}
              </div>
              {!option.disabled && (
                <span className="text-gray-300 flex-shrink-0">→</span>
              )}
            </button>
          ))}
        </div>

        {/* Cancel Button */}
        <div className="p-4 border-t border-gray-100">
          <button
            onClick={onClose}
            className="w-full py-3 text-base font-medium text-gray-600 hover:bg-gray-50 rounded-xl transition-colors"
          >
            取消
          </button>
        </div>
      </div>

      <style>{`
        @keyframes slide-up {
          from {
            transform: translateY(100%);
          }
          to {
            transform: translateY(0);
          }
        }
        .animate-slide-up {
          animation: slide-up 0.3s ease-out;
        }
      `}</style>
    </div>
  );
}
