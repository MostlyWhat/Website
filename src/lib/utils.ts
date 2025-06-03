import { type ClassValue, clsx } from 'clsx';
import { twMerge } from 'tailwind-merge';

const letters = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ';

export function cn(...inputs: ClassValue[]) {
	return twMerge(clsx(inputs));
}

export function glitchText(text: string) {
	const target = text;

	let iteration = 0;

	const interval = setInterval(() => {
		text = target
			.split('')
			.map((letter, index) => {
				if (index < iteration) {
					return target[index];
				}
				return letters[Math.floor(Math.random() * 26)];
			})
			.join('');

		if (iteration >= target.length) {
			clearInterval(interval);
		}

		iteration += 1 / 3;
	}, 30);
}

// eslint-disable-next-line @typescript-eslint/no-explicit-any
export type WithoutChild<T> = T extends { child?: any } ? Omit<T, 'child'> : T;
// eslint-disable-next-line @typescript-eslint/no-explicit-any
export type WithoutChildren<T> = T extends { children?: any } ? Omit<T, 'children'> : T;
export type WithoutChildrenOrChild<T> = WithoutChildren<WithoutChild<T>>;
export type WithElementRef<T, U extends HTMLElement = HTMLElement> = T & { ref?: U | null };
