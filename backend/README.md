# 拼豆豆助手 - 后端服务

基于FastAPI的拼豆豆助手后端API服务。

## 技术栈

- **Web框架**: FastAPI 0.110+
- **数据库**: PostgreSQL + SQLAlchemy (异步)
- **缓存**: Redis
- **认证**: JWT (python-jose)
- **图像处理**: Pillow + NumPy + scikit-learn
- **Python版本**: 3.11+

## 项目结构

```
backend/
├── app/
│   ├── api/v1/          # API路由
│   ├── core/            # 核心模块(认证、安全)
│   ├── models/          # 数据库模型
│   ├── schemas/         # Pydantic数据模型
│   ├── services/        # 业务逻辑层
│   ├── engine/          # 转图引擎(核心)
│   ├── utils/           # 工具函数
│   ├── db/              # 数据库配置
│   ├── config.py        # 配置管理
│   └── main.py          # 应用入口
├── tests/               # 测试
├── scripts/             # 脚本
├── docker/              # Docker配置
├── venv/                # Python虚拟环境
├── requirements.txt     # 依赖
└── .env.example         # 环境变量示例
```

## 快速开始

### 1. 创建虚拟环境并安装依赖

```bash
# Windows
cd backend
python -m venv venv
venv\Scripts\activate

# 安装依赖
pip install -r requirements.txt
```

### 2. 配置环境变量

```bash
# 复制环境变量示例文件
cp .env.example .env

# 编辑.env文件，配置数据库等信息
```

### 3. 初始化数据库

```bash
# 创建数据库迁移
alembic revision --autogenerate -m "Initial migration"

# 执行迁移
alembic upgrade head
```

### 4. 运行开发服务器

```bash
# 使用uvicorn运行
uvicorn app.main:app --reload --host 0.0.0.0 --port 8000
```

访问 http://localhost:8000/docs 查看API文档

## 核心功能模块

### 转图引擎 (简化版)

位于 `app/engine/` 目录，包含：

- **pixelizer.py**: 像素化处理
- **color_reducer.py**: K-means减色算法
- **palette_matcher.py**: 色板匹配(欧氏距离)
- **scheme_generator.py**: 三方案生成器

### API接口

- `/api/v1/auth/*` - 认证相关
- `/api/v1/users/*` - 用户管理
- `/api/v1/works/*` - 作品管理
- `/api/v1/convert/*` - 转图功能
- `/api/v1/templates/*` - 模板库
- `/api/v1/palettes/*` - 色板管理

## 开发说明

### 代码规范

```bash
# 格式化代码
black app/

# 代码检查
ruff check app/
```

### 运行测试

```bash
pytest tests/ -v
```

## 部署

### Docker部署

```bash
# 构建镜像
docker build -t bead-helper-api .

# 运行容器
docker run -p 8000:8000 bead-helper-api
```

### 使用Docker Compose

```bash
docker-compose up -d
```

## 环境变量说明

| 变量名 | 说明 | 默认值 |
|--------|------|--------|
| ENV | 环境 | development |
| DEBUG | 调试模式 | true |
| SECRET_KEY | JWT密钥 | - |
| DATABASE_URL | 数据库连接 | - |
| REDIS_URL | Redis连接 | - |
| CORS_ORIGINS | 允许的跨域源 | ["http://localhost:3000"] |

## License

MIT
