// Minimal debug script - paste this in browser console on admin panel

// Override admin methods with debug versions
if (typeof admin !== 'undefined') {
    console.log('Overriding admin methods with debug versions...');
    
    // Store original methods
    const originalOpenSkillModal = admin.openSkillModal.bind(admin);
    const originalOpenProjectModal = admin.openProjectModal.bind(admin);
    
    // Override with debug versions
    admin.openSkillModal = function(skillId = null) {
        console.log('🐛 DEBUG: openSkillModal called with skillId:', skillId);
        
        const modal = document.getElementById('skill-modal');
        console.log('🐛 DEBUG: skill-modal element:', modal);
        
        if (modal) {
            console.log('🐛 DEBUG: Current modal classes:', modal.classList.toString());
            console.log('🐛 DEBUG: Current modal display:', getComputedStyle(modal).display);
            
            // Try original method
            try {
                const result = originalOpenSkillModal(skillId);
                console.log('🐛 DEBUG: Original method executed, result:', result);
                
                setTimeout(() => {
                    console.log('🐛 DEBUG: Modal classes after method:', modal.classList.toString());
                    console.log('🐛 DEBUG: Modal display after method:', getComputedStyle(modal).display);
                }, 100);
                
                return result;
            } catch (error) {
                console.error('🐛 DEBUG: Error in original method:', error);
                
                // Manual fallback
                console.log('🐛 DEBUG: Trying manual modal show...');
                modal.classList.add('show');
                console.log('🐛 DEBUG: Manual show class added');
            }
        } else {
            console.error('🐛 DEBUG: skill-modal element not found!');
        }
    };
    
    admin.openProjectModal = function(projectId = null) {
        console.log('🐛 DEBUG: openProjectModal called with projectId:', projectId);
        
        const modal = document.getElementById('project-modal');
        console.log('🐛 DEBUG: project-modal element:', modal);
        
        if (modal) {
            console.log('🐛 DEBUG: Current modal classes:', modal.classList.toString());
            
            try {
                const result = originalOpenProjectModal(projectId);
                console.log('🐛 DEBUG: Original method executed');
                return result;
            } catch (error) {
                console.error('🐛 DEBUG: Error in original method:', error);
                modal.classList.add('show');
            }
        } else {
            console.error('🐛 DEBUG: project-modal element not found!');
        }
    };
    
    console.log('✅ Debug overrides installed. Try clicking the buttons now.');
} else {
    console.error('❌ admin object not found!');
}

// Also add click listeners to buttons for debugging
document.addEventListener('click', function(event) {
    if (event.target.tagName === 'BUTTON') {
        console.log('🐛 CLICK DEBUG: Button clicked:', event.target.textContent.trim());
        console.log('🐛 CLICK DEBUG: Button onclick:', event.target.getAttribute('onclick'));
        console.log('🐛 CLICK DEBUG: Button element:', event.target);
    }
});
