var toolbar = document.createElement('div');
toolbar.setAttribute("id", "audio_track_sidebar");
toolbar.innerHTML = "\
  <link rel='stylesheet' href='https://cdnjs.cloudflare.com/ajax/libs/font-awesome/4.7.0/css/font-awesome.min.css'>\
  <link rel='stylesheet' href='/fonts/fontawesome-free-5.3.1-web/css/all.css'>\
  <div id='input_container'>\
  \
  <input type='file' name='file' id='uploading_track' class='inputfile'>\
  <label id='input_track_label'for='uploading_track'><i class='fa fa-upload'></i>   Upload audio track</label>\
  </div>\
  \
  <div id='big_wrapper'>\
  <div id='player_wrapper'>\
  <button id='track_play_button' style='font-size:16px;color:red'><i class='fa fa-play'></i></button>\
  <canvas id='track_progress_bar' width='500' height='10'></canvas> \
  <audio id='audio_track_player'></audio>\
  </div>\
  <div id='timing_container'>\
  <span class='timing_content' id='track_current_time'></span> <span class'timing_content'> /</span> \
  <span class='timing_content' id='track_duration'></span> \
  </div>\
  <div id='track_player_volumecontrol'>\
  <input type='range' min='0' max='100' value='50'  id='volume_range_slider'>\
  <i id='volume_btn' class='fa fa-volume-up' style='font-size:19px;color:red'></i>\
  </div>\
  </div>\
  \
  <div id='intro_container'>\
  <label id='start_new_track'  class='custom_button_style'> Link new track </label>\
  <label id='recover_track'  class='custom_button_style'> Load saved data </label>\
  </div>\
  \
  <div id='start_wrapper'>\
  <div class='start_instructions' id='step1'>\
  <div class='text_instructions'>\
  <span class='start_text'>Start playing the audio track first. Pause when they tell you to and press save.</span>\
  </div>\
  <div class='rbtns'>\
  <label id='back_start_con'  class='custom_button_style'> Back </label>\
  <label id='save_track' class='custom_button_style'> Save </label>\
  </div>\
  </div>\
  \
  <div class='start_instructions' id='step2'>\
  <div class='text_instructions'>\
  <span class='start_text'>Now start playing the movie. Pause at the point where they told you to start the audio track and press save.</span>\
  </div>\
  <div class='rbtns'>\
  <label id='save_video' class='custom_button_style'> Save </label>\
  </div>\
  </div>\
  \
  <div class='start_instructions' id='step3'>\
  <span class='start_text'>The tracks are now linked. Next time you can load it without setting it up again.\
  It's now safe to pause, rewind or fastforward the movie because the audio track will follow. </span>\
  </div>\
  </div>\
  \
  <div id='recover_wrapper'>\
  <form id='select_track_form'name='trackselect'> Select a track: <select id='select_track' name='track' class='widget'>\
  <option>Tracks</option>\
  </select></form>\
  <div id='recover_menu'>\
  <label id='back_start_con2'  class='custom_button_style'> Back </label>\
  <label id='load_track' class='custom_button_style'> Load track </label>\
  <label id='delete_track' class='custom_button_style'> Delete track </label>\
  </div>\
  </div>\
  <div class='toggle_sidebar_menu' id='close_sidebar'><i id='icon_arrow_up' class='fa fa-angle-up' style='font-size:24px'></i></div>\
";


var audio_track_title = "";
var open_sidebar = document.createElement('div');
open_sidebar.setAttribute("id", "open_sidebar");
open_sidebar.setAttribute("class", "toggle_sidebar_menu");
open_sidebar.innerHTML = "<i id='toggle_arrow_down' class='fa fa-angle-down' style='font-size:24px'></i>"
open_sidebar.style.position = 'fixed';
open_sidebar.style.left = '0px';
open_sidebar.style.top = '0px';
open_sidebar.style.zIndex = '9999';
document.body.appendChild(open_sidebar);


toolbar.style.position = 'fixed';
toolbar.style.left = '0px';
toolbar.style.top = '0px';
toolbar.style.zIndex = '9999';

document.body.appendChild(toolbar);


// Declare variables
var entire_sidebar = document.getElementById("audio_track_sidebar");
var uploading_track = document.getElementById("uploading_track");
var audio = document.getElementById("audio_track_player");
var recover_button = document.getElementById("recover_track");
var start_new_track = document.getElementById("start_new_track");
var canvas_width = 500;
var canvas_height = 4;
var audio_track_player = document.getElementById('audio_track_player');
var track_progress_bar = document.getElementById('track_progress_bar').getContext('2d');
var track_play_button = document.getElementById('track_play_button');
var button_status = "pause";
var playing = "idle"
var video = "";
var volume = document.getElementById("volume_range_slider");
var save_track = document.getElementById("save_track")
var save_video = document.getElementById("save_video")
var load_track = document.getElementById("load_track")
var delete_track = document.getElementById("delete_track")
var save_button = document.getElementById("save_slider");

var recover_wrapper = document.getElementById("recover_wrapper");
var start_wrapper = document.getElementById("start_wrapper");
var intro_container = document.getElementById("intro_container");

var back_to_start = document.getElementById("back_start_con");
var back_to_start2 = document.getElementById("back_start_con2");


back_to_start.addEventListener('click', function(){
  start_wrapper.style.display = "none";
  intro_container.style.display = "block";
});

back_to_start2.addEventListener('click', function(){
  recover_wrapper.style.display = "none";
  intro_container.style.display = "block";
});



var close_sidebar = document.getElementById("close_sidebar");
close_sidebar.addEventListener("click", function() {
 
    entire_sidebar.style.display = "none";
    open_sidebar.style.display = "block";    
    
});

var open_sidebar = document.getElementById("open_sidebar");
open_sidebar.addEventListener("click", function() {
 
    entire_sidebar.style.display = "block";
    open_sidebar.style.display = "none";
    
    
});


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
      return true;
    }
    else {
      return false;
    }
  }

}

// // Fill the select menu with all the movie titles saved in local storage
// function updateSelect() {

//   // get the string from localStorage
//   const str = window.localStorage.getItem("titles");

//   var parsed = JSON.stringify(str);

//   var stripped = parsed.replace("[", "");
//   var stripped = stripped.replace("]", "");
//   var stripped = stripped.split('"').join('');
//   var stripped = stripped.replace(/\\|\//g,'');

//   // List with all the saved titles
//   var title_list = stripped.split(",");
//   if (title_list[0] === 'null' || title_list[0] === "") {

//     intro_container.style.display = "none";
//     recover_wrapper.innerHTML = "You haven't saved any tracks yet. <br> <br> <label id='back_start_con3'  class='custom_button_style'> Back </label>";
//     var back_start_con3 = document.getElementById('back_start_con3'); back_start_con3.addEventListener('click', function(){ recover_wrapper.style.display = 'none';intro_container.style.display = 'block';});
//   }
//   else {
//     document.getElementById("select_track").options.length = 0;
//     let select_movie = document.getElementById("select_track")
//     var opt = document.createElement('option');
//     opt.value = "Tracks";
//     opt.innerHTML = "Tracks";
//     opt.disabled = true;
//     select_movie.appendChild(opt);

//     for (var i = 0; i < title_list.length; i++) {

//       var opt = document.createElement('option');
//       opt.value = title_list[i];
//       opt.innerHTML = title_list[i];
//       select_movie.appendChild(opt);

//     }
//     document.getElementById("recover_menu").style.display = "inline-block";
//   }

// };

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
  

  track_progress_bar.clearRect(0, 0, canvas_width, canvas_height);
	track_progress_bar.fillStyle = "#b0b1ae";
	track_progress_bar.fillRect(0, 0, canvas_width, canvas_height);

  window.localStorage.setItem('difference', 0);
  window.localStorage.setItem('further', "");

  // Check if this track has been saved before
  does_title_exist = findTitle();
  if (does_title_exist == true) {
    alert("title's been saved before")
    var title_list = window.localStorage.getItem("titles");
    alert(title_list)
    var total_dif = localStorage.getItem(audio_track_title);
    var dif_list = total_dif.split(",");
 

    window.localStorage.setItem('difference', dif_list[0]);
    window.localStorage.setItem('further', dif_list[1]);
    playing = "synced";
  }
  else {
    alert("title not saved")
    document.getElementById("start_wrapper").style.display = "block";
  }

}

// Update the select menu with the saved titles on page load
window.addEventListener('load', (event) => {
  updateSelect();
});


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

  window.localStorage.setItem('difference', difference);
  window.localStorage.setItem('further', msg);

}


// This function calculates where the audio slider should be
function calculateSlider(slider) {

  movieStart = window.localStorage.getItem("start_video");
  audioStart = window.localStorage.getItem("start_audio");

  var difference = window.localStorage.getItem("difference");
  var msg = window.localStorage.getItem("further");

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

recover_button.addEventListener('click', function(){
  updateSelect()
  recover_wrapper.style.display = "block";
  start_wrapper.style.display = "none";
  intro_container.style.display = "none";

});


start_new_track.addEventListener('click', function(){

  start_wrapper.style.display = "block";
  recover_wrapper.style.display = "none";
  intro_container.style.display = "none";

});

volume.addEventListener('input', function(){
  new_volume = (parseInt(volume.value) / 100);
  audio_track_player.volume = new_volume;
  // Change background of slider
  var tstring = "linear-gradient(90deg, rgba(255,0,0,1) " + volume.value + "%, rgba(176,177,174)" + volume.value + "%)"
  document.getElementById("volume_range_slider").style.background = tstring;
});


audio_track_player.addEventListener('loadedmetadata', function() {
	var duration = audio_track_player.duration;
	var currentTime = audio_track_player.currentTime
	document.getElementById("track_duration").innerHTML = convertElapsedTime(duration);
	document.getElementById("track_current_time").innerHTML = convertElapsedTime(currentTime);
	track_progress_bar.fillRect(0,0, canvas_width, canvas_height);
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
    track_play_button.innerHTML = "<i class='fa fa-pause'></i>";
    audio_track_player.play()

	} else {
    button_status = "pause";
    track_play_button.innerHTML = "<i class='fa fa-play'></i>";
		audio_track_player.pause()
	}

});

// Fill the audio track progress bar with color as the time progresses
audio_track_player.addEventListener('timeupdate', function() {
	track_progress_bar.clearRect(0, 0, canvas_width, canvas_height);
	track_progress_bar.fillStyle = "#b0b1ae";
	track_progress_bar.fillRect(0, 0, canvas_width, canvas_height);

	var currentTime = audio_track_player.currentTime;
	var duration = audio_track_player.duration;

	document.getElementById("track_current_time").innerHTML = convertElapsedTime(currentTime)

	var percentage = currentTime / duration;
	var progress = (canvas_width * percentage)
	track_progress_bar.fillStyle = "#FF0000";
	track_progress_bar.fillRect(0, 0, progress, canvas_height);

});

// Everytime the video is moved to a different point in the progress 
// bar, calculate where the audio slider should be
video.addEventListener('seeking', function() {
  if (playing === "synced") {
    calculateSlider("video");
  }

});

// If the video track play button is clicked, run this
video.addEventListener('play', function(){
  if (playing === "synced") {
    audio.play();
    button_status = "play";
    track_play_button.innerHTML = "<i class='fa fa-pause'></i>";
    calculateSlider("video");
  }
});

video.addEventListener('pause', function(){
  if (playing === "synced") {
    audio.pause();
    button_status = "pause";
    track_play_button.innerHTML = "<i class='fa fa-play'></i>";

  }
});

audio.addEventListener('play', function(){
  if (playing === "synced")  {
      video.play();
  }
});

audio.addEventListener('pause', function(){
  if (playing === "synced") {
    video.pause();
  }
});


// Save starting point of track
save_track.addEventListener('click', function(){
  audio.pause();
  var time = audio.currentTime;
  window.localStorage.setItem('start_audio', time);
  document.getElementById("step1").style.display = "none";
  document.getElementById("step2").style.display = "block";
})

// Save starting point of video
save_video.addEventListener('click', function(){
  var media = document.getElementsByTagName("video")[0];
  media.pause();
  var time = media.currentTime;
  window.localStorage.setItem('start_video', time);
  audio_time = localStorage.getItem('start_audio');
  calculateDifference(audio_time, time);
  document.getElementById("step2").style.display = "none";
  document.getElementById("step3").style.display = "block";

  playing = "synced";

  var difference = window.localStorage.getItem('difference');
  var further = window.localStorage.getItem('further');

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
  window.localStorage.setItem(title, total_dif);

  
  var media = document.getElementsByTagName("video")[0];
  media.pause();
  audio.pause();


})

// Save the current track's data so it can be retrieved later
save_button.addEventListener('click', function(){

  playing = "synced";
  var title = document.getElementById("movie_title").value;

 

    var difference = window.localStorage.getItem('difference');
    var further = window.localStorage.getItem('further');

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
    window.localStorage.setItem(title, total_dif);

  
  var media = document.getElementsByTagName("video")[0];
  media.pause();
  audio.pause();

  document.getElementById("step3").style.display = "none";

});

// Load a track's data
load_track.addEventListener('click', function(){

  // var track_title = document.querySelector('#select_track').value;
  var title_list = window.localStorage.getItem("titles");
  var total_dif = localStorage.getItem(audio_track_title);
  var dif_list = total_dif.split(",");

  window.localStorage.setItem('difference', dif_list[0]);
  window.localStorage.setItem('further', dif_list[1]);
  playing = "synced";
  recover_wrapper.style.display = "none";

})

// Delete a saved track's data
delete_track.addEventListener('click', function(){
  alert("hey")
  var track_title = document.querySelector('#select_track').value;
  localStorage.removeItem(track_title);

  // 1 Get current list of saved movies
  var title_list = window.localStorage.getItem("titles");
  title_list = JSON.parse(title_list);

  // 4 Remove from the list
  var new_list = title_list.filter(function(e) { return e !== track_title })

  // 5 Parse the list to JSON
  var jsonList = JSON.stringify(new_list);

  // 6 Update the list in local storage
  window.localStorage.setItem("titles", jsonList);
  updateSelect();

})