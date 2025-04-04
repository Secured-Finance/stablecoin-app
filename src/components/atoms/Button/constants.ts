import { ButtonSizes, ButtonVariants } from './types';

export const FIGMA_STORYBOOK_LINK =
    'https://www.figma.com/design/YIBsk1ihFbPlDb8XldGj1T/SF-Design-System?node-id=2612-6598';

export const variantStyle: { [key in ButtonVariants]: string } = {
    [ButtonVariants.primary]:
        'border-transparent bg-primary-500 text-neutral-50 hover:bg-primary-700 active:border-primary-500 disabled:bg-primary-500/[33%] disabled:text-neutral-50',
    [ButtonVariants.secondary]:
        'border-primary-500 bg-transparent text-primary-500 hover:border-primary-700 hover:text-primary-700 active:border-primary-500 active:bg-primary-300/10 active:text-primary-500 disabled:border-primary-500/30 disabled:text-primary-500/30 disabled:bg-transparent',
    [ButtonVariants.tertiary]:
        'border-neutral-600 bg-transparent text-neutral-900 hover:border-neutral-300 active:border-neutral-500 active:bg-neutral-100 active:text-neutral-600 disabled:border-neutral-200 disabled:bg-neutral-50 disabled:text-neutral-300',
};

export const sizeStyle: { [key in ButtonSizes]: string } = {
    [ButtonSizes.xxs]: 'rounded-md px-2.5 py-0.5',
    [ButtonSizes.xs]: 'rounded-md px-2.5 py-1',
    [ButtonSizes.sm]: 'rounded-md px-3 py-2',
    [ButtonSizes.md]: 'rounded-md px-3.5 py-2.5',
    [ButtonSizes.lg]: 'rounded-lg py-3 px-5',
};

export const textStyle: { [key in ButtonSizes]: string } = {
    [ButtonSizes.xxs]: 'text-2.5 leading-3.5',
    [ButtonSizes.xs]: 'text-2.5 leading-3.5',
    [ButtonSizes.sm]: 'text-3 leading-3.5',
    [ButtonSizes.md]: 'text-3.5 leading-4.5',
    [ButtonSizes.lg]: 'text-4 leading-5',
};
