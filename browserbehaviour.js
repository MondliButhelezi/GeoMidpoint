function preventSwipeRefresh() {
    let touchStartY = 0;

    // Capture the starting Y position when the user touches the screen
    document.addEventListener('touchstart', (event) => {
        touchStartY = event.touches[0].clientY;
    });

    // Detect the movement in Y direction and prevent refresh if swiping down at the top of the page
    document.addEventListener('touchmove', (event) => {
        const touchEndY = event.touches[0].clientY;
        const deltaY = touchEndY - touchStartY;

        // Prevent pull-to-refresh when scrolling upwards and at the top of the page
        if (deltaY > 0 && window.scrollY === 0) {
            event.preventDefault();
        }
    });
}
preventSwipeRefresh();

function handleBackNavigation() {
    // Handle back navigation when the browser's back button is pressed
    window.addEventListener('popstate', function(event) {
        showBackConfirmation('browserBack');
    });

    // Handle back navigation when 'Escape' or 'ArrowLeft' is pressed
    window.addEventListener('keyup', function(event) {
        if (event.key === 'Escape' || event.key === 'ArrowLeft') {
            showBackConfirmation('keyboard');
        }
    });
}

// Show a confirmation prompt when the user attempts to go back
function showBackConfirmation(source) {
    if (source !== 'shareButton' && confirm("Are you sure you want to exit Midpoint 🥹👉👈?")) {
        window.history.back();
    } else {
        // If user cancels, ensure the current state remains the same
        history.pushState(null, null, window.location.href);
    }
}

// Push the current state into the browser history
history.pushState(null, null, window.location.href);

// Initialize the back navigation handlers
handleBackNavigation();
