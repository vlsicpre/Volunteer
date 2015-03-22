
var dataCache = null;
var dataCacheIsValid = 0;
var pendingAJAXRequest = null;

$(document).ready(function () {
    var interests = LoadCategories("interest");
    var issues = LoadCategories("issue");
    var intervals = LoadCategories("time");
    //Wait for images.
    WaitForImageLoading(Initialize);
});

function Initialize() {
    InitializeSliders();
    Search(1);
    SetMode("Search");//show
}

function InitializeSliders() {


    $('.center').slick({
        /*Default settings for resolutions higher than the breakpoints*/
        centerMode: true,
        infinite: true,
        arrows: true,
        centerPadding: '10px',/*The side padding that wraps the group of slider items. Increasing this will squish the items together.*/
        swipeToSlide: true,
        slidesToShow: 5,/*only on the widest screens*/
        responsive: [
            {
                //NOTE: Images will range in size from 60-100px depending upon viewport height. (see CSS media queries)
                //Settings take effect when width is 800 or less until next breakpoint.
                breakpoint: 800,
                settings: {
                    centerMode: true,
                    slidesToShow: 3
                }
            },
          {
              //Settings take effect when width is 300 or less.
              breakpoint: 300,
              settings: {
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
        var serviceURL = "http://cyconcepts.org/wp-json/posts?type=volunteer_project";
        var href = document.location.href;
        var isDEV = href.indexOf('localhost') > 0 | href.indexOf('C:') > 0;
        if (isDEV) {
            serviceURL = "http://localhost/ServiceProxy/api/post/getposts/?";
        }

        var interestFilter = "&filter[interest]=" + criteria.InterestId;
        var issueFilter = "&filter[issue]=" + criteria.IssueId;
        var timeFilter = "&filter[time]=" + criteria.IntervalId;

        serviceURL = serviceURL + interestFilter;//interest is required so always use it

        if (criteria.IssueId != 'any') {
            serviceURL = serviceURL + issueFilter;
        }

        if (criteria.IntervalId != 'any') {
            serviceURL = serviceURL + timeFilter;
        }

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
            $("#ResultsCount").html("View " + data.length + " Match(es)");
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
            var row = "<tr><td><a href='{URL}' target='_blank'>{NAME}</a></td><td>{TIME}</td></tr>";
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
        serviceURL = "http://localhost/ServiceProxy/api/post/getcategories/" + categoryId;
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

function WaitForImageLoading(callbackFunction) {
    var allImagesLoaded = false;
    $(".Criteria img").each(function (item) {
        if (!item[0].complete) {
            setTimeout(function () { WaitForImageLoading(callbackFunction); }, 500);
            return;
        }
        else {
            if (console) {
                console.log("Preloading " + item[0].src);
            }
        }
    });
    //if we made it this far then all the images loaded.
    callbackFunction();
}

function SetMode(mode) {
    if (mode == "Results") {
        $('#Results').show();
        $('#Search').hide();
        $("#LoadingScreen").hide();
    }
    else {
        $('#Results').hide();
        $('#Search').show();
        $("#LoadingScreen").hide();
    }
}

function LoadCriteriaSliderData(sliderId, listData) {

    for (var i = 0; i < listData.length; i++) {
        $("#" + sliderId).append("<div dataId='" + listData[i].slug + "'><img src='" + listData[i].image_url + "' />"
             + listData[i].name + "</div>");
    }

}


