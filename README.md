# PressPause
#### Brief Description:
A Chrome extension using Javascript that helps sync up a commentary track with a movie.

#### Chrome Store Description:
A Chrome extension using Javascript that helps sync up a commentary track with a movie. This is an
unofficial support extension for the commentary tracks released by Pretty Much It. I am not affiliated
with PMI, I am but a humble patron who regurlarly messed up their sync when accidentally pausing the movie.

This extension will add a toolbar to the webpage when you click the extension's icon. It will allow
you to upload the audio track and have you sync it up with the movie by saving the timestamps where you were told
the tracks are synced. After this, the audio track will be linked to the movie player.

Features:
- Pausing/playing or moving through the movie's progress bar will have the audio track follow along and not lose the sync.
- Once you sync up a track with a movie, it's sync data will be saved to the audio file's title in local storage. This means
that if you upload the same file again, it will be already linked to the movie and you can just continue watching.
- You can manually delete a saved track in the menu which can be accessed through the toolbar.
- You can also change the title of the audio file if you want to set up the sync again.
- Works on any webpage that is playing a movie. Tested with Netflix, Disney+, YouTube and more.

This has been a passion project of mine to work on my Javascript skills.

##### Objective:
As someone who enjoys listening to commentary tracks while watching a movie, I often struggle
with not being able to pause/play the movie without messing up the sync with the
commentary track. Sometimes you also want to fastforward the movie because you didn't
finish it completely the last time, but this gets complicated because you'll
have to calculate where the audio track should be depending on the movie's progress.

This chrome extension opens up a fixed toolbar at the top of the page.
It lets you upload an audio file and helps you sync it up with the movie.
Once you've done this, the two players will be linked. This means it's safe to
pause and play either one of the tracks because the other one will do the same. You can
also move through the movie's progress bar because the audio track will move along accordingly.
The track's data is saved in LocalStorage and can be retrieved after uploading the audio file, so
you'll only have to sync it up one time.

##### popup.js:
This file listens when the extension icon is clicked and start
running sync.js and thus open up the toolbar.

#####

##### sync.js:
This file starts with creating the toolbar that is added at the top of the page.
It features multiple eventlisteners that support the various buttons that are in the toolbar.

The logic to upload an audio file and have it be played in the audio player
is taken from here: https://stackoverflow.com/questions/43710173/upload-and-play-audio-file-js.

After the buttons are pressed to save the audio and movie track's starting points,
both values are saved in local storage. The calculateDifference function then
calculates the difference between the track's starting point and the movie's starting point.
This value will be stored in local storage so it can be retrieved any time the movie bar is dragged
and the value of the audio bar needs to be calculated. This is done in the calculateSlider function.

Because the audio bar is a custom one, there's an eventlistener for when the time is updating
(aka when the track is playing). The bar will be filled with red as the time progresses.
The volume controle is also custom made. It's basically a regular slider but the background
color will also be changed dynamically depending on where the slider is dragged.

Saving a track's data and deleting one is quite similar. A list of saved titles is
stored in local storage. When saving a track, this list is retrieved and the new
title gets appended. When deleting one, the title is removed from the list.
Then the updated list is stored again in LocalStorage.


##### Design Choices:
- An earlier version of this project also let the user move through the audio bar and the movie's bar would move along with it. However, this doesn't work on every website. Platforms such as Netflix have a security block that don't allow you to change their own HTML (as Netflix's progress bar's value would have to be changed), but only read it. To ensure that this extension could still work on every webpage, I decided to discard the option to move through the audio bar
