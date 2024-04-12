// This code loads the IFrame Player API code asynchronously.
var tag = document.createElement('script');
tag.src = "https://www.youtube.com/iframe_api";
var firstScriptTag = document.getElementsByTagName('script')[0];
firstScriptTag.parentNode.insertBefore(tag, firstScriptTag);

var player1, player2, player3;
var index1 = 0, index2 = 0, index3 = 0;
var clickCount1 = 0, clickCount2 = 0, clickCount3 = 0;
var btn1 = document.getElementById('btn1');
var btn2 = document.getElementById('btn2');
var btn3 = document.getElementById('btn3');
var playtime;
var totalSessionTime;
var videoIds = [];
var videoTitles =[];
var responseSequence1, responseSequence2, responseSequence3;

//results array
var video1 = []; // Array to store button click data for video 1
var video2 = []; // Array to store button click data for video 2
var video3 = []; // Array to store button click data for video 3

// Keep track of session time
var sessionStartTime = Date.now();
var sessionTimer;

// Retrieve selected video information from sessionStorage
const selectedVideos = JSON.parse(sessionStorage.getItem('selectedVideos'));
if (selectedVideos && selectedVideos.length >= 3) {
    // Extracting values from selected videos
    selectedVideos.slice(0, 3).forEach((video, index) => {
        videoIds.push(video.url);
        videoTitles.push(video.title);
        switch (index) {
            case 0:
                responseSequence1 = video.responseSequence;
                break;
            case 1:
                responseSequence2 = video.responseSequence;
                break;
            case 2:
                responseSequence3 = video.responseSequence;
                break;
        }
    });
}

// Retrieve assessment data from sessionStorage
const assessmentData = JSON.parse(sessionStorage.getItem('assessmentData'));
if (assessmentData) {
    playtime = assessmentData.playTime*1000 || 60000; // default 60 seconds or 1 minute if not found
    totalSessionTime = assessmentData.sessionTime*1000 || 120000; // default 2 minutes if not found
    idleTime = assessmentData.idleTime*1000 || 2000; //default 2 secs
}

var response_sequnece1 = JSON.parse("[" + responseSequence1 + "]");
var response_sequnece2 = JSON.parse("[" + responseSequence2 + "]");
var response_sequnece3 = JSON.parse("[" + responseSequence3 + "]");

// Redirect to result page after session timeout
sessionTimer = setTimeout(function () {
    saveAndRedirect('Total Session Time Out');
}, totalSessionTime);

//obsolete has to be removed
function disableOtherButtons(btn) {
    if (btn === btn1) {
        btn2.disabled = true;
        btn3.disabled = true;
    } else if (btn === btn2) {
        btn1.disabled = true;
        btn3.disabled = true;
    } else if (btn === btn3) {
        btn1.disabled = true;
        btn2.disabled = true;
    }
}

function disableAllButtons() {
        btn1.disabled = true;
        btn2.disabled = true;
        btn3.disabled = true;  
}

btn1.addEventListener('click', function () {
    clickCount1++;
    if (clickCount1 === response_sequnece1[index1]) {
        video1.push(1);
        video2.push(0);
        video3.push(0);
        player1.playVideo();
        setTimeout(function () {
            pauseVideo(player1);
            btn1.disabled =false;
            btn2.disabled = false;
            btn3.disabled = false;
            resetIdleTimer(); // Call checkIdleTimer when all buttons are enabled
        }, playtime);
        disableAllButtons();
        clickCount1 = 0;
        index1++;
    }
});

btn2.addEventListener('click', function () {
    clickCount2++;
    if (clickCount2 === response_sequnece2[index2]) {
        video1.push(0);
        video2.push(1);
        video3.push(0);
        player2.playVideo();
        setTimeout(function () {
            pauseVideo(player2);
            btn1.disabled = false;
            btn2.disabled =false;
            btn3.disabled = false;
            resetIdleTimer(); // Call checkIdleTimer when all buttons are enabled
        }, playtime);
        disableAllButtons();
        clickCount2 = 0;
        index2++;
    }
});

btn3.addEventListener('click', function () {
    clickCount3++;
    if (clickCount3 === response_sequnece3[index3]) {
        video1.push(0);
        video2.push(0);
        video3.push(1);
        player3.playVideo();
        setTimeout(function () {
            pauseVideo(player3);
            btn1.disabled = false;
            btn2.disabled = false;
            btn3.disabled =false;
            resetIdleTimer(); // Call checkIdleTimer when all buttons are enabled
        }, playtime);
        disableAllButtons();
        clickCount3 = 0;
        index3++;
    }
});


function onYouTubeIframeAPIReady() {
    // Creating players dynamically based on the retrieved video IDs
    for (let i = 0; i < videoIds.length; i++) {
        window['player' + (i + 1)] = new YT.Player('player' + (i + 1), {
            height: '100%', // Set player height
            width: '100%', // Set player width
            videoId: videoIds[i], // Video ID from selected videos
            playerVars: {
                'playsinline': 1,
                'controls': 0,
                'autoplay': 0, // Autoplay the video
                'mute': 0, // Mute the video to avoid autoplay restrictions
                'rel': 0 // Disable related videos
            },
            events: {
                'onReady': onPlayerReady,
                'onStateChange': onPlayerStateChange
            }
        });
    }
}

function onPlayerReady(event) {
    event.target.setVolume(100); // Set volume to 100 (full volume)
}

var done1 = false, done2 = false, done3 = false;

function onPlayerStateChange(event) {
    if (event.data == YT.PlayerState.PLAYING && !done1) {
        setTimeout(pauseVideo, playtime, player1);
        done1 = true;
    }

    if (event.data == YT.PlayerState.PLAYING && !done2) {
        setTimeout(pauseVideo, playtime, player2);
        done2 = true;
    }

    if (event.data == YT.PlayerState.PLAYING && !done3) {
        setTimeout(pauseVideo, playtime, player3);
        done3 = true;
    }
}

function pauseVideo(player) {
    player.pauseVideo();
}

var idleTimer; // Variable to hold the idle timer

function startIdleTimer() {
    idleTimer = setTimeout(function () {
        saveAndRedirect('Idle Time Out');
    }, idleTime);
}

function resetIdleTimer() {
    clearTimeout(idleTimer);
    startIdleTimer();
}

function saveAndRedirect(duration_end_reason) {
    // Save arrays and other data to session storage
    // Save arrays and other data to session storage for total session time
    // Store arrays in session storage
    sessionStorage.setItem('video1', JSON.stringify(video1));
    sessionStorage.setItem('video2', JSON.stringify(video2));
    sessionStorage.setItem('video3', JSON.stringify(video3));
    // Store video titles in session storage
    sessionStorage.setItem('videoTitles', JSON.stringify(videoTitles));

    // Assessment Parameters
    sessionStorage.setItem('playtime', JSON.stringify(playtime));
    sessionStorage.setItem('totalSessionTime', JSON.stringify(totalSessionTime));
    sessionStorage.setItem('idleTime', JSON.stringify(idleTime));
    
    // Response Sequence
    sessionStorage.setItem('responseSequence1', JSON.stringify(responseSequence1));
    sessionStorage.setItem('responseSequence2', JSON.stringify(responseSequence2));
    sessionStorage.setItem('responseSequence3', JSON.stringify(responseSequence3));

    // Current Sequence index
    sessionStorage.setItem('index1', JSON.stringify(index1));
    sessionStorage.setItem('index2', JSON.stringify(index2));
    sessionStorage.setItem('index3', JSON.stringify(index3));

    // Click Counters    
    sessionStorage.setItem('clickCount1', JSON.stringify(clickCount1));
    sessionStorage.setItem('clickCount2', JSON.stringify(clickCount2));
    sessionStorage.setItem('clickCount3', JSON.stringify(clickCount3));

    //
    sessionStorage.setItem('duration_end_reason', JSON.stringify(duration_end_reason));
    // Redirect to result page
    window.location.href = "result.html";
}

btn1.addEventListener('click', resetIdleTimer);
btn2.addEventListener('click', resetIdleTimer);
btn3.addEventListener('click', resetIdleTimer);

function checkIdleTimer() {
    //alert('started');
    if (!btn1.disabled && !btn2.disabled && !btn3.disabled) {
        startIdleTimer();
    }
}

checkIdleTimer();
