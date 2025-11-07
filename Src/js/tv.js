
/*******************************************
****             LabSim - TV            ****
**** (c) 2020-2025, Alessandro Pedretti ****
*******************************************/


/**** Initialize TV ****/

function TvInit()
{
  /**** Create the TV playlist ****/

  var k;
  var TvPlayList = Tv.Menu.querySelector('#tvpage_1');
  var TvPageCont = Tv.Menu.querySelector('#tvpagecont');
  var TvPages    = PlayListVideo.length / TV_MAXPAGEVIDEO / 2;

  TvPlayList.querySelector('#tvtitle').textContent = Msg.TvPlayListTitle;

  for(k = 1; k < TvPages; ++k) {
    var TvPageClone = TvPlayList.cloneNode(true);
    TvPageClone.setAttribute('id', 'tvpage_' + (k + 1));
    TvPageClone.style.display = "none";
    var DivBack = TvPageClone.querySelector('#tvback');
    DivBack.style.display = 'block';
    DivBack.querySelector('#tvbtback').setAttribute('onclick', 'TvShowMenu(' + k + ');');

    var DivNext = TvPageClone.querySelector('#tvnext');
    if (k < (TvPages - 1)) {
      DivNext.querySelector('#tvbtnext').setAttribute('onclick', 'TvShowMenu(' + (k + 2) + ');');
      DivNext.style.display = 'block';
      DivNext.style.width = '50%';
      DivBack.style.width = '50%';
    } else {
      DivNext.style.display = 'none';
    }

    TvPageCont.appendChild(TvPageClone);
  } /* End of for (k) */


  var TvPage = 1;
  Tv.VideoMax = PlayListVideo.length / 2;
  for(k = 0; k < Tv.VideoMax; ++k) {
    if ((k) && (k % TV_MAXPAGEVIDEO) == 0) {
      ++TvPage;
      TvPlayList = Tv.Menu.querySelector('#tvpage_' + TvPage);
    }

    var TvItem = document.createElement("button");
    TvItem.setAttribute('class', 'tvmenubutton');
    TvItem.setAttribute('id', 'Video' + (k + 1));
    TvItem.setAttribute('onclick', "TvPlayVideo('" + k + "');");
//    TvItem.appendChild(document.createTextNode((k + 1) + '. ' + PlayListVideo[k * 2]));
    TvPlayList.appendChild(TvItem);
    TvItem. insertAdjacentHTML("afterbegin", (k + 1) + '. ' + PlayListVideo[k * 2]);
  } /* End of for (k) */
}


/**** Play video ****/

function TvPlayVideo(VideoId)
{
  if (DEBUG)
    console.log(LOG_PROMPT, 'Play video', VideoId);

  Tv.Video.setAttribute('src', TV_VIDEO_PATH + PlayListVideo[VideoId * 2 + 1]);
  Tv.Menu.removeAttribute('class');
  Tv.Menu.setAttribute('visible', 'false');
  Tv.Player.setAttribute('visible', 'true');
  Tv.Player.setAttribute('class', 'raycastable');
  Tv.Player.setAttribute('src', '#TvVideo');
  Tv.VideoCur = VideoId;
  Tv.Video.play();

  RaycastableObj('.tvctrlray', true);
  setTimeout(function() {Tv.Mode = TV_MODE_PLAYER;}, 500);
}


/**** Move the progress bar ****/

function TvProgBarMove(Pos)
{
  Tv.Counter.setAttribute('text', 'value: ' +  Sec2Time(Pos) + '/' + Sec2Time(Tv.Video.duration));
  Tv.Cursor.setAttribute('position',
                         TV_PROGBAR_OFFSET_X + (TV_PROGBAR_WIDTH * Pos) / Tv.Video.duration +
                        ' 0 0.001');
}


/**** Show the log ****/

function TvShowLog()
{
  if (DEBUG)
    console.log(LOG_PROMPT, 'TV show log');

  Tv.Menu.removeAttribute('class');
  Tv.Menu.setAttribute('visible', 'false');
  Tv.Log.setAttribute('visible', 'true');
  Tv.Log.setAttribute('class', 'raycastable');

  setTimeout(function() {Tv.Mode = TV_MODE_LOG;}, 500);
}


/**** Show the menu ****/

function TvShowMenu(Page)
{
  if (Page) {
    var Pages = Tv.Menu.querySelectorAll('.tvmenupage');
    for(var i = 0; i < Pages.length; i++) {
      Pages[i].style.display = (Pages[i].id == 'tvpage_' + Page) ? 'block' : 'none';
    } /* End of for (i) */
  } else {
    Tv.Log.removeAttribute('class');
    Tv.Log.setAttribute('visible', 'false');
    Tv.Player.removeAttribute('class');
    Tv.Player.setAttribute('visible', 'false');

    Tv.Menu.setAttribute('class', 'raycastable');
    Tv.Menu.setAttribute('visible', 'true');

    Tv.Mode = TV_MODE_MENU;
  }
}
