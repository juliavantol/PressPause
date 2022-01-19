var toolbar = document.createElement('div');
toolbar.setAttribute("id", "audio_track_sidebar");
toolbar.innerHTML = '\
  <link rel="stylesheet" href="https://cdnjs.cloudflare.com/ajax/libs/font-awesome/4.7.0/css/font-awesome.min.css">\
  <script href="https://kit.fontawesome.com/b571da1c14.js" crossorigin="anonymous"></script>\
  <meta name="viewport" content="width=device-width, initial-scale=1.0">\
  <div id="input_container">\
    <input type="file" name="file" id="uploading_track" class="inputfile">\
    <label id="input_track_label"for="uploading_track"><i class="fa fa-upload"></i>   Upload audio track</label>\
  </div>\
  <div id="big_wrapper">\
  <div id="control_wrapper">\
<span class="testcontainer"><input type="range" min="0" max="100" value="0" id="test-progress"></span>\
      <audio id="audio_track_player"></audio>\
    <span id="track_player_volumecontrol">\
      <input type="range" min="0" max="100" value="30"  id="volume_range_slider">\
      <i id="volume_btn" class="fa fa-volume-up" style="font-size:19px;color:red"></i>\
    </span>\
    <br>\
<span id="place_icon"><svg class="track_play_button" "aria-hidden="true" focusable="false" data-prefix="fas" data-icon="play" class="svg-inline--fa fa-play fa-w-14" role="img" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 448 512"><path fill="red" d="M424.4 214.7L72.4 6.6C43.8-10.3 0 6.1 0 47.9V464c0 37.5 40.7 60.1 72.4 41.3l352-208c31.4-18.5 31.5-64.1 0-82.6z"></path></svg></span>\
<span id="timing_container">\
    <span class="timing_content" id="track_current_time"></span> <span class"timing_content"> /</span> \
    <span class="timing_content" id="track_duration"></span> \
  </span>\
</div>\
  </div>\
  <div id="start_wrapper">\
    <div class="start_instructions" id="step1">\
      <div class="text_instructions">\
      <span class="start_text">Start playing the audio track first. Pause when they tell you to and press save.</span>\
      </div>\
      <div class="rbtns">\
      <label id="save_track" class="custom_button_style"> Save </label>\
      </div>\
    </div>\
    <div class="start_instructions" id="step2">\
      <div class="text_instructions">\
      <span class="start_text">Now start playing the movie. Pause at the point where they told you to start the audio track and press save.</span>\
      </div>\
      <div class="rbtns">\
      <label id="save_video" class="custom_button_style"> Save </label>\
      </div>\
    </div>\
    <div class="start_instructions" id="step3">\
      <span class="start_text">The tracks are now linked. Next time you can load it without setting it up again.\
      It is now safe to pause, rewind or fastforward the movie because the audio track will follow. </span>\
    </div>\
  </div>\
  \
';

toolbar.style.position = 'fixed';
toolbar.style.left = '0px';
toolbar.style.top = '0px';
toolbar.style.zIndex = '9999';
document.body.appendChild(toolbar);

var global_movie_start = 0;
var global_audio_start = 0;
var audio_track_title = "";
var entire_sidebar = document.getElementById("audio_track_sidebar");
var uploading_track = document.getElementById("uploading_track");
var audio = document.getElementById("audio_track_player");
var canvas_width = 500;
var canvas_height = 4;
var audio_track_player = document.getElementById('audio_track_player');
var track_play_button = document.getElementById('place_icon');
var volume = document.getElementById("volume_range_slider");
var save_track = document.getElementById("save_track")
var save_video = document.getElementById("save_video")
var save_button = document.getElementById("save_slider");
var recover_wrapper = document.getElementById("recover_wrapper");
var start_wrapper = document.getElementById("start_wrapper");
var back_to_start = document.getElementById("back_start_con");
var button_status = "pause";
var playing = "idle"
var video = "";
var test_progress = document.getElementById("test-progress");

// Show the audio track bar when the mouse is being moved, disappear after a few seconds
// var idleTime = 0;
// window.setInterval(function(){
//   idleTime = idleTime + 1;
//   if (idleTime > 2) {
//       entire_sidebar.style.display = "none";
//   }
// }, 1050);

// window.addEventListener('mousemove', e => {
//   entire_sidebar.style.display = "block";
//   idleTime = 0;
// });

// $(this).keypress(function (e) {
//   entire_sidebar.style.display = "block";
//   idleTime = 0;
// });


var global_difference = 0;
var which_is_further = "";


function findTitle() {
  // get the string from localStorage
  const str = window.localStorage.getItem("titles");

  var parsed = JSON.stringify(str);


  var stripped = parsed.replace("[", "");
  var stripped = stripped.replace("]", "");
  var stripped = stripped.split('"').join('');
  var stripped = stripped.replace(/\\|\//g,'');

  // List with all the saved titles
  var title_list = stripped.split(",");

  for (var i = 0; i < title_list.length; i++) {

    if (title_list[i] == audio_track_title) {
      var total_dif = localStorage.getItem(audio_track_title);

      var split_list = total_dif.split(',');

      global_difference = split_list[0];
      which_is_further = split_list[1];

      playing = "synced";
      return true;
    }

  }

  return false;
}


// COPYRIGHT MENTION: Logic to upload an audio file and have it be played provided by this user: https://stackoverflow.com/questions/43710173/upload-and-play-audio-file-js
uploading_track.onchange = async () => {
  var file = uploading_track.files[0];
  file_name = file.name;
  stripped_name = file_name.replace('.m4a', '');
  audio_track_title = stripped_name;


  var audio_url = URL.createObjectURL(file);
  audio.src = audio_url;
  document.getElementById("input_container").style.display = "none";
  document.getElementById("big_wrapper").style.display = "flex";


  global_difference = 0;
  which_is_further = "";

  // Check if this track has been saved before
  title_found = findTitle();
  if (title_found == true) {
    document.getElementById("big_wrapper").style.display = "block";
    playing = "synced";
    var media = document.getElementsByTagName("video")[0];
    calculateSlider("video");
    media.pause();
    audio.pause();
  }
  else {
    document.getElementById("start_wrapper").style.display = "block";
  }



}


function checkForVideo() {
  video = document.getElementsByTagName("video")[0];
    if(video === undefined) {
      window.setTimeout(checkForVideo, 100); /* this checks the flag every 100 milliseconds*/
    }
    else {
      video = document.getElementsByTagName("video")[0];
      }
}
checkForVideo();


// Calculate the difference between the two starting points
// and save it in local storage so it can be fetched later
function calculateDifference(audioStart, movieStart){

  // Calculate difference
  if (audioStart > movieStart) {
    var difference = audioStart - movieStart
    var msg = "audiofurther"

  }
  else {
    var difference = movieStart - audioStart
    var msg = "moviefurther"
  }

  global_difference = difference;
  which_is_further = msg;
}

// This function calculates where the audio slider should be
function calculateSlider(slider) {

  movieStart = global_movie_start;
  audioStart = global_audio_start;

  var difference = global_difference;
  var msg = which_is_further;

  var movie = document.getElementsByTagName("video")[0];
  audio = document.getElementById("audio_track_player");

  // Sync up
  if (slider == "video") {
    movie_time = movie.currentTime;
    if (msg == "audiofurther")
    {
      audio.currentTime = (parseInt(movie_time) + parseInt(difference));
    }
    else
    {
      audio.currentTime = (parseInt(movie_time) - parseInt(difference));
    }
  }
}

volume.addEventListener('input', function(){
  new_volume = (parseInt(volume.value) / 100);
  audio_track_player.volume = new_volume;
  // Change background of slider
  var tstring = "linear-gradient(90deg, rgba(255,0,0,1) " + volume.value + "%, rgba(176,177,174)" + volume.value + "%)"
  document.getElementById("volume_range_slider").style.background = tstring;
});

test_progress.addEventListener('input', function(){
  percentage = test_progress.value;
  // Change background of slider
  var tstring = "linear-gradient(90deg, rgba(255,0,0,1) " + percentage  + "%, rgba(176,177,174)" + percentage  + "%)"
  document.getElementById("test-progress").style.background = tstring;
});


test_progress.addEventListener('change', function(){
  // var geheel = audio_track_player.duration; // 7142.29551 seconds
	// var deel = audio_track_player.currentTime;
  // var percentage = (deel / geheel) * 100;
  // test_progress.value = percentage;

});


audio_track_player.addEventListener('loadedmetadata', function() {
	var duration = audio_track_player.duration;
	var currentTime = audio_track_player.currentTime
	document.getElementById("track_duration").innerHTML = convertElapsedTime(duration);
	document.getElementById("track_current_time").innerHTML = convertElapsedTime(currentTime);

});

function convertElapsedTime(inputSeconds) {
	var seconds = Math.floor(inputSeconds % 60);
	if (seconds < 10) {
	seconds = "0" + seconds;
	}
	var minutes = Math.floor(inputSeconds / 60);
	return minutes + ":" + seconds;
}

// If the audio track play button is clicked, run this
track_play_button.addEventListener('click', function() {

	if (button_status == "pause") {
    button_status = "play";
    track_play_button.innerHTML = '<svg class="track_play_button" aria-hidden="true" focusable="false" data-prefix="fas" data-icon="pause" class="svg-inline--fa fa-pause fa-w-14" role="img" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 448 512"><path fill="red" d="M144 479H48c-26.5 0-48-21.5-48-48V79c0-26.5 21.5-48 48-48h96c26.5 0 48 21.5 48 48v352c0 26.5-21.5 48-48 48zm304-48V79c0-26.5-21.5-48-48-48h-96c-26.5 0-48 21.5-48 48v352c0 26.5 21.5 48 48 48h96c26.5 0 48-21.5 48-48z"></path></svg>';
    audio_track_player.play()

	} else {
    button_status = "pause";
    track_play_button.innerHTML = '<svg class="track_play_button" "aria-hidden="true" focusable="false" data-prefix="fas" data-icon="play" class="svg-inline--fa fa-play fa-w-14" role="img" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 448 512"><path fill="red" d="M424.4 214.7L72.4 6.6C43.8-10.3 0 6.1 0 47.9V464c0 37.5 40.7 60.1 72.4 41.3l352-208c31.4-18.5 31.5-64.1 0-82.6z"></path></svg>';
		audio_track_player.pause()
	}
});

// Fill the audio track progress bar with color as the time progresses
audio_track_player.addEventListener('timeupdate', function() {

	var currentTime = audio_track_player.currentTime;
	var duration = audio_track_player.duration;

	document.getElementById("track_current_time").innerHTML = convertElapsedTime(currentTime)


  var geheel = audio_track_player.duration; // 7142.29551 seconds
	var deel = audio_track_player.currentTime;
  var percentage = (deel / geheel) * 100;
  test_progress.value = percentage;

  percentage = test_progress.value;
  // Change background of slider
  var tstring = "linear-gradient(90deg, rgba(255,0,0,1) " + percentage  + "%, rgba(176,177,174)" + percentage  + "%)"
  document.getElementById("test-progress").style.background = tstring;

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
    audio.play();
    button_status = "play";
    track_play_button.innerHTML = "<i class='fa fa-pause'></i>";
    calculateSlider("video");
  }
});

// If the video is paused, pause the audio as well
video.addEventListener('pause', function(){
  if (playing === "synced") {
    audio.pause();
    button_status = "pause";
    track_play_button.innerHTML = "<i class='fa fa-play'></i>";
  }
});

// If the audio has started, play the video as well
audio.addEventListener('play', function(){
  if (playing === "synced")  {
      video.play();
  }
});

// If the audio is paused, pause the video as well
audio.addEventListener('pause', function(){
  if (playing === "synced") {
    video.pause();
  }
});

// Save starting point of track
save_track.addEventListener('click', function(){
  audio.pause();
  var time = audio.currentTime;
  global_audio_start = time;

  document.getElementById("step1").style.display = "none";
  document.getElementById("step2").style.display = "block";
})

// Save starting point of video
save_video.addEventListener('click', function(){
  var media = document.getElementsByTagName("video")[0];
  media.pause();
  var time = media.currentTime;
  global_movie_start = time;

  audio_time = global_audio_start;

  calculateDifference(audio_time, time);
  document.getElementById("step2").style.display = "none";
  document.getElementById("step3").style.display = "block";

  playing = "synced";

  var difference = global_difference;
  var further = which_is_further;


  // 1 Get current list of saved movies
  var title_list = window.localStorage.getItem("titles");

  // 2 If list is none existing, create it
  if(title_list === null){
    var title_list = []
  }
  else {
    var title_list = JSON.parse(title_list);
  }

  // 4 Add it to the list
  title_list.push(audio_track_title);

  // 5 Parse the list to JSON
  var jsonList = JSON.stringify(title_list);

  // 6 Update the list in local storage
  window.localStorage.setItem("titles", jsonList);

  // Save the difference values
  var total_dif = difference + "," + further;
  window.localStorage.setItem(audio_track_title, total_dif);

  var media = document.getElementsByTagName("video")[0];
  media.pause();
  audio.pause();

})