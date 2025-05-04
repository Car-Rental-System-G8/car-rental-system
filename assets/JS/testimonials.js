document.addEventListener('DOMContentLoaded', function() {
    const testimonialCarousel = new bootstrap.Carousel(document.getElementById('testimonialCarousel'), {
        interval: 5000,  // 5 seconds per slide
        wrap: true,      // Continuous loop
        keyboard: true,  // Allow keyboard navigation
        pause: 'hover',  // Pause on mouse hover
        touch: true      // Enable touch swiping on mobile
    });
    
    const carouselElement = document.getElementById('testimonialCarousel');
    
    carouselElement.addEventListener('slide.bs.carousel', function(event) {
        const nextSlide = event.relatedTarget;
    });
    
    carouselElement.addEventListener('slid.bs.carousel', function() {
    });
});