document.addEventListener('DOMContentLoaded', () => {
    // RSVP form logic removed as it now links to an external Google Form


    // Countdown Logic
    const weddingDate = new Date('2026-06-27T07:00:00').getTime();

    function updateCountdown() {
        const now = new Date().getTime();
        const distance = weddingDate - now;

        const days = Math.floor(distance / (1000 * 60 * 60 * 24));
        const hours = Math.floor((distance % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
        const minutes = Math.floor((distance % (1000 * 60 * 60)) / (1000 * 60));
        const seconds = Math.floor((distance % (1000 * 60)) / 1000);

        document.getElementById('days').innerText = String(days).padStart(2, '0');
        document.getElementById('hours').innerText = String(hours).padStart(2, '0');
        document.getElementById('minutes').innerText = String(minutes).padStart(2, '0');
        document.getElementById('seconds').innerText = String(seconds).padStart(2, '0');

        if (distance < 0) {
            clearInterval(countdownInterval);
            document.getElementById('countdown').innerHTML = "ถึงวันแต่งงานแล้ว!";
        }
    }

    const countdownInterval = setInterval(updateCountdown, 1000);
    updateCountdown(); // Initial call

    // Copy Bank Account
    const copyBankBtn = document.getElementById('copyBankBtn');
    const accountNumber = document.getElementById('accountNumber');
    const copyToast = document.getElementById('copyToast');

    if (copyBankBtn && accountNumber) {
        copyBankBtn.addEventListener('click', () => {
            const textToCopy = accountNumber.innerText.replace(/-/g, '');
            navigator.clipboard.writeText(textToCopy).then(() => {
                // Show toast
                copyToast.classList.add('show');
                setTimeout(() => {
                    copyToast.classList.remove('show');
                }, 2000);
            }).catch(err => {
                console.error('Failed to copy: ', err);
            });
        });
    }

    // Open Bank App (K-Plus for K-Bank)
    const openBankAppBtn = document.getElementById('openBankAppBtn');
    if (openBankAppBtn) {
        openBankAppBtn.addEventListener('click', (e) => {
            // For K-Bank, we try to open K PLUS app
            // Note: This works on mobile devices that have K PLUS installed
            // Fallback is just the default link if it fails, but here we use a button
            window.location.href = 'kplus://';
            
            // If it doesn't open in 2 seconds, maybe we can show a message or redirect to store
            // but for now, simple redirection to scheme is what was asked.
        });
    }
});
