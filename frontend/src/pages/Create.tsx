import { useLocation, useNavigate, useSearchParams } from 'react-router-dom';
import { useEffect, useState, useRef } from 'react';
import { ArrowLeft, Upload, Loader2, RefreshCw, Edit3 } from 'lucide-react';

type ColorBrand = 'mard' | 'coco' | 'manman' | 'panpan' | 'mixiaowo';
type ConvertMode = 'realistic' | 'cartoon' | 'adaptive';
type ConvertSize = number;
type ThresholdLevel = 'low' | 'medium' | 'high';

interface ConversionParams {
  colorBrand: ColorBrand;
  mode: ConvertMode;
  size: ConvertSize;
  threshold: ThresholdLevel;
}

interface ConversionResult {
  originalImage: string;
  convertedGrid: string[][];
  preview: string;
  stats: {
    colors: number;
    beadCount: number;
    estimatedTime: string;
    estimatedCost?: string;
  };
}

const COLOR_BRANDS: { id: ColorBrand; name: string }[] = [
  { id: 'mard', name: 'MARD' },
  { id: 'coco', name: 'COCO' },
  { id: 'manman', name: '漫漫' },
  { id: 'panpan', name: '盼盼' },
  { id: 'mixiaowo', name: '咪小窝' }
];

const MODE_OPTIONS: { id: ConvertMode; name: string }[] = [
  { id: 'realistic', name: '写实' },
  { id: 'cartoon', name: '卡通' },
  { id: 'adaptive', name: '自适应' }
];

const SIZE_MIN = 30;
const SIZE_MAX = 300;
const DEFAULT_SIZE = 100;

const THRESHOLD_OPTIONS: { id: ThresholdLevel; name: string }[] = [
  { id: 'low', name: '低' },
  { id: 'medium', name: '中' },
  { id: 'high', name: '高' }
];

export default function Create() {
  const navigate = useNavigate();
  const location = useLocation();
  const [searchParams] = useSearchParams();
  const mode = searchParams.get('mode');

  const [step, setStep] = useState<'input' | 'converting' | 'result'>('input');
  const [uploadedImage, setUploadedImage] = useState<string | null>(null);
  const [conversionResult, setConversionResult] = useState<ConversionResult | null>(null);

  const [params, setParams] = useState<ConversionParams>({
    colorBrand: 'mard',
    mode: 'realistic',
    size: DEFAULT_SIZE,
    threshold: 'medium'
  });

  const fileInputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    const preloadedImage = (location.state as { preloadedImage?: string } | null)?.preloadedImage;
    if (preloadedImage) {
      setUploadedImage(preloadedImage);
      handleConvert(preloadedImage);
      navigate(location.pathname, { replace: true, state: null });
      return;
    }

    if (mode === 'upload') {
      const timer = window.setTimeout(() => {
        fileInputRef.current?.click();
      }, 50);
      return () => window.clearTimeout(timer);
    }
  }, [mode, location.state]);

  const handleFileSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onload = (event) => {
      const imageData = event.target?.result as string;
      setUploadedImage(imageData);
      handleConvert(imageData);
    };
    reader.readAsDataURL(file);
  };

  const buildMockBlueprintPreview = async (imageData: string): Promise<string> => {
    const img = new Image();
    img.src = imageData;

    await new Promise<void>((resolve, reject) => {
      img.onload = () => resolve();
      img.onerror = () => reject(new Error('图片加载失败'));
    });

    const gridSize = params.size;
    const smallCanvas = document.createElement('canvas');
    smallCanvas.width = gridSize;
    smallCanvas.height = gridSize;
    const smallCtx = smallCanvas.getContext('2d');
    if (!smallCtx) return imageData;

    const side = Math.min(img.width, img.height);
    const sx = Math.floor((img.width - side) / 2);
    const sy = Math.floor((img.height - side) / 2);
    smallCtx.drawImage(img, sx, sy, side, side, 0, 0, gridSize, gridSize);

    const image = smallCtx.getImageData(0, 0, gridSize, gridSize);
    const data = image.data;

    const levels = params.mode === 'cartoon' ? 4 : params.mode === 'realistic' ? 7 : 5;
    const step = Math.max(1, Math.floor(256 / levels));

    for (let i = 0; i < data.length; i += 4) {
      data[i] = Math.min(255, Math.round(data[i] / step) * step);
      data[i + 1] = Math.min(255, Math.round(data[i + 1] / step) * step);
      data[i + 2] = Math.min(255, Math.round(data[i + 2] / step) * step);
    }
    smallCtx.putImageData(image, 0, 0);

    const previewSize = 900;
    const previewCanvas = document.createElement('canvas');
    previewCanvas.width = previewSize;
    previewCanvas.height = previewSize;
    const previewCtx = previewCanvas.getContext('2d');
    if (!previewCtx) return imageData;

    previewCtx.imageSmoothingEnabled = false;
    previewCtx.drawImage(smallCanvas, 0, 0, previewSize, previewSize);

    const cell = previewSize / gridSize;
    previewCtx.strokeStyle = 'rgba(0,0,0,0.12)';
    previewCtx.lineWidth = 1;
    for (let i = 0; i <= gridSize; i++) {
      const p = Math.round(i * cell) + 0.5;
      previewCtx.beginPath();
      previewCtx.moveTo(p, 0);
      previewCtx.lineTo(p, previewSize);
      previewCtx.stroke();

      previewCtx.beginPath();
      previewCtx.moveTo(0, p);
      previewCtx.lineTo(previewSize, p);
      previewCtx.stroke();
    }

    return previewCanvas.toDataURL('image/png');
  };

  const handleConvert = async (imageData: string) => {
    setStep('converting');

    await new Promise(resolve => setTimeout(resolve, 800));
    const preview = await buildMockBlueprintPreview(imageData);

    const beadCount = params.size * params.size;
    const mockResult: ConversionResult = {
      originalImage: imageData,
      convertedGrid: [],
      preview,
      stats: {
        colors: params.mode === 'cartoon' ? 14 : params.mode === 'realistic' ? 20 : 18,
        beadCount,
        estimatedTime: calculateEstimatedTime(beadCount),
        estimatedCost: '¥45-60'
      }
    };

    setConversionResult(mockResult);
    setStep('result');
  };

  const calculateEstimatedTime = (beadCount: number): string => {
    const minutes = Math.round(beadCount / 50);
    if (minutes < 60) return `${minutes}分钟`;
    const hours = Math.floor(minutes / 60);
    const mins = minutes % 60;
    return mins > 0 ? `${hours}小时${mins}分钟` : `${hours}小时`;
  };

  const handleReconvert = () => {
    if (uploadedImage) handleConvert(uploadedImage);
  };

  const handleChangeImage = () => {
    fileInputRef.current?.click();
  };

  const handleEnterEditor = () => {
    if (conversionResult) navigate('/editor/new');
  };

  const [activeTag, setActiveTag] = useState<'brand' | 'mode' | 'size' | 'threshold' | null>(null);
  const [sizeInput, setSizeInput] = useState(String(DEFAULT_SIZE));

  const clampSize = (value: number) => Math.max(SIZE_MIN, Math.min(SIZE_MAX, value));

  const commitSizeInput = () => {
    const n = Number(sizeInput);
    if (Number.isNaN(n)) {
      setSizeInput(String(params.size));
      return;
    }
    const clamped = clampSize(n);
    setParams((p) => ({ ...p, size: clamped }));
    setSizeInput(String(clamped));
  };

  const renderTagsSection = () => {
    const tagItems = [
      {
        key: 'brand' as const,
        value: COLOR_BRANDS.find((v) => v.id === params.colorBrand)?.name ?? 'MARD',
      },
      {
        key: 'mode' as const,
        value: MODE_OPTIONS.find((v) => v.id === params.mode)?.name ?? '写实',
      },
      {
        key: 'size' as const,
        value: String(params.size),
      },
      {
        key: 'threshold' as const,
        value: THRESHOLD_OPTIONS.find((v) => v.id === params.threshold)?.name ?? '中',
      },
    ];

    if (!activeTag) {
      return (
        <div className="bg-white rounded-2xl border border-gray-100 p-3">
          <div className="grid grid-cols-4 gap-2">
            {tagItems.map((item) => (
              <button
                key={item.key}
                onClick={() => {
                  setActiveTag(item.key);
                  if (item.key === 'size') {
                    setSizeInput(String(params.size));
                  }
                }}
                className="h-10 rounded-xl border text-sm font-medium transition-colors border-gray-200 text-gray-700 bg-white"
              >
                {item.value}
              </button>
            ))}
          </div>
        </div>
      );
    }

    const optionItems =
      activeTag === 'brand'
        ? COLOR_BRANDS.map((v) => ({ id: v.id, label: v.name }))
        : activeTag === 'mode'
          ? MODE_OPTIONS.map((v) => ({ id: v.id, label: v.name }))
          : THRESHOLD_OPTIONS.map((v) => ({ id: v.id, label: v.name }));

    const selectedId =
      activeTag === 'brand'
        ? params.colorBrand
        : activeTag === 'mode'
          ? params.mode
          : params.threshold;

    const applyOption = (id: string) => {
      if (activeTag === 'brand') {
        setParams((p) => ({ ...p, colorBrand: id as ColorBrand }));
      } else if (activeTag === 'mode') {
        setParams((p) => ({ ...p, mode: id as ConvertMode }));
      } else {
        setParams((p) => ({ ...p, threshold: id as ThresholdLevel }));
      }
      setActiveTag(null);
    };

    return (
      <div className="bg-white rounded-2xl border border-gray-100 p-3">
        <div className="grid grid-cols-4 gap-2">
          {tagItems.map((item) => (
            <button
              key={item.key}
              onClick={() => {
                  setActiveTag(item.key);
                  if (item.key === 'size') {
                    setSizeInput(String(params.size));
                  }
                }}
              className={`h-10 rounded-xl border text-sm font-medium transition-colors ${
                activeTag === item.key
                  ? 'border-[#1C1C1E] text-[#1C1C1E] bg-gray-50'
                  : 'border-gray-200 text-gray-700 bg-white'
              }`}
            >
              {item.value}
            </button>
          ))}
        </div>

        {activeTag === 'size' ? (
          <div className="mt-3 rounded-xl border border-gray-200 p-3">
            <div className="flex items-center gap-3">
              <input
                type="range"
                min={SIZE_MIN}
                max={SIZE_MAX}
                step={1}
                value={params.size}
                onChange={(e) => {
                  const v = clampSize(Number(e.target.value));
                  setParams((p) => ({ ...p, size: v }));
                  setSizeInput(String(v));
                }}
                className="flex-1"
              />
              <input
                type="text"
                inputMode="numeric"
                value={sizeInput}
                onChange={(e) => setSizeInput(e.target.value.replace(/[^\d]/g, ''))}
                onBlur={commitSizeInput}
                onKeyDown={(e) => {
                  if (e.key === 'Enter') {
                    commitSizeInput();
                  }
                }}
                className={`w-20 h-9 px-2 border rounded-lg text-sm text-center focus:outline-none ${
                  Number(sizeInput) < SIZE_MIN || Number(sizeInput) > SIZE_MAX
                    ? 'border-red-300 text-red-500 focus:border-red-400'
                    : 'border-gray-200 text-[#1C1C1E] focus:border-[#1C1C1E]'
                }`}
              />
              <button
                onClick={() => {
                  commitSizeInput();
                  setActiveTag(null);
                }}
                className="h-9 px-3 rounded-lg border border-gray-200 text-sm text-gray-700"
              >
                完成
              </button>
            </div>
          </div>
        ) : (
          <div className="mt-3 overflow-x-auto">
            <div className="flex gap-2 min-w-max pb-1">
              {optionItems.map((item) => (
                <button
                  key={item.id}
                  onClick={() => applyOption(item.id)}
                  className={`px-4 h-9 rounded-full border text-sm whitespace-nowrap transition-colors ${
                    selectedId === item.id
                      ? 'border-[#1C1C1E] bg-[#1C1C1E] text-white'
                      : 'border-gray-200 text-gray-700 bg-white'
                  }`}
                >
                  {item.label}
                </button>
              ))}
            </div>
          </div>
        )}
      </div>
    );
  };

  const renderUploadSection = () => (
    <div
      onClick={() => fileInputRef.current?.click()}
      className="relative border-2 border-dashed border-gray-200 rounded-3xl p-12 text-center cursor-pointer hover:border-gray-300 hover:bg-gray-50 transition-all"
    >
      <Upload className="w-16 h-16 text-gray-300 mx-auto mb-4" />
      <h3 className="text-lg font-medium text-[#1C1C1E] mb-2">上传图片</h3>
      <p className="text-sm text-gray-400">支持 JPG、PNG、WEBP 格式，最大 10MB</p>
      <p className="text-xs text-gray-400 mt-2">将按当前标签参数生成图纸</p>
    </div>
  );

  const renderConverting = () => (
    <div className="text-center py-16">
      <Loader2 className="w-16 h-16 text-[#1C1C1E] mx-auto mb-6 animate-spin" />
      <h3 className="text-xl font-medium text-[#1C1C1E] mb-2">正在生成图纸...</h3>
      <p className="text-sm text-gray-400">参数：{COLOR_BRANDS.find(v => v.id === params.colorBrand)?.name} · {MODE_OPTIONS.find(v => v.id === params.mode)?.name} · {params.size}</p>
    </div>
  );

  const renderResult = () => {
    if (!conversionResult) return null;

    return (
      <div className="space-y-4">
        {renderTagsSection()}

        <div className="bg-white rounded-2xl p-3 border border-gray-100">
          <div className="flex items-center gap-3">
            <button
              onClick={handleChangeImage}
              className="relative w-20 h-20 rounded-xl overflow-hidden flex-shrink-0 group"
            >
              <img src={conversionResult.originalImage} alt="原图" className="w-full h-full object-cover" />
              <div className="absolute inset-0 bg-black/50 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
                <Upload className="w-6 h-6 text-white" />
              </div>
            </button>
            <div className="flex-1">
              <p className="text-sm font-medium text-[#1C1C1E]">原图</p>
              <p className="text-xs text-gray-400 mt-1">点击更换图片</p>
            </div>
          </div>
        </div>

        <div className="bg-white rounded-2xl p-4 border border-gray-100">
          <div className="flex items-center justify-between mb-3">
            <p className="text-sm font-medium text-[#1C1C1E]">转换后的图纸</p>
            <button
              onClick={handleReconvert}
              className="text-xs text-gray-600 hover:text-[#1C1C1E] transition-colors flex items-center gap-1"
            >
              <RefreshCw className="w-3 h-3" />
              重新转换
            </button>
          </div>

          <button
            onClick={handleEnterEditor}
            className="relative w-full aspect-square rounded-xl overflow-hidden bg-gray-50 group cursor-pointer"
            style={{
              backgroundImage: 'radial-gradient(circle, #E0E0E5 1px, transparent 1px)',
              backgroundSize: '12px 12px'
            }}
          >
            <img
              src={conversionResult.preview}
              alt="图纸预览"
              className="w-full h-full object-contain"
              style={{ imageRendering: 'pixelated' }}
            />
            <div className="absolute inset-0 bg-black/50 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
              <div className="text-white text-center">
                <Edit3 className="w-8 h-8 mx-auto mb-2" />
                <p className="text-sm font-medium">点击进入编辑</p>
              </div>
            </div>
          </button>

          <div className="mt-4 grid grid-cols-2 gap-3">
            <div className="bg-gray-50 rounded-lg p-3">
              <p className="text-xs text-gray-400 mb-1">颜色种类</p>
              <p className="text-lg font-semibold text-[#1C1C1E]">{conversionResult.stats.colors} 种</p>
            </div>
            <div className="bg-gray-50 rounded-lg p-3">
              <p className="text-xs text-gray-400 mb-1">豆豆数量</p>
              <p className="text-lg font-semibold text-[#1C1C1E]">{conversionResult.stats.beadCount} 颗</p>
            </div>
            <div className="bg-gray-50 rounded-lg p-3">
              <p className="text-xs text-gray-400 mb-1">预计时间</p>
              <p className="text-sm font-medium text-[#1C1C1E]">{conversionResult.stats.estimatedTime}</p>
            </div>
            <div className="bg-gray-50 rounded-lg p-3">
              <p className="text-xs text-gray-400 mb-1">预计成本</p>
              <p className="text-sm font-medium text-[#1C1C1E]">{conversionResult.stats.estimatedCost || '-'}</p>
            </div>
          </div>
        </div>

        <div className="grid grid-cols-2 gap-3">
          <button
            onClick={handleReconvert}
            className="py-3 border border-gray-200 text-[#1C1C1E] rounded-xl font-medium hover:bg-gray-50 transition-colors flex items-center justify-center gap-2"
          >
            <RefreshCw className="w-5 h-5" />
            重新转换
          </button>
          <button
            onClick={handleEnterEditor}
            className="py-3 bg-[#1C1C1E] text-white rounded-xl font-medium hover:bg-gray-800 transition-colors flex items-center justify-center gap-2"
          >
            <Edit3 className="w-5 h-5" />
            进入编辑
          </button>
        </div>
      </div>
    );
  };

  return (
    <div className="min-h-screen bg-[#F5F5F7]">
      <header className="bg-white border-b border-gray-100 sticky top-0 z-10">
        <div className="max-w-screen-xl mx-auto px-4 h-14 flex items-center justify-between">
          <button
            onClick={() => navigate(-1)}
            className="flex items-center gap-2 text-gray-600 hover:text-gray-900 transition-colors"
          >
            <ArrowLeft className="w-5 h-5" />
          </button>
          <h1 className="text-base font-medium text-[#1C1C1E]">图片转图纸</h1>
          <div className="w-5" />
        </div>
      </header>

      <div className="max-w-screen-xl mx-auto px-4 py-6">
        <input
          ref={fileInputRef}
          type="file"
          accept="image/*"
          onChange={handleFileSelect}
          className="hidden"
        />

        {step === 'input' && (
          <div className="space-y-4">
            {renderTagsSection()}
            {renderUploadSection()}
          </div>
        )}
        {step === 'converting' && renderConverting()}
        {step === 'result' && renderResult()}
      </div>
    </div>
  );
}
