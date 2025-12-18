# Performance Techniques

This strategy is based on guidance from:

- [web.dev](https://web.dev/)
- [GoogleChrome Lighthouse](https://github.com/GoogleChrome/lighthouse)

---

## Goals

- **Perfect Lighthouse Scores**: 100% across all categories  
- **Core Web Vitals Optimized**:  
  - FCP: 1.4s  
  - LCP: 1.4s  
  - CLS: 0.003  
- **Async Font Loading**: Non-blocking web fonts  
- **Optimized Assets**: Minified CSS/JS with proper caching headers  
- **SEO Optimized**: Semantic HTML, meta tags, sitemap ready  

---

## Techniques

### 1. Core Web Vitals

- Optimize images with modern formats (WebP/AVIF).  
- Use responsive image sizes (`srcset`, `sizes`).  
- Preload critical resources (`<link rel="preload">`).  
- Reduce render-blocking scripts and styles.  
- Implement lazy loading for non-critical images and iframes.  

### 2. Fonts

- Use `font-display: swap` for async loading.  
- Preload critical font files.  
- Serve compressed font formats (WOFF2).  

### 3. Assets

- Minify CSS and JavaScript.  
- Bundle and tree-shake unused code.  
- Apply long-term caching headers.  
- Use HTTP/2 multiplexing for parallel requests.  

### 4. SEO

- Semantic HTML structure with headings and landmarks.  
- Unique, descriptive meta titles and descriptions.  
- XML sitemap submitted to Google Search Console.  
- Robots.txt configured correctly.  
- Structured data (schema.org) for rich results.  

---

## NGINX Configuration

```nginx
worker_processes auto;
error_log /var/log/nginx/error.log warn;
pid /var/run/nginx.pid;

events {
    worker_connections 1024;
}

http {
    include /etc/nginx/mime.types;
    default_type application/octet-stream;

    log_format main '$remote_addr - $remote_user [$time_local] "$request" '
                    '$status $body_bytes_sent "$http_referer" '
                    '"$http_user_agent" "$http_x_forwarded_for"';

    access_log /var/log/nginx/access.log main;

    sendfile on;
    tcp_nopush on;
    tcp_nodelay on;
    keepalive_timeout 65;
    types_hash_max_size 2048;
    client_max_body_size 20M;

    # Gzip compression
    gzip on;
    gzip_vary on;
    gzip_proxied any;
    gzip_comp_level 6;
    gzip_types text/plain text/css text/xml text/javascript 
               application/json application/javascript application/xml+rss 
               application/rss+xml font/truetype font/opentype 
               application/vnd.ms-fontobject image/svg+xml;

    # Cache control
    map $sent_http_content_type $expires {
        default                    off;
        text/html                  epoch;
        text/css                   max;
        application/javascript     max;
        ~image/                    max;
        ~font/                     max;
    }

    server {
        listen 80;
        server_name localhost;
        root /usr/share/nginx/html;
        index index.html;

        # Security headers
        add_header X-Frame-Options "SAMEORIGIN" always;
        add_header X-Content-Type-Options "nosniff" always;
        add_header X-XSS-Protection "1; mode=block" always;
        add_header Referrer-Policy "no-referrer-when-downgrade" always;

        # Enable expires
        expires $expires;

        # Handle HTML files
        location / {
            try_files $uri $uri/ $uri.html =404;
        }

        # Static assets with longer cache
        location ~* \.(css|js|jpg|jpeg|png|gif|ico|svg|woff|woff2|ttf|eot)$ {
            expires 1y;
            add_header Cache-Control "public, immutable";
        }

        # Health check endpoint
        location /health {
            access_log off;
            return 200 "healthy\n";
            add_header Content-Type text/plain;
        }

        # Custom 404 page (if it exists)
        error_page 404 /404.html;
        location = /404.html {
            internal;
        }

        # Deny access to hidden files
        location ~ /\. {
            deny all;
            access_log off;
            log_not_found off;
        }
    }
}
