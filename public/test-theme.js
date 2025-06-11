console.log('Testing theme functionality...');

// Test theme switching
setTimeout(() => {
    const themeToggle = document.querySelector('.theme-toggle');
    console.log('Theme toggle button found:', !!themeToggle);
    
    if (themeToggle) {
        console.log('Current theme:', document.documentElement.getAttribute('data-theme'));
        
        // Simulate a click
        themeToggle.click();
        
        setTimeout(() => {
            console.log('Theme after click:', document.documentElement.getAttribute('data-theme'));
        }, 100);
    }
}, 2000);
