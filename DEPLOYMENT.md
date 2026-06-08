# AI Studio - Deployment Guide

This guide covers deployment to free hosting platforms.

## Option 1: Vercel (Recommended for Frontend)

### Quick Setup:
1. Go to [vercel.com](https://vercel.com)
2. Sign up with GitHub
3. Click "New Project"
4. Import this repository
5. Add environment variables (see `.env.local.example`)
6. Click "Deploy"

### Environment Variables Required:
```
NEXTAUTH_URL=https://your-domain.vercel.app
NEXTAUTH_SECRET=<generate with: openssl rand -base64 32>
GOOGLE_GEMINI_API_KEY=your-key
OPENAI_API_KEY=your-key
GOOGLE_CLIENT_ID=your-id
GOOGLE_CLIENT_SECRET=your-secret
GITHUB_CLIENT_ID=your-id
GITHUB_CLIENT_SECRET=your-secret
```

### Deploy CLI:
```bash
npm i -g vercel
vercel
```

---

## Option 2: Railway (Best for Full Stack)

### Quick Setup:
1. Go to [railway.app](https://railway.app)
2. Sign up with GitHub
3. Create a new project
4. Select "Deploy from GitHub"
5. Connect your repository
6. Add environment variables
7. Railway will auto-deploy on push

### Environment Variables:
Same as Vercel (see above)

### Using Railway CLI:
```bash
npm install -g @railway/cli
railway login
railway up
```

---

## Option 3: Render

### Quick Setup:
1. Go to [render.com](https://render.com)
2. Create new "Web Service"
3. Connect GitHub repository
4. Configure:
   - Build Command: `npm install && npm run build`
   - Start Command: `npm start`
5. Add environment variables
6. Deploy

---

## Option 4: Docker on Any Host

### Build Docker Image:
```bash
docker build -t ai-studio .
```

### Run Locally:
```bash
docker run -p 3000:3000 \
  -e NEXTAUTH_SECRET=your-secret \
  -e GOOGLE_GEMINI_API_KEY=your-key \
  -e OPENAI_API_KEY=your-key \
  ai-studio
```

### Deploy to Cloud:
- AWS ECS
- Google Cloud Run
- Azure Container Instances
- DigitalOcean App Platform

---

## Environment Variables Setup

### Google Gemini API:
1. Go to [Google AI Studio](https://makersuite.google.com)
2. Click "Get API Key"
3. Copy the key

### OpenAI API:
1. Go to [OpenAI Platform](https://platform.openai.com)
2. Create API key
3. Copy the key

### NextAuth Secret:
```bash
openssl rand -base64 32
```

### Google OAuth (Optional):
1. Go to [Google Cloud Console](https://console.cloud.google.com)
2. Create OAuth 2.0 credentials
3. Add authorized redirect URI: `https://your-domain/api/auth/callback/google`

### GitHub OAuth (Optional):
1. Go to GitHub Settings > Developer settings > OAuth Apps
2. Create new OAuth app
3. Set Authorization callback URL: `https://your-domain/api/auth/callback/github`

---

## Post-Deployment

### Test Your App:
```
https://your-domain/
```

### Monitor:
- Check deployment logs
- Monitor API usage
- Track errors

### Scale:
- Upgrade database if needed
- Increase compute resources
- Set up caching

---

## Troubleshooting

### "Connected refused" error:
- Check if environment variables are set
- Verify API keys are valid
- Check network connectivity

### Build fails:
```bash
# Clear cache
npm ci
npm run build

# Check for errors
npm run lint
```

### Pages not loading:
- Check browser console for errors
- Verify environment variables
- Check API endpoints are working

---

## Cost Overview

| Platform | Free Tier | Best For |
|----------|-----------|----------|
| Vercel | Yes | Frontend + API |
| Railway | Limited | Full Stack |
| Render | Yes | Backend |
| Docker | Free (self-hosted) | Full Control |

---

## Next Steps

1. Choose your deployment platform
2. Set up environment variables
3. Deploy
4. Test all features
5. Monitor performance

For more help:
- [Vercel Docs](https://vercel.com/docs)
- [Railway Docs](https://docs.railway.app)
- [Render Docs](https://render.com/docs)
