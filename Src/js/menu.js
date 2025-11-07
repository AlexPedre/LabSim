
/*******************************************
****         LabSim - Main menu         ****
**** (c) 2020-2025, Alessandro Pedretti ****
*******************************************/


/**** Analyte code button click ****/

function AnaCodeClick(Obj)
{
  var Key = Obj.getAttribute('Id').slice(7);

  if (DEBUG)
    console.log(LOG_PROMPT, 'Key pressed', Key);

  var Label = DlgAnaCode.querySelector('#LBL_Code');
  var Text  = Label.getAttribute('value');
  if (!Text) Text = '';

  switch(Key) {
  case 'Ca':
    Text = '';
    break;

  case 'Bs':
    if (Text) Text = Text.slice(0, -1);
    break;

  case 'Ok':
    if (Text) {
      if (Text.length === CODE_LENGTH) {
        var Code    = parseInt('0x' + Text);
        var EncKey  = ((Code & 0xFF0000) >> 16) ^ CODE_INTK;
        var AnaID   = (((Code & 0x00FF00) >> 8) ^ CODE_INTK) ^ EncKey;
        var Crc     = ((Code & 0x0000FF) ^ CODE_INTK) ^ EncKey;
        Code        = EncKey + AnaID;

        if (Code > 255) Code -= 255;

        if (DEBUG)
          console.log(LOG_PROMPT, 'Analyte code\nEncKey:', EncKey, '\nAnaID:',
                      AnaID, '\nCrc:', Crc, '\nCrc calc:', Code);

        /**** Check the CRC ****/

        if (Crc !== Code) {
          ShowError(Msg.SsAnaCodeInvalid);
          return;
        }

        /**** Check if the analyte is avalable ****/

        Code = hDb.prepare('SELECT MoleculeID FROM Molecules WHERE (Analyte AND MoleculeID = ' + AnaID + ');');
        if (Code.step()) {
          ShowError(Msg.SsAnaCodeOk +' ' + Text + '. ' + Msg.SsAnaCodeReady);
          AnalyteID = AnaID;
          DlgClose('DlgAnaCode');
        } else ShowError(Msg.SsAnaCodeInvalid);
        Code.free();
      } else ShowError(Msg.SsAnaCodeTooShort);
    } else ShowError(Msg.SsAnaCodeEmpty);
    return;

  default:
    if (Text.length < CODE_LENGTH)
      Text += Key;
  } /* Endo of switch */

  Label.setAttribute('value', Text);
}


/**** Create a GUI button ****/

function CreateGuiButton(hMenu, Id, Text, BgColor, HoColor, OffX, OffY)
{
  var hButton = document.createElement("a-gui-button");
  hButton.setAttribute('class'           , 'guiray');
  hButton.setAttribute('id'              , Id);
  hButton.setAttribute('width'           , '1.16');
  hButton.setAttribute('height'          , MENUANA_BUTTON_HEIGHT);
  hButton.setAttribute('font-size'       , '72px');
  hButton.setAttribute('sound'           ,'src: #SndClick; on: click');
  hButton.setAttribute('value'           , Text);
  hButton.setAttribute('margin'          , OffY + ' 0 0.05 ' + OffX);
  hButton.setAttribute('onclick'         , 'ScMenuAnaClick(this)');

  if (BgColor)
    hButton.setAttribute('background-color', BgColor);

  if (BgColor)
    hButton.setAttribute('hover-color', HoColor);

  hMenu.appendChild(hButton);

  return hButton;
}


/**** Close dialog ****/

function DlgClose(DlgName)
{
  if (!DlgName) return;

  var hDlg = Gui.querySelector('#' + DlgName);

  if (!hDlg.getAttribute('visible')) return;

  /**** Save the settings ****/

  if (DlgName == 'DlgMenuSet')
    PrefsSave();

  Gui.setAttribute('animation', 'dur: ' + GUI_FADETIME + '; property: position; from: ' + GUI_POS_VISIBLE + '; to: ' + GUI_POS_INVISIBLE + '; easing: easeInOutQuad');
  setTimeout(function() {
    hDlg.setAttribute('visible', false);
    var Pos  = hDlg.getAttribute('position');
    hDlg.setAttribute('position', Pos.x + ' ' + Pos.y + ' 0');
    var Gadgets = hDlg.querySelectorAll('.guiray');
    for(var i = 0; i < Gadgets.length; i++)
      Gadgets[i].removeAttribute('menuray');
  }, GUI_FADETIME);

  ShownDlgName = '';
}


/**** Show dialog ****/

function DlgShow(DlgName, SpeechStr)
{
  if (ShownDlgName) {
    if (ShownDlgName == DlgName) return;
    else {
      DlgClose(ShownDlgName);
      setTimeout(function() {
        DlgShowInt(DlgName, SpeechStr);
      }, GUI_FADETIME);
      return;
    }
  }

  DlgShowInt(DlgName, SpeechStr);
}


/**** Show dialog (Internal) ****/

function DlgShowInt(DlgName, SpeechStr)
{
  var hDlg = Gui.querySelector('#' + DlgName);
  var Pos  = hDlg.getAttribute('position');

  hDlg.setAttribute('visible', true);
  hDlg.setAttribute('position', Pos.x + ' ' + Pos.y + ' 0.1');
  Gui.setAttribute('animation', 'dur: ' + GUI_FADETIME + '; property: position; from: ' + GUI_POS_INVISIBLE + '; to: ' + GUI_POS_VISIBLE + '; easing: easeInOutQuad');

  var Gadgets = hDlg.querySelectorAll('.guiray');
  for(var i = 0; i < Gadgets.length; i++)
    Gadgets[i].setAttribute('menuray');

  ShownDlgName = DlgName;
  Speak(SpeechStr);
}


/**** Show about dialog ****/

function ScAbout()
{
  DlgShow('DlgAbout');
}


/**** Close dialog/menu ****/

function ScClose()
{
  DlgClose(ShownDlgName);
}


/**** Switch on/off the light ****/

function ScLight(Status)
{
  if (Light == Status) {
    Speak(Status ? Msg.SsLightAlreadyOn : Msg.SsLightAlreadyOff);
    return;
  }

  Light = Status;
  Speak(Status ? Msg.SsSwitchOnLight : Msg.SsSwitchOffLight,
        function() {
          PlaySound('SND_Switch');
          Scene.querySelector('#LightAmbient').setAttribute('visible', Status);
        });
}


/**** Show menu ****/

function ScMenu()
{
  DlgShow('DlgMenu', Msg.DlgMenuTitle);
}


/**** Show analyte menu ****/

function ScMenuAna()
{
  DlgShow('DlgMenuAna', Msg.DlgMenuAnaTitle);
}


/**** Random selection of the analyte ****/

function ScMenuAnaClick(Obj)
{
  var Cmd = Obj.getAttribute('Id').slice(6);

  if (Cmd === 'Code') {
    DlgShow('DlgAnaCode', Msg.DlgAnaCodeTitle);
    return;
  }

  var Sql = 'SELECT Molecules.MoleculeID, Molecules.Formula, ' +
            Msg.SqlMolName + ' FROM Molecules WHERE (Molecules.Analyte';

  switch(Cmd) {
  case 'RndAll':
    Sql += ')';
    break;

  case 'RndInsol':
    Sql += ' AND NOT Molecules.SolWater)';
    break;

  case 'RndSol':
    Sql += ' AND Molecules.SolWater)';
    break;

  default:
    AnalyteID  = Cmd;
    Sql       += ' AND Molecules.MoleculeID = ' + AnalyteID + ')';
  } /* End of switch */

  hDb.each(Sql + ' ORDER BY RANDOM() LIMIT 1;', function(Row) {
    AnalyteID = Row.MoleculeID;
    var Str = Msg.SsSubstToAnalize + ' ' + Row[Msg.SqlMolName];
    LogPrint(Str);
    Speak(Str);

    if (DEBUG)
      console.log(LOG_PROMPT, "Selected analyte", AnalyteID, Row.Formula, Row[Msg.SqlMolName]);
  });


  DlgClose('DlgMenuAna');
}


/**** Restart the simulation ****/

function ScMenuRestart()
{
  DlgClose(ShownDlgName);

  setTimeout(function() {
    location.reload(true);
  }, 1000);
}


/**** Show settings menu ****/

function ScMenuSet()
{
  DlgShow('DlgMenuSet', Msg.DlgMenuSetTitle);
}


/**** Change the graphics details ****/

function ScMenuSetDetail()
{
  Prefs.Detail  = DlgMenuSet.querySelector('#TO_Detail').getAttribute('gui-toggle')['checked'];
  Prefs.Changed = true;

  SetDetail(Prefs.Detail);
}


/**** Enable/disable the audio ****/

function ScMenuSetSound()
{
  Prefs.SoundActive = DlgMenuSet.querySelector('#TO_Sound').getAttribute('gui-toggle')['checked'];
  Prefs.Changed     = true;

  EnableSound(Prefs.SoundActive);
}


/**** Enable/disable the speech recognition ****/

function ScMenuSetSpeechRec()
{
  if (!Prefs.SpeechRecAvail) return;

  Prefs.SpeechRecActive = DlgMenuSet.querySelector('#TO_SpeechRec').getAttribute('gui-toggle')['checked'];
  Prefs.Changed         = true;

  if (Prefs.SpeechRecActive) annyang.start();
  else annyang.abort();
}


/**** Enable/disable the speech synthesis ****/

function ScMenuSetSpeechSynth()
{
  if (!Prefs.VoiceAvail) return;

  Prefs.VoiceActive = DlgMenuSet.querySelector('#TO_SpeechSynth').getAttribute('gui-toggle')['checked'];
  Prefs.Changed     = true;
}


/**** Not understand command ****/

function ScNotUnderstand()
{
  Speak(Msg.SsNotUnderstand1);
}


/**** Set the text of a button ****/

function SetTextButton(hDlg, ButtonName, Text)
{
  var hButton = hDlg.querySelector(ButtonName);

  hButton.setAttribute('value', Text);
  hButton.components['gui-button'].setText(Text);
}


/**** Set the text of a label ****/

function SetTextLabel(hDlg, LabelName, Text)
{
  hDlg.querySelector(LabelName).setAttribute('value', Text);
}


/**** Set the text of a radio ****/

function SetTextRadio(hDlg, RadioName, Text)
{
  var hRadio     = hDlg.querySelector(RadioName);
  var hGuiRadio = hRadio.components['gui-radio'];

  hRadio.setAttribute('value', Text);
  drawText(hGuiRadio.ctxLabel, hGuiRadio.labelCanvas, Text, hGuiRadio.data.fontSize,
           hGuiRadio.data.fontFamily, hGuiRadio.data.fontColor, 1, 'left', 'middle');
}


/**** Set the text of a toggle ****/

function SetTextToggle(hDlg, ToggleName, Text)
{
  var hToggle    = hDlg.querySelector(ToggleName);
  var hGuiToggle = hToggle.components['gui-toggle'];

  hToggle.setAttribute('value', Text);
  drawText(hGuiToggle.ctxLabel, hGuiToggle.labelCanvas, Text, hGuiToggle.data.fontSize,
           hGuiToggle.data.fontFamily, hGuiToggle.data.fontColor, 1, 'left', 'middle');
}
