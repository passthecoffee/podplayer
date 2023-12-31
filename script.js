// Constants
const rssFeedURL = 'https://podcasts.files.bbci.co.uk/p02nrv1v.rss';
const itemsPerPage = 5;

// Variables
let currentOffset = 0;
let podcastItems = [];

// DOM Elements
const podcastContainer = document.getElementById('podcast-container');
const prevButton = document.getElementById('prev-button');
const nextButton = document.getElementById('next-button');

// Fetch the RSS feed data
fetch(rssFeedURL)
    .then(response => response.text())
    .then(data => {
        const parser = new DOMParser();
        const xmlDoc = parser.parseFromString(data, 'text/xml');
        const items = xmlDoc.querySelectorAll('item');
        
        podcastItems = Array.from(items).map(item => {
            return {
                title: item.querySelector('title').textContent,
                description: item.querySelector('description').textContent,
                image: item.querySelector('itunes\\:image\\:url')?.getAttribute('url') || '',
                duration: item.querySelector('itunes\\:duration')?.textContent,
                date: new Date(item.querySelector('pubDate').textContent),
            };
        });

        updatePodcastDisplay();
    })
    .catch(error => console.error('Error fetching RSS feed:', error));

// Function to update the displayed podcast items
function updatePodcastDisplay() {
    const startIndex = currentOffset * itemsPerPage;
    const endIndex = startIndex + itemsPerPage;
    const displayedItems = podcastItems.slice(startIndex, endIndex);

    // Clear the container
    podcastContainer.innerHTML = '';

    // Display the items
    displayedItems.forEach(item => {
        const itemDiv = document.createElement('div');
        itemDiv.innerHTML = `
            <img src="${item.image}">
            <h2>Title: ${item.title}</h2>
            <p>Duration: ${item.duration}</p>
            <p>Date: ${item.date.toDateString()}</p>
            <p>Description: ${item.description}</p>
            <img src="${item.image}" alt="Podcast Artwork">
            <p>${item.image} item</p>
            
            
            <!-- Add other HTML elements for displaying additional data -->
        `;
        podcastContainer.appendChild(itemDiv);
    });

    // Disable/Enable navigation buttons based on the offset
    prevButton.disabled = currentOffset === 0;
    nextButton.disabled = endIndex >= podcastItems.length;
}

// Event listeners for navigation buttons
prevButton.addEventListener('click', () => {
    if (currentOffset > 0) {
        currentOffset--;
        updatePodcastDisplay();
    }
});

nextButton.addEventListener('click', () => {
    if (currentOffset < Math.ceil(podcastItems.length / itemsPerPage) - 1) {
        currentOffset++;
        updatePodcastDisplay();
    }
});