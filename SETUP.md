# Whop App Setup Guide

Welcome to your Whop app! This guide will help you get started quickly and easily.

## 🚀 Quick Start

### 1. Install Dependencies
```bash
# Using pnpm (recommended)
pnpm install

# Or using npm
npm install
```

### 2. Set Up Environment Variables
1. Copy the `env.example` file to `.env`:
   ```bash
   cp env.example .env
   ```

2. Go to your [Whop Developer Dashboard](https://whop.com/dashboard/developer/)
3. Create a new app or select an existing one
4. Copy the environment variables from your dashboard and paste them into your `.env` file

### 3. Configure Your App Paths
In your Whop Developer Dashboard, set these paths:
- **Base URL**: Your domain (e.g., `https://yourapp.com`)
- **App path**: `/experiences/[experienceId]`
- **Dashboard path**: `/dashboard/[companyId]`
- **Discover path**: `/discover`

### 4. Install Your App
1. Go to a Whop you created in the same organization as your app
2. Navigate to the Tools section
3. Add your app

### 5. Run the Development Server
```bash
pnpm dev
```

## 📁 Project Structure

```
├── app/                    # Next.js app directory
│   ├── api/               # API routes
│   ├── dashboard/         # Dashboard pages
│   ├── discover/          # Discover page
│   ├── experiences/       # Experience pages
│   └── layout.tsx         # Root layout with WhopApp wrapper
├── lib/                   # Utility functions
│   └── whop-sdk.ts        # Whop SDK configuration
├── env.example            # Environment variables template
└── SETUP.md              # This file
```

## 🔧 Key Features

- **Authentication**: Header-based authentication using `x-whop-user-id`
- **RBAC System**: Simple role-based access control (staff/member/no_access)
- **Responsive Design**: Modern UI with Tailwind CSS
- **TypeScript**: Full TypeScript support
- **Webhooks**: Ready-to-use webhook endpoints

## 🛠 Development

### Available Scripts
- `pnpm dev` - Start development server
- `pnpm build` - Build for production
- `pnpm start` - Start production server
- `pnpm lint` - Run linter

### Environment Variables
All required environment variables are documented in `env.example`. Make sure to:
1. Copy `env.example` to `.env`
2. Fill in your actual values from the Whop dashboard
3. Never commit your `.env` file to version control

## 🚀 Deployment

### Vercel (Recommended)
1. Push your code to GitHub
2. Connect your repository to [Vercel](https://vercel.com)
3. Add your environment variables in Vercel's dashboard
4. Deploy!

### Other Platforms
The app can be deployed to any platform that supports Next.js. Just make sure to:
1. Set all environment variables
2. Update your Whop app's Base URL to match your deployment URL

## 📚 Next Steps

1. **Customize the UI**: Edit the components in the `app/` directory
2. **Add API Routes**: Create new API endpoints in `app/api/`
3. **Integrate Whop APIs**: Use the configured SDK in `lib/whop-sdk.ts`
4. **Add Authentication**: The app already includes Whop authentication
5. **Handle Webhooks**: Use the webhook route in `app/api/webhooks/`

## 🆘 Need Help?

- [Whop Documentation](https://dev.whop.com)
- [Next.js Documentation](https://nextjs.org/docs)
- [Whop Discord Community](https://discord.gg/whop)

## 🔒 Security Notes

- Never commit your `.env` file
- Keep your API keys secure
- Use environment variables for all sensitive data
- Regularly rotate your API keys

Happy coding! 🎉
