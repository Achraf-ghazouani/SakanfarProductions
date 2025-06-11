// Debug script to run in browser console on admin panel
// Copy and paste this into the browser console when on http://localhost:3001/admin

console.log('=== ADMIN PANEL DEBUG ===');

// Test 1: Check if admin object exists
console.log('1. Testing admin object...');
if (typeof admin !== 'undefined') {
    console.log('✅ admin object exists');
    console.log('admin type:', typeof admin);
    console.log('admin constructor:', admin.constructor.name);
    
    // List methods
    const methods = Object.getOwnPropertyNames(Object.getPrototypeOf(admin))
        .filter(name => typeof admin[name] === 'function' && name !== 'constructor');
    console.log('Available methods:', methods);
} else {
    console.log('❌ admin object not found');
}

// Test 2: Check modal elements
console.log('\n2. Testing modal elements...');
const skillModal = document.getElementById('skill-modal');
const projectModal = document.getElementById('project-modal');

console.log('skill-modal element:', skillModal);
console.log('project-modal element:', projectModal);

if (skillModal) {
    console.log('skill-modal classes:', skillModal.classList.toString());
    console.log('skill-modal display:', getComputedStyle(skillModal).display);
}

if (projectModal) {
    console.log('project-modal classes:', projectModal.classList.toString());
    console.log('project-modal display:', getComputedStyle(projectModal).display);
}

// Test 3: Check if user is logged in
console.log('\n3. Testing login status...');
const token = localStorage.getItem('admin_token');
console.log('Token in localStorage:', token ? 'EXISTS' : 'NOT FOUND');
console.log('Login container display:', getComputedStyle(document.getElementById('login-container')).display);
console.log('Main app display:', getComputedStyle(document.getElementById('main-app')).display);

// Test 4: Try to call admin methods
console.log('\n4. Testing admin methods...');
if (typeof admin !== 'undefined') {
    // Test login first if not logged in
    if (!token) {
        console.log('Not logged in, attempting login...');
        admin.apiCall('/auth/login', {
            method: 'POST',
            body: JSON.stringify({ username: 'admin', password: 'admin123' })
        }).then(response => {
            console.log('Login response:', response);
            localStorage.setItem('admin_token', response.token);
            admin.token = response.token;
            admin.showDashboard();
            console.log('✅ Login successful, now test modals...');
            
            // Now test modals
            setTimeout(() => {
                console.log('Testing openSkillModal...');
                try {
                    admin.openSkillModal();
                    console.log('✅ openSkillModal called');
                    
                    setTimeout(() => {
                        const modal = document.getElementById('skill-modal');
                        console.log('Modal after openSkillModal:', modal.classList.toString());
                        console.log('Modal display:', getComputedStyle(modal).display);
                    }, 100);
                } catch (error) {
                    console.log('❌ openSkillModal error:', error);
                }
            }, 1000);
        }).catch(error => {
            console.log('❌ Login failed:', error);
        });
    } else {
        console.log('Already logged in, testing modals...');
        try {
            admin.openSkillModal();
            console.log('✅ openSkillModal called');
        } catch (error) {
            console.log('❌ openSkillModal error:', error);
        }
    }
}

// Test 5: Manual modal test
console.log('\n5. Manual modal test...');
if (skillModal) {
    console.log('Manually adding "show" class to skill modal...');
    skillModal.classList.add('show');
    setTimeout(() => {
        console.log('Modal display after adding show class:', getComputedStyle(skillModal).display);
        skillModal.classList.remove('show');
        console.log('Modal test complete');
    }, 2000);
}

console.log('\n=== DEBUG COMPLETE ===');
console.log('Copy the above results and share them for further debugging.');
