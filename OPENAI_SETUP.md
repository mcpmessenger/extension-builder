# OpenAI Integration Setup Guide

## 🚀 Vercel Environment Variables

Great! I can see you've already set up your OpenAI API keys in Vercel:

- ✅ `NEXT_PUBLIC_OPENAI_API_KEY` (Added 23h ago)
- ✅ `OPENAI_API_KEY` (Added 23h ago)

## 📋 Local Development Setup

### 1. Create Local Environment File

Create a `.env.local` file in your project root:

```bash
# Copy from .env.local.example
cp .env.local.example .env.local
```

### 2. Add Your OpenAI API Key

Edit `.env.local` and add your API key:

```env
OPENAI_API_KEY=sk-your-actual-api-key-here
NEXT_PUBLIC_OPENAI_API_KEY=sk-your-actual-api-key-here
```

### 3. Restart Development Server

After adding environment variables, restart your dev server:

```bash
npm run dev:mobile
```

## 🔧 How OpenAI Integration Works

### Current Implementation

The app uses OpenAI integration in several places:

1. **Flow Analysis Service** (`lib/flow-analysis-service.ts`)
   - Analyzes webpage flows and generates suggestions
   - Uses dynamic host detection for mobile compatibility

2. **AI Demo Page** (`app/ai-demo/page.tsx`)
   - Demonstrates AI-powered workflow suggestions
   - Shows intelligent analysis capabilities

3. **Playwright Integration** (documented in `PlayWright/OpenAI Integration.md`)
   - Captures screenshots and analyzes them with OpenAI Vision API
   - Generates flow analysis data

### Environment Variable Usage

The app expects these environment variables:

- **Server-side**: `OPENAI_API_KEY` (for API routes)
- **Client-side**: `NEXT_PUBLIC_OPENAI_API_KEY` (for client components)

## 🧪 Testing OpenAI Integration

### 1. Check Environment Variables

Verify your environment variables are loaded:

```bash
# Check if variables are set
echo $OPENAI_API_KEY
echo $NEXT_PUBLIC_OPENAI_API_KEY
```

### 2. Test AI Demo Page

1. Start your dev server: `npm run dev:mobile`
2. Navigate to: `http://[YOUR_IP]:3000/ai-demo`
3. Try importing flow data to test OpenAI integration

### 3. Test API Routes

Test the analysis API endpoint:

```bash
# Test the analysis API
curl "http://[YOUR_IP]:3000/api/analysis?session=test"
```

## 🚨 Troubleshooting

### "Failed to fetch" Errors

If you see "Failed to fetch" errors with OpenAI:

1. **Check API Key**: Ensure your OpenAI API key is valid and has credits
2. **Check Environment**: Verify environment variables are set correctly
3. **Check Network**: Ensure your network allows OpenAI API calls
4. **Check Console**: Look for specific error messages in browser dev tools

### API Key Not Working

If the API key isn't being recognized:

1. **Restart Server**: Environment variables require a server restart
2. **Check Syntax**: Ensure no extra spaces or quotes in `.env.local`
3. **Check Scope**: Use `NEXT_PUBLIC_` prefix for client-side variables
4. **Check Vercel**: Verify variables are set in Vercel dashboard

### Rate Limiting

If you hit rate limits:

1. **Check Usage**: Monitor your OpenAI API usage
2. **Add Delays**: Implement rate limiting in your code
3. **Upgrade Plan**: Consider upgrading your OpenAI plan

## 📊 OpenAI Features Available

### 1. Flow Analysis
- Analyzes webpage screenshots
- Identifies user journey patterns
- Generates workflow suggestions

### 2. Intelligent Suggestions
- Tech support recommendations
- Accessibility improvements
- User experience optimizations

### 3. Vision API Integration
- Screenshot analysis
- Element detection
- Flow pattern recognition

## 🔐 Security Best Practices

### Environment Variables
- ✅ Never commit API keys to git
- ✅ Use `.env.local` for local development
- ✅ Use Vercel environment variables for production
- ✅ Use `NEXT_PUBLIC_` prefix only for client-safe variables

### API Key Management
- ✅ Rotate API keys regularly
- ✅ Monitor API usage and costs
- ✅ Use environment-specific keys
- ✅ Implement rate limiting

## 🚀 Next Steps

1. **Test Integration**: Use the AI demo page to test OpenAI features
2. **Monitor Usage**: Keep track of API calls and costs
3. **Enhance Features**: Add more sophisticated AI analysis
4. **Optimize Performance**: Implement caching and rate limiting

## 📞 Support

If you encounter issues:

1. **Check Logs**: Look at browser console and server logs
2. **Verify Setup**: Ensure all environment variables are correct
3. **Test API**: Try direct API calls to OpenAI
4. **Check Documentation**: Review OpenAI API documentation

Your OpenAI integration should now work both locally and on Vercel! 🎉

