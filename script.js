document.addEventListener('DOMContentLoaded', () => {
  const container = document.getElementById('container');
  const registerBtn = document.getElementById('signUpBtn');
  const loginBtn = document.getElementById('signInBtn');
  const video = document.getElementById('bgVideo');

  // Ensures video plays automatically on load
  if (video) {
    video.muted = true;
    video.play().catch(err => console.log("Autoplay error:", err));
  }

  registerBtn.addEventListener('click', () => {
    container.classList.add('active');
  });

  loginBtn.addEventListener('click', () => {
    container.classList.remove('active');
  });
});