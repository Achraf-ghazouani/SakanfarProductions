const sqlite3 = require('sqlite3').verbose();
const path = require('path');

class Database {
    constructor() {
        this.db = null;
        this.isReady = false;
        this.readyPromise = this.init();
    }

    init() {
        return new Promise((resolve, reject) => {
            const dbPath = path.join(__dirname, 'portfolio.db');
            this.db = new sqlite3.Database(dbPath, (err) => {
                if (err) {
                    console.error('Error opening database:', err.message);
                    reject(err);
                } else {
                    console.log('Connected to SQLite database');
                    this.createTables()
                        .then(() => {
                            this.isReady = true;
                            resolve();
                        })
                        .catch(reject);
                }
            });
        });
    }

    async waitForReady() {
        await this.readyPromise;
    }

    createTables() {
        return new Promise((resolve, reject) => {
            const tables = [];
            
            // Admin users table
            tables.push(new Promise((res, rej) => {
                this.db.run(`
                    CREATE TABLE IF NOT EXISTS users (
                        id INTEGER PRIMARY KEY AUTOINCREMENT,
                        username TEXT UNIQUE NOT NULL,
                        password TEXT NOT NULL,
                        email TEXT UNIQUE NOT NULL,
                        role TEXT DEFAULT 'admin',
                        created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
                        updated_at DATETIME DEFAULT CURRENT_TIMESTAMP
                    )
                `, (err) => err ? rej(err) : res());
            }));

            // About section table
            tables.push(new Promise((res, rej) => {
                this.db.run(`
                    CREATE TABLE IF NOT EXISTS about (
                        id INTEGER PRIMARY KEY AUTOINCREMENT,
                        title TEXT NOT NULL,
                        subtitle TEXT,
                        description TEXT,
                        greeting TEXT,
                        hero_description TEXT,
                        profile_image TEXT,
                        resume_url TEXT,
                        created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
                        updated_at DATETIME DEFAULT CURRENT_TIMESTAMP
                    )
                `, (err) => err ? rej(err) : res());
            }));

            // Skills table
            tables.push(new Promise((res, rej) => {
                this.db.run(`
                    CREATE TABLE IF NOT EXISTS skills (
                        id INTEGER PRIMARY KEY AUTOINCREMENT,
                        name TEXT NOT NULL,
                        category TEXT NOT NULL,
                        percentage INTEGER DEFAULT 0,
                        description TEXT,
                        icon TEXT,
                        order_index INTEGER DEFAULT 0,
                        is_active BOOLEAN DEFAULT 1,
                        created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
                        updated_at DATETIME DEFAULT CURRENT_TIMESTAMP
                    )
                `, (err) => err ? rej(err) : res());
            }));

            // Projects table
            tables.push(new Promise((res, rej) => {
                this.db.run(`
                    CREATE TABLE IF NOT EXISTS projects (
                        id INTEGER PRIMARY KEY AUTOINCREMENT,
                        title TEXT NOT NULL,
                        description TEXT,
                        category TEXT NOT NULL,
                        image TEXT,
                        demo_url TEXT,
                        github_url TEXT,
                        download_url TEXT,
                        store_url TEXT,
                        is_featured BOOLEAN DEFAULT 0,
                        year INTEGER,
                        status TEXT DEFAULT 'completed',
                        order_index INTEGER DEFAULT 0,
                        is_active BOOLEAN DEFAULT 1,
                        created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
                        updated_at DATETIME DEFAULT CURRENT_TIMESTAMP
                    )
                `, (err) => err ? rej(err) : res());
            }));

            // Project technologies table
            tables.push(new Promise((res, rej) => {
                this.db.run(`
                    CREATE TABLE IF NOT EXISTS project_technologies (
                        id INTEGER PRIMARY KEY AUTOINCREMENT,
                        project_id INTEGER,
                        technology TEXT NOT NULL,
                        FOREIGN KEY (project_id) REFERENCES projects (id) ON DELETE CASCADE
                    )
                `, (err) => err ? rej(err) : res());
            }));

            // Project tags table
            tables.push(new Promise((res, rej) => {
                this.db.run(`
                    CREATE TABLE IF NOT EXISTS project_tags (
                        id INTEGER PRIMARY KEY AUTOINCREMENT,
                        project_id INTEGER,
                        tag TEXT NOT NULL,
                        FOREIGN KEY (project_id) REFERENCES projects (id) ON DELETE CASCADE
                    )
                `, (err) => err ? rej(err) : res());
            }));

            // Experience table
            tables.push(new Promise((res, rej) => {
                this.db.run(`
                    CREATE TABLE IF NOT EXISTS experience (
                        id INTEGER PRIMARY KEY AUTOINCREMENT,
                        title TEXT NOT NULL,
                        company TEXT NOT NULL,
                        location TEXT,
                        start_date DATE,
                        end_date DATE,
                        is_current BOOLEAN DEFAULT 0,
                        description TEXT,
                        type TEXT DEFAULT 'work',
                        order_index INTEGER DEFAULT 0,
                        is_active BOOLEAN DEFAULT 1,
                        created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
                        updated_at DATETIME DEFAULT CURRENT_TIMESTAMP
                    )
                `, (err) => err ? rej(err) : res());
            }));

            // Experience achievements table
            tables.push(new Promise((res, rej) => {
                this.db.run(`
                    CREATE TABLE IF NOT EXISTS experience_achievements (
                        id INTEGER PRIMARY KEY AUTOINCREMENT,
                        experience_id INTEGER,
                        achievement TEXT NOT NULL,
                        FOREIGN KEY (experience_id) REFERENCES experience (id) ON DELETE CASCADE
                    )
                `, (err) => err ? rej(err) : res());
            }));

            // Experience technologies table
            tables.push(new Promise((res, rej) => {
                this.db.run(`
                    CREATE TABLE IF NOT EXISTS experience_technologies (
                        id INTEGER PRIMARY KEY AUTOINCREMENT,
                        experience_id INTEGER,
                        technology TEXT NOT NULL,
                        FOREIGN KEY (experience_id) REFERENCES experience (id) ON DELETE CASCADE
                    )
                `, (err) => err ? rej(err) : res());
            }));

            // Contact information table
            tables.push(new Promise((res, rej) => {
                this.db.run(`
                    CREATE TABLE IF NOT EXISTS contact_info (
                        id INTEGER PRIMARY KEY AUTOINCREMENT,
                        email TEXT,
                        phone TEXT,
                        location TEXT,
                        linkedin_url TEXT,
                        github_url TEXT,
                        twitter_url TEXT,
                        website_url TEXT,
                        updated_at DATETIME DEFAULT CURRENT_TIMESTAMP
                    )
                `, (err) => err ? rej(err) : res());
            }));

            // Site settings table
            tables.push(new Promise((res, rej) => {
                this.db.run(`
                    CREATE TABLE IF NOT EXISTS site_settings (
                        id INTEGER PRIMARY KEY AUTOINCREMENT,
                        site_title TEXT,
                        site_description TEXT,
                        logo_url TEXT,
                        favicon_url TEXT,
                        theme_primary_color TEXT,
                        theme_secondary_color TEXT,
                        google_analytics_id TEXT,
                        updated_at DATETIME DEFAULT CURRENT_TIMESTAMP
                    )
                `, (err) => err ? rej(err) : res());
            }));

            Promise.all(tables)
                .then(() => {
                    console.log('Database tables created successfully');
                    resolve();
                })
                .catch(reject);
        });
    }

    // Generic query methods
    get(sql, params = []) {
        return new Promise((resolve, reject) => {
            this.db.get(sql, params, (err, row) => {
                if (err) reject(err);
                else resolve(row);
            });
        });
    }

    all(sql, params = []) {
        return new Promise((resolve, reject) => {
            this.db.all(sql, params, (err, rows) => {
                if (err) reject(err);
                else resolve(rows);
            });
        });
    }

    run(sql, params = []) {
        return new Promise((resolve, reject) => {
            this.db.run(sql, params, function(err) {
                if (err) reject(err);
                else resolve({ id: this.lastID, changes: this.changes });
            });
        });
    }

    close() {
        return new Promise((resolve, reject) => {
            this.db.close((err) => {
                if (err) reject(err);
                else resolve();
            });
        });
    }
}

module.exports = new Database();