/**
 * Tutorial Store
 * 
 * Manages tutorial/walkthrough state for guiding users through the app.
 */

interface TutorialStep {
    id: string;
    title: string;
    description: string;
    element?: string; // CSS selector for element to highlight
    position?: 'top' | 'bottom' | 'left' | 'right';
    action?: () => void;
}

interface Tutorial {
    id: string;
    name: string;
    steps: TutorialStep[];
}

// Define available tutorials
export const tutorials: Record<string, Tutorial> = {
    'app-intro': {
        id: 'app-intro',
        name: 'Getting Started',
        steps: [
            {
                id: 'welcome',
                title: 'Welcome to Your Dashboard',
                description: 'This is your central hub for managing projects, viewing invoices, and getting support. Let\'s take a quick tour!',
            },
            {
                id: 'navigation',
                title: 'Navigation',
                description: 'Use the sidebar to navigate between different sections of the app. You can access your projects, proposals, invoices, and tickets from here.',
                element: '[data-tutorial="sidebar"]',
                position: 'right'
            },
            {
                id: 'projects',
                title: 'Your Projects',
                description: 'View and manage all your active projects. You can see project status, track progress, and request revisions.',
                element: '[data-tutorial="projects-link"]',
                position: 'right'
            },
            {
                id: 'tickets',
                title: 'Support Tickets',
                description: 'Need help? Submit a support ticket and our team will get back to you promptly.',
                element: '[data-tutorial="tickets-link"]',
                position: 'right'
            },
            {
                id: 'help',
                title: 'Help Center',
                description: 'Browse our knowledge base for answers to common questions, guides, and tutorials.',
                element: '[data-tutorial="help-link"]',
                position: 'right'
            },
            {
                id: 'complete',
                title: 'You\'re All Set!',
                description: 'That\'s the basics! You can restart this tutorial anytime by clicking the sparkle icon in the sidebar.',
            }
        ]
    }
};

// Tutorial state
let currentTutorial = $state<string | null>(null);
let currentStepIndex = $state(0);
let completedTutorials = $state<Set<string>>(new Set());

// Initialize completed tutorials from localStorage
if (typeof window !== 'undefined') {
    try {
        const stored = localStorage.getItem('completedTutorials');
        if (stored) {
            completedTutorials = new Set(JSON.parse(stored));
        }
    } catch {
        // Ignore errors
    }
}

export const tutorialStore = {
    // Getters
    get currentTutorial() {
        return currentTutorial;
    },
    get currentStepIndex() {
        return currentStepIndex;
    },
    get currentStep(): TutorialStep | null {
        if (!currentTutorial) return null;
        const tutorial = tutorials[currentTutorial];
        if (!tutorial) return null;
        return tutorial.steps[currentStepIndex] ?? null;
    },
    get totalSteps() {
        if (!currentTutorial) return 0;
        return tutorials[currentTutorial]?.steps.length ?? 0;
    },
    get isActive() {
        return currentTutorial !== null;
    },
    get progress() {
        if (!currentTutorial) return 0;
        const total = tutorials[currentTutorial]?.steps.length ?? 0;
        if (total === 0) return 0;
        return ((currentStepIndex + 1) / total) * 100;
    },

    // Actions
    start(tutorialId: string) {
        if (!tutorials[tutorialId]) return;
        currentTutorial = tutorialId;
        currentStepIndex = 0;
    },

    next() {
        if (!currentTutorial) return;
        const tutorial = tutorials[currentTutorial];
        if (!tutorial) return;

        if (currentStepIndex < tutorial.steps.length - 1) {
            currentStepIndex++;
        } else {
            this.complete();
        }
    },

    previous() {
        if (currentStepIndex > 0) {
            currentStepIndex--;
        }
    },

    skip() {
        currentTutorial = null;
        currentStepIndex = 0;
    },

    complete() {
        if (currentTutorial) {
            completedTutorials.add(currentTutorial);
            if (typeof window !== 'undefined') {
                try {
                    localStorage.setItem('completedTutorials', JSON.stringify([...completedTutorials]));
                } catch {
                    // Ignore errors
                }
            }
        }
        currentTutorial = null;
        currentStepIndex = 0;
    },

    isCompleted(tutorialId: string) {
        return completedTutorials.has(tutorialId);
    },

    reset(tutorialId?: string) {
        if (tutorialId) {
            completedTutorials.delete(tutorialId);
        } else {
            completedTutorials.clear();
        }
        if (typeof window !== 'undefined') {
            try {
                localStorage.setItem('completedTutorials', JSON.stringify([...completedTutorials]));
            } catch {
                // Ignore errors
            }
        }
    }
};
