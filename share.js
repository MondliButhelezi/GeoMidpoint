function copyAppLink() {
    var currentURL = window.location.href;
    var appLinkInput = document.getElementById('appLinkInput');

    // Create a temporary input field if 'appLinkInput' is not found
    if (!appLinkInput) {
        appLinkInput = document.createElement('input');
        document.body.appendChild(appLinkInput);
        appLinkInput.style.position = 'absolute';
        appLinkInput.style.left = '-9999px'; // Hide the input field
    }

    // Set and copy the current URL
    appLinkInput.value = currentURL;
    appLinkInput.select();

    // Use the newer Clipboard API if available, fallback to 'execCommand'
    if (navigator.clipboard) {
        navigator.clipboard.writeText(appLinkInput.value)
            .then(() => {
                alert('Web app link copied to the clipboard 📋 and ready to be shared');
            })
            .catch((err) => {
                console.error('Failed to copy text: ', err);
            });
    } else {
        document.execCommand('copy');
        alert('Web app link copied to the clipboard 📋 and ready to be shared');
    }

    // Optionally remove the temporary input field
    if (!document.getElementById('appLinkInput')) {
        document.body.removeChild(appLinkInput);
    }

    // Handle confirmation
    showBackConfirmation = false;
}
