import { loadStripe } from '@stripe/stripe-js';

// Initialize Stripe once globally
// We check for both VITE_ and NEXT_PUBLIC_ prefixes to ensure compatibility
const stripePublishableKey = import.meta.env.VITE_STRIPE_PUBLISHABLE_KEY ||
    import.meta.env.NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY ||
    '';

if (!stripePublishableKey) {
    console.warn('Stripe publishable key is missing. Checkout will not work.');
}

export const stripePromise = loadStripe(stripePublishableKey);
