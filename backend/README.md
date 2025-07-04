# MixFade Landing Backend

Backend API for MixFade landing page email collection and download gating with Shopify integration.

## 🚀 Features

- **Email Collection**: Collect emails for download gating
- **Shopify Integration**: Automatically add emails to Shopify customer list
- **Download Tracking**: Track download events for analytics
- **Rate Limiting**: Prevent abuse with configurable rate limits
- **Security**: CORS, Helmet, and validation middleware

## 📋 Prerequisites

- Node.js 18+ 
- npm or yarn
- Shopify store with Admin API access

## 🔧 Local Development Setup

1. **Install dependencies**
   ```bash
   cd backend
   npm install
   ```

2. **Environment Setup**
   ```bash
   # Copy environment template
   cp .env.example .env
   
   # Edit .env with your values
   nano .env
   ```

3. **Required Environment Variables**
   ```env
   # Server
   PORT=3001
   NODE_ENV=development
   
   # Shopify (Required for email integration)
   SHOPIFY_SHOP_DOMAIN=your-shop.myshopify.com
   SHOPIFY_ACCESS_TOKEN=your-shopify-access-token
   
   # CORS
   CORS_ORIGINS=http://localhost:5173,http://localhost:3000
   ```

4. **Start Development Server**
   ```bash
   npm run dev
   ```

5. **Verify Setup**
   ```bash
   curl http://localhost:3001/health
   ```

## 🏗️ Shopify Setup

### 1. Create Private App
1. Go to your Shopify Admin → Apps → App and sales channel settings
2. Click "Develop apps" → "Create an app"
3. Name: "MixFade Email Collection"

### 2. Configure Permissions
Required scopes:
- `read_customers`
- `write_customers`

### 3. Get Credentials
- **Shop Domain**: `your-shop.myshopify.com`
- **Access Token**: Found in app settings after installation

## 🚀 Railway Deployment

### 1. Connect Repository
- Create new Railway service
- Connect to your GitHub repository
- Set root directory to `/backend`

### 2. Environment Variables
Add these in Railway dashboard:
```env
PORT=3001
NODE_ENV=production
SHOPIFY_SHOP_DOMAIN=your-shop.myshopify.com
SHOPIFY_ACCESS_TOKEN=your-shopify-access-token
CORS_ORIGINS=https://yourdomain.com
```

### 3. Deploy
Railway will automatically deploy using the `railway.json` configuration.

## 📚 API Documentation

### Email Collection
```http
POST /api/email/collect
Content-Type: application/json

{
  "email": "user@example.com",
  "platform": "windows",
  "version": "0.9.4",
  "userAgent": "Mozilla/5.0...",
  "referrer": "https://mixfade.app/download"
}
```

**Response:**
```json
{
  "success": true,
  "sessionId": "uuid-here",
  "message": "Email added to our list. Your download is ready!",
  "customer": {
    "exists": false,
    "added": true
  }
}
```

### Email Validation
```http
POST /api/email/validate
Content-Type: application/json

{
  "email": "user@example.com"
}
```

### Download Tracking
```http
POST /api/download/track
Content-Type: application/json

{
  "sessionId": "uuid-from-email-collection",
  "platform": "windows",
  "version": "0.9.4",
  "filename": "MixFade Setup 0.9.4.exe",
  "downloadUrl": "https://...",
  "userAgent": "Mozilla/5.0...",
  "referrer": "https://mixfade.app/download"
}
```

### Health Check
```http
GET /health
```

## 🔒 Security Features

- **Rate Limiting**: 5 email submissions per hour per IP
- **CORS**: Configurable origins
- **Helmet**: Security headers
- **Input Validation**: Email format validation
- **Error Handling**: Sanitized error responses

## 📊 Monitoring

### Health Check
- Endpoint: `GET /health`
- Returns: Server status and timestamp

### Logs
- Console logging with structured format
- Email collection events
- Download tracking events
- Shopify integration results

## 🐛 Troubleshooting

### Common Issues

1. **Shopify 401 Unauthorized**
   - Verify `SHOPIFY_ACCESS_TOKEN` is correct
   - Check app permissions include customer read/write

2. **CORS Errors**
   - Add your frontend domain to `CORS_ORIGINS`
   - Ensure protocol (http/https) matches

3. **Rate Limit Errors**
   - Default: 5 emails per hour per IP
   - Adjust in environment variables if needed

### Debug Mode
```bash
NODE_ENV=development npm run dev
```

## 🔧 Configuration

### Rate Limiting
```env
EMAIL_RATE_LIMIT_WINDOW_MS=3600000  # 1 hour
EMAIL_RATE_LIMIT_MAX=5              # 5 requests per window
```

### CORS
```env
CORS_ORIGINS=http://localhost:5173,https://yourdomain.com
```

## 📈 Analytics

The backend logs structured events for:
- Email collections with metadata
- Download events with session tracking
- Shopify integration results
- Error tracking

## 🤝 Contributing

1. Follow existing code patterns
2. Add JSDoc comments for new functions
3. Test endpoints before committing
4. Update this README for new features

## 📄 License

Same as main project license. 