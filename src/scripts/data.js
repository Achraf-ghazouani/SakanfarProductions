// Project data structure for easy customization
export const projectsData = {
    unity: [
        {
            id: 'epic-rpg',
            title: 'Epic Adventure RPG',
            description: 'A fully-featured RPG with complex combat system, inventory management, and immersive storytelling built in Unity.',
            image: '/assets/images/epic-rpg.svg',
            tags: ['Unity', 'C#', 'RPG', '3D'],
            links: {
                demo: '#',
                github: '#',
                store: '#'
            },
            featured: true,
            technologies: ['Unity 2022.3', 'C#', 'Addressable Assets', 'Timeline'],
            year: 2024
        },
        {
            id: 'puzzle-platformer',
            title: 'Puzzle Platformer',
            description: 'A mind-bending puzzle platformer featuring innovative mechanics and beautiful hand-crafted levels.',
            image: '/assets/images/puzzle-platformer.svg',
            tags: ['Unity', '2D', 'Puzzle', 'Indie'],
            links: {
                demo: '#',
                github: '#',
                download: '#'
            },
            featured: true,
            technologies: ['Unity 2D', 'Cinemachine', 'ProBuilder', 'DOTween'],
            year: 2023
        },
        {
            id: 'racing-game',
            title: 'Street Racing Championship',
            description: 'High-speed racing game with realistic physics and customizable vehicles.',
            image: '/assets/images/racing-game.svg',
            tags: ['Unity', '3D', 'Racing', 'Physics'],
            links: {
                demo: '#',
                trailer: '#'
            },
            featured: false,
            technologies: ['Unity', 'Wheel Collider', 'Post-Processing', 'Networking'],
            year: 2023
        }
    ],
    vr: [
        {
            id: 'virtual-museum',
            title: 'Virtual Museum Tour',
            description: 'An immersive VR experience allowing users to explore historical artifacts and interact with 3D reconstructions.',
            image: '/assets/images/virtual-museum.svg',
            tags: ['VR', 'Oculus', 'Education', 'History'],
            links: {
                demo: '#',
                oculus: '#'
            },
            featured: true,
            technologies: ['Unity XR', 'Oculus SDK', 'Hand Tracking', 'Spatial Audio'],
            year: 2024
        },
        {
            id: 'ar-furniture',
            title: 'AR Furniture Visualizer',
            description: 'Mobile AR application for visualizing furniture in real spaces with realistic lighting and shadows.',
            image: '/assets/images/ar-furniture.svg',
            tags: ['AR', 'ARCore', 'Mobile', 'Retail'],
            links: {
                demo: '#',
                playstore: '#',
                appstore: '#'
            },
            featured: true,
            technologies: ['ARCore', 'ARKit', 'Unity AR Foundation', 'URP'],
            year: 2024
        },
        {
            id: 'vr-training',
            title: 'Industrial VR Training',
            description: 'Virtual reality training simulation for industrial safety procedures and equipment operation.',
            image: '/assets/images/vr-training.svg',
            tags: ['VR', 'Training', 'Simulation', 'Enterprise'],
            links: {
                demo: '#',
                info: '#'
            },
            featured: false,
            technologies: ['Unity XR', 'OpenXR', 'Custom Physics', 'Analytics'],
            year: 2023
        }
    ],
    modeling: [
        {
            id: 'sci-fi-characters',
            title: 'Sci-Fi Character Pack',
            description: 'Complete character pack with high-poly models, PBR textures, and animation-ready rigs for sci-fi games.',
            image: '/assets/images/sci-fi-characters.svg',
            tags: ['Blender', 'Character', 'PBR', 'Animation'],
            links: {
                gallery: '#',
                download: '#',
                sketchfab: '#'
            },
            featured: true,
            technologies: ['Blender', 'Substance Painter', 'Mixamo', 'PBR Workflow'],
            year: 2024
        },
        {
            id: 'medieval-environment',
            title: 'Medieval Fantasy Environment',
            description: 'Detailed medieval village environment with modular buildings, props, and atmospheric lighting setup.',
            image: '/assets/images/medieval-environment.jpg',
            tags: ['Environment', 'Maya', 'Fantasy', 'Modular'],
            links: {
                explore: '#',
                assets: '#'
            },
            featured: true,
            technologies: ['Maya', 'Substance Designer', 'World Creator', 'Houdini'],
            year: 2024
        },
        {
            id: 'vehicle-pack',
            title: 'Modern Vehicle Collection',
            description: 'Realistic vehicle models with detailed interiors and customizable materials.',
            image: '/assets/images/vehicle-pack.jpg',
            tags: ['Vehicles', '3D', 'Realistic', 'Game-Ready'],
            links: {
                showcase: '#',
                download: '#'
            },
            featured: false,
            technologies: ['Blender', '3ds Max', 'KeyShot', 'Retopology'],
            year: 2023
        }
    ]
};

export const skillsData = {
    gamedev: {
        title: 'Game Development',
        skills: [
            { name: 'Unity 3D', level: 95, icon: 'unity' },
            { name: 'C# Programming', level: 90, icon: 'csharp' },
            { name: 'Game Physics', level: 85, icon: 'physics' },
            { name: 'Level Design', level: 80, icon: 'level' },
            { name: 'Performance Optimization', level: 88, icon: 'optimization' },
            { name: 'Multiplayer Networking', level: 75, icon: 'network' }
        ]
    },
    vrar: {
        title: 'VR/AR Development',
        skills: [
            { name: 'Oculus SDK', level: 85, icon: 'oculus' },
            { name: 'ARCore/ARKit', level: 80, icon: 'ar' },
            { name: 'XR Interaction', level: 90, icon: 'xr' },
            { name: 'Spatial Computing', level: 75, icon: 'spatial' },
            { name: 'Hand Tracking', level: 82, icon: 'hand' },
            { name: 'OpenXR', level: 78, icon: 'openxr' }
        ]
    },
    modeling: {
        title: '3D Modeling & Animation',
        skills: [
            { name: 'Blender', level: 90, icon: 'blender' },
            { name: 'Maya', level: 85, icon: 'maya' },
            { name: 'Substance Painter', level: 80, icon: 'substance' },
            { name: 'ZBrush', level: 75, icon: 'zbrush' },
            { name: 'Houdini', level: 70, icon: 'houdini' },
            { name: 'Animation', level: 82, icon: 'animation' }
        ]
    },
    technical: {
        title: 'Technical Skills',
        skills: [
            { name: 'HLSL/Shaders', level: 85, icon: 'shader' },
            { name: 'Git Version Control', level: 88, icon: 'git' },
            { name: 'Agile/Scrum', level: 80, icon: 'agile' },
            { name: 'Performance Profiling', level: 85, icon: 'profiling' },
            { name: 'CI/CD', level: 75, icon: 'cicd' },
            { name: 'Cross-Platform Development', level: 90, icon: 'crossplatform' }
        ]
    }
};

export const experienceData = [
    {
        title: 'Senior Game Developer',
        company: 'Innovative Game Studios',
        location: 'Remote',
        period: '2022 - Present',
        type: 'work',
        description: 'Leading development of multiple Unity-based games, specializing in VR/AR experiences and implementing advanced gameplay mechanics. Mentoring junior developers and architecting scalable game systems.',
        achievements: [
            'Led development team of 8 developers',
            'Released 3 successful VR applications',
            'Improved game performance by 40%',
            'Implemented custom rendering pipeline'
        ],
        technologies: ['Unity 2022.3', 'C#', 'VR/AR', 'Multiplayer', 'Custom Shaders']
    },
    {
        title: '3D Artist & Game Developer',
        company: 'Creative Digital Solutions',
        location: 'Los Angeles, CA',
        period: '2020 - 2022',
        type: 'work',
        description: 'Created 3D assets and developed interactive applications for various clients, focusing on AR marketing campaigns and educational games. Collaborated with design teams to deliver high-quality visual experiences.',
        achievements: [
            'Created 50+ game-ready 3D models',
            'Developed 5 AR marketing applications',
            'Reduced asset loading times by 60%',
            'Established 3D art pipeline and standards'
        ],
        technologies: ['Blender', 'Maya', 'Unity', 'ARCore', 'Substance Suite']
    },
    {
        title: 'Junior Unity Developer',
        company: 'Mobile Gaming Inc.',
        location: 'San Francisco, CA',
        period: '2019 - 2020',
        type: 'work',
        description: 'Developed mobile games using Unity, implemented monetization systems, and optimized performance for various mobile devices. Gained expertise in mobile-specific development challenges.',
        achievements: [
            'Shipped 2 mobile games with 100k+ downloads',
            'Implemented in-app purchase system',
            'Optimized games for 15+ device configurations',
            'Reduced build size by 35%'
        ],
        technologies: ['Unity', 'C#', 'Mobile Optimization', 'Analytics', 'Monetization']
    },
    {
        title: 'Bachelor of Science in Computer Science',
        company: 'University of Technology',
        location: 'California',
        period: '2015 - 2019',
        type: 'education',
        description: 'Specialized in computer graphics and game development, with focus on 3D mathematics, rendering techniques, and software engineering principles. Graduated with honors.',
        achievements: [
            'GPA: 3.8/4.0',
            'Dean\'s List for 4 semesters',
            'Led final year game development project',
            'Published research paper on procedural generation'
        ],
        technologies: ['C++', 'OpenGL', 'Computer Graphics', 'Algorithms', 'Software Engineering']
    },
    {
        title: 'Game Development Bootcamp',
        company: 'GameDev Academy',
        location: 'Online',
        period: '2018',
        type: 'education',
        description: 'Intensive 6-month program focused on Unity game development, covering everything from basic scripting to advanced game systems and deployment.',
        achievements: [
            'Top 5% of cohort',
            'Built and published 3 complete games',
            'Earned Unity Certified Developer credential',
            'Mentored other students'
        ],
        technologies: ['Unity', 'C#', 'Game Design', 'Project Management']
    }
];

export default {
    projects: projectsData,
    skills: skillsData,
    experience: experienceData
};
