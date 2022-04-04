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
    step2.style.display = "block";

};


function save_video_point() {
    var media = document.getElementsByTagName("video")[0];
    media.pause();
    var time = media.currentTime;
    global_movie_start = time;

    audio_time = global_audio_start;

    calculateDifference(audio_time, time);
    step2.style.display = "none";
    step3.style.display = "block";

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

function fill_titles() {

    // get the string from localStorage
    var str = window.localStorage.getItem("titles");
    $("#table_with_titles").empty();
    var parsed = JSON.stringify(str);

    var stripped = parsed.replace("[", "");
    var stripped = stripped.replace("]", "");
    var stripped = stripped.split('"').join('');
    var stripped = stripped.replace(/\\|\//g,'');

    // List with all the saved titles
    var title_list = stripped.split(",");


        let table = document.getElementById("table_with_titles")
        var row = document.createElement('tr');
        var header = document.createElement('th');
        header.classList.add("title_option");
        header.innerHTML = "Track Title";
        var emptyheader = document.createElement('th');
        row.appendChild(emptyheader);
        row.appendChild(header);
        table.appendChild(row);

        for (var i = 0; i < title_list.length; i++) {
            var row = document.createElement('tr');
            var opt = document.createElement('td');
            var del = document.createElement('td');
            title = title_list[i].split('.')[0];
            opt.innerHTML = title;
            opt.classList.add("title_option");
            del.innerHTML = "<i id='"+ title + "'" +"class='fa fa-trash'></i>";
            del.id = title;
            del.classList.add("delete_this_title");
            del.classList.add("delete_title_row");
            opt.classList.add("delete_title_row");

            row.appendChild(del);
            row.appendChild(opt);
            table.appendChild(row);

            if (title == "" || title == "null") {
                $("#table_with_titles").empty();
                var row = document.createElement('tr');
                var opt = document.createElement('td');
                opt.innerHTML = "You haven't saved any tracks on this website.";
                row.appendChild(opt);
                table.appendChild(row);
                
            }
        }



}


function open_help_menu() {

    if (show_status == "hidden") {
        popup_instructions.style.display = "block";
        show_status = "showing";
        explained.style.display = "block";
        review_titles.style.display = "none";
    } else {
        popup_instructions.style.display = "none";
        show_status = "hidden";
    }

    document.getElementById("close_popup_container").onclick = function(Event){
        popup_instructions.style.display = "none";
        show_status = "hidden";
    };

}