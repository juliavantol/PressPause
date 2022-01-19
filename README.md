# DaSynci
#### Video Demo:  https://www.youtube.com/watch?v=0ZoON0GplsE
#### Brief Description:
A Chrome extension using Javascript that helps sync up a commentary track with a movie. 

##### Objective:
As someone who enjoys listening to commentary tracks while watching a movie, I often struggle with not being able to pause/play the movie without messing up the sync with the commentary track. Sometimes you also want to fastforward the movie because you didn't finish it completely the last time, but this gets complicated because you'll have to calculate where the audio track should be depending on the movie's progress.

This chrome extension opens up a fixed toolbar at the top of the page. It lets you upload an audio file and helps you sync it up with the movie. Once you've done this, the two players will be linked. This means it's safe to pause and play either one of the tracks because the other one will do the same. You can also move through the movie's progress bar because the audio track will move along accordingly. The track's data is saved in LocalStorage and can be retrieved after uploading the audio file, so you'll only have to sync it up one time.

##### popup.js:
This file exists to listen when the extension icon is clicked and start running sync.js and thus open up the toolbar.

##### sync.js:
This file starts with creating the toolbar that is added at the top of the page. It features multiple eventlisteners that support the various buttons that are in the toolbar. The updateSelect function retrieves all the saved titles in LocalStorage and fills up the select menu with them.

The logic to upload an audio file and have it be played in the audio player is taken from here: https://stackoverflow.com/questions/43710173/upload-and-play-audio-file-js.

After the buttons are pressed to save the audio and movie track's starting points, both values are saved in LocalStorage. The calculateDifference function then calculates the difference between the track's starting point and the movie's starting point. This value will be stored in LocalStorage so it can be retrieved any time the movie bar is dragged and the value of the audio bar needs to be calculated. This is done in the calculateSlider function.

Because the audio bar is a custom one, there's an eventlistener for when the time is updating (aka when the track is playing). The bar will be filled with red as the time progresses. The volume controle is also custom made. It's basically a regular slider but the background color will also be changed dynamically depending on where the slider is dragged. 

Saving a track's data and deleting one is quite similar. A list of saved titles is stored in LocalStorage. When saving a track, this list is retrieved and the new title gets appended. When deleting one, the title is removed from the list. Then the updated list is stored again in LocalStorage.


##### Design Choices:
- An earlier version of this project also let the user move through the audio bar and the movie's bar would move along with it. However, this doesn't work on every website. Platforms such as Netflix have a security block that don't allow you to change their code (as Netflix's progress bar's value would have to be changed), but only read it. To ensure that this extension could still work on every webpage, I decided to discard the option to move through the audio bar. 
- Even though the bar would be invisible anyway when going fullscreen, I decided to add a toggle button to hide the toolbar to be sure that no buttons of original pages would be inaccessible. 
