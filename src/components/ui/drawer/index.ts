import './drawer-coverage.css';

// Re-export the vendor Drawer. Visual-viewport coverage lives in CSS so every
// consumer (filters, nav, future drawers) gets it without per-feature spacers.
export * from '../primitives/drawer';
