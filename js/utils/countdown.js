export function initRsvpCountdown() {
    const rsvpDate = new Date('2026-06-15T23:59:59').getTime();

    function updateRsvpCountdown() {
        const distance = rsvpDate - Date.now();

        if (distance > 0) {
            const days = Math.floor(distance / (1000 * 60 * 60 * 24));
            const hours = Math.floor((distance % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
            const minutes = Math.floor((distance % (1000 * 60 * 60)) / (1000 * 60));
            const seconds = Math.floor((distance % (1000 * 60)) / 1000);

            document.getElementById('rsvp-days').textContent = String(days).padStart(2, '0');
            document.getElementById('rsvp-hours').textContent = String(hours).padStart(2, '0');
            document.getElementById('rsvp-minutes').textContent = String(minutes).padStart(2, '0');
            document.getElementById('rsvp-seconds').textContent = String(seconds).padStart(2, '0');
        } else {
            const el = document.getElementById('rsvp-countdown');
            if (el) {
                el.textContent = '';
                const closedMsg = document.createElement('p');
                closedMsg.className = 'rsvp-closed';
                closedMsg.textContent = 'RSVP Closed';
                el.appendChild(closedMsg);
            }
        }
    }

    updateRsvpCountdown();
    setInterval(updateRsvpCountdown, 1000);
}
