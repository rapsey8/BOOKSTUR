let slideIndex = 0;
let slideTimer;

function initCarousel() {
    showSlides(slideIndex);
    startTimer();
}

function startTimer() {
    clearInterval(slideTimer);
    slideTimer = setInterval(() => {
        moveSlide(1);
    }, 5000); // 5 seconds
}

function moveSlide(n) {
    slideIndex += n;
    showSlides(slideIndex);
    startTimer(); // Reset timer when manually moved
}

function currentSlide(n) {
    slideIndex = n;
    showSlides(slideIndex);
    startTimer(); // Reset timer when dot clicked
}

function showSlides(n) {
    let slides = document.getElementsByClassName("slide");
    let dots = document.getElementsByClassName("dot");
    let track = document.querySelector(".carousel-track");

    if (n >= slides.length) { slideIndex = 0; }
    if (n < 0) { slideIndex = slides.length - 1; }

    // Calculate the translation percentage
    let amountToMove = slideIndex * -100; // -100% per slide
    
    // We divide by the number of slides because the track width is total slides * 100%
    // but the translation is relative to the track's container
    track.style.transform = `translateX(${slideIndex * -25}%)`; 

    for (let i = 0; i < slides.length; i++) {
        slides[i].classList.remove("active");
        dots[i].classList.remove("active");
    }

    slides[slideIndex].classList.add("active");
    dots[slideIndex].classList.add("active");
}

// Start the carousel when DOM is loaded
document.addEventListener("DOMContentLoaded", initCarousel);
