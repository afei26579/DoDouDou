# 拼豆豆助手 (Bead Helper)

一个帮助拼豆爱好者将图片转换为拼豆图稿的Web应用。

## 项目简介

拼豆豆助手是一个全栈Web应用，旨在简化拼豆创作流程。用户可以上传图片，系统会自动生成适合拼豆制作的三种方案（简单版、标准版、精细版），并提供跟做模式、编辑器等功能辅助完成作品。

### 核心功能

- 📷 **图片转换**: 上传图片自动生成拼豆方案
- 🎨 **三方案生成**: 简单版/标准版/精细版，适应不同需求
- ✏️ **图稿编辑器**: 手动微调图稿细节
- 📋 **跟做模式**: 按颜色/区域/行列引导制作
- 📚 **模板库**: 精选模板快速开始
- 💾 **作品管理**: 保存和管理创作作品

## 技术栈

### 后端
- **框架**: FastAPI (Python 3.11+)
- **数据库**: PostgreSQL + SQLAlchemy (异步)
- **缓存**: Redis
- **图像处理**: Pillow + NumPy + scikit-learn
- **认证**: JWT

### 前端
- **框架**: React 18 + TypeScript
- **构建工具**: Vite
- **样式**: Tailwind CSS
- **路由**: React Router v6
- **状态管理**: Zustand
- **HTTP客户端**: Axios + TanStack Query

## 项目结构

```
Dodoudou/
├── backend/              # 后端服务
│   ├── app/             # 应用代码
│   │   ├── api/         # API路由
│   │   ├── core/        # 核心模块
│   │   ├── models/      # 数据库模型
│   │   ├── schemas/     # Pydantic模型
│   │   ├── services/    # 业务逻辑
│   │   ├── engine/      # 转图引擎
│   │   └── db/          # 数据库配置
│   ├── tests/           # 测试
│   ├── venv/            # Python虚拟环境
│   └── requirements.txt # Python依赖
│
├── frontend/            # 前端应用
│   ├── src/
│   │   ├── api/         # API封装
│   │   ├── components/  # 组件
│   │   ├── pages/       # 页面
│   │   ├── stores/      # 状态管理
│   │   └── types/       # 类型定义
│   └── package.json     # Node依赖
│
├── docs/                # 文档
└── .MD/                 # 产品文档
```

## 快速开始

### 前置要求

- Python 3.11+
- Node.js 18+
- PostgreSQL 15+
- Redis 7+

### 后端设置

```bash
# 进入后端目录
cd backend

# 创建并激活虚拟环境
python -m venv venv
source venv/Scripts/activate  # Windows
# source venv/bin/activate    # Linux/Mac

# 安装依赖
pip install -r requirements.txt

# 配置环境变量
cp .env.example .env
# 编辑 .env 文件配置数据库等信息

# 运行数据库迁移
alembic upgrade head

# 启动开发服务器
uvicorn app.main:app --reload --host 0.0.0.0 --port 8000
```

访问 http://localhost:8000/docs 查看API文档

### 前端设置

```bash
# 进入前端目录
cd frontend

# 安装依赖
npm install

# 启动开发服务器
npm run dev
```

访问 http://localhost:5173

## 开发进度

### 第一阶段：技术架构搭建 ✅

- [x] 后端FastAPI项目结构
- [x] 数据库模型设计
- [x] 简化版转图引擎
- [x] 前端React项目结构
- [x] API客户端封装
- [ ] Docker开发环境

### 第二阶段：核心功能开发 (进行中)

- [ ] 图片上传和裁剪
- [ ] 三方案生成API
- [ ] 作品保存和管理
- [ ] 材料清单生成
- [ ] 图纸导出(PNG/PDF)

### 第三阶段：完整用户流程

- [ ] 跟做模式实现
- [ ] 编辑器功能
- [ ] 模板库
- [ ] 用户系统完善

## 转图引擎说明

当前实现的是简化版转图引擎，使用以下算法：

1. **像素化**: Pillow LANCZOS插值缩放
2. **减色**: K-means聚类算法
3. **色板匹配**: 欧氏距离最近邻匹配

后续将优化为：
- CIELAB色彩空间计算
- CIEDE2000色差公式
- 杂色清理和边缘优化

## 文档

- [技术方案文档](.MD/技术方案文档.md)
- [产品需求文档](.MD/拼豆豆PRD目录结构.md)
- [原型设计](.MD/原型设计.md)
- [后端README](backend/README.md)
- [前端README](frontend/README.md)

## 贡献

欢迎提交Issue和Pull Request！

## License

MIT

## 联系方式

如有问题或建议，请提交Issue。
