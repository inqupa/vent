# ---

**🛸 Vent: The Quadratic System Specification**

## **1\. Project Vision & UX Manifesto**

**Vent** is a "Zen-First" emotional offloading platform designed for 2026 hardware and user behavior. The core UX philosophy is **Zero-Friction Catharsis**: the interface must remain invisible until the moment of interaction.

### **UI/UX Design Principles**

* **The Golden Ratio Placement:** The primary input and brand identity occupy the vertical center (approx. 1/3 down the viewport) to minimize eye strain and optimize thumb-reach on mobile devices.  
* **Contextual Discovery (Pills):** To eliminate "Blank Page Syndrome," the system provides dynamic emotion suggestions (Pills) generated via the PillFactory.  
* **Zen State:** Sidebars (History/Settings) are physically isolated from the main viewport. They do not exist in the layout flow unless explicitly summoned, preventing "Ghost Overlays" and accidental clicks.  
* **Immediate Feedback:** Non-blocking validation occurs in real-time. If a user enters a prohibited term, the system intercepts the action via **Middleware** before it reaches the **Storage Service**.

## ---

**2\. Software Architecture: The Quadratic Engine**

We employ a **Decoupled Layered Architecture**. By separating concerns into 9 distinct folders, we ensure the system is "Quadratic"—meaning the complexity of maintenance remains flat ($O(1)$) regardless of feature growth.

### **The 9-Layer Logic Hierarchy**

| Layer | Folder | Responsibility |
| :---- | :---- | :---- |
| **Orchestrator** | main.js | The entry point. Boots the UI and initiates data fetching. |
| **Services** | /services/ | **Infrastructure.** The only layer allowed to touch localStorage or execute fetch(). |
| **Logic** | /logic/ | **Intelligence.** Pure functions for safety validation and text processing. |
| **UI** | /ui/ | **Presentation.** Handles DOM state, class toggles (is-open), and animations. |
| **Handlers** | /handlers/ | **Interactions.** Maps physical events (click, keydown) to internal system commands. |
| **Factories** | /factories/ | **Constructors.** Generates complex DOM elements (like Pills) from JSON data. |
| **Adapters** | /adapters/ | **Translation.** Transforms raw external data (CSV/JSON) into internal "clean" objects. |
| **Strategies** | /strategies/ | **Algorithms.** Swappable logic for sorting, filtering, or categorizing vents. |
| **Middlewares** | /middlewares/ | **Interceptors.** "Gatekeeper" code that validates actions before they are finalized. |
| **Integration** | /integration/ | **Glue.** Connects disparate modules (e.g., syncing the Input Handler to the Storage Service). |

## ---

**3\. CSS Architecture: The 5-Tier Logic Gate**

We reject standard "Media Queries" in favor of a **Mathematical Layout Engine**. The system calculates the environment using binary flags.

### **The Tier System**

* **Logic Engine (variables.css):** Defines binary triggers (--is-sm, \--is-lg, etc.) based on viewport width.  
* **Component Isolation:** Base styles (/components/) define **what** an object is. Tier styles (/tiers/) define **where** it sits.  
* **The Horizontal Rule:** Sidebars use transform: translateX(101%) and visibility: hidden. This ensures that even if a menu is "transparent," it cannot be clicked or scrolled over while closed.

## ---

**4\. Data Integrity: The Sanitized Pipeline**

Data is treated as an immutable asset. It flows through a "Refinery" before reaching the user.

### **The Firewall Script (update\_trends.py)**

1. **Ingestion:** Pulls raw user vents from an external Google Sheet (CSV).  
2. **Sanitization:** Cross-references the blockedWords-manifest.json to scrub prohibited content.  
3. **Heuristics:** Employs regex to detect and delete "gibberish" (repeating characters, length violations).  
4. **Transformation:** Outputs a structured global-suggestions.json with metadata (timestamps and counts).

### **Manifest-Driven UI**

The JS engine is "dumb"—it does not know which emotions exist. It simply reads the /data/emotions-manifest.json and uses the **PillFactory** to render the current state. This allows for instant updates without touching the codebase.

## ---

**5\. Development Doctrine**

To maintain the integrity of the **Vent** system, all contributors must follow these "Hard Rules":

1. **The 15-Line Rule:** Any function exceeding 15 lines must be decomposed into atomic utilities.  
2. **No Direct DOM in Services:** A Service may never touch a document.querySelector. It returns data; the UI layer renders it.  
3. **Atomic Commits:** Commits must be scoped to a single layer (e.g., feat(logic): add sentiment validator).  
4. **Data Isolation:** Never hardcode a string that a user sees. Put it in a manifest.

---
