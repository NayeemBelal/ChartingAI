# ChartingAI Frontend - Medical Chart Processing

A React-based frontend application for the ChartingAI marketplace, specifically designed for the medical chart processing agent. This project implements Screen 5 (Success Page) and Screen 6 (Profile Page) of the application flow.

## 🏥 Project Overview

ChartingAI is a marketplace for AI agents in the medical field. This frontend focuses on one specific agent: a medical chart processor that takes PDF medical charts, fills them with AI-enhanced conversation data between patients and doctors, and outputs completed charts.

### Implemented Screens

- **Screen 5: Success Page** - Displays processing results, file details, preview options, and next steps
- **Screen 6: Profile Page** - User dashboard with account info, usage statistics, and analytics charts

## 🚀 Features

### Success Page (Screen 5)
- ✅ File processing summary with before/after details
- ✅ Processing statistics and completion rates
- ✅ Chart preview and download functionality
- ✅ Navigation to upload another chart or return to dashboard
- ✅ Professional UI with progress indicators and status updates

### Profile Page (Screen 6) 
- ✅ User profile information and settings
- ✅ Interactive usage analytics with charts (Recharts)
- ✅ Monthly processing trends and accuracy metrics
- ✅ Chart type distribution (pie chart)
- ✅ Weekly activity visualization (bar chart)
- ✅ Account security and settings management
- ✅ Logout functionality

## 🛠️ Tech Stack

- **React 18** with TypeScript
- **Vite** for fast development and building
- **Tailwind CSS** for styling
- **shadcn/ui** for beautiful, accessible components
- **Recharts** for data visualization
- **React Router DOM** for navigation
- **Lucide React** for icons

## 📦 Installation & Setup

1. **Install dependencies:**
```bash
npm install
```

2. **Start the development server:**
```bash
npm run dev
```

3. **Build for production:**
```bash
npm run build
```

4. **Preview production build:**
```bash
npm run preview
```

## 🎨 Design Features

- **Responsive Design** - Works seamlessly on desktop and mobile
- **Professional Medical UI** - Clean, trustworthy design suitable for healthcare
- **Interactive Charts** - Real-time data visualization for usage analytics  
- **Smooth Navigation** - Intuitive routing between screens
- **Accessibility** - Built with shadcn/ui components that follow accessibility standards
- **Modern Gradients** - Professional color schemes with medical theme

## 📱 Navigation

- **Default Route** `/` - Redirects to Success Page
- **Success Page** `/success` - Chart processing completion screen
- **Profile Page** `/profile` - User dashboard and analytics

## 🔧 Project Structure

```
src/
├── components/
│   ├── ui/                 # shadcn/ui components
│   └── screens/            # Main application screens
├── lib/
│   └── utils.ts           # Utility functions
├── App.tsx                # Main app with routing
├── main.tsx               # React entry point
└── globals.css            # Global styles with shadcn/ui variables
```

## 🎯 Future Integration

This frontend is designed to integrate with:
- Screen 1: Landing page (Dinesh)
- Screen 2: Login/Sign up (Dinesh)  
- Screen 3: Marketplace dashboard (Amar)
- Screen 4: Chart upload interface (Amar)

## 🤝 Team

- **Screen 5 & 6**: Nayeem (This implementation)
- **Screen 1 & 2**: Dinesh  
- **Screen 3 & 4**: Amar
