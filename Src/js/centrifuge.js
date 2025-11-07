
/*******************************************
****         LabSim - Centrifuge         ****
**** (c) 2020-2025, Alessandro Pedretti ****
*******************************************/


/**** Local variables ****/

const TubeSequence = [0, 3, 2, 5, 1, 4];


/**** Check if the rotor is balanced ****/

function CentrifugeCheck()
{
  /**** Check the number of test tubes ****/

  var TestTubes = 0;
  for(var k = 0; k < 6; ++k)
    if (Centrifuge.DockTube[k]) ++TestTubes;

  if (!TestTubes) return true;

  if (TestTubes % 2) {
    ShowError(Msg.SsCentOddTubes);
    return false;
  }

  /**** Check if the tubes are in the right position ****/

  for(var k = 0; k < 6; k += 2) {
    if (((Centrifuge.DockTube[TubeSequence[k]]) && (!Centrifuge.DockTube[TubeSequence[k + 1]])) ||
        ((!Centrifuge.DockTube[TubeSequence[k]]) && (Centrifuge.DockTube[TubeSequence[k + 1]]))) {
      ShowError(Msg.SsCentPosTubes);
      return false;
    }
  } /* End of for (k) */

  /**** Check if the rotor is balanced ****/

  for(var k = 0; k < 6; k += 2) {
    var Tube1 = Centrifuge.DockTube[TubeSequence[k]];
    var Tube2 = Centrifuge.DockTube[TubeSequence[k + 1]];
    if ((Tube1) && (Tube2) && (Tube1.LiqLvl !== Tube2.LiqLvl)) {
      ShowError(Msg.SsCentNotBal);
      return false;
    }
  } /* End of for (k) */

  return true;
}


/**** Do the separation ****/

function CentrifugeDoSeparation(Tube)
{
  Tube.LiqAdspect = ADSPECT_LIQUID_NONE;
  Tube.CentTime = 0;
  LiquidUpdate(Tube);

  /**** Show the precipitate ****/

  var Obj = Tube.Handle.querySelector('#Solid');
  Obj.setAttribute('visible', true);
  ColorSet(Obj, Tube.SolidColor);
}


/**** Open/close the centrifuge ****/

function CentrifugeOpen(Open)
{
  if ((Open) && (Centrifuge.Open)) {
    ShowError(Msg.SsCentAlrOpen);
    return;
  }

  if ((!Open) && (!Centrifuge.Open)) {
    ShowError(Msg.SsCentAlrClose);
    return;
  }

  if (Open) {
    if (!Centrifuge.On) {
      ShowError(Msg.SsCentOpenOff);
      return;
    }

    if ((Centrifuge.Run) || (Centrifuge.Time)) {
      ShowError(Msg.SsCentOpenRun);
      return;
    }

    if (Centrifuge.Lock) {
      ShowError(Msg.SsCentOpenLock);
      return;
    }

    if (!Centrifuge.Time) {

      /**** Update the tube positions ****/

      for(var l = 0; l < 6; ++l) {
        if (Centrifuge.DockTube[l]) {
          var StartPos  = Centrifuge.DockTube[l].Handle.getAttribute('position');
          var TargetPos = PositionToLocal(Rack, Centrifuge.hTube[l]);
          Centrifuge.DockTube[l].Handle.setAttribute('position', TargetPos.x + ' ' + StartPos.y  + ' ' + TargetPos.z);
        }
      } /* End of for (l) */

      /**** Do the separation ****/

      CentrifugeSeparate();

      /**** Open the cover ****/

      Centrifuge.hCover.removeAttribute('animation__Open');
      Centrifuge.hCover.setAttribute('animation__Open', 'dur: 500; property: rotation; to: -90 0 0');
      Centrifuge.Open = true;
      PlaySound(Centrifuge.hCover.querySelector('#SND_OpenCover'));
    }
  } else {
    if (!CentrifugeCheck()) return;

    Centrifuge.hCover.removeAttribute('animation__Close');
    Centrifuge.hCover.setAttribute('animation__Close', 'dur: 500; property: rotation; to: 0 0 0');
    Centrifuge.Lock = true;
    PlaySound(Centrifuge.hCover.querySelector('#SND_OpenCover'));
  }

  Centrifuge.Open = Open;
}


/**** Centrifuge switch on/off ****/

function CentrifugePower(On)
{
  if ((On) && (Centrifuge.On)) {
    ShowError(Msg.SsCentAlrOn);
    return;
  }

  if ((!On) && (!Centrifuge.On)) {
    ShowError(Msg.SsCentAlrOff);
    return;
  }

  Centrifuge.hLedPower.setAttribute('color', On ? '#3eea3e' : '#005700');
  Centrifuge.hLedPower.setAttribute('event-set__leave', '_event: mouseleave; material.color: ' +
                                    (On ? '#3eea3e' : '#005700'));
  PlaySound(Centrifuge.hLedPower.querySelector(On ? '#SND_ButtonOn' : '#SND_ButtonOff'));
  if (!On) {
    Centrifuge.Handle.querySelector('#SND_CentRun').components.sound.stopSound();
  }
  Centrifuge.On = On;
  CentrifugeTime(Centrifuge.Time, true);
}


/**** Put the test tube in the centrifuge ****/

function CentrifugePutTube(CentTube)
{
  if (AnimRunning) return;

  if (!Centrifuge.Open) {
    ShowError(Msg.SsCentPutClose);
    return;
  }

  var TubeID;
  if (CentTube) {
    for(TubeID = 0; (TubeID < 6) && (Centrifuge.hTube[TubeID] != CentTube); ++TubeID) {}
  } else {
    TubeID = 6;
    for(var k = 0; k < 6; k += 2) {
      if ((Centrifuge.DockTube[TubeSequence[k]]) && (!Centrifuge.DockTube[TubeSequence[k + 1]])) {
        TubeID = TubeSequence[k + 1];
        break;
      }
      if ((!Centrifuge.DockTube[TubeSequence[k]]) && (Centrifuge.DockTube[TubeSequence[k + 1]])) {
        TubeID = TubeSequence[k];
        break;
      }
    } /* End of for (k) */

    if (TubeID === 6) {
      for(TubeID = 0; (TubeID < 6) && (Centrifuge.DockTube[TubeSequence[TubeID]]); ++TubeID) {}
      TubeID   = TubeSequence[TubeID];
    }
    CentTube = Centrifuge.hTube[TubeID];
  }

  if (!GlassReady.Obj) {
    if (!Centrifuge.hTube[TubeID])
      ShowError(Msg.SsSelectGlassware);
    return;
  }

  if (!GlassReady.Obj.Centrifuge) {
    ShowError(Msg.SsCantPutInCent);
    return;
  }

  if (GlassReady.Obj.PaperID) {
    ShowError(Msg.SsCentGlassPaper);
    return;
  }

  if (GlassIsEmpty(GlassReady.Obj)) {
    ShowError(Msg.SsCentGlassEmpty);
    return;
  }

  if (Centrifuge.DockTube[TubeID]) {
    ShowError(Msg.SsCentSameTube);
    return;
  }

  Centrifuge.DockTube[TubeID] = GlassReady.Obj;

  var GlassHandle = GlassReady.Handle;
  var StartPos    = GlassHandle.getAttribute('position');
  var TargetPos   = PositionToLocal(Rack, CentTube);

  GlassHandle.removeAttribute('animation__DockCent');

  AnimRunning = true;
  GlassHandle.setAttribute('animation__DockCent', 'dur: 500; property: position ' +
                           '; from: ' + StartPos.x  + ' ' + StartPos.y  + ' ' + StartPos.z +
                           '; to: '   + TargetPos.x + ' ' + StartPos.y  + ' ' + TargetPos.z);
}


/**** Perform the phase separation ****/

function CentrifugeSeparate()
{
  for(var k = 0; k < 6; ++k) {
    var Tube = Centrifuge.DockTube[k];
    if ((Tube) && (Tube.LiqAdspect === ADSPECT_LIQUID_SUSP) &&
        (Tube.CentTime >= 2))
      CentrifugeDoSeparation(Tube);
  } /* End of for (k) */
}


/**** Centrifuge speed ****/

function CentrifugeSpeed(Speed)
{
  if (Speed > 2) Speed = 0;
  Centrifuge.hPotSpeed.setAttribute('rotation', (70 + 20 * Speed) + ' 90 90');
  PlaySound(Centrifuge.hPotSpeed.querySelector('#SND_RotSwitch'));
  Centrifuge.Speed = Speed;

  CentrifugeUpdate();
}


/**** Stop the centrifuge ****/

function CentrifugeStop()
{
  PlaySound(Centrifuge.Handle.querySelector('#SND_CentStop'));
  Centrifuge.Handle.querySelector('#SND_CentStart').components.sound.stopSound();
  Centrifuge.Handle.querySelector('#SND_CentRun').components.sound.stopSound();
  clearInterval(Centrifuge.hTimer);

  if (!Prefs.SoundActive)  {
    setTimeout(function() {
      CentrifugeStopEvent();
    }, Asset.querySelector('#SndCentStop').duration * 1000);
  }
}


/**** Centrifuge stop event ****/

function CentrifugeStopEvent()
{
  Centrifuge.Run = false;
  CentrifugeUpdate();
  Centrifuge.Handle.querySelector('#Rotor').setAttribute('rotation', '0 ' + (Math.random() * 360) + ' 0');
}


/**** Centrifugue time ****/

function CentrifugeTime(Time, Quiet)
{
  if ((Time === Centrifuge.Time) && (!Quiet)) return;
  if (Time > 4) Time = 0;

  if (!Centrifuge.Open) {
    if (!Time) {
      if ((Centrifuge.On) && (Centrifuge.Time !== Time))
        CentrifugeStop();
    } else if (Centrifuge.On) {
      if (!Centrifuge.Run) {
        if (!Centrifuge.Lock) {
          PlaySound(Centrifuge.hLedOpen.querySelector('#SND_Clack'));
          Centrifuge.Lock = true;
        }
        PlaySound(Centrifuge.Handle.querySelector('#SND_CentStart'));
        Centrifuge.Run = true;

        Centrifuge.hTimer = setInterval(function() {
          CentrifugeTime(Centrifuge.Time - 1, true);

          /**** Update the centrifugation time of the tubes ****/

          for(var k = 0; k < 6; ++k) {
            var Tube = Centrifuge.DockTube[k];
            if (Tube) ++Tube.CentTime;
          } /* End of for (k) */
        }, Centrifuge.TimeStep);
      }
    } else if (Centrifuge.Run) CentrifugeStop();
  }

  Centrifuge.hPotTime.setAttribute('rotation', (45 * Time) + ' -90 -90');
  if (!Quiet)
    PlaySound(Centrifuge.hPotTime.querySelector('#SND_RotSwitch'));
  Centrifuge.Lock = true;
  Centrifuge.Time = Time;

  CentrifugeUpdate();
}


/**** Centrifuge unlock ****/

function CentrifugeUnlock()
{
  if (!Centrifuge.On) {
    ShowError(Msg.SsCentUnlockOff);
    return;
  }

  if ((Centrifuge.Run) || (Centrifuge.Time)) {
    ShowError(Msg.SsCentUnlockRun);
    return;
  }

  if (Centrifuge.Lock) {
    PlaySound(Centrifuge.hLedOpen.querySelector('#SND_Clack'));
    Centrifuge.Lock = false;
  }

  CentrifugeUpdate();
}


/**** Centrifuge update ****/

function CentrifugeUpdate()
{
  var LedColor = ((Centrifuge.On) && (!Centrifuge.Run) && (!Centrifuge.Time)) ? '#d6ff0a' : '#a36a00';
  Centrifuge.hLedOpen.setAttribute('color', LedColor);
  Centrifuge.hLedOpen.setAttribute('event-set__leave', '_event: mouseleave; material.color: ' + LedColor);
}

