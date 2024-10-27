import { backend } from "declarations/backend";

let currentPhotoBlob = null;

document.getElementById('photoInput').addEventListener('change', handlePhotoUpload);
document.getElementById('generateBtn').addEventListener('click', generateAvatar);

function handlePhotoUpload(event) {
    const file = event.target.files[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onload = async (e) => {
        // Display original photo preview
        const originalPreview = document.getElementById('originalPreview');
        originalPreview.src = e.target.result;

        // Convert to Blob
        const response = await fetch(e.target.result);
        currentPhotoBlob = await response.blob();

        // Enable generate button
        document.getElementById('generateBtn').disabled = false;
    };
    reader.readAsDataURL(file);
}

async function generateAvatar() {
    if (!currentPhotoBlob) return;

    const generateBtn = document.getElementById('generateBtn');
    const spinner = document.getElementById('spinner');
    
    try {
        // Show loading state
        generateBtn.disabled = true;
        spinner.classList.remove('d-none');

        // Convert Blob to Uint8Array
        const arrayBuffer = await currentPhotoBlob.arrayBuffer();
        const photoBytes = new Uint8Array(arrayBuffer);

        // Call backend to store photo and generate avatar
        const avatarId = await backend.generateAvatar(photoBytes);

        // Get the generated avatar
        const avatar = await backend.getAvatar(avatarId);
        if (avatar.length === 0) throw new Error("Failed to generate avatar");

        // Convert Uint8Array to Blob and create URL
        const avatarBlob = new Blob([avatar], { type: 'image/png' });
        const avatarUrl = URL.createObjectURL(avatarBlob);

        // Display avatar
        document.getElementById('avatarPreview').src = avatarUrl;
    } catch (error) {
        console.error('Error generating avatar:', error);
        alert('Failed to generate avatar. Please try again.');
    } finally {
        // Reset loading state
        generateBtn.disabled = false;
        spinner.classList.add('d-none');
    }
}
