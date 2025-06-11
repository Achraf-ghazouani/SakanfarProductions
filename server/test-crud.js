const fetch = require('node-fetch');

const API_BASE = 'http://localhost:3001/api';
let authToken = '';

async function login() {
    try {
        const response = await fetch(`${API_BASE}/auth/login`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ username: 'admin', password: 'admin123' })
        });
        
        const data = await response.json();
        if (response.ok) {
            authToken = data.token;
            console.log('✅ Login successful');
            return true;
        } else {
            console.log('❌ Login failed:', data.error);
            return false;
        }
    } catch (error) {
        console.log('❌ Login error:', error.message);
        return false;
    }
}

async function testSkillCrud() {
    console.log('\n--- Testing Skill CRUD ---');
    
    // Create skill
    const skillData = {
        name: 'Test Skill',
        category: 'Programming Languages',
        percentage: 85,
        description: 'Test skill description'
    };
    
    try {
        const createResponse = await fetch(`${API_BASE}/admin/skills`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${authToken}`
            },
            body: JSON.stringify(skillData)
        });
        
        const createResult = await createResponse.json();
        if (createResponse.ok) {
            console.log('✅ Skill created:', createResult.id);
            const skillId = createResult.id;
            
            // Read skills
            const readResponse = await fetch(`${API_BASE}/admin/skills`, {
                headers: { 'Authorization': `Bearer ${authToken}` }
            });
            const skills = await readResponse.json();
            const createdSkill = skills.find(s => s.id === skillId);
            console.log('✅ Skill found:', createdSkill ? createdSkill.name : 'Not found');
            
            // Update skill
            const updateData = { ...skillData, name: 'Updated Test Skill', percentage: 90 };
            const updateResponse = await fetch(`${API_BASE}/admin/skills/${skillId}`, {
                method: 'PUT',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${authToken}`
                },
                body: JSON.stringify(updateData)
            });
            
            if (updateResponse.ok) {
                console.log('✅ Skill updated successfully');
            }
            
            // Delete skill
            const deleteResponse = await fetch(`${API_BASE}/admin/skills/${skillId}`, {
                method: 'DELETE',
                headers: { 'Authorization': `Bearer ${authToken}` }
            });
            
            if (deleteResponse.ok) {
                console.log('✅ Skill deleted successfully');
            }
            
        } else {
            console.log('❌ Skill creation failed:', createResult.error);
        }
        
    } catch (error) {
        console.log('❌ Skill CRUD error:', error.message);
    }
}

async function testProjectCrud() {
    console.log('\n--- Testing Project CRUD ---');
    
    // Create project
    const projectData = {
        title: 'Test Project',
        description: 'Test project description',
        category: 'web',
        year: 2024,
        technologies: ['React', 'Node.js'],
        tags: ['frontend', 'backend'],
        is_featured: false
    };
    
    try {
        const createResponse = await fetch(`${API_BASE}/admin/projects`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${authToken}`
            },
            body: JSON.stringify(projectData)
        });
        
        const createResult = await createResponse.json();
        if (createResponse.ok) {
            console.log('✅ Project created:', createResult.id);
            const projectId = createResult.id;
            
            // Read projects
            const readResponse = await fetch(`${API_BASE}/admin/projects`, {
                headers: { 'Authorization': `Bearer ${authToken}` }
            });
            const projects = await readResponse.json();
            const createdProject = projects.find(p => p.id === projectId);
            console.log('✅ Project found:', createdProject ? createdProject.title : 'Not found');
            
            // Update project
            const updateData = { ...projectData, title: 'Updated Test Project', is_featured: true };
            const updateResponse = await fetch(`${API_BASE}/admin/projects/${projectId}`, {
                method: 'PUT',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${authToken}`
                },
                body: JSON.stringify(updateData)
            });
            
            if (updateResponse.ok) {
                console.log('✅ Project updated successfully');
            }
            
            // Delete project
            const deleteResponse = await fetch(`${API_BASE}/admin/projects/${projectId}`, {
                method: 'DELETE',
                headers: { 'Authorization': `Bearer ${authToken}` }
            });
            
            if (deleteResponse.ok) {
                console.log('✅ Project deleted successfully');
            }
            
        } else {
            console.log('❌ Project creation failed:', createResult.error);
        }
        
    } catch (error) {
        console.log('❌ Project CRUD error:', error.message);
    }
}

async function runTests() {
    console.log('🚀 Starting CRUD tests...\n');
    
    if (await login()) {
        await testSkillCrud();
        await testProjectCrud();
    }
    
    console.log('\n✨ Tests completed!');
    process.exit(0);
}

runTests().catch(console.error);
