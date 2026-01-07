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

    // Advanced Seating Chart Logic
    const tableCircles = document.querySelectorAll('.table-circle');
    const seatingSearch = document.getElementById('seatingSearch');
    const searchResults = document.getElementById('searchResults');
    const clearSearch = document.getElementById('clearSearch');
    const selectedGuestInfo = document.getElementById('selectedGuestInfo');

    let allGuests = []; // Flattened list for search

    function hideSelectedInfo() {
        if (selectedGuestInfo) {
            selectedGuestInfo.style.display = 'none';
            selectedGuestInfo.innerHTML = '';
        }
    }

    // Load Guest Data from CSV
    async function loadGuestData() {
        try {
            Papa.parse('guests.csv', {
                download: true,
                header: true,
                complete: function (results) {
                    processCSVData(results.data);
                },
                error: function (err) {
                    console.error('Error parsing CSV:', err);
                }
            });
        } catch (error) {
            console.error('Error loading guest data:', error);
        }
    }

    function processCSVData(rows) {
        // Expected CSV Headers: First Name, Last Name, Nickname, Table Number
        allGuests = [];
        rows.forEach(row => {
            const firstName = (row['First Name'] || row['ชื่อ'] || '').trim();
            const lastName = (row['Last Name'] || row['นามสกุล'] || '').trim();
            const nickName = (row['Nickname'] || row['ชื่อเล่น'] || '').trim();
            const tableId = (row['Table Number'] || row['หมายเลขโต๊ะ'] || row['โต๊ะ'] || '').trim();

            if (firstName && tableId) {
                allGuests.push({
                    firstName,
                    lastName,
                    nickName,
                    table: tableId
                });
            }
        });
        console.log('Guests loaded from local CSV:', allGuests.length);
    }

    loadGuestData();

    function clearAllHighlights() {
        tableCircles.forEach(circle => {
            circle.classList.remove('is-highlighted');
        });
    }

    // Search Logic
    if (seatingSearch) {
        seatingSearch.addEventListener('input', (e) => {
            const query = e.target.value.trim().toLowerCase();

            // Clear highlights and previous info when searching anew
            clearAllHighlights();
            hideSelectedInfo();

            if (query.length >= 1) {
                clearSearch.style.display = 'block';
                const filtered = allGuests.map(guest => {
                    const fullName = (guest.firstName + ' ' + guest.lastName).toLowerCase();
                    const nickName = (guest.nickName || '').toLowerCase();

                    let score = 0;
                    if (fullName === query || nickName === query) score = 100;
                    else if (fullName.startsWith(query) || nickName.startsWith(query)) score = 50;
                    else if (fullName.includes(query) || nickName.includes(query)) score = 10;

                    return { ...guest, score };
                }).filter(g => g.score > 0)
                    .sort((a, b) => b.score - a.score)
                    .slice(0, 3); // Limit to 3 items

                displaySearchResults(filtered, query);
            } else {
                hideSearchResults();
                // Show clear button if there is any text, even if < 3 chars
                if (query.length > 0) {
                    clearSearch.style.display = 'block';
                } else {
                    clearSearch.style.display = 'none';
                }
            }
        });
    }

    function displaySearchResults(results, query) {
        if (results.length > 0) {
            searchResults.innerHTML = results.map(guest => `
                <div class="search-result-item" data-table="${guest.table}" data-firstname="${guest.firstName}" data-lastname="${guest.lastName}" data-nickname="${guest.nickName || ''}">
                    <div class="result-info">
                        <span class="result-name">${highlightMatch(guest.firstName + ' ' + guest.lastName, query)}</span>
                        ${guest.nickName ? `<span class="result-nickname">(${highlightMatch(guest.nickName, query)})</span>` : ''}
                    </div>
                </div>
            `).join('');
            searchResults.style.display = 'block';

            // Add click events to results
            document.querySelectorAll('.search-result-item').forEach(item => {
                item.addEventListener('click', () => {
                    const tableNum = item.getAttribute('data-table');
                    const firstName = item.getAttribute('data-firstname');
                    const lastName = item.getAttribute('data-lastname');
                    const nickName = item.getAttribute('data-nickname');

                    hideSearchResults();
                    seatingSearch.value = '';
                    clearSearch.style.display = 'none';

                    // Show selection feedback
                    if (selectedGuestInfo) {
                        selectedGuestInfo.innerHTML = `
                            <span class="info-name">${firstName} ${lastName} ${nickName ? `(${nickName})` : ''}</span>
                            <div class="info-table">หมายเลขโต๊ะ: ${tableNum}</div>
                        `;
                        selectedGuestInfo.style.display = 'block';
                    }

                    // Visual feedback: highlight the table in the grid
                    clearAllHighlights();
                    const circle = document.querySelector(`.table-circle[data-table="${tableNum}"]`);
                    if (circle) {
                        // Smooth scroll to table
                        // circle.scrollIntoView({ behavior: 'smooth', block: 'center' });

                        // Persistent highlight
                        circle.classList.add('is-highlighted');
                    }
                });
            });
        } else {
            searchResults.innerHTML = '<div class="search-result-item" style="cursor:default; opacity:0.7;">ไม่พบข้อมูล...</div>';
            searchResults.style.display = 'block';
        }
    }

    function highlightMatch(text, query) {
        if (!query) return text;
        const index = text.toLowerCase().indexOf(query);
        if (index === -1) return text;
        return text.substring(0, index) + '<span class="highlight">' + text.substring(index, index + query.length) + '</span>' + text.substring(index + query.length);
    }

    function hideSearchResults() {
        searchResults.style.display = 'none';
        clearSearch.style.display = 'none';
    }

    if (clearSearch) {
        clearSearch.addEventListener('click', () => {
            seatingSearch.value = '';
            hideSearchResults();
            clearAllHighlights(); // Clear highlights when clear button clicked
            hideSelectedInfo(); // Clear selected info feedback
            seatingSearch.focus();
        });
    }

    // Close search results when clicking outside
    document.addEventListener('click', (e) => {
        if (!e.target.closest('.search-container')) {
            hideSearchResults();
        }
    });
});
