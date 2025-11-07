document.addEventListener('DOMContentLoaded', () => {
    const galleryItems = document.querySelectorAll('.gallery-item img');
    const lightbox = document.getElementById('lightbox');
    const lightboxImage = document.getElementById('lightbox-image');
    const closeBtn = document.querySelector('.close-btn');
    const prevBtn = document.querySelector('.prev-btn');
    const nextBtn = document.querySelector('.next-btn');
    const filterButtons = document.querySelectorAll('.filter-btn');
    
    let currentIndex = 0;
    const allImages = Array.from(galleryItems); // All images in the gallery

    // --- Lightbox Functionality ---

    // Open Lightbox
    galleryItems.forEach(item => {
        item.addEventListener('click', (e) => {
            currentIndex = parseInt(e.target.dataset.index);
            openLightbox(currentIndex);
        });
    });

    const openLightbox = (index) => {
        lightbox.classList.add('open');
        updateLightboxImage(index);
    };

    const closeLightbox = () => {
        lightbox.classList.remove('open');
    };

    const updateLightboxImage = (index) => {
        currentIndex = index;
        const image = allImages[currentIndex];
        
        // Use a slight delay and opacity change for a smooth transition effect
        lightboxImage.style.opacity = '0';
        setTimeout(() => {
            lightboxImage.src = image.src;
            lightboxImage.alt = image.alt;
            lightboxImage.style.opacity = '1';
        }, 150);
    };

    // Close on button click or background click
    closeBtn.addEventListener('click', closeLightbox);
    lightbox.addEventListener('click', (e) => {
        if (e.target === lightbox) {
            closeLightbox();
        }
    });

    // Close on ESC key
    document.addEventListener('keydown', (e) => {
        if (e.key === 'Escape' && lightbox.classList.contains('open')) {
            closeLightbox();
        }
    });

    // --- Navigation (Next/Prev Buttons) ---
    
    prevBtn.addEventListener('click', () => {
        currentIndex = (currentIndex > 0) ? currentIndex - 1 : allImages.length - 1;
        updateLightboxImage(currentIndex);
    });

    nextBtn.addEventListener('click', () => {
        currentIndex = (currentIndex < allImages.length - 1) ? currentIndex + 1 : 0;
        updateLightboxImage(currentIndex);
    });
    
    // --- Image Filtering (Bonus) ---
    filterButtons.forEach(button => {
        button.addEventListener('click', () => {
            const filter = button.dataset.filter;
            
            // Update active state for buttons
            filterButtons.forEach(btn => btn.classList.remove('active'));
            button.classList.add('active');

            // Filter the gallery items
            document.querySelectorAll('.gallery-item').forEach(item => {
                const itemFilter = item.classList[1]; // Get the category class (e.g., 'nature')
                
                if (filter === 'all' || itemFilter === filter) {
                    item.classList.remove('hidden');
                } else {
                    item.classList.add('hidden');
                }
            });
        });
    });
});
