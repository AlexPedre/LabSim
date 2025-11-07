
/*******************************************
****         LabSim - Utilities         ****
**** (c) 2020-2025, Alessandro Pedretti ****
*******************************************/


/**** Local variables ****/

var WatchDouble = 0;


/**** Turn on/off boiling ****/

function Boil(WathObj, On)
{
  ParticleHandle = WathObj.Handle.querySelector('#BoilWater');
  if (!ParticleHandle) return;

  if (On) {
    ParticleHandle.setAttribute('particle-system', 'enabled: true');
    PlaySound('SND_BoilWater');
  } else {
    ParticleHandle.setAttribute('particle-system', 'enabled: false');
    StopSound('SND_BoilWater');
  }

  DisableShadowAll();
  WathObj.Boiling = On;
}


/**** Turn on/off boiling with delay ****/

function BoilDelay(WathObj, On, Delay)
{
  if ((!WathObj) || (!WathObj.Water) ||
      ((WathObj.Boiling) && (On)) ||
      ((!WathObj.Boiling) && (!On)))
    return;

  setTimeout(function() {
    Boil(WathObj, On);
  }, Delay ? Delay : (On ? BOIL_DELAY_START : BOIL_DELAY_STOP));
}


/**** Blend two hex colors together by an amount ****/

function ColorBlend(ColorA, ColorB, Amount)
{
  if (!ColorA) ColorA = COLOR_WHITE;
  if (!ColorB) ColorB = COLOR_WHITE;
  if (!Amount) Amount = 0.5;

  const [rA, gA, bA] = ColorA.match(/\w\w/g).map((c) => parseInt(c, 16));
  const [rB, gB, bB] = ColorB.match(/\w\w/g).map((c) => parseInt(c, 16));
  const r = Math.round(rA + (rB - rA) * Amount).toString(16).padStart(2, '0');
  const g = Math.round(gA + (gB - gA) * Amount).toString(16).padStart(2, '0');
  const b = Math.round(bA + (bB - bA) * Amount).toString(16).padStart(2, '0');

  return ('#' + r + g + b).toUpperCase();
}


/**** Get the color by ID ****/

function ColorByID(ColorID)
{
  if (!ColorID) return COLOR_WHITE;

  var HtmlCode = COLOR_WHITE;
  var Stmt     = hDb.prepare('SELECT HtmlCode FROM Colors WHERE (ColorID = ' + ColorID + ');');

  if (Stmt.step())
    HtmlCode = Stmt.getAsObject().HtmlCode;
  Stmt.free();

  return HtmlCode;
}


/**** Get the color of the molecule ****/

function ColorByMolID(MolID)
{
  var HtmlCode = COLOR_WHITE;
  var Stmt     = hDb.prepare('SELECT Colors.HtmlCode FROM (Molecules INNER JOIN Colors ON Molecules.ColorID = Colors.ColorID) ' +
                             'WHERE (Molecules.MoleculeID = ' + MolID + ');');

  if (Stmt.step())
    HtmlCode = Stmt.getAsObject().HtmlCode;
  Stmt.free();

  return HtmlCode;
}


/**** Get the flame color by ID ****/

function ColorFlameByID(ColorID)
{
  if (!ColorID) ColorID = COLOR_ID_COLORLESS;

  var HtmlFlame;

  do {
    var Stmt = hDb.prepare('SELECT HtmlFlame FROM Colors WHERE (ColorID = ' + ColorID + ');');
    if (Stmt.step()) HtmlFlame = Stmt.getAsObject().HtmlFlame;
    else ColorID = COLOR_ID_COLORLESS;
    Stmt.free();
  } while(!HtmlFlame);

  return HtmlFlame;
}


/**** Get the flame color by molecule ID ****/

function ColorFlameByMolID(MolID)
{
  var FlameColor = FLAME_DEF_COLOR;
  var Stmt       = hDb.prepare('SELECT Colors.HtmlFlame FROM (Molecules INNER JOIN Ions ON Molecules.CationID1 = Ions.IonID) ' +
                               'INNER JOIN Colors ON Ions.FlameTestColorID = Colors.ColorID ' +
                               'WHERE (Molecules.MoleculeID=' + MolID + ');');

  if (Stmt.step()) {
    FlameColor = Stmt.getAsObject().HtmlFlame;

    if (FlameColor === FLAME_DEF_COLOR) {
      Stmt.free();
      Stmt = hDb.prepare('SELECT Colors.HtmlFlame FROM (Molecules INNER JOIN Ions ON Molecules.AnionID = Ions.IonID) ' +
                         'INNER JOIN Colors ON Ions.FlameTestColorID = Colors.ColorID ' +
                         'WHERE (Molecules.MoleculeID=' + MolID + ');');

      if (Stmt.step())
        FlameColor = Stmt.getAsObject().HtmlFlame;
    }
  }
  Stmt.free();

  return FlameColor;
}


/**** Get the color from pH ****/

function ColorFromPh(pH)
{
       if (pH < 4  ) return '#FF0000'; /* Red        */
  else if (pH < 6  ) return '#FF9933'; /* Orange     */
  else if (pH < 6.5) return '#FFFF00'; /* Yellow     */
  else if (pH < 7.5) return '#00CC66'; /* Green      */
  else if (pH < 9  ) return '#00FFFF'; /* Light blue */

  return '#0000FF'; /* Blue */
}


/**** Set the color of the paper ****/

function ColorPaperSet(Obj, Color)
{
  var hPaper = Obj.Handle.querySelector('#Solid-Paper');
  if (!hPaper) return;

  ColorSet(hPaper, Color);
  hPaper.setAttribute('event-set__leave', '_event: mouseleave; _subtarget: .paper-event; material.color: ' + Color);
  Obj.PaperColor = Color;
}



/**** Set the color recursively ****/

function ColorSet(Obj, Color)
{
  if (!Obj) return;
  if (!Color) Color = COLOR_WHITE;

  Primitive = Obj.querySelectorAll('*');
  if (Primitive.length) {
    for(var i = 0; i < Primitive.length; i++)
      Primitive[i].setAttribute('color'  , Color);
    return;
  }

  Obj.setAttribute('color', Color);
}


/**** Color tone ****/

function ColorTone(Col, Amt)
{
  return '#' + Col.replace(/^#/, '').replace(/../g, Col => ('0'+Math.min(255, Math.max(0, parseInt(Col, 16) + Amt)).toString(16)).substr(-2));
}


/**** Read a cookie ****/

function CookieRead(Name)
{
  if (document.cookie.length > 0) {
    var Begin = document.cookie.indexOf(Name + "=");
    if (Begin != -1) {
      Begin = Begin + Name.length + 1;
      var End = document.cookie.indexOf(";", Begin);
      if (End == -1) End = document.cookie.length;
      return unescape(document.cookie.substring(Begin, End));
    }
  }

  return "";
}


/**** Write a cookie ****/

function CookieWrite(Name, DurDays, Value)
{
  var Expires = new Date();
  var Now     = new Date();

  Expires.setTime(Now.getTime() + DurDays * 86400000); //86400000
  document.cookie = Name + '=' + escape(Value) + '; expires=' + Expires.toGMTString() + '; path=/';
}


/**** Detect the device ****/

function DetectDevice()
{
  if (AFRAME.utils.device.isMobileVR())
    return (DEVICE_TYPE_MOBILE | DEVICE_TYPE_VR);

  var Type = AFRAME.utils.device.isMobile() ? DEVICE_TYPE_MOBILE : DEVICE_TYPE_DESKTOP;
  if (AFRAME.utils.device.checkHeadsetConnected()) Type |= DEVICE_TYPE_VR;

  return Type;
}


/**** Disable the shadows ****/

function DisableShadow(Obj, Cast, Receive)
{
  Obj.setAttribute('shadow', 'cast: true; receive: true');
//  Obj.setAttribute('shadow', 'cast: false; receive: false');

  if (!Cast) Cast = 'false';
  if (!Receive) Receive = 'false';

  Obj.setAttribute('shadow', 'cast: ' + Cast + '; receive: ' + Receive);
}


/**** Disable the shadows of the objects ****/

function DisableShadowAll()
{
  DisableShadow(Dropper.Handle);
  DisableShadow(Nichrome.Handle);
  DisableShadow(Scene.querySelector('#PosCentrifuge'));
  DisableShadow(Scene.querySelector('#PosTv'));
  DisableShadow(Scene.querySelector('#PosWork'));
  DisableShadow(Spatula);
  DisableShadow(Stirrer.Handle);
  DisableShadow(Tv.Controls);
  DisableShadow(Tv.Handle.querySelector('#TvFrame'));
  DisableShadow(Scene.querySelector('#UmbrellaStand'), 'true', 'false');
  DisableShadow(WatchGlass.Handle);
  DisableShadow(Workbench.querySelector('#BookLabel'));
}


/**** Double click action ****/

function DoubleClick(FuncSingle, FuncDouble)
{
  WatchDouble += 1;
  setTimeout(function() {
    if (WatchDouble === 2) {
      if (FuncDouble) FuncDouble();
    } else if (WatchDouble === 1) {
      if (FuncSingle) FuncSingle();
    }
    WatchDouble = 0;
  }, DBLCLICK_DELAY);
}



/**** Enable/disable the sound ****/

function EnableSound(En)
{
  var Audio = Scene.querySelectorAll('[sound]');
  for(var k = 0; k < Audio.length; ++k)
    Audio[k].setAttribute('sound', 'volume: ' + (En ? '1' : '0'));

  Prefs.SoundActive = En;
}


/**** Fill the analytes ****/

function FillAnalytes()
{
  var hMenu      = document.querySelector('#DlgMenuAna');
  var OffsetX    = MENUANA_OFFSET_X;
  var OffsetY    = MENUANA_OFFSET_BEGIN_Y;

  CreateGuiButton(hMenu, 'BT_AnaCode'    , Msg.DlgMenuAnaCode    , '#990000', '#cc0000', MENUANA_OFFSET_BEGIN_X, OffsetY);
  CreateGuiButton(hMenu, 'BT_AnaRndAll'  , Msg.DlgMenuAnaRndAll  , '#009900', '#00cc00', OffsetX               , OffsetY);
  CreateGuiButton(hMenu, 'BT_AnaRndSol'  , Msg.DlgMenuAnaRndSol  , '#002966', '#003d99', OffsetX               , OffsetY);
  CreateGuiButton(hMenu, 'BT_AnaRndInsol', Msg.DlgMenuAnaRndInsol, '#664d00', '#cc9900', OffsetX               , OffsetY);

  var NumButtons = 4;
  var Rows       = 1;

  hDb.each("SELECT MoleculeID, Formula, SolWater FROM Molecules WHERE (Analyte) " +
           "ORDER BY SolWater, Formula;", function(Row) {
    var BgColor, HoColor;


    if (NumButtons % MENUANA_ITEMDBYLINE) {
      OffsetX  = MENUANA_OFFSET_X;
    } else {
      OffsetX  = MENUANA_OFFSET_BEGIN_X;
      OffsetY += MENUANA_STEP_Y;
      ++Rows;
    }

    if (Row.SolWater) {
      BgColor = '#002966';
      HoColor = '#003d99';
    } else {
      BgColor = '#664d00';
      HoColor = '#cc9900';
    }

    CreateGuiButton(hMenu, 'BT_Ana' + Row.MoleculeID, SubNums(Row.Formula),
                    BgColor, HoColor, OffsetX, OffsetY);
    ++NumAnalytes;
    ++NumButtons;
  });

  hMenu.setAttribute('height', MENUANA_HEIGHT + Rows * (MENUANA_BUTTON_HEIGHT + 0.05));
}


/**** Fill the reagents ****/

function FillReagents()
{
  var NumX          = 0;
  var PosY          = 1.41;
  var ScCommands    = {};
  var SrcLiqCanvas  = Asset.querySelector('#CanvasReaLiquid');
  var SrcSolCanvas  = Asset.querySelector('#CanvasReaSolid');
  var SrcLiqReagent = document.querySelector('#ReaLiquid');
  var SrcSolReagent = document.querySelector('#ReaSolid');

  hDb.each("SELECT Reagents.ReagentID, Reagents." + Msg.SqlReagent + ", Reagents." + Msg.SqlReagentNameSc +
           ", Reagents.PhysicalStateID, Reagents.PhysicalAdspectID, Reagents.Water, Reagents.WaterMisc, Colors.HtmlCode " +
           "FROM Reagents INNER JOIN Colors ON Reagents.ColorID = Colors.ColorID " +
           "ORDER BY Reagents.PhysicalStateID, Reagents.Reagent;", function(Row) {
    var Id     = Row.ReagentID;
    var Canvas;
    var Clone;
    var StartPos;
    var VertOff;

    if (Row.PhysicalStateID == 2) {
      Canvas  = SrcLiqCanvas.cloneNode(true);
      Clone   = SrcLiqReagent.cloneNode(true);
      VertOff = REALIQ_LBL_OFFSET_Y;
    } else {
      Canvas  = SrcSolCanvas.cloneNode(true);
      Clone   = SrcSolReagent.cloneNode(true);
      VertOff = REASOL_LBL_OFFSET_Y;
    }

    Canvas.setAttribute('id', 'CanvasReaLbl_' + Id);
    Asset.appendChild(Canvas);
    var Ctx = Canvas.getContext("2d");

    Ctx.fillStyle = 'white';
    Ctx.fillRect(0, 0, Canvas.width, Canvas.height);

    Ctx.fillStyle = "#000";
    Ctx.font      = "48px sans-serif";
    Ctx.textAlign = "center";
    Ctx.fillText(SubNums(Row[Msg.SqlReagent]), 256, VertOff);

    /**** Clone the reagent ****/

    StartPos = -0.85 + (NumX * 0.12) + ' ' + PosY + ' -0.7'
    Clone.querySelector('#Label').setAttribute('src', '#CanvasReaLbl_' + Id);
    Clone.setAttribute('id', 'Reagent_' + Id);
    Clone.setAttribute('Position', StartPos);
    Clone.setAttribute('Visible' , 'true');

    if (Row.PhysicalAdspectID === ADSPECT_PAPER)
      Clone.querySelector('#Solid').setAttribute('src', '#TexPaperStripes');
    else if (Row.PhysicalAdspectID === ADSPECT_PLATE)
      Clone.querySelector('#Solid').setAttribute('src', '#TexCopper');


    /**** Speech recognition ****/

    ScReaNames = Row[Msg.SqlReagentNameSc].split(';');

    for(var k = 0; k < ScReaNames.length; ++k)
      ScCommands[Msg.ScTake + ' ' + ScReaNames[k].trim()] = function() {ScReagentClick('Reagent_' + Id)};

    /**** Custom attributes ****/

    Clone.setAttribute('ReaId'             , Id);
    Clone.setAttribute('ReaPhysicalState'  , (Row.PhysicalStateID == 2) ? 'liquid' : 'solid');
    Clone.setAttribute('ReaPhysicalAdspect', Row.PhysicalAdspectID);
    Clone.setAttribute('ReaWater'          , (Row.Water < 0));
    Clone.setAttribute('ReaWaterMisc'      , (Row.WaterMisc < 0));

    /**** Set the color ****/

    if (Row.HtmlCode)
      Clone.querySelector((Row.PhysicalStateID == 2) ? '#Liquid' : '#Solid').setAttribute('color', Row.HtmlCode);

    Workbench.prepend(Clone);

    ++NumX;
    if (NumX > 14) {
      NumX  = 0;
      PosY += 0.3;
    }
  });

  /**** Create the analyte box ****/

  Canvas        = SrcSolCanvas.cloneNode(true);
  AnalyteHandle = SrcSolReagent.cloneNode(true);

  Canvas.setAttribute('id', 'CanvasAnaLbl');
  Asset.appendChild(Canvas);
  TexPrint(Canvas, Msg.Analyte, REASOL_LBL_OFFSET_Y);

  /**** Clone the analyte ****/

  AnalyteHandle.querySelector('#Label').setAttribute('src', '#CanvasAnaLbl');
  AnalyteHandle.setAttribute('id', 'Analyte');
  AnalyteHandle.setAttribute('Position', ANA_POSITION);
  AnalyteHandle.setAttribute('Visible' , 'true');
  AnalyteHandle.setAttribute('ReaPhysicalState', 'solid');
  AnalyteHandle.setAttribute('ReaPhysicalAdspect', '1');
  ScCommands[Msg.ScTake + ' ' + Msg.ScAnalyte] = function() {ScReagentClick('Analyte')};

//  Workbench.appendChild(AnalyteHandle);
  Workbench.prepend(AnalyteHandle);

  /**** Translate the wash bottle label ****/

  TexPrint('CanvasWashBottle', Msg.WaterDist);

  /**** Translate the trash beaker label  ****/

  TexPrint('CanvasTrash', Msg.Trash, 84, 64, true);

  /**** Add the speech commnds ****/

  if (Prefs.SpeechRecAvail)
    annyang.addCommands(ScCommands);
}


/**** Get the molecule formula by ID ****/

function GetMolFormulaByID(MolID)
{
  if (!MolID) return null;

  var Formula;
  var Stmt = hDb.prepare('SELECT Formula FROM Molecules WHERE (MoleculeID=' + MolID + ');');

  if (Stmt.step())
    Formula = Stmt.getAsObject().Formula;

  Stmt.free();

  return Formula;
}


/**** Empty the glassware ****/

function GlassEmpty(Glass, What)
{
  var   Elem, i;
  var   Handle = Glass.Handle;

  if (!What) What = EMPTY_ALL;

  if (What & EMPTY_LIQUID) {
    Elem = Handle.querySelectorAll('[id^="Liquid"]');
    for(i = 0; i < Elem.length; i++)
      Elem[i].setAttribute('visible', false);
  }

  if ((What & EMPTY_SOLID) || (What & EMPTY_PAPER) ||
      (What & EMPTY_PLATE)){
    Elem = Handle.querySelectorAll('[id^="Solid"]');

    /**** Remove the paper ****/

    if (What & EMPTY_PAPER) {
      for(i = 0; i < Elem.length; i++) {
        if (Elem[i].id == 'Solid-Paper')
          Elem[i].setAttribute('visible', false);
      } /* End of for (i) */
      Glass.PaperColor = null;
      Glass.PaperID    = 0;
      Glass.PaperReaID = 0;
      Glass.PaperWater = false;
    }

    /**** Remove the plate ****/

    if (What & EMPTY_PLATE) {
      for(i = 0; i < Elem.length; i++) {
        if (Elem[i].id == 'Solid-Copper')
          Elem[i].setAttribute('visible', false);
      } /* End of for (i) */

      for(i = 0; i < Glass.ReaNum; ++i) {
        if (Glass.ReaAdspect[i] === ADSPECT_PLATE) {
          ReaRemove(Glass, i);
          --i;
        }
      } /* End of for (i) */
    }

    if (What & EMPTY_SOLID) {
      for(i = 0; i < Elem.length; i++) {
        if ((Elem[i].id != 'Solid-Paper') && (Elem[i].id != 'Solid-Copper'))
          Elem[i].setAttribute('visible', false);
      } /* End of for (i) */

      /**** Here you should add the code to remove only the solid ****/

    }
  }

  if (((What & EMPTY_LIQUID) || (What & EMPTY_SOLID)) &&
      (Glass.Type === GLASS_TYPE_TESTTUBE))
    Handle.querySelector('#Suspension').setAttribute('visible', false);

  if ((Glass === Stirrer) || (GlassWater(Glass))) {
    Glass.Clean   = true;
    Glass.SmellID = SMELL_NONE;
  } else {
    Glass.Clean   = false;
  }

  if (What === EMPTY_ALL) {
    Glass.AnaAdspect = ADSPECT_SOLID;
    Glass.AnaID      = 0;
    Glass.AnaQty     = 0;
    Glass.Boiling    = false;
    Glass.Burning    = false;
    Glass.CentTime   = 0;
    Glass.HeatTime   = 0;
    Glass.LiqAdspect = ADSPECT_LIQUID_NONE;
    Glass.LiqColor   = null;
    Glass.LiqLvl     = 0;
    Glass.LiqOpac    = Glass.LiqDefOpac;
    Glass.OrgColor   = null;
    Glass.ReaAdspect = [];
    Glass.ReaID      = [];
    Glass.ReaNum     = 0;
    Glass.ReaQty     = [];
    Glass.SolidColor = null;
    Glass.Stirred    = true;
    Glass.Water      = false;

    if (DEBUG)
      Glass.SmellID  = SMELL_NONE;

    return;
  }

  if (What & EMPTY_LIQUID) {
    if (Glass.AnaAdspect === ADSPECT_LIQUID) {
      Glass.AnaAdspect = ADSPECT_SOLID;
      Glass.AnaQty     = 0;
      if (What & EMPTY_SUBST) Glass.AnaID = 0;
    }

    for(var i = 0; i < Glass.ReaNum; ++i) {
      if (Glass.ReaAdspect[i] === ADSPECT_LIQUID) {
        if (What & EMPTY_SUBST) {
          ReaRemove(Glass, i);
          --i;
        } else Glass.ReaQty[i] = 0;
      }
    } /* End of for (i) */

    Glass.Boiling    = false;
    Glass.Burning    = false;
    Glass.CentTime   = 0;
    Glass.HeatTime   = 0;
    Glass.LiqAdspect = ADSPECT_LIQUID_NONE;
    Glass.LiqColor   = null;
    Glass.LiqLvl     = 0;
    Glass.LiqOpac    = Glass.LiqDefOpac;
    Glass.OrgColor   = null;
    Glass.Water      = false;
  }

  if (What & EMPTY_SOLID) {
    if (Glass.AnaAdspect === ADSPECT_SOLID) {
      Glass.AnaQty = 0;
      if (What & EMPTY_SUBST) Glass.AnaID = 0;
    }

    for(var i = 0; i < Glass.ReaNum; ++i) {
      if (Glass.ReaAdspect[i] === ADSPECT_SOLID) {
        if (What & EMPTY_SUBST) {
          ReaRemove(Glass, i);
          --i;
        } else Glass.ReaQty[i] = 0;
      }
    } /* End of for (i) */

    Glass.SolidColor = null;
  }
}


/**** Get the glassware by handle ****/

function GlassGetByHandle(Handle)
{
  for(var i = 0; i < GlassWare.length; i++) {
    if (GlassWare[i].Handle == Handle)
      return GlassWare[i];
  } /* End of for (i) */

  return null;
}


/**** Check if the glassware is clean ****/

function GlassIsClean(Glass)
{
  if (DEBUG_GLASS_CLEAN) return true;

  switch(Glass.Type) {
  case GLASS_TYPE_DROPPER:
    if ((!Glass.Clean) && (!Glass.ReaNum) && (!Glass.AnaID)) {
      if (CleanDropperFirst) {
        ShowError(Msg.SsCleanGlassware1 + '. ' + Msg.SsDropperClean);
        CleanDropperFirst = false;
      } else ShowError(Msg.SsCleanGlassware1);
      return false;
    }
    break;

  case GLASS_TYPE_STIRRER:
    if (!Glass.Clean) {
      ShowError(Msg.SsStirrerClean);
      return false;
    }
    break;

  default:
    if ((!Glass.Clean) && (!Glass.ReaNum) && (!Glass.AnaID)) {
      if (CleanGlassFirst) {
        ShowError(Msg.SsCleanGlassware1 + '. ' + Msg.SsCleanGlassware2);
        CleanGlassFirst = false;
      } else ShowError(Msg.SsCleanGlassware1);
      return false;
    }
    break;
  } /* End of switch */

  return true;
}


/**** Check if the glassware is empty ****/

function GlassIsEmpty(Glass)
{
  if (Glass.Type === GLASS_TYPE_DROPPER) {
    if ((Glass.AnaID) && (Glass.AnaQty))
      return false;

    if (Glass.ReaNum) {
      for(var Qty of Glass.ReaQty) {
        if (Qty) return false;
      } /* End of for (Qty) */
    }

    return (!Glass.Water);
  }

  return (!Glass.AnaID) && (!Glass.Water) && (!Glass.ReaNum) && (!Glass.PaperID);
}


/**** Check if there is the precipitate ****/

function GlassPrecipitate(Glass)
{
  if ((Glass.AnaID) &&
      ((Glass.AnaAdspect === ADSPECT_SOLID) || (Glass.AnaAdspect === ADSPECT_POWDER)))
    return true;

  if (!Glass.ReaNum) return false;

  for(var ReaAdspect of Glass.ReaAdspect) {
    if ((ReaAdspect === ADSPECT_SOLID) || (ReaAdspect === ADSPECT_POWDER))
      return true;
  } /* End of for (ReaID) */

  return false;
}


/**** Check if two glassware contain the same substances ****/

function GlassSameSubst(Glass1, Glass2)
{
  if (Glass1 === Glass2) return true;
  if (Glass1.ReaNum !== Glass2.ReaNum) return false;

  for(var ReaID of Glass1.ReaID)
    if (Glass2.ReaID.indexOf(ReaID) === -1)
      return false;

  return (Glass1.AnaID === Glass2.AnaID);
}


/**** Glass water only ****/

function GlassWater(Glass)
{
  if (Glass.Type === GLASS_TYPE_DROPPER) {
    if ((Glass.AnaID) && (Glass.AnaQty))
      return false;

    if (Glass.ReaNum) {
      for(var Qty of Glass.ReaQty) {
        if (Qty) return false;
      } /* End of for (Qty) */
    }

    return (Glass.Water);
  }

  return ((Glass.Water) && (!Glass.AnaID) && (!Glass.ReaNum));
}


/**** Go to the footprint ****/

function GotoFootprint(FootPrintID)
{
  var SourceRot = Camera.getAttribute('rotation');
  var FootPrint = Floor.querySelector('#' + FootPrintID);
  var TargetPos = FootPrint.getAttribute('position');
  var TargetRot = FootPrint.getAttribute('rotation');
  var RotStartX = Camera.components["look-controls"].pitchObject.rotation.x;
  var RotStartY = NormalizeAngleRad(Camera.components["look-controls"].yawObject.rotation.y);
  var RotEndY   = NormalizeAngleRad(TargetRot.z * MATH_DEG2RAD);
  var RotSteps  = 40;
  var RotStepX  = RotStartX / RotSteps;
  var RotStepY  = (RotEndY - RotStartY) / RotSteps;
  var TargetPosY = FootPrintID == 'PosCentrifuge' ? -0.5 : 0;

  TargetPos = new THREE.Vector3(TargetPos.x, TargetPos.y, TargetPos.z);
  Floor.object3D.localToWorld(TargetPos);
  Scene.object3D.worldToLocal(TargetPos);

  Camera.removeAttribute('animation');
  CameraRig.removeAttribute('animation');
  Camera.setAttribute('animation', 'dur: 1000; property: position; to: 0 ' + TargetPosY + ' 0; easing: easeInOutCubic;');
  CameraRig.setAttribute('animation', 'dur: 1000; property: position; to: ' + TargetPos.x + ' ' + CameraRigOffsetY + ' ' +
                         TargetPos.z + '; easing:easeInOutCubic;');

  var RotId = setInterval(function() {
    if (--RotSteps) {
      RotStartX -= RotStepX;
      RotStartY += RotStepY;
      Camera.components["look-controls"].pitchObject.rotation.x = RotStartX;
      Camera.components["look-controls"].yawObject.rotation.y   = RotStartY;
    } else {
      Camera.components["look-controls"].pitchObject.rotation.x = 0;
      Camera.components["look-controls"].yawObject.rotation.y   = RotEndY;
      clearInterval(RotId);
    }
  }, 10);
}


/**** Heating thread ****/

async function HeatingThread()
{
  var PrevWhatGlass = null;
  var PrevDockHole  = [ null, null, null, null ];

  for(;;) {
    if (Heater.WhatGlass) {
      await Sleep(1000);
      if (PrevWhatGlass != Heater.WhatGlass) {
        BoilDelay(PrevWhatGlass   , false);
        BoilDelay(Heater.WhatGlass, true);

        for(var Hole = 0; Hole < WaterBath.DockHole.length; ++Hole)
          PrevDockHole[Hole] = null;
        PrevWhatGlass = Heater.WhatGlass;
//        Heater.WhatGlass.HeatTime = 1;
      } else {
        ++Heater.WhatGlass.HeatTime;
        if (Heater.WhatGlass !== WaterBath)
          Reaction(Heater.WhatGlass);
      }

      /**** Heat the testtubes ****/

      if (Heater.WhatGlass === WaterBath) {
        for(var Hole = 0; Hole < WaterBath.DockHole.length; ++Hole) {
          var HoleGlass = WaterBath.DockHole[Hole];
          if (HoleGlass) {
            if (HoleGlass != PrevDockHole[Hole]) {
//              HoleGlass.HeatTime = 1;
            } else {
              ++HoleGlass.HeatTime;
              Reaction(HoleGlass);
            }
          }
          PrevDockHole[Hole] = HoleGlass;
        } /* End of for (Hole) */
      }

    }
  } /* End of for */
}


/**** Left mouse button pressed ****/

function LeftMbPressed(Evt)
{
  if ("which"  in Evt) return (Evt.which  === 1);   // Middle = 4
  if ("button" in Evt) return (Evt.button === 0);   // Middle = 1

  return false;
}


/**** Transfer liquid from source to destination object ****/

function LiquidMove(Dest, Src, Units)
{
  if (!Src.LiqLvl) return;
  if (typeof(Units) === 'undefined') Units = 1;

  Dest.LiqLvl += Units;
  if (Dest.LiqLvl > Dest.LiqLvlMax) Dest.LiqLvl = Dest.LiqLvlMax;

  if (Dest.ReaNum) {
    Dest.LiqColor = ColorBlend(Dest.LiqColor, Src.LiqColor, 1 / Dest.LiqLvl);
  } else {
    Dest.LiqColor = Src.LiqColor;
  }
  Dest.Water = true;
  LiquidUpdate(Dest);

  if (GlassIsEmpty(Dest)) {
    Dest.Stirred = Src.Stirred;
  } else Dest.Stirred = (GlassWater(Dest) && GlassWater(Dest));

  /**** Transfer the substances ****/

  if (Src !== WashBottle) {
    var WhatToEmpty = EMPTY_ALL;

    /**** Paper ****/

    if (Src.PaperID) {
      if ((Dest.Type === GLASS_TYPE_DROPPER) || (Dest.Type === GLASS_TYPE_TESTTUBE)) {
        WhatToEmpty &= (~EMPTY_PAPER);
      } else {
        Dest.PaperColor = Src.PaperColor;
        Dest.PaperID    = Src.PaperID;
        Dest.PaperReaID = Src.PaperReaID;
        Dest.PaperWater = Src.PaperWater;

        Src.PaperColor  = null;
        Src.PaperID     = 0;
        Src.PaperReaID  = 0;
        Src.PaperWater  = false;
      }
    }

    /**** Reagents ****/

    for(var i = 0; i < Src.ReaNum; i++) {
      if ((Src.ReaAdspect[i] === ADSPECT_PLATE) &&
          (Dest.Type === GLASS_TYPE_DROPPER)) {
        WhatToEmpty &= (~EMPTY_PLATE);
        continue;
      }

      /**** Avoid to pipette the precipitate ****/

      if ((Dest.Type === GLASS_TYPE_DROPPER) &&
          ((Src.ReaAdspect[i] === ADSPECT_SOLID) || (Src.ReaAdspect[i] === ADSPECT_POWDER)) &&
          (Src.LiqAdspect !== ADSPECT_LIQUID_SUSP)) {
        Dest.SolidColor = Src.SolidColor;
        continue;
      }

      var DestIndex  = Dest.ReaID.indexOf(Src.ReaID[i]);
      var DestQty    = (Src.ReaQty[i] * Units) / Src.LiqLvl;
      Src.ReaQty[i] -= DestQty;

      if (DestIndex === -1) {
        Dest.ReaAdspect.push(Src.ReaAdspect[i]);
        Dest.ReaID.push(Src.ReaID[i]);
        Dest.ReaQty.push(DestQty);
        ++Dest.ReaNum;
      } else {
        Dest.ReaQty[DestIndex] += DestQty;
      }

      if (Src.ReaAdspect[i] === ADSPECT_PLATE) {
        ReaRemove(Src, i);
        --i;
      }
    } /* End of for (i) */

    /**** Analyte ****/

    if ((Src.AnaID) &&
        ((Dest.Type !== GLASS_TYPE_DROPPER) ||
         ((Dest.Type === GLASS_TYPE_DROPPER) && (Src.LiqLvl <= Units)) ||
         ((Src.AnaAdspect !== ADSPECT_SOLID) && (Src.AnaAdspect !== ADSPECT_POWDER)) ||
         (Src.LiqAdspect === ADSPECT_LIQUID_SUSP))) {
      if ((!Dest.AnaID) && (Src.AnaQty)) {
        Dest.AnaID      = Src.AnaID;
        Dest.AnaAdspect = Src.AnaAdspect;
        Dest.SolidColor = Src.SolidColor;
      }

      DestQty      = (Src.AnaQty * Units) / Src.LiqLvl;
      Dest.AnaQty += DestQty;
      Src.AnaQty  -= DestQty;
    }

    Dest.Clean  = false;
    Src.LiqLvl -= Units;
    if (Src.LiqLvl <= 0) {
      if (Src.Type === GLASS_TYPE_DROPPER) WhatToEmpty &= ~EMPTY_SUBST;
      GlassEmpty(Src, WhatToEmpty);
    } else LiquidUpdate(Src);
  }

  Reaction(Dest);
}


/**** Update the liquid level ****/

function LiquidUpdate(GlassObj)
{
  var Elem = GlassObj.Handle.querySelectorAll('[id^="Liquid"]');

  for(var i = 0; i < Elem.length; i++)
    Elem[i].setAttribute('visible', false);

  if (GlassLiquid(GlassObj)) {
    var Level = GlassObj.Handle.querySelector("#Liquid-" + (GlassObj.LiqLvl * 10));
    if (Level) {
      var hCylinder = Level.querySelector('a-cylinder');
      var hSphere   = Level.querySelector('a-sphere'  );

      if (GlassObj.LiqAdspect === ADSPECT_LIQUID_SUSP) {
        if (hCylinder) {
          hCylinder.setAttribute('material', 'opacity', 1);
          hCylinder.setAttribute('material', 'src: #TexSuspGrad');
          hCylinder.setAttribute('material', 'transparent: true');
        }
        if (hSphere) {
          hSphere.setAttribute('material', 'opacity', 1);
          hSphere.setAttribute('material', ' src: #TexSuspSol');
        }
        if (GlassObj.LiqColor === COLOR_WHITE)
          ColorSet(Level,  GlassObj.SolidColor);
        else
          ColorSet(Level, ColorBlend(GlassObj.LiqColor, GlassObj.SolidColor, 0.5));
      } else {
        if (hCylinder) {
          hCylinder.setAttribute('material', 'src:');
          hCylinder.setAttribute('material', 'opacity', GlassObj.LiqOpac);
          hCylinder.setAttribute('material', 'transparent: false');
        }
        if (hSphere) {
          hSphere.setAttribute('material', 'src:');
          hSphere.setAttribute('material', 'opacity', GlassObj.LiqOpac);
        }
        ColorSet(Level, GlassObj.LiqColor);
      }

      Level.setAttribute('visible', true);
    }
  }

  /**** Dual liquid phases ****/

  if (GlassObj.Type === GLASS_TYPE_TESTTUBE) {
    var hDual;

    /**** Dichloromethane ****/

    if (GlassObj.ReaID.indexOf(REA_ID_CH2CL2) !== -1) {
      hDual = GlassObj.Handle.querySelector("#Liquid-Dual");
      ColorSet(hDual, ((!GlassObj.Stirred) || (!GlassObj.OrgColor)) ? COLOR_WHITE : GlassObj.OrgColor);
      hDual.setAttribute('visible', true);

    /**** Ring test ****/

    } else if (RingTestCheck(GlassObj) && (!GlassObj.Stirred) &&
               (GlassObj.ReaID.indexOf(REA_ID_H2SO4_CONC) !== -1)) {
      hDual = GlassObj.Handle.querySelector("#Liquid-Dual");
      ColorSet(hDual, COLOR_WHITE);
      hDual.setAttribute('visible', true);
      if (GlassObj.AnaID === MOLID_FENOSO4) {
        GlassObj.Handle.querySelector("#Liquid-Ring").setAttribute('visible', true);
      }
    }
  }
}


/**** Load a binary file ****/

function LoadBinaryFile(path, success)
{
  var xhr = new XMLHttpRequest();
  xhr.open("GET", path, true);
  xhr.responseType = "arraybuffer";
  xhr.onload = function() {
    var data = new Uint8Array(xhr.response);
    var arr  = new Array();
    for(var i = 0; i != data.length; ++i)
      arr[i] = String.fromCharCode(data[i]);

    success(arr.join(""));
  }
  xhr.send();
}


/**** Move the glassware to target ****/

function MoveToTarget(Target, MoveUp, MoveDown)
{
  var Delay     = 500;
  var hGlass    = GlassReady.Handle;
  var StartPos  = hGlass.getAttribute('position');
  var TargetObj = GlassGetByHandle(Target)
  var TargetPos = PositionToLocal(Workbench, Target);

  GlassReady.StartPosX = StartPos.x;
  GlassReady.StartPosY = StartPos.y;
  GlassReady.StartPosZ = StartPos.z;

  if (TargetObj) {
    var Delta, Pos;
    if (TargetObj.Type != GLASS_TYPE_TESTTUBE) {
      Pos   = TargetObj.Handle.getAttribute('position');
      Delta = TargetObj.PosY - Pos.y;
    } else {
      Pos = TargetObj.Handle.getAttribute('position');
      var ObjPos1 = new THREE.Vector3(0, TargetObj.PosY, 0);
      var ObjPos2 = new THREE.Vector3(0, Pos.y, 0);
      Rack.object3D.updateMatrixWorld();
      Rack.object3D.localToWorld(ObjPos1);
      Rack.object3D.localToWorld(ObjPos2);
      WorkBench.object3D.worldToLocal(ObjPos1);
      WorkBench.object3D.worldToLocal(ObjPos2);
      Delta = ObjPos1.y - ObjPos2.y;
    }
    MoveUp   -= Delta;
    MoveDown += Delta;
  }

  hGlass.removeAttribute('animation__M1');
  hGlass.removeAttribute('animation__M2');
  hGlass.setAttribute('animation__M1', 'dur: 500; property: position ' +
                      '; from: ' + StartPos.x  + ' ' + StartPos.y + ' ' + StartPos.z +
                      '; to: '   + TargetPos.x + ' ' + (StartPos.y + MoveUp) + ' ' + TargetPos.z);
  hGlass.setAttribute('animation__M2', 'dur: 500; property: rotation; from: 90 0 0; to: 0 0 0');

  if (MoveDown) {
    GlassReady.MoveDown = MoveUp + MoveDown;
    hGlass.removeAttribute('animation__M3');
    hGlass.setAttribute('animation__M3', 'delay: 500; dur: 500; property: position ' +
                        '; from: ' + TargetPos.x + ' ' + (StartPos.y + MoveUp  ) + ' ' + TargetPos.z +
                        '; to: '   + TargetPos.x + ' ' + (StartPos.y - MoveDown) + ' ' + TargetPos.z);
    Delay += 500;
  } else GlassReady.MoveDown = 0;

  return Delay;
}


/**** Show an error when you are using the Ni-Cr wire ****/

function NicromeError(ErrMsg)
{
  if (FlameTestFirst) {
    ShowError(ErrMsg + '. ' + Msg.SsFlameTest);
    FlameTestFirst = false;
    return;
  }

  ShowError(ErrMsg);
}


/**** Normalize the angle ****/

function NormalizeAngleRad(Angle)
{
  Angle = Angle - (Math.floor(Angle / MATH_2PI) * MATH_2PI);

  if (Angle > Math.PI) Angle -= MATH_2PI;

  return Angle;
}


/**** Play darin sound ****/

function PlayDrainSound(Obj, Target)
{
  var Sound;

  if (!Target) Target = GlassReady.Obj;

  if (Target.Type === GLASS_TYPE_TESTTUBE) {
    if (RingTest) Sound = '#SND_LiquidDroplet4';
    else if (Target.PaperID) Sound = '#SND_LiquidDroplet';
    else Sound = '#SND_LiquidDrain1';
  } else Sound = '#SND_LiquidDrain2';

  PlaySound(Obj.querySelector(Sound));
}


/**** Play sound ****/

function PlaySound(Sound)
{
  if (!Prefs.SoundActive) return;

  if (typeof(Sound) == 'string')
    Sound = Scene.querySelector('#' + Sound);

  Sound.components.sound.playSound();
}


/**** Position to local coordinates ****/

function PositionToLocal(LocalObj, Obj)
{
  var ObjPos = new THREE.Vector3();

  LocalObj.object3D.updateMatrixWorld();

  Obj.object3D.getWorldPosition(ObjPos);
  LocalObj.object3D.worldToLocal(ObjPos);

  return ObjPos;
}


/**** Add a reagent ****/

function ReaAdd(GlassObj, Id, Qty, Adspect)
{
  var ReaIndex = GlassObj.ReaNum ? GlassObj.ReaID.indexOf(Id) : -1;

  if (ReaIndex === -1) {
    GlassObj.ReaAdspect.push(Adspect);
    GlassObj.ReaID.push(Id);
    GlassObj.ReaQty.push(Qty);
    ++GlassObj.ReaNum;
    return true;
  }

  GlassObj.ReaAdspect[ReaIndex]  = Adspect;
  GlassObj.ReaQty[ReaIndex]     += Qty;

  return false;
}


/**** Convert the reagent ID to analyte ID ****/

function ReaId2AnaId(ReaID)
{
  var AnaID = 0;
  var Stmt  = hDb.prepare('SELECT Reagents.MoleculeID1, Reagents.MoleculeID2, Reagents.MoleculeID3 FROM Reagents ' +
                          'WHERE (Reagents.ReagentID=' + ReaID + ');');

  if (Stmt.step())
    AnaID = Stmt.getAsObject().MoleculeID1;

  Stmt.free();

  return AnaID;
}


/**** Get the smell from reagent ID ****/

function ReaId2SmellId(ReaID)
{
  var SmellID = SMELL_NONE
  var Stmt    = hDb.prepare('SELECT SmellID FROM Reagents WHERE (ReagentID=' + ReaID + ');');

  if (Stmt.step())
    SmellID = Stmt.getAsObject().SmellID;

  Stmt.free();

  return SmellID;
}


/**** Remove a reagent from glassware ****/

function ReaRemove(Glass, i)
{
  if ((!Glass.ReaNum) || (i > Glass.ReaNum))
    return;

  Glass.ReaID.splice(i, 1);
  Glass.ReaAdspect.splice(i, 1);
  Glass.ReaQty.splice(i, 1);
  --Glass.ReaNum;
}


/**** Set raycastable objects ****/

function RaycastableObj(Obj, En)
{
  var Raycaster = Cursor.getAttribute('raycaster');
  var ObjList   = Raycaster.objects;

  Obj = ', ' + Obj;

  if (ObjList.search(Obj) == -1) {
    if (En) ObjList += Obj;
  } else {
    if (!En) ObjList = ObjList.replace(Obj, '');
  }

  Raycaster.objects                           = ObjList;
  CameraRig.querySelector('#HandLeft').getAttribute('raycaster').objects = ObjList;
  CameraRig.querySelector('#HandRight').getAttribute('raycaster').objects = ObjList;
}


/**** Move the glassware to target ****/

function ReturnFromTarget(Delay, LastAnim)
{
  var hGlass    = GlassReady.Handle;
  var StartPos  = hGlass.getAttribute('position');

  LastAnim = (LastAnim) ? 'animation__L' : 'animation__M3';

  if (GlassReady.MoveDown) {
    hGlass.removeAttribute('animation__M1');
    hGlass.setAttribute('animation__M1', 'delay: ' + Delay + '; dur: 500; property: position ' +
                        '; from: ' + StartPos.x  + ' ' +  StartPos.y                        + ' ' + StartPos.z +
                        '; to: '   + StartPos.x  + ' ' + (StartPos.y + GlassReady.MoveDown) + ' ' + StartPos.z);
    Delay += 500;
  }

  hGlass.removeAttribute('animation__M2');
  hGlass.removeAttribute(LastAnim);
  hGlass.setAttribute('animation__M2', 'delay: ' + Delay + '; dur: 500; property: position ' +
                      '; from: ' + StartPos.x             + ' ' + (StartPos.y + GlassReady.MoveDown) + ' ' + StartPos.z +
                      '; to: '   + GlassReady.StartPosX   + ' ' + GlassReady.StartPosY               + ' ' + GlassReady.StartPosZ);
  hGlass.setAttribute(LastAnim, 'delay: ' + Delay + '; dur: 500; property: rotation; from: 0 0 0; to: 90 0 0');
}


/**** Right mouse button pressed ****/

function RightMbPressed(Evt)
{
  if ("which" in Evt) return (Evt.which == 3);
  if ("button" in Evt) return (Evt.button == 2);

  return false;
}


/**** Check if you are performing the ring test ****/

function RingTestCheck(Glass)
{
  if ((Glass.Type !== GLASS_TYPE_TESTTUBE) || (!Glass.Water))
    return false;

  return (Glass.ReaID.indexOf(REA_ID_FESO4) !== -1);
}


/**** Convert seconds to time ****/

function Sec2Time(timeInSeconds)
{
  if (!timeInSeconds) return '00:00';

  var pad     = function(num, size) { return ('000' + num).slice(size * -1); };
  var time    = parseFloat(timeInSeconds).toFixed(3);
  //  var hours   = Math.floor(time / 60 / 60);
  var minutes = Math.floor(time / 60) % 60;
  var seconds = Math.floor(time - minutes * 60);

  // return pad(hours, 2) + ':' + pad(minutes, 2) + ':' + pad(seconds, 2);
  return pad(minutes, 2) + ':' + pad(seconds, 2);
}


/**** Set the check of a toggle ****/

function SetCheckToggle(hDlg, ToggleName, Checked)
{
  var hToggle            = hDlg.querySelector(ToggleName);
  var hGuiToggle         = hToggle.components['gui-toggle'];
  var guiItem            = hToggle.components['gui-item'];
  var toggleBox          = hToggle.querySelector('a-box');
  var toggleHandle       = toggleBox.querySelector('a-box');
  var toggleHandleWidth  =  guiItem.data.height / 5;
  var toggleHandleXStart = -guiItem.data.height * 0.5 + toggleHandleWidth * 2;
  var toggleHandleXEnd   =  guiItem.data.height * 0.5 - toggleHandleWidth * 2;

  hToggle.setAttribute('checked', Checked);

  if (Checked) {
    toggleBox.removeAttribute('animation__colorOut');
    toggleHandle.removeAttribute('animation__positionOut');
    toggleBox.setAttribute('animation__colorIn', 'property: material.color; from: ' + hGuiToggle.data.borderColor + '; to:' + hGuiToggle.data.activeColor + '; dur:200; easing:easeInOutCubic;');
    toggleHandle.setAttribute('animation__positionIn', 'property: position; from: ' + toggleHandleXStart + ' 0 0.02; to:' + toggleHandleXEnd + ' 0 0.02; dur:200; easing:easeInOutCubic;');
  } else {
    toggleBox.removeAttribute('animation__colorIn');
    toggleHandle.removeAttribute('animation__positionIn');
    toggleBox.setAttribute('animation__colorOut', 'property: material.color; from: ' + hGuiToggle.data.activeColor + '; to:' + hGuiToggle.data.borderColor + '; dur:200; easing:easeInOutCubic;');
    toggleHandle.setAttribute('animation__positionOut', 'property: position; from: ' + toggleHandleXEnd + ' 0 0.02; to:' + toggleHandleXStart + ' 0 0.02; dur:200; easing:easeInOutCubic;');
  }
}


/**** Change the graphics details ****/

function SetDetail(Detail)
{
  if (Detail)
    Shadow.setAttribute('shadow', 'cast: true; receive: true');
  else
    Shadow.setAttribute('shadow', 'cast: false; receive: false');

  DisableShadowAll();

  /**** Show/hide optional objects ****/

  var Obj = Scene.querySelectorAll('.hidetailobj');
    for(var i = 0; i < Obj.length; i++)
      Obj[i].setAttribute('visible', Detail);

  SetSegments(Detail ? AFRAME_DETAIL_HI : AFRAME_DETAIL_LOW);
}


/**** Set the number of segments ****/

function SetSegments(Segments)
{
  var i;
  var Primitive;

  var HalfSegments = Segments / 2;
  var QuarterSegments = Segments / 4;

  Primitive = Scene.querySelectorAll('a-circle');
  for(i = 0; i < Primitive.length; i++)
    Primitive[i].setAttribute('geometry', 'segments: ' + Segments);

  Primitive = Scene.querySelectorAll('a-cone, a-cylinder');
  for(i = 0; i < Primitive.length; i++) {
    if (!Primitive[i].getAttribute('csg-meshs'))
      Primitive[i].setAttribute('geometry', 'segmentsRadial: ' + Segments + '; segmentsHeight: ' + HalfSegments);
  } /* End of for (i) */

  Primitive = Scene.querySelectorAll('a-ring');
  for(i = 0; i < Primitive.length; i++)
    Primitive[i].setAttribute('geometry', 'segmentsTheta: '+ Segments + '; segmentsPhi:'  + QuarterSegments);

  Primitive = Scene.querySelectorAll('a-sphere');
  for(i = 0; i < Primitive.length; i++)
    Primitive[i].setAttribute('geometry', 'segmentsHeight:' + Segments + '; segmentsWidth:' + HalfSegments);
}


/**** Set the text of the splash screen ****/

function SetTextSplash(Msg)
{
  var Splash       = document.getElementById("TextSplash");
  Splash.innerHTML = '';
  Splash.innerHTML = '<p>' + Msg + '</p>';
}


/**** Print to the log ****/

function LogPrint(Str)
{
  var Lines = Str.split('\n');

  for(var i = 0; i < Lines.length; ++i)
    AFRAME.log(Lines[i]);
}


/**** Save the file ****/

function SaveAs(Content, FileName, ContentType)
{
  var a    = document.createElement('a');
  var File = new Blob([Content], {type: ContentType});

  a.href     = URL.createObjectURL(File);
  a.download = FileName;
  a.click();

  URL.revokeObjectURL(a.href);
}


/**** Show/speak an error ****/

function ShowError(Str, CallBackAtEnd)
{
  LogPrint(Str);
  Speak(Str, CallBackAtEnd);
}


/**** Randomize the array ****/

function ShuffleArray(Array)
{
  for (var i = Array.length - 1; i > 0; i--) {
    var j = Math.floor(Math.random() * (i + 1));
    var temp = Array[i];
    Array[i] = Array[j];
    Array[j] = temp;
  } /* End of for (i) */
}


/**** Sleep function ****/

function Sleep(Timer)
{
  return new Promise(resolve => {
    Timer = Timer || 2000;
    setTimeout(function () {
      resolve();
    }, Timer);
  });
};


/**** Speak ****/

function Speak(Str, CallBackAtEnd)
{
  if (!Str) return;

  switch(VoiceType) {
  case VOICE_TYPE_NATIVE:
    if (Voice.speaking) return;

    if ((!Prefs.VoiceAvail) || (!Prefs.VoiceActive)) {
      if (CallBackAtEnd) CallBackAtEnd();
      return;
    }

    /**** Fix the utterance of some italian words ****/

    if (Lang == 'it') {
      if (!VoiceHandle) return;

      /**** Google ****/

      if (VoiceHandle.name.startsWith('Google')) {
        Str = Str.replace(/becher/gi, 'becker');
        Str = Str.replace(/bunsen/gi, 'buunsen');

      /**** Microsoft (non Natural) ****/

      } else if (VoiceHandle.name.startsWith('Microsoft')) {
        if (VoiceHandle.name.indexOf('Natural') == -1) {
          Str = Str.replace(/bagnomaria/gi, 'bagno maria').replace(/becher/gi, 'becker').replace(/capsula/gi, 'caapsula').replace(/idrossido/gi, 'idròssido').replace(/aspirala/gi, 'aspiralà');
        }
      }
    }

    var Utter     = new SpeechSynthesisUtterance(Str);
    Utter.voice   = VoiceHandle;
    Utter.volume  = 1;
    Utter.pitch   = VOICE_PITCH;
    Utter.rate    = VOICE_RATE;
    Utter.onstart = function() { VoiceRecEnable(false); };
    Utter.onend   = function() {
      VoiceRecEnable(true);
      if (CallBackAtEnd) CallBackAtEnd();
    };

    if (DEBUG)
      console.log(LOG_PROMPT, 'Voice synthesis "' + Str + '"');

    Voice.cancel();
    Voice.speak(Utter);
    break;

  case VOICE_TYPE_PICOSERVER:
    var TtsAudio = new Audio(encodeURI(PicoTtsURI + Str));
    TtsAudio.onplay  = function() { VoiceRecEnable(false);};
    TtsAudio.onended = function() {
      VoiceRecEnable(true);
      if (CallBackAtEnd) CallBackAtEnd();
    };
    TtsAudio.play();
    break;

  case VOICE_TYPE_RESPONSIVE:

    if (responsiveVoice.isPlaying()) return;

    if (!Prefs.VoiceActive) {
      if (CallBackAtEnd) CallBackAtEnd();
      return;
    }

    if (DEBUG)
      console.log(LOG_PROMPT, 'Voice synthesis "' + Str + '"');

    responsiveVoice.speak(Str, Msg.ResponsiveVoice,
                          {
                            onstart: function() {
                              VoiceRecEnable(false);
                            },
                            onend: function() {
                              VoiceRecEnable(true);
                              if (CallBackAtEnd) CallBackAtEnd();
                            }
                          });
    break;
  } /* End of switch */
}


/**** Stop sound ****/

function StopSound(Sound)
{
  Scene.querySelector('#' + Sound).components.sound.stopSound();
}


/**** Subscript the numbers ****/

function SubNums(Str)
{
  var NewStr = "";

  for(var i = 0; i < Str.length; i++) {
    var Code     = Str.charCodeAt(i);
    var PrevChar = Str[i - 1];
    if ((Code >= 48) && (Code <= 57) &&
        (PrevChar != ' ') && (PrevChar != '.') &&
        ((PrevChar < '0') || (PrevChar > '9'))) {
      NewStr += String.fromCharCode(Code + 8272);
    } else {
      NewStr += Str[i];
    }
  }

  return NewStr;
}


/**** Print to texture ****/

function TexPrint(CanvasId, Text, OffsetY = 84, FontSize = 48, Transparent = false)
{
  var Canvas;

  if (typeof(CanvasId) == 'string')
    Canvas = document.querySelector('#' + CanvasId);
  else
    Canvas = CanvasId;

  var Ctx = Canvas.getContext("2d");
  Ctx.fillStyle = Transparent ? '#FFFFFF00' : 'white';
  Ctx.fillRect(0, 0, Canvas.width, Canvas.height);
  Ctx.fillStyle = "#000"
  Ctx.font      = FontSize + "px sans-serif";
  Ctx.textAlign = "center";
  Ctx.fillText(Text, Canvas.width / 2, OffsetY);
}


/**** Enable/disable the voice recognition ****/

function VoiceRecEnable(En)
{
  if ((Prefs.SpeechRecAvail) && (Prefs.SpeechRecActive)) {
    if (En) annyang.start();
    else annyang.abort();
  }
}


/**** Wait the end of the animation ****/

async function WaitAnimEnd(StartDelay)
{
  await Sleep(StartDelay);
  while (AnimRunning)
    await Sleep(50);
}


/**** Check if the glassware contains liquids ****/

function GlassLiquid(Glass)
{
  if (Glass.Water) return true;

  for(var ReaAdspect of Glass.ReaAdspect)
    if (ReaAdspect === ADSPECT_LIQUID) return true;

  return false;
}
