"""Redis cache client"""
from typing import Optional, Any
import json
import redis.asyncio as redis
from app.config import settings


class RedisCache:
    def __init__(self):
        self.redis: Optional[redis.Redis] = None

    async def connect(self):
        """Connect to Redis"""
        self.redis = await redis.from_url(
            settings.REDIS_URL,
            encoding="utf-8",
            decode_responses=False  # 支持二进制数据
        )

    async def disconnect(self):
        """Disconnect from Redis"""
        if self.redis:
            await self.redis.close()

    async def get(self, key: str) -> Optional[Any]:
        """Get value from cache"""
        if not self.redis:
            return None
        value = await self.redis.get(key)
        if value:
            # 尝试解码为 JSON
            if isinstance(value, bytes):
                try:
                    return json.loads(value.decode('utf-8'))
                except (json.JSONDecodeError, UnicodeDecodeError):
                    return value  # 返回原始字节
            return value
        return None

    async def set(
        self,
        key: str,
        value: Any,
        expire: Optional[int] = None
    ) -> bool:
        """Set value in cache with optional expiration (seconds)"""
        if not self.redis:
            return False
        if isinstance(value, (dict, list)):
            value = json.dumps(value).encode('utf-8')
        elif isinstance(value, str):
            value = value.encode('utf-8')
        # bytes 类型直接存储
        return await self.redis.set(key, value, ex=expire)

    async def delete(self, key: str) -> bool:
        """Delete key from cache"""
        if not self.redis:
            return False
        return await self.redis.delete(key) > 0

    async def exists(self, key: str) -> bool:
        """Check if key exists"""
        if not self.redis:
            return False
        return await self.redis.exists(key) > 0

    async def increment(self, key: str, amount: int = 1) -> int:
        """Increment counter"""
        if not self.redis:
            return 0
        return await self.redis.incrby(key, amount)

    async def expire(self, key: str, seconds: int) -> bool:
        """Set expiration on key"""
        if not self.redis:
            return False
        return await self.redis.expire(key, seconds)


# Global cache instance
cache_client = RedisCache()


async def get_cache() -> RedisCache:
    """Dependency to get cache instance"""
    return cache_client
