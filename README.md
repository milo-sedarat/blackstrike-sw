# BlackStrike - Advanced Trading Platform

[![Deployed on Vercel](https://img.shields.io/badge/Deployed%20on-Vercel-black?style=for-the-badge&logo=vercel)](https://blackstrike-sw.vercel.app)
[![Built with Next.js](https://img.shields.io/badge/Built%20with-Next.js-black?style=for-the-badge&logo=next.js)](https://nextjs.org/)
[![TypeScript](https://img.shields.io/badge/TypeScript-007ACC?style=for-the-badge&logo=typescript&logoColor=white)](https://www.typescriptlang.org/)
[![Tailwind CSS](https://img.shields.io/badge/Tailwind_CSS-38B2AC?style=for-the-badge&logo=tailwind-css&logoColor=white)](https://tailwindcss.com/)

## 🚀 Overview

BlackStrike is a modern, high-performance trading platform built with cutting-edge technologies. The platform features a sleek dark theme with advanced authentication, real-time trading capabilities, and an intuitive user interface designed for professional traders.

## ✨ Features

### 🔐 **Authentication System**
- **Modern Form Design**: Sleek dark-themed authentication forms with animated backgrounds
- **Email Verification**: Secure email verification system for new user accounts
- **Google OAuth**: Seamless Google sign-in integration
- **Password Reset**: Secure password reset functionality
- **Form Validation**: Comprehensive client-side and server-side validation

### 🎨 **User Interface**
- **Dark Theme**: Professional dark mode design with blue accents
- **Responsive Design**: Fully responsive across all devices
- **Animated Elements**: Smooth animations and transitions using Framer Motion
- **Modern Components**: Built with shadcn/ui components and Tailwind CSS
- **Loading States**: Professional loading indicators and disabled states

### 📊 **Trading Dashboard**
- **Real-time Data**: Live market data and trading information
- **Portfolio Management**: Comprehensive portfolio tracking and management
- **Trading Bots**: Automated trading bot functionality
- **Market Analysis**: Advanced charting and analysis tools
- **Notifications**: Real-time trading alerts and notifications

### 🔧 **Technical Stack**
- **Next.js 15**: Latest version with App Router
- **TypeScript**: Full type safety and better development experience
- **Tailwind CSS**: Utility-first CSS framework
- **Framer Motion**: Smooth animations and transitions
- **Firebase**: Authentication and real-time database
- **shadcn/ui**: Modern component library

## 🛠️ Installation

### Prerequisites
- Node.js 18+ 
- pnpm (recommended) or npm
- Firebase project setup

### Setup Instructions

1. **Clone the repository**
   ```bash
   git clone https://github.com/milo-sedarat/blackstrike-sw.git
   cd blackstrike-sw
   ```

2. **Install dependencies**
   ```bash
   pnpm install
   ```

3. **Environment Configuration**
   ```bash
   cp env.example .env.local
   ```
   
   Update `.env.local` with your Firebase configuration:
   ```env
   NEXT_PUBLIC_FIREBASE_API_KEY=your_api_key
   NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN=your_auth_domain
   NEXT_PUBLIC_FIREBASE_PROJECT_ID=your_project_id
   NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET=your_storage_bucket
   NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID=your_sender_id
   NEXT_PUBLIC_FIREBASE_APP_ID=your_app_id
   ```

4. **Run the development server**
   ```bash
   pnpm dev
   ```

5. **Open your browser**
   Navigate to [http://localhost:3000](http://localhost:3000)

## 🏗️ Project Structure

```
blackstrike-sw/
├── app/                    # Next.js App Router pages
│   ├── auth/              # Authentication pages
│   │   ├── login/         # Login page
│   │   ├── signup/        # Signup page
│   │   └── forgot-password/ # Password reset
│   ├── dashboard/         # Main dashboard
│   ├── portfolio/         # Portfolio management
│   ├── bots/              # Trading bots
│   └── settings/          # User settings
├── components/            # React components
│   ├── ui/               # shadcn/ui components
│   ├── dashboard/        # Dashboard-specific components
│   └── chat/             # Chat functionality
├── hooks/                # Custom React hooks
├── lib/                  # Utility libraries
├── types/                # TypeScript type definitions
└── public/               # Static assets
```

## 🔐 Authentication Flow

### User Registration
1. User fills out signup form with first name, last name, email, and password
2. Email verification is sent automatically
3. User must verify email before accessing the platform
4. Account is created and user is redirected to login

### User Login
1. User enters email and password
2. System checks email verification status
3. If verified, user is logged in and redirected to dashboard
4. If not verified, user is blocked and prompted to verify email

### Password Reset
1. User requests password reset via forgot password form
2. Reset link is sent to user's email
3. User clicks link and sets new password
4. User can then log in with new credentials

## 🎨 Design System

### Color Palette
- **Primary**: Blue gradients (#3B82F6 to #6366F1)
- **Background**: Dark grays (#111827 to #1F2937)
- **Text**: White and light grays
- **Accents**: Blue highlights and gradients

### Typography
- **Headings**: Bold, modern sans-serif
- **Body**: Clean, readable text
- **Code**: Monospace for technical content

### Components
- **Buttons**: Gradient backgrounds with hover effects
- **Inputs**: Dark theme with blue focus states
- **Cards**: Subtle borders and shadows
- **Animations**: Smooth transitions and micro-interactions

## 🚀 Deployment

### Vercel (Recommended)
1. Connect your GitHub repository to Vercel
2. Configure environment variables in Vercel dashboard
3. Deploy automatically on every push to main branch

### Manual Deployment
```bash
# Build the application
pnpm build

# Start production server
pnpm start
```

## 🔧 Development

### Available Scripts
```bash
pnpm dev          # Start development server
pnpm build        # Build for production
pnpm start        # Start production server
pnpm lint         # Run ESLint
pnpm type-check   # Run TypeScript type checking
```

### Code Style
- **TypeScript**: Strict mode enabled
- **ESLint**: Configured for Next.js and React
- **Prettier**: Code formatting
- **Husky**: Git hooks for code quality

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

## 📝 License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## 🆘 Support

For support, email support@blackstrike.com or join our Discord community.

## 🔗 Links

- **Live Demo**: [https://blackstrike-sw.vercel.app](https://blackstrike-sw.vercel.app)
- **Documentation**: [https://docs.blackstrike.com](https://docs.blackstrike.com)
- **API Reference**: [https://api.blackstrike.com](https://api.blackstrike.com)

---

**Built with ❤️ by the BlackStrike Team**
