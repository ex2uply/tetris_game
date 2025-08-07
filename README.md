# 🎮 Tetris Game

A modern, responsive Tetris game built with HTML5 Canvas, CSS3, and JavaScript.

## 👨‍💻 Author

**ex2uply**

## ✨ Features

### 🎯 Game Features

- **Classic Tetris gameplay** with all 7 standard tetromino pieces
- **Next piece preview** - See what's coming next
- **Level progression** - Speed increases as you level up
- **Score tracking** - Points based on lines cleared and level
- **Line counting** - Track total lines cleared
- **Game controls** - Start, pause, and reset functionality


### 🎮 Controls

- **← →** - Move piece left/right
- **↑** - Rotate piece clockwise
- **↓** - Soft drop (move down faster)
- **Space** - Hard drop (instant drop)
- **Q/E** - Alternative rotate controls

## 🚀 Installation

1. **Clone or download** the project files
2. **Open** `index.html` in your web browser
3. **Start playing** immediately - no additional setup required!

### File Structure

```
tetris_game/
├── index.html      # Main HTML file
├── style.css       # CSS styles and responsive design
├── main.js         # Game logic and functionality
└── README.md       # This file
```

## 🎯 How to Play

1. **Start the game** by clicking the "Start Game" button
2. **Control the falling pieces** using arrow keys
3. **Complete horizontal lines** to clear them and score points
4. **Level up** by clearing more lines - speed increases with each level
5. **Avoid filling the board** - game ends when pieces reach the top

### Scoring System

- **Line clear**: 100 points × current level
- **Soft drop**: 1 point per cell moved down
- **Hard drop**: 2 points per cell moved down
- **Level progression**: Every 10 lines cleared = new level

## 🛠️ Technical Details

### Technologies Used

- **HTML5** - Semantic markup and structure
- **CSS3** - Modern styling with CSS Grid, Flexbox, and custom properties
- **JavaScript (ES6+)** - Game logic and canvas rendering
- **Canvas API** - 2D graphics rendering
- **Font Awesome** - Icons and visual elements
- **Google Fonts** - Segoe UI typography

### Key Features

- **Object-oriented design** - Clean, maintainable code structure
- **Responsive canvas** - Adapts to different screen sizes
- **Smooth animations** - 60fps rendering with requestAnimationFrame
- **Memory efficient** - Optimized rendering and state management
- **Cross-browser compatible** - Works on all modern browsers

### Browser Support

- ✅ Chrome 60+
- ✅ Firefox 55+
- ✅ Safari 12+
- ✅ Edge 79+


### Easy Modifications

- **Colors**: Update CSS custom properties in `:root`
- **Speed**: Modify timing in `main.js` update function
- **Scoring**: Adjust point values in scoring functions
- **Layout**: Modify CSS Grid and Flexbox properties

### Adding Features

Working on adding the following:

- **Sound effects** - Audio API integration
- **High scores** - LocalStorage implementation
- **Multiplayer** - WebSocket integration
- **Touch controls** - Touch event handlers

## 🐛 Known Issues

- None currently reported

## 🤝 Contributing

Feel free to contribute to this project by:

1. **Forking** the repository
2. **Creating** a feature branch
3. **Making** your changes
4. **Submitting** a pull request

## 📄 License

This project is open source and available under the [MIT License](LICENSE).

---

**Enjoy playing Tetris! 🎮**

_Built with ❤️ by ex2uply_
