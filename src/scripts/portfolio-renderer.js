import { projectsData, skillsData, experienceData } from './data.js';
import { AnimationUtils } from './animations.js';

export class PortfolioRenderer {
    constructor() {
        this.init();
    }

    init() {
        this.renderProjects();
        this.renderSkills();
        this.renderExperience();
        this.setupProjectFiltering();
    }

    renderProjects() {
        const projectsGrid = document.querySelector('.projects-grid');
        if (!projectsGrid) return;

        // Clear existing content
        projectsGrid.innerHTML = '';

        // Combine all projects
        const allProjects = [
            ...projectsData.unity.map(p => ({ ...p, category: 'unity' })),
            ...projectsData.vr.map(p => ({ ...p, category: 'vr' })),
            ...projectsData.modeling.map(p => ({ ...p, category: '3d' }))
        ];

        // Sort by featured and year
        allProjects.sort((a, b) => {
            if (a.featured && !b.featured) return -1;
            if (!a.featured && b.featured) return 1;
            return b.year - a.year;
        });

        allProjects.forEach(project => {
            const projectCard = this.createProjectCard(project);
            projectsGrid.appendChild(projectCard);
        });
    }

    createProjectCard(project) {
        const card = document.createElement('div');
        card.className = 'project-card';
        card.setAttribute('data-category', project.category);
        
        if (project.featured) {
            card.classList.add('featured');
        }

        card.innerHTML = `
            <div class="project-image">
                <div class="project-placeholder">
                    ${this.getCategoryIcon(project.category)}
                    <span class="project-year">${project.year}</span>
                </div>
                ${project.featured ? '<div class="featured-badge">Featured</div>' : ''}
            </div>
            <div class="project-content">
                <h3 class="project-title">${project.title}</h3>
                <p class="project-description">${project.description}</p>
                <div class="project-technologies">
                    ${project.technologies.map(tech => `<span class="tech-badge">${tech}</span>`).join('')}
                </div>
                <div class="project-tags">
                    ${project.tags.map(tag => `<span class="tag">${tag}</span>`).join('')}
                </div>
                <div class="project-links">
                    ${this.createProjectLinks(project.links)}
                </div>
            </div>
        `;

        return card;
    }

    getCategoryIcon(category) {
        const icons = {
            unity: '🎮',
            vr: '🥽',
            '3d': '🎨'
        };
        return icons[category] || '💻';
    }

    createProjectLinks(links) {
        const linkLabels = {
            demo: 'View Demo',
            github: 'GitHub',
            download: 'Download',
            playstore: 'Play Store',
            appstore: 'App Store',
            gallery: 'Gallery',
            explore: 'Explore',
            assets: 'Assets',
            trailer: 'Trailer',
            oculus: 'Oculus Store',
            sketchfab: 'Sketchfab',
            showcase: 'Showcase',
            info: 'More Info'
        };

        return Object.entries(links)
            .map(([key, url]) => {
                if (url && url !== '#') {
                    return `<a href="${url}" class="project-link" target="_blank" rel="noopener">${linkLabels[key] || key}</a>`;
                }
                return `<a href="#" class="project-link disabled">${linkLabels[key] || key}</a>`;
            })
            .join('');
    }

    renderSkills() {
        const skillsGrid = document.querySelector('.skills-grid');
        if (!skillsGrid) return;

        skillsGrid.innerHTML = '';

        Object.entries(skillsData).forEach(([categoryKey, category]) => {
            const skillCategory = document.createElement('div');
            skillCategory.className = 'skill-category';
            
            skillCategory.innerHTML = `
                <h3 class="category-title">${category.title}</h3>
                <div class="skills-list">
                    ${category.skills.map(skill => `
                        <div class="skill-item">
                            <div class="skill-header">
                                <span class="skill-name">${skill.name}</span>
                                <span class="skill-percentage">${skill.level}%</span>
                            </div>
                            <div class="skill-bar">
                                <div class="skill-progress" data-progress="${skill.level}"></div>
                            </div>
                        </div>
                    `).join('')}
                </div>
            `;

            skillsGrid.appendChild(skillCategory);
        });
    }

    renderExperience() {
        const timeline = document.querySelector('.timeline');
        if (!timeline) return;

        timeline.innerHTML = '';

        experienceData.forEach((item, index) => {
            const timelineItem = document.createElement('div');
            timelineItem.className = 'timeline-item';
            
            timelineItem.innerHTML = `
                <div class="timeline-marker ${item.type}"></div>
                <div class="timeline-content">
                    <h3 class="timeline-title">${item.title}</h3>
                    <div class="timeline-meta">
                        <span class="timeline-company">
                            ${item.company}${item.location ? ` • ${item.location}` : ''}
                        </span>
                        <span class="timeline-date">${item.period}</span>
                    </div>
                    <p class="timeline-description">${item.description}</p>
                    ${item.achievements ? `
                        <ul class="timeline-achievements">
                            ${item.achievements.map(achievement => `<li>${achievement}</li>`).join('')}
                        </ul>
                    ` : ''}
                    <div class="timeline-technologies">
                        ${item.technologies.map(tech => `<span class="tech-tag">${tech}</span>`).join('')}
                    </div>
                </div>
            `;

            timeline.appendChild(timelineItem);
        });
    }

    setupProjectFiltering() {
        const filterButtons = document.querySelectorAll('.filter-btn');
        const projectCards = document.querySelectorAll('.project-card');

        filterButtons.forEach(btn => {
            btn.addEventListener('click', () => {
                const filter = btn.getAttribute('data-filter');
                
                // Update active button
                filterButtons.forEach(b => b.classList.remove('active'));
                btn.classList.add('active');

                // Filter projects
                this.filterProjects(filter);
            });
        });
    }

    filterProjects(filter) {
        const projectCards = document.querySelectorAll('.project-card');
        
        projectCards.forEach((card, index) => {
            const category = card.getAttribute('data-category');
            const shouldShow = filter === 'all' || category === filter;
            
            if (shouldShow) {
                card.style.display = 'block';
                AnimationUtils.fadeInUp(card, index * 0.1);
            } else {
                card.style.display = 'none';
            }
        });

        // Update project count
        const visibleProjects = document.querySelectorAll('.project-card[style="display: block"], .project-card:not([style*="display: none"])');
        console.log(`Showing ${visibleProjects.length} projects`);
    }

    // Method to update stats dynamically
    updateStats() {
        const stats = {
            projects: Object.values(projectsData).flat().length,
            experience: new Date().getFullYear() - 2019, // Starting year
            vrApps: projectsData.vr.length + 12 // Additional VR projects not listed
        };

        // Update stat numbers
        document.querySelectorAll('.stat-number').forEach((stat, index) => {
            const targets = [stats.projects, stats.experience, stats.vrApps];
            if (targets[index]) {
                stat.setAttribute('data-target', targets[index]);
            }
        });
    }

    // Method to add new project dynamically
    addProject(projectData, category) {
        if (!projectsData[category]) {
            console.error(`Invalid category: ${category}`);
            return;
        }

        projectsData[category].push(projectData);
        this.renderProjects();
        this.updateStats();
    }

    // Method to highlight featured projects
    highlightFeaturedProjects() {
        const featuredCards = document.querySelectorAll('.project-card.featured');
        featuredCards.forEach((card, index) => {
            setTimeout(() => {
                card.classList.add('highlight-pulse');
                setTimeout(() => {
                    card.classList.remove('highlight-pulse');
                }, 2000);
            }, index * 500);
        });
    }
}

export default PortfolioRenderer;
