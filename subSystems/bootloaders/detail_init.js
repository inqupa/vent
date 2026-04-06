/**
 * VENT BOOTLOADER: DETAIL SYSTEM
 */
async function initializeDetailSubsystem(contextData) {
    try {
        await window.ThemeBridge.syncStyles('detail_theme');

        // FORCE ARRAY: No matter what happens, we send an array to the Factory.
        const rawHistory = window.SessionState.get('searchHistory');
        const safeHistory = Array.isArray(rawHistory) ? rawHistory : [];

        const elements = window.UIFactory.createDetailInterface('app-root', contextData, safeHistory);
        
        if (elements && elements.backBtn) {
            elements.backBtn.addEventListener('click', () => {
                window.NavigationRouter.transition('SEARCH');
            });
        }
    } catch (e) {
        console.error("Critical Detail Failure: " + e.message);
    }
}
// Mount to window so NavigationRouter can find it
window.initializeDetailSubsystem = initializeDetailSubsystem;