/**
 * VENT HANDLER: SELECTION
 * Purview: Managing the hand-off between validated input and the State/Strategy.
 */
const SelectionHandler = (() => {
    return {
        handle: (selection) => {
            console.log("Handler: Processing " + selection);

            // 1. SAFE STATE ACCESS
            // Use the getter and provide a fallback object {} to prevent undefined errors
            const currentState = window.SessionState ? window.SessionState.get('stats') || {} : {};
            
            // 2. DEFENSIVE LOGIC
            // Use optional chaining (?.) to safely check interactionCount
            const count = currentState?.interactionCount || 0;
            
            console.log(`Handler: Interaction Count is ${count}`);

            // 3. DELEGATE TO STRATEGY
            if (window.SelectionStrategy) {
                window.SelectionStrategy.execute(selection);
            }
        }
    };
})();

window.SelectionHandler = SelectionHandler;