// Run the function that adds the toolbars to the webpage
add_toolbars();

var custom_progressbar_audio = document.getElementById("custom_progressbar_audio");
var popup_instructions = document.getElementById("popup_instructions");
var audio_track_player = document.getElementById('audio_track_player');
var track_current_time = document.getElementById("track_current_time");
var track_play_button = document.getElementById('play_icon_container');
var entire_sidebar = document.getElementById("audio_track_sidebar");
var uploading_track = document.getElementById("uploading_track");
var steps_wrapper = document.getElementById("steps_wrapper");
var volume = document.getElementById("volume_range_slider");
var review_titles = document.getElementById("review_titles");
var options_menu = document.getElementById("options_menu");
var save_button = document.getElementById("save_slider");
var save_track = document.getElementById("save_track");
var save_video = document.getElementById("save_video");
var explained = document.getElementById("explained");
var step1 = document.getElementById("step1");
var step2 = document.getElementById("step2");
var step3 = document.getElementById("step3");
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
$("#play_icon_container").click(function() {
  toggle_play();
});

// When the first save button is clicked, run the function that saves the audio track's timestamp
$("#save_track").click(function() {
  save_track_point()
});

// When the second save button is clicked, run the function that saves the video's timestamp
$("#save_video").click(function() {
  save_video_point();
});

// Open the help menu when the icon is clicked
$("#menu_button_container").click(function() {
  open_help_menu();
});

// Close the menu when the button is clicked
$("#close_popup_container2").click(function() {
  steps_wrapper.style.display = "none";
  entire_sidebar.style.paddingBottom = "5px";
});

// Show the audio bar when the mouse is being moved, have it disappear after a few seconds
var idleTime = 0;
window.setInterval(function(){
  idleTime = idleTime + 1;
  if (idleTime > 2) {
      entire_sidebar.style.display = "none";

      volume_menu.className = "hidden";
      volume.className = "hidden";
      volume_menu.classList.remove('shown');
      volume.classList.remove('shown');
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

  // Check if this track has been saved before
  title_found = findTitle();
  if (title_found == true) {
    document.getElementById("control_wrapper").style.display = "block";
    playing = "synced";
    calculateSlider("video");
    var media = document.getElementsByTagName("video")[0];
    entire_sidebar.style.paddingBottom = "5px";

  }
  else {
    steps_wrapper.style.display = "block";
  }

}






volume.addEventListener('input', function(){
  new_volume = (parseInt(volume.value) / 100);
  audio_track_player.volume = new_volume;
  // Change background of slider
  var tstring = "linear-gradient(90deg, rgba(255,0,0,1) " + volume.value + "%,rgba(222,222,222)" + volume.value + "%)"
  volume.style.background = tstring;
});


custom_progressbar_audio.addEventListener('input', function(){
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

  if (button_status == "pause") {
    audio_track_player.pause()

	} else {
		audio_track_player.play()
	}


});


audio_track_player.addEventListener('loadedmetadata', function() {
	var duration = audio_track_player.duration;
	var currentTime = audio_track_player.currentTime
	document.getElementById("track_duration").innerHTML = convertElapsedTime(duration);
	track_current_time.innerHTML = convertElapsedTime(currentTime);
});


// Fill the audio track progress bar with color as the time progresses
audio_track_player.addEventListener('timeupdate', function() {

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

  if(audio_track_player.currentTime == audio_track_player.duration) {
    track_play_button.innerHTML = '<i class="gg-play-button-r"></i>';
    button_status = "pause";
  }


});

// Everytime the video is moved to a different point in the progress
// bar, calculate where the audio slider should be
video.addEventListener('seeking', function() {
  if (playing === "synced") {
    calculateSlider("video");
  }
});

// If the video has started, play the audio as well
video.addEventListener('play', function(){
  if (playing === "synced") {
    audio_track_player.play();
    button_status = "play";
    track_play_button.innerHTML = '<i class="gg-play-pause-r"></i>';
    calculateSlider("video");
  }
});

// If the video is paused, pause the audio as well
video.addEventListener('pause', function(){
  if (playing === "synced") {
    audio_track_player.pause();
    button_status = "pause";
    track_play_button.innerHTML = '<i class="gg-play-button-r"></i>';
  }
});

// If the audio has started, play the video as well
audio_track_player.addEventListener('play', function(){
  if(audio_track_player.currentTime == audio_track_player.duration) {
    audio_track_player.currentTime = 0;
  }

  if (playing === "synced")  {
      video.play();
  }
});

// If the audio is paused, pause the video as well
audio_track_player.addEventListener('pause', function(){
  if (playing === "synced") {
    video.pause();
  }
});

var jsonList = "";
var show_status = "hidden";
var start = "idle";

document.addEventListener('click',function(e){
    if(e.target){
        var element_class = $(e.target).attr('class');
        var element_id_id = $(e.target).attr('id');

        if (element_id_id == "right_options" || element_class == "all_options right_column") {
            review_titles.style.display = "block";
            explained.style.display = "none";
            options_menu.style.background = "linear-gradient(to right, #2b2c2b 0%, #2b2c2b 50%, #CF2500 50%, #CF2500 100%)";
            fill_titles();
        }

        if (element_id_id == "left_options" || element_class == "all_options left_column") {
            explained.style.display = "block";
            review_titles.style.display = "none";
            options_menu.style.background = "linear-gradient(to right, #CF2500 0%, #CF2500 50%, #2b2c2b 50%, #2b2c2b 100%)";
        }

        // This deletes a track's data from local storage
        if (element_class == "fa fa-trash") {

            var track_title = e.target.id;
            localStorage.removeItem(track_title);

            // 1 Get current list of saved movies
            var title_list = window.localStorage.getItem("titles");
            title_list = JSON.parse(title_list);

            // 4 Remove from the list
            var new_list = title_list.filter(function(e) { return e !== track_title })

            // 5 Parse the list to JSON
            var jsonList = JSON.stringify(new_list);
            var jsonList2 = JSON.stringify(new_list);

            // 6 Update the list in local storage
            window.localStorage.setItem("titles", jsonList);

            fill_titles();

        }
     }
});


document.addEventListener("click", (evt) => {

  var menu_button = document.getElementById("menu_button_container");
  let clicked_element = evt.target; // clicked element
  var element_class = clicked_element.classList

  do {
    if (clicked_element == popup_instructions || clicked_element == menu_button || element_class == "fa fa-trash") {
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
