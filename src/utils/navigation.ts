/**
 * Utility function for navigation with scroll-to-top behavior
 */
export const navigateToTop = (callback?: () => void) => {
    if (callback) {
        callback();
    }
    setTimeout(() => {
        window.scrollTo({
            top: 0,
            behavior: 'smooth',
        });
    }, 100);
};
