
$(document).ready(function () {
    InitializeSliders();
});


function InitializeSliders() {


    var interests = LoadCategories("Interests");
    var issues = LoadCategories("Issues");
    var intervals = LoadCategories("Intervals");

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
        var criteria = GetSearchCriteria();
        Search(criteria, 1);
    });

}


function SearchCriteria() {
    this.InterestId = "";
    this.IssueId = "";
    this.IntervalId = "";
}

function GetSearchCriteria()
{
    var criteria = new SearchCriteria();
    criteria.InterestId = $("#Interests > div .slick-center").attr('dataId');
    criteria.IssueId = $("#Issues > div .slick-center").attr('dataId');
    criteria.IntervalId = $("#Intervals > div .slick-center").attr('dataId');
    
    return criteria;
}

function Search(criteria, countOnly) {
    var serviceURL = "http://www.cyconcepts.org/wp-json/posts?filter[issue]=" + criteria.IssueId
        + "&filter[interest]=" + criteria.InterestId + "&filter[time]=" + criteria.IntervalId;
    var isDEV = document.location.href.indexOf('localhost') > 0;
    if (isDEV) {
        serviceURL = "/TestData/search.xml";
    }

    //var res = $.ajax({
    //    url: serviceURL,
    //    dataType: 'json',
    //    success: function (data) {
    //        LoadResults(data, countOnly);
    //    },
    //    error: function (error) {
    //        alert(error);
    //    }
    //});
}


function LoadResults(data, countOnly)
{
    if (countOnly == 1)
    {
        //Update the status bar only
    }
    else {
        SetMode("Results");

    }

}

function LoadCategories(categoryId)
{
    var serviceURL = "http://www.cyconcepts.org/wp-json/taxonomies/" + categoryId + "/terms";
    var isDEV = document.location.href.indexOf('localhost') > 0;
    if (isDEV) {
        serviceURL = "/TestData/interest.xml";
    }

    var res = $.ajax({
        url: serviceURL,
        dataType: 'json',
        async: false,
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
        $("#" + sliderId).append("<div dataId='" + listData[i].slug + "'><img src='" + listData[i].image_url + "' />"
             + listData[i].name +   "</div>");
    }
}


