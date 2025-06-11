const express = require('express');
const { body, validationResult } = require('express-validator');
const { authenticateToken } = require('./auth');
const db = require('../database/db');

const router = express.Router();

// Apply authentication middleware to all admin routes
router.use(authenticateToken);

// ABOUT SECTION MANAGEMENT
// Get about information
router.get('/about', async (req, res) => {
    try {
        const about = await db.get('SELECT * FROM about ORDER BY id DESC LIMIT 1');
        res.json(about || {});
    } catch (error) {
        console.error('Error fetching about:', error);
        res.status(500).json({ error: 'Failed to fetch about information' });
    }
});

// Update about information
router.post('/about', [
    body('title').notEmpty().withMessage('Title is required'),
    body('description').notEmpty().withMessage('Description is required')
], async (req, res) => {
    try {
        const errors = validationResult(req);
        if (!errors.isEmpty()) {
            return res.status(400).json({ errors: errors.array() });
        }

        const { title, subtitle, description, greeting, hero_description, profile_image, resume_url } = req.body;

        // Check if about entry exists
        const existing = await db.get('SELECT id FROM about ORDER BY id DESC LIMIT 1');
        
        if (existing) {
            // Update existing
            await db.run(`
                UPDATE about SET 
                title = ?, subtitle = ?, description = ?, greeting = ?, 
                hero_description = ?, profile_image = ?, resume_url = ?,
                updated_at = CURRENT_TIMESTAMP
                WHERE id = ?
            `, [title, subtitle, description, greeting, hero_description, profile_image, resume_url, existing.id]);
        } else {
            // Create new
            await db.run(`
                INSERT INTO about (title, subtitle, description, greeting, hero_description, profile_image, resume_url)
                VALUES (?, ?, ?, ?, ?, ?, ?)
            `, [title, subtitle, description, greeting, hero_description, profile_image, resume_url]);
        }

        res.json({ message: 'About information updated successfully' });
    } catch (error) {
        console.error('Error updating about:', error);
        res.status(500).json({ error: 'Failed to update about information' });
    }
});

// SKILLS MANAGEMENT
// Get all skills
router.get('/skills', async (req, res) => {
    try {
        const skills = await db.all('SELECT * FROM skills ORDER BY category, order_index, name');
        res.json(skills);
    } catch (error) {
        console.error('Error fetching skills:', error);
        res.status(500).json({ error: 'Failed to fetch skills' });
    }
});

// Create skill
router.post('/skills', [
    body('name').notEmpty().withMessage('Skill name is required'),
    body('category').notEmpty().withMessage('Category is required'),
    body('percentage').isInt({ min: 0, max: 100 }).withMessage('Percentage must be between 0 and 100')
], async (req, res) => {
    try {
        const errors = validationResult(req);
        if (!errors.isEmpty()) {
            return res.status(400).json({ errors: errors.array() });
        }

        const { name, category, percentage, description, icon, order_index } = req.body;

        const result = await db.run(`
            INSERT INTO skills (name, category, percentage, description, icon, order_index)
            VALUES (?, ?, ?, ?, ?, ?)
        `, [name, category, percentage, description, icon, order_index || 0]);

        res.status(201).json({ id: result.id, message: 'Skill created successfully' });
    } catch (error) {
        console.error('Error creating skill:', error);
        res.status(500).json({ error: 'Failed to create skill' });
    }
});

// Update skill
router.put('/skills/:id', [
    body('name').notEmpty().withMessage('Skill name is required'),
    body('category').notEmpty().withMessage('Category is required'),
    body('percentage').isInt({ min: 0, max: 100 }).withMessage('Percentage must be between 0 and 100')
], async (req, res) => {
    try {
        const errors = validationResult(req);
        if (!errors.isEmpty()) {
            return res.status(400).json({ errors: errors.array() });
        }

        const { id } = req.params;
        const { name, category, percentage, description, icon, order_index, is_active } = req.body;

        await db.run(`
            UPDATE skills SET 
            name = ?, category = ?, percentage = ?, description = ?, 
            icon = ?, order_index = ?, is_active = ?, updated_at = CURRENT_TIMESTAMP
            WHERE id = ?
        `, [name, category, percentage, description, icon, order_index || 0, is_active ? 1 : 0, id]);

        res.json({ message: 'Skill updated successfully' });
    } catch (error) {
        console.error('Error updating skill:', error);
        res.status(500).json({ error: 'Failed to update skill' });
    }
});

// Delete skill
router.delete('/skills/:id', async (req, res) => {
    try {
        const { id } = req.params;
        await db.run('DELETE FROM skills WHERE id = ?', [id]);
        res.json({ message: 'Skill deleted successfully' });
    } catch (error) {
        console.error('Error deleting skill:', error);
        res.status(500).json({ error: 'Failed to delete skill' });
    }
});

// PROJECTS MANAGEMENT
// Get all projects
router.get('/projects', async (req, res) => {
    try {
        const projects = await db.all('SELECT * FROM projects ORDER BY is_featured DESC, year DESC, order_index');
        
        const projectsWithDetails = [];
        for (const project of projects) {
            const technologies = await db.all('SELECT technology FROM project_technologies WHERE project_id = ?', [project.id]);
            const tags = await db.all('SELECT tag FROM project_tags WHERE project_id = ?', [project.id]);
            
            projectsWithDetails.push({
                ...project,
                technologies: technologies.map(t => t.technology),
                tags: tags.map(t => t.tag),
                is_featured: Boolean(project.is_featured),
                is_active: Boolean(project.is_active)
            });
        }
        
        res.json(projectsWithDetails);
    } catch (error) {
        console.error('Error fetching projects:', error);
        res.status(500).json({ error: 'Failed to fetch projects' });
    }
});

// Create project
router.post('/projects', [
    body('title').notEmpty().withMessage('Project title is required'),
    body('category').notEmpty().withMessage('Category is required')
], async (req, res) => {
    try {
        const errors = validationResult(req);
        if (!errors.isEmpty()) {
            return res.status(400).json({ errors: errors.array() });
        }

        const { 
            title, description, category, image, demo_url, github_url, 
            download_url, store_url, is_featured, year, status, order_index,
            technologies, tags 
        } = req.body;

        // Create project
        const result = await db.run(`
            INSERT INTO projects (
                title, description, category, image, demo_url, github_url,
                download_url, store_url, is_featured, year, status, order_index
            ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
        `, [
            title, description, category, image, demo_url, github_url,
            download_url, store_url, is_featured ? 1 : 0, year, status || 'completed', order_index || 0
        ]);

        const projectId = result.id;

        // Add technologies
        if (technologies && Array.isArray(technologies)) {
            for (const tech of technologies) {
                await db.run('INSERT INTO project_technologies (project_id, technology) VALUES (?, ?)', [projectId, tech]);
            }
        }

        // Add tags
        if (tags && Array.isArray(tags)) {
            for (const tag of tags) {
                await db.run('INSERT INTO project_tags (project_id, tag) VALUES (?, ?)', [projectId, tag]);
            }
        }

        res.status(201).json({ id: projectId, message: 'Project created successfully' });
    } catch (error) {
        console.error('Error creating project:', error);
        res.status(500).json({ error: 'Failed to create project' });
    }
});

// Update project
router.put('/projects/:id', [
    body('title').notEmpty().withMessage('Project title is required'),
    body('category').notEmpty().withMessage('Category is required')
], async (req, res) => {
    try {
        const errors = validationResult(req);
        if (!errors.isEmpty()) {
            return res.status(400).json({ errors: errors.array() });
        }

        const { id } = req.params;
        const { 
            title, description, category, image, demo_url, github_url, 
            download_url, store_url, is_featured, year, status, order_index, is_active,
            technologies, tags 
        } = req.body;

        // Update project
        await db.run(`
            UPDATE projects SET 
            title = ?, description = ?, category = ?, image = ?, demo_url = ?, github_url = ?,
            download_url = ?, store_url = ?, is_featured = ?, year = ?, status = ?, 
            order_index = ?, is_active = ?, updated_at = CURRENT_TIMESTAMP
            WHERE id = ?
        `, [
            title, description, category, image, demo_url, github_url,
            download_url, store_url, is_featured ? 1 : 0, year, status || 'completed', 
            order_index || 0, is_active ? 1 : 0, id
        ]);

        // Update technologies
        await db.run('DELETE FROM project_technologies WHERE project_id = ?', [id]);
        if (technologies && Array.isArray(technologies)) {
            for (const tech of technologies) {
                await db.run('INSERT INTO project_technologies (project_id, technology) VALUES (?, ?)', [id, tech]);
            }
        }

        // Update tags
        await db.run('DELETE FROM project_tags WHERE project_id = ?', [id]);
        if (tags && Array.isArray(tags)) {
            for (const tag of tags) {
                await db.run('INSERT INTO project_tags (project_id, tag) VALUES (?, ?)', [id, tag]);
            }
        }

        res.json({ message: 'Project updated successfully' });
    } catch (error) {
        console.error('Error updating project:', error);
        res.status(500).json({ error: 'Failed to update project' });
    }
});

// Delete project
router.delete('/projects/:id', async (req, res) => {
    try {
        const { id } = req.params;
        
        // Delete related data first
        await db.run('DELETE FROM project_technologies WHERE project_id = ?', [id]);
        await db.run('DELETE FROM project_tags WHERE project_id = ?', [id]);
        
        // Delete project
        await db.run('DELETE FROM projects WHERE id = ?', [id]);
        
        res.json({ message: 'Project deleted successfully' });
    } catch (error) {
        console.error('Error deleting project:', error);
        res.status(500).json({ error: 'Failed to delete project' });
    }
});

module.exports = router;