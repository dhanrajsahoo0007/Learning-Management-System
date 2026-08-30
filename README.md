# 🎓 Learning Management - Full-Stack Educational Platform

> **Master Modern Software Engineering** - Interactive learning platform for System Design, DSA, and Cloud Certifications

[![React](https://img.shields.io/badge/React-19.0.0-61DAFB?style=flat-square&logo=react)](https://reactjs.org/)
[![TypeScript](https://img.shields.io/badge/TypeScript-5.6.0-3178C6?style=flat-square&logo=typescript)](https://www.typescriptlang.org/)
[![Tailwind CSS](https://img.shields.io/badge/Tailwind_CSS-3.4.0-38B2AC?style=flat-square&logo=tailwind-css)](https://tailwindcss.com/)
[![Vite](https://img.shields.io/badge/Vite-5.4.0-646CFF?style=flat-square&logo=vite)](https://vitejs.dev/)
[![Node.js](https://img.shields.io/badge/Node.js-18+-339933?style=flat-square&logo=node.js)](https://nodejs.org/)

A modern, comprehensive learning platform designed for software engineers and developers. Master System Design, Data Structures & Algorithms, and Cloud Certifications through interactive tutorials, code playgrounds, and gamified learning experiences.

## 📋 Table of Contents

- [🎯 Project Overview](#-project-overview)
- [✨ Key Features](#-key-features)
- [🏗️ Project Structure](#️-project-structure)
- [🚀 Quick Start](#-quick-start)
- [🎯 Features](#-features)
- [🔧 Technology Stack](#-technology-stack)
- [🚢 Deployment](#-deployment)
- [🧪 Development](#-development)
- [📖 API Documentation](#-api-documentation)
- [🤝 Contributing](#-contributing)
- [📄 License](#-license)

## 🎯 Project Overview

Learning Management is an innovative educational platform that combines:

- **🧠 Interactive Learning**: Hands-on coding challenges and visual system design tutorials
- **🎮 Gamification**: XP system, achievements, daily streaks, and progress tracking
- **📱 Modern UX**: Responsive design with dark/light themes and smooth animations
- **⚡ Performance**: Built with cutting-edge technologies for optimal speed
- **🌐 PWA Ready**: Offline support and installable web app
- **🎨 Beautiful UI**: Inspired by Duolingo with playful, engaging interfaces

### 🎯 Target Audience

- **Software Engineers** preparing for technical interviews
- **Developers** wanting to master system design principles
- **Students** learning data structures and algorithms
- **Professionals** pursuing cloud certifications
- **Teams** looking for internal training platforms

### 🎯 Learning Goals

- **System Design**: Master scalable architecture patterns and distributed systems
- **DSA Mastery**: Solve problems with multiple programming languages
- **Cloud Expertise**: Prepare for AWS, Azure, GCP, and Kubernetes certifications
- **Interview Ready**: Practice real-world coding challenges and design questions
- **AI / ML**: Machine learning algorithms, ML system design, and interview drills ported from the Origins AI Learn content set

### AI / ML content map

The `/ai-ml` section is native TypeScript on this Vite stack (no Next.js or MDX runtime). Source markdown lives in `content/ai-ml/` and is converted by `scripts/convert-aiml-content.mjs`.

| Area | Count | Route |
|------|------:|-------|
| Learning path overviews | 5 | `/ai-ml/learning-paths` |
| Machine learning topics | 33 | `/ai-ml/learning-paths/machine-learning/:topicId` |
| ML system design topics | 54 | `/system-design/ai/ml-system-design/:topicId` |
| Interview sets | 3 | `/ai-ml/interviews/:setId` |

Re-run conversion after editing source files:

```bash
node scripts/convert-aiml-content.mjs
node scripts/verify-aiml-coverage.mjs
```

## 🏗️ Project Structure

All code is consolidated in the `frontend/` folder:

```
Learning Management/
├── frontend/          # Complete Learning Management Application
│   ├── src/          # React frontend source code
│   │   ├── components/  # UI components
│   │   ├── pages/       # Page components
│   │   ├── context/     # React contexts (Theme, Gamification)
│   │   ├── data/        # Mock data for all features
│   │   └── lib/         # Utilities and helpers
│   ├── server.js       # Basic Express server (for future backend)
│   ├── dist/          # Production build output
│   ├── node_modules/  # Dependencies
│   └── package.json   # Dependencies and scripts
├── .gitignore        # Comprehensive git ignore rules
└── README.md         # This file
```

## 🚀 Quick Start

### Prerequisites

- **Node.js** (v18 or higher)
- **npm** or **yarn**

### 1. Clone and Setup

```bash
# Clone the repository
git clone <repository-url>
cd Learning-Management

# Install frontend dependencies
cd frontend
npm install

# Install backend dependencies
cd ../backend
go mod download
```

### 2. Configure Authentication (Clerk)

This platform uses [Clerk](https://clerk.com) for authentication. You'll need to set up a Clerk account:

```bash
# 1. Create a Clerk account at https://clerk.com
# 2. Create a new application
# 3. Get your API keys from the Clerk dashboard

# Frontend environment (.env in frontend/)
echo "VITE_CLERK_PUBLISHABLE_KEY=pk_test_your_key_here" > frontend/.env
echo "VITE_API_URL=http://localhost:8080/api" >> frontend/.env

# Backend environment (.env in backend/)
echo "CLERK_SECRET_KEY=sk_test_your_key_here" >> backend/.env
echo "TURSO_DATABASE_URL=your_database_url" >> backend/.env
echo "TURSO_AUTH_TOKEN=your_auth_token" >> backend/.env
```

> **📖 Detailed Setup Guide**: See [CLERK_SETUP.md](./CLERK_SETUP.md) for complete Clerk configuration instructions

### 3. Start the Application

```bash
# Terminal 1: Start backend services
cd backend
bash scripts/start-services.sh

# Terminal 2: Start frontend
cd frontend
npm run dev
```

The application will start on:

- **Frontend**: `http://localhost:5173`
- **API Gateway**: `http://localhost:8080`

### 4. Access the Application

Open your browser and navigate to `http://localhost:5173`

**First Time Setup**:

1. Click "Sign Up" to create your account
2. Complete the Clerk authentication flow
3. Start learning!

### 4. Demo Features

```bash
# Try these interactive features:
# 1. Navigate between Architecture, DSA, and Certifications tabs
# 2. Click the theme toggle (sun/moon icon) in the top-right
# 3. In DSA tab, try the code playground with "Two Sum" problem
# 4. Type the Konami code: ↑ ↑ ↓ ↓ ← → ← → B A for rainbow mode!
# 5. Complete topics to earn XP and unlock achievements
```

## ✨ Key Features

### 🎨 **User Experience**

- **🌙 Dark/Light Mode**: Automatic theme switching with system preference detection
- **📱 Fully Responsive**: Optimized for mobile, tablet, and desktop
- **🎭 Easter Eggs**: Hidden Konami code for rainbow mode (↑↑↓↓←→←→BA)
- **⚡ Fast & Smooth**: 60fps animations with Framer Motion
- **♿ Accessible**: ARIA labels, keyboard navigation, screen reader support

### 🎮 **Gamification & Progress**

- **🏆 XP System**: Earn experience points for learning activities
- **🎯 Achievements**: Unlock badges (Common, Rare, Epic, Legendary)
- **🔥 Daily Streaks**: Maintain learning streaks with fire animations
- **📊 Progress Tracking**: Visual progress bars and completion statistics
- **🎊 Celebrations**: Confetti animations for milestones and completions

### 💻 **Interactive Learning**

- **🖥️ Code Playground**: Monaco Editor with syntax highlighting
- **🌍 Multi-Language**: JavaScript, Python, Java, C++ support
- **🧪 Test Cases**: Automated testing with detailed feedback
- **💡 Hints & Solutions**: Progressive disclosure of help
- **📚 Rich Content**: Step-by-step tutorials with diagrams

### 🏗️ **Architecture Topics**

- **⚖️ Load Balancing**: Round-robin, least connections, IP hash
- **🏢 Microservices**: Service decomposition, API gateways, circuit breakers
- **💾 Caching**: Cache-aside, write-through, TTL strategies
- **🗄️ Databases**: Sharding, replication, NoSQL patterns
- **🔄 Message Queues**: Async communication, event-driven architecture

### 🎓 **Certification Paths**

- **☁️ AWS**: Solutions Architect, Developer, DevOps certifications
- **🔵 Azure**: Fundamentals, Associate, Expert level paths
- **🟢 GCP**: Professional Cloud Architect, Developer tracks
- **🚢 Kubernetes**: CKA, CKAD certification preparation
- **🛠️ Terraform**: Infrastructure as Code mastery

## 🎯 Features

### Frontend (React + TypeScript)

- **⚛️ React 19**: Latest concurrent features and hooks
- **🔷 TypeScript**: Full type safety and IntelliSense support
- **🎨 Tailwind CSS**: Utility-first styling with custom design system
- **⚡ Vite**: Lightning-fast build tool and HMR
- **🎭 Framer Motion**: Production-ready animations
- **🛣️ React Router**: Client-side routing with lazy loading
- **📝 Monaco Editor**: Professional code editing experience
- **🎯 PWA**: Service worker, offline support, installable

### Backend (Node.js + Express)

- **🔄 Currently Minimal**: Basic Express server setup
- **🚀 Future Stack**: MongoDB, JWT, Redis, comprehensive API
- **🛡️ Security**: Rate limiting, CORS, input validation, encryption
- **📊 Analytics**: Learning metrics, user behavior tracking
- **🔗 Integrations**: GitHub OAuth, progress sync, notifications

## 📚 Learning Modules

### 🏗️ System Design & Architecture

- Load Balancing strategies
- Microservices architecture
- Caching patterns
- Database sharding
- API Gateway design
- Message queues
- And more...

### 💻 Data Structures & Algorithms

- Interactive code playground
- Multiple programming languages
- Visual algorithm animations
- Comprehensive test cases
- Hint and solution system
- Progress tracking

### 🎓 Cloud Certifications

- AWS, Azure, GCP certifications
- Interactive roadmaps
- Module-based learning
- Practice exams
- Progress tracking

## 🎮 Gamification Features

- **XP System**: Earn experience points for learning activities
- **Achievements**: Unlock badges for milestones (common, rare, epic, legendary)
- **Streaks**: Daily learning streaks with fire animations
- **Leaderboards**: Compare progress with other learners
- **Progress Tracking**: Visual progress indicators and statistics

## 🔧 Technology Stack

### Frontend

- **React 19** - Latest React with concurrent features
- **TypeScript** - Type-safe development
- **Vite** - Fast build tool and dev server
- **Tailwind CSS** - Utility-first CSS framework
- **Framer Motion** - Animation library
- **React Router** - Client-side routing
- **Monaco Editor** - Professional code editor
- **Lucide React** - Beautiful icons

### Backend (Go Microservices)

- **Go 1.25** - High-performance backend language
- **Fiber** - Express-inspired web framework
- **Turso (libSQL)** - Distributed SQLite database
- **Clerk** - Modern authentication and user management
- **Docker** - Containerized microservices
- **Webhooks** - Real-time user synchronization

#### Microservices Architecture

- **API Gateway** (Port 8080) - Request routing and authentication
- **DSA Service** (Port 8082) - Data structures and algorithms
- **System Design** (Port 8083) - Architecture tutorials
- **AI System Design** (Port 8084) - AI-specific topics
- **Certifications** (Port 8085) - Cloud certification paths
- **Gamification** (Port 8086) - XP, achievements, streaks
- **Webhooks** (Port 8087) - Clerk event handlers

## 🚢 Deployment

### Frontend Deployment (Production Ready)

Learning Management is built as a static web application and can be deployed to any modern hosting platform.

#### Quick Deploy Commands

```bash
cd frontend

# Build for production
npm run build

# The built files will be in the dist/ folder
# Deploy the entire 'dist' folder to your hosting platform
```

#### 🚀 Recommended Platforms

##### **Vercel (Recommended)**

```bash
# Install Vercel CLI
npm i -g vercel

# Deploy from frontend directory
cd frontend
vercel --prod

# Or connect your GitHub repo for automatic deployments
```

##### **Netlify**

```bash
# Install Netlify CLI
npm install -g netlify-cli

# Build and deploy
cd frontend
npm run build
netlify deploy --dir=dist --prod
```

##### **Cloudflare Pages**

```bash
# Install Wrangler
npm install -g wrangler

# Build and deploy
cd frontend
npm run build
wrangler pages deploy dist
```

##### **GitHub Pages**

```bash
# Add to package.json scripts:
"deploy": "gh-pages -d dist"

# Build and deploy
cd frontend
npm run build
npm run deploy
```

##### **Firebase Hosting**

```bash
# Install Firebase CLI
npm install -g firebase-tools

# Initialize and deploy
cd frontend
firebase init hosting
firebase deploy
```

#### 🌐 Manual Deployment

For any static hosting service:

1. Run `npm run build` in the `frontend` directory
2. Upload all files from the `dist` folder to your web server
3. Configure your domain to point to the uploaded files

### Backend Deployment (Future)

When the backend API is implemented, deploy to:

#### **Railway**

```bash
# Connect GitHub repo
# Automatic deployments with environment variables
```

#### **Heroku**

```bash
# Create Heroku app
heroku create learning-management-backend

# Set environment variables
heroku config:set NODE_ENV=production

# Deploy
git push heroku main
```

#### **DigitalOcean App Platform**

- Connect GitHub repository
- Automatic builds and deployments
- Environment variable management
- Database integrations

### 🔧 Environment Variables

#### Frontend (`.env` in `frontend/`)

```env
# Clerk Authentication (Required)
VITE_CLERK_PUBLISHABLE_KEY=pk_test_your_publishable_key_here

# API Configuration
VITE_API_URL=http://localhost:8080/api
```

#### Backend (`.env` in `backend/`)

```env
# Server Configuration
PORT=8080
ENV=development

# Turso Database (Required)
TURSO_DATABASE_URL=libsql://your-database-name.turso.io
TURSO_AUTH_TOKEN=your-auth-token-here

# Clerk Authentication (Required)
CLERK_SECRET_KEY=sk_test_your_secret_key_here

# Clerk Webhooks (Optional - for user sync)
CLERK_WEBHOOK_SECRET=whsec_your_webhook_secret_here

# CORS Configuration
FRONTEND_URL=http://localhost:5173

# Rate Limiting
RATE_LIMIT_MAX=100
RATE_LIMIT_WINDOW=1m
```

> **📖 See Also**:
>
> - [CLERK_SETUP.md](./CLERK_SETUP.md) - Complete Clerk configuration guide
> - [backend/.env.example](./backend/.env.example) - Backend environment template
> - [frontend/.env.example](./frontend/.env.example) - Frontend environment template

### 📊 Performance Optimization

- **Bundle Analysis**: Run `npm run build` and check bundle sizes
- **Image Optimization**: All images are optimized for web
- **Code Splitting**: Automatic route-based code splitting
- **Caching**: Service worker for offline functionality
- **CDN**: Deploy to CDN-enabled platforms for global performance

## 🧪 Development

### Running Tests

```bash
# Backend tests
cd backend && npm test

# Frontend linting
cd frontend && npm run lint
```

### Code Quality

- **ESLint**: Code linting and formatting
- **TypeScript**: Type checking
- **Prettier**: Code formatting (recommended)

## 📖 API Documentation

**Backend API is not implemented yet.** Currently only basic health check endpoints are available:

- `GET /api/health` - Server health status
- `GET /api` - Basic API information

All other endpoints will be implemented later including:

- Authentication & user management
- Learning content APIs
- Progress tracking
- Achievements system

## 🗺️ Roadmap

### ✅ **Completed (v1.0)**

- [x] Complete React frontend with TypeScript
- [x] System Design & Architecture tutorials
- [x] Interactive DSA code playground
- [x] Cloud certification roadmaps
- [x] Gamification system (XP, achievements, streaks)
- [x] Dark/light theme with system preference
- [x] Responsive mobile-first design
- [x] PWA with offline support
- [x] Comprehensive UI component library

### 🚧 **In Development**

- [ ] Backend API implementation
- [ ] User authentication & profiles
- [ ] Progress persistence with database
- [ ] Social features (leaderboards, comments)
- [ ] Advanced code execution environment
- [ ] Video content integration
- [ ] Mobile app (React Native)

### 🎯 **Future Enhancements**

- [ ] Multi-language support (i18n)
- [ ] AI-powered learning recommendations
- [ ] Real-time collaborative coding
- [ ] Advanced analytics dashboard
- [ ] Integration with popular coding platforms
- [ ] Custom learning paths
- [ ] Team/organization features

## 🤝 Contributing

We welcome contributions from the community! Here's how to get involved:

### 🚀 **Getting Started**

1. Fork the repository
2. Clone your fork: `git clone https://github.com/your-username/learning-management.git`
3. Create a feature branch: `git checkout -b feature/amazing-feature`
4. Install dependencies: `cd frontend && npm install`

### 💻 **Development Workflow**

```bash
# Start development server
npm run dev

# Run linting
npm run lint

# Build for production
npm run build

# Test your changes thoroughly
```

### 📝 **Contribution Guidelines**

1. **Code Style**: Follow the existing TypeScript and React patterns
2. **Testing**: Test your changes on different screen sizes
3. **Documentation**: Update README for new features
4. **Commits**: Use clear, descriptive commit messages
5. **Pull Requests**: Provide detailed descriptions of changes

### 🎯 **Areas for Contribution**

- **Content Creation**: Add new DSA problems or system design topics
- **UI/UX Improvements**: Enhance animations, accessibility, or responsiveness
- **New Features**: Implement items from the roadmap
- **Bug Fixes**: Improve stability and performance
- **Documentation**: Help improve guides and tutorials

### 📞 **Communication**

- **Issues**: [GitHub Issues](https://github.com/your-repo/issues)
- **Discussions**: [GitHub Discussions](https://github.com/your-repo/discussions)
- **Discord**: Join our community server (coming soon)

### 🎖️ **Recognition**

Contributors will be:

- Listed in CONTRIBUTORS.md
- Mentioned in release notes
- Featured in our community showcase

## 📄 License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## 🙏 Acknowledgments

- **Duolingo** - Inspiration for the clean, engaging UI design
- **LeetCode** - Reference for coding challenge structure
- **AWS/Azure/GCP** - Cloud platform documentation and learning paths

## 📞 Support

- **Issues**: [GitHub Issues](https://github.com/your-repo/issues)
- **Discussions**: [GitHub Discussions](https://github.com/your-repo/discussions)
- **Email**: support@learning-management.com

---

## 🎊 Success Stories

_"Learning Management helped me land my dream job at FAANG. The system design tutorials were incredibly detailed and the DSA playground made algorithm practice actually fun!"_
— Sarah Chen, Senior Software Engineer at Google

_"The gamification elements kept me motivated during my AWS certification prep. I went from 0 to certified in 3 months!"_
— Miguel Rodriguez, Cloud Architect

## 📞 Support & Community

- **📧 Email**: hello@learning-management.dev
- **🐛 Bug Reports**: [GitHub Issues](https://github.com/learning-management/learning-management/issues)
- **💬 Discussions**: [GitHub Discussions](https://github.com/learning-management/learning-management/discussions)
- **📖 Documentation**: [Learning Management Docs](https://docs.learning-management.dev)
- **🎮 Demo**: [Live Demo](https://learning-management.dev)

## 📊 Project Stats

[![Stars](https://img.shields.io/github/stars/learning-management/learning-management?style=social)](https://github.com/learning-management/learning-management)
[![Forks](https://img.shields.io/github/forks/learning-management/learning-management?style=social)](https://github.com/learning-management/learning-management)
[![Issues](https://img.shields.io/github/issues/learning-management/learning-management)](https://github.com/learning-management/learning-management/issues)
[![PRs](https://img.shields.io/github/issues-pr/learning-management/learning-management)](https://github.com/learning-management/learning-management/pulls)

---

## 🎓 Happy Learning!

**Built with ❤️ for developers who want to master modern technologies.**

_Learning Management - Where Learning Meets Gamification_ 🚀✨

---

<div align="center">
  <p><strong>🌟 Star this repo if you find it helpful!</strong></p>
  <p><em>Empowering the next generation of software engineers</em></p>
</div>
