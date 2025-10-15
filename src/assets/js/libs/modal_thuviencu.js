/**
 * jModal - Lightweight Modal Manager
 * Optimized for CLS, INP, and zero main-thread animation
 * Version: 1.0.0
 */

class jModal {
    constructor(options = {}) {
        this.modals = new Map(); // Store modal instances
        this.activeModals = new Set(); // Track active modals
        this.defaults = {
            closeOnBackdrop: true,
            closeOnEscape: true,
            preventScroll: true,
            animationDuration: 300, // ms
            onOpen: null,
            onClose: null,
            onBeforeOpen: null,
            onBeforeClose: null,
            ...options
        };

        // Bind methods
        this.handleEscape = this.handleEscape.bind(this);
        this.updateBodyScroll = this.updateBodyScroll.bind(this);

        // Setup global listeners
        this.setupGlobalListeners();
    }

    /**
     * Initialize modal(s) from selector, element, or data attribute
     * @param {string|HTMLElement|NodeList} target - CSS selector, element, or NodeList
     * @param {object} options - Modal options
     */
    init(target, options = {}) {
        let elements = [];

        if (typeof target === 'string') {
            // Support both ID selector and class selector
            if (target.startsWith('#')) {
                const el = document.querySelector(target);
                if (el) elements = [el];
            } else if (target.startsWith('.')) {
                elements = Array.from(document.querySelectorAll(target));
            } else {
                // Try as data attribute
                elements = Array.from(document.querySelectorAll(`[data-modal="${target}"]`));
            }
        } else if (target instanceof HTMLElement) {
            elements = [target];
        } else if (target instanceof NodeList || Array.isArray(target)) {
            elements = Array.from(target);
        }

        elements.forEach(element => {
            const modalId = element.id || element.dataset.modal || `jmodal-${this.generateId()}`;
            
            if (!this.modals.has(modalId)) {
                const modalOptions = {
                    ...this.defaults,
                    ...options,
                    ...this.parseDataAttributes(element)
                };

                this.modals.set(modalId, {
                    id: modalId,
                    element,
                    options: modalOptions,
                    isOpen: false,
                    triggers: []
                });

                this.setupModal(modalId);
            }
        });

        return this;
    }

    /**
     * Setup modal structure and listeners
     */
    setupModal(modalId) {
        const modal = this.modals.get(modalId);
        if (!modal) return;

        const { element, options } = modal;

        // Add modal class for styling
        element.classList.add('jmodal');

        // Ensure modal has proper structure
        this.ensureModalStructure(element);

        // Setup backdrop click listener
        if (options.closeOnBackdrop) {
            const backdrop = element.querySelector('.jmodal-backdrop');
            if (backdrop) {
                backdrop.addEventListener('click', (e) => {
                    if (e.target === backdrop) {
                        this.close(modalId);
                    }
                });
            }
        }

        // Setup close buttons
        const closeButtons = element.querySelectorAll('[data-jmodal-close]');
        closeButtons.forEach(btn => {
            btn.addEventListener('click', () => this.close(modalId));
        });

        // Auto-initialize triggers based on data attributes
        this.setupTriggers(modalId);
    }

    /**
     * Ensure modal has proper structure for animations
     */
    ensureModalStructure(element) {
        // Check if already has jmodal-backdrop
        if (!element.querySelector('.jmodal-backdrop')) {
            // Wrap content if needed
            const content = element.querySelector('.jmodal-content');
            if (!content) {
                console.warn('jModal: No .jmodal-content found. Modal structure should include .jmodal-backdrop and .jmodal-content');
            }
        }
    }

    /**
     * Setup trigger elements (buttons that open modals)
     */
    setupTriggers(modalId) {
        const triggers = document.querySelectorAll(`[data-jmodal-trigger="${modalId}"]`);
        triggers.forEach(trigger => {
            trigger.addEventListener('click', (e) => {
                e.preventDefault();
                this.open(modalId);
            });
        });
    }

    /**
     * Open modal with optimized CLS and INP
     */
    open(modalId, focusElement = null) {
        const modal = this.modals.get(modalId);
        if (!modal || modal.isOpen) return;

        const { element, options } = modal;

        // Call before open callback
        if (options.onBeforeOpen) {
            const shouldOpen = options.onBeforeOpen(modalId, element);
            if (shouldOpen === false) return;
        }

        // Remove hidden class FIRST (prevents CLS)
        element.classList.remove('hidden');

        // Force reflow to ensure hidden removal is processed
        void element.offsetHeight;

        // Use rAF to ensure smooth animation start
        requestAnimationFrame(() => {
            // Add active class for CSS transitions (compositor-only)
            element.classList.add('jmodal-active');

            // Update state
            modal.isOpen = true;
            this.activeModals.add(modalId);

            // Update body scroll
            this.updateBodyScroll();

            // Defer focus to avoid blocking
            if (focusElement || options.autoFocus !== false) {
                requestAnimationFrame(() => {
                    this.handleFocus(element, focusElement);
                });
            }

            // Call after open callback
            if (options.onOpen) {
                // Defer callback to next frame
                requestAnimationFrame(() => {
                    options.onOpen(modalId, element);
                });
            }
        });
    }

    /**
     * Close modal with optimized animations
     */
    close(modalId) {
        const modal = this.modals.get(modalId);
        if (!modal || !modal.isOpen) return;

        const { element, options } = modal;

        // Call before close callback
        if (options.onBeforeClose) {
            const shouldClose = options.onBeforeClose(modalId, element);
            if (shouldClose === false) return;
        }

        // Remove active class (triggers CSS transition)
        element.classList.remove('jmodal-active');

        // Update state immediately
        modal.isOpen = false;
        this.activeModals.delete(modalId);

        // Update body scroll
        this.updateBodyScroll();

        // Add hidden class after animation completes
        setTimeout(() => {
            if (!modal.isOpen) { // Double check state hasn't changed
                element.classList.add('hidden');
            }
        }, options.animationDuration);

        // Call after close callback
        if (options.onClose) {
            // Defer callback to next frame
            requestAnimationFrame(() => {
                options.onClose(modalId, element);
            });
        }
    }

    /**
     * Toggle modal state
     */
    toggle(modalId) {
        const modal = this.modals.get(modalId);
        if (!modal) return;

        if (modal.isOpen) {
            this.close(modalId);
        } else {
            this.open(modalId);
        }
    }

    /**
     * Check if modal is open
     */
    isOpen(modalId) {
        const modal = this.modals.get(modalId);
        return modal ? modal.isOpen : false;
    }

    /**
     * Handle focus management
     */
    handleFocus(element, focusElement) {
        if (focusElement) {
            const target = typeof focusElement === 'string' 
                ? element.querySelector(focusElement)
                : focusElement;
            
            if (target && typeof target.focus === 'function') {
                target.focus();
            }
        } else {
            // Focus first focusable element
            const focusable = element.querySelector(
                'button:not([disabled]), [href], input:not([disabled]), select:not([disabled]), textarea:not([disabled]), [tabindex]:not([tabindex="-1"])'
            );
            if (focusable) {
                focusable.focus();
            }
        }
    }

    /**
     * Update body scroll based on active modals
     */
    updateBodyScroll() {
        if (this.activeModals.size > 0) {
            // Disable scroll
            document.body.style.overflow = 'hidden';
        } else {
            // Re-enable scroll
            document.body.style.overflow = '';
        }
    }

    /**
     * Setup global event listeners
     */
    setupGlobalListeners() {
        // Escape key listener
        document.addEventListener('keydown', this.handleEscape);
    }

    /**
     * Handle escape key
     */
    handleEscape(e) {
        if (e.key === 'Escape') {
            // Close the most recently opened modal
            const lastModal = Array.from(this.activeModals).pop();
            if (lastModal) {
                const modal = this.modals.get(lastModal);
                if (modal && modal.options.closeOnEscape) {
                    this.close(lastModal);
                }
            }
        }
    }

    /**
     * Parse data attributes from element
     */
    parseDataAttributes(element) {
        const options = {};
        
        if (element.dataset.jmodalCloseBackdrop !== undefined) {
            options.closeOnBackdrop = element.dataset.jmodalCloseBackdrop !== 'false';
        }
        
        if (element.dataset.jmodalCloseEscape !== undefined) {
            options.closeOnEscape = element.dataset.jmodalCloseEscape !== 'false';
        }
        
        if (element.dataset.jmodalPreventScroll !== undefined) {
            options.preventScroll = element.dataset.jmodalPreventScroll !== 'false';
        }

        if (element.dataset.jmodalAutoFocus !== undefined) {
            options.autoFocus = element.dataset.jmodalAutoFocus !== 'false';
        }

        return options;
    }

    /**
     * Generate unique ID
     */
    generateId() {
        return Math.random().toString(36).substr(2, 9);
    }

    /**
     * Destroy modal instance
     */
    destroy(modalId) {
        const modal = this.modals.get(modalId);
        if (!modal) return;

        if (modal.isOpen) {
            this.close(modalId);
        }

        this.modals.delete(modalId);
    }

    /**
     * Destroy all modals
     */
    destroyAll() {
        this.modals.forEach((modal, modalId) => {
            this.destroy(modalId);
        });
        
        document.removeEventListener('keydown', this.handleEscape);
    }

    /**
     * Get modal instance
     */
    getModal(modalId) {
        return this.modals.get(modalId);
    }

    /**
     * Get all modals
     */
    getAllModals() {
        return Array.from(this.modals.values());
    }

    /**
     * Get active modals
     */
    getActiveModals() {
        return Array.from(this.activeModals);
    }
}

// Create global instance
if (typeof window !== 'undefined') {
    window.jModal = new jModal();
}

// Export for module systems
if (typeof module !== 'undefined' && module.exports) {
    module.exports = jModal;
}
