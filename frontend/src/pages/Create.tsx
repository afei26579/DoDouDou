import { useNavigate, useSearchParams } from 'react-router-dom';
import { useState, useRef } from 'react';
import { ArrowLeft, Upload, Loader2, ChevronDown, ChevronUp, RefreshCw, Edit3 } from 'lucide-react';

type ColorBrand = 'auto' | 'mard' | 'coco' | 'manman' | 'artkal';
type PresetMode = 'beginner' | 'standard' | 'professional';

interface ConversionParams {
  boardWidth: number;
  boardHeight: number;
  colorBrand: ColorBrand;
  colorCount: number | 'auto';
  removeBackground: boolean;
  enhanceContrast: boolean;
  optimizeEdges: boolean;
  removeNoise: boolean;
}

interface ConversionResult {
  originalImage: string;
  convertedGrid: string[][];
  preview: string;
  stats: {
    width: number;
    height: number;
    colors: number;
    beadCount: number;
    estimatedTime: string;
    estimatedCost?: string;
  };
}

export default function Create() {
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  // mode参数预留给AI创作等其他模式使用
  searchParams.get('mode');

  // 转换状态
  const [step, setStep] = useState<'input' | 'converting' | 'result'>('input');
  const [uploadedImage, setUploadedImage] = useState<string | null>(null);
  const [conversionResult, setConversionResult] = useState<ConversionResult | null>(null);

  // 参数设置
  const [showParams, setShowParams] = useState(true);
  const [showAdvanced, setShowAdvanced] = useState(false);
  const [params, setParams] = useState<ConversionParams>({
    boardWidth: 52,
    boardHeight: 52,
    colorBrand: 'auto',
    colorCount: 'auto',
    removeBackground: false,
    enhanceContrast: true,
    optimizeEdges: true,
    removeNoise: true
  });

  const fileInputRef = useRef<HTMLInputElement>(null);

  // 常用尺寸预设
  const commonSizes = [
    { label: '29×29', width: 29, height: 29, desc: '小型' },
    { label: '52×52', width: 52, height: 52, desc: '标准' },
    { label: '58×58', width: 58, height: 58, desc: '大型' }
  ];

  // 色系品牌
  const colorBrands = [
    { id: 'auto' as ColorBrand, name: '智能选色', colors: 0, desc: '自动选择最佳颜色' },
    { id: 'mard' as ColorBrand, name: 'MARD', colors: 30, desc: '30色，性价比高' },
    { id: 'coco' as ColorBrand, name: 'COCO', colors: 48, desc: '48色，色彩丰富' },
    { id: 'manman' as ColorBrand, name: '漫漫', colors: 36, desc: '36色，质量优' },
    { id: 'artkal' as ColorBrand, name: 'Artkal', colors: 30, desc: '30色，进口品质' }
  ];

  // 预设模式
  const presetModes: { id: PresetMode; name: string; desc: string; params: Partial<ConversionParams> }[] = [
    {
      id: 'beginner',
      name: '新手模式',
      desc: '小尺寸，少颜色，快速完成',
      params: { boardWidth: 29, boardHeight: 29, colorCount: 8 }
    },
    {
      id: 'standard',
      name: '标准模式',
      desc: '中等尺寸，适中颜色',
      params: { boardWidth: 52, boardHeight: 52, colorCount: 15 }
    },
    {
      id: 'professional',
      name: '专业模式',
      desc: '大尺寸，丰富颜色，细节保留',
      params: { boardWidth: 58, boardHeight: 58, colorCount: 25 }
    }
  ];

  // 应用预设模式
  const applyPreset = (preset: PresetMode) => {
    const presetConfig = presetModes.find(p => p.id === preset);
    if (presetConfig) {
      setParams(prev => ({ ...prev, ...presetConfig.params }));
    }
  };

  // 处理文件选择
  const handleFileSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = (event) => {
        const imageData = event.target?.result as string;
        setUploadedImage(imageData);
        handleConvert(imageData);
      };
      reader.readAsDataURL(file);
    }
  };

  // 转换图纸
  const handleConvert = async (imageData: string) => {
    setStep('converting');
    setShowParams(false); // 转换时自动收起参数

    // TODO: 调用后端API进行转换
    // 模拟转换过程
    await new Promise(resolve => setTimeout(resolve, 2500));

    // 模拟生成结果
    const mockResult: ConversionResult = {
      originalImage: imageData,
      convertedGrid: [], // TODO: 实际的网格数据
      preview: imageData,
      stats: {
        width: params.boardWidth,
        height: params.boardHeight,
        colors: typeof params.colorCount === 'number' ? params.colorCount : 12,
        beadCount: params.boardWidth * params.boardHeight,
        estimatedTime: calculateEstimatedTime(params.boardWidth * params.boardHeight),
        estimatedCost: '¥45-60'
      }
    };

    setConversionResult(mockResult);
    setStep('result');
  };

  // 计算预计时间
  const calculateEstimatedTime = (beadCount: number): string => {
    const minutes = Math.round(beadCount / 50); // 假设每分钟50颗
    if (minutes < 60) return `${minutes}分钟`;
    const hours = Math.floor(minutes / 60);
    const mins = minutes % 60;
    return mins > 0 ? `${hours}小时${mins}分钟` : `${hours}小时`;
  };

  // 重新转换
  const handleReconvert = () => {
    if (uploadedImage) {
      handleConvert(uploadedImage);
    }
  };

  // 更换图片
  const handleChangeImage = () => {
    fileInputRef.current?.click();
  };

  // 进入编辑模式
  const handleEnterEditor = () => {
    if (conversionResult) {
      // TODO: 保存图纸数据到状态或后端
      navigate('/editor/new');
    }
  };

  // 渲染参数设置区域
  const renderParamsSection = () => (
    <div className="bg-white rounded-2xl border border-gray-100 overflow-hidden">
      {/* 参数标题栏 */}
      <button
        onClick={() => setShowParams(!showParams)}
        className="w-full px-4 py-3 flex items-center justify-between hover:bg-gray-50 transition-colors"
      >
        <div className="flex items-center gap-2">
          {showParams ? <ChevronUp className="w-5 h-5 text-gray-400" /> : <ChevronDown className="w-5 h-5 text-gray-400" />}
          <span className="text-sm font-medium text-[#1C1C1E]">参数设置</span>
        </div>
        <span className="text-xs text-gray-400">
          {params.boardWidth}×{params.boardHeight} · {colorBrands.find(b => b.id === params.colorBrand)?.name}
        </span>
      </button>

      {/* 参数内容 */}
      {showParams && (
        <div className="px-4 pb-4 space-y-4 border-t border-gray-100">
          {/* 快捷预设 */}
          <div className="pt-4">
            <label className="block text-sm font-medium text-[#1C1C1E] mb-3">快捷预设</label>
            <div className="grid grid-cols-3 gap-2">
              {presetModes.map((preset) => (
                <button
                  key={preset.id}
                  onClick={() => applyPreset(preset.id)}
                  className="p-3 rounded-xl border border-gray-200 hover:border-[#1C1C1E] hover:bg-gray-50 transition-all text-left"
                >
                  <p className="text-sm font-medium text-[#1C1C1E] mb-1">{preset.name}</p>
                  <p className="text-xs text-gray-400 line-clamp-2">{preset.desc}</p>
                </button>
              ))}
            </div>
          </div>

          {/* 板子尺寸 */}
          <div>
            <label className="block text-sm font-medium text-[#1C1C1E] mb-3">📐 板子尺寸</label>
            <div className="grid grid-cols-3 gap-2 mb-3">
              {commonSizes.map((size) => (
                <button
                  key={size.label}
                  onClick={() => setParams(prev => ({ ...prev, boardWidth: size.width, boardHeight: size.height }))}
                  className={`p-3 rounded-xl border-2 transition-all ${
                    params.boardWidth === size.width && params.boardHeight === size.height
                      ? 'border-[#1C1C1E] bg-gray-50'
                      : 'border-gray-200 hover:border-gray-300'
                  }`}
                >
                  <p className="text-sm font-medium text-[#1C1C1E]">{size.label}</p>
                  <p className="text-xs text-gray-400">{size.desc}</p>
                </button>
              ))}
            </div>
            <div className="grid grid-cols-2 gap-3">
              <div>
                <label className="block text-xs text-gray-600 mb-1">宽度</label>
                <input
                  type="number"
                  min="26"
                  max="300"
                  value={params.boardWidth}
                  onChange={(e) => setParams(prev => ({ ...prev, boardWidth: Math.max(26, Math.min(300, parseInt(e.target.value) || 26)) }))}
                  className="w-full px-3 py-2 border border-gray-200 rounded-lg focus:outline-none focus:border-[#1C1C1E] transition-colors"
                />
              </div>
              <div>
                <label className="block text-xs text-gray-600 mb-1">高度</label>
                <input
                  type="number"
                  min="26"
                  max="300"
                  value={params.boardHeight}
                  onChange={(e) => setParams(prev => ({ ...prev, boardHeight: Math.max(26, Math.min(300, parseInt(e.target.value) || 26)) }))}
                  className="w-full px-3 py-2 border border-gray-200 rounded-lg focus:outline-none focus:border-[#1C1C1E] transition-colors"
                />
              </div>
            </div>
            <p className="text-xs text-gray-400 mt-2">
              预计豆豆数：{params.boardWidth * params.boardHeight} 颗 ·
              预计时间：{calculateEstimatedTime(params.boardWidth * params.boardHeight)}
            </p>
          </div>

          {/* 色系选择 */}
          <div>
            <label className="block text-sm font-medium text-[#1C1C1E] mb-3">🎨 色系选择</label>
            <div className="space-y-2">
              {colorBrands.map((brand) => (
                <button
                  key={brand.id}
                  onClick={() => setParams(prev => ({ ...prev, colorBrand: brand.id }))}
                  className={`w-full p-3 rounded-xl border-2 transition-all text-left ${
                    params.colorBrand === brand.id
                      ? 'border-[#1C1C1E] bg-gray-50'
                      : 'border-gray-200 hover:border-gray-300'
                  }`}
                >
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-sm font-medium text-[#1C1C1E]">{brand.name}</p>
                      <p className="text-xs text-gray-400">{brand.desc}</p>
                    </div>
                    {brand.colors > 0 && (
                      <span className="text-xs text-gray-400 bg-gray-100 px-2 py-1 rounded-full">
                        {brand.colors}色
                      </span>
                    )}
                  </div>
                </button>
              ))}
            </div>
          </div>

          {/* 去除背景 */}
          <div>
            <label className="block text-sm font-medium text-[#1C1C1E] mb-3">✂️ 去除背景</label>
            <button
              onClick={() => setParams(prev => ({ ...prev, removeBackground: !prev.removeBackground }))}
              className={`w-full p-3 rounded-xl border-2 transition-all text-left ${
                params.removeBackground
                  ? 'border-[#1C1C1E] bg-gray-50'
                  : 'border-gray-200 hover:border-gray-300'
              }`}
            >
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-[#1C1C1E]">智能去除背景</p>
                  <p className="text-xs text-gray-400">自动识别主体，去除背景</p>
                </div>
                <div className={`relative w-12 h-6 rounded-full transition-colors ${
                  params.removeBackground ? 'bg-[#1C1C1E]' : 'bg-gray-200'
                }`}>
                  <div className={`absolute top-0.5 w-5 h-5 bg-white rounded-full transition-transform ${
                    params.removeBackground ? 'translate-x-6' : 'translate-x-0.5'
                  }`}></div>
                </div>
              </div>
            </button>
          </div>

          {/* 高级选项 */}
          <div>
            <button
              onClick={() => setShowAdvanced(!showAdvanced)}
              className="flex items-center gap-2 text-sm text-gray-600 hover:text-[#1C1C1E] transition-colors"
            >
              {showAdvanced ? <ChevronUp className="w-4 h-4" /> : <ChevronDown className="w-4 h-4" />}
              <span>高级选项</span>
            </button>

            {showAdvanced && (
              <div className="mt-3 space-y-3 pl-6 border-l-2 border-gray-100">
                {/* 颜色数量 */}
                <div>
                  <label className="block text-xs text-gray-600 mb-2">颜色数量</label>
                  <select
                    value={params.colorCount}
                    onChange={(e) => setParams(prev => ({ ...prev, colorCount: e.target.value === 'auto' ? 'auto' : parseInt(e.target.value) }))}
                    className="w-full px-3 py-2 border border-gray-200 rounded-lg focus:outline-none focus:border-[#1C1C1E] transition-colors text-sm"
                  >
                    <option value="auto">自动</option>
                    <option value="8">8 种颜色</option>
                    <option value="15">15 种颜色</option>
                    <option value="25">25 种颜色</option>
                  </select>
                </div>

                {/* 对比度增强 */}
                <label className="flex items-center justify-between">
                  <span className="text-xs text-gray-600">对比度增强</span>
                  <input
                    type="checkbox"
                    checked={params.enhanceContrast}
                    onChange={(e) => setParams(prev => ({ ...prev, enhanceContrast: e.target.checked }))}
                    className="w-4 h-4"
                  />
                </label>

                {/* 边缘优化 */}
                <label className="flex items-center justify-between">
                  <span className="text-xs text-gray-600">边缘优化</span>
                  <input
                    type="checkbox"
                    checked={params.optimizeEdges}
                    onChange={(e) => setParams(prev => ({ ...prev, optimizeEdges: e.target.checked }))}
                    className="w-4 h-4"
                  />
                </label>

                {/* 噪点去除 */}
                <label className="flex items-center justify-between">
                  <span className="text-xs text-gray-600">噪点去除</span>
                  <input
                    type="checkbox"
                    checked={params.removeNoise}
                    onChange={(e) => setParams(prev => ({ ...prev, removeNoise: e.target.checked }))}
                    className="w-4 h-4"
                  />
                </label>
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );

  // 渲染上传区域
  const renderUploadSection = () => (
    <div
      onClick={() => fileInputRef.current?.click()}
      className="relative border-2 border-dashed border-gray-200 rounded-3xl p-12 text-center cursor-pointer hover:border-gray-300 hover:bg-gray-50 transition-all"
    >
      <input
        ref={fileInputRef}
        type="file"
        accept="image/*"
        onChange={handleFileSelect}
        className="hidden"
      />
      <Upload className="w-16 h-16 text-gray-300 mx-auto mb-4" />
      <h3 className="text-lg font-medium text-[#1C1C1E] mb-2">上传图片</h3>
      <p className="text-sm text-gray-400">支持 JPG、PNG、WEBP 格式，最大 10MB</p>
      <p className="text-xs text-gray-400 mt-2">上传后将自动转换为图纸</p>
    </div>
  );

  // 渲染转换中状态
  const renderConverting = () => (
    <div className="text-center py-16">
      <Loader2 className="w-16 h-16 text-[#1C1C1E] mx-auto mb-6 animate-spin" />
      <h3 className="text-xl font-medium text-[#1C1C1E] mb-2">正在转换图纸...</h3>
      <p className="text-sm text-gray-400">根据您的参数生成最佳方案</p>
      <div className="mt-4 space-y-1 text-xs text-gray-400">
        <p>✓ 分析图片内容</p>
        <p>✓ 优化颜色匹配</p>
        <p>✓ 生成图纸网格</p>
      </div>
    </div>
  );

  // 渲染转换结果
  const renderResult = () => {
    if (!conversionResult) return null;

    return (
      <div className="space-y-4">
        {/* 参数设置（收起状态） */}
        {renderParamsSection()}

        {/* 原图预览（小） */}
        <div className="bg-white rounded-2xl p-3 border border-gray-100">
          <div className="flex items-center gap-3">
            <button
              onClick={handleChangeImage}
              className="relative w-20 h-20 rounded-xl overflow-hidden flex-shrink-0 group"
            >
              <img
                src={conversionResult.originalImage}
                alt="原图"
                className="w-full h-full object-cover"
              />
              <div className="absolute inset-0 bg-black/50 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
                <Upload className="w-6 h-6 text-white" />
              </div>
            </button>
            <div className="flex-1">
              <p className="text-sm font-medium text-[#1C1C1E]">原图</p>
              <p className="text-xs text-gray-400 mt-1">点击更换图片</p>
            </div>
            <div className="text-right">
              <p className="text-xs text-gray-400">
                {conversionResult.stats.width}×{conversionResult.stats.height}
              </p>
            </div>
          </div>
        </div>

        {/* 转换后的图纸（大） */}
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

          {/* 图纸预览 - 占据主要空间 */}
          <button
            onClick={handleEnterEditor}
            className="relative w-full aspect-square rounded-xl overflow-hidden bg-gray-50 group cursor-pointer"
            style={{
              backgroundImage: `radial-gradient(circle, #E0E0E5 1px, transparent 1px)`,
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

          {/* 图纸统计信息 */}
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

        {/* 底部操作按钮 */}
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
      {/* Header */}
      <header className="bg-white border-b border-gray-100 sticky top-0 z-10">
        <div className="max-w-screen-xl mx-auto px-4 h-14 flex items-center justify-between">
          <button
            onClick={() => navigate(-1)}
            className="flex items-center gap-2 text-gray-600 hover:text-gray-900 transition-colors"
          >
            <ArrowLeft className="w-5 h-5" />
          </button>
          <h1 className="text-base font-medium text-[#1C1C1E]">图片转图纸</h1>
          <div className="w-5"></div>
        </div>
      </header>

      {/* Content */}
      <div className="max-w-screen-xl mx-auto px-4 py-6">
        {step === 'input' && (
          <div className="space-y-4">
            {renderParamsSection()}
            {renderUploadSection()}
          </div>
        )}
        {step === 'converting' && renderConverting()}
        {step === 'result' && renderResult()}
      </div>
    </div>
  );
}

