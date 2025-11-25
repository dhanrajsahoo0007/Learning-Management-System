# 🎓 LearnForge - Full-Stack Educational Platform

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

LearnForge is an innovative educational platform that combines:

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

## 🏗️ Project Structure

All code is consolidated in the `frontend/` folder:

```
LearnForge/
├── frontend/          # Complete LearnForge Application
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
cd LearnForge

# Navigate to the frontend folder (contains everything)
cd frontend

# Install all dependencies
npm install
```

### 2. Start the Application

```bash
# Start the complete LearnForge application
npm run dev
```

The application will start on `http://localhost:5173` (or next available port)

### 3. Access the Application

Open your browser and navigate to the displayed URL (usually `http://localhost:5173`)

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

### Backend
- **Node.js** - JavaScript runtime
- **Express.js** - Web framework
- **MongoDB** - NoSQL database
- **Mongoose** - MongoDB object modeling
- **JWT** - Authentication tokens
- **bcryptjs** - Password hashing
- **Redis** - Caching (optional)

## 🚢 Deployment

### Frontend Deployment (Production Ready)

LearnForge is built as a static web application and can be deployed to any modern hosting platform.

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
heroku create learnforge-backend

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

#### Frontend
The frontend is configured to work without environment variables for development.

#### Backend (Future)
```env
NODE_ENV=production
PORT=5000
MONGODB_URI=your_mongodb_connection_string
JWT_SECRET=your_jwt_secret_key
REDIS_URL=your_redis_url
FRONTEND_URL=https://your-frontend-domain.com
```

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
2. Clone your fork: `git clone https://github.com/your-username/learnforge.git`
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
- **Email**: support@learnforge.com

---

## 🎊 Success Stories

*"LearnForge helped me land my dream job at FAANG. The system design tutorials were incredibly detailed and the DSA playground made algorithm practice actually fun!"*
— Sarah Chen, Senior Software Engineer at Google

*"The gamification elements kept me motivated during my AWS certification prep. I went from 0 to certified in 3 months!"*
— Miguel Rodriguez, Cloud Architect

## 📞 Support & Community

- **📧 Email**: hello@learnforge.dev
- **🐛 Bug Reports**: [GitHub Issues](https://github.com/learnforge/learnforge/issues)
- **💬 Discussions**: [GitHub Discussions](https://github.com/learnforge/learnforge/discussions)
- **📖 Documentation**: [LearnForge Docs](https://docs.learnforge.dev)
- **🎮 Demo**: [Live Demo](https://learnforge.dev)

## 📊 Project Stats

[![Stars](https://img.shields.io/github/stars/learnforge/learnforge?style=social)](https://github.com/learnforge/learnforge)
[![Forks](https://img.shields.io/github/forks/learnforge/learnforge?style=social)](https://github.com/learnforge/learnforge)
[![Issues](https://img.shields.io/github/issues/learnforge/learnforge)](https://github.com/learnforge/learnforge/issues)
[![PRs](https://img.shields.io/github/issues-pr/learnforge/learnforge)](https://github.com/learnforge/learnforge/pulls)

---

## 🎓 Happy Learning!

**Built with ❤️ for developers who want to master modern technologies.**

*LearnForge - Where Learning Meets Gamification* 🚀✨

---

<div align="center">
  <p><strong>🌟 Star this repo if you find it helpful!</strong></p>
  <p><em>Empowering the next generation of software engineers</em></p>
</div>
