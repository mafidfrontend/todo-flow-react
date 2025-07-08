import '@testing-library/jest-dom';

// Add vitest globals
import { vi } from 'vitest';

// Make vi available globally
(global as any).vi = vi;