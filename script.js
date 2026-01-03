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

    // Add to Calendar
    document.getElementById('addToCalendar').addEventListener('click', () => {
        const title = "Keng & Pumpim Wedding";
        const location = "อาคารหอประชุม อำเภอแปลงยาว";
        const details = "ขอเชิญร่วมงานมงคลสมรส รตนพล สงฆ์ธรรม และ ชนิษฐา เสาวนา";
        const startDate = "20260627T070000";
        const endDate = "20260627T140000";

        const googleCalendarUrl = `https://www.google.com/calendar/render?action=TEMPLATE&text=${encodeURIComponent(title)}&dates=${startDate}/${endDate}&details=${encodeURIComponent(details)}&location=${encodeURIComponent(location)}&sf=true&output=xml`;

        window.open(googleCalendarUrl, '_blank');
    });
});
