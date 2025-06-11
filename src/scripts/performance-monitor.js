export class PerformanceMonitor {
    constructor() {
        this.metrics = {
            fps: 0,
            frameCount: 0,
            lastTime: performance.now(),
            memoryUsage: 0
        };
        
        this.isMonitoring = false;
        this.debugMode = false;
        
        this.init();
    }

    init() {
        // Check if we should enable debug mode
        const urlParams = new URLSearchParams(window.location.search);
        this.debugMode = urlParams.get('debug') === 'true';
        
        if (this.debugMode) {
            this.createDebugPanel();
            this.startMonitoring();
        }

        // Monitor performance automatically on low-end devices
        if (this.isLowEndDevice()) {
            this.optimizeForLowEnd();
        }
    }

    isLowEndDevice() {
        // Check various indicators of low-end devices
        const checks = {
            cores: navigator.hardwareConcurrency <= 2,
            memory: navigator.deviceMemory && navigator.deviceMemory <= 4,
            connection: navigator.connection && navigator.connection.effectiveType === 'slow-2g',
            userAgent: /Android.*Chrome\/[2-3][0-9]/.test(navigator.userAgent)
        };

        return Object.values(checks).some(check => check);
    }

    optimizeForLowEnd() {
        console.log('Low-end device detected, applying optimizations...');
        
        // Add performance class to document
        document.documentElement.classList.add('low-performance');
        
        // Reduce particle count
        const event = new CustomEvent('optimizePerformance', {
            detail: { 
                particleCount: 500,
                reduceQuality: true,
                disableAdvancedEffects: true
            }
        });
        window.dispatchEvent(event);
    }

    startMonitoring() {
        this.isMonitoring = true;
        this.monitorFrame();
        
        // Monitor memory usage if available
        if (performance.memory) {
            setInterval(() => {
                this.updateMemoryUsage();
            }, 5000);
        }
    }

    monitorFrame() {
        if (!this.isMonitoring) return;

        const now = performance.now();
        this.metrics.frameCount++;

        if (now >= this.metrics.lastTime + 1000) {
            this.metrics.fps = Math.round((this.metrics.frameCount * 1000) / (now - this.metrics.lastTime));
            this.metrics.frameCount = 0;
            this.metrics.lastTime = now;

            if (this.debugMode) {
                this.updateDebugPanel();
            }

            // Auto-optimize if FPS drops too low
            if (this.metrics.fps < 30) {
                this.handleLowFPS();
            }
        }

        requestAnimationFrame(() => this.monitorFrame());
    }

    updateMemoryUsage() {
        if (performance.memory) {
            this.metrics.memoryUsage = Math.round(performance.memory.usedJSHeapSize / 1048576); // MB
        }
    }

    handleLowFPS() {
        console.warn(`Low FPS detected: ${this.metrics.fps}`);
        
        // Dispatch optimization event
        const event = new CustomEvent('optimizePerformance', {
            detail: { 
                reason: 'low_fps',
                fps: this.metrics.fps,
                reduceQuality: true
            }
        });
        window.dispatchEvent(event);
    }

    createDebugPanel() {
        const panel = document.createElement('div');
        panel.id = 'debug-panel';
        panel.style.cssText = `
            position: fixed;
            top: 80px;
            right: 20px;
            background: rgba(0, 0, 0, 0.8);
            color: white;
            padding: 15px;
            border-radius: 8px;
            font-family: monospace;
            font-size: 12px;
            z-index: 10000;
            min-width: 200px;
        `;
        
        document.body.appendChild(panel);
    }

    updateDebugPanel() {
        const panel = document.getElementById('debug-panel');
        if (!panel) return;

        panel.innerHTML = `
            <h4>Performance Debug</h4>
            <div>FPS: ${this.metrics.fps}</div>
            <div>Memory: ${this.metrics.memoryUsage} MB</div>
            <div>Cores: ${navigator.hardwareConcurrency || 'Unknown'}</div>
            <div>Device Memory: ${navigator.deviceMemory || 'Unknown'} GB</div>
            <div>Connection: ${navigator.connection?.effectiveType || 'Unknown'}</div>
            <div>User Agent: ${navigator.userAgent.slice(0, 50)}...</div>
        `;
    }

    // Method to manually trigger optimizations
    optimize(level = 'medium') {
        const optimizations = {
            low: {
                particleCount: 1000,
                shaderQuality: 'medium',
                shadows: true
            },
            medium: {
                particleCount: 500,
                shaderQuality: 'low',
                shadows: false
            },
            high: {
                particleCount: 200,
                shaderQuality: 'minimal',
                shadows: false,
                disableParticles: false
            }
        };

        const settings = optimizations[level];
        console.log(`Applying ${level} optimization:`, settings);

        const event = new CustomEvent('optimizePerformance', {
            detail: settings
        });
        window.dispatchEvent(event);
    }

    // Get performance recommendations
    getRecommendations() {
        const recommendations = [];

        if (this.metrics.fps < 60) {
            recommendations.push('Consider reducing particle count or visual effects');
        }

        if (this.metrics.memoryUsage > 100) {
            recommendations.push('High memory usage detected, consider optimizing assets');
        }

        if (this.isLowEndDevice()) {
            recommendations.push('Low-end device detected, performance optimizations applied');
        }

        return recommendations;
    }

    // Export performance data
    exportMetrics() {
        return {
            ...this.metrics,
            timestamp: new Date().toISOString(),
            userAgent: navigator.userAgent,
            deviceInfo: {
                cores: navigator.hardwareConcurrency,
                memory: navigator.deviceMemory,
                connection: navigator.connection?.effectiveType
            },
            recommendations: this.getRecommendations()
        };
    }
}

export default PerformanceMonitor;
