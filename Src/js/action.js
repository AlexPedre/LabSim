
/*******************************************
****          LabSim - Actions          ****
**** (c) 2020-2025, Alessandro Pedretti ****
*******************************************/


/**** Explosion ****/

async function Explosion()
{
  var Obj;
  var ObjHandle = [];
  var ObjList   = Scene.querySelectorAll('[id^="Reagent"]');
  var Offset    = EXPLOSION_SCALE / -2;

  var i = 0;
  for(Obj of ObjList) {
    if (i++ % 2)
      ObjHandle.push(Obj);
    else
      Obj.setAttribute('visible', 'false');
  }

  for(Obj of GlassWare)
    ObjHandle.push(Obj.Handle);

  ObjHandle.push(AnalyteHandle);
//  ObjHandle.push(Centrifuge.Handle);

  ObjHandle.push(Bunsen.Handle);
  ObjHandle.push(Heater.Handle);
  ObjHandle.push(Lighter.Handle);
  ObjHandle.push(Rack);
  ObjHandle.push(Spatula);
  ObjHandle.push(Trash);

  ObjHandle.push(Workbench.querySelector('#Book'));
  ObjHandle.push(Workbench.querySelector('#Paper'));
  ObjHandle.push(Workbench.querySelector('#PhotoFrameSmell'));

  /**** Stop the events ****/

  Boil(WaterBath, false);
  CentrifugeTime(0, false);
  Tv.Video.pause();

  for(Obj of ObjHandle) {
    Obj.removeAttribute('animation__1');
    Obj.removeAttribute('animation__2');
    Obj.setAttribute('animation__1', 'dur: ' + EXPLOSION_DUR + '; property: position; to: ' +
                     (Offset + Math.random() * EXPLOSION_SCALE) + ' ' +
                     (Offset + Math.random() * EXPLOSION_SCALE) + ' ' +
                     (Offset + Math.random() * EXPLOSION_SCALE));
    Obj.setAttribute('animation__2', 'dur: ' + EXPLOSION_DUR + '; property: rotation; to: ' +
                     (Math.random() * 360) + ' ' + (Math.random() * 360) + ' ' + (Math.random() * 360));
  } /* End of for (Obj) */

  StopSound('SND_BoilWater');
  Scene.querySelector('#FlameExplosion').setAttribute('particle-system', 'enabled: true');
  PlaySound('SND_Explosion');
  await Sleep(EXPLOSION_DUR);
  for(Obj of ObjHandle) {
     Obj.setAttribute('visible', 'false');
  } /* End of for (Obj) */
  await Sleep(2000);
  PlaySound('SND_Burn');

  await Sleep(2000);
  Speak(Msg.SsExplosion);

  /**** Restart the simulation ****/

  await Sleep(10000);
  location.reload(true);
}


/**** Bath click ****/

function ScBathClick()
{
  if (AnimRunning) return;

  if (!GlassReady.Obj) {
    Speak(Msg.SsSelectGlassware);
    return;
  }

  if (!GlassReady.Obj.Bath) {
    Speak(Msg.SsCantPutInBath);
    return;
  }

  if (GlassIsEmpty(GlassReady.Obj)) {
    Speak(Msg.SsBathGlassEmpty);
    return;
  }

  var Hole = 0;
  for(Hole = 0; WaterBath.DockHole[Hole]; ++Hole) {}
  WaterBath.DockHole[Hole] = GlassReady.Obj;

  var GlassHandle = GlassReady.Handle;
  var StartPos    = GlassHandle.getAttribute('position');
  var TargetPos   = PositionToLocal(Rack, WaterBath.Handle.querySelector('#StandHole' + (Hole + 1)));

  GlassHandle.removeAttribute('animation__DockRack');

  AnimRunning = true;
  GlassHandle.setAttribute('animation__DockRack', 'dur: 500; property: position ' +
                           '; from: ' + StartPos.x  + ' ' + StartPos.y  + ' ' + StartPos.z +
                           '; to: '   + TargetPos.x + ' ' + StartPos.y  + ' ' + TargetPos.z);
}


/**** Dropper click ****/

function ScDropperClick(Target)
{
  if (AnimRunning) return;

  if (!Target.Dropper) {
    Speak(Msg.SsCantUseDropper);
    return;
  }

  if (Target.Burning) {
    Speak(Msg.SsCantBurning);
    return;
  }

  var GlassObj = GlassReady.Obj;

  if (GlassIsEmpty(GlassObj)) {
    if (!Target.Water) {
      Speak(Msg.SsDropperNothing);
      return;
    }

    if ((Target.Type === GLASS_TYPE_TESTTUBE) && (Target.PaperID)) {
      Speak(Msg.SsDropperPaper1);
      return;
    }
  } else if ((Target.Type === GLASS_TYPE_TESTTUBE) && (Target.PaperID)) {
    if (Target.PaperID === REA_ID_UNIVIND) {
      if ((GlassObj.AnaID) || (GlassObj.ReaNum)) {
        Speak(Msg.SsDropperInd);
        return;
      }
    } else {
      if ((GlassObj.AnaID) || (GlassObj.ReaNum > 1)) {
        Speak(Msg.SsDropperPaper2);
        return;
      }
    }
  }

  if ((!GlassWater(Target)) && (!GlassSameSubst(GlassObj, Target)) && (!GlassIsClean(GlassObj)))
    return;

  var Drain, MoveDown, MoveDrain, MoveUp;
  RingTest = false;

  switch(Target.Type) {
  case GLASS_TYPE_BEAKER:
    MoveUp    = 0.050;
    MoveDown  = 0.057;
    MoveDrain = 0.005;
    break;

  case GLASS_TYPE_CURCIBLE:
  case GLASS_TYPE_WATCHGLASS:
    MoveUp    = 0;
    MoveDown  = 0.05;
    MoveDrain = 0.02;
    break;

  case GLASS_TYPE_TESTTUBE:
    MoveUp    = 0.190; // 0.180
    MoveDown  = 0.035;
    MoveDrain = Target.PaperID ? -0.180 : -0.150;
    break;
  } /* End of switch */

  /**** Perform the animation ****/

  var GlassHandle = GlassObj.Handle;
  var Rubber      = GlassHandle.querySelector('#Rubber');
  var StartPos    = GlassHandle.getAttribute('position');
  var TargetPos   = PositionToLocal(Workbench, Target.Handle);
  GlassTarget     = Target;

  if (GlassIsEmpty(GlassObj)) {
    Drain = '';
  } else {
    Drain    = 'd';
    MoveDown = MoveDrain;
  }

  AnimRunning  = true;
  MoveUp      += StartPos.y;
  MoveDown     = StartPos.y - MoveDown;

  GlassHandle.removeAttribute('animation__1');
  GlassHandle.removeAttribute('animation__2');
  Rubber.removeAttribute('animation__1' + Drain);
  Rubber.removeAttribute('animation__2' + Drain);
  GlassHandle.removeAttribute('animation__3');
  GlassHandle.removeAttribute('animation__L');

  GlassHandle.setAttribute('animation__1', 'dur: 500; property: position ' +
                           '; from: ' + StartPos.x  + ' ' + StartPos.y + ' ' + StartPos.z +
                           '; to: '   + TargetPos.x + ' ' + MoveUp     + ' ' + TargetPos.z);
  GlassHandle.setAttribute('animation__2', 'delay: 500; dur: 500; property: position ' +
                           '; from: ' + TargetPos.x + ' ' + MoveUp   + ' ' + TargetPos.z +
                           '; to: '   + TargetPos.x + ' ' + MoveDown + ' ' + TargetPos.z);

  Rubber.setAttribute('animation__1' + Drain, 'delay: 1000; dur: 500; property: scale; from: 1 1 1; to: 0.5 1 1');
  Rubber.setAttribute('animation__2' + Drain, 'delay: 1600; dur: 500; property: scale; from: 0.5 1 1; to: 1 1 1');

  GlassHandle.setAttribute('animation__3', 'delay: 2100; dur: 500; property: position; ' +
                           '; from: ' + TargetPos.x + ' ' + MoveDown + ' ' + TargetPos.z +
                           '; to: '   + TargetPos.x + ' ' + MoveUp   + ' ' + TargetPos.z);
  GlassHandle.setAttribute('animation__L', 'delay: 2700; dur: 500; property: position; ' +
                           '; from: ' + TargetPos.x + ' ' + MoveUp     + ' ' + TargetPos.z +
                           '; to: '   + StartPos.x  + ' ' + StartPos.y + ' ' + StartPos.z);

}


/**** Use the dropper ****/

function ScDropperUse()
{
  if (GlassReady.Type === GLASS_TYPE_DROPPER) {
    ScDropperClick(GlassReady);
    return;
  }
  ScReaPipetteClick();
}


/**** Click the glassware ****/

function ScGlassWareClick(What, Action, Flags)
{
  if (AnimRunning) return;

  if (!What) {
    if ((Action === GLASS_CLICK_LEAVE) && (GlassReady.Obj)) {
      if ((Flags & SCGWCLICK_TESTTUBEONLY) && (GlassReady.Obj.Type !== GLASS_TYPE_TESTTUBE)) {
        Speak(Msg.SsNotUnderstand2);
        return;
      } else {
        What = GlassReady.Obj;
      }
    } else {
      Speak(Msg.SsNothingToLeave);
      return;
    }
  }

  if (Action === GLASS_CLICK_USE) {
    var Str;

    switch(What.Type) {
    case GLASS_TYPE_BEAKER:
      Str = Msg.SsCantUseBeaker;
      break;

    case GLASS_TYPE_CURCIBLE:
      Str = Msg.SsCantUseCurcible;
      break;

    case GLASS_TYPE_DROPPER:
      ScDropperClick(GlassReady);
      return;

    case GLASS_TYPE_NICHROME:
      ScNichromeClick(GlassReady);
      return;

    case GLASS_TYPE_STIRRER:
      ScStirrerClick(GlassReady);
      return;

    case GLASS_TYPE_TESTTUBE:
      Str = Msg.SsCantTestTube;
      break;

    case GLASS_TYPE_WATCHGLASS:
      Str = Msg.SsCantUseWatchGlass;
      break;
    } /* End of switch */
    Speak(Str);

    return;
  }

  if ((GlassReady.Obj === Lighter) && (What !== Lighter)) {
    ScLighterClick(What);
    return;
  }

  if (What.Burning) {
    Speak(Msg.SsCantBurning);
    return;
  }

  if ((GlassReady.Obj === Dropper) && (What !== Dropper)) {
    ScDropperClick(What);
    return;
  }

  if ((GlassReady.Obj === Nichrome) && (What !== Nichrome) &&
      ((What.Type === GLASS_TYPE_BUNSEN) || (What.Type === GLASS_TYPE_TESTTUBE) ||
       (What.Type === GLASS_TYPE_WATCHGLASS))) {
    ScNichromeClick(What);
    return;
  }

  if ((GlassReady.Obj === Stirrer) && (What !== Stirrer)) {
    ScStirrerClick(What);
    return;
  }

  var Position, TargetPos, y;

  var WhatHandle = What.Handle;

  if (GlassReady.Handle) {
    if ((GlassReady.Handle == WhatHandle) && (Action == GLASS_CLICK_TAKE)) {
      Speak(Msg.SsAlreadyTaken);
      return;
    }

    if ((GlassReady.Handle != WhatHandle) && (Action === GLASS_CLICK_LEAVE)) {
      Speak(Msg.SsNotUnderstand2);
      return;
    }

    AnimRunning = true;
    Position    = GlassReady.Handle.getAttribute('position');
    GlassReady.Handle.removeAttribute('animation__1');
    GlassReady.Handle.removeAttribute('animation__L');

    switch(GlassReady.Obj) {
    case Dropper:
      GlassReady.Handle.setAttribute('animation__1',
                                     'dur: 500; property: rotation; from: 0 0 0; to: 88.5 0 0');
      break;

    case Lighter:
      GlassReady.Handle.setAttribute('animation__1',
                                     'dur: 500; property: rotation; from: 0 0 0; to: -90 0 0');
      break;
    } /* End of switch */

    GlassReady.Handle.setAttribute('animation__L',
                                   'dur: 500; property: position; ' +
                                   'from: ' + Position.x + ' ' + Position.y        + ' ' + Position.z + '; ' +
                                   'to: '   + Position.x + ' ' + GlassReady.LeaveY + ' ' + Position.z);

    if (GlassReady.Handle === WhatHandle) {
      GlassReady.Handle = null;
      GlassReady.Obj    = null;
      return;
    }
  } else if (Action == GLASS_CLICK_LEAVE) {
    Speak(Msg.SsNothingToLeave);
    return;
  }

  AnimRunning       = true;
  Position          = WhatHandle.getAttribute('position');
  GlassReady.LeaveY = Position.y;
  y                 = What.PosY + ((What.Type == GLASS_TYPE_TESTTUBE) ? 1.5 : 0.15);

  WhatHandle.removeAttribute('animation__L');

  if (What.Dock) {
    switch(What.Dock) {
    case Centrifuge.Handle:
      if ((Action === GLASS_CLICK_TAKE) && (!Centrifuge.Open)) {
        AnimRunning = false;
        return;
      }

      for(var TubeID = 0; TubeID < 6; ++TubeID) {
        if (Centrifuge.DockTube[TubeID] === What) {
          Centrifuge.DockTube[TubeID] = null;
          break;
        }
      } /* End of for (Hole) */
      GlassReady.LeaveY = What.PosY;
      break;

    case Heater.Handle:
      if (!(Flags & SCGWCLICK_NOMOVEBATH)) {
        var WaterBathHandle = WaterBath.Handle;
        var StartPos        = WaterBathHandle.getAttribute('position');
        var MoveUp          = WaterBath.PosY + WATERBATH_MOVEUP;

        WaterBathHandle.removeAttribute('animation__1');
        WaterBathHandle.removeAttribute('animation__2');
        WaterBathHandle.removeAttribute('animation__L');

        for(var Hole = 0; Hole < WaterBath.DockHole.length; ++Hole) {
          if (WaterBath.DockHole[Hole]) {
            var TubeHandle     = WaterBath.DockHole[Hole].Handle;
            var TubeStart      = TubeHandle.getAttribute('position');
            var TubeTarget     = PositionToLocal(Workbench, TubeHandle);
            var TubeTargetDown = new THREE.Vector3(TubeTarget.x, TubeTarget.y + WATERBATH_MOVEDOWN, TubeTarget.z);
            TubeTarget.y += WATERBATH_MOVEUP + WATERBATH_MOVEDOWN;
            TubeTarget.z -= WATERBATH_MOVEZ;

            Workbench.object3D.localToWorld(TubeTarget);
            Workbench.object3D.localToWorld(TubeTargetDown);
            Rack.object3D.updateMatrixWorld();
            Rack.object3D.worldToLocal(TubeTarget);
            Rack.object3D.worldToLocal(TubeTargetDown);

            TubeHandle.removeAttribute('animation__1');
            TubeHandle.removeAttribute('animation__2');
            TubeHandle.removeAttribute('animation__3');

            TubeHandle.setAttribute('animation__1', 'delay: 1000; dur: 500; property: position ' +
                                    '; from: ' + TubeStart.x  + ' ' + TubeStart.y    + ' ' + TubeStart.z +
                                    '; to: '   + TubeStart.x  + ' ' + TubeTarget.y   + ' ' + TubeStart.z);
            TubeHandle.setAttribute('animation__2', 'delay: 1500; dur: 500; property: position ' +
                                    '; from: ' + TubeStart.x  + ' ' + TubeTarget.y + ' ' + TubeStart.z +
                                    '; to: '   + TubeTarget.x + ' ' + TubeTarget.y + ' ' + TubeTarget.z);
            TubeHandle.setAttribute('animation__3', 'delay: 2000; dur: 500; property: position ' +
                                    '; from: ' + TubeTarget.x  + ' ' + TubeTarget.y     + ' ' + TubeTarget.z +
                                    '; to: '   + TubeTarget.x  + ' ' + TubeTargetDown.y + ' ' + TubeTarget.z);
          }
        } /* End of for (Hole) */

        WaterBathHandle.setAttribute('animation__1', 'delay: 1000; dur: 500; property: position ' +
                                     '; from: ' + StartPos.x  + ' ' + StartPos.y + ' ' + StartPos.z +
                                     '; to: '   + StartPos.x  + ' ' + MoveUp     + ' ' + StartPos.z);
        WaterBathHandle.setAttribute('animation__2', 'delay: 1500; dur: 500; property: position ' +
                                     '; from: ' + StartPos.x     + ' ' + MoveUp + ' ' + StartPos.z +
                                     '; to: '   + WaterBath.PosX + ' ' + MoveUp + ' ' + WaterBath.PosZ);
        WaterBathHandle.setAttribute('animation__L', 'delay: 2000; dur: 500; property: position ' +
                                     '; from: ' + WaterBath.PosX + ' ' + MoveUp         + ' ' + WaterBath.PosZ +
                                     '; to: '   + WaterBath.PosX + ' ' + WaterBath.PosY + ' ' + WaterBath.PosZ);
        WaterBath.Dock = Heater.Handle;
      }
      GlassReady.LeaveY -= 0.09;
      break;

    case Rack:
      for(var Hole = 0; Hole < WaterBath.DockHole.length; ++Hole) {
        if (WaterBath.DockHole[Hole] == What) {
          WaterBath.DockHole[Hole] = null;
          break;
        }
      } /* End of for (Hole) */
      GlassReady.LeaveY = What.PosY;
      break;
    } /* End of switch */

    WhatHandle.removeAttribute('animation__1');
    WhatHandle.setAttribute('animation__1',
                            'dur: 500; property: position; ' +
                            'from: ' + Position.x + ' ' + Position.y + ' ' + Position.z + '; ' +
                            'to: '   + Position.x + ' ' + y          + ' ' + Position.z);

    WhatHandle.setAttribute('animation__L',
                            'delay: 500; dur: 500; property: position; ' +
                            'from: ' + Position.x + ' ' + y + ' ' + Position.z + '; ' +
                            'to: '   + What.PosX  + ' ' + y + ' ' + What.PosZ);
    What.Dock = null;
  } else {
    WhatHandle.removeAttribute('animation__1');
    switch(What) {
    case Dropper:
      WhatHandle.setAttribute('animation__1',
                              'dur: 500; property: rotation; from: 88.5 0 0; to: 0 0 0');
      break;

    case Lighter:
      WhatHandle.setAttribute('animation__1',
                              'dur: 500; property: rotation; from: -90 0 0; to: 0 0 0');
      break;
    } /* End of switch */
    WhatHandle.setAttribute('animation__L',
                            'dur: 500; property: position; ' +
                            'from: ' + Position.x + ' ' + Position.y + ' ' + Position.z + '; ' +
                            'to: '   + Position.x + ' ' + y          + ' ' + Position.z);
  }

  GlassReady.Handle = WhatHandle;
  GlassReady.Obj    = What;
}


/**** Heater click ****/

async function ScHeaterClick()
{
  if (AnimRunning) return;

  if (!GlassReady.Obj) {
    Speak(Msg.SsSelectGlassware);
    return;
  }

  if (!GlassReady.Obj.Heater) {
    Speak(Msg.SsHeaterCantPut);
    return;
  }

  if (GlassIsEmpty(GlassReady.Obj)) {
    Speak(Msg.SsHeaterGlassEmpty);
    return;
  }

  if ((GlassReady.Obj.Type === GLASS_TYPE_BEAKER)  &&
      (!GlassReady.Obj.Water)) {
    Speak(Msg.SsHeaterBeakerWater);
    return
  }

  var Delay           = 2000;
  var GlassHandle     = GlassReady.Handle;
  var GlassObj        = GlassReady.Obj;
  var StartPos        = GlassHandle.getAttribute('position');
  var TargetPos       = PositionToLocal(WorkBench, Heater.Handle.querySelector('#HeaterDock'));
  var WaterBathTarget = new THREE.Vector3(WaterBath.PosX, WaterBath.PosY + WATERBATH_MOVEUP, WaterBath.PosZ + WATERBATH_MOVEZ);
  var WaterBathHandle = WaterBath.Handle;

  /**** Remove the glassware from heater ****/

  for(var i = 0; i < GlassWare.length; i++) {
    if ((GlassWare[i].Dock === Heater.Handle) &&
        (GlassWare[i] !== WaterBath)) {
      ScGlassWareClick(GlassObj, GLASS_CLICK_LEAVE, SCGWCLICK_NOMOVEBATH);
      await WaitAnimEnd(500);
      ScGlassWareClick(GlassWare[i], GLASS_CLICK_TAKE, SCGWCLICK_NOMOVEBATH);
      await WaitAnimEnd(500);
      ScGlassWareClick(GlassObj, GLASS_CLICK_TAKE, SCGWCLICK_NOMOVEBATH);
      await WaitAnimEnd(500);
      Delay = 0;
      BoilDelay(GlassWare[i], false);
      break;
    }
  } /* End of for (i) */


  AnimRunning = true;

  /**** Water bath animation ****/

  if (WaterBath.Dock) {
    WaterBath.Dock = null;

    WaterBathHandle.removeAttribute('animation__1');
    WaterBathHandle.removeAttribute('animation__2');
    WaterBathHandle.removeAttribute('animation__L');

    for(var Hole = 0; Hole < WaterBath.DockHole.length; ++Hole) {
      if (WaterBath.DockHole[Hole]) {
        var TubeHandle     = WaterBath.DockHole[Hole].Handle;
        var TubeStart      = TubeHandle.getAttribute('position');
        var TubeTarget     = PositionToLocal(Workbench, TubeHandle);
        var TubeTargetDown = new THREE.Vector3(TubeTarget.x, TubeTarget.y - WATERBATH_MOVEDOWN, TubeTarget.z);

        TubeTarget.y += WATERBATH_MOVEUP;
        TubeTarget.z += WATERBATH_MOVEZ;

        Workbench.object3D.localToWorld(TubeTarget);
        Workbench.object3D.localToWorld(TubeTargetDown);
        Rack.object3D.updateMatrixWorld();
        Rack.object3D.worldToLocal(TubeTarget);
        Rack.object3D.worldToLocal(TubeTargetDown);

        TubeHandle.removeAttribute('animation__1');
        TubeHandle.removeAttribute('animation__2');
        TubeHandle.removeAttribute('animation__3');

        TubeHandle.setAttribute('animation__1', 'dur: 500; property: position ' +
                                '; from: ' + TubeStart.x  + ' ' + TubeStart.y  + ' ' + TubeStart.z +
                                '; to: '   + TubeStart.x  + ' ' + TubeTarget.y + ' ' + TubeStart.z);
        TubeHandle.setAttribute('animation__2', 'delay: 500; dur: 500; property: position ' +
                                '; from: ' + TubeStart.x  + ' ' + TubeTarget.y + ' ' + TubeStart.z +
                                '; to: '   + TubeTarget.x + ' ' + TubeTarget.y + ' ' + TubeTarget.z);
        TubeHandle.setAttribute('animation__3', 'delay: 1000; dur: 500; property: position ' +
                                '; from: ' + TubeTarget.x  + ' ' + TubeTarget.y     + ' ' + TubeTarget.z +
                                '; to: '   + TubeTarget.x  + ' ' + TubeTargetDown.y + ' ' + TubeTarget.z);
      }
    } /* End of for (Hole) */

    WaterBathHandle.setAttribute('animation__1', 'dur: 500; property: position ' +
                                 '; from: ' + WaterBath.PosX  + ' ' + WaterBath.PosY    + ' ' + WaterBath.PosZ +
                                 '; to: '   + WaterBath.PosX  + ' ' + WaterBathTarget.y + ' ' + WaterBath.PosZ);
    WaterBathHandle.setAttribute('animation__2', 'delay: 500; dur: 500; property: position ' +
                                 '; from: ' + WaterBath.PosX    + ' ' + WaterBathTarget.y + ' ' + WaterBath.PosZ +
                                 '; to: '   + WaterBathTarget.x + ' ' + WaterBathTarget.y + ' ' + WaterBathTarget.z);
    WaterBathHandle.setAttribute('animation__L', 'delay: 1000; dur: 500; property: position ' +
                                 '; from: ' + WaterBathTarget.x  + ' ' + WaterBathTarget.y                     + ' ' + WaterBathTarget.z +
                                 '; to: '   + WaterBathTarget.x  + ' ' + (WaterBath.PosY - WATERBATH_MOVEDOWN) + ' ' + WaterBathTarget.z);
  }

  /**** Glassware animation ****/

  GlassHandle.removeAttribute('animation__DockHeater');
  GlassHandle.setAttribute('animation__DockHeater', 'delay: ' + Delay + '; dur: 500; property: position ' +
                          '; from: ' + StartPos.x  + ' ' + StartPos.y + ' ' + StartPos.z +
                          '; to: '   + TargetPos.x + ' ' + StartPos.y + ' ' + TargetPos.z);
}


/**** Use the lighter ****/

function ScLighterClick(Target)
{
  if (AnimRunning) return;

  if (!Target.Lighter) {
    Speak(Msg.SsCantUseLighter);
    return;
  }

  if (Target.Burning) {
    Speak((Target.Type === GLASS_TYPE_BUNSEN) ? Msg.SsBunsenAlrOn : Msg.SsLighterBurning);
    return;
  }

  if ((Target.Type !== GLASS_TYPE_BUNSEN) && (GlassIsEmpty(Target))) {
    Speak(Msg.SsLighterNothing);
    return;
  }

  var MoveDown, MoveUp;

  switch(Target.Type) {
  case GLASS_TYPE_BUNSEN:
    if (Target.Ox) {
      ShowError(Msg.SsBunsenNoRed);
      return;
    }
    MoveUp   = 0.25;
    MoveDown = 0.22;
    break;

  case GLASS_TYPE_CURCIBLE:
    MoveUp   = 0.1;
    MoveDown = 0.05;
    break;
  } /* End of switch */

  AnimRunning = true;

  var LighterHandle = Lighter.Handle;
  var Button        = LighterHandle.querySelector('#Button');
  var StartPos      = LighterHandle.getAttribute('position');
  var TargetPos     = PositionToLocal(Workbench, Target.Handle);

  GlassTarget  = Target;
  MoveUp      += TargetPos.y;
  MoveDown    += TargetPos.y;
  TargetPos.x += 0.04;

  Button.removeAttribute('animation__1');
  Button.removeAttribute('animation__2');
  LighterHandle.removeAttribute('animation__1');
  LighterHandle.removeAttribute('animation__2');
  LighterHandle.removeAttribute('animation__Ign');
  LighterHandle.removeAttribute('animation__3');
  LighterHandle.removeAttribute('animation__4');
  LighterHandle.removeAttribute('animation__L');


  LighterHandle.setAttribute('animation__1', 'dur: 1000; property: position ' +
                             '; from: ' + StartPos.x  + ' ' + StartPos.y + ' ' + StartPos.z +
                             '; to: '   + TargetPos.x + ' ' + MoveUp     + ' ' + TargetPos.z);
  Button.setAttribute('animation__1', 'delay: 1000; dur: 250; property: position ' +
                      '; from: 0 0 0; to: 0 -0.007 0');
  LighterHandle.setAttribute('animation__2',
                             'delay: 2000; dur: 1000; property: rotation; from: 0 0 0; to: 0 0 150');
  LighterHandle.setAttribute('animation__Ign', 'delay: 3000; dur: 500; property: position ' +
                             '; from: ' + TargetPos.x + ' ' + MoveUp     + ' ' + TargetPos.z +
                             '; to: '   + TargetPos.x + ' ' + MoveDown   + ' ' + TargetPos.z);
  LighterHandle.setAttribute('animation__3', 'delay: 5500; dur: 500; property: position ' +
                             '; from: ' + TargetPos.x + ' ' + MoveDown + ' ' + TargetPos.z +
                             '; to: '   + TargetPos.x + ' ' + MoveUp   + ' ' + TargetPos.z);
  LighterHandle.setAttribute('animation__4',
                             'delay: 6000; dur: 1000; property: rotation; from: 0 0 150; to: 0 0 0');
  Button.setAttribute('animation__2', 'delay: 7000; dur: 250; property: position ' +
                      '; from: 0 -0.007 0; to: 0 0 0');
  LighterHandle.setAttribute('animation__L', 'delay: 7500; dur: 1000; property: position ' +
                             '; from: ' + TargetPos.x + ' ' + MoveUp     + ' ' + TargetPos.z +
                             '; to: '   + StartPos.x  + ' ' + StartPos.y + ' ' + StartPos.z);
}


/**** Ni-Cr wire click ****/

function ScNichromeClick(Target)
{
  if (AnimRunning) return;

  /**** Find the test tube ****/

  if (!Target) {
    for(var Tube of TestTube) {
      if ((!Tube.AnaID) && (Tube.ReaNum === 1) &&
          (Tube.ReaID[0] == REA_ID_HCL_CONC)) {
        Target = Tube;
        break;
      }
    } /* End of for (Tube) */

    /**** Check the test tube ****/

    if (!Target) {
      NicromeError(Msg.SsFlameTestHCl);
      return;
    }
  }

  /**** Check the target glassware ****/

  switch(Target.Type) {
  case GLASS_TYPE_BUNSEN:
    if (!Bunsen.Burning) {
      NicromeError(Msg.SsFlameTestBunsen);
      return;
    }

    if (!Bunsen.Ox) {
      NicromeError(Msg.SsFlameTestOx);
      return;
    }
    break;

  case GLASS_TYPE_TESTTUBE:
    if ((Target.AnaID) || (Target.ReaNum !== 1) ||
        (Target.ReaID[0] !== REA_ID_HCL_CONC)) {
      NicromeError(Msg.SsFlameTestWrongTube);
      return;
    }
    break;

  case GLASS_TYPE_WATCHGLASS:
    if ((WatchGlass.ReaNum > 1) ||
        ((WatchGlass.AnaID) && (WatchGlass.ReaNum)) ||
        ((!WatchGlass.AnaID) && (!WatchGlass.ReaNum))) {
      NicromeError(Msg.SsFlameTestAna);
      return;
    }
    break;

  default:
    return;
  } /* End of switch */

  /**** Check the Ni-Cr wire ****/

  if ((Nichrome.CleanCount) &&
      (Target.Type !== GLASS_TYPE_TESTTUBE) && (!Nichrome.ReaNum)) {
    NicromeError(Msg.SsFlameTestNiCr);
    return;
  }

  var Delay, MoveDown, MoveUp, MoveZ;
  var RotZ, TargetPos;

  var hNichrome = Nichrome.Handle;
  var StartPos  = hNichrome.getAttribute('position');

  hNichrome.removeAttribute('animation__1');
  hNichrome.removeAttribute('animation__2');
  hNichrome.removeAttribute('animation__3');
  hNichrome.removeAttribute('animation__5');
  hNichrome.removeAttribute('animation__6');
  hNichrome.removeAttribute('animation__L');

  AnimRunning = true;
  TargetPos   = PositionToLocal(Workbench, Target.Handle);

  switch(Target.Type) {
  case GLASS_TYPE_BUNSEN: /* Move to the bunsen */
    Delay         = 6000;
    MoveUp        = TargetPos.y + 0.3;
    MoveZ         = StartPos.z  + 0.05;
    RotZ          = 60;
    TargetPos.x  += 0.100;
    TargetPos.y  += 0.210;

    var Wire = hNichrome.querySelector("#WireTip");

    hNichrome.removeAttribute('animation__FlameTestB');
    hNichrome.removeAttribute('animation__FlameTestE');
    Wire.removeAttribute('animation__1');
    Wire.removeAttribute('animation__2');
    Wire.removeAttribute('animation__3');
    Wire.removeAttribute('animation__4');

    hNichrome.setAttribute('animation__FlameTestB', 'delay: 1000; dur: 500; property: position ' +
                           '; from: ' + TargetPos.x + ' ' + MoveUp      + ' ' + TargetPos.z +
                           '; to: '   + TargetPos.x + ' ' + TargetPos.y + ' ' + TargetPos.z);
    Wire.setAttribute('animation__1', 'delay: 1500; dur: 500; property: components.material.material.color; type: color; from: #808080; to: #FF0000');
    Wire.setAttribute('animation__2', 'delay: 1500; dur: 500; property: components.material.material.emissive; type: color; from: #000; to: #FF0000');
    Wire.setAttribute('animation__3', 'delay: 5500; dur: 500; property: components.material.material.color; type: color; from: #FF0000; to: #808080');
    Wire.setAttribute('animation__4', 'delay: 5500; dur: 500; property: components.material.material.emissive; type: color; from: #FF0000; to: #000');
    hNichrome.setAttribute('animation__FlameTestE', 'delay: 5500; dur: 500; property: position ' +
                           '; from: ' + TargetPos.x + ' ' + TargetPos.y + ' ' + TargetPos.z +
                           '; to: '   + TargetPos.x + ' ' + MoveUp      + ' ' + TargetPos.z);
    break;

  case GLASS_TYPE_TESTTUBE: /* Move to the test tube */
    Delay         = 2500;
    MoveUp        = TargetPos.y + 0.17;
    MoveZ         = StartPos.z;
    RotZ          = 0;
    TargetPos.y  -= 0.06;

    Nichrome.ReaID[0] = REA_ID_HCL_CONC;
    Nichrome.ReaNum   = 1;
    break;

  case GLASS_TYPE_WATCHGLASS: /* Move to the watch glass */
    Delay         = 2500;
    MoveUp        = TargetPos.y;
    MoveZ         = StartPos.z;
    RotZ          = 60;
    TargetPos.x  += 0.100;
    TargetPos.y  -= 0.035;

    if (!Nichrome.CleanCount)
      Nichrome.AnaID = (WatchGlass.AnaID) ? WatchGlass.AnaID : ReaId2AnaId(WatchGlass.ReaID[0]);

    Nichrome. CleanCount = NICHROME_CLEAN_MIN;
    break;

  } /* End of switch */

  if (Delay === 2500) {
    hNichrome.removeAttribute('animation__D');
    hNichrome.removeAttribute('animation__U');

    hNichrome.setAttribute('animation__D', 'delay: 1000; dur: 500; property: position ' +
                           '; from: ' + TargetPos.x + ' ' + MoveUp      + ' ' + TargetPos.z +
                           '; to: '   + TargetPos.x + ' ' + TargetPos.y + ' ' + TargetPos.z);
    hNichrome.setAttribute('animation__U', 'delay: 2000; dur: 500; property: position ' +
                           '; from: ' + TargetPos.x + ' ' + TargetPos.y + ' ' + TargetPos.z +
                           '; to: '   + TargetPos.x + ' ' + MoveUp      + ' ' + TargetPos.z);
  }



  hNichrome.setAttribute('animation__1', 'dur: 500; property: position ' +
                         '; from: ' + StartPos.x + ' ' + StartPos.y + ' ' + StartPos.z +
                         '; to: '   + StartPos.x + ' ' + MoveUp     + ' ' + MoveZ);
  hNichrome.setAttribute('animation__2', 'dur: 500; property: rotation; from: -90 0 0; to: -180 0 ' + RotZ);
  hNichrome.setAttribute('animation__3', 'delay: 500; dur: 500; easing: linear;  property: position ' +
                         '; from: ' + StartPos.x  + ' ' + MoveUp     + ' ' + MoveZ +
                         '; to: '   + TargetPos.x + ' ' + MoveUp     + ' ' + TargetPos.z);

  hNichrome.setAttribute('animation__5', 'delay: ' + Delay + '; dur: 500; property: position ' +
                         '; from: ' + TargetPos.x + ' ' + MoveUp     + ' ' + TargetPos.z +
                         '; to: '   + StartPos.x  + ' ' + MoveUp     + ' ' + MoveZ);
  Delay += 500;
  hNichrome.setAttribute('animation__6', 'delay: ' + Delay + '; dur: 500; property: rotation; from: -180 0 ' + RotZ + '; to: -90 0 0');
  hNichrome.setAttribute('animation__L', 'delay: ' + Delay + '; dur: 500; property: position ' +
                         '; from: ' + StartPos.x + ' ' + MoveUp     + ' ' + MoveZ +
                         '; to: '   + StartPos.x + ' ' + StartPos.y + ' ' + StartPos.z);
}


/**** Reagent click ****/

async function ScReagentClick(Handle)
{
  if (AnimRunning) return;

  if (typeof(Handle) == 'string')
    Handle = Scene.querySelector('#' + Handle);

  /**** Check if the analyte is already selected ****/

  if ((Handle == AnalyteHandle) && (!AnalyteID)) {
    ShowError(Msg.SsBeforeAna, ScMenuAna);
    return;
  }

  var Delay = 0;

  if ((GlassReady.Obj) &&
      ((GlassReady.Obj.Type === GLASS_TYPE_STIRRER) ||
       (GlassReady.Obj.Type === GLASS_TYPE_DROPPER))) {
    ScGlassWareClick(GlassReady.Obj, GLASS_CLICK_LEAVE);
    await WaitAnimEnd(500);
  }

  AnimRunning = true;
  if (ReaReady.Handle) {
    var Curve = document.querySelector('#AnimReaRevTrack');
    Curve.querySelector('#Pt2').setAttribute('position', ReaReady.x + ' ' + ReaReady.y + ' ' + (ReaReady.z + REA_ANIM_SOLID_OFFSET));
    Curve.querySelector('#Pt3').setAttribute('position', ReaReady.x + ' ' + ReaReady.y + ' ' + ReaReady.z);


    if (ReaReady.State == PHYS_STATE_SOLID) {
      Curve = document.querySelector('#AnimReaCapRevTrack');
      Curve.querySelector('#Pt2').setAttribute('position', ReaReady.CapX + ' ' + (ReaReady.CapY + REA_ANIM_LIQUID_OFFSET) + ' ' + ReaReady.CapZ);
      Curve.querySelector('#Pt3').setAttribute('position', ReaReady.CapX + ' ' + ReaReady.CapY + ' ' + ReaReady.CapZ);

      ReaReady.Handle.querySelector('#Cap').setAttribute('alongpath', 'delay: 0; curve: #AnimReaCapRevTrack');
      Delay = 1000;
    }
    ReaReady.Handle.setAttribute('alongpath', 'delay: ' + Delay + '; curve: #AnimReaRevTrack');

    if (ReaReady.Handle === Handle) {
      ReaReady.Handle  = null;
      ReaReady.Pipette = null;

      setTimeout(function () {
        AnimRunning = false;
      }, Delay + 1000);

      return;
    }
  }

  var Position       = Handle.getAttribute('position');
  ReaReady.Adspect   = parseInt(Handle.getAttribute('ReaPhysicalAdspect'));
  ReaReady.Id        = parseInt(Handle.id.split('_')[1]);
  ReaReady.Handle    = Handle;
  ReaReady.x         = Position.x;
  ReaReady.y         = Position.y;
  ReaReady.z         = Position.z;
  ReaReady.Water     = eval(Handle.getAttribute('ReaWater'));
  ReaReady.WaterMisc = eval(Handle.getAttribute('ReaWaterMisc'));

  var Curve = document.querySelector('#AnimReaTrack');
  Curve.querySelector('#Pt1').setAttribute('position', ReaReady.x + ' ' + ReaReady.y + ' ' + ReaReady.z);
  Curve.querySelector('#Pt2').setAttribute('position', ReaReady.x + ' ' + ReaReady.y + ' ' + (ReaReady.z + REA_ANIM_SOLID_OFFSET));

  Handle.setAttribute('alongpath', 'delay: ' + Delay + '; curve: #AnimReaTrack');

  if (Handle.getAttribute('ReaPhysicalState') == 'solid') {
    var Cap = Handle.querySelector('#Cap');
    Position       = Cap.getAttribute('position');
    ReaReady.CapX  = Position.x;
    ReaReady.CapY  = Position.y;
    ReaReady.CapZ  = Position.z;
    ReaReady.Color = Handle.querySelector('#Solid').getAttribute('color');
    Curve = document.querySelector('#AnimReaCapTrack');
    Curve.querySelector('#Pt1').setAttribute('position', Position.x + ' ' + Position.y + ' ' + Position.z);
    Curve.querySelector('#Pt2').setAttribute('position', Position.x + ' ' + (Position.y + REA_ANIM_LIQUID_OFFSET) + ' ' + Position.z);
    Cap.setAttribute('alongpath', 'delay: ' + (Delay + 1000) +'; curve: #AnimReaCapTrack');
    ReaReady.State    = PHYS_STATE_SOLID;
    ReaReady.Pipette  = null;
    Delay            += 1000;
  } else {
    ReaReady.Color   = Handle.querySelector('#Liquid').getAttribute('color');
    ReaReady.Pipette = Handle.querySelector('#Pipette');
    ReaReady.State   = PHYS_STATE_LIQUID;
  }

  setTimeout(function () {
    AnimRunning = false;
  }, Delay + 1000);
}


/**** Reagent pipette click ****/

function ScReaPipetteClick(Rubber)
{
  if (AnimRunning) return;

  if ((!ReaReady.Pipette) || (!GlassReady.Handle) ||
      ((Rubber) && (Rubber !== ReaReady.Pipette.querySelector('#Rubber')))) {
    Speak(Msg.SsCantUseDropper);
    return;
  }

  var GlassObj = GlassReady.Obj;

  if (!GlassObj.Reagent) {
    Speak(Msg.SsCantAddReagent);
    return;
  }

  if (!GlassIsClean(GlassObj)) return;

  /**** Check the test tube ****/

  if (GlassReady.Obj.Type === GLASS_TYPE_TESTTUBE) {
    if (GlassObj.PaperID === REA_ID_UNIVIND) {
      Speak(Msg.SsCantAddReagentInd);
      return;
    }

    if ((ReaReady.Id === REA_ID_CH2CL2) &&
        (GlassObj.ReaID.indexOf(REA_ID_CH2CL2) !== -1)) {
      Speak(Msg.SsCantAddCH2Cl22);
      return;
    }
  } else if (ReaReady.Id === REA_ID_CH2CL2) {
    Speak(Msg.SsCantAddCH2Cl21);
    return;
  }

  RingTest = ((RingTestCheck(GlassObj)) && (GlassObj.Stirred) &&
              (ReaReady.Id === REA_ID_H2SO4_CONC));

  /**** Add the reagent ****/

  if ((GlassObj.Type === GLASS_TYPE_TESTTUBE) && (GlassObj.PaperID === REA_ID_PAPER)) {
    if (GlassObj.PaperReaID) {
      Speak((GlassObj.PaperReaID === ReaReady.Id) ? Msg.SsCantAddReagentPaper2 : Msg.SsCantAddReagentPaper1);
      return;
    }
    GlassObj.PaperColor = ReaReady.Color;
    GlassObj.PaperReaID = ReaReady.Id;
    GlassObj.PaperWater = true;
  } else {
    if (ReaReady.Water) GlassObj.Water = true;
    if (GlassObj.LiqLvl < GlassObj.LiqLvlMax) ++GlassObj.LiqLvl;
    if (ReaReady.Id === REA_ID_CH2CL2) GlassObj.OrgColor = ReaReady.Color ? ReaReady.Color : COLOR_WHITE;

    if (GlassObj.ReaNum) {
      GlassObj.LiqColor = ColorBlend(GlassObj.LiqColor, ReaReady.Color, 1 / GlassObj.LiqLvl);
      if (ReaAdd(GlassObj, ReaReady.Id, 1, ADSPECT_LIQUID))
        GlassObj.Stirred = (((GlassObj.ReaNum) === 1) && (!AnaID));

    } else {
      ReaAdd(GlassObj, ReaReady.Id, 1, ADSPECT_LIQUID);
      GlassObj.LiqColor = ReaReady.Color ? ReaReady.Color : COLOR_WHITE;
      GlassObj.Stirred  = false;
    }

    GlassObj.CentTime = 0;
    GlassObj.Clean    = false;
    GlassObj.Stirred  = false;
  }
  GlassObj.HeatTime = 0;

  /**** Perform the animation ****/

  var Glass     = GlassReady.Handle;
  var EmptyTime = 500;
  var Pipette   = ReaReady.Pipette;
  var StartPos  = Pipette.getAttribute('position');
  var TargetPos = PositionToLocal(ReaReady.Handle, Glass);
  var MoveUp    = TargetPos.y + 0.1;
  var MoveDown  = TargetPos.y;

  Rubber        = ReaReady.Pipette.querySelector('#Rubber');

  switch(GlassObj.Type) {
  case GLASS_TYPE_BEAKER:
    MoveUp   = TargetPos.y + 0.5;
    break;

  case GLASS_TYPE_CURCIBLE:
    MoveDown = TargetPos.y - 0.2;
    break;

  case GLASS_TYPE_TESTTUBE:
    MoveUp   = TargetPos.y + 0.3;
    if (RingTest) MoveDown = TargetPos.y;
    else MoveDown = TargetPos.y + (GlassObj.PaperID ? 0.2 : -0.1);
    break;

  case GLASS_TYPE_WATCHGLASS:
    MoveDown = TargetPos.y - 0.6;
    break;
  } /* End of switch */

  if (RingTest) {
    EmptyTime = 3000;

    /**** Rotate the test tube ****/

    var StartRot  = Glass.getAttribute('rotation');
    var StartRotZ = StartRot.z - 45;

    Glass.removeAttribute('animation__1');
    Glass.removeAttribute('animation__2');
    Glass.setAttribute('animation__1', 'dur: 1000; property: rotation' +
                       '; from: '+ StartRot.x + ' ' + StartRot.y + ' ' + StartRot.z +
                       '; to: '  + StartRot.x + ' ' + StartRot.y + ' ' + StartRotZ);

    Glass.setAttribute('animation__2', 'delay: ' + (3700 + EmptyTime) + '; dur: 1500; property: rotation' +
                       '; from: '+ StartRot.x + ' ' + StartRot.y + ' ' + StartRotZ +
                       '; to: '  + StartRot.x + ' ' + StartRot.y + ' ' + StartRot.z);

    /**** Rotate the pipette ****/

    StartRot  = Glass.getAttribute('rotation');
    StartRotZ = StartRot.z - 45;
    Pipette.removeAttribute('animation__4r');
    Pipette.removeAttribute('animation__9r');

    Pipette.setAttribute('animation__4r', 'delay: 1600; dur: 500; property: rotation' +
                         '; from: '+ StartRot.x + ' ' + StartRot.y + ' ' + StartRot.z +
                         '; to: '  + StartRot.x + ' ' + StartRot.y + ' ' + StartRotZ);
    Pipette.setAttribute('animation__9r', 'delay: ' + (3700 + EmptyTime) + '; dur: 1000; property: rotation' +
                         '; from: '+ StartRot.x + ' ' + StartRot.y + ' ' + StartRotZ +
                         '; to: '  + StartRot.x + ' ' + StartRot.y + ' ' + StartRot.z)
  }

  Rubber.removeAttribute('animation__1');
  Rubber.removeAttribute('animation__2');

  Pipette.removeAttribute('animation__3');
  Pipette.removeAttribute('animation__4');
  Pipette.removeAttribute('animation__5');
  Rubber.removeAttribute('animation__6');
  Rubber.removeAttribute('animation__7');
  Pipette.removeAttribute('animation__8');
  Pipette.removeAttribute('animation__9');
  Pipette.removeAttribute('animation__L');

  AnimRunning = true;

  Rubber.setAttribute('animation__1', 'dur: 500; property: scale; from: 1 1 1; to: 0.5 1 1');
  Rubber.setAttribute('animation__2', 'delay: 600; dur: 500; property: scale; from: 0.5 1 1; to: 1 1 1');

  Pipette.setAttribute('animation__3', 'delay: 1100; dur: 500; property: position ' +
                       '; from: ' + StartPos.x + ' ' + StartPos.y + ' ' + StartPos.z +
                       '; to: '   + StartPos.x + ' ' + MoveUp     + ' ' + StartPos.z);

  Pipette.setAttribute('animation__4', 'delay: 1600; dur: 500; property: position ' +
                       '; from: ' + StartPos.x  + ' ' + MoveUp     + ' ' + StartPos.z +
                       '; to: '   + TargetPos.x + ' ' + MoveUp     + ' ' + TargetPos.z);

  Pipette.setAttribute('animation__5', 'delay: 2100; dur: 500; property: position; ' +
                       '; from: ' + TargetPos.x + ' ' + MoveUp     + ' ' + TargetPos.z +
                       '; to: '   + TargetPos.x + ' ' + MoveDown   + ' ' + TargetPos.z);

  /**** Empty the pipette ****/

  Rubber.setAttribute('animation__6', 'delay: 2600; dur: ' + EmptyTime +'; property: scale; from: 1 1 1; to: 0.5 1 1');

  setTimeout(function() {
    var Elem = GlassObj.Handle.querySelectorAll('[id^="Liquid"]');
    for(var i = 0; i < Elem.length; i++)
      Elem[i].setAttribute('visible', false);
    var Level = GlassObj.Handle.querySelector("#Liquid-" + (GlassObj.LiqLvl * 10));
    if (Level) {
      ColorSet(Level, GlassObj.LiqColor);
      Level.setAttribute('visible', true);
    }
    Reaction(GlassObj);
  }, 2600 + EmptyTime);

  Rubber.setAttribute('animation__7', 'delay: ' + (2700 + EmptyTime) + '; dur: 500; property: scale; from: 0.5 1 1; to: 1 1 1');

  Pipette.setAttribute('animation__8', 'delay: ' + (3200 + EmptyTime) + '; dur: 500; property: position ' +
                       '; from: ' + TargetPos.x + ' ' + MoveDown + ' ' + TargetPos.z +
                        '; to: '  + TargetPos.x + ' ' + MoveUp   + ' ' + TargetPos.z);
  Pipette.setAttribute('animation__9', 'delay: ' + (3700 + EmptyTime) + '; dur: 500; property: position ' +
                       '; from: ' + TargetPos.x + ' ' + MoveUp     + ' ' + TargetPos.z +
                       '; to: '   + StartPos.x  + ' ' + MoveUp     + ' ' + StartPos.z);
  Pipette.setAttribute('animation__L', 'delay: ' + (4200 + EmptyTime) + '; dur: 500; property: position ' +
                       '; from: ' + StartPos.x + ' ' + MoveUp     + ' ' + StartPos.z +
                       '; to: '   + StartPos.x + ' ' + StartPos.y + ' ' + StartPos.z);
}


/**** Smell ****/

function ScSmellClick(Glass)
{
  if (!Glass) Glass = GlassReady.Obj;

  if (Glass === TestTube) {
    Glass = TestTube1;
    for(var Tube of TestTube) {
      if (Tube === GlassReady.Obj) {
        Glass = Tube;
        break;
      }
    } /* End of for (Tube) */
  }

  if (Glass) {

    /**** Check if the tube is in centrifuge ****/

    if ((Glass.Dock === Centrifuge.Handle) && (!Centrifuge.Open)) {
      Speak(Msg.SsSmellTubeCent);
      return;
    }

    /**** Check the paper ****/

    if ((Glass.Type === GLASS_TYPE_TESTTUBE) && (Glass.PaperID)) {
      Speak(Msg.SsSmellTubePaper);
      return;
    }
  }

  PlaySound(Scene.querySelector('#SND_Sniff'));

  setTimeout(function() {
    if (!Glass) {
      if ((Bunsen.On) && (!Bunsen.Burning)) {
        Speak(Msg.SsSmellGas1);
        return;
      }
      Speak(Msg.SsSmellNoneAmbient);
      return;
    } else if (Glass.SmellID === SMELL_NONE) {
      ShowError(Msg.SsSmellNone);
      return;
    }

    ShowError(Msg.SsSmell + ' ' + GetSmellByID(Glass.SmellID));
  }, 1500);
}


/**** Spatula click ****/

function ScSpatulaClick()
{
  if (AnimRunning) return;

  var GlassObj = GlassReady.Obj;

  if ((!ReaReady.Handle) || (ReaReady.State != PHYS_STATE_SOLID) ||
      (!GlassObj) || (!GlassObj.Reagent)) {
    Speak(Msg.SsCantUseSpatula);
    return;
  }

  /**** Check if there is the paper ****/

  if (GlassObj.PaperID) {
    if ((ReaReady.Id === REA_ID_PAPER) || (ReaReady.Id === REA_ID_UNIVIND)) {
      Speak(Msg.SsPaperAlready);
      return;
    }

    if (ReaReady.State === PHYS_STATE_SOLID) {
      Speak((GlassObj.Type === GLASS_TYPE_TESTTUBE) ? Msg.SsPaperTubeClose : Msg.SsPaperWithSolid);
      return;
    }
  }

  /**** Check the Cu plate ****/

  if ((GlassObj.ReaNum) && (GlassObj.ReaID.indexOf(REA_ID_CU) !== -1)) {
    Speak(Msg.SsCuAlready);
    return;
  }

  /**** Check if it is clean ****/

  if (!GlassIsClean(GlassObj)) return;

  var ReaPos    = ReaReady.Handle.getAttribute('position');
  var StartPos  = Spatula.getAttribute('position');
  var TargetPos = PositionToLocal(Workbench, GlassReady.Handle);

  if ((ReaReady.Id === REA_ID_PAPER) || (ReaReady.Id === REA_ID_UNIVIND)) {
    GlassObj.PaperID    = ReaReady.Id;
    GlassObj.PaperColor = ReaReady.Color;
  } else if (ReaReady.Handle == AnalyteHandle) {
    if (GlassObj.AnaID) {
      Speak(Msg.SsAnaAlready);
      return;
    }
    GlassObj.AnaID    = AnalyteID;
    GlassObj.AnaQty  += 1;
    GlassObj.Stirred  = (!GlassObj.ReaNum) && (!GlassObj.Water);
  } else {
    ReaAdd(GlassObj, ReaReady.Id, 1, ReaReady.Adspect);
    if (GlassObj.ReaNum) GlassObj.Stirred = false;
    else GlassObj.Stirred = !GlassObj.Water;
  }
  GlassObj.CentTime   = 0;
  GlassObj.HeatTime   = 0;
  GlassObj.SolidColor = GlassObj.SolidColor ? ColorBlend(GlassObj.SolidColor, ReaReady.Color) : ReaReady.Color;

  switch(GlassReady.Obj.Type) {
  case GLASS_TYPE_BEAKER:
    TargetPos.y += 0.15;
    break;

  case GLASS_TYPE_CURCIBLE:
    TargetPos.y += 0.07;
    break;

  case GLASS_TYPE_TESTTUBE:
    TargetPos.y += 0.12;
    break;

/*
  case GLASS_TYPE_WATCHGLASS:
    MoveUp   = 0;
    break;
*/
  } /* End of switch */


  Spatula.removeAttribute('animation__1');
  Spatula.removeAttribute('animation__2');
  Spatula.removeAttribute('animation__3');
  Spatula.removeAttribute('animation__4');
  Spatula.removeAttribute('animation__5');
  Spatula.removeAttribute('animation__6');
  Spatula.removeAttribute('animation__7');
  Spatula.removeAttribute('animation__8');
  Spatula.removeAttribute('animation__9');
  Spatula.removeAttribute('animation__10');
  Spatula.removeAttribute('animation__L');
  AnimRunning = true;

  Spatula.setAttribute('animation__1', 'dur: 500; property: rotation; from: 90 0 0; to: 45 90 0');
  Spatula.setAttribute('animation__2', 'dur: 500; property: position ' +
                       '; from: ' + StartPos.x + ' ' + StartPos.y + ' ' + StartPos.z +
                       '; to: '   + StartPos.x + ' ' + (StartPos.y + 0.10) + ' ' + StartPos.z);
  Spatula.setAttribute('animation__3', 'delay: 500; dur: 500; property: position ' +
                       '; from: ' + StartPos.x         + ' ' + (StartPos.y + 0.10) + ' ' + StartPos.z +
                       '; to: '   + (ReaPos.x + 0.07)  + ' ' + (StartPos.y + 0.10) + ' ' + ReaPos.z);

  Spatula.setAttribute('animation__4', 'delay: 1000; dur: 500; property: position ' +
                       '; from: ' + (ReaPos.x + 0.07)  + ' ' + (StartPos.y + 0.100) + ' ' + ReaPos.z +
                       '; to: '   + (ReaPos.x + 0.06)  + ' ' + (StartPos.y + 0.075) + ' ' + ReaPos.z);
  Spatula.setAttribute('animation__5', 'delay: 1500; dur: 250; property: rotation; from: 45 90 0; to: 70 90 0');
  Spatula.setAttribute('animation__6', 'delay: 1750; dur: 500; property: position ' +
                       '; from: ' + (ReaPos.x    + 0.06)  + ' ' + (StartPos.y  + 0.075) + ' ' + ReaPos.z +
                       '; to: '   + (TargetPos.x + 0.07)  + ' ' + TargetPos.y           + ' ' + TargetPos.z);

  Spatula.setAttribute('animation__7', 'delay: 2250; dur: 250; property: rotation; from: 70 90 0; to: 0  90 0');
  Spatula.setAttribute('animation__8', 'delay: 2250; dur: 250; property: position ' +
                       '; from: ' + (TargetPos.x + 0.07)  + ' ' + TargetPos.y + ' ' + TargetPos.z +
                       '; to: '   + TargetPos.x           + ' ' + TargetPos.y + ' ' + TargetPos.z);

  Spatula.setAttribute('animation__9' , 'delay: 2700; dur: 250; property: rotation; from: 0 90 0; to: 45 90 0');
  Spatula.setAttribute('animation__L', 'delay: 2850; dur: 500; property: position ' +
                       '; from: ' + TargetPos.x  + ' ' + TargetPos.y + ' ' + TargetPos.z +
                       '; to: '   + StartPos.x   + ' ' + StartPos.y  + ' ' + StartPos.z);
  Spatula.setAttribute('animation__10' , 'delay: 3000; dur: 250; property: rotation; from: 45 90 0; to: 90 0 0');
}


/**** Stirrer click ****/

async function ScStirrerClick(Target)
{
  if (AnimRunning) return;

  if (!Target.Stirrer) {
    Speak(Msg.SsCantUseStirrer);
    return;
  }

  if (GlassIsEmpty(Target)) {
    Speak(Msg.SsStirrerNothing);
    return;
  }

  if (Target.Burning) {
    Speak(Msg.SsCantBurning);
    return;
  }

  if ((Target.Type === GLASS_TYPE_TESTTUBE) && (Target.PaperID)) {
    Speak(Msg.SsStirrerPaper);
    return;
  }

  if (!GlassSameSubst(Stirrer, Target) && !GlassIsClean(Stirrer)) return;

  var MoveDown, MoveUp;

  var hRotCent = Stirrer.Handle.querySelector('#RotCent');

  /**** Contaminate the stirrer ****/

  Stirrer.AnaID      = Target.AnaID;
  Stirrer.Clean      = false;
  Stirrer.ReaAdspect = Array.from(Target.ReaAdspect);
  Stirrer.ReaID      = Array.from(Target.ReaID);
  Stirrer.ReaNum     = Target.ReaNum;
  Stirrer.SmellID    = Target.SmellID;
  Stirrer.Water      = Target.Water;

  switch(Target.Type) {
  case GLASS_TYPE_BEAKER:
    MoveUp   = 0;
    MoveDown = 0.057;
    break;

  case GLASS_TYPE_CURCIBLE:
    MoveUp   = 0;
    MoveDown = 0.05;
    break;

  case GLASS_TYPE_TESTTUBE:
    MoveUp   = 0.180;
    MoveDown = 0.035;
    break;

  case GLASS_TYPE_WATCHGLASS:
    MoveUp   = 0;
    MoveDown = 0.05;
    break;
  } /* End of switch */

  AnimRunning = true;
  await Sleep(MoveToTarget(Target.Handle, MoveUp, MoveDown));

  hRotCent.removeAttribute('animation__1');
  Stirrer.Handle.removeAttribute('animation__1');
  Stirrer.Handle.removeAttribute('animation__2');

  var StartPos  = Stirrer.Handle.getAttribute('position');
  Stirrer.Handle.setAttribute('animation__1', 'dur: 100; property: position ' +
                              '; from: ' + StartPos.x            + ' ' + StartPos.y + ' ' + StartPos.z +
                              '; to: '   + (StartPos.x + 0.007)  + ' ' + StartPos.y + ' ' + StartPos.z);

  hRotCent.setAttribute('animation__1', 'dur: 500; property: rotation; from: 0 0 0; to: 0 360 0; easing: linear; loop: 6');

  Stirrer.Handle.setAttribute('animation__2', 'delay: 3000; dur: 100; property: position ' +
                              '; from: ' + (StartPos.x + 0.007) + ' ' + StartPos.y + ' ' + StartPos.z +
                              '; to: '   + StartPos.x           + ' ' + StartPos.y + ' ' + StartPos.z);

  await Sleep(ReturnFromTarget(3100, true));
  Target.Stirred = true;
  Reaction(Target);

  /**** Resuspend the solid ****/

  if ((Target.Water) && (GlassPrecipitate(Target)) &&
      (Target.LiqAdspect !== ADSPECT_LIQUID_SUSP)) {
    Target.LiqAdspect = ADSPECT_LIQUID_SUSP;
    LiquidUpdate(Target);
  }
}


/**** Trash click ****/

function ScTrashClick()
{
  if (AnimRunning) return;

  if (!GlassReady.Handle) {
    Speak(Msg.SsCantEmpty);
    return;
  }

  if (GlassReady.Obj.Type === GLASS_TYPE_LIGHTER) {
    Speak(Msg.SsCantEmptyLighter);
    return;
  }

  if (GlassReady.Obj.Type === GLASS_TYPE_STIRRER) {
    Speak(Msg.SsCantEmptyStirrer);
    return;
  }

  if (GlassIsEmpty(GlassReady.Obj)) {
    Speak(Msg.SsAlreadyEmpty);
    return;
  }

  var   Delay;
  var   EndPos    = PositionToLocal((GlassReady.Obj.Type === GLASS_TYPE_TESTTUBE) ? Rack : Workbench, Trash);
  var   Handle    = GlassReady.Handle;
  var   StartPos  = Handle.getAttribute('position');
  var   StartRot  = Handle.getAttribute('rotation');
  var   StartRotZ = 0;
  var   EndRotZ   = StartRot.z;

  EndPos.y = StartPos.y;

  switch(GlassReady.Obj.Type) {
  case GLASS_TYPE_BEAKER:
    Delay     = 2000;
    EndPos.x += 0.05;
    EndPos.y += 0.04;
    EndRotZ  += 120;
    break;

  case GLASS_TYPE_CURCIBLE:
    Delay     = 1000;
    EndPos.x += 0.02;
    EndRotZ  += 70;
    break;

  case GLASS_TYPE_DROPPER:
    Delay     = 1000;
    EndPos.y += 0.1;
    break;

  case GLASS_TYPE_TESTTUBE:
    Delay     = 1000;
    EndPos.x -= 0.1;
    EndPos.y  = StartPos.y - 1.5;
    EndRotZ  -= 170;
    StartRotZ = StartRot.z - 45;
    break;

  case GLASS_TYPE_WATCHGLASS:
    Delay     = 500;
    EndPos.x -= 0.02;
    EndRotZ  += 45;
    break;
  } /* End of switch */

  Handle.removeAttribute('animation__1');
  Handle.removeAttribute('animation__2');
  Handle.removeAttribute('animation__3');
  Handle.removeAttribute('animation__L');

  AnimRunning = true;

  if (StartRotZ) {
    Handle.removeAttribute('animation__0');
    Handle.removeAttribute('animation__4');

    Handle.setAttribute('animation__0', 'dur: 1000; property: rotation' +
                        '; from: '+ StartRot.x + ' ' + StartRot.y + ' ' + StartRot.z +
                        '; to: '  + StartRot.x + ' ' + StartRot.y + ' ' + StartRotZ);

    Handle.setAttribute('animation__4', 'delay: ' + (2000 + Delay) + '; dur: 1000; property: rotation' +
                        '; from: '  + StartRot.x + ' ' + StartRot.y + ' ' + StartRotZ +
                        '; to: '+ StartRot.x + ' ' + StartRot.y + ' ' + StartRot.z);
  }


  Handle.setAttribute('animation__1', 'dur: 1000; property: position' +
                      '; from: '+ StartPos.x + ' ' + StartPos.y + ' ' + StartPos.z +
                      '; to: '  + EndPos.x   + ' ' + EndPos.y + ' ' + EndPos.z);

  Handle.setAttribute('animation__2', 'delay: 1000; dur: 500; property: rotation' +
                      '; from: '+ StartRot.x + ' ' + StartRot.y + ' ' + StartRotZ +
                      '; to: '  + StartRot.x + ' ' + StartRot.y + ' ' + EndRotZ);

  if (GlassReady.Obj.Type === GLASS_TYPE_DROPPER) {
    var Rubber = Handle.querySelector('#Rubber');
    Rubber.removeAttribute('animation__1t');
    Rubber.removeAttribute('animation__2t');
    Rubber.setAttribute('animation__1t', 'delay: 1500; dur: 500; property: scale; from: 1 1 1; to: 0.5 1 1');
    Rubber.setAttribute('animation__2t', 'delay: 2100; dur: 500; property: scale; from: 0.5 1 1; to: 1 1 1');
  }

  Handle.setAttribute('animation__3', 'delay: ' + (1500 + Delay) + '; dur: 500; property: rotation' +
                      '; from: '+ StartRot.x + ' ' + StartRot.y + ' ' + EndRotZ +
                      '; to: '  + StartRot.x + ' ' + StartRot.y + ' ' + StartRotZ);

  Handle.setAttribute('animation__L', 'delay: ' + (2000 + Delay) + '; dur: 1000; property: position' +
                      '; from: ' + EndPos.x   + ' ' + EndPos.y   + ' ' + EndPos.z +
                      '; to: '   + StartPos.x + ' ' + StartPos.y + ' ' + StartPos.z);


  setTimeout(function() {
    if ((GlassReady.Obj.Water) ||
        (GlassReady.Obj.ReaID.indexOf(REA_ID_CH2CL2) !== -1))
      PlaySound(Trash.querySelector('#SND_LiquidDrain'));

    if ((GlassReady.Obj.Type === GLASS_TYPE_DROPPER) && (!GlassWater(GlassReady.Obj)))
      GlassEmpty(GlassReady.Obj, ~EMPTY_SUBST);
    else
      GlassEmpty(GlassReady.Obj);
  }, 1500 + Delay / 2);
}


/**** Trash double click ****/

async function ScTrashDblClick()
{
  if (AnimRunning) return;

  if (GlassIsEmpty(Beaker   ) && GlassIsEmpty(Curcible  ) &&
      GlassIsEmpty(Dropper  ) && GlassIsEmpty(TestTube1 ) &&
      GlassIsEmpty(TestTube2) && GlassIsEmpty(TestTube3 ) &&
      GlassIsEmpty(TestTube4) && GlassIsEmpty(WatchGlass)) {
    Speak(Msg.SsAlreadyEmptyAll);
    return;
  }

  var Obj = GlassReady.Obj;

  if ((Obj) &&
      (((Obj === Dropper) && (GlassIsEmpty(Dropper)) ||
       ((Obj !== Beaker    ) && (Obj !== Curcible  ) &&
        (Obj !== Dropper   ) && (Obj !== WatchGlass) &&
        (Obj !== TestTube1 ) && (Obj !== TestTube2 ) &&
        (Obj !== TestTube3 ) && (Obj !== TestTube4 ))))) {
    ScGlassWareClick(Obj, GLASS_CLICK_LEAVE);
    await WaitAnimEnd(500);
    Obj = null;
  }

  if ((Obj) && (!GlassIsEmpty(Obj))) {
    ScTrashClick();
    await WaitAnimEnd(500);

    if (Obj === Dropper) {
      ScGlassWareClick(Dropper, GLASS_CLICK_LEAVE);
      await WaitAnimEnd(500);
    }
  }

  if (Obj !== Beaker  ) await ScTrashObj(Beaker);
  if (Obj !== Curcible) await ScTrashObj(Curcible);

  if ((Obj !== Dropper) && (!GlassIsEmpty(Dropper))) {
    await ScTrashObj(Dropper);
    ScGlassWareClick(Dropper, GLASS_CLICK_LEAVE);
    await WaitAnimEnd(500);
  }
  if (Obj !== WatchGlass) await ScTrashObj(WatchGlass);

  for(var Tube of TestTube) {
    if ((Obj !== Tube) &&
        ((Tube.Dock !== Centrifuge.Handle) || (Centrifuge.Open)))
      await ScTrashObj(Tube);
  } /* End of for (Tube) */

/*
  if (GlassReady.Obj)
    ScGlassWareClick(GlassReady.Obj, GLASS_CLICK_LEAVE);
*/
}


/**** Select and throw away the glassware ****/

async function ScTrashObj(Glass)
{
  if (GlassIsEmpty(Glass)) return;

  ScGlassWareClick(Glass, GLASS_CLICK_TAKE);
  await WaitAnimEnd(500);
  ScTrashClick();
  await WaitAnimEnd(500);
  ScGlassWareClick(Glass, GLASS_CLICK_LEAVE);
  await WaitAnimEnd(500);
}


/**** Tube paper click ****/

function ScTubePaperClick(Tube)
{
  if (AnimRunning) return;

  if (!Tube) {
    Tube = GlassReady.Obj;
    if (!Tube) {
      Speak(Msg.SsCantEmpty);
      return;
    }
  }

  if (!Tube.PaperID) {
    Speak(Msg.SsPaperNotPresent);
    return;
  }

  if (Tube.Type !== GLASS_TYPE_TESTTUBE) {
    Speak(Msg.SsPaperNoTrash);
    return;
  }

  var   hPaper   = Tube.Handle.querySelector('#Solid-Paper');
  var   EndPos   = PositionToLocal(Tube.Handle, Trash);
  var   StartPos = hPaper.getAttribute('position');

  hPaper.removeAttribute('animation__1');
  hPaper.removeAttribute('animation__L');

  AnimRunning = true;

  hPaper.setAttribute('animation__1', 'dur: 1000; property: position' +
                      '; from: '+ StartPos.x + ' ' + StartPos.y + ' ' + StartPos.z +
                      '; to: '  + EndPos.x   + ' ' + StartPos.y + ' ' + EndPos.z);
  hPaper.setAttribute('animation__L', 'delay: 1000; dur: 1000; property: position' +
                      '; from: '+ EndPos.x + ' ' + StartPos.y + ' ' + EndPos.z +
                      '; to: '  + EndPos.x + ' ' + EndPos.y   + ' ' + EndPos.z);
}



/**** Wash bottle click ****/

async function ScWashBottleClick()
{
  if (AnimRunning) return;

  var GlassObj = GlassReady.Obj;

  if ((!GlassObj) || (!GlassObj.WashBottle)) {
    Speak(Msg.SsCantUseWashBottle);
    return;
  }

  var WashHandle = WashBottle.Handle;

  /**** Add the water ****/

  if (GlassObj === Stirrer) {
    GlassEmpty(Stirrer);
    await Sleep(MoveToTarget(Trash, 0.10));
    GlassObj.Water = true;
  }

  var Bottle    = WashHandle.querySelector('#Bottle');
  var TargetPos = PositionToLocal(Workbench, GlassReady.Handle);
  var MoveUp    = TargetPos.y + 0.05;
  var MoveDown;

  GlassObj.HeatTime  = 0;
  RingTest           = false;
  TargetPos.x       += 0.19;

  switch(GlassReady.Obj.Type) {
  case GLASS_TYPE_BEAKER:
    MoveDown = TargetPos.y - 0.03;
    break;

  case GLASS_TYPE_CURCIBLE:
  case GLASS_TYPE_STIRRER:
    MoveDown = TargetPos.y - 0.07;
    break;

  case GLASS_TYPE_TESTTUBE:
    MoveDown = TargetPos.y + (GlassReady.Obj.PaperID ?  -0.02 : -0.07);
    break;

  case GLASS_TYPE_WATCHGLASS:
    MoveDown = TargetPos.y - 0.14;
    break;
  } /* End of switch */


  WashHandle.removeAttribute('animation__1');
  WashHandle.removeAttribute('animation__2');
  WashHandle.removeAttribute('animation__3');
  WashHandle.removeAttribute('animation__4');
  Bottle.removeAttribute('animation__5');
  Bottle.removeAttribute('animation__6');
  WashHandle.removeAttribute('animation__7');
  WashHandle.removeAttribute('animation__8');
  WashHandle.removeAttribute('animation__9');
  WashHandle.removeAttribute('animation__L');

  AnimRunning = true;

  WashHandle.setAttribute('animation__1', 'dur: 500; property: position ' +
                          '; from: ' + WashBottle.PosX + ' ' + WashBottle.PosY + ' ' + WashBottle.PosZ +
                          '; to: '   + WashBottle.PosX + ' ' + MoveUp          + ' ' + WashBottle.PosZ);
  WashHandle.setAttribute('animation__2', 'dur: 500; property: rotation; from: 0 0 0; to: 0 0 45');
  WashHandle.setAttribute('animation__3', 'delay: 500; dur: 500; property: position ' +
                          '; from: ' + WashBottle.PosX  + ' ' + MoveUp     + ' ' + WashBottle.PosZ +
                          '; to: '   + TargetPos.x      + ' ' + MoveUp     + ' ' + TargetPos.z);
  WashHandle.setAttribute('animation__4', 'delay: 1000; dur: 500; property: position; ' +
                          '; from: ' + TargetPos.x + ' ' + MoveUp     + ' ' + TargetPos.z +
                          '; to: '   + TargetPos.x + ' ' + MoveDown   + ' ' + TargetPos.z);

  Bottle.setAttribute('animation__5', 'delay: 1500; dur: 500; property: scale; from: 1 1 1; to: 0.9 1 1');

  if (GlassReady.Obj === Stirrer)
    ReturnFromTarget(2300, false);

  Bottle.setAttribute('animation__6', 'delay: 2300; dur: 500; property: scale; from: 0.9 1 1; to: 1 1 1');

  WashHandle.setAttribute('animation__7', 'delay: 2800; dur: 500; property: position ' +
                          '; from: ' + TargetPos.x + ' ' + MoveDown   + ' ' + TargetPos.z +
                          '; to: '   + TargetPos.x + ' ' + MoveUp     + ' ' + TargetPos.z);

  WashHandle.setAttribute('animation__8', 'delay: 3300; dur: 500; property: position; ' +
                          '; from: ' + TargetPos.x     + ' ' + MoveUp     + ' ' + TargetPos.z +
                          '; to: '   + WashBottle.PosX + ' ' + MoveUp     + ' ' + WashBottle.PosZ);
  WashHandle.setAttribute('animation__9', 'delay: 3800; dur: 500; property: rotation; from: 0 0 45; to: 0 0 0');
  WashHandle.setAttribute('animation__L', 'delay: 3800; dur: 500; property: position ' +
                          '; from: ' + WashBottle.PosX + ' ' + MoveUp          + ' ' + WashBottle.PosZ +
                          '; to: '   + WashBottle.PosX + ' ' + WashBottle.PosY + ' ' + WashBottle.PosZ);
}
