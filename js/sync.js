const custom_progressbar_audio = document.getElementById("custom_progressbar_audio");
const popup_instructions = document.getElementById("popup_instructions");
const audio_track_player = document.getElementById('audio_track_player');
const track_play_button = document.getElementById('play_icon_container');
const entire_sidebar = document.getElementById("audio_track_sidebar");
const uploading_track = document.getElementById("uploading_track");
const steps_wrapper = document.getElementById("steps_wrapper");
const volume = document.getElementById("volume_range_slider");
var save_button = document.getElementById("save_slider");
var save_track = document.getElementById("save_track");
var save_video = document.getElementById("save_video");
const explained = document.getElementById("explained");
const step1 = document.getElementById("step1");
const step2 = document.getElementById("step2");
const step2_error = document.getElementById("step2_error");
const step3 = document.getElementById("step3");
var track_current_time = document.getElementById("track_current_time");
var button_status = "pause";
var global_difference = 0;
var which_is_further = "";
var audio_track_title = "";
var global_movie_start = 0;
var global_audio_start = 0;
var playing = "idle";

// This function waits until it has found a video on the webpage
function checkForVideo() {
  video = document.getElementsByTagName("video")[0];
    if(video === undefined) {
      window.setTimeout(checkForVideo, 100);
    }
    else {
      video = document.getElementsByTagName("video")[0];
      }
}
checkForVideo();


// Every time the play icon is clicked, run the toggle function
if ($("#play_icon_container").length) {
  $("#play_icon_container").click(function() {
    toggle_play();
  });
}

// When the first save button is clicked, run the function that saves the audio track's timestamp
if ($("#save_track").length) {
  $("#save_track").click(function() {
    save_track_point()
  });
}

// When the second save button is clicked, run the function that saves the video's timestamp
if ($("#save_video").length) {
  $("#save_video").click(function() {
    save_video_point();
  });
}

// Open the help menu when the icon is clicked
if ($("#menu_button_container").length) {
  $("#menu_button_container").click(function() {
    open_help_menu();
  });
}

// Close the menu when the button is clicked
if ($("#close_popup_container2").length) {
  $("#close_popup_container2").click(function() {
    steps_wrapper.style.display = "none";
    entire_sidebar.style.paddingBottom = "5px";
  });
}

// Show the audio bar when the mouse is being moved, have it disappear after a few seconds
var idleTime = 0;
window.setInterval(function(){
  idleTime = idleTime + 1;
  if (idleTime > 2) {
      entire_sidebar.style.display = "none";
  }
}, 1050);

// Show the audio bar when the mouse is moving
window.addEventListener('mousemove', e => {
  entire_sidebar.style.display = "block";
  idleTime = 0;
});

// Show the main toolbar when any button is pressed
$(this).keypress(function (e) {
  entire_sidebar.style.display = "block";
  idleTime = 0;
});

// Function that runs when an audio file is uploaded
// COPYRIGHT MENTION: Logic to upload an audio file and have it be played taken from here: https://stackoverflow.com/questions/43710173/upload-and-play-audio-file-js
if (uploading_track)
{
    uploading_track.onchange = async () => {
    var file = uploading_track.files[0];
    file_name = file.name;
    stripped_name = file_name.split('.')[0]
  
    audio_track_title = stripped_name;
    var audio_url = URL.createObjectURL(file);
    audio_track_player.src = audio_url;
    document.getElementById("input_container").style.display = "none";
    document.getElementById("big_wrapper").style.display = "flex";
  
    global_difference = 0;
    which_is_further = "";
    steps_wrapper.style.display = "block";
  }
}

if (volume)
{
  volume.addEventListener('input', function(){
    new_volume = (parseInt(volume.value) / 100);
    audio_track_player.volume = new_volume;
    // Change background of slider
    var tstring = "linear-gradient(90deg, rgba(255,0,0,1) " + volume.value + "%,rgba(222,222,222)" + volume.value + "%)"
    volume.style.background = tstring;
  });
}

if (custom_progressbar_audio)
{
    custom_progressbar_audio.addEventListener('input', function()
    {
      percentage = custom_progressbar_audio.value;
      // Change background of slider
      var tstring = "linear-gradient(90deg, rgba(255,0,0,1) " + percentage  + "%, rgba(222,222,222)" + percentage  + "%)"
      custom_progressbar_audio.style.background = tstring;
      audio_track_player.pause()
    
      var percentage2 = custom_progressbar_audio.value / 100;
      var new_time = audio_track_player.duration * percentage2;
      var newtime = convertElapsedTime(new_time)
      track_current_time.innerHTML = newtime;
  });
  
    custom_progressbar_audio.addEventListener('change', function(){
    percentage = custom_progressbar_audio.value / 100;
    new_point = audio_track_player.duration * percentage;
    audio_track_player.currentTime = new_point;
  });
}

if (audio_track_player)
{
    audio_track_player.addEventListener('loadedmetadata', function()
    {
      var duration = audio_track_player.duration;
      var currentTime = audio_track_player.currentTime
      document.getElementById("track_duration").innerHTML = convertElapsedTime(duration);
      track_current_time.innerHTML = convertElapsedTime(currentTime);
    });
  
    // Fill the audio track progress bar with color as the time progresses
    audio_track_player.addEventListener('timeupdate', function()
    {
      var currentTime = audio_track_player.currentTime;
      var duration = audio_track_player.duration;
    
      track_current_time.innerHTML = convertElapsedTime(currentTime)
      var geheel = audio_track_player.duration; // 7142.29551 seconds
      var deel = audio_track_player.currentTime;
      var percentage = (deel / geheel) * 100;
      custom_progressbar_audio.value = percentage;
    
      percentage = custom_progressbar_audio.value;
      // Change background of slider
      var tstring = "linear-gradient(90deg, rgba(255,0,0,1) " + percentage  + "%, rgba(222,222,222)" + percentage  + "%)"
      custom_progressbar_audio.style.background = tstring;
  });

}

if (video)
{
    // Everytime the video is moved to a different point in the progress
    // bar, calculate where the audio slider should be
    video.addEventListener('seeking', function() {
      if (playing === "synced") {
        calculateSlider("video");
        playBothPlayers();
      }
    });
    
    video.addEventListener('play', function(){
      if (playing === "synced") {
          playBothPlayers();
      }
    });
  
   // If the video is paused, pause the audio as well
   video.addEventListener('pause', function(){
    if (playing === "synced") {
        pauseBothPlayers();
    }
    });
}

function pauseBothPlayers() {
  // Pause both the video and audio players
  video.pause();
  audio_track_player.pause();

  // Update button status and display
  button_status = "pause";
  track_play_button.innerHTML = '<i class="gg-play-button-r"></i>';
}

function playBothPlayers() {
  // Play both the video and audio players
  video.play();
  audio_track_player.play();

  // Update button status and display
  button_status = "play";
  track_play_button.innerHTML = '<i class="gg-play-pause-r"></i>';
}

var jsonList = "";
var show_status = "hidden";
var start = "idle";

document.addEventListener("click", (evt) => {

  var menu_button = document.getElementById("menu_button_container");
  let clicked_element = evt.target; // clicked element
  var element_class = clicked_element.classList

  do
  {
    if (clicked_element == popup_instructions || clicked_element == menu_button || element_class == "fa fa-trash")
    {
        // This is a click inside. Do nothing, just return.
        return;
    }
      // Go up the DOM
      clicked_element = clicked_element.parentNode;
  } while (clicked_element);

  // This is a click outside.
  popup_instructions.style.display = "none";
  show_status = "hidden";
});
