# Whop Next.js App Template

A beginner-friendly template for building Whop apps with Next.js, TypeScript, and Tailwind CSS.

## 🎯 What's Included

- ✅ **Whop SDK Integration** - Pre-configured authentication and API access
- ✅ **Modern UI** - Beautiful, responsive design with Tailwind CSS
- ✅ **TypeScript** - Full type safety and better development experience
- ✅ **Authentication** - Built-in Whop user authentication
- ✅ **Webhooks** - Ready-to-use webhook endpoints
- ✅ **Beginner-Friendly** - Clear documentation and setup guides

## 🚀 Quick Start

**New to Whop apps?** Check out our [detailed setup guide](./SETUP.md) for step-by-step instructions!

### 1. Install Dependencies
```bash
# Using pnpm (recommended)
pnpm install

# Or using npm
npm install
```

### 2. Set Up Environment Variables
```bash
# Copy the example environment file
cp env.example .env

# Edit .env with your Whop app credentials
```

### 3. Run Development Server
```bash
pnpm dev
```

## 📚 Documentation

- **[Setup Guide](./SETUP.md)** - Complete beginner-friendly setup instructions
- **[Whop Documentation](https://dev.whop.com)** - Official Whop developer docs
- **[Next.js Documentation](https://nextjs.org/docs)** - Next.js framework docs

## 🛠 Development

```bash
# Start development server
pnpm dev

# Build for production
pnpm build

# Start production server
pnpm start

# Run linter
pnpm lint
```

## 🚀 Deployment

### Vercel (Recommended)
1. Push to GitHub
2. Connect to [Vercel](https://vercel.com)
3. Add environment variables
4. Deploy!

### Other Platforms
Deploy to any platform that supports Next.js. Just ensure your environment variables are set.

## 🔧 Configuration

### Required Environment Variables
- `NEXT_PUBLIC_WHOP_APP_ID` - Your Whop app ID
- `WHOP_API_KEY` - Your Whop API key
- `NEXT_PUBLIC_WHOP_AGENT_USER_ID` - Agent user ID (optional)
- `NEXT_PUBLIC_WHOP_COMPANY_ID` - Company ID (optional)

### Whop Dashboard Settings
- **Base URL**: Your deployment domain
- **App path**: `/experiences/[experienceId]`
- **Dashboard path**: `/dashboard/[companyId]`
- **Discover path**: `/discover`

## 🆘 Troubleshooting

**App not loading?** Make sure you've set the correct paths in your Whop dashboard and environment variables.

**Need help?** Check out our [setup guide](./SETUP.md) or visit the [Whop Documentation](https://dev.whop.com).

## 📄 License

This template is provided as-is for building Whop applications.
