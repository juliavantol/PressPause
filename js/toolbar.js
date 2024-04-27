// Function to add the two toolbars to the page, the help menu is initially set to hidden from view

var toolbar = document.createElement('div');
toolbar.setAttribute("id", "audio_track_sidebar");
toolbar.innerHTML = '\
  <link rel="stylesheet" href="https://cdnjs.cloudflare.com/ajax/libs/font-awesome/4.7.0/css/font-awesome.min.css">\
  <link rel="icon" type="image/x-icon" href="../images/popcorn.png"> \
  <script href="https://kit.fontawesome.com/b571da1c14.js" crossorigin="anonymous"></script>\
  <link href="https://css.gg/volume.css" rel="stylesheet">\
  <meta name="viewport" content="width=device-width, initial-scale=1.0">\
  <div id="input_container">\
    <input type="file" name="file" id="uploading_track" class="inputfile">\
    <label id="input_track_label"for="uploading_track"><i class="fa fa-upload"></i>   Upload audio track</label>\
  </div>\
  <div id="big_wrapper">\
    <div id="control_wrapper">\
      <div id="play_icon_container"><i id="play_icon_button" class="gg-play-button-r"></i></div>\
      <span class="container_for_progressbar"><input type="range" step="0.01" min="0" max="100" value="0" id="custom_progressbar_audio"></span>\
      <audio id="audio_track_player"></audio>\
      <span id="track_player_volumecontrol">\
      <i id="volume_btn" class="fa fa-volume-up"></i>\
        <input type="range" min="0" max="100" value="30"  id="volume_range_slider">\
        <div id="menu_button_container">\
            <i id="help_menu_button" class="gg-menu"></i>\
        </div>\
      </span>\
      <br>\
    <span id="timing_container">\
      <span id="track_current_time"></span> / \
      <span id="track_duration"></span> \
    </span>\
  </div>\
</div>\
  <div id="steps_wrapper">\
    <div class="text_instructions" id="step1">\
      Start the audio track, pause when they tell you to and press save.\
      <div class="save_timestamp_button"><label id="save_track" class="custom_button_style"> Save </label></div>\
    </div>\
    <div class="text_instructions" id="step2">\
      Now start the movie, pause at the point where they told you to start the audio track and press save.\
      <div class="save_timestamp_button"><label id="save_video" class="custom_button_style"> Save </label></div>\
    </div>\
    <div class="text_instructions" id="step2_error">\
    No video found \
   </div>\
    <div class="text_instructions" id="step3">\
      The tracks are linked!\
      <div class="save_timestamp_button"><label id="close_popup_container2" class="custom_button_style"> Close </label></div>\
    </div>\
  </div>\
  <script src="sync.js"></script> \
  <script src="functions.js"></script> \
  \
';

toolbar.style.position = 'fixed';
toolbar.style.left = '0px';
toolbar.style.top = '0px';
toolbar.style.zIndex = '9999';
document.body.appendChild(toolbar);

var instructions = document.createElement('div');
instructions.setAttribute("id", "popup_instructions");
        instructions.innerHTML = '\
        <link rel="preconnect" href="https://fonts.googleapis.com">\
        <link rel="preconnect" href="https://fonts.gstatic.com" crossorigin>\
        <link href="https://fonts.googleapis.com/css2?family=Dongle&display=swap" rel="stylesheet">\
        <link rel="preconnect" href="https://fonts.gstatic.com" crossorigin> \
<link href="https://fonts.googleapis.com/css2?family=Dosis:wght@400&display=swap" rel="stylesheet">\
        <div id="explained" class="explained"> \
            <p> Save the timestamps where the tracks are synced up. These points are always explained at the start of the commentary track. \
            You are going to do this in 2 steps: </p> \
            \
            <p class="tab-text"> </p> 1. <p class="tab-text-start"></p> Start playing the audio track first. Pause \
            when you hear: "Press pause!" and click the button to save this timestamp. <br><br> \
            \
            <p class="tab-text"> </p> 2. <p class="tab-text-start"></p> Now start playing the movie and go to the point in the movie where you \
            were told to press play on the commentary track. Pause the movie \
            at this point and click the button to save this timestamp as well. <br><br>\
            \
            <p> The tracks are now synced! You can safely pause, fastforward and rewind the movie because the audio \
            track will follow. <br><br> You are not able to control the audio bar anymore (because not every website \
            supports their progress bar value to be changed externally) so note that you can only use the movie progress bar now.</p> \
            \
        </div> \
        <div id="review_titles" class="review_titles"> \
            <div id="hidden_view_list"></div>\
            <table id="table_with_titles"></table>\
        </div>\
        ';

instructions.style.position = 'fixed';
instructions.style.top = '0px';
instructions.style.zIndex = '99999';
instructions.style.display = 'none';
document.body.appendChild(instructions);
