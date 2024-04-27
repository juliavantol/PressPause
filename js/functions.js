const closeButton = document.getElementById("close_popup_container");
var media = null;


// Calculates the difference between the two starting points
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

  // Save values in global variables
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

  // Sync up
  movie_time = movie.currentTime;
  if (msg == "audiofurther"){
    audio_track_player.currentTime = (parseInt(movie_time) + parseInt(difference));}
  else {
    audio_track_player.currentTime = (parseInt(movie_time) - parseInt(difference));}

}

function convertElapsedTime(inputSeconds) {
	var seconds = Math.floor(inputSeconds % 60);
	if (seconds < 10) {
	seconds = "0" + seconds;
	}
	var minutes = Math.floor(inputSeconds / 60);
	return minutes + ":" + seconds;
}

function toggle_play() {
    if (button_status == "pause") {
        button_status = "play";
        track_play_button.innerHTML = '<i class="gg-play-pause-r"></i>';
        audio_track_player.play()

	} else {
        button_status = "pause";
        track_play_button.innerHTML = '<i class="gg-play-button-r"></i>';
    	  audio_track_player.pause()
	}
};

function save_track_point(){

    audio_track_player.pause();
    var time = audio_track_player.currentTime;
    global_audio_start = time;

    step1.style.display = "none";
    
    
    media = document.getElementsByTagName("video")[0];
    if (!media)
    {
      step2_error.style.display = "block";
      return;
    }
    else
      step2.style.display = "block";
};


function save_video_point()
{
    media = document.getElementsByTagName("video")[0];
    if (!media)
      return;

    media.pause();
    var time = media.currentTime;
    global_movie_start = time;

    audio_time = global_audio_start;

    calculateDifference(audio_time, time);
    step2.style.display = "none";
    step3.style.display = "block";
    track_play_button.style.display = "none";

    playing = "synced";

    var difference = global_difference;
    var further = which_is_further;

    // 1 Get current list of saved movies
    var title_list = window.localStorage.getItem("titles");

    // 2 If list is none existing, create it
    if(title_list === null)
    {
        var title_list = []
    }
    else
    {
        var title_list = JSON.parse(title_list);
    }

    // 4 Add it to the list
    title_list.push(audio_track_title);

    // 5 Parse the list to JSON
    jsonList = JSON.stringify(title_list);

    // 6 Update the list in local storage
    window.localStorage.setItem("titles", jsonList);

    // Save the difference values
    var total_dif = difference + "," + further;
    window.localStorage.setItem(audio_track_title, total_dif);

    var media = document.getElementsByTagName("video")[0];
    media.pause();
    audio_track_player.pause();
}

function open_help_menu() {

    if (show_status == "hidden")
    {
        popup_instructions.style.display = "block";
        show_status = "showing";
        explained.style.display = "block";
    } else 
    {
        popup_instructions.style.display = "none";
        show_status = "hidden";
    }
    
    if (closeButton)
    {
      closeButton.onclick = function(event)
      {
        popup_instructions.style.display = "none";
        show_status = "hidden";
      };
    }
}