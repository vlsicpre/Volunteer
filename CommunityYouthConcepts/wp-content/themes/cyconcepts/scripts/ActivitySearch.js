
var dataCache = null;
var dataCacheIsValid = 0;
var pendingAJAXRequest = null;

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
        swipeToSlide: true,
        slidesToShow: 5,
        responsive: [
          {
              breakpoint: 1000,
              settings: {
                  arrows: false,
                  centerMode: true,
                  centerPadding: '30px',
                  slidesToShow: 3
              }
          },
          {
              breakpoint: 480,
              settings: {
                  arrows: false,
                  centerMode: true,
                  slidesToShow: 1
              }
          }
        ]
    });

    // On after slide change
    $('.center').on('afterChange', function (event, slick, currentSlide, nextSlide) {      

        Search(1);
    });

    $('#ResultsCount').click(function () {
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
    //cancel the previous search request if its still pending
    if (pendingAJAXRequest != null) {
        pendingAJAXRequest.abort();
    }

    var criteria = GetSearchCriteria();

    if (countOnly == 1) {
        $("#ResultsCount").html("Finding Matches...");
        dataCacheIsValid = 0;//invalidate the dataCache because a new search ran
        dataCache = null;
    }
    else {
        $("#ResultsCount").html("Loading Matches...");
    }

    if (dataCacheIsValid == 0) {
        var serviceURL = "http://cyconcepts.org/wp-json/posts?type=volunteer_project&filter[issue]=" + criteria.IssueId
            + "&filter[interest]=" + criteria.InterestId + "&filter[time]=" + criteria.IntervalId;

        pendingAJAXRequest = $.ajax({
            url: serviceURL,
            dataType: 'json',
            success: function (data) {
                dataCache = data;//save to cache
                dataCacheIsValid = 1;
                LoadResults(data, countOnly);
            },
            error: function (error) {

            }
        });
    }
    else {
        //Load from cache
        //Only switch to results mode if there are results
        if (dataCache != null && dataCache.length > 0) {
            LoadResults(dataCache, countOnly)
        }
    }
}

function LoadResults(data, countOnly) {
    if (countOnly == 1) {
        //Update the status bar only
        if (data.length > 0) {
            $("#ResultsCount").html("View " + data.length + " Matches");
        }
        else {
            $("#ResultsCount").html("Hmm. No matches found.");
        }
    }
    else {
        SetMode("Results");
        $("#resultsTable").html("");//reset
        $("#resultsTable").append("<thead><tr><th>Activity</th><th>Time</th></tr></thead>");
        $("#resultsTable").append("<tbody>");
        for (var i = 0; i < data.length; i++) {
            var row = "<div class='row'><tr><td><a href='{URL}' target='_blank'>{NAME}</a></td><td>{TIME}</td></tr></div>";
            row = row.replace('{URL}', data[i].link).replace('{NAME}', data[i].title).replace('{TIME}', data[i].terms.time[0].name);
            $("#resultsTable").append(row);
        }
        $("#resultsTable").append("</tbody>");
    }
}

function LoadCategories(categoryId) {
    var serviceURL = "http://cyconcepts.org/wp-json/taxonomies/" + categoryId + "/terms";
    var href = document.location.href;
    var isDEV = href.indexOf('localhost') > 0 | href.indexOf('C:') > 0;
    if (isDEV) {
        serviceURL = "/TestData/interest.xml";
    }

    var res = $.ajax({
        url: serviceURL,
        dataType: 'json',
        async: false, /*Very important: Need to have plugin wait for this to complete*/
        success: function (data) {
            LoadCriteriaSliderData(categoryId, data);
        },
        error: function (error) {

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
        $("#" + sliderId).append("<div dataId='" + listData[i].slug + "'><img data-lazy='" + listData[i].image_url + "' />"
             + listData[i].name + "</div>");
    }
}


