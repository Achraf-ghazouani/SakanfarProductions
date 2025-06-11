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
        }        // Settings form
        const settingsForm = document.getElementById('settings-form');
        if (settingsForm) {
            settingsForm.addEventListener('submit', (e) => this.handleSettingsSubmit(e));
        }

        // Project form
        const projectForm = document.getElementById('project-form');
        if (projectForm) {
            projectForm.addEventListener('submit', (e) => this.handleProjectSubmit(e));
        }

        // Skill form
        const skillForm = document.getElementById('skill-form');
        if (skillForm) {
            skillForm.addEventListener('submit', (e) => this.handleSkillSubmit(e));
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
    }    renderProjectsList(projects) {
        const container = document.getElementById('projects-list');
        
        let html = `
            <div class="section-header">
                <button class="btn btn-success" onclick="admin.openProjectModal()">Add New Project</button>
            </div>
            <div id="projects-alert"></div>
        `;

        if (projects.length === 0) {
            html += '<p>No projects found. Click "Add New Project" to get started.</p>';
        } else {
            html += '<div class="projects-grid">';
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
        }

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
    }    // Project Management Methods
    openProjectModal(projectId = null) {
        const modal = document.getElementById('project-modal');
        const form = document.getElementById('project-form');
        const title = document.getElementById('project-modal-title');
        
        // Reset form
        form.reset();
        
        if (projectId) {
            // Edit mode
            title.textContent = 'Edit Project';
            this.loadProjectForEdit(projectId);
        } else {
            // Add mode
            title.textContent = 'Add New Project';
            document.getElementById('project-id').value = '';
        }
        
        modal.classList.add('show');
    }

    async loadProjectForEdit(projectId) {
        try {
            const projects = await this.apiCall('/admin/projects');
            const project = projects.find(p => p.id == projectId);
            
            if (project) {
                document.getElementById('project-id').value = project.id;
                document.getElementById('project-title').value = project.title || '';
                document.getElementById('project-description').value = project.description || '';
                document.getElementById('project-category').value = project.category || '';
                document.getElementById('project-year').value = project.year || '';
                document.getElementById('project-status').value = project.status || 'completed';
                document.getElementById('project-demo-url').value = project.demo_url || '';
                document.getElementById('project-github-url').value = project.github_url || '';
                document.getElementById('project-technologies').value = project.technologies ? project.technologies.join(', ') : '';
                document.getElementById('project-tags').value = project.tags ? project.tags.join(', ') : '';
                document.getElementById('project-featured').checked = project.is_featured || false;
            }
        } catch (error) {
            console.error('Failed to load project for edit:', error);
            this.showAlert('projects-alert', 'Failed to load project data', 'error');
        }
    }

    async handleProjectSubmit(e) {
        e.preventDefault();
        
        const formData = new FormData(e.target);
        const projectId = formData.get('id');
        
        const projectData = {
            title: formData.get('title'),
            description: formData.get('description'),
            category: formData.get('category'),
            year: parseInt(formData.get('year')) || null,
            status: formData.get('status') || 'completed',
            demo_url: formData.get('demo_url'),
            github_url: formData.get('github_url'),
            is_featured: formData.has('is_featured'),
            technologies: formData.get('technologies') ? formData.get('technologies').split(',').map(t => t.trim()).filter(t => t) : [],
            tags: formData.get('tags') ? formData.get('tags').split(',').map(t => t.trim()).filter(t => t) : []
        };

        try {
            if (projectId) {
                // Update existing project
                await this.apiCall(`/admin/projects/${projectId}`, {
                    method: 'PUT',
                    body: JSON.stringify(projectData)
                });
                this.showAlert('projects-alert', 'Project updated successfully!', 'success');
            } else {
                // Create new project
                await this.apiCall('/admin/projects', {
                    method: 'POST',
                    body: JSON.stringify(projectData)
                });
                this.showAlert('projects-alert', 'Project created successfully!', 'success');
            }
            
            this.closeModal('project-modal');
            await this.loadProjectsData();
            
        } catch (error) {
            console.error('Failed to save project:', error);
            this.showAlert('projects-alert', error.message, 'error');
        }
    }

    editProject(id) {
        this.openProjectModal(id);
    }

    async deleteProject(id) {
        if (!confirm('Are you sure you want to delete this project? This action cannot be undone.')) {
            return;
        }

        try {
            await this.apiCall(`/admin/projects/${id}`, {
                method: 'DELETE'
            });
            
            this.showAlert('projects-alert', 'Project deleted successfully!', 'success');
            await this.loadProjectsData();
            
        } catch (error) {
            console.error('Failed to delete project:', error);
            this.showAlert('projects-alert', error.message, 'error');
        }
    }

    // Skill Management Methods
    openSkillModal(skillId = null) {
        const modal = document.getElementById('skill-modal');
        const form = document.getElementById('skill-form');
        const title = document.getElementById('skill-modal-title');
        
        // Reset form
        form.reset();
        
        if (skillId) {
            // Edit mode
            title.textContent = 'Edit Skill';
            this.loadSkillForEdit(skillId);
        } else {
            // Add mode
            title.textContent = 'Add New Skill';
            document.getElementById('skill-id').value = '';
        }
        
        modal.classList.add('show');
    }

    async loadSkillForEdit(skillId) {
        try {
            const skills = await this.apiCall('/admin/skills');
            const skill = skills.find(s => s.id == skillId);
            
            if (skill) {
                document.getElementById('skill-id').value = skill.id;
                document.getElementById('skill-name').value = skill.name || '';
                document.getElementById('skill-category').value = skill.category || '';
                document.getElementById('skill-percentage').value = skill.percentage || '';
                document.getElementById('skill-description').value = skill.description || '';
                document.getElementById('skill-icon').value = skill.icon || '';
            }
        } catch (error) {
            console.error('Failed to load skill for edit:', error);
            this.showAlert('skills-alert', 'Failed to load skill data', 'error');
        }
    }

    async handleSkillSubmit(e) {
        e.preventDefault();
        
        const formData = new FormData(e.target);
        const skillId = formData.get('id');
        
        const skillData = {
            name: formData.get('name'),
            category: formData.get('category'),
            percentage: parseInt(formData.get('percentage')),
            description: formData.get('description'),
            icon: formData.get('icon')
        };

        try {
            if (skillId) {
                // Update existing skill
                await this.apiCall(`/admin/skills/${skillId}`, {
                    method: 'PUT',
                    body: JSON.stringify(skillData)
                });
                this.showAlert('skills-alert', 'Skill updated successfully!', 'success');
            } else {
                // Create new skill
                await this.apiCall('/admin/skills', {
                    method: 'POST',
                    body: JSON.stringify(skillData)
                });
                this.showAlert('skills-alert', 'Skill created successfully!', 'success');
            }
            
            this.closeModal('skill-modal');
            await this.loadSkillsData();
            
        } catch (error) {
            console.error('Failed to save skill:', error);
            this.showAlert('skills-alert', error.message, 'error');
        }
    }

    editSkill(id) {
        this.openSkillModal(id);
    }

    async deleteSkill(id) {
        if (!confirm('Are you sure you want to delete this skill? This action cannot be undone.')) {
            return;
        }

        try {
            await this.apiCall(`/admin/skills/${id}`, {
                method: 'DELETE'
            });
            
            this.showAlert('skills-alert', 'Skill deleted successfully!', 'success');
            await this.loadSkillsData();
            
        } catch (error) {
            console.error('Failed to delete skill:', error);
            this.showAlert('skills-alert', error.message, 'error');
        }
    }

    // Modal Management
    closeModal(modalId) {
        const modal = document.getElementById(modalId);
        modal.classList.remove('show');
    }
}

// Initialize the admin dashboard
const admin = new AdminDashboard();

// Global logout function
function logout() {
    admin.logout();
}