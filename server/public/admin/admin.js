// Admin Dashboard JavaScript
class AdminDashboard {
    constructor() {
        this.apiBase = '/api';
        this.token = localStorage.getItem('admin_token');
        this.currentUser = null;
        
        this.init();
    }

    init() {
        // Check if user is already logged in
        if (this.token) {
            this.verifyToken();
        } else {
            this.showLogin();
        }

        // Setup event listeners
        this.setupEventListeners();
    }

    setupEventListeners() {
        // Login form
        const loginForm = document.getElementById('login-form');
        if (loginForm) {
            loginForm.addEventListener('submit', (e) => this.handleLogin(e));
        }

        // Tab navigation
        document.querySelectorAll('.tab').forEach(tab => {
            tab.addEventListener('click', (e) => this.switchTab(e.target.dataset.tab));
        });

        // About form
        const aboutForm = document.getElementById('about-form');
        if (aboutForm) {
            aboutForm.addEventListener('submit', (e) => this.handleAboutSubmit(e));
        }

        // Settings form
        const settingsForm = document.getElementById('settings-form');
        if (settingsForm) {
            settingsForm.addEventListener('submit', (e) => this.handleSettingsSubmit(e));
        }
    }

    async apiCall(endpoint, options = {}) {
        const url = `${this.apiBase}${endpoint}`;
        const config = {
            headers: {
                'Content-Type': 'application/json',
                ...(this.token && { 'Authorization': `Bearer ${this.token}` })
            },
            ...options
        };

        try {
            const response = await fetch(url, config);
            const data = await response.json();

            if (!response.ok) {
                throw new Error(data.error || 'Request failed');
            }

            return data;
        } catch (error) {
            console.error('API call failed:', error);
            throw error;
        }
    }

    async verifyToken() {
        try {
            const response = await this.apiCall('/auth/verify');
            this.currentUser = response.user;
            this.showDashboard();
            this.loadDashboardData();
        } catch (error) {
            console.error('Token verification failed:', error);
            this.logout();
        }
    }

    async handleLogin(e) {
        e.preventDefault();
        
        const formData = new FormData(e.target);
        const credentials = {
            username: formData.get('username'),
            password: formData.get('password')
        };

        try {
            this.showAlert('login-alert', 'Signing in...', 'info');
            
            const response = await this.apiCall('/auth/login', {
                method: 'POST',
                body: JSON.stringify(credentials)
            });

            this.token = response.token;
            this.currentUser = response.user;
            localStorage.setItem('admin_token', this.token);

            this.showDashboard();
            this.loadDashboardData();
            
        } catch (error) {
            this.showAlert('login-alert', error.message, 'error');
        }
    }

    logout() {
        this.token = null;
        this.currentUser = null;
        localStorage.removeItem('admin_token');
        this.showLogin();
    }

    showLogin() {
        document.getElementById('login-container').style.display = 'block';
        document.getElementById('main-app').style.display = 'none';
    }

    showDashboard() {
        document.getElementById('login-container').style.display = 'none';
        document.getElementById('main-app').style.display = 'block';
    }

    switchTab(tabName) {
        // Remove active class from all tabs and contents
        document.querySelectorAll('.tab').forEach(tab => tab.classList.remove('active'));
        document.querySelectorAll('.tab-content').forEach(content => content.classList.remove('active'));

        // Add active class to selected tab and content
        document.querySelector(`[data-tab="${tabName}"]`).classList.add('active');
        document.getElementById(`${tabName}-tab`).classList.add('active');

        // Load tab-specific data
        this.loadTabData(tabName);
    }

    async loadDashboardData() {
        try {
            // Load about information
            await this.loadAboutData();
            
            // Load other data as needed
            await this.loadTabData('about');
        } catch (error) {
            console.error('Failed to load dashboard data:', error);
        }
    }

    async loadTabData(tabName) {
        switch (tabName) {
            case 'about':
                await this.loadAboutData();
                break;
            case 'projects':
                await this.loadProjectsData();
                break;
            case 'skills':
                await this.loadSkillsData();
                break;
            case 'settings':
                await this.loadSettingsData();
                break;
        }
    }

    async loadAboutData() {
        try {
            const about = await this.apiCall('/admin/about');
            
            // Populate form fields
            if (about) {
                document.getElementById('about-title').value = about.title || '';
                document.getElementById('about-description').value = about.description || '';
            }
        } catch (error) {
            console.error('Failed to load about data:', error);
            this.showAlert('about-alert', 'Failed to load about information', 'error');
        }
    }

    async handleAboutSubmit(e) {
        e.preventDefault();
        
        const formData = new FormData(e.target);
        const aboutData = {
            title: formData.get('title'),
            description: formData.get('description')
        };

        try {
            await this.apiCall('/admin/about', {
                method: 'POST',
                body: JSON.stringify(aboutData)
            });

            this.showAlert('about-alert', 'About information saved successfully!', 'success');
        } catch (error) {
            this.showAlert('about-alert', error.message, 'error');
        }
    }

    async loadProjectsData() {
        try {
            const projects = await this.apiCall('/admin/projects');
            this.renderProjectsList(projects);
        } catch (error) {
            console.error('Failed to load projects:', error);
            this.showAlert('projects-alert', 'Failed to load projects', 'error');
        }
    }

    renderProjectsList(projects) {
        const container = document.getElementById('projects-list');
        
        if (projects.length === 0) {
            container.innerHTML = '<p>No projects found. <a href="#" onclick="admin.openProjectModal()">Add your first project</a></p>';
            return;
        }

        let html = '<div class="projects-grid">';
        projects.forEach(project => {
            html += `
                <div class="project-card">
                    <h3>${project.title}</h3>
                    <p>${project.description || 'No description'}</p>
                    <div class="project-meta">
                        <span class="badge">${project.category}</span>
                        ${project.is_featured ? '<span class="badge featured">Featured</span>' : ''}
                        <span class="year">${project.year || 'N/A'}</span>
                    </div>
                    <div class="project-actions">
                        <button class="btn btn-sm" onclick="admin.editProject(${project.id})">Edit</button>
                        <button class="btn btn-sm btn-danger" onclick="admin.deleteProject(${project.id})">Delete</button>
                    </div>
                </div>
            `;
        });
        html += '</div>';

        container.innerHTML = html;
    }

    async loadSkillsData() {
        try {
            const skills = await this.apiCall('/admin/skills');
            this.renderSkillsList(skills);
        } catch (error) {
            console.error('Failed to load skills:', error);
            this.showAlert('skills-alert', 'Failed to load skills', 'error');
        }
    }

    renderSkillsList(skills) {
        const container = document.getElementById('skills-list');
        
        if (skills.length === 0) {
            container.innerHTML = '<p>No skills found. <a href="#" onclick="admin.openSkillModal()">Add your first skill</a></p>';
            return;
        }

        // Group skills by category
        const groupedSkills = skills.reduce((acc, skill) => {
            if (!acc[skill.category]) {
                acc[skill.category] = [];
            }
            acc[skill.category].push(skill);
            return acc;
        }, {});

        let html = '';
        Object.entries(groupedSkills).forEach(([category, categorySkills]) => {
            html += `
                <div class="skill-category">
                    <h3>${category}</h3>
                    <div class="skills-grid">
            `;
            
            categorySkills.forEach(skill => {
                html += `
                    <div class="skill-card">
                        <h4>${skill.name}</h4>
                        <div class="skill-percentage">${skill.percentage}%</div>
                        <div class="skill-actions">
                            <button class="btn btn-sm" onclick="admin.editSkill(${skill.id})">Edit</button>
                            <button class="btn btn-sm btn-danger" onclick="admin.deleteSkill(${skill.id})">Delete</button>
                        </div>
                    </div>
                `;
            });
            
            html += `
                    </div>
                </div>
            `;
        });

        container.innerHTML = html;
    }

    async loadSettingsData() {
        try {
            // For now, just show the form
            // Later we can load actual settings
        } catch (error) {
            console.error('Failed to load settings:', error);
        }
    }

    async handleSettingsSubmit(e) {
        e.preventDefault();
        
        const formData = new FormData(e.target);
        const settingsData = {
            site_title: formData.get('site_title')
        };

        try {
            // For now, just show success message
            // Later implement actual settings save
            this.showAlert('settings-alert', 'Settings saved successfully!', 'success');
        } catch (error) {
            this.showAlert('settings-alert', error.message, 'error');
        }
    }

    showAlert(containerId, message, type = 'info') {
        const container = document.getElementById(containerId);
        if (!container) return;

        const alertClass = type === 'error' ? 'alert-error' : 
                          type === 'success' ? 'alert-success' : 'alert-info';

        container.innerHTML = `<div class="alert ${alertClass}">${message}</div>`;

        // Auto-hide after 5 seconds
        setTimeout(() => {
            container.innerHTML = '';
        }, 5000);
    }

    // Placeholder methods for project/skill management
    openProjectModal() {
        alert('Project modal - Coming soon!');
    }

    editProject(id) {
        alert(`Edit project ${id} - Coming soon!`);
    }

    deleteProject(id) {
        if (confirm('Are you sure you want to delete this project?')) {
            alert(`Delete project ${id} - Coming soon!`);
        }
    }

    openSkillModal() {
        alert('Skill modal - Coming soon!');
    }

    editSkill(id) {
        alert(`Edit skill ${id} - Coming soon!`);
    }

    deleteSkill(id) {
        if (confirm('Are you sure you want to delete this skill?')) {
            alert(`Delete skill ${id} - Coming soon!`);
        }
    }
}

// Initialize the admin dashboard
const admin = new AdminDashboard();

// Global logout function
function logout() {
    admin.logout();
}