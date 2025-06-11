const express = require('express');
const multer = require('multer');
const sharp = require('sharp');
const path = require('path');
const fs = require('fs');
const { authenticateToken } = require('./auth');

const router = express.Router();

// Apply authentication middleware
router.use(authenticateToken);

// Ensure uploads directory exists
const uploadsDir = path.join(__dirname, '..', 'uploads');
if (!fs.existsSync(uploadsDir)) {
    fs.mkdirSync(uploadsDir, { recursive: true });
}

// Configure multer for file uploads
const storage = multer.diskStorage({
    destination: (req, file, cb) => {
        cb(null, uploadsDir);
    },
    filename: (req, file, cb) => {
        const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1E9);
        cb(null, file.fieldname + '-' + uniqueSuffix + path.extname(file.originalname));
    }
});

const fileFilter = (req, file, cb) => {
    // Check if file is an image
    if (file.mimetype.startsWith('image/')) {
        cb(null, true);
    } else {
        cb(new Error('Only image files are allowed!'), false);
    }
};

const upload = multer({
    storage: storage,
    fileFilter: fileFilter,
    limits: {
        fileSize: 10 * 1024 * 1024 // 10MB limit
    }
});

// Upload single image
router.post('/image', upload.single('image'), async (req, res) => {
    try {
        if (!req.file) {
            return res.status(400).json({ error: 'No image file provided' });
        }

        const { optimize } = req.body;
        let filePath = req.file.path;
        let fileName = req.file.filename;

        // Optimize image if requested
        if (optimize === 'true') {
            const optimizedFileName = `optimized-${fileName}`;
            const optimizedPath = path.join(uploadsDir, optimizedFileName);

            await sharp(filePath)
                .resize(1200, 800, { 
                    fit: 'inside', 
                    withoutEnlargement: true 
                })
                .jpeg({ 
                    quality: 85,
                    progressive: true 
                })
                .toFile(optimizedPath);

            // Remove original file
            fs.unlinkSync(filePath);
            
            filePath = optimizedPath;
            fileName = optimizedFileName;
        }

        const fileUrl = `/uploads/${fileName}`;

        res.json({
            message: 'Image uploaded successfully',
            filename: fileName,
            url: fileUrl,
            size: req.file.size,
            mimetype: req.file.mimetype
        });
    } catch (error) {
        console.error('Upload error:', error);
        
        // Clean up file if it exists
        if (req.file && fs.existsSync(req.file.path)) {
            fs.unlinkSync(req.file.path);
        }
        
        res.status(500).json({ error: 'Failed to upload image' });
    }
});

// Upload multiple images
router.post('/images', upload.array('images', 10), async (req, res) => {
    try {
        if (!req.files || req.files.length === 0) {
            return res.status(400).json({ error: 'No image files provided' });
        }

        const { optimize } = req.body;
        const uploadedFiles = [];

        for (const file of req.files) {
            let filePath = file.path;
            let fileName = file.filename;

            // Optimize image if requested
            if (optimize === 'true') {
                const optimizedFileName = `optimized-${fileName}`;
                const optimizedPath = path.join(uploadsDir, optimizedFileName);

                await sharp(filePath)
                    .resize(1200, 800, { 
                        fit: 'inside', 
                        withoutEnlargement: true 
                    })
                    .jpeg({ 
                        quality: 85,
                        progressive: true 
                    })
                    .toFile(optimizedPath);

                // Remove original file
                fs.unlinkSync(filePath);
                
                filePath = optimizedPath;
                fileName = optimizedFileName;
            }

            uploadedFiles.push({
                filename: fileName,
                url: `/uploads/${fileName}`,
                size: file.size,
                mimetype: file.mimetype
            });
        }

        res.json({
            message: 'Images uploaded successfully',
            files: uploadedFiles
        });
    } catch (error) {
        console.error('Multiple upload error:', error);
        
        // Clean up files if they exist
        if (req.files) {
            req.files.forEach(file => {
                if (fs.existsSync(file.path)) {
                    fs.unlinkSync(file.path);
                }
            });
        }
        
        res.status(500).json({ error: 'Failed to upload images' });
    }
});

// Delete uploaded file
router.delete('/image/:filename', async (req, res) => {
    try {
        const { filename } = req.params;
        const filePath = path.join(uploadsDir, filename);

        if (fs.existsSync(filePath)) {
            fs.unlinkSync(filePath);
            res.json({ message: 'Image deleted successfully' });
        } else {
            res.status(404).json({ error: 'Image not found' });
        }
    } catch (error) {
        console.error('Delete error:', error);
        res.status(500).json({ error: 'Failed to delete image' });
    }
});

// Get list of uploaded files
router.get('/images', async (req, res) => {
    try {
        const files = fs.readdirSync(uploadsDir).map(filename => {
            const filePath = path.join(uploadsDir, filename);
            const stats = fs.statSync(filePath);
            
            return {
                filename,
                url: `/uploads/${filename}`,
                size: stats.size,
                createdAt: stats.birthtime,
                modifiedAt: stats.mtime
            };
        });

        res.json(files);
    } catch (error) {
        console.error('Error listing files:', error);
        res.status(500).json({ error: 'Failed to list images' });
    }
});

// Error handling middleware for multer
router.use((error, req, res, next) => {
    if (error instanceof multer.MulterError) {
        if (error.code === 'LIMIT_FILE_SIZE') {
            return res.status(400).json({ error: 'File too large. Maximum size is 10MB.' });
        }
        if (error.code === 'LIMIT_FILE_COUNT') {
            return res.status(400).json({ error: 'Too many files. Maximum is 10 files.' });
        }
    }
    
    if (error.message === 'Only image files are allowed!') {
        return res.status(400).json({ error: 'Only image files are allowed' });
    }
    
    next(error);
});

module.exports = router;