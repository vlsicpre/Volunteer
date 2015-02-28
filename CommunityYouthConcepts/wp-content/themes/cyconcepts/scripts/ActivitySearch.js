
$(document).ready(function () {
    SetMode("Search");
    InitializeSliders();
    Search(1);
});


function InitializeSliders() {
    var interests = LoadCategories("interest");
    var issues = LoadCategories("issue");
    var intervals = LoadCategories("time");

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
        
        Search(1);
    });

    $('#ResultsCount').click(function() {
        
        Search(0);
    });

    $("#BackButton").click(function () {
        SetMode("Search");
        Search(1);
    });
}

function SearchCriteria() {
    this.InterestId = "";
    this.IssueId = "";
    this.IntervalId = "";
}

function GetSearchCriteria() {
    var criteria = new SearchCriteria();
    criteria.InterestId = $("#interest > div .slick-center").attr('dataId');
    criteria.IssueId = $("#issue > div .slick-center").attr('dataId');
    criteria.IntervalId = $("#time > div .slick-center").attr('dataId');

    return criteria;
}

function Search(countOnly) {
    var criteria = GetSearchCriteria();

    if (countOnly == 1)
    {
        $("#ResultsCount > span").html("Finding Matches...");
    }
    else {
        $("#ResultsCount > span").html("Loading Matches...");
    }    

    var serviceURL = "http://cyconcepts.org/wp-json/posts?type=volunteer_project&filter[issue]=" + criteria.IssueId
        + "&filter[interest]=" + criteria.InterestId + "&filter[time]=" + criteria.IntervalId;    

    var res = $.ajax({
        url: serviceURL,
        dataType: 'json',
        success: function(data) {
            LoadResults(data, countOnly);
        }
    });
}

function LoadResults(data, countOnly) {
    if (countOnly == 1) {
        //Update the status bar only
        if (data.length > 0) {
            $("#ResultsCount > span").html("View " + data.length + " Matches");
        }
        else {
            $("#ResultsCount > span").html("Hmm. No matches found.");
        }
    }
    else {
        SetMode("Results");
        $("#ResultList").html("");//reset
        for (var i = 0; i < data.length; i++)
        {
            var row = "<div><a href='{URL}' target='_blank'>{NAME}</a><span>Time: {TIME}</span></div>";
            row = row.replace('{URL}', data[i].link).replace('{NAME}',data[i].title).replace('{TIME}',data[i].terms.time[0].name);
            $("#ResultList").append(row);
        }
    }
}

function LoadCategories(categoryId) {
    var serviceURL = "http://cyconcepts.org/wp-json/taxonomies/" + categoryId + "/terms";
    var isDEV = document.location.href.indexOf('localhost') > 0;
    if (isDEV) {
        serviceURL = "/TestData/interest.xml";
    }

    var res = $.ajax({
        url: serviceURL,
        dataType: 'json',
        async: false, /*Very important: Need to have plugin wait for this to complete*/
        success: function (data) {
            LoadCriteriaSliderData(categoryId, data);
        }
    });
}

function SetMode(mode) {
    if (mode == "Results") {
        $('#Results').show();
        $('#Search').hide();
    }
    else {
        $('#Results').hide();
        $('#Search').show();
    }
}

function LoadCriteriaSliderData(sliderId, listData) {
    for (var i = 0; i < listData.length; i++) {
        $("#" + sliderId).append("<div dataId='" + listData[i].slug + "'><img src='" + listData[i].image_url + "' />"
             + listData[i].name + "</div>");
    }
}


