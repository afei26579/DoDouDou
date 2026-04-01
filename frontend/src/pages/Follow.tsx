import { useNavigate, useParams } from 'react-router-dom';
import { useState, useRef, useEffect } from 'react';
import { X, ZoomIn, ChevronLeft, ChevronRight, Check, Settings } from 'lucide-react';

interface BeadColor {
  id: string;
  name: string;
  rgb: string;
}

interface GridCell {
  colorId: string | null;
  completed: boolean;
}

type Strategy = 'block' | 'outline' | 'region' | 'color';

export default function Follow() {
  const navigate = useNavigate();
  const { id: _id } = useParams();

  // 跟做状态
  const [gridSize] = useState({ width: 29, height: 29 });
  const [grid, setGrid] = useState<GridCell[][]>([]);
  const [strategy, setStrategy] = useState<Strategy>('block');
  const [showSettings, setShowSettings] = useState(false);
  const [progress, setProgress] = useState(0);
  const [currentColor, setCurrentColor] = useState<string | null>(null);
  const [zoomLevel, setZoomLevel] = useState(1);
  const [showToolbar, setShowToolbar] = useState(true);

  const canvasRef = useRef<HTMLCanvasElement>(null);
  const containerRef = useRef<HTMLDivElement>(null);

  // 模拟豆豆颜色库
  const beadColors: BeadColor[] = [
    { id: 'C01', name: '纯白', rgb: '#FFFFFF' },
    { id: 'C05', name: '大红', rgb: '#FF0000' },
    { id: 'C06', name: '粉红', rgb: '#FFB3BA' },
    { id: 'C08', name: '黄色', rgb: '#FFFF00' },
    { id: 'C09', name: '浅绿', rgb: '#90EE90' },
    { id: 'C11', name: '天蓝', rgb: '#87CEEB' },
    { id: 'C13', name: '紫色', rgb: '#9370DB' },
    { id: 'C04', name: '纯黑', rgb: '#000000' }
  ];

  // 策略配置
  const strategies = [
    { id: 'block', name: '大块优先', desc: '先完成连续相同颜色的大块区域', icon: '🟦' },
    { id: 'outline', name: '轮廓优先', desc: '先完成图案边缘，再填充内部', icon: '⭕' },
    { id: 'region', name: '按区域优先', desc: '将图纸分为9宫格，逐个完成', icon: '📐' },
    { id: 'color', name: '按颜色优先', desc: '一次性完成所有同色豆豆', icon: '🎨' }
  ];

  // 初始化网格
  useEffect(() => {
    // TODO: 从API加载图纸数据
    const initialGrid: GridCell[][] = Array(gridSize.height)
      .fill(null)
      .map(() =>
        Array(gridSize.width)
          .fill(null)
          .map(() => ({ colorId: null, completed: false }))
      );

    // 模拟加载的图纸数据
    for (let y = 0; y < gridSize.height; y++) {
      for (let x = 0; x < gridSize.width; x++) {
        if (Math.random() > 0.3) {
          initialGrid[y][x].colorId = beadColors[Math.floor(Math.random() * beadColors.length)].id;
        }
      }
    }

    setGrid(initialGrid);
    setCurrentColor(beadColors[0].id);
  }, []);

  // 计算进度
  useEffect(() => {
    if (grid.length === 0) return;

    const totalCells = gridSize.width * gridSize.height;
    const completedCells = grid.flat().filter(cell => cell.completed).length;
    setProgress(Math.round((completedCells / totalCells) * 100));
  }, [grid, gridSize]);

  // 渲染画布
  useEffect(() => {
    if (!canvasRef.current || grid.length === 0) return;

    const canvas = canvasRef.current;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    const cellSize = (canvas.width / gridSize.width) * zoomLevel;

    ctx.clearRect(0, 0, canvas.width, canvas.height);

    // 绘制网格
    for (let y = 0; y < gridSize.height; y++) {
      for (let x = 0; x < gridSize.width; x++) {
        const cell = grid[y][x];
        const color = beadColors.find(c => c.id === cell.colorId);

        // 绘制单元格背景
        if (cell.completed) {
          ctx.fillStyle = color ? color.rgb : '#F5F5F7';
          ctx.globalAlpha = 0.5;
        } else {
          ctx.fillStyle = color ? color.rgb : '#F5F5F7';
          ctx.globalAlpha = 1;
        }
        ctx.fillRect(x * cellSize, y * cellSize, cellSize, cellSize);
        ctx.globalAlpha = 1;

        // 高亮当前颜色
        if (!cell.completed && cell.colorId === currentColor) {
          ctx.strokeStyle = '#FFD700';
          ctx.lineWidth = 3;
          ctx.strokeRect(x * cellSize, y * cellSize, cellSize, cellSize);
        }

        // 绘制网格线
        ctx.strokeStyle = '#E0E0E0';
        ctx.lineWidth = 0.5;
        ctx.strokeRect(x * cellSize, y * cellSize, cellSize, cellSize);

        // 已完成标记
        if (cell.completed) {
          ctx.fillStyle = '#4CAF50';
          ctx.beginPath();
          ctx.arc(
            x * cellSize + cellSize / 2,
            y * cellSize + cellSize / 2,
            cellSize / 4,
            0,
            Math.PI * 2
          );
          ctx.fill();
        }
      }
    }
  }, [grid, gridSize, beadColors, currentColor, zoomLevel]);

  const handleCellClick = (e: React.MouseEvent<HTMLCanvasElement>) => {
    if (!canvasRef.current) return;

    const canvas = canvasRef.current;
    const rect = canvas.getBoundingClientRect();
    const x = Math.floor(((e.clientX - rect.left) / rect.width) * gridSize.width);
    const y = Math.floor(((e.clientY - rect.top) / rect.height) * gridSize.height);

    if (x >= 0 && x < gridSize.width && y >= 0 && y < gridSize.height) {
      const newGrid = grid.map(row => row.map(cell => ({ ...cell })));
      newGrid[y][x].completed = !newGrid[y][x].completed;
      setGrid(newGrid);
    }
  };

  const handleNextColor = () => {
    const currentIndex = beadColors.findIndex(c => c.id === currentColor);
    const nextIndex = (currentIndex + 1) % beadColors.length;
    setCurrentColor(beadColors[nextIndex].id);
  };

  const handlePrevColor = () => {
    const currentIndex = beadColors.findIndex(c => c.id === currentColor);
    const prevIndex = (currentIndex - 1 + beadColors.length) % beadColors.length;
    setCurrentColor(beadColors[prevIndex].id);
  };

  const handleZoomIn = () => {
    setZoomLevel(Math.min(zoomLevel + 0.5, 3));
  };

  const handleZoomOut = () => {
    setZoomLevel(Math.max(zoomLevel - 0.5, 0.5));
  };

  const getCurrentColorCount = () => {
    return grid.flat().filter(cell => cell.colorId === currentColor && !cell.completed).length;
  };

  return (
    <div className="fixed inset-0 bg-black flex flex-col">
      {/* Header - 可隐藏 */}
      {showToolbar && (
        <header className="bg-black/80 backdrop-blur-sm border-b border-gray-800">
          <div className="px-4 h-14 flex items-center justify-between">
            <button
              onClick={() => navigate(-1)}
              className="p-2 hover:bg-gray-800 rounded-lg transition-colors"
            >
              <X className="w-5 h-5 text-white" />
            </button>
            <div className="flex items-center gap-4">
              <div className="text-white text-sm">
                进度: {progress}%
              </div>
              <button
                onClick={() => setShowSettings(true)}
                className="p-2 hover:bg-gray-800 rounded-lg transition-colors"
              >
                <Settings className="w-5 h-5 text-white" />
              </button>
            </div>
          </div>
        </header>
      )}

      {/* Canvas Area */}
      <div
        ref={containerRef}
        className="flex-1 flex items-center justify-center overflow-auto"
        onClick={() => setShowToolbar(!showToolbar)}
      >
        <canvas
          ref={canvasRef}
          width={1200}
          height={1200}
          onClick={handleCellClick}
          className="cursor-pointer"
          style={{ imageRendering: 'pixelated' }}
        />
      </div>

      {/* Bottom Toolbar - 可隐藏 */}
      {showToolbar && (
        <div className="bg-black/80 backdrop-blur-sm border-t border-gray-800 p-4">
          <div className="max-w-screen-xl mx-auto space-y-4">
            {/* 当前颜色信息 */}
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-3">
                <div
                  className="w-12 h-12 rounded-xl border-2 border-white"
                  style={{ backgroundColor: beadColors.find(c => c.id === currentColor)?.rgb }}
                />
                <div className="text-white">
                  <p className="text-sm font-medium">
                    {beadColors.find(c => c.id === currentColor)?.name}
                  </p>
                  <p className="text-xs text-gray-400">
                    剩余 {getCurrentColorCount()} 颗
                  </p>
                </div>
              </div>

              {/* 颜色切换 */}
              <div className="flex items-center gap-2">
                <button
                  onClick={handlePrevColor}
                  className="p-2 bg-gray-800 hover:bg-gray-700 rounded-lg transition-colors"
                >
                  <ChevronLeft className="w-5 h-5 text-white" />
                </button>
                <button
                  onClick={handleNextColor}
                  className="p-2 bg-gray-800 hover:bg-gray-700 rounded-lg transition-colors"
                >
                  <ChevronRight className="w-5 h-5 text-white" />
                </button>
              </div>
            </div>

            {/* 缩放控制 */}
            <div className="flex items-center justify-center gap-4">
              <button
                onClick={handleZoomOut}
                className="px-4 py-2 bg-gray-800 hover:bg-gray-700 rounded-lg text-white text-sm transition-colors"
              >
                缩小
              </button>
              <span className="text-white text-sm">{Math.round(zoomLevel * 100)}%</span>
              <button
                onClick={handleZoomIn}
                className="px-4 py-2 bg-gray-800 hover:bg-gray-700 rounded-lg text-white text-sm transition-colors"
              >
                <ZoomIn className="w-4 h-4 inline mr-1" />
                放大
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Settings Modal */}
      {showSettings && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/80">
          <div className="bg-white rounded-3xl p-6 max-w-md w-full mx-4">
            <div className="flex items-center justify-between mb-6">
              <h3 className="text-lg font-semibold text-[#1C1C1E]">拼图策略</h3>
              <button
                onClick={() => setShowSettings(false)}
                className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
              >
                <X className="w-5 h-5 text-gray-600" />
              </button>
            </div>

            <div className="space-y-3">
              {strategies.map((s) => (
                <button
                  key={s.id}
                  onClick={() => {
                    setStrategy(s.id as Strategy);
                    setShowSettings(false);
                  }}
                  className={`w-full p-4 rounded-xl border-2 transition-all text-left ${
                    strategy === s.id
                      ? 'border-[#1C1C1E] bg-gray-50'
                      : 'border-gray-100 hover:border-gray-200'
                  }`}
                >
                  <div className="flex items-start gap-3">
                    <span className="text-2xl">{s.icon}</span>
                    <div className="flex-1">
                      <div className="flex items-center gap-2 mb-1">
                        <span className="font-medium text-[#1C1C1E]">{s.name}</span>
                        {strategy === s.id && (
                          <Check className="w-4 h-4 text-[#1C1C1E]" />
                        )}
                      </div>
                      <p className="text-sm text-gray-600">{s.desc}</p>
                    </div>
                  </div>
                </button>
              ))}
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
