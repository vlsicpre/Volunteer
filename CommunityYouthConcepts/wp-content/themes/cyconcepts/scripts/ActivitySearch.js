
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

    var interests = GetCategories("interest");
    var issues = GetCategories("issue");
    var intervals = GetCategories("time");
    //LoadCriteriaSliderData("Interests", interests);
   // LoadCriteriaSliderData("Issues", issues);
   // LoadCriteriaSliderData("Intervals", intervals);    
}

function GetCategories(categoryId)
{
    var serviceURL = "http://www.cyconcepts.org/wp-json/taxonomies/" + "issues" + "/terms";


    //$.ajax({
    //    url: serviceURL,
    //    dataType: 'json',
    //    data: data,
    //    success: function (data) { alert('test');}
    //});

    //$.get(serviceURL, function (data) {
    //    alert(data);
    //}, "json");


    //$.ajax({
    //    dataType: "json",
    //    url: serviceURL,
    //    data: null,
    //    success: function (data) { alert(data);}
    //});
}

function LoadCriteriaSliderData(sliderId, listData)
{
    for (var i = 0; i < listData.Length; i++)
    {
        $(sliderId).slick('slickAdd', "<div issueid='"+  listData[i].Id +"'>"+ listData[i].Name+"</div>");
    }
}


