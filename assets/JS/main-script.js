$(document).ready(function () {
  // Auto-cycle the carousel
  $(".carousel").carousel({
    interval: 3000,
  });

  // Add animations when carousel slides
  $("#carCarousel").on("slide.bs.carousel", function () {
    $(".car-info-badge").css("opacity", "0");
    setTimeout(function () {
      $(".car-info-badge").css("opacity", "1");
    }, 600);
  });

  // Smooth navbar background change on scroll
  $(window).scroll(function () {
    if ($(this).scrollTop() > 50) {
      $(".navbar").css("background-color", "rgba(255, 255, 255, 0.98)");
      $(".navbar").css("box-shadow", "0 4px 12px rgba(0, 0, 0, 0.1)");
    } else {
      $(".navbar").css("background-color", "rgba(255, 255, 255, 0.95)");
      $(".navbar").css("box-shadow", "0 2px 8px rgba(0, 0, 0, 0.05)");
    }
  });

  // Animate elements on page load
  setTimeout(function () {
    $(".hero-title").css("opacity", "1");
    $(".hero-text").css("opacity", "1");
    $(".btn-explore").css("opacity", "1");
  }, 300);
});

// // Handle nav link clicks to update active state
// $(".nav-link").click(function (e) {
//   e.preventDefault();
//   $(".nav-link").removeClass("active");
//   $(this).addClass("active");
// });

