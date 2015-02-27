
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

    // On after slide change
    $('.center').on('afterChange', function (event, slick, currentSlide, nextSlide) {
        var issueid = $(slick.$slides.get(currentSlide)).attr("issueid");




    });

    var interests = LoadCategories("Interests");
    var issues = LoadCategories("Issues");
    var intervals = LoadCategories("Intervals"); 
}

function LoadCategories(categoryId)
{
    var serviceURL = "http://www.cyconcepts.org/wp-json/taxonomies/" + "issues" + "/terms";
    var isDEV = document.location.href.indexOf('localhost') > 0;
    if (isDEV) {
        serviceURL = "/TestData/issues.xml";
    }

    var res = $.ajax({
        url: serviceURL,
        dataType: 'json',
        success: function (data) {
            LoadCriteriaSliderData(categoryId, data);
        },
        error: function (error) {
            alert(error);
        }
    });
}

function LoadCriteriaSliderData(sliderId, listData)
{
    for (var i = 0; i < listData.length; i++)
    {
        $("#" + sliderId).slick('slickAdd', "<div issueid='" + listData[i].ID + "'><img src='" + listData[i].image_url + "' />"
             + listData[i].name +   "</div>");
    }
}


