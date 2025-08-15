# Deployment Guide

Подробное руководство по развертыванию корпоративного сайта "Бухта пеликанов" в различных окружениях.

## 🚀 Production Deployment

### Vercel (Рекомендуемый)

1. **Подготовка базы данных**
   ```bash
   # Создайте PostgreSQL базу (например, на Neon, Supabase, или AWS RDS)
   # Получите CONNECTION_STRING
   ```

2. **Настройка переменных окружения в Vercel**
   ```env
   DATABASE_URL=postgresql://username:password@host:port/database
   NEXTAUTH_SECRET=your-secret-key-here
   NEXTAUTH_URL=https://your-domain.vercel.app
   NEXT_PUBLIC_SOCKET_URL=https://your-domain.vercel.app
   NODE_ENV=production
   ```

3. **Деплой через GitHub**
   ```bash
   # Подключите репозиторий к Vercel
   # Автоматический деплой на каждый push в main
   ```

4. **Миграции базы данных**
   ```bash
   # Выполняется автоматически в Build Command
   npx prisma migrate deploy
   npx prisma db seed
   ```

### Docker (Self-hosted)

1. **Production Docker Compose**
   ```yaml
   # docker-compose.prod.yml
   version: '3.8'
   
   services:
     app:
       build:
         context: .
         dockerfile: Dockerfile
       ports:
         - "3000:3000"
       environment:
         - DATABASE_URL=postgresql://postgres:postgres@db:5432/pelicanbay
         - NODE_ENV=production
       depends_on:
         - db
         - redis
   
     db:
       image: postgres:17-alpine
       environment:
         POSTGRES_DB: pelicanbay
         POSTGRES_USER: postgres
         POSTGRES_PASSWORD: your-secure-password
       volumes:
         - postgres_data:/var/lib/postgresql/data
         - ./backups:/backups
       ports:
         - "5432:5432"
   
     redis:
       image: redis:7-alpine
       ports:
         - "6379:6379"
   
     nginx:
       image: nginx:alpine
       ports:
         - "80:80"
         - "443:443"
       volumes:
         - ./nginx.conf:/etc/nginx/nginx.conf
         - ./ssl:/etc/ssl/certs
   
   volumes:
     postgres_data:
   ```

2. **Сборка и запуск**
   ```bash
   # Сборка production образа
   docker build -t pelicanbay-app .
   
   # Запуск production стека
   docker-compose -f docker-compose.prod.yml up -d
   
   # Проверка логов
   docker-compose logs -f app
   ```

## 🛠️ Environment Setup

### Переменные окружения

Создайте `.env.production`:

```env
# Database
DATABASE_URL="postgresql://user:password@host:port/database"

# Next.js
NODE_ENV=production
PORT=3000
NEXTAUTH_SECRET="your-super-secret-key-here"
NEXTAUTH_URL="https://your-domain.com"

# Socket.IO
NEXT_PUBLIC_SOCKET_URL="https://your-domain.com"

# Media uploads
UPLOAD_MAX_SIZE_MB=50
UPLOAD_DIR="./uploads"

# Email (optional)
SMTP_HOST="smtp.gmail.com"
SMTP_PORT=587
SMTP_USER="your-email@gmail.com"
SMTP_PASS="your-app-password"

# Monitoring (optional)
PROMETHEUS_PORT=9090
LOKI_URL="http://localhost:3100"
```

### SSL/TLS Настройка

```nginx
# nginx.conf
server {
    listen 80;
    server_name your-domain.com;
    return 301 https://$server_name$request_uri;
}

server {
    listen 443 ssl http2;
    server_name your-domain.com;
    
    ssl_certificate /etc/ssl/certs/your-domain.crt;
    ssl_certificate_key /etc/ssl/private/your-domain.key;
    
    location / {
        proxy_pass http://app:3000;
        proxy_http_version 1.1;
        proxy_set_header Upgrade $http_upgrade;
        proxy_set_header Connection 'upgrade';
        proxy_set_header Host $host;
        proxy_set_header X-Real-IP $remote_addr;
        proxy_set_header X-Forwarded-For $proxy_add_x_forwarded_for;
        proxy_set_header X-Forwarded-Proto $scheme;
        proxy_cache_bypass $http_upgrade;
    }
    
    # Socket.IO
    location /socket.io/ {
        proxy_pass http://app:3000;
        proxy_http_version 1.1;
        proxy_set_header Upgrade $http_upgrade;
        proxy_set_header Connection "upgrade";
        proxy_set_header Host $host;
        proxy_set_header X-Real-IP $remote_addr;
        proxy_set_header X-Forwarded-For $proxy_add_x_forwarded_for;
        proxy_set_header X-Forwarded-Proto $scheme;
    }
}
```

## 📊 Monitoring & Observability

### Prometheus + Grafana

```bash
# Запуск мониторинга
docker-compose -f docker-compose.monitoring.yml up -d

# Доступ к дашбордам
# Grafana: http://localhost:3001 (admin/admin)
# Prometheus: http://localhost:9090
```

### Backup Strategy

```bash
#!/bin/bash
# backup.sh

# Database backup
docker exec pelicanbay-db pg_dump -U postgres pelicanbay > backup_$(date +%Y%m%d_%H%M%S).sql

# Media files backup
tar -czf media_backup_$(date +%Y%m%d_%H%M%S).tar.gz ./uploads

# Retention policy (keep last 30 days)
find ./backups -name "backup_*.sql" -mtime +30 -delete
find ./backups -name "media_backup_*.tar.gz" -mtime +30 -delete
```

## 🚨 Troubleshooting

### Частые проблемы

1. **Database connection issues**
   ```bash
   # Проверка подключения
   docker exec -it pelicanbay-db psql -U postgres -d pelicanbay
   
   # Проверка миграций
   npx prisma migrate status
   ```

2. **Socket.IO не работает**
   ```bash
   # Проверить настройки CORS в socket сервере
   # Убедиться что WebSocket проксируется правильно в nginx
   ```

3. **File upload errors**
   ```bash
   # Проверить права доступа к папке uploads
   chmod 755 ./uploads
   chown -R node:node ./uploads
   ```

4. **High memory usage**
   ```bash
   # Мониторинг ресурсов
   docker stats pelicanbay-app
   
   # Настройка limits в docker-compose
   deploy:
     resources:
       limits:
         memory: 1G
         cpus: '0.5'
   ```

### Логи и диагностика

```bash
# Логи приложения
docker-compose logs -f app

# Логи базы данных
docker-compose logs -f db

# System metrics
curl http://localhost:3000/api/metrics

# Health check
curl http://localhost:3000/api/health
```

## 🔄 CI/CD Pipeline

### GitHub Actions

Автоматический workflow уже настроен в `.github/workflows/ci.yml`:

1. **Тестирование** на каждый PR
2. **Деплой** на push в `main`
3. **Rollback** при необходимости

### Manual Deploy Commands

```bash
# Production build
npm run build

# Database migrations
npx prisma migrate deploy

# Start production server
npm start
```

## 🔒 Security Checklist

- [ ] SSL/TLS сертификаты настроены
- [ ] Firewall правила применены
- [ ] Database пароли изменены
- [ ] NEXTAUTH_SECRET установлен
- [ ] Rate limiting настроен
- [ ] File upload ограничения применены
- [ ] CORS настроен правильно
- [ ] Headers безопасности добавлены

## 📈 Performance Optimization

1. **Database**
   - Индексы на часто запрашиваемые поля
   - Connection pooling
   - Read replicas для высоких нагрузок

2. **CDN**
   - Cloudflare или AWS CloudFront для статических файлов
   - Image optimization с Next.js

3. **Caching**
   - Redis для session storage
   - ISR для статических страниц
   - API response caching

4. **Load Balancing**
   - Multiple app instances за nginx
   - Health checks
   - Auto-scaling по метрикам
