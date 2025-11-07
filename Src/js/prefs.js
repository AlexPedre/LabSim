
/*******************************************
****        LabSim - Preferences        ****
**** (c) 2020-2025, Alessandro Pedretti ****
*******************************************/


var Lang, ServerIni;

var IsChrome = ((window.navigator.userAgent.indexOf("Chrome") > -1) || (window.navigator.userAgent.indexOf("CriOS") > -1));
var IsEdge   = (window.navigator.userAgent.indexOf('Edg/') > -1);
var IsIE     = ((window.navigator.userAgent.indexOf("MSIE ") > -1) || (!!navigator.userAgent.match(/Trident.*rv\:11\./)));

/**** Read the .ini file ****/

IniLoad();

/**** Read the URL parameters ****/

var UrlParams = new URLSearchParams(window.location.search);
var UrlLang   = UrlParams.get('lang');

/**** Set the default language ****/

if (UrlLang) {
  UrlLang = UrlLang.toLowerCase();
  if (UrlLang === 'auto') Lang = navigator.language.substring(0, 2);
  else Lang = UrlLang;
} else {
  if (IniGetStr('Locale', 'Lang', 'auto') === 'auto') Lang = navigator.language.substring(0, 2);
  else Lang = IniGetStr('Locale', 'Lang');
}

if ((!IsChrome) && (!IsEdge)) {
  if (IsIE) document.execCommand('Stop');
  else window.stop();
  if (navigator.language.substring(0, 2) === 'it')
    alert("Il tuo browser non \u00E8 supportato.\nProva Chrome o Edge.");
  else
    alert('Your browser is not supported.\nTry Chrome or Edge.');
  throw "";
//  fail;
 }


/**** Get boolean value ****/

function IniGetBool(Section, Param)
{
  if (!ServerIni) return false;

  var Value = ServerIni[Section][Param].toUpperCase();
  return ((Value === '1') ||
          (Value === 'TRUE') || (Value === 'YES'));
}


/**** Get string value ****/

function IniGetStr(Section, Param, Default)
{
  if ((!ServerIni) ||
      (typeof ServerIni[Section] ===  'undefined') ||
      (typeof ServerIni[Section][Param] ===  'undefined'))
    return Default;

  return ServerIni[Section][Param].toLowerCase();
}


/**** Load INI from server ****/

function IniLoad()
{
  var Http = new XMLHttpRequest();
  var URI  = document.location.href;
  URI      = URI.substring(0, URI.lastIndexOf('/')) + '/labsim.ini?ver=' + LABSIM_VER;

  Http.open("GET", URI, false);
  Http.send();
  ServerIni = IniParse(Http.responseText);
}


/**** Parse INI string ****/

function IniParse(data)
{
  var regex = {
      section: /^\s*\[\s*([^\]]*)\s*\]\s*$/,
      param: /^\s*([^=]+?)\s*=\s*(.*?)\s*$/,
      comment: /^\s*;.*$/
  };
  var value = {};
  var lines = data.split(/[\r\n]+/);
  var section = null;

  lines.forEach(function(line) {
    if (regex.comment.test(line)) {
          return;
    } else if(regex.param.test(line)) {
      var match = line.match(regex.param);
      if(section){
          value[section][match[1]] = match[2];
      } else {
        value[match[1]] = match[2];
      }
    } else if(regex.section.test(line)) {
      var match = line.match(regex.section);
      value[match[1]] = {};
      section = match[1];
    } else if(line.length == 0 && section){
      section = null;
    };
  });

  return value;
}


/**** Load the preferences ****/

function PrefsLoad()
{
  var Settings = CookieRead(COOKIE_NAME);
  if (!Settings) {
    if (DEBUG)
      console.log(LOG_PROMPT, 'Preferences NOT loaded');
    return;
  }

  Settings = Settings.split(';');
  Prefs.Detail          = Settings[0] == '1';
  Prefs.SoundActive     = Settings[1] == '1';
  Prefs.SpeechRecActive = Settings[2] == '1';
  Prefs.VoiceActive     = Settings[3] == '1';

  if (DEBUG)
    console.log(LOG_PROMPT, 'Preferences loaded');
}


/**** Save the preferences ****/

function PrefsSave()
{
  if (!Prefs.Changed) return;

  CookieWrite(COOKIE_NAME, COOKIE_EXPIRATION,
              Number(Prefs.Detail) + ';' +
              Number(Prefs.SoundActive) + ';' +
              Number(Prefs.SpeechRecActive) + ';' +
              Number(Prefs.VoiceActive));
  Prefs.Changed = false;

  if (DEBUG)
    console.log(LOG_PROMPT, 'Preferences saved');
}
