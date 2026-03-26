# 拼豆豆助手 - 快速启动指南

## 第一阶段技术架构已完成 ✅

已完成的工作：

1. ✅ 后端FastAPI项目结构（使用Python虚拟环境）
2. ✅ 数据库模型设计（PostgreSQL + SQLAlchemy异步）
3. ✅ 简化版转图引擎（像素化 + K-means减色 + 色板匹配）
4. ✅ 前端React项目结构（TypeScript + Vite + Tailwind CSS）
5. ✅ API客户端封装
6. ✅ Docker开发环境配置

## 项目结构概览

```
Dodoudou/
├── backend/              # 后端服务 (FastAPI + Python 3.11)
│   ├── app/
│   │   ├── api/v1/      # API路由
│   │   ├── core/        # 认证和安全
│   │   ├── models/      # 数据库模型 (User, Work, Template, Palette)
│   │   ├── schemas/     # Pydantic数据验证
│   │   ├── engine/      # 转图引擎 (简化版)
│   │   └── db/          # 数据库配置
│   ├── venv/            # Python虚拟环境
│   └── requirements.txt
│
├── frontend/            # 前端应用 (React 18 + TypeScript)
│   ├── src/
│   │   ├── api/         # API客户端
│   │   ├── pages/       # 页面组件
│   │   ├── types/       # TypeScript类型
│   │   └── config/      # 配置文件
│   └── package.json
│
└── docker-compose.dev.yml  # Docker开发环境
```

## 快速启动

### 方式一：使用启动脚本（Windows，最简单）

#### 后端启动

```bash
# 1. 进入后端目录
cd backend

# 2. 首次运行：执行设置脚本（安装依赖）
setup.bat

# 3. 启动开发服务器
start.bat
```

#### 前端启动

```bash
# 1. 进入前端目录
cd frontend

# 2. 首次运行：安装依赖
npm install

# 3. 启动开发服务器
start.bat
```

### 方式二：手动启动（跨平台）

#### 后端启动

```bash
# 1. 进入后端目录
cd backend

# 2. 激活虚拟环境
# Windows:
venv\Scripts\activate
# Linux/Mac:
source venv/bin/activate

# 3. 安装依赖（如果还没安装）
pip install -r requirements.txt

# 4. 配置环境变量
cp .env.example .env
# 编辑 .env 文件，配置数据库连接等

# 5. 启动开发服务器
uvicorn app.main:app --reload --host 0.0.0.0 --port 8000
```

访问：
- API文档: http://localhost:8000/docs
- 健康检查: http://localhost:8000/health

#### 前端启动

```bash
# 1. 进入前端目录
cd frontend

# 2. 安装依赖（如果还没安装）
npm install

# 3. 启动开发服务器
npm run dev
```

访问: http://localhost:5173

### 方式二：Docker开发环境

```bash
# 启动所有服务（数据库、Redis、后端、前端）
docker-compose -f docker-compose.dev.yml up -d

# 查看日志
docker-compose -f docker-compose.dev.yml logs -f

# 停止服务
docker-compose -f docker-compose.dev.yml down
```

访问：
- 前端: http://localhost:5173
- 后端API: http://localhost:8000
- API文档: http://localhost:8000/docs

## 数据库设置

### 本地PostgreSQL

```bash
# 创建数据库
createdb beadhelper

# 运行迁移
cd backend
alembic upgrade head
```

### Docker PostgreSQL

Docker Compose会自动创建数据库，无需手动操作。

## 核心功能说明

### 转图引擎（简化版）

位于 `backend/app/engine/`：

1. **pixelizer.py**: 像素化处理（Pillow LANCZOS缩放）
2. **color_reducer.py**: K-means减色算法
3. **palette_matcher.py**: 欧氏距离色板匹配
4. **scheme_generator.py**: 三方案生成器

### API接口

- `GET /api/v1/ping` - 健康检查
- `POST /api/v1/auth/login` - 用户登录
- `POST /api/v1/auth/register` - 用户注册
- `POST /api/v1/convert/generate` - 生成转图方案
- `GET /api/v1/works` - 获取作品列表
- `GET /api/v1/templates` - 获取模板列表
- `GET /api/v1/palettes` - 获取色板列表

## 下一步开发计划

### 第二阶段：核心功能开发

1. **图片上传和裁剪**
   - 实现文件上传API
   - 前端图片裁剪组件
   - OSS存储集成

2. **三方案生成完整流程**
   - 完善转图API
   - 方案预览生成
   - 前端方案选择页面

3. **作品管理**
   - 作品CRUD API
   - 作品列表和详情页面
   - 本地存储和同步

4. **材料清单**
   - 颜色统计算法
   - 材料清单生成
   - 导出功能

5. **图纸导出**
   - PNG图片导出
   - PDF打印图纸生成
   - 水印处理

### 第三阶段：完整用户体验

1. 跟做模式实现
2. 图稿编辑器
3. 模板库管理
4. 用户认证和权限
5. 付费功能

## 开发建议

### 后端开发

1. 先完成核心API接口
2. 编写单元测试
3. 优化转图引擎算法
4. 添加错误处理和日志

### 前端开发

1. 完善页面组件
2. 实现状态管理（Zustand）
3. 添加加载和错误状态
4. 响应式布局优化

## 常见问题

### Q: 虚拟环境激活失败？
A: Windows需要执行 `venv\Scripts\activate`，Linux/Mac执行 `source venv/bin/activate`

### Q: 端口被占用？
A: 修改 `docker-compose.dev.yml` 中的端口映射，或停止占用端口的进程

### Q: 数据库连接失败？
A: 检查 `.env` 文件中的 `DATABASE_URL` 配置是否正确

### Q: npm install 失败？
A: 尝试清除缓存 `npm cache clean --force` 后重新安装

## 技术支持

如有问题，请查看：
- [技术方案文档](.MD/技术方案文档.md)
- [后端README](backend/README.md)
- [前端README](frontend/README.md)

或提交Issue到项目仓库。
