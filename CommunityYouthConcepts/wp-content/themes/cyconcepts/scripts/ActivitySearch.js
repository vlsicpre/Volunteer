
$(document).ready(function () {
    InitializeSliders();
});


function InitializeSliders() {
    $('.center').slick({
        centerMode: true,
        lazyLoad: 'ondemand',
        infinite: true,
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


    // On before slide change
    $('.center').on('beforeChange', function (event, slick, currentSlide, nextSlide) {
        alert('before');
        console.log(nextSlide);
    });

    // On before slide change
    $('.center').on('afterChange', function (event, slick, currentSlide, nextSlide) {
        alert('after');
        //var currentSlide = $('.center').slick('slick-center');

        //var slide = $(slider.$slides.get(index)).data('caption');
        var issueid = slick.$slides.get(1).attr('issueid');
        console.log(nextSlide);
    });

}

