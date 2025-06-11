// API service for fetching portfolio data
class PortfolioAPI {
    constructor() {
        this.baseURL = 'http://localhost:3002/api';
        this.cache = new Map();
        this.cacheExpiry = 5 * 60 * 1000; // 5 minutes
    }

    // Generic fetch method with caching
    async fetch(endpoint, options = {}) {
        const cacheKey = `${endpoint}-${JSON.stringify(options)}`;
        const cached = this.cache.get(cacheKey);
        
        if (cached && Date.now() - cached.timestamp < this.cacheExpiry) {
            return cached.data;
        }

        try {
            const response = await fetch(`${this.baseURL}${endpoint}`, {
                headers: {
                    'Content-Type': 'application/json',
                    ...options.headers
                },
                ...options
            });

            if (!response.ok) {
                throw new Error(`HTTP error! status: ${response.status}`);
            }

            const data = await response.json();
            
            // Cache the result
            this.cache.set(cacheKey, {
                data,
                timestamp: Date.now()
            });

            return data;
        } catch (error) {
            console.error(`API Error for ${endpoint}:`, error);
            // Return fallback data if available
            return this.getFallbackData(endpoint);
        }
    }

    // Get all portfolio data
    async getPortfolioData() {
        return await this.fetch('/portfolio/data');
    }

    // Get skills data
    async getSkills() {
        const data = await this.getPortfolioData();
        return data.skills || {};
    }

    // Get projects data
    async getProjects() {
        const data = await this.getPortfolioData();
        return data.projects || [];
    }

    // Get about data
    async getAbout() {
        const data = await this.getPortfolioData();
        return data.about || {};
    }

    // Get contact data
    async getContact() {
        const data = await this.getPortfolioData();
        return data.contact || {};
    }

    // Get experience data
    async getExperience() {
        const data = await this.getPortfolioData();
        return data.experience || {};
    }

    // Transform API data to match frontend expectations
    transformSkillsData(apiSkills) {
        const transformedSkills = {};
        
        for (const [category, skills] of Object.entries(apiSkills)) {
            transformedSkills[category] = skills.map(skill => ({
                name: skill.name,
                level: skill.percentage,
                description: skill.description,
                icon: skill.icon
            }));
        }

        return transformedSkills;
    }

    // Transform projects data
    transformProjectsData(apiProjects) {
        return apiProjects.map(project => ({
            id: project.id,
            title: project.title,
            description: project.description,
            image: project.image || '/assets/images/project-placeholder.svg',
            category: project.category,
            tags: project.technologies || [],
            links: {
                demo: project.demo_url,
                github: project.github_url,
                download: project.download_url,
                store: project.store_url
            },
            featured: project.is_featured === 1,
            year: project.year,
            status: project.status
        }));
    }

    // Fallback data for offline/error scenarios
    getFallbackData(endpoint) {
        const fallbackData = {
            '/portfolio/data': {
                about: {
                    title: 'Game Developer & 3D Artist',
                    subtitle: 'Unity Developer | VR/AR Specialist | 3D Modeling Expert',
                    description: 'Passionate game developer with expertise in Unity, VR/AR experiences, and 3D modeling.',
                    greeting: 'Hello, I\'m',
                    hero_description: 'Crafting immersive digital experiences through innovative game development.'
                },
                skills: {
                    unity: [
                        { name: 'Unity 3D', percentage: 95, description: 'Advanced Unity development' },
                        { name: 'C# Programming', percentage: 90, description: 'Expert C# programming' }
                    ],
                    vr: [
                        { name: 'Oculus Development', percentage: 92, description: 'VR development' }
                    ],
                    modeling: [
                        { name: 'Blender', percentage: 90, description: '3D modeling and animation' }
                    ]
                },
                projects: [],
                experience: {},
                contact: {}
            }
        };

        return fallbackData[endpoint] || {};
    }

    // Clear cache
    clearCache() {
        this.cache.clear();
    }
}

// Create singleton instance
const portfolioAPI = new PortfolioAPI();

export default portfolioAPI;
