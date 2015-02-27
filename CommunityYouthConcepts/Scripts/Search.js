
$(document).ready(function () {
    InitializeSliders();
});


function InitializeSliders() {
    $('.center').slick({
        centerMode: true,
        centerPadding: '60px',
        slidesToShow: 3,
        responsive: [
          {
              breakpoint: 768,
              settings: {
                  arrows: false,
                  centerMode: true,
                  centerPadding: '40px',
                  slidesToShow: 3
              }
          },
          {
              breakpoint: 480,
              settings: {
                  arrows: false,
                  centerMode: true,
                  centerPadding: '40px',
                  slidesToShow: 1
              }
          }
        ]
    });

    $('.center').on('swipe', function (event, slick, direction) {
        alert('swipe');
        console.log(direction);
        // left
    });

    // On edge hit
    $('.center').on('edge', function (event, slick, direction) {
        alert('edge');
        console.log('edge was hit')
    });

    // On before slide change
    $('.center').on('beforeChange', function (event, slick, currentSlide, nextSlide) {
        alert('before');
        console.log(nextSlide);
    });


    // On before slide change
    $('.center').on('beforeChange', function (event, slick, currentSlide, nextSlide) {
        alert('before');
        console.log(nextSlide);
    });

}

