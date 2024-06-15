document.addEventListener('DOMContentLoaded', () => {
    const gallery = document.getElementById('gallery');
    const uploadBtns = document.querySelectorAll('.menu-button.upload, .upload');
    const downloadGalleryBtn = document.querySelector('.menu-button.download');
    const sortSelect = document.querySelector('.menu-button.sort');
    const favoriteSection = document.getElementById('favorites');

    const favorites = new Set();

    // Function to fetch images from the local server
    const fetchImages = async () => {
        try {
            const response = await axios.get('/images');
            const imageFiles = response.data;
            displayImages(imageFiles);
        } catch (error) {
            console.error('Error fetching images:', error);
        }
    };

    // Function to display images in the gallery
    const displayImages = (images) => {
        gallery.innerHTML = '';
        images.forEach(({ webp, original }) => {
            const galleryItem = document.createElement('div');
            galleryItem.className = 'gallery-item relative rounded-lg shadow-lg overflow-hidden';
            galleryItem.innerHTML = `
                <img src="galeria/${webp}" alt="${webp}" class="w-full h-full object-cover" loading="lazy">
                <div class="menu flex items-center justify-between w-full">
                    <div class="flex space-x-3">
                        <i class="fas fa-heart cursor-pointer ${favorites.has(`galeria/${webp}`) ? 'text-red-500' : ''}"></i>
                        <i class="fas fa-plus cursor-pointer hover:text-blue-500"></i>
                    </div>
                    <button class="bg-gray-700 hover:bg-gray-800 text-white py-1 px-3 rounded download-btn" data-original-image="${original}">Download</button>
                </div>
            `;
            gallery.appendChild(galleryItem);
        });
    };

    // Fetch initial set of images
    fetchImages();

    // Upload Image functionality
    const uploadInput = document.createElement('input');
    uploadInput.type = 'file';
    uploadInput.style.display = 'none';
    document.body.appendChild(uploadInput);

    const triggerUpload = () => {
        uploadInput.click();
    };

    uploadBtns.forEach(btn => {
        btn.addEventListener('click', triggerUpload);
    });

    uploadInput.addEventListener('change', async (event) => {
        const file = event.target.files[0];
        if (file) {
            const formData = new FormData();
            formData.append('image', file);

            try {
                await axios.post('/upload', formData, {
                    headers: {
                        'Content-Type': 'multipart/form-data'
                    }
                });
                fetchImages();
            } catch (error) {
                console.error('Error uploading image:', error);
            }
        }
    });

    // Download Gallery functionality
    downloadGalleryBtn.addEventListener('click', async () => {
        const zip = new JSZip();
        const images = document.querySelectorAll('.gallery-item img');
        const fetchPromises = [];

        images.forEach(img => {
            const imgUrl = img.src;
            const filename = imgUrl.split('/').pop();
            fetchPromises.push(
                fetch(imgUrl)
                    .then(res => res.blob())
                    .then(blob => {
                        zip.file(filename, blob);
                    })
            );
        });

        Promise.all(fetchPromises).then(() => {
            zip.generateAsync({ type: 'blob' }).then(content => {
                const link = document.createElement('a');
                link.href = URL.createObjectURL(content);
                link.download = 'gallery.zip';
                link.click();
            });
        });
    });

    // Download individual image functionality
    gallery.addEventListener('click', (event) => {
        if (event.target.classList.contains('download-btn')) {
            const originalImageName = event.target.getAttribute('data-original-image');
            if (originalImageName) {
                const link = document.createElement('a');
                link.href = `/download/${originalImageName}`;
                link.download = originalImageName;
                link.click();
            }
        }
    });

    // Sort Gallery functionality
    sortSelect.addEventListener('change', (event) => {
        const sortBy = event.target.value;
        const itemsArray = Array.from(gallery.children);
        itemsArray.sort((a, b) => {
            const imgA = a.querySelector('img');
            const imgB = b.querySelector('img');
            if (sortBy === 'size') {
                return imgA.naturalWidth * imgA.naturalHeight - imgB.naturalWidth * imgB.naturalHeight;
            } else if (sortBy === 'date') {
                return new Date(imgA.getAttribute('data-date')) - new Date(imgB.getAttribute('data-date'));
            }
        });
        itemsArray.forEach(item => gallery.appendChild(item));
    });

    // Favorites functionality
    gallery.addEventListener('click', (event) => {
        if (event.target.classList.contains('fa-heart')) {
            event.target.classList.toggle('text-red-500');
            const galleryItem = event.target.closest('.gallery-item');
            const imgSrc = galleryItem.querySelector('img').src;
            if (event.target.classList.contains('text-red-500')) {
                favorites.add(imgSrc);
                favoriteSection.appendChild(galleryItem.cloneNode(true));
                favoriteSection.classList.remove('hidden');
            } else {
                favorites.delete(imgSrc);
                const favoritesItems = favoriteSection.querySelectorAll('.gallery-item');
                favoritesItems.forEach(fav => {
                    if (fav.querySelector('img').src === imgSrc) {
                        favoriteSection.removeChild(fav);
                    }
                });
                if (favorites.size === 0) {
                    favoriteSection.classList.add('hidden');
                }
            }
        }
    });

    const hamburger = document.getElementById('hamburger');
    const mobileMenu = document.getElementById('mobile-menu');
    const overlay = document.getElementById('overlay');
    const closeMenu = document.getElementById('close-menu');

    const closeMenuFunction = () => {
        hamburger.classList.remove('active');
        mobileMenu.classList.remove('open');
        overlay.classList.remove('active');
    };

    hamburger.addEventListener('click', () => {
        hamburger.classList.toggle('active');
        mobileMenu.classList.toggle('open');
        overlay.classList.toggle('active');
    });

    overlay.addEventListener('click', closeMenuFunction);
    closeMenu.addEventListener('click', closeMenuFunction);
});
