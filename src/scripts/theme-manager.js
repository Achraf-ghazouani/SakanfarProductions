export class ThemeManager {
    constructor() {
        this.currentTheme = 'dark'; // Default theme
        this.init();
    }

    init() {
        // Check for saved theme preference or default to dark
        const savedTheme = localStorage.getItem('portfolio-theme');
        const systemPreference = window.matchMedia('(prefers-color-scheme: light)').matches ? 'light' : 'dark';
        
        this.currentTheme = savedTheme || systemPreference;
        this.applyTheme(this.currentTheme);
        this.createThemeToggle();
        this.setupSystemThemeListener();
    }

    createThemeToggle() {
        // Create theme toggle button
        const themeToggle = document.createElement('button');
        themeToggle.className = 'theme-toggle';
        themeToggle.setAttribute('aria-label', 'Toggle theme');
        themeToggle.innerHTML = `
            <span class="theme-icon sun">☀️</span>
            <span class="theme-icon moon">🌙</span>
        `;

        // Add to navigation
        const nav = document.querySelector('.nav');
        if (nav) {
            nav.appendChild(themeToggle);
        }

        // Add event listener
        themeToggle.addEventListener('click', () => {
            this.toggleTheme();
        });

        this.updateToggleIcon(themeToggle);
    }

    toggleTheme() {
        this.currentTheme = this.currentTheme === 'light' ? 'dark' : 'light';
        this.applyTheme(this.currentTheme);
        this.saveTheme();
        
        // Update toggle button
        const themeToggle = document.querySelector('.theme-toggle');
        if (themeToggle) {
            this.updateToggleIcon(themeToggle);
        }

        // Animate theme transition
        this.animateThemeTransition();

        // Dispatch custom event for other components to listen
        window.dispatchEvent(new CustomEvent('themeChanged', { 
            detail: { theme: this.currentTheme } 
        }));
    }

    applyTheme(theme) {
        document.documentElement.setAttribute('data-theme', theme);
        document.body.className = document.body.className.replace(/theme-\w+/g, '') + ` theme-${theme}`;
        
        // Update CSS custom properties
        this.updateCSSVariables();
        
        // Update meta theme color for mobile browsers
        const metaThemeColor = document.querySelector('meta[name="theme-color"]');
        if (metaThemeColor) {
            metaThemeColor.setAttribute('content', theme === 'light' ? '#ffffff' : '#0a0a0a');
        } else {
            const meta = document.createElement('meta');
            meta.name = 'theme-color';
            meta.content = theme === 'light' ? '#ffffff' : '#0a0a0a';
            document.head.appendChild(meta);
        }
    }

    updateToggleIcon(toggle) {
        const sun = toggle.querySelector('.sun');
        const moon = toggle.querySelector('.moon');
        
        if (this.currentTheme === 'light') {
            sun.style.opacity = '0';
            moon.style.opacity = '1';
            toggle.setAttribute('aria-label', 'Switch to dark mode');
        } else {
            sun.style.opacity = '1';
            moon.style.opacity = '0';
            toggle.setAttribute('aria-label', 'Switch to light mode');
        }
    }

    animateThemeTransition() {
        document.body.style.transition = 'background-color 0.3s ease, color 0.3s ease';
        
        setTimeout(() => {
            document.body.style.transition = '';
        }, 300);
    }

    saveTheme() {
        localStorage.setItem('portfolio-theme', this.currentTheme);
    }

    setupSystemThemeListener() {
        const mediaQuery = window.matchMedia('(prefers-color-scheme: light)');
        mediaQuery.addListener((e) => {
            // Only auto-switch if user hasn't manually set a preference
            if (!localStorage.getItem('portfolio-theme')) {
                this.currentTheme = e.matches ? 'light' : 'dark';
                this.applyTheme(this.currentTheme);
                
                const themeToggle = document.querySelector('.theme-toggle');
                if (themeToggle) {
                    this.updateToggleIcon(themeToggle);
                }
            }
        });
    }

    // Get current theme colors for Three.js scene
    getThemeColors() {
        const themes = {
            light: {
                background: '#ffffff',
                primary: '#2563eb', // Blue
                secondary: '#7c3aed', // Purple
                text: '#1f2937',
                accent: '#0ea5e9',
                surface: '#f8fafc',
                border: '#e2e8f0'
            },
            dark: {
                background: '#0a0a0a',
                primary: '#00d4ff',
                secondary: '#7b2cbf',
                text: '#ffffff',
                accent: '#00d4ff',
                surface: '#1a1a2e',
                border: '#2d2d3a'
            }
        };

        return themes[this.currentTheme];
    }

    // Update CSS custom properties
    updateCSSVariables() {
        const colors = this.getThemeColors();
        const root = document.documentElement;
        
        Object.entries(colors).forEach(([key, value]) => {
            root.style.setProperty(`--color-${key}`, value);
        });
    }

    // Update Three.js scene colors based on theme
    updateSceneTheme(scene, renderer) {
        const colors = this.getThemeColors();
        
        // Update renderer clear color
        renderer.setClearColor(colors.background, 0);
        
        // Update fog if exists
        if (scene.fog) {
            scene.fog.color.setHex(colors.background.replace('#', '0x'));
        }

        // Update particle colors
        const particles = scene.getObjectByName('particles');
        if (particles && particles.material.uniforms) {
            particles.material.uniforms.uColor1.value.setHex(colors.primary.replace('#', '0x'));
            particles.material.uniforms.uColor2.value.setHex(colors.secondary.replace('#', '0x'));
        }

        // Update geometry shapes
        scene.traverse((child) => {
            if (child.isMesh && child.material.uniforms) {
                if (child.material.uniforms.uColor1) {
                    child.material.uniforms.uColor1.value.setHex(colors.primary.replace('#', '0x'));
                }
                if (child.material.uniforms.uColor2) {
                    child.material.uniforms.uColor2.value.setHex(colors.secondary.replace('#', '0x'));
                }
            }
        });
    }

    // Method to get theme-aware gradient
    getThemeGradient() {
        const colors = this.getThemeColors();
        return `linear-gradient(135deg, ${colors.primary}, ${colors.secondary})`;
    }
}

export default ThemeManager;