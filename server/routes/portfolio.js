const express = require('express');
const db = require('../database/db');

const router = express.Router();

// Get all portfolio data (public endpoint)
router.get('/data', async (req, res) => {
    try {
        // Get about information
        const about = await db.get('SELECT * FROM about ORDER BY id DESC LIMIT 1');
        
        // Get contact information
        const contact = await db.get('SELECT * FROM contact_info ORDER BY id DESC LIMIT 1');
        
        // Get site settings
        const settings = await db.get('SELECT * FROM site_settings ORDER BY id DESC LIMIT 1');
        
        // Get skills by category
        const skills = await db.all(`
            SELECT * FROM skills 
            WHERE is_active = 1 
            ORDER BY category, order_index, name
        `);
        
        // Group skills by category
        const skillsData = {};
        skills.forEach(skill => {
            if (!skillsData[skill.category]) {
                skillsData[skill.category] = [];
            }
            skillsData[skill.category].push({
                id: skill.id,
                name: skill.name,
                percentage: skill.percentage,
                description: skill.description,
                icon: skill.icon
            });
        });
        
        // Get projects with their technologies and tags
        const projects = await db.all(`
            SELECT * FROM projects 
            WHERE is_active = 1 
            ORDER BY is_featured DESC, order_index, year DESC
        `);
        
        // Get technologies and tags for each project
        const projectsData = {};
        for (const project of projects) {
            const technologies = await db.all(
                'SELECT technology FROM project_technologies WHERE project_id = ?',
                [project.id]
            );
            const tags = await db.all(
                'SELECT tag FROM project_tags WHERE project_id = ?',
                [project.id]
            );
            
            if (!projectsData[project.category]) {
                projectsData[project.category] = [];
            }
            
            projectsData[project.category].push({
                id: project.id,
                title: project.title,
                description: project.description,
                image: project.image,
                demo_url: project.demo_url,
                github_url: project.github_url,
                download_url: project.download_url,
                store_url: project.store_url,
                is_featured: Boolean(project.is_featured),
                year: project.year,
                status: project.status,
                technologies: technologies.map(t => t.technology),
                tags: tags.map(t => t.tag),
                links: {
                    demo: project.demo_url,
                    github: project.github_url,
                    download: project.download_url,
                    store: project.store_url
                }
            });
        }
        
        // Get experience with achievements and technologies
        const experiences = await db.all(`
            SELECT * FROM experience 
            WHERE is_active = 1 
            ORDER BY start_date DESC
        `);
        
        const experienceData = [];
        for (const exp of experiences) {
            const achievements = await db.all(
                'SELECT achievement FROM experience_achievements WHERE experience_id = ?',
                [exp.id]
            );
            const technologies = await db.all(
                'SELECT technology FROM experience_technologies WHERE experience_id = ?',
                [exp.id]
            );
            
            experienceData.push({
                id: exp.id,
                title: exp.title,
                company: exp.company,
                location: exp.location,
                start_date: exp.start_date,
                end_date: exp.end_date,
                is_current: Boolean(exp.is_current),
                description: exp.description,
                type: exp.type,
                achievements: achievements.map(a => a.achievement),
                technologies: technologies.map(t => t.technology)
            });
        }
        
        res.json({
            about: about || {},
            contact: contact || {},
            settings: settings || {},
            skills: skillsData,
            projects: projectsData,
            experience: experienceData
        });
    } catch (error) {
        console.error('Error fetching portfolio data:', error);
        res.status(500).json({ error: 'Failed to fetch portfolio data' });
    }
});

// Get projects by category (public endpoint)
router.get('/projects/:category', async (req, res) => {
    try {
        const { category } = req.params;
        
        const projects = await db.all(`
            SELECT * FROM projects 
            WHERE category = ? AND is_active = 1 
            ORDER BY is_featured DESC, order_index, year DESC
        `, [category]);
        
        const projectsWithDetails = [];
        for (const project of projects) {
            const technologies = await db.all(
                'SELECT technology FROM project_technologies WHERE project_id = ?',
                [project.id]
            );
            const tags = await db.all(
                'SELECT tag FROM project_tags WHERE project_id = ?',
                [project.id]
            );
            
            projectsWithDetails.push({
                ...project,
                technologies: technologies.map(t => t.technology),
                tags: tags.map(t => t.tag),
                is_featured: Boolean(project.is_featured),
                links: {
                    demo: project.demo_url,
                    github: project.github_url,
                    download: project.download_url,
                    store: project.store_url
                }
            });
        }
        
        res.json(projectsWithDetails);
    } catch (error) {
        console.error('Error fetching projects:', error);
        res.status(500).json({ error: 'Failed to fetch projects' });
    }
});

// Get featured projects (public endpoint)
router.get('/projects/featured', async (req, res) => {
    try {
        const projects = await db.all(`
            SELECT * FROM projects 
            WHERE is_featured = 1 AND is_active = 1 
            ORDER BY order_index, year DESC
        `);
        
        const featuredProjects = [];
        for (const project of projects) {
            const technologies = await db.all(
                'SELECT technology FROM project_technologies WHERE project_id = ?',
                [project.id]
            );
            const tags = await db.all(
                'SELECT tag FROM project_tags WHERE project_id = ?',
                [project.id]
            );
            
            featuredProjects.push({
                ...project,
                technologies: technologies.map(t => t.technology),
                tags: tags.map(t => t.tag),
                is_featured: Boolean(project.is_featured),
                links: {
                    demo: project.demo_url,
                    github: project.github_url,
                    download: project.download_url,
                    store: project.store_url
                }
            });
        }
        
        res.json(featuredProjects);
    } catch (error) {
        console.error('Error fetching featured projects:', error);
        res.status(500).json({ error: 'Failed to fetch featured projects' });
    }
});

// Get skills by category (public endpoint)
router.get('/skills/:category', async (req, res) => {
    try {
        const { category } = req.params;
        
        const skills = await db.all(`
            SELECT * FROM skills 
            WHERE category = ? AND is_active = 1 
            ORDER BY order_index, name
        `, [category]);
        
        res.json(skills);
    } catch (error) {
        console.error('Error fetching skills:', error);
        res.status(500).json({ error: 'Failed to fetch skills' });
    }
});

module.exports = router;