# 24 Game

A web-based implementation of the classic 24 game where players use 4 numbers and basic arithmetic operations to make 24.

## 🎮 How to Play

1. You'll be given 4 random numbers (1-9)
2. Use all 4 numbers exactly once with basic arithmetic operations (+, -, ×, ÷)
3. The goal is to create an expression that equals 24
4. Click the numbers and operators to build your expression
5. The game will automatically evaluate when you use all 4 numbers

## 🚀 Quick Start

### Prerequisites
- Node.js (version 16 or higher)
- npm or yarn

### Installation
```bash
# Install dependencies
npm install

# Start development server
npm run dev
```

The game will open in your browser at `http://localhost:3000`

### Build for Production
```bash
npm run build
npm run preview
```

## 🛠️ Tech Stack

- **Frontend**: TypeScript, Vite
- **Styling**: Tailwind CSS
- **Game Logic**: Custom solver algorithm
- **Audio**: Howler.js (for future sound effects)

## 🏗️ Project Structure

```
src/
├── main.ts          # Entry point
├── game24.ts        # Main game logic and UI
├── solver24.ts      # Algorithm to check for solutions
└── style.css        # Global styles and Tailwind imports
```

## 🎯 Features

### Current (MVP)
- ✅ Random number generation with guaranteed solutions
- ✅ Interactive number and operator selection
- ✅ Real-time expression building
- ✅ Automatic evaluation and scoring
- ✅ Timer and score tracking
- ✅ Responsive design
- ✅ Clear and new game functionality

### Planned Features
- 🔄 Leaderboards
- 🔄 User accounts and authentication
- 🔄 Multiplayer mode
- 🔄 Sound effects and animations
- 🔄 Difficulty levels
- 🔄 Hint system
- 🔄 Statistics and achievements
- 🔄 Mobile app version

## 🧮 Algorithm

The game uses a custom solver that:
1. Generates all permutations of the 4 numbers
2. Tries all combinations of operators (+, -, ×, ÷)
3. Tests different grouping patterns (parentheses)
4. Ensures only solvable number sets are presented

## 🎨 Design Philosophy

- **Minimalist**: Clean, distraction-free interface
- **Responsive**: Works on desktop and mobile
- **Accessible**: Keyboard navigation and screen reader support
- **Fast**: Instant feedback and smooth animations

## 🚀 Future Development

### Phase 1: Backend Integration
- User authentication (NextAuth.js)
- Database for leaderboards (Supabase/PostgreSQL)
- API endpoints for game state

### Phase 2: Multiplayer Features
- Real-time game rooms (Socket.io)
- Competitive modes
- Chat functionality

### Phase 3: Advanced Features
- Custom game modes
- AI opponent
- Tournament system
- Social features

## 🤝 Contributing

This is a learning project! Feel free to:
- Report bugs
- Suggest features
- Submit pull requests
- Ask questions

## 📝 License

MIT License - feel free to use this code for your own projects!

## 🎓 Learning Goals

This project is designed to teach:
- Modern web development with TypeScript
- Game development concepts
- Algorithm design and optimization
- UI/UX design principles
- Full-stack development
- Real-time features
- Database design

---

Built with ❤️ for learning and fun!
