
/*******************************************
****          LabSim - Video            ****
**** (c) 2020-2025, Alessandro Pedretti ****
*******************************************/


/**** Show event ****/

function ShowEvent()
{
  TvInit();

  /**** Show the page ****/

  document.getElementById("DivSplash"  ).style.display = "none";
  document.getElementById("tvpagecont" ).style.display = "inline"
}


/**** Initialize video ****/

function TvInit()
{
  /**** Create the TV playlist ****/

  var k;
  var TvPlayList = document.querySelector('#tvpage_1');
  var TvPageCont = document.querySelector('#tvpagecont');
  var TvPages    = PlayListVideo.length / TV_MAXPAGEVIDEO / 2;

  TvPlayList.querySelector('#tvtitle').textContent = Msg.TvPlayListTitle;
  TvPlayList.querySelector('#year2').textContent   = new Date().getFullYear();

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
      TvPlayList = document.querySelector('#tvpage_' + TvPage);
    }

    var TvItem = document.createElement("button");
    TvItem.setAttribute('class', 'tvmenubutton');
    TvItem.setAttribute('id', 'Video' + (k + 1));
    TvItem.setAttribute('onclick', "TvPlayVideo('" + k + "');");
    TvPlayList.appendChild(TvItem);
    TvItem.insertAdjacentHTML("afterbegin", (k + 1) + '. ' + PlayListVideo[k * 2]);
  } /* End of for (k) */
}

/**** Play video ****/

function TvPlayVideo(VideoId)
{
  window.open(TV_VIDEO_PATH + PlayListVideo[VideoId * 2 + 1], '_blank').focus();
}


/**** Show the menu ****/

function TvShowMenu(Page)
{
  var Pages = document.querySelectorAll('.tvmenupage');
  for(var i = 0; i < Pages.length; i++) {
   Pages[i].style.display = (Pages[i].id == 'tvpage_' + Page) ? 'block' : 'none';
  } /* End of for (i) */
}
