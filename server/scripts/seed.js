const bcrypt = require('bcryptjs');
const db = require('../database/db');

async function seedDatabase() {
    console.log('🌱 Starting database seeding...');

    try {
        // Wait a moment for database to initialize
        await new Promise(resolve => setTimeout(resolve, 1000));
        
        // Create admin user
        console.log('Creating admin user...');
        const hashedPassword = await bcrypt.hash('admin123', 10);
        
        await db.run(`
            INSERT OR REPLACE INTO users (id, username, email, password, role)
            VALUES (1, 'admin', 'admin@sakanfar.com', ?, 'admin')
        `, [hashedPassword]);

        // Seed about information
        console.log('Seeding about information...');
        await db.run(`
            INSERT OR REPLACE INTO about (
                id, title, subtitle, description, greeting, hero_description, 
                profile_image, resume_url
            ) VALUES (
                1, 
                'Game Developer & 3D Artist',
                'Unity Developer | VR/AR Specialist | 3D Modeling Expert',
                'Passionate game developer with expertise in Unity, VR/AR experiences, and 3D modeling. I create immersive digital experiences that blend cutting-edge technology with compelling storytelling.',
                'Hello, I''m',
                'Crafting immersive digital experiences through innovative game development, stunning 3D artistry, and cutting-edge VR/AR technologies.',
                '/uploads/profile-placeholder.jpg',
                '/uploads/resume.pdf'
            )
        `);

        // Seed skills
        console.log('Seeding skills...');
        const skills = [
            // Unity skills
            { name: 'Unity 3D', category: 'unity', percentage: 95, description: 'Advanced Unity development', order_index: 1 },
            { name: 'C# Programming', category: 'unity', percentage: 90, description: 'Expert C# programming', order_index: 2 },
            { name: 'Game Physics', category: 'unity', percentage: 85, description: 'Custom physics systems', order_index: 3 },
            
            // VR/AR skills
            { name: 'Oculus Development', category: 'vr', percentage: 92, description: 'Native Oculus development', order_index: 1 },
            { name: 'ARCore/ARKit', category: 'vr', percentage: 85, description: 'Mobile AR development', order_index: 2 },
            
            // 3D Modeling skills
            { name: 'Blender', category: 'modeling', percentage: 90, description: '3D modeling and animation', order_index: 1 },
            { name: 'Character Modeling', category: 'modeling', percentage: 85, description: 'Character creation', order_index: 2 }
        ];

        for (const skill of skills) {
            await db.run(`
                INSERT INTO skills (name, category, percentage, description, order_index)
                VALUES (?, ?, ?, ?, ?)
            `, [skill.name, skill.category, skill.percentage, skill.description, skill.order_index]);
        }        console.log('✅ Database seeding completed successfully!');
        console.log('📝 Admin credentials:');
        console.log('   Username: admin');
        console.log('   Password: admin123');
        
    } catch (error) {
        console.error('❌ Error seeding database:', error);
    }
}

// Run the seed function
seedDatabase();