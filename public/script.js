document.addEventListener('DOMContentLoaded', () => {
    const gallery = document.getElementById('gallery');
    const uploadBtns = document.querySelectorAll('.menu-button.upload, .upload');
    const downloadGalleryBtn = document.querySelector('.menu-button.download');

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
});
