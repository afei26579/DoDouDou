import { useNavigate, useParams } from 'react-router-dom';
import { useState, useRef, useEffect } from 'react';
import { ArrowLeft, Save, Play, Palette, Paintbrush, Eraser, Undo, Redo, Download } from 'lucide-react';

interface BeadColor {
  id: string;
  name: string;
  rgb: string;
}

interface GridCell {
  colorId: string | null;
}

export default function Editor() {
  const navigate = useNavigate();
  const { id } = useParams();

  // 编辑器状态
  const [gridSize] = useState({ width: 29, height: 29 });
  const [grid, setGrid] = useState<GridCell[][]>([]);
  const [selectedTool, setSelectedTool] = useState<'brush' | 'eraser'>('brush');
  const [selectedColor, setSelectedColor] = useState<string | null>(null);
  const [history, setHistory] = useState<GridCell[][][]>([]);
  const [historyIndex, setHistoryIndex] = useState(-1);

  const canvasRef = useRef<HTMLCanvasElement>(null);

  // 模拟豆豆颜色库
  const beadColors: BeadColor[] = [
    { id: 'C01', name: '纯白', rgb: '#FFFFFF' },
    { id: 'C02', name: '浅灰', rgb: '#E0E0E0' },
    { id: 'C03', name: '深灰', rgb: '#808080' },
    { id: 'C04', name: '纯黑', rgb: '#000000' },
    { id: 'C05', name: '大红', rgb: '#FF0000' },
    { id: 'C06', name: '粉红', rgb: '#FFB3BA' },
    { id: 'C07', name: '橙色', rgb: '#FFA500' },
    { id: 'C08', name: '黄色', rgb: '#FFFF00' },
    { id: 'C09', name: '浅绿', rgb: '#90EE90' },
    { id: 'C10', name: '深绿', rgb: '#228B22' },
    { id: 'C11', name: '天蓝', rgb: '#87CEEB' },
    { id: 'C12', name: '深蓝', rgb: '#0000CD' },
    { id: 'C13', name: '紫色', rgb: '#9370DB' },
    { id: 'C14', name: '棕色', rgb: '#8B4513' },
    { id: 'C15', name: '米色', rgb: '#F5DEB3' }
  ];

  // 初始化网格
  useEffect(() => {
    // TODO: 从API加载图纸数据
    const initialGrid: GridCell[][] = Array(gridSize.height)
      .fill(null)
      .map(() =>
        Array(gridSize.width)
          .fill(null)
          .map(() => ({ colorId: null }))
      );

    // 模拟加载的图纸数据
    for (let y = 0; y < gridSize.height; y++) {
      for (let x = 0; x < gridSize.width; x++) {
        if (Math.random() > 0.7) {
          initialGrid[y][x].colorId = beadColors[Math.floor(Math.random() * beadColors.length)].id;
        }
      }
    }

    setGrid(initialGrid);
    setHistory([initialGrid]);
    setHistoryIndex(0);
    setSelectedColor(beadColors[0].id);
  }, []);

  // 渲染画布
  useEffect(() => {
    if (!canvasRef.current || grid.length === 0) return;

    const canvas = canvasRef.current;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    const cellSize = Math.min(
      canvas.width / gridSize.width,
      canvas.height / gridSize.height
    );

    ctx.clearRect(0, 0, canvas.width, canvas.height);

    // 绘制网格
    for (let y = 0; y < gridSize.height; y++) {
      for (let x = 0; x < gridSize.width; x++) {
        const cell = grid[y][x];
        const color = beadColors.find(c => c.id === cell.colorId);

        // 绘制单元格背景
        ctx.fillStyle = color ? color.rgb : '#F5F5F7';
        ctx.fillRect(x * cellSize, y * cellSize, cellSize, cellSize);

        // 绘制网格线
        ctx.strokeStyle = '#E0E0E0';
        ctx.lineWidth = 0.5;
        ctx.strokeRect(x * cellSize, y * cellSize, cellSize, cellSize);
      }
    }
  }, [grid, gridSize, beadColors]);

  const handleCanvasClick = (e: React.MouseEvent<HTMLCanvasElement>) => {
    if (!canvasRef.current) return;

    const canvas = canvasRef.current;
    const rect = canvas.getBoundingClientRect();
    const x = Math.floor(((e.clientX - rect.left) / rect.width) * gridSize.width);
    const y = Math.floor(((e.clientY - rect.top) / rect.height) * gridSize.height);

    if (x >= 0 && x < gridSize.width && y >= 0 && y < gridSize.height) {
      const newGrid = grid.map(row => row.map(cell => ({ ...cell })));

      if (selectedTool === 'brush' && selectedColor) {
        newGrid[y][x].colorId = selectedColor;
      } else if (selectedTool === 'eraser') {
        newGrid[y][x].colorId = null;
      }

      // 添加到历史记录
      const newHistory = history.slice(0, historyIndex + 1);
      newHistory.push(newGrid);
      setHistory(newHistory);
      setHistoryIndex(newHistory.length - 1);

      setGrid(newGrid);
    }
  };

  const handleUndo = () => {
    if (historyIndex > 0) {
      setHistoryIndex(historyIndex - 1);
      setGrid(history[historyIndex - 1]);
    }
  };

  const handleRedo = () => {
    if (historyIndex < history.length - 1) {
      setHistoryIndex(historyIndex + 1);
      setGrid(history[historyIndex + 1]);
    }
  };

  const handleBatchColorChange = () => {
    // TODO: 实现批量换色功能
    alert('批量换色功能开发中');
  };

  const handleSave = () => {
    // TODO: 保存到后端
    alert('保存成功！');
  };

  const handleStartFollow = () => {
    navigate(`/follow/${id || 'new'}`);
  };

  const handleExport = () => {
    // TODO: 导出图纸
    alert('导出功能开发中');
  };

  return (
    <div className="min-h-screen bg-[#F5F5F7] flex flex-col">
      {/* Header */}
      <header className="bg-white border-b border-gray-100 sticky top-0 z-10">
        <div className="max-w-screen-xl mx-auto px-4 h-14 flex items-center justify-between">
          <button
            onClick={() => navigate(-1)}
            className="flex items-center gap-2 text-gray-600 hover:text-gray-900 transition-colors"
          >
            <ArrowLeft className="w-5 h-5" />
          </button>
          <h1 className="text-base font-medium text-[#1C1C1E]">编辑图纸</h1>
          <div className="flex items-center gap-2">
            <button
              onClick={handleSave}
              className="p-2 hover:bg-gray-50 rounded-lg transition-colors"
            >
              <Save className="w-5 h-5 text-gray-600" />
            </button>
            <button
              onClick={handleExport}
              className="p-2 hover:bg-gray-50 rounded-lg transition-colors"
            >
              <Download className="w-5 h-5 text-gray-600" />
            </button>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <div className="flex-1 flex flex-col lg:flex-row">
        {/* Canvas Area */}
        <div className="flex-1 p-4 flex items-center justify-center">
          <div className="bg-white rounded-2xl p-4 shadow-lg">
            <canvas
              ref={canvasRef}
              width={800}
              height={800}
              onClick={handleCanvasClick}
              className="cursor-crosshair max-w-full h-auto"
              style={{ imageRendering: 'pixelated' }}
            />
            <div className="mt-4 text-center text-sm text-gray-400">
              {gridSize.width} × {gridSize.height} 格
            </div>
          </div>
        </div>

        {/* Toolbar */}
        <div className="w-full lg:w-80 bg-white border-t lg:border-t-0 lg:border-l border-gray-100 p-4 space-y-4">
          {/* Tools */}
          <div className="space-y-3">
            <h3 className="text-sm font-medium text-[#1C1C1E]">工具</h3>
            <div className="grid grid-cols-2 gap-2">
              <button
                onClick={() => setSelectedTool('brush')}
                className={`p-3 rounded-xl border-2 transition-all flex items-center justify-center gap-2 ${
                  selectedTool === 'brush'
                    ? 'border-[#1C1C1E] bg-gray-50'
                    : 'border-gray-100 hover:border-gray-200'
                }`}
              >
                <Paintbrush className="w-5 h-5" />
                <span className="text-sm">画笔</span>
              </button>
              <button
                onClick={() => setSelectedTool('eraser')}
                className={`p-3 rounded-xl border-2 transition-all flex items-center justify-center gap-2 ${
                  selectedTool === 'eraser'
                    ? 'border-[#1C1C1E] bg-gray-50'
                    : 'border-gray-100 hover:border-gray-200'
                }`}
              >
                <Eraser className="w-5 h-5" />
                <span className="text-sm">橡皮擦</span>
              </button>
            </div>
          </div>

          {/* History */}
          <div className="space-y-3">
            <h3 className="text-sm font-medium text-[#1C1C1E]">历史</h3>
            <div className="flex gap-2">
              <button
                onClick={handleUndo}
                disabled={historyIndex <= 0}
                className="flex-1 p-3 rounded-xl border border-gray-100 hover:border-gray-200 transition-all disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
              >
                <Undo className="w-5 h-5" />
                <span className="text-sm">撤销</span>
              </button>
              <button
                onClick={handleRedo}
                disabled={historyIndex >= history.length - 1}
                className="flex-1 p-3 rounded-xl border border-gray-100 hover:border-gray-200 transition-all disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
              >
                <Redo className="w-5 h-5" />
                <span className="text-sm">重做</span>
              </button>
            </div>
          </div>

          {/* Color Picker */}
          <div className="space-y-3">
            <div className="flex items-center justify-between">
              <h3 className="text-sm font-medium text-[#1C1C1E]">颜色</h3>
              <button
                onClick={handleBatchColorChange}
                className="text-xs text-gray-600 hover:text-gray-900 transition-colors flex items-center gap-1"
              >
                <Palette className="w-4 h-4" />
                批量换色
              </button>
            </div>
            <div className="grid grid-cols-5 gap-2">
              {beadColors.map((color) => (
                <button
                  key={color.id}
                  onClick={() => setSelectedColor(color.id)}
                  className={`aspect-square rounded-lg border-2 transition-all ${
                    selectedColor === color.id
                      ? 'border-[#1C1C1E] scale-110'
                      : 'border-gray-200 hover:border-gray-300'
                  }`}
                  style={{ backgroundColor: color.rgb }}
                  title={color.name}
                />
              ))}
            </div>
          </div>

          {/* Actions */}
          <div className="space-y-2 pt-4 border-t border-gray-100">
            <button
              onClick={handleStartFollow}
              className="w-full py-3 bg-[#1C1C1E] text-white rounded-xl font-medium hover:bg-gray-800 transition-colors flex items-center justify-center gap-2"
            >
              <Play className="w-5 h-5" />
              开始跟做
            </button>
            <button
              onClick={handleSave}
              className="w-full py-3 border border-gray-200 text-[#1C1C1E] rounded-xl font-medium hover:bg-gray-50 transition-colors"
            >
              保存图纸
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
