# Sakanfar Productions - Portfolio

A modern, interactive portfolio website showcasing game development, VR/AR, and 3D modeling expertise.

## 🚀 Features

- **Interactive 3D Background**: Stunning Three.js particle system and floating geometric shapes
- **Responsive Design**: Optimized for all devices and screen sizes
- **Smooth Animations**: GSAP-powered animations and scroll triggers
- **Modern UI/UX**: Clean, professional design with gradient accents
- **Project Showcase**: Filterable portfolio sections for Unity games, VR/AR projects, and 3D models
- **Skills Visualization**: Animated progress bars and interactive skill displays
- **Professional Timeline**: Experience and education timeline with animations
- **Contact Form**: Interactive contact form with validation

## 🛠️ Technologies Used

- **Three.js** - 3D graphics and WebGL rendering
- **GSAP** - High-performance animations
- **Vite** - Fast build tool and development server
- **HTML5** - Semantic markup
- **CSS3** - Modern styling with flexbox and grid
- **JavaScript ES6+** - Modern JavaScript features

## 🎨 Sections

1. **Hero Section** - Animated introduction with 3D background
2. **About** - Professional overview and specializations
3. **Skills** - Technical skills with animated progress indicators
4. **Projects** - Portfolio showcase with filtering
   - Unity Games
   - VR/AR Applications  
   - 3D Models and Environments
5. **Experience** - Professional timeline
6. **Contact** - Contact form and information

## 🚀 Getting Started

### Prerequisites
- Node.js (v14 or higher)
- npm or yarn

### Installation

1. Clone the repository
```bash
git clone https://github.com/yourusername/sakanfar-portfolio.git
cd sakanfar-portfolio
```

2. Install dependencies
```bash
npm install
```

3. Start the development server
```bash
npm run dev
```

4. Open your browser and navigate to `http://localhost:3000`

### Build for Production

```bash
npm run build
```

The built files will be in the `dist` directory.

## 📁 Project Structure

```
sakanfar-productions/
├── index.html              # Main HTML file
├── package.json            # Dependencies and scripts
├── vite.config.js          # Vite configuration
├── src/
│   ├── main.js            # Main JavaScript entry point
│   ├── styles/
│   │   └── main.css       # Main stylesheet
│   ├── scripts/
│   │   └── animations.js  # Animation utilities
│   └── shaders/
│       └── shaders.js     # Three.js shaders
├── assets/
│   ├── models/            # 3D models
│   └── textures/          # Texture files
└── README.md
```

## 🎯 Customization

### Adding Projects
Edit the projects section in `index.html` to add your own projects:

```html
<div class="project-card" data-category="unity">
    <div class="project-image">
        <img src="path/to/your/image.jpg" alt="Project Name">
    </div>
    <div class="project-content">
        <h3 class="project-title">Your Project Name</h3>
        <p class="project-description">Project description...</p>
        <!-- ... -->
    </div>
</div>
```

### Updating Skills
Modify the skills section with your own technical skills and proficiency levels:

```html
<div class="skill-item">
    <span class="skill-name">Your Skill</span>
    <div class="skill-bar">
        <div class="skill-progress" data-progress="85"></div>
    </div>
</div>
```

### Changing Colors
Update the CSS custom properties in `src/styles/main.css`:

```css
:root {
    --primary-color: #00d4ff;
    --secondary-color: #7b2cbf;
    --background-color: #0a0a0a;
}
```

## 🌐 Deployment

The project can be deployed to any static hosting service:

- **Netlify**: Drag and drop the `dist` folder
- **Vercel**: Connect your GitHub repository
- **GitHub Pages**: Use GitHub Actions to build and deploy
- **AWS S3**: Upload the built files to an S3 bucket

## 📱 Mobile Optimization

The portfolio is fully responsive and includes:
- Touch-friendly navigation
- Optimized 3D performance for mobile devices
- Compressed assets for faster loading
- Mobile-specific animations

## 🔧 Performance Tips

- Images are lazy-loaded for better performance
- Three.js renders are optimized for 60fps
- CSS animations use transform properties for hardware acceleration
- Minimal JavaScript bundle size with tree-shaking

## 📄 License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## 🤝 Contributing

1. Fork the project
2. Create your feature branch (`git checkout -b feature/AmazingFeature`)
3. Commit your changes (`git commit -m 'Add some AmazingFeature'`)
4. Push to the branch (`git push origin feature/AmazingFeature`)
5. Open a Pull Request

## 📞 Contact

**Sakanfar Productions**
- Email: contact@sakanfarproductions.com
- Portfolio: [Live Demo](https://your-portfolio-url.com)

---

Built with ❤️ and Three.js