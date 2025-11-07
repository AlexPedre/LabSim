
/*******************************************
****         LabSim - Main code         ****
**** (c) 2020-2025, Alessandro Pedretti ****
*******************************************/


/**** Load the local preferences ****/

PrefsLoad();

/**** Speech recognition ****/

if (annyang) {
  if (Lang == 'it') {
    annyang.setLanguage('it-IT');
  } else annyang.setLanguage('en-US');

  if (Prefs.SpeechRecActive) annyang.start();
  annyang.debug(DEBUG);

  /**** Add speech commands ***/

  var ScCommands = {}

  ScCommands[Msg.ScAbout                                            ] = ScAbout;
  ScCommands[Msg.ScAlexa                                            ] = function() {Speak(Msg.SsAlexa);};
  ScCommands[Msg.ScBunsenOx                                         ] = function() {BunsenOxidant(true);};
  ScCommands[Msg.ScBunsenRed                                        ] = function() {BunsenOxidant(false);};

  ScCommands[Msg.ScCent1Min                                         ] = function() {CentrifugeTime(1, false);};
  ScCommands[Msg.ScCent2Min                                         ] = function() {CentrifugeTime(2, false);};
  ScCommands[Msg.ScCent3Min                                         ] = function() {CentrifugeTime(3, false);};
  ScCommands[Msg.ScCent4Min                                         ] = function() {CentrifugeTime(4, false);};

  ScCommands[Msg.ScClose     + Msg.ScBunsenTap                      ] = function() {BunsenGas(false);};
  ScCommands[Msg.ScClose     + Msg.ScCentrifuge                     ] = function() {CentrifugeOpen(false);};
  ScCommands[Msg.ScClose     + Msg.ScMenu2                          ] = ScClose;

  ScCommands[Msg.ScGoogle                                           ] = function() {Speak(Msg.SsGoogle);};
  ScCommands[Msg.ScGotoCentrifuge                                   ] = function() {GotoFootprint('PosCentrifuge');};
  ScCommands[Msg.ScGotoTV                                           ] = function() {GotoFootprint('PosTv');};
  ScCommands[Msg.ScGotoWork                                         ] = function() {GotoFootprint('PosWork');};
  ScCommands[Msg.ScEmpty1                                           ] = ScTrashClick;
  ScCommands[Msg.ScEmpty2                                           ] = ScTrashClick;
  ScCommands[Msg.ScEmptyAll1                                        ] = ScTrashDblClick;
  ScCommands[Msg.ScEmptyAll2                                        ] = ScTrashDblClick;
  ScCommands[Msg.ScEmptyPaper                                       ] = ScTubePaperClick;
  ScCommands[Msg.ScHelp                                             ] = function() {Speak(Msg.SsHelp);};

  ScCommands[Msg.ScLeave1                                           ] = function() {ScGlassWareClick(null, GLASS_CLICK_LEAVE);};
  ScCommands[Msg.ScLeave2    + Msg.ScBeaker                         ] = function() {ScGlassWareClick(Beaker, GLASS_CLICK_LEAVE);};
  ScCommands[Msg.ScLeave2    + Msg.ScCurcible                       ] = function() {ScGlassWareClick(Curcible, GLASS_CLICK_LEAVE);};
  ScCommands[Msg.ScLeave2    + Msg.ScDropper1                       ] = function() {ScGlassWareClick(Dropper, GLASS_CLICK_LEAVE);};
  ScCommands[Msg.ScLeave2    + Msg.ScDropper2                       ] = function() {ScGlassWareClick(Dropper, GLASS_CLICK_LEAVE);};
  ScCommands[Msg.ScLeave2    + Msg.ScLighter                        ] = function() {ScGlassWareClick(Lighter, GLASS_CLICK_LEAVE);};
  ScCommands[Msg.ScLeave2    + Msg.ScNichromeWire                   ] = function() {ScGlassWareClick(Nichrome, GLASS_CLICK_LEAVE);};
  ScCommands[Msg.ScLeave2    + Msg.ScStirrer                        ] = function() {ScGlassWareClick(Stirrer, GLASS_CLICK_LEAVE);};
  ScCommands[Msg.ScLeave2    + Msg.ScTestTube                       ] = function() {ScGlassWareClick(null     , GLASS_CLICK_LEAVE, SCGWCLICK_TESTTUBEONLY);};
  ScCommands[Msg.ScLeave2    + Msg.ScTestTube + Msg.ScNumber1       ] = function() {ScGlassWareClick(TestTube1, GLASS_CLICK_LEAVE);};
  ScCommands[Msg.ScLeave2    + Msg.ScTestTube + Msg.ScNumber2       ] = function() {ScGlassWareClick(TestTube2, GLASS_CLICK_LEAVE);};
  ScCommands[Msg.ScLeave2    + Msg.ScTestTube + Msg.ScNumber3       ] = function() {ScGlassWareClick(TestTube3, GLASS_CLICK_LEAVE);};
  ScCommands[Msg.ScLeave2    + Msg.ScTestTube + Msg.ScNumber4       ] = function() {ScGlassWareClick(TestTube4, GLASS_CLICK_LEAVE);};
  ScCommands[Msg.ScLeave2    + Msg.ScWatchGlass                     ] = function() {ScGlassWareClick(WatchGlass, GLASS_CLICK_LEAVE);};

  ScCommands[Msg.ScMenu1                                            ] = ScMenu;
  ScCommands[Msg.ScMenuAna1                                         ] = ScMenuAna;
  ScCommands[Msg.ScMenuAna2                                         ] = ScMenuAna;
  ScCommands[Msg.ScMenuMain                                         ] = ScMenu;
  ScCommands[Msg.ScMenuSet1                                         ] = ScMenuSet;
  ScCommands[Msg.ScMenuSet2                                         ] = ScMenuSet;
  ScCommands[Msg.ScNotUnderstand1                                   ] = ScNotUnderstand;
  ScCommands[Msg.ScNotUnderstand2                                   ] = ScNotUnderstand;
  ScCommands[Msg.ScNotUnderstand3                                   ] = ScNotUnderstand;

  ScCommands[Msg.ScOpen      + Msg.ScCentrifuge                     ] = function() {CentrifugeOpen(true);};
  ScCommands[Msg.ScOpen      + Msg.ScBunsenTap                      ] = function() {BunsenGas(true);};

  ScCommands[Msg.ScPut1      + Msg.ScInCentrifuge                   ] = function() {CentrifugePutTube(null);};
  ScCommands[Msg.ScPut1      + Msg.ScInWaterBath                    ] = ScBathClick;
  ScCommands[Msg.ScPut1      + Msg.ScOnHeater                       ] = ScHeaterClick;
  ScCommands[Msg.ScPut2      + Msg.ScInCentrifuge                   ] = function() {CentrifugePutTube(null);};
  ScCommands[Msg.ScPut2      + Msg.ScInWaterBath                    ] = ScBathClick;
  ScCommands[Msg.ScPut2      + Msg.ScOnHeater                       ] = ScHeaterClick;
  ScCommands[Msg.ScPut3      + Msg.ScInCentrifuge                   ] = function() {CentrifugePutTube(null);};
  ScCommands[Msg.ScPut3      + Msg.ScInWaterBath                    ] = ScBathClick;
  ScCommands[Msg.ScPut3      + Msg.ScOnHeater                       ] = ScHeaterClick;

  ScCommands[Msg.ScSmell1                                           ] = ScSmellClick;
  ScCommands[Msg.ScSmell2    + Msg.ScBeaker                         ] = function() {ScSmellClick(Beaker);};
  ScCommands[Msg.ScSmell2    + Msg.ScCurcible                       ] = function() {ScSmellClick(Curcible);};
  ScCommands[Msg.ScSmell2    + Msg.ScDropper1                       ] = function() {ScSmellClick(Dropper);};
  ScCommands[Msg.ScSmell2    + Msg.ScDropper2                       ] = function() {ScSmellClick(Dropper);};
  ScCommands[Msg.ScSmell2    + Msg.ScStirrer                        ] = function() {ScSmellClick(Stirrer);};
  ScCommands[Msg.ScSmell2    + Msg.ScTestTube                       ] = function() {ScSmellClick(TestTube);};
  ScCommands[Msg.ScSmell2    + Msg.ScTestTube + Msg.ScNumber1       ] = function() {ScSmellClick(TestTube1);};
  ScCommands[Msg.ScSmell2    + Msg.ScTestTube + Msg.ScNumber2       ] = function() {ScSmellClick(TestTube2);};
  ScCommands[Msg.ScSmell2    + Msg.ScTestTube + Msg.ScNumber3       ] = function() {ScSmellClick(TestTube3);};
  ScCommands[Msg.ScSmell2    + Msg.ScTestTube + Msg.ScNumber4       ] = function() {ScSmellClick(TestTube4);};
  ScCommands[Msg.ScSmell2    + Msg.ScWatchGlass                     ] = function() {ScSmellClick(WatchGlass);};


  ScCommands[Msg.ScStop      + Msg.ScCentrifuge                     ] = function() {CentrifugeTime(0, false);};

  ScCommands[Msg.ScSwitchOff + Msg.ScBunsen1                        ] = function() {BunsenGas(false);};
  ScCommands[Msg.ScSwitchOff + Msg.ScBunsen2                        ] = function() {BunsenGas(false);};
  ScCommands[Msg.ScSwitchOff + Msg.ScCentrifuge                     ] = function() {CentrifugePower(false);};
  ScCommands[Msg.ScSwitchOff + Msg.ScLight                          ] = function() {ScLight(false);};
  ScCommands[Msg.ScSwitchOff + Msg.ScTV                             ] = function() {Speak(Msg.SsSwitchOffTV); TvShowLog();};

  ScCommands[Msg.ScSwitchOn  + Msg.ScBunsen1                        ] = BunsenTurnOn;
  ScCommands[Msg.ScSwitchOn  + Msg.ScBunsen2                        ] = BunsenTurnOn;
  ScCommands[Msg.ScSwitchOn  + Msg.ScCentrifuge                     ] = function() {CentrifugePower(true);};
  ScCommands[Msg.ScSwitchOn  + Msg.ScLight                          ] = function() {ScLight(true);};
  ScCommands[Msg.ScSwitchOn  + Msg.ScTV                             ] = function() {Speak(Msg.SsSwitchOnTV); TvShowMenu();};

  ScCommands[Msg.ScTake      + Msg.ScBeaker                         ] = function() {ScGlassWareClick(Beaker, GLASS_CLICK_TAKE);};
  ScCommands[Msg.ScTake      + Msg.ScCurcible                       ] = function() {ScGlassWareClick(Curcible, GLASS_CLICK_TAKE);};
  ScCommands[Msg.ScTake      + Msg.ScDropper1                       ] = function() {ScGlassWareClick(Dropper, GLASS_CLICK_TAKE);};
  ScCommands[Msg.ScTake      + Msg.ScDropper2                       ] = function() {ScGlassWareClick(Dropper, GLASS_CLICK_TAKE);};
  ScCommands[Msg.ScTake      + Msg.ScLighter                        ] = function() {ScGlassWareClick(Lighter, GLASS_CLICK_TAKE);};
  ScCommands[Msg.ScTake      + Msg.ScNichromeWire                   ] = function() {ScGlassWareClick(Nichrome, GLASS_CLICK_TAKE);};
  ScCommands[Msg.ScTake      + Msg.ScStirrer                        ] = function() {ScGlassWareClick(Stirrer, GLASS_CLICK_TAKE);};
  ScCommands[Msg.ScTake      + Msg.ScTestTube                       ] = function() {ScGlassWareClick(TestTube1, GLASS_CLICK_TAKE);};
  ScCommands[Msg.ScTake      + Msg.ScTestTube + Msg.ScNumber1       ] = function() {ScGlassWareClick(TestTube1, GLASS_CLICK_TAKE);};
  ScCommands[Msg.ScTake      + Msg.ScTestTube + Msg.ScNumber2       ] = function() {ScGlassWareClick(TestTube2, GLASS_CLICK_TAKE);};
  ScCommands[Msg.ScTake      + Msg.ScTestTube + Msg.ScNumber3       ] = function() {ScGlassWareClick(TestTube3, GLASS_CLICK_TAKE);};
  ScCommands[Msg.ScTake      + Msg.ScTestTube + Msg.ScNumber4       ] = function() {ScGlassWareClick(TestTube4, GLASS_CLICK_TAKE);};
  ScCommands[Msg.ScTake      + Msg.ScWatchGlass                     ] = function() {ScGlassWareClick(WatchGlass, GLASS_CLICK_TAKE);};
//ScCommands[Msg.ScUse       + Msg.ScSpatula                        ] = function() {Scene.querySelector('#Spatula').emit('click');};

  ScCommands[Msg.ScTurn      + Msg.ScBunsenRing                     ] = function() {BunsenOxidant(!Bunsen.Ox);};

  ScCommands[Msg.ScUnlock    + Msg.ScCentrifuge                     ] = CentrifugeUnlock;

  ScCommands[Msg.ScUse       + Msg.ScBeaker                         ] = function() {ScGlassWareClick(Beaker, GLASS_CLICK_USE);};
  ScCommands[Msg.ScUse       + Msg.ScCurcible                       ] = function() {ScGlassWareClick(Curcible, GLASS_CLICK_USE);};
  ScCommands[Msg.ScUse       + Msg.ScDropper1                       ] = ScDropperUse;
  ScCommands[Msg.ScUse       + Msg.ScDropper2                       ] = ScDropperUse;
  ScCommands[Msg.ScUseLighterBunsen1                                ] = function() {ScLighterClick(Bunsen);};
  ScCommands[Msg.ScUseLighterBunsen2                                ] = function() {ScLighterClick(Bunsen);};
  ScCommands[Msg.ScUseLighterCurcible                               ] = function() {ScLighterClick(Curcible);};
  ScCommands[Msg.ScUseNichromeBunsen1                               ] = function() {ScNichromeClick(Bunsen);};
  ScCommands[Msg.ScUseNichromeBunsen2                               ] = function() {ScNichromeClick(Bunsen);};
  ScCommands[Msg.ScUseNichromeTube                                  ] = ScNichromeClick;
  ScCommands[Msg.ScUseNichromeTube1                                 ] = function() {ScNichromeClick(TestTube1);};
  ScCommands[Msg.ScUseNichromeTube2                                 ] = function() {ScNichromeClick(TestTube2);};
  ScCommands[Msg.ScUseNichromeTube3                                 ] = function() {ScNichromeClick(TestTube3);};
  ScCommands[Msg.ScUseNichromeTube4                                 ] = function() {ScNichromeClick(TestTube4);};

  ScCommands[Msg.ScUse       + Msg.ScNichromeWire                   ] = ScNichromeClick;
  ScCommands[Msg.ScUse       + Msg.ScSpatula                        ] = ScSpatulaClick;
  ScCommands[Msg.ScUse       + Msg.ScStirrer                        ] = function() {ScGlassWareClick(Stirrer, GLASS_CLICK_USE);};
  ScCommands[Msg.ScUse       + Msg.ScWashBottle                     ] = ScWashBottleClick;
  ScCommands[Msg.ScUse       + Msg.ScWatchGlass                     ] = function() {ScGlassWareClick(WatchGlass, GLASS_CLICK_USE);};

  annyang.addCommands(ScCommands);
} else {
  if (DEBUG)
    console.log(LOG_PROMPT, "Speech recognition not supported");
  Prefs.SpeechRecActive = false;
  Prefs.SpeechRecAvail  = false;
}


/**** Show window event ****/

function ShowEvent()
{

  /**** Voice synthesis ****/

  if (Voice) {
    var Timer = setInterval(function() {
      var Voices = Voice.getVoices();
      var Retry  = 0;

      if (Voices.length) {
        var VoiceLang1, VoiceLang2;
        if (Lang === 'it') {
          VoiceLang1 = 'it-IT';
          VoiceLang2 = 'it_IT';
        } else {
          VoiceLang1 = 'en-GB';
          VoiceLang2 = 'en_GB';
        }
        clearInterval(Timer);

        for(var i = 0; i < Voices.length; ++i) {
          if ((Voices[i].lang === VoiceLang1) ||
              (Voices[i].lang === VoiceLang2)) {
            VoiceHandle = Voices[i];

            /**** Temporary fix for Chrome 130 ****/

/*
            if ((IsChrome) && (VoiceHandle.localService))
              continue;
*/

            if ((!IsEdge) ||
                (VoiceHandle.name.indexOf('Elsa') != -1))
              break;
          }
        } /* End of for (i) */

        if (!VoiceHandle) {
          if (DEBUG)
            console.log(LOG_PROMPT, VoiceLang1 + ' voice not available');
          Prefs.VoiceActive = false;
          Prefs.VoiceAvail  = false;
        } else if (DEBUG) {
          console.log(LOG_PROMPT, 'Selected voice synthesis', Voices[i].name + ' (' + Voices[i].lang + ')');
        }
      } else {
        if (++Retry > 20) {
          if (DEBUG)
            console.log(LOG_PROMPT, 'Voices not available');
          Prefs.VoiceActive = false;
          Prefs.VoiceAvail  = false;
          clearInterval(Timer);
        }
      }
    }, 200);
  } else {
    if (typeof responsiveVoice !== 'undefined') {
      if (DEBUG)
        console.log(LOG_PROMPT, 'Using ResponsiveVoice');

      if (Lang == 'it')
        responsiveVoice.setDefaultRate(1.05);

      VoiceType = VOICE_TYPE_RESPONSIVE;
    } else if ((IniGetBool('TTS', 'Avail')) &&
               (ServerIni.TTS.Type.toUpperCase() === 'PICO')) {
      if (DEBUG)
        console.log(LOG_PROMPT, 'Using Pico TTS server');

      if (ServerIni.TTS.URL.substring(0, 4) == "http") {
        PicoTtsURI = ServerIni.TTS.URL;
      } else {
        PicoTtsURI = document.location.href;
        PicoTtsURI = PicoTtsURI.substring(0, PicoTtsURI.lastIndexOf('/')) + ServerIni.TTS.URL;
      }
      PicoTtsURI += '?lang=' + Msg.PicoTtsLanguage + '&text=';
      VoiceType   = VOICE_TYPE_PICOSERVER;
    } else {
      if (DEBUG)
        console.log(LOG_PROMPT, 'Voice synthesis not supported');

      Prefs.VoiceActive = false;
      Prefs.VoiceAvail  = false;
      VoiceType         = VOICE_TYPE_NONE;
    }
  }
}


/* https://flaviocopes.com/speech-synthesis-api/ */

/**** Scene listener ****/

AFRAME.registerComponent('scene-listener', {
  init: function () {
    Scene                = document.querySelector('a-scene');

    Asset                = Scene.querySelector('a-assets');
    Bunsen.Handle        = Scene.querySelector('#Bunsen');
    Bunsen.FlameOxHandle = Bunsen.Handle.querySelector('#FlameOx');
    Camera               = Scene.querySelector('#Camera');
    CameraRig            = Scene.querySelector('#CameraRig');
    Centrifuge.Handle    = Scene.querySelector('#Centrifuge');
    Centrifuge.hCover    = Centrifuge.Handle.querySelector('#Cover');
    Centrifuge.hLedOpen  = Centrifuge.Handle.querySelector('#LedOpen');
    Centrifuge.hLedPower = Centrifuge.Handle.querySelector('#LedPower');
    Centrifuge.hPotSpeed = Centrifuge.Handle.querySelector('#PotSpeed');
    Centrifuge.hPotTime  = Centrifuge.Handle.querySelector('#PotTime');
    Cursor               = Scene.querySelector('#Cursor');
    DlgAbout             = Scene.querySelector('#DlgAbout');
    DlgAnaCode           = Scene.querySelector('#DlgAnaCode');
    DlgMenu              = Scene.querySelector('#DlgMenu');
    DlgMenuAna           = Scene.querySelector('#DlgMenuAna');
    DlgMenuSet           = Scene.querySelector('#DlgMenuSet');
    Floor                = Scene.querySelector('#Floor');
    Gui                  = Scene.querySelector('#Gui');
    Heater.Handle        = Scene.querySelector('#Heater');
    Lighter.Handle       = Scene.querySelector('#Lighter');
    Rack                 = Scene.querySelector('#Rack');
    Spatula              = Scene.querySelector('#Spatula');
    Shadow               = Scene.querySelector('#Shadow');
    Trash                = Scene.querySelector('#Trash');
    Tv.Handle            = Scene.querySelector('#TV');
    Tv.Controls          = Tv.Handle.querySelector('#TvControls');
    Tv.Counter           = Tv.Controls.querySelector('#TvCounter');
    Tv.Cursor            = Tv.Controls.querySelector('#TvCursor');
    Tv.Log               = Tv.Handle.querySelector('#Log');
    Tv.Menu              = Tv.Handle.querySelector('#Menu');
    Tv.Panel             = Tv.Controls.querySelector('#Panel');
    Tv.Player            = Tv.Handle.querySelector('#Player');
    Tv.Video             = Asset.querySelector('#TvVideo');
    Workbench            = Scene.querySelector('#WorkBench' );

    /**** Get the tube handles ****/

    for(var i = 0; i < 6; i++)
      Centrifuge.hTube[i] = Centrifuge.Handle.querySelector('#Tube' + (i + 1));

    /**** Update the glassware ****/

    for(i = 0; i < GlassWare.length; ++i) {
      var Glass    = GlassWare[i];
      Glass.Handle = Scene.querySelector('#' + Glass.Name);
      var Pos      = Glass.Handle.getAttribute('position');
      Glass.PosX   = Pos.x;
      Glass.PosY   = Pos.y;
      Glass.PosZ   = Pos.z;
    } /* End of for (i) */
    Heater.WhatGlass = WaterBath;
    WaterBath.Dock   = Heater.Handle;

    /**** Remove the shadow casting ****/

    var Objs = Scene.querySelectorAll('.centnoshadow');
    for(var i = 0; i < Objs.length; i++)
      DisableShadow(Objs[i], false, true);

    /**** Translate the labels ****/

    SetTextButton(DlgAbout   , '#BT_Ok'         , Msg.BtOk);
    SetTextLabel(DlgAbout    , '#LBL_Copyright' , '\u00A9' + LABSIM_COPYRIGHT + ', Alessandro Pedretti');
    SetTextLabel(DlgAbout    , '#LBL_Rights'    , Msg.DlgAboutRights);
    SetTextLabel(DlgAbout    , '#LBL_SubTitle'  , Msg.DlgAboutSubTitle);
    SetTextLabel(DlgAbout    , '#LBL_Version'   , 'LabSim ' + LABSIM_VER);

    SetTextButton(DlgAnaCode , '#BT_CodeOk'     , Msg.DlgAnaCodeConfirm);
    SetTextLabel(DlgAnaCode  , '#LBL_Title'     , Msg.DlgAnaCodeTitle);

    SetTextButton(DlgMenu    , '#BT_About'      , Msg.DlgMenuAbout);
    SetTextButton(DlgMenu    , '#BT_Restart'    , Msg.DlgMenuRestart);
    SetTextButton(DlgMenu    , '#BT_SelAna'     , Msg.DlgMenuAna);
    SetTextButton(DlgMenu    , '#BT_Settings'   , Msg.DlgMenuSetTitle);
    SetTextLabel(DlgMenu     , '#LBL_Title'     , Msg.DlgMenuTitle);

    SetTextLabel(DlgMenuAna  , '#LBL_Title'     , Msg.DlgMenuAnaTitle);

    SetTextLabel(DlgMenuSet  , '#LBL_Title'     , Msg.DlgMenuSetTitle);
    SetTextToggle(DlgMenuSet , '#TO_Detail'     , Msg.DlgMenuSetDetail);
    SetTextToggle(DlgMenuSet , '#TO_Sound'      , Msg.DlgMenuSetSound);
    SetTextToggle(DlgMenuSet , '#TO_SpeechRec'  , Msg.DlgMenuSetSpeechRec);
    SetTextToggle(DlgMenuSet , '#TO_SpeechSynth', Msg.DlgMenuSetSpeechSynth);

    SetCheckToggle(DlgMenuSet, '#TO_Detail'     , Prefs.Detail);
    SetCheckToggle(DlgMenuSet, '#TO_Sound'      , Prefs.SoundActive);
    SetCheckToggle(DlgMenuSet, '#TO_SpeechRec'  , Prefs.SpeechRecActive);
    SetCheckToggle(DlgMenuSet, '#TO_SpeechSynth', Prefs.VoiceActive);

    LogPrint(Msg.LogWelcome + "\n");

    /********************
    **** E V E N T S ****
    ********************/

    /**** Enter VR event ****/

    this.el.addEventListener('enter-vr',function() {
      if (Device & DEVICE_TYPE_VR) {
/*
        Cursor.setAttribute('cursor', 'fuseTimeout: 500; ray-origin: entity');
        Cursor.setAttribute('raycaster', 'direction: 0 0 -1; origin: 0 0 0');
        Cursor.setAttribute('visible', 'true');
*/
        var Pos = CameraRig.getAttribute('position');
        CameraRig.setAttribute('position', Pos.x + ' ' + (Pos.y - CameraRigOffsetY) + ' ' + Pos.z);
        CameraRigOffsetY = CAMERA_RIG_OFFY_VR;
        VrMode          = true;
      }
//      annyang.pause();
    });

    /**** Exit VR event ****/

    this.el.addEventListener('exit-vr',function() {
      if (Device & DEVICE_TYPE_VR) {
/*
        Cursor.setAttribute('cursor', 'fuseTimeout: 0; ray-origin: mouse');
        Cursor.setAttribute('visible', 'false');
*/
        CameraRigOffsetY = CAMERA_RIG_OFFY;
        VrMode           = false;
        var Pos = CameraRig.getAttribute('position');
        CameraRig.setAttribute('position', Pos.x + ' ' + (Pos.y + CameraRigOffsetY) + ' ' + Pos.z)
      }
//      annyang.resume();
    });

    /**** Key up event ****/

    window.addEventListener('keyup', function(Evt) {
      if (DEBUG)
        console.log(LOG_PROMPT, "Key up event", Evt.keyCode, Evt.ctrlKey);

      switch(Evt.keyCode) {
      case 27: /* ESC */
        DlgClose(ShownDlgName);
        break;

      case 32: /* SPC */
      case 77: /* m   */
        ScMenu();
        break;
      } /* End of switch */

    }, {passive: true});

    /**** Mouse down event ****/

    this.el.addEventListener('mousedown', function(Evt) {
      if (!RightMbPressed(Evt)) return;
      MouseTrans.x = Evt.clientX;
      MouseTrans.y = Evt.clientY;

      var Pos = Camera.getAttribute('position');
      MouseTrans.CameraPosX = Pos.x;
      MouseTrans.CameraPosY = Pos.y;
    });

    /**** Mouse move event ****/

    this.el.addEventListener('mousemove', function(Evt) {
      if (!RightMbPressed(Evt)) return;

      var x = (MouseTrans.CameraPosX - (Evt.clientX - MouseTrans.x) / (Scene.clientWidth  * Zoom * 0.5));
      var y = (MouseTrans.CameraPosY + (Evt.clientY - MouseTrans.y) / (Scene.clientHeight * Zoom * 0.5));

      if (x < CAMERA_MIN_X) x = CAMERA_MIN_X;
      else if (x > CAMERA_MAX_X) x = CAMERA_MAX_X;

      if (y < CAMERA_MIN_Y) y = CAMERA_MIN_Y;
      else if (y > CAMERA_MAX_Y) y = CAMERA_MAX_Y;

      Camera.setAttribute('position', x + ' ' + y + ' 0 ');
    }, {passive: true});

    /**** Mouse wheel event ****/

    this.el.addEventListener('wheel', function() {
      Zoom  = Math.min(Math.max(Zoom + Math.sign(event.wheelDelta) * 0.1, 0.8), 6);
      Camera.setAttribute('camera', 'zoom: ' + Zoom);
    }, {passive: true});

    /**** Video play end ****/

    Tv.Video.addEventListener('ended', function() {
      switch(Tv.PlayMode) {
      case TV_PLAYMODE_ALL:
        if (Tv.VideoCur < Tv.VideoMax) {
          TvPlayVideo(++Tv.VideoCur);
          break;
        }

      case TV_PLAYMODE_SINGLE:
        RaycastableObj('.tvctrlray', false);
        VoiceRecEnable(true);
        TvShowMenu();
        break;

      case TV_PLAYMODE_LOOP:
        TvPlayVideo(Tv.VideoCur);
        break;
      } /* End of switch */
    });

    /**** Video time update ****/

    Tv.Video.addEventListener('timeupdate', function() {
      if (Tv.Panel.getAttribute('visible'))
        TvProgBarMove(Tv.Video.currentTime);
    });


    /***************************
    **** M A I N    C O D E ****
    ***************************/


    /**** Initialize TV ****/

    TvInit();

    /**** Set the details ****/

    SetDetail(Prefs.Detail);

    /**** Open the database ****/

    SetTextSplash(Msg.LoadingDb);
    LoadBinaryFile('db/LabSim.sqlite?ver=' + LABSIM_VER, function(data) {
      initSqlJs({locateFile: () => 'dist/sql-wasm.wasm'}).then(function(SQL) {
        hDb = new SQL.Database(data);

        /**** Fill the Analytes ****/

        FillAnalytes();

        /**** Fill the reagents ****/

        FillReagents();

        /**** Detect the device ****/

        Device = DetectDevice();

        /*** Show VR buttons ****/

        if ((Device & DEVICE_TYPE_DESKTOP) || (Device & DEVICE_TYPE_VR))
          Scene.setAttribute('vr-mode-ui', 'enabled: true');

        /**** Show the scene ****/

        document.getElementById("DivSplash").style.display = "none";
        Scene.setAttribute('visible', 'true');

        HeatingThread();
        EnableSound(Prefs.SoundActive);

        /**** Show the About dialog ****/

        setTimeout(function(){
          DisableShadowAll();

          /**** Show the copyright ****/

          DlgShow('DlgAbout');}, 500);
      });
    });

  }
});


/**** Water bath listener ****/

AFRAME.registerComponent('bath-listener', {
  init: function () {

    /**** Animation end event ****/

    this.el.addEventListener('animationcomplete', function(Evt) {
      if (Evt.detail.name == 'animation__L') {
        if (WaterBath.Dock === Heater.Handle)
          Heater.WhatGlass = WaterBath;

        PlaySound(WaterBath.Handle.querySelector('#SND_Tick'));
      }
    });

    /**** Click event ****/

    this.el.addEventListener('click', function() {
      if (MbClickID !== MOUSE_BUTTON_LEFT) return;
      ScBathClick();
    });
  }
});


/**** Book listener ****/

AFRAME.registerComponent('book-listener', {
  init: function () {

    /**** Click event ****/

    this.el.addEventListener('click', function() {
      if (MbClickID !== MOUSE_BUTTON_LEFT) return;
      ScMenu();
    });
  }
});


/**** Bunsen listener ****/

AFRAME.registerComponent('bunsen-listener', {
  init: function () {

    /**** Click event ****/

    this.el.addEventListener('click', function() {
      if (MbClickID !== MOUSE_BUTTON_LEFT) return;
      switch(this.id) {
      case 'BunsenBody':
        if (GlassReady.Obj === Lighter)
          ScLighterClick(Bunsen);
        else
          ScNichromeClick(Bunsen);
        break;

      case 'Tap':
        BunsenGas(!Bunsen.On);
        break;

      case 'Ring':
        BunsenOxidant(!Bunsen.Ox);
        break;
      } /* End of switch */
    });
  }
});


/**** Centrifuge listener ****/

AFRAME.registerComponent('centrifuge-listener', {
  init: function () {

    /**** Animation end event ****/

    this.el.addEventListener('animationcomplete', function(Evt) {
      if (Evt.detail.name === 'animation__Close') {
        setTimeout(function () {
      PlaySound(Centrifuge.hLedOpen.querySelector('#SND_Clack'));
      CentrifugeTime(Centrifuge.Time);
        }, 200);
      }
    });

    /**** Click event ****/

    this.el.addEventListener('click', function() {
      if (MbClickID !== MOUSE_BUTTON_LEFT) return;

      switch(this) {
      case Centrifuge.hCover:
        CentrifugeOpen(!Centrifuge.Open);
        break;

      case Centrifuge.hLedOpen:
        CentrifugeUnlock();
        break;

      case Centrifuge.hLedPower:
        CentrifugePower(!Centrifuge.On);
        break;

      case Centrifuge.hPotSpeed:
        CentrifugeSpeed(Centrifuge.Speed + 1);
        break;

      case Centrifuge.hPotTime:
        CentrifugeTime(Centrifuge.Time + 1);
        break;

      case Centrifuge.hTube[0]:
      case Centrifuge.hTube[1]:
      case Centrifuge.hTube[2]:
      case Centrifuge.hTube[3]:
      case Centrifuge.hTube[4]:
      case Centrifuge.hTube[5]:
        CentrifugePutTube(this);
        break;
      } /* End of switch */
    });

    /**** Stop sound event ****/

    this.el.addEventListener('sound-ended', function() {
      switch(this.id) {
      case 'SND_CentStart':
        PlaySound(Centrifuge.Handle.querySelector('#SND_CentRun'));
        break;

      case 'SND_CentStop':
        CentrifugeStopEvent();

        if (Centrifuge.On)
          PlaySound(Centrifuge.Handle.querySelector('#SND_Beep'));
        break;
      } /* End of switch */

    });
  }
});


/**** Dropper listener ****/

AFRAME.registerComponent('dropper-listener', {
  init: function () {

    /**** Animation begin event ****/

    this.el.addEventListener('animationbegin', function(Evt) {
      switch(Evt.detail.name) {
      case 'animation__1':
        PlaySound(this.querySelector('#SND_Pipette1'));
        break;

      case 'animation__1d': // Drain dropper
        PlayDrainSound(this, GlassTarget);
        if (GlassTarget.Type == GLASS_TYPE_TESTTUBE) {
          switch(GlassTarget.PaperID) {
          case REA_ID_PAPER:
            ColorPaperSet(GlassTarget, Dropper.LiqColor);
            GlassTarget.PaperReaID = Dropper.ReaID[0];
            GlassTarget.PaperWater = true;
            return;

           case REA_ID_UNIVIND:
             ColorPaperSet(GlassTarget, ColorFromPh(7));
             GlassTarget.PaperWater = true;
             return;
          } /* End of switch */
        }

        /**** Transfer the liquid ****/

        LiquidMove(GlassTarget, Dropper);

        /**** Suspend the solid ****/

        if ((GlassTarget.Water) && (GlassPrecipitate(GlassTarget)) &&
            (GlassTarget.LiqAdspect !== ADSPECT_LIQUID_SUSP)) {
          GlassTarget.LiqAdspect = ADSPECT_LIQUID_SUSP;
          LiquidUpdate(GlassTarget);
        }
        break;

      case 'animation__2': // Load dropper
        PlaySound(this.querySelector('#SND_Pipette2'));
        LiquidMove(Dropper, GlassTarget);
        break;
      } /* End of switch */
    });
  }
});


/**** Glassware listener ****/

AFRAME.registerComponent('glassware-listener', {
  init: function () {

    /**** Animation begin event ****/

    this.el.addEventListener('animationbegin', function(Evt) {
      if (Evt.detail.name == 'animation__FlameTestE') {
        BunsenColor();
      }
    });

    /**** Animation end event ****/

    this.el.addEventListener('animationcomplete', function(Evt) {
      switch(Evt.detail.name) {
      case 'animation__DockCent':
        AnimRunning          = false;
        GlassReady.Obj.Dock  = Centrifuge.Handle;
        GlassReady.LeaveY   -= 1.05;
        ScGlassWareClick(GlassReady, GLASS_CLICK_LEAVE);
        break;

      case 'animation__DockHeater':
        AnimRunning          = false;
        GlassReady.Obj.Dock  = Heater.Handle;
        GlassReady.LeaveY   += 0.09;
        Heater.WhatGlass     = GlassReady.Obj;
        ScGlassWareClick(GlassReady, GLASS_CLICK_LEAVE);
        break;

      case 'animation__DockRack':
        AnimRunning          = false;
        GlassReady.Obj.Dock  = Rack;
        GlassReady.LeaveY   += 0.5;
        ScGlassWareClick(GlassReady, GLASS_CLICK_LEAVE);
        break;

      case 'animation__FlameTestB':
        if ((Bunsen.Burning) && (Bunsen.Ox)) {
          BunsenColor(ColorFlameByMolID(Nichrome.AnaID));
          if (Nichrome.CleanCount) {
            if (!(--Nichrome.CleanCount))
              Nichrome.AnaID  = 0;
          }
          Nichrome.ReaID  = [];
          Nichrome.ReaNum = 0;
        }
        break;

      case 'animation__Ign':
        if (GlassTarget.Type === GLASS_TYPE_BUNSEN) {
          if (Bunsen.Timer <= EXPLOSION_TIME) BunsenBurn(true);
        } else if ((GlassTarget.Type === GLASS_TYPE_CURCIBLE) && (!GlassTarget.Water) &&
                   (GlassTarget.ReaNum)) {
          var ReaID = GlassTarget.ReaID.indexOf(REA_ID_CH3OH);
          if ((ReaID !== -1) && (GlassTarget.ReaQty[ReaID] >= REA_QTY_CH3OH_IGN)) {
            setTimeout(function () {
              var Flame = GlassTarget.Handle.querySelector('#Flame');
              Flame.setAttribute('particle-system', 'color: ' + ColorFlameByID(COLOR_ID_COLORLESS));
              Flame.setAttribute('particle-system', 'enabled: true');
              DisableShadowAll();
              GlassTarget.Burning = true;
              Reaction(GlassTarget);

              var Timer = setInterval(function() {
                --Curcible.LiqLvl;
                LiquidUpdate(Curcible);
                if ((--GlassTarget.ReaQty[ReaID]) === 0) {
                  Flame.setAttribute('particle-system', 'enabled: false');
                  DisableShadowAll();
                  Curcible.Burning = false;
                  ReaRemove(Curcible, ReaID);
                  clearInterval(Timer);
                }
              }, 10000);
            }, 1000);
          }
        }
        break;

      case 'animation__L':
        AnimRunning = false;
        if ((!GlassReady.Handle) || (this != GlassReady.Handle))
          PlaySound(this.querySelector('#SND_Tick'));
        break;
      } /* End of switch */
    });

    /**** Click event ****/

    this.el.addEventListener('click', function () {
      if (MbClickID !== MOUSE_BUTTON_LEFT) return;
      ScGlassWareClick(GlassGetByHandle(this), GLASS_CLICK_TOGGLE);
    });
  }
});


/**** Heater listener ****/

AFRAME.registerComponent('heater-listener', {
  init: function () {

    /**** Click event ****/

    this.el.addEventListener('click', function() {
      if (MbClickID !== MOUSE_BUTTON_LEFT) return;
      ScHeaterClick();
    });
  }
});


/**** Lighter button listener ****/

AFRAME.registerComponent('lighterbutton-listener', {
  init: function () {

    /**** Animation end event ****/

    this.el.addEventListener('animationcomplete', function(Evt) {
      switch(Evt.detail.name) {
      case 'animation__1':
        PlaySound(Lighter.Handle.querySelector('#SND_Lighter'));
        if ((Bunsen.On) && (!Bunsen.Burning) && (Bunsen.Timer > EXPLOSION_TIME)) {
          Explosion();
          return;
        }
        Lighter.Handle.querySelector('#Flame').setAttribute('particle-system', 'enabled: true');
        DisableShadowAll();
        break;

      case 'animation__2':
        Lighter.Handle.querySelector('#Flame').setAttribute('particle-system', 'enabled: false');
        DisableShadowAll();
        break;
      } /* End of switch */
    });
  }
});


/**** Watch the mouse button ****/

document.addEventListener("mousedown", function(Evt) {
  if ("button" in Evt) MbClickID = Evt.button;
  else MbClickID = MOUSE_BUTTON_LEFT;
});


/**** Camera position listener ****/

AFRAME.registerComponent('position-listener', {
  init: function () {

    /**** Click event ****/

    this.el.addEventListener('click', function() {
      if (MbClickID !== MOUSE_BUTTON_LEFT) return;
      GotoFootprint(this.id);
    });
  }
});


/**** Reagent listener ****/

AFRAME.registerComponent('rea-listener', {
  init: function () {

    /**** Animation end event ****/

    this.el.addEventListener('movingended', function() {
      PlaySound(this.querySelector('#SND_ReaLiquidTok'));
    });

    /**** Click event ****/

    this.el.addEventListener('click', function() {
      if (MbClickID !== MOUSE_BUTTON_LEFT) return;
      ScReagentClick(this);
    });
  }
});


/**** Reagent pipette listener ****/

AFRAME.registerComponent('reapipette-listener', {
  init: function () {

    /**** Animation end event ****/

    this.el.addEventListener('animationcomplete', function(Evt) {
      if (Evt.detail.name == 'animation__L')
        AnimRunning = false;
    });
  }
});


/**** Reagent rubber listener ****/

AFRAME.registerComponent('rearubber-listener', {
  init: function () {

    /**** Animation begin event ****/

    this.el.addEventListener('animationbegin', function(Evt) {

      switch(Evt.detail.name) {
      case 'animation__1':
        PlaySound(this.querySelector('#SND_Pipette1'));
        break;

      case 'animation__2':
        PlaySound(this.querySelector('#SND_Pipette2'));
        break;

      case 'animation__6':
        PlayDrainSound(this);
        if ((GlassReady.Obj.Type == GLASS_TYPE_TESTTUBE) && (GlassReady.Obj.PaperID))
          ColorPaperSet(GlassReady.Obj, GlassReady.Obj.PaperColor);
        break;
      } /* End of switch */
    });

    /**** Click event ****/

    this.el.addEventListener('click', function(Evt) {
      if (MbClickID !== MOUSE_BUTTON_LEFT) return;
      ScReaPipetteClick(this);
      Evt.stopPropagation();
    });
  }
});


/**** Smell photo frame listener ****/

AFRAME.registerComponent('smell-listener', {
  init: function () {

    /**** Click event ****/

    this.el.addEventListener('click', function() {
      if (MbClickID !== MOUSE_BUTTON_LEFT) return;
      ScSmellClick();
    });
  }
});


/**** Spatula listener ****/

AFRAME.registerComponent('spatula-listener', {
  init: function () {

    /**** Animation end event ****/

    this.el.addEventListener('animationcomplete', function(Evt) {
      switch(Evt.detail.name) {
      case 'animation__4':
        var Solid = Spatula.querySelector(Adspect2Id[ReaReady.Adspect]);
        if (Solid) {
          Solid.setAttribute('visible', 'true');
          if (ReaReady.Adspect === ADSPECT_POWDER)
            ColorSet(Solid, GlassReady.SolidColor);
          else
            ColorSet(Solid, ReaReady.Color);
        }
        break;

      case 'animation__7':
        var AdspectId = Adspect2Id[ReaReady.Adspect];
        var Solid     = GlassReady.Handle.querySelector(AdspectId);
        if (Solid) {
          if (ReaReady.Adspect === ADSPECT_PAPER) {
            ColorPaperSet(GlassReady.Obj, ReaReady.Color);

            if (GlassReady.Obj.Type === GLASS_TYPE_TESTTUBE)
              Solid.object3D.position.set(0, TUBE_PAPER_POS_Y, 0);
          } else ColorSet(Solid, ReaReady.Color);
          Solid.setAttribute('visible', 'true');
        }

        Solid = Spatula.querySelector(AdspectId);
        if (Solid) Solid.setAttribute('visible', 'false');

        Reaction(GlassReady.Obj);
        break;

      case 'animation__L':
        AnimRunning = false;
        PlaySound(this.querySelector('#SND_Tick'));
        break;
      } /* End of switch */

    });

    /**** Click event ****/

    this.el.addEventListener('click', function() {
      if (MbClickID !== MOUSE_BUTTON_LEFT) return;
      ScSpatulaClick();
    });
  }
});


/**** Test tube paper listener ****/

AFRAME.registerComponent('tubepaper-listener', {
  init: function () {

    /**** Animation end event ****/

    this.el.addEventListener('animationcomplete', function(Evt) {
      switch(Evt.detail.name) {
      case 'animation__L':
        for(var Tube of TestTube) {
          if (Tube.Handle.querySelector('#Solid-Paper') === this) {
            GlassEmpty(Tube, EMPTY_PAPER);
            break;
          }
        } /* End of for (i) */
        AnimRunning = false;
        break;
      } /* End of switch */
    });

    /**** Click event ****/

    this.el.addEventListener('click', function(Evt) {
      if (MbClickID !== MOUSE_BUTTON_LEFT) return;

      for(var Tube of TestTube) {
        if (Tube.Handle.querySelector('#Solid-Paper') === this) {
          ScTubePaperClick(Tube);
          break;
        }
      } /* End of for (i) */
      Evt.stopPropagation();
    });
  }
});


/**** TV listener ****/

/*
 * https://developer.mozilla.org/en-US/docs/Web/Guide/Audio_and_video_delivery/cross_browser_video_player
 */

AFRAME.registerComponent('tv-listener', {
  init: function () {

    /**** Click event ****/

    this.el.addEventListener('click', function(Evt) {
      if (MbClickID !== MOUSE_BUTTON_LEFT) return;

      if (DEBUG)
        console.log(LOG_PROMPT, 'TV click', Tv.Mode, this.id);

      switch(Tv.Mode) {
      case TV_MODE_LOG:
        VoiceRecEnable(true);
        TvShowMenu();
        break;

      case TV_MODE_PLAYER:
        switch(this.id) {
        case 'TvNext':
          if (Tv.VideoCur < Tv.VideoMax)
            TvPlayVideo(++Tv.VideoCur);
          break;

        case 'TvPause':
          if (Tv.Video.paused) {
            VoiceRecEnable(false);
            Tv.Video.play();
          } else {
            Tv.Video.pause();
            VoiceRecEnable(true);
          }
          break;

        case 'TvPlay':
          VoiceRecEnable(false);
          Tv.Video.play();
          break;

        case 'TvPlayMode':
          if (Tv.PlayMode == TV_PLAYMODE_SINGLE) Tv.PlayMode = 0;
          else ++Tv.PlayMode;
          Tv.Controls.querySelector('#TvPlayMode').setAttribute('src', '#TvBtPmode' + Tv.PlayMode);
          break;

        case 'TvPrev':
          if (Tv.VideoCur > 0)
            TvPlayVideo(--Tv.VideoCur);
          break;

        case 'TvProgBar':
          var Pos = (Tv.Video.duration * (this.object3D.worldToLocal(Evt.detail.intersection.point).x - TV_PROGBAR_OFFSET_X)) / TV_PROGBAR_WIDTH;

          if (DEBUG)
            console.log(LOG_PROMPT, "Move video to", Pos);

          Tv.Video.currentTime = Pos;
          TvProgBarMove(Pos);
          break;

        case 'TvStop':
          Tv.Video.pause();
          Tv.Video.currentTime = 0;
          RaycastableObj('.tvctrlray', false);
          VoiceRecEnable(true);
          TvShowMenu();
          break;

        default:
          if (!Tv.Panel.getAttribute('visible')) {
            if (Tv.Video.paused) {
              VoiceRecEnable(false);
              Tv.Video.play();
            } else {
              Tv.Video.pause();
              VoiceRecEnable(true);
            }
          }
        } /* End of switch */
        break;
      } /* End of switch */

    });
  }
});


/**** Trash beaker listener ****/

AFRAME.registerComponent('trash-listener', {
  init: function () {

    /**** Click event ****/

    this.el.addEventListener('click', function(e) {
      if (MbClickID !== MOUSE_BUTTON_LEFT) return;
      DoubleClick(ScTrashClick, ScTrashDblClick);
    });
  }
});


/**** Wash bottle listener ****/

AFRAME.registerComponent('washbottle-listener', {
  init: function () {

    /**** Animation end event ****/

    this.el.addEventListener('animationcomplete', function(Evt) {
      switch(Evt.detail.name) {
      case 'animation__4':
        PlayDrainSound(this);
        if (GlassReady.Obj.Type == GLASS_TYPE_TESTTUBE) {
          switch(GlassReady.Obj.PaperID) {
          case REA_ID_PAPER:
            GlassReady.Obj.PaperWater = true;
            return;

           case REA_ID_UNIVIND:
             ColorPaperSet(GlassReady, ColorFromPh(7));
             GlassReady.Obj.PaperWater = true;
             return;
          } /* End of switch */
        }
        LiquidMove(GlassReady.Obj, WashBottle);
        break;

      case 'animation__L':
        AnimRunning = false;
        PlaySound(this.querySelector('#SND_Tunk'));
      } /* End of switch */
    });

    /**** Click event ****/

    this.el.addEventListener('click', function() {
      if (MbClickID !== MOUSE_BUTTON_LEFT) return;
      ScWashBottleClick();
    });
  }
});

