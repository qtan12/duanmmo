
// FAQ Component
function faqComponent() {
    return {
        // State
        openFaqs: [true, false, false, false, false], // First FAQ is open by default
        
        // Initialize component
        init() {
            console.log('FAQ component initialized.');
        },
        
        // Methods
        toggleFaq(index) {
            this.openFaqs[index] = !this.openFaqs[index];
        }
    };
}