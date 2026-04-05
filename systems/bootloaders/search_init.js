/**
 * INSTANTIATION: SEARCH SYSTEM
 * Role: Orchestrating the construction and secure data flow between search related subsystems.
 */
async function initializeSearchSystem() {
    try {
        // 1. SECURITY HANDSHAKE (The Bridge)
        // We sync the Middleware with the Data Registry policy before the UI exists.
        if (window.VentingSecurityBridge) {
            await window.VentingSecurityBridge.synchronizeValidator('malicious_inputs');
        } else {
            throw new Error("Instantiation: VentingSecurityBridge subsystem missing.");
        }

        // 2. STATE HANDSHAKE (The New Step)
        // We prime the SessionState with the external schema before interaction starts.
        if (window.StateBridge) {
            await window.StateBridge.synchronizeState('initial_state');
        }

        // 3. CONSTRUCTION (The Factory)
        const elements = window.UIFactory.createSearchInterface('app-root');
        if (!elements) throw new Error("Instantiation: UIFactory failed to build.");

        // 4. INTERACTION BINDING
        elements.input.addEventListener('input', (e) => {
            const query = e.target.value;
            const matches = window.AutocompleteSubsystem.getSuggestions(query);
            
            elements.results.innerHTML = '';
            matches.forEach(match => {
                const li = document.createElement('li');
                li.textContent = match;

                // 5. THE ZERO-TRUST EVENT FLOW
                li.addEventListener('click', () => {
                    // Logic -> Middleware -> Handler
                    if (window.InputValidator && window.InputValidator.isSafe(match)) {
                        window.SelectionHandler.handle(match);
                    } else {
                        console.error("Security Block: Handler execution denied.");
                    }
                });

                elements.results.appendChild(li);
            });
        });

        console.log("Bootloader: Secure Search Subsystem Online.");
    } catch (e) {
        console.error("Critical Bootloader Failure: " + e.message);
    }
}