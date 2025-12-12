import type { ProjectPhase } from '$lib/server/db/schema';
import {
    FileText,
    Search,
    FileCheck,
    HandshakeIcon,
    Hammer,
    CheckCircle2,
    HeadphonesIcon,
    type Icon
} from '@lucide/svelte';

export interface PhaseConfig {
    code: string;
    label: string;
    description: string;
    icon: typeof Icon;
    color: string;
    bgColor: string;
    borderColor: string;
    number: string;
}

export const PHASE_CONFIGS: Record<ProjectPhase, PhaseConfig> = {
    request: {
        code: 'request',
        label: 'Request',
        description: 'Client submitted project vision',
        icon: FileText,
        color: 'text-blue-500',
        bgColor: 'bg-blue-500/10',
        borderColor: 'border-blue-500/30',
        number: '01'
    },
    review: {
        code: 'review',
        label: 'Review',
        description: 'Admin evaluating feasibility',
        icon: Search,
        color: 'text-yellow-500',
        bgColor: 'bg-yellow-500/10',
        borderColor: 'border-yellow-500/30',
        number: '02'
    },
    proposal: {
        code: 'proposal',
        label: 'Proposal',
        description: 'Creating scope and pricing',
        icon: FileCheck,
        color: 'text-orange-500',
        bgColor: 'bg-orange-500/10',
        borderColor: 'border-orange-500/30',
        number: '03'
    },
    confirmed: {
        code: 'confirmed',
        label: 'Confirmed',
        description: 'Both parties confirmed',
        icon: HandshakeIcon,
        color: 'text-purple-500',
        bgColor: 'bg-purple-500/10',
        borderColor: 'border-purple-500/30',
        number: '04'
    },
    building: {
        code: 'building',
        label: 'Building',
        description: 'Active development',
        icon: Hammer,
        color: 'text-primary',
        bgColor: 'bg-primary/10',
        borderColor: 'border-primary/30',
        number: '05'
    },
    completed: {
        code: 'completed',
        label: 'Completed',
        description: 'Project delivered',
        icon: CheckCircle2,
        color: 'text-green-500',
        bgColor: 'bg-green-500/10',
        borderColor: 'border-green-500/30',
        number: '06'
    },
    support: {
        code: 'support',
        label: 'Support',
        description: 'Ongoing maintenance',
        icon: HeadphonesIcon,
        color: 'text-cyan-500',
        bgColor: 'bg-cyan-500/10',
        borderColor: 'border-cyan-500/30',
        number: '07'
    }
};

export const PHASES_ORDER: ProjectPhase[] = [
    'request',
    'review',
    'proposal',
    'confirmed',
    'building',
    'completed',
    'support'
];

export function getPhaseConfig(phase: ProjectPhase): PhaseConfig {
    return PHASE_CONFIGS[phase] ?? PHASE_CONFIGS.request;
}

export function getPhaseIndex(phase: ProjectPhase): number {
    return PHASES_ORDER.indexOf(phase);
}

export function isPhaseComplete(currentPhase: ProjectPhase, checkPhase: ProjectPhase): boolean {
    const currentIndex = getPhaseIndex(currentPhase);
    const checkIndex = getPhaseIndex(checkPhase);
    return checkIndex < currentIndex;
}

export function isPhaseActive(currentPhase: ProjectPhase, checkPhase: ProjectPhase): boolean {
    return currentPhase === checkPhase;
}

export function canTransitionToPhase(currentPhase: ProjectPhase, targetPhase: ProjectPhase): boolean {
    const currentIndex = getPhaseIndex(currentPhase);
    const targetIndex = getPhaseIndex(targetPhase);

    // Can go forward one step or backward to any previous step
    return targetIndex === currentIndex + 1 || targetIndex < currentIndex;
}

export function getNextPhase(currentPhase: ProjectPhase): ProjectPhase | null {
    const currentIndex = getPhaseIndex(currentPhase);
    if (currentIndex < PHASES_ORDER.length - 1) {
        return PHASES_ORDER[currentIndex + 1];
    }
    return null;
}

export function getPreviousPhase(currentPhase: ProjectPhase): ProjectPhase | null {
    const currentIndex = getPhaseIndex(currentPhase);
    if (currentIndex > 0) {
        return PHASES_ORDER[currentIndex - 1];
    }
    return null;
}
