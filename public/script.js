document.addEventListener('DOMContentLoaded', () => {
    const scheduleContainer = document.getElementById('scheduleContainer');
    const categorySearchInput = document.getElementById('categorySearch');
    const eventStartTime = new Date();
    eventStartTime.setHours(10, 0, 0, 0); // Event starts at 10:00 AM

    const TALK_DURATION = 60; // minutes
    const TRANSITION_DURATION = 10; // minutes
    const LUNCH_BREAK_DURATION = 60; // minutes

    let currentSchedule = [];

    async function fetchTalks(category = '') {
        let url = '/api/talks';
        if (category) {
            url += `?category=${encodeURIComponent(category)}`;
        }
        try {
            const response = await fetch(url);
            if (!response.ok) {
                throw new Error(`HTTP error! status: ${response.status}`);
            }
            const talks = await response.json();
            return talks;
        } catch (error) {
            console.error('Error fetching talks:', error);
            return [];
        }
    }

    function calculateAndRenderSchedule(allTalks) {
        scheduleContainer.innerHTML = ''; // Clear previous schedule
        let currentTime = new Date(eventStartTime);
        let talkCounter = 0;
        const maxTalks = 6;
        let talksToDisplay = allTalks.filter(talk => talk.categories.includes("Break") || talkCounter < maxTalks);

        // Sort talks to ensure lunch is placed correctly, and remaining talks fit
        // Assuming lunch is the third item in the original talksData.
        // For dynamic filtering, we need a robust way to insert it.
        // Simpler approach: know where lunch is in the initial full list.

        currentSchedule = [];
        let talkIndex = 0;

        for (let i = 0; i < talksToDisplay.length; i++) {
            const talk = talksToDisplay[i];
            const startTime = new Date(currentTime);
            const endTime = new Date(currentTime.getTime() + talk.duration * 60 * 1000);

            if (talk.title === "Lunch Break" || talkIndex === 2) { // Insert lunch after the second actual talk
                const lunchTalk = allTalks.find(t => t.title === "Lunch Break");
                if (lunchTalk) {
                     // Check if lunch is already scheduled or would be duplicated
                    if (!currentSchedule.some(item => item.title === "Lunch Break")) {
                        const lunchStartTime = new Date(currentTime);
                        const lunchEndTime = new Date(currentTime.getTime() + LUNCH_BREAK_DURATION * 60 * 1000);
                        currentSchedule.push({ ...lunchTalk, startTime: lunchStartTime, endTime: lunchEndTime });
                        currentTime = new Date(lunchEndTime);
                        // Add transition after lunch if there are more talks
                        if (talksToDisplay.length - talkIndex > 0) {
                            currentTime = new Date(currentTime.getTime() + TRANSITION_DURATION * 60 * 1000);
                        }
                    }
                }
            }
            
            // Only add talks that are not lunch break and are within the 6 talk limit
            if (talk.title !== "Lunch Break" && talkCounter < maxTalks) {
                const talkStartTime = new Date(currentTime);
                const talkEndTime = new Date(currentTime.getTime() + talk.duration * 60 * 1000);
                currentSchedule.push({ ...talk, startTime: talkStartTime, endTime: talkEndTime });
                currentTime = new Date(talkEndTime);
                talkCounter++;
                talkIndex++;

                // Add transition between talks, but not after the last talk
                if (talkCounter < maxTalks && i < talksToDisplay.length -1) { // Ensure no transition after the 6th talk if it's the last one in the original data
                    currentTime = new Date(currentTime.getTime() + TRANSITION_DURATION * 60 * 1000);
                }
            }
        }
        
        renderSchedule(currentSchedule);
    }

    function renderSchedule(scheduleItems) {
        scheduleContainer.innerHTML = '';
        if (scheduleItems.length === 0) {
            scheduleContainer.innerHTML = '<p>No talks found for this category.</p>';
            return;
        }

        scheduleItems.forEach(item => {
            const talkCard = document.createElement('div');
            talkCard.classList.add('talk-card');
            if (item.title === "Lunch Break") {
                talkCard.classList.add('break');
            }

            const startTimeStr = item.startTime.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
            const endTimeStr = item.endTime.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });

            talkCard.innerHTML = `
                <div class="talk-time">${startTimeStr} - ${endTimeStr}</div>
                <h2 class="talk-title">${item.title}</h2>
                ${item.speakers.length > 0 ? `<div class="talk-speakers">Speakers: ${item.speakers.join(', ')}</div>` : ''}
                ${item.categories.length > 0 && item.title !== "Lunch Break" ? `<div class="talk-categories">Categories: ${item.categories.map(cat => `<span>${cat}</span>`).join('')}</div>` : ''}
                <p class="talk-description">${item.description}</p>
            `;
            scheduleContainer.appendChild(talkCard);
        });
    }

    // Initial load
    async function initializeSchedule() {
        const allTalks = await fetchTalks();
        // Filter out the 'Lunch Break' from the initial talks list before passing to calculateAndRenderSchedule
        // as it will be inserted manually.
        const actualTalks = allTalks.filter(talk => talk.title !== "Lunch Break");
        calculateAndRenderSchedule(actualTalks);
    }

    categorySearchInput.addEventListener('input', async (event) => {
        const searchTerm = event.target.value;
        const allTalks = await fetchTalks(searchTerm);
        const actualTalks = allTalks.filter(talk => talk.title !== "Lunch Break");
        calculateAndRenderSchedule(actualTalks);
    });

    initializeSchedule();
});
