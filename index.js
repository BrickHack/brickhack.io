import "./sass/index.scss"
import $ from "jquery"
import '@fortawesome/fontawesome-free/css/all.css'

// Hiring message
const hiringMessage = `Hey, you.
You’re finally awake.
You were trying to see the code, right?
Walked right into that hiring message, same as us.
If you’d like to work on hackathon-related projects, check out https://brickhack.io/club!`

console.log(hiringMessage);

// Comment generated via js instead of directly in HTML so the hiring message text is only in one place
const comment = document.createComment("\n" + hiringMessage + "\n");
document.insertBefore(comment, document.firstChild);

// Leadership easter egg
/*$(document).ready(function() {
    var randomNum = Math.floor(Math.random() * 50);
    console.log(randomNum);
    if (randomNum === 7) {
        console.log("Lucky Ricky");
        var ricky = $(".leader:first").clone();
        ricky.appendTo($("#team"));
    }
});*/

// Nav highlighting on scroll
import ActiveMenuLink from "active-menu-link";

let options = {
    itemTag: "",
    scrollOffset: -90, // nav height
    scrollDuration: 1000,
    ease: "out-quart",
    showHash: false,
};

new ActiveMenuLink(".navbar-items", options);

// Navbar functionality
$(document).on("click", "#toggle", function() {
    if ($("nav").hasClass("show-nav")) {
        $("nav").removeClass("show-nav");
        $("#toggle").removeClass("fa-times");
        $("#toggle").addClass("fa-bars");
        $(".mobile-grayout").removeClass("show-gray");
    } else {
        $("nav").addClass("show-nav");
        $("#toggle").removeClass("fa-bars");
        $("#toggle").addClass("fa-times");
        $(".mobile-grayout").addClass("show-gray");
    }
});

// Closing the navbar when a navigation link is clicked
$(document).on("click", ".link", function() {
    $("nav").removeClass("show-nav");
    $("#toggle").removeClass("fa-times");
    $("#toggle").addClass("fa-bars");
    $(".mobile-grayout").removeClass("show-gray");
});

// Closing the navbar when outside of the nav is clicked
$(document).on("click", ".mobile-grayout", function() {
    $("nav").removeClass("show-nav");
    $("#toggle").removeClass("fa-times");
    $("#toggle").addClass("fa-bars");
    $(".mobile-grayout").removeClass("show-gray");
});

// FAQ Cards hide/show
let card = document.getElementsByClassName("card");
for (let i = 0; i < card.length; i++) {
    let accordion = card[i].getElementsByClassName("accordion-header")[0];
    // Click should only work on accordion-header of each card
    accordion.addEventListener("click", function() {

        card[i].classList.toggle("active");

        let panel = card[i].getElementsByClassName("panel")[0];
        let fa = this.getElementsByTagName("i")[0];

        // Toggle panel and plus/minus on click of header
        if ($(card[i]).hasClass("active")) {
            $(panel).slideDown(200);
        } else {
            $(panel).slideUp(200);
        }

        $(fa).toggleClass("fa-plus");
        $(fa).toggleClass("fa-minus");
    });
}

/* Schedule JS */

// Making buttons toggle hide/show for different days
// Saturday button
$('#saturday').click(function() {
    $('#saturday').addClass('day-active');
    $('#sunday').removeClass('day-active');
    $('#feb-22-content').show();
    $('#feb-23-content').hide();
    $('#date-indicator-saturday').show();
    $('#date-indicator-sunday').hide();
});
// Sunday button
$('#sunday').click(function() {
    $('#sunday').addClass('day-active');
    $('#saturday').removeClass('day-active');
    $('#feb-23-content').show();
    $('#feb-22-content').hide();
    $('#date-indicator-sunday').show();
    $('#date-indicator-saturday').hide();
});


// Setting the schedule to match the day
let currentDate = new Date().getDate()
// Before/during saturday
if (currentDate <= 22) { // if date is before or equal to the 22nd of the month
    $('#saturday').addClass('day-active');
    $('#sunday').removeClass('day-active');
    $('#feb-22-content').show();
    $('#feb-23-content').hide();
    $('#date-indicator-saturday').show();
    $('#date-indicator-sunday').hide();
}
// Sunday 
else  {
    $('#sunday').addClass('day-active');
    $('#saturday').removeClass('day-active');
    $('#feb-23-content').show();
    $('#feb-22-content').hide();
    $('#date-indicator-sunday').show();
    $('#date-indicator-saturday').hide();
}


// Fetching event data from HackEngine
fetch('https://apply.brickhack.io/events.json')
    .then(res => res.json())
    .then(events => handleEventData(events))
    .catch(err => console.log(err));


// Turning HackEngine event data into visual events - BH7 code barely modified
function handleEventData(events) {
    let now = new Date()
    // needed to handle overlapping events
    let timeMarkerAdded = false;
    // need to sort events by start/end times instead of IDs
    events.sort(compareEvents);

    // Looping through each event to handle it
    events.forEach(event => {
        // Getting strings for times
        let startDate = new Date(event.start);  // convert ISO 8601 -> Date object
        let finishDate = undefined;
        let dateString = convertDate(startDate);
        if (event.finish) {  // finish === null for instantaneous events
            finishDate = new Date(event.finish);
            let finishString = convertDate(finishDate);
            if (dateString.slice(-2) === finishString.slice(-2)) {  // hide "am/pm" of first time if both are identical
                dateString = dateString.slice(0, -2);
            }
            dateString += " - " + convertDate(finishDate);
        }

        // calculate event container classes
        let divClasses = 'event';
        let liveIndicator = "";
        if (finishDate < now) {
            divClasses += ' event-complete';
        }
        else if (startDate < now && now < finishDate) {
            divClasses += ' event-live';
            liveIndicator = '<p class="live">LIVE!</p>';
        }

        // adding event to the page
        var eventContainer;
        // Deciding which day content box it goes inside
        switch (startDate.getDate()) {
            case 22: eventContainer = $('#feb-22-content'); break; // case numbers correlate with the days of the event
            case 23: eventContainer = $('#feb-23-content'); break;
        }
        // If it doesn't fall into one of those event days, log the problem and quit trying to add it
        if (!eventContainer) {
            console.log("Event " + event.title + " date " + startDate + " out of range.");
            return; // skip current iteration https://stackoverflow.com/a/31399448/1431900
        }
        // Building HTML and adding it to page
        let html = `<div class="${divClasses}"><p class="time">${dateString}</p><p>${event.title}</p><p class="location">${event.location}</p>${liveIndicator}</div>`;
        const eventDiv = eventContainer.append(html);
    });
}

// Comparing two events to sort them - BH7 code unmodified
function compareEvents(a, b) {
    // We can sort by start/end here because the ISO 8061
    // timestamps given by the server are lexicographically
    // sortable.
    if (a.start < b.start) {         // if a starts before b...
        return -1;                   //   ...then a goes before b
    } else if (a.start > b.start) {  // if a starts after b...
        return 1;                    //   ...then b goes before a
    } else {
        if (a.end < b.end) {         // if a ends before b...
            return -1;               //   ...then a goes before b
        } else if (a.end > b.end) {  // if a ends after b...
            return 1;                //   ...then b goes before a
        } else {
            return 0;
        }
    }
}

// Converting dates to something more user friendly - BH7 code
function convertDate(date) {
    let output = '';
    // hour
    if (date.getHours() > 12) {
        output = String(date.getHours() - 12);
    } else if (date.getHours() == 0) { // case for 12am
        output = String(12);
    } else {
        output = String(date.getHours());
    }
    // minute
    if (date.getMinutes() !== 0) {
        output += ':' + String(date.getMinutes()).padStart(2, '0');
    }
    // AM/PM
    if (date.getHours() >= 12) {
        output += 'pm';
    } else {
        output += 'am';
    }
    return output;
}

// adopted from https://stackoverflow.com/users/12271569/rick 
const text = ["BrickHack", "Teamwork", "Creating", "Learning", "Bricks", "Friendship", "Fun!"];
let counter = 0;

setInterval(change, 5000);

// fade-in-out text and changes each interval
function change() {
  document.getElementById("fadeOut").setAttribute("class", "text-fadeout");

  setTimeout(() => {
    document.getElementById("fadeOut").innerHTML = text[counter];
    document.getElementById("fadeOut").setAttribute("class", "text-show");
  }, 1000)

  counter++;

  if (counter >= text.length) {
    counter = 0;
  }
}

// bh-7 carousel import
// Slick-carousel
import $ from 'jquery'
import 'slick-carousel'

$(document).ready(function() {
    $('.carousel').slick({
        infinite: true,
        swipeToSlide: true,
        variableWidth: true,
        slidesToShow: 3,
        slidesToScroll: 2,
        cssEase: 'ease-in-out',
        autoplay: true,
        autoplaySpeed: 2000,
        speed: 1000,
        responsive: [
            {
                breakpoint: 1500,
                settings: {
                    centerMode: true
                }
            }
        ]
    });
});

// Clickable images functionality

// Opens modal when img is clicked
$(document).on('click', '.slide-image', function() {
    $('#modal').show();
    $('#modal-content').attr('src', this.src);
});

// Closes modal when X is clicked
$(document).on('click', '#close', function() {
    $('#modal').hide();
});

// Closes modal when window is clicked
$(window).on('click', function(event) {
    if (event.target == modal) {
        $('#modal').hide();
    }
});

// Closes modal when esc key is pressed
$(document).on('keydown', function(event) {
    if (event.key == "Escape") {
        $('#modal').hide();
    }
});