
/*******************************************
****    LabSim - Global definitions     ****
**** (c) 2020-2025, Alessandro Pedretti ****
*******************************************/

/*
 * Browser detection:
 * https://stackoverflow.com/questions/31721250/how-to-target-edge-browser-with-javascript
 */

/**** Debug parameters ****/

const DEBUG                  = true; /* Enable debug mode             */
const DEBUG_GLASS_CLEAN      = true; /* The glassware is always clean */

/**** Constants ****/

const ADSPECT_POWDER         = 1;
const ADSPECT_PLATE          = 2;
const ADSPECT_PAPER          = 3;
const ADSPECT_LIQUID         = 4;
const ADSPECT_SOLID          = 5;
const ADSPECT_GAS            = 6;

const ADSPECT_LIQUID_NONE    = 0;
const ADSPECT_LIQUID_SUSP    = 1;

const AFRAME_DETAIL_HI       = 36;
const AFRAME_DETAIL_LOW      = 18;

const ANA_POSITION           = '0.25 1.045 -0.75';

const BOIL_DELAY_START       = 3000;
const BOIL_DELAY_STOP        = 1000;

const CAMERA_MAX_X           =  2.90;
const CAMERA_MIN_X           = -2.90;
const CAMERA_MAX_Y           =  1.35;
const CAMERA_MIN_Y           = -1.7;

const CAMERA_RIG_OFFY        = 1.7;
const CAMERA_RIG_OFFY_VR     = 0;

/**** Analyte code ****/

const CODE_INTK              = 0x4c;
const CODE_LENGTH            = 6;

/**** Colors ****/

const COLOR_COLORLESS        = null;
const COLOR_RED              = '#FF0000';
const COLOR_WHITE            = '#FFFFFF';

const COLOR_ID_COLORLESS     = 2;
const COLOR_ID_METALLICRED   = 21;
const COLOR_ID_WHITE         = 1;

/**** Cookies ****/

const COOKIE_NAME            = 'LabSim';
const COOKIE_EXPIRATION      = 30; /* Days */

/**** Double click ****/

const DBLCLICK_DELAY         = 500;

/**** Device types ****/

const DEVICE_TYPE_DESKTOP    = 0x01;
const DEVICE_TYPE_MOBILE     = 0x02;
const DEVICE_TYPE_VR         = 0x04;

const EFFERV_DURATION        = 5000;

/**** GlassEmpty() flags ****/

const EMPTY_ALL              = 0xffffffff;
const EMPTY_LIQUID           = 1;
const EMPTY_PAPER            = 2;
const EMPTY_PLATE            = 4;
const EMPTY_SOLID            = 8;
const EMPTY_SUBST            = 16;

/**** Event types ****/

const EVENT_NONE             = 0;
const EVENT_BIPHASIC         = 7;
const EVENT_CLEAR_SOL        = 3;
const EVENT_CORROSION        = 9;
const EVENT_EFFERV           = 18;
const EVENT_EFFERVSLIGHT     = 19;
const EVENT_FLAME            = 11;
const EVENT_INDICATORCOL     = 14;
const EVENT_PLATECOL         = 20;
const EVENT_POWDER           = 21;
const EVENT_PRECIPITATE      = 6;
const EVENT_SUSPENSION       = 4;
const EVENT_TRIPHASIC        = 8;

/**** Explosion ****/

const EXPLOSION_DUR          = 500;
const EXPLOSION_SCALE        = 5;
const EXPLOSION_TIME         = 60;

const FLAME_DEF_COLOR        = '#020202,#0000FF,#0000FF';

/**** GetIonID() flags ****/

const GETIONID_ANION         = 0;
const GETIONID_CATION1       = 1;
const GETIONID_CATION2       = 2;

const GLASS_CLICK_LEAVE      = 0;
const GLASS_CLICK_TAKE       = 1;
const GLASS_CLICK_TOGGLE     = 2;
const GLASS_CLICK_USE        = 3;

/**** Glassware ID for reaction ****/

const GLASS_ID_WATCHGLASS    = 23;

/**** Glassware types ****/

const GLASS_TYPE_BEAKER      = 0;
const GLASS_TYPE_BUNSEN      = 1;
const GLASS_TYPE_CURCIBLE    = 2;
const GLASS_TYPE_DROPPER     = 3;
const GLASS_TYPE_LIGHTER     = 4;
const GLASS_TYPE_NICHROME    = 5;
const GLASS_TYPE_STIRRER     = 6;
const GLASS_TYPE_TESTTUBE    = 7;
const GLASS_TYPE_WASHBOTTLE  = 8;
const GLASS_TYPE_WATCHGLASS  = 9;

const GUI_FADETIME           = 500;
const GUI_POS_INVISIBLE      = "0 1.7 -10";
const GUI_POS_VISIBLE        = "0 1.7 -4.6";

const LOG_PROMPT             = '**** LabSim:';

/**** Math constants ****/

const MATH_DEG2RAD           = 0.01745329;
const MATH_RAD2DEG           = 57.29577951;
const MATH_2PI               = 2.0 * Math.PI;

/**** Menu configuration ****/

const MENUANA_BUTTON_HEIGHT  = 0.3;
const MENUANA_HEIGHT         = 0.8;
const MENUANA_ITEMDBYLINE    = 6;
const MENUANA_OFFSET_BEGIN_X = -7.46;
const MENUANA_OFFSET_BEGIN_Y = 0.65;
const MENUANA_OFFSET_X       = 0.1;
const MENUANA_STEP_Y         = 0.35;

/**** Molecule IDs ****/

const MOLID_BASO4            = 50;
const MOLID_CO2              = 101;
const MOLID_NACL             = 42;
const MOLID_NH4OH            = 95;
const MOLID_SO2              = 140;
const MOLID_FENOSO4          = 207;

/**** Mouse buttons ****/

const MOUSE_BUTTON_BACKWARD  = 3;
const MOUSE_BUTTON_FORWARD   = 4;
const MOUSE_BUTTON_LEFT      = 0;
const MOUSE_BUTTON_RIGHT     = 2;
const MOUSE_BUTTON_WHEEL     = 1;

const NICHROME_CLEAN_MIN     = 3;

/**** pH IDs ****/

const PHID_5                 = 12;
const PHID_NEUTRAL           = 3;
const PHID_8to10             = 4;
const PHID_ND                = 7;

const PHYS_STATE_LIQUID      = 0;
const PHYS_STATE_SOLID       = 1;
const PHYS_STATE_GAS         = 2;

const REA_ANIM_LIQUID_OFFSET = 0.1;
const REA_ANIM_SOLID_OFFSET  = 0.2;

const REA_ID_BUFFER_PH5      = 35;
const REA_ID_BUFFER_PH9      = 34;
const REA_ID_CH2CL2          = 15;
const REA_ID_CH3OH           = 31;
const REA_ID_CU              = 32;
const REA_ID_DUMMYINSOL      = 9999;
const REA_ID_FESO4           = 23;
const REA_ID_HCL_6M          = 2;
const REA_ID_HCL_CONC        = 3;
const REA_ID_H2SO4           = 5;
const REA_ID_H2SO4_CONC      = 6;
const REA_ID_K2CR2O7         = 21;
const REA_ID_PAPER           = 42;
const REA_ID_UNIVIND         = 41;

/**** Reagent quantities ****/

const REA_QTY_CH3OH_IGN      = 2;
const REA_RINGTEST_FECONC    = 0.66;    /* 2 / 3 */

const REALIQ_LBL_OFFSET_Y    = 84;
const REASOL_LBL_OFFSET_Y    = 48;

/**** Reagent types ****/

const REA_TYPE_UNKNOWN       = 0;
const REA_TYPE_ACIDSTRONG    = 1;
const REA_TYPE_ACIDSTRONGCO  = 2;
const REA_TYPE_ACIDWEAK      = 3;
const REA_TYPE_BASESTRONG    = 4;
const REA_TYPE_BASEWEAK      = 5;
const REA_TYPE_PRECIPITANT   = 6;
const REA_TYPE_SOLVENT       = 7;
const REA_TYPE_OXIDANT       = 8;
const REA_TYPE_REDUCING      = 9;
const REA_TYPE_INDICATOR     = 10;
const REA_TYPE_COMPLEXANT    = 11;
const REA_TYPE_BUFFER        = 12;
const REA_TYPE_DYE           = 13;
const REA_TYPE_PH            = 14;

/**** ScGlassWareClick() flags ****/

const SCGWCLICK_NONE         = 0;
const SCGWCLICK_NOMOVEBATH   = 1;
const SCGWCLICK_TESTTUBEONLY = 2;

/**** Smells ****/

const SMELL_NONE             = 1;
const SMELL_PUNGENT          = 10;
const SMELL_UNKNOWN          = 10;

/**** Solubilities ****/

const SOLGRADE_FULL          = 1;
const SOLGRADE_PARTIAL       = 2;
const SOLGRADE_INSOL         = 3;

/**** Colloidal suspension ****/

const SUSP_OPACITY           = 0.7;

/**** Water bath ****/

const WATERBATH_MOVEUP       = 0.05;
const WATERBATH_MOVEDOWN     = 0.095;
const WATERBATH_MOVEZ        = -0.2;

/**** TV configuration ****/

const TV_PROGBAR_OFFSET_X    = -0.25;
const TV_PROGBAR_WIDTH       = 0.5;

const TV_MODE_LOG            = 0;
const TV_MODE_MENU           = 1;
const TV_MODE_PLAYER         = 2;

const TV_PLAYMODE_ALL        = 0;
const TV_PLAYMODE_LOOP       = 1;
const TV_PLAYMODE_SINGLE     = 2;

const TV_MAXPAGEVIDEO        = 14;
const TV_VIDEO_PATH          = 'video/';

const TUBE_PAPER_POS_Y       = 1.15;

/**** Voice synthesis ****/

const VOICE_PITCH            = 1;
const VOICE_RATE             = 1;

/**** Voice synthesis types ****/

const VOICE_TYPE_NONE        = 0;
const VOICE_TYPE_NATIVE      = 1;
const VOICE_TYPE_PICOSERVER  = 2;
const VOICE_TYPE_RESPONSIVE  = 3;

/**** Global variables ****/

var AnalyteID, AnalyteHandle, annyang, Asset;
var Camera, CameraRig, Cursor;
var Device, DlgAbout, DlgAnaCode, DlgMenu, DlgMenuAna, DlgMenuSet;
var Floor;
var Gui;
var hDb;
var MbClickID;
var PicoTtsURI;
var Rack, RingTest;
var Scene, Shadows, Spatula;
var Trash;
var Workbench;

var AnimRunning       = false;
var CameraRigOffsetY  = CAMERA_RIG_OFFY;
var CleanDropperFirst = true;
var CleanGlassFirst   = true;
var FlameTestFirst    = true;
var GlassTarget       = null;
var Light             = true;
var NumAnalytes       = 0;
var ShownDlgName      = "";
var Voice             = window.speechSynthesis;
var VoiceHandle       = null;
var VoiceType         = VOICE_TYPE_NATIVE;
var VrMode            = false;
var Zoom              = 1.0;

/**** Glassware data ****/

var GlassReady = {
  EnterY     : 0,
  EnterS     : 0,
  Handle     : null,
  LeaveY     : 0,
  LeaveS     : 0,
  MoveDown   : 0,
  Obj        : null,
  StartPosX  : 0,
  StartPosY  : 0,
  StartPosZ  : 0
};


/**** Mouse translate ****/

var MouseTrans = {
  x          : 0,
  y          : 0,
  CameraPosX : 0,
  CameraPosY : 0
};

/**** Preferences ****/

var Prefs = {
  Changed         : false,
  Detail          : true,
  SoundActive     : true,
  SpeechRecActive : false,
  SpeechRecAvail  : true,
  VoiceActive     : true,
  VoiceAvail      : true
};


/**** Reagent data ****/

var ReaReady = {
  Id        : 0,
  Handle    : null,
  Pipette   : null,
  Adspect   : ADSPECT_LIQUID,
  State     : PHYS_STATE_LIQUID,
  Color     : null,
  x         : 0,
  y         : 0,
  z         : 0,
  CapX      : 0,
  CapY      : 0,
  CapZ      : 0,
  Water     : true,
  WaterMisc : true
};

/**** Beaker data ****/

var Beaker = {
  AnaAdspect: ADSPECT_SOLID,
  AnaID     : 0,
  AnaQty    : 0,
  Boiling   : false,
  Handle    : null,
  Name      : 'Beaker',
  CentTime  : 0,
  Clean     : false,
  Dock      : null,
  HeatTime  : 0,
  LiqColor  : null,
  LiqLvl    : 0,
  LiqLvlMax : 10,
  LiqOpac   : 0.4,
  LiqDefOpac: 0.4,
  OrgColor  : null,
  PaperColor: null,
  PaperID   : 0,
  PaperReaID: 0,
  PaperWater: false,
  PosX      : 0,
  PosY      : 0,
  PosZ      : 0,
  ReaAdspect: [],
  ReaID     : [],
  ReaNum    : 0,
  ReaQty    : [],
  SmellID   : SMELL_NONE,
  SolidColor: null,
  Stirred   : true,
  Type      : GLASS_TYPE_BEAKER,
  Water     : false,

  /**** Actions ****/

  Bath      : false,
  Dropper   : true,
  Heater    : true,
  Lighter   : false,
  Reagent   : true,
  Stirrer   : true,
  WashBottle: true
};

/**** Bunsen data ****/

var Bunsen = {
  AnaAdspect: ADSPECT_SOLID,
  AnaID     : 0,
  AnaQty    : 0,
  Boiling   : false,
  Burning   : false,
  CentTime  : 0,
  Clean     : false,
  Dock      : null,
  Handle    : null,
  HeatTime  : 0,
  Name      : 'Bunsen',
  LiqAdspect: ADSPECT_LIQUID_NONE,
  LiqColor  : null,
  LiqLvl    : 0,
  LiqLvlMax : 10,
  LiqOpac   : 0.4,
  LiqDefOpac: 0.4,
  OrgColor  : null,
  PaperColor: null,
  PaperID   : 0,
  PaperReaID: 0,
  PaperWater: false,
  PosX      : 0,
  PosY      : 0,
  PosZ      : 0,
  ReaAdspect: [],
  ReaID     : [],
  ReaNum    : 0,
  ReaQty    : [],
  SmellID   : SMELL_NONE,
  SolidColor: null,
  Stirred   : true,
  Type      : GLASS_TYPE_BUNSEN,
  Water     : false,

  /**** Actions ****/

  Bath      : false,
  Centrifuge: false,
  Dropper   : false,
  Heater    : false,
  Lighter   : true,
  Reagent   : false,
  Stirrer   : false,
  WashBottle: false,

  /**** Specific ****/

  hTimer        : null,
  FlameOxHandle : null,
  On            : false,
  Ox            : false,
  Timer         : 0
};

/**** Centrifuge data ****/

var Centrifuge = {
  DockTube      : [null, null, null, null, null, null],
  Handle        : null,
  hCover        : null,
  hLedOpen      : null,
  hLedPower     : null,
  hPotSpeed     : null,
  hPotTime      : null,
  hTimer        : null,
  hTube         : [null, null, null, null, null, null],
  Lock          : true,
  On            : false,
  Open          : false,
  Run           : false,
  Speed         : 1,
  Time          : 0,
  TimeStep      : 60000
};

/**** Curcible data ****/

var Curcible = {
  AnaAdspect: ADSPECT_SOLID,
  AnaID     : 0,
  AnaQty    : 0,
  Boiling   : false,
  Burning   : false,
  CentTime  : 0,
  Clean     : false,
  Dock      : null,
  Handle    : null,
  HeatTime  : 0,
  Name      : 'Curcible',
  LiqAdspect: ADSPECT_LIQUID_NONE,
  LiqColor  : null,
  LiqLvl    : 0,
  LiqLvlMax : 10,
  LiqOpac   : 0.5,
  LiqDefOpac: 0.5,
  OrgColor  : null,
  PaperColor: null,
  PaperID   : 0,
  PaperReaID: 0,
  PaperWater: false,
  PosX      : 0,
  PosY      : 0,
  PosZ      : 0,
  ReaAdspect: [],
  ReaID     : [],
  ReaNum    : 0,
  ReaQty    : [],
  SmellID   : SMELL_NONE,
  SolidColor: null,
  Stirred   : true,
  Type      : GLASS_TYPE_CURCIBLE,
  Water     : false,

  /**** Actions ****/

  Bath      : false,
  Centrifuge: false,
  Dropper   : true,
  Heater    : true,
  Lighter   : true,
  Reagent   : true,
  Stirrer   : true,
  WashBottle: true
};

/**** Dropper data ****/

var Dropper = {
  AnaAdspect: ADSPECT_SOLID,
  AnaID     : 0,
  AnaQty    : 0,
  Boiling   : false,
  Burning   : false,
  CentTime  : 0,
  Handle    : null,
  Name      : 'Dropper',
  Clean     : false,
  Dock      : null,
  HeatTime  : 0,
  LiqAdspect: ADSPECT_LIQUID_NONE,
  LiqColor  : null,
  LiqLvl    : 0,
  LiqLvlMax : 10,
  LiqOpac   : 0.4,
  LiqDefOpac: 0.4,
  OrgColor  : null,
  PaperColor: null,
  PaperID   : 0,
  PaperReaID: 0,
  PaperWater: false,
  PosX      : 0,
  PosY      : 0,
  PosZ      : 0,
  ReaAdspect: [],
  ReaID     : [],
  ReaNum    : 0,
  ReaQty    : [],
  SmellID   : SMELL_NONE,
  SolidColor: null,
  Stirred   : true,
  Type      : GLASS_TYPE_DROPPER,
  Water     : false,

  /**** Actions ****/

  Bath      : false,
  Centrifuge: false,
  Dropper   : false,
  Heater    : false,
  Lighter   : false,
  Stirrer   : false,
  Reagent   : false,
  WashBottle: false
};


/**** Heater ****/

var Heater = {
  Handle    : null,
  WhatGlass : null
};

/**** Lighter data ****/

var Lighter = {
  AnaAdspect: ADSPECT_SOLID,
  AnaID     : 0,
  AnaQty    : 0,
  Boiling   : false,
  Burning   : false,
  Handle    : null,
  Name      : 'Lighter',
  CentTime  : 0,
  Clean     : false,
  Dock      : null,
  HeatTime  : 0,
  LiqColor  : null,
  LiqLvl    : 0,
  LiqLvlMax : 10,
  LiqOpac   : 0.4,
  LiqDefOpac: 0.4,
  OrgColor  : null,
  PaperColor: null,
  PaperID   : 0,
  PaperReaID: 0,
  PaperWater: false,
  PosX      : 0,
  PosY      : 0,
  PosZ      : 0,
  ReaAdspect: [],
  ReaID     : [],
  ReaNum    : 0,
  ReaQty    : [],
  SmellID   : SMELL_NONE,
  SolidColor: null,
  Stirred   : true,
  Type      : GLASS_TYPE_LIGHTER,
  Water     : false,

  /**** Actions ****/

  Bath      : false,
  Dropper   : false,
  Heater    : false,
  Lighter   : false,
  Reagent   : false,
  Stirrer   : false,
  WashBottle: false
};

/**** Nichrome wire ****/

var Nichrome = {
  AnaAdspect: ADSPECT_SOLID,
  AnaID     : MOLID_NACL,
  AnaQty    : 0,
  Boiling   : false,
  Burning   : false,
  CentTime  : 0,
  CleanCount: NICHROME_CLEAN_MIN,
  Dock      : null,
  Handle    : null,
  HeatTime  : 0,
  Name      : 'Nichrome',
  LiqAdspect: ADSPECT_LIQUID_NONE,
  LiqLvl    : 0,
  LiqLvlMax : 0,
  LiqOpac   : 0.4,
  LiqDefOpac: 0.4,
  OrgColor  : null,
  PaperColor: null,
  PaperID   : 0,
  PaperReaID: 0,
  PaperWater: false,
  PosX      : 0,
  PosY      : 0,
  PosZ      : 0,
  ReaAdspect: [],
  ReaID     : [],
  ReaNum    : 0,
  ReaQty    : [],
  SmellID   : SMELL_NONE,
  SolidColor: null,
  Stirred   : true,
  Type      : GLASS_TYPE_NICHROME,
  Water     : false,

  /**** Actions ****/

  Bath      : false,
  Centrifuge: false,
  Dropper   : false,
  Heater    : false,
  Lighter   : false,
  Stirrer   : false,
  Reagent   : false,
  WashBottle: false
};

/**** Stirrer ****/

var Stirrer = {
  AnaAdspect: ADSPECT_SOLID,
  AnaID     : 0,
  AnaQty    : 0,
  Boiling   : false,
  Burning   : false,
  CentTime  : 0,
  Clean     : false,
  Dock      : null,
  Handle    : null,
  HeatTime  : 0,
  Name      : 'Stirrer',
  LiqAdspect: ADSPECT_LIQUID_NONE,
  LiqColor  : null,
  LiqLvl    : 0,
  LiqLvlMax : 10,
  LiqOpac   : 0.4,
  LiqDefOpac: 0.4,
  OrgColor  : null,
  PaperColor: null,
  PaperID   : 0,
  PaperReaID: 0,
  PaperWater: false,
  PosX      : 0,
  PosY      : 0,
  PosZ      : 0,
  ReaAdspect: [],
  ReaID     : [],
  ReaNum    : 0,
  ReaQty    : [],
  SmellID   : SMELL_NONE,
  SolidColor: null,
  Stirred   : true,
  Type      : GLASS_TYPE_STIRRER,
  Water     : false,

  /**** Actions ****/

  Bath      : false,
  Centrifuge: false,
  Dropper   : false,
  Heater    : false,
  Lighter   : false,
  Stirrer   : false,
  Reagent   : false,
  WashBottle: true
};

/**** Test tubes ****/

var TestTube1 = {
  AnaAdspect: ADSPECT_SOLID,
  AnaID     : 0,
  AnaQty    : 0,
  Boiling   : false,
  Burning   : false,
  CentTime  : 0,
  Clean     : false,
  Dock      : null,
  Handle    : null,
  HeatTime  : 0,
  Name      : 'TestTube1',
  LiqAdspect: ADSPECT_LIQUID_NONE,
  LiqColor  : null,
  LiqLvl    : 0,
  LiqLvlMax : 10,
  LiqOpac   : 0.4,
  LiqDefOpac: 0.4,
  OrgColor  : null,
  PaperColor: null,
  PaperID   : 0,
  PaperReaID: 0,
  PaperWater: false,
  PosX      : 0,
  PosY      : 0,
  PosZ      : 0,
  ReaAdspect: [],
  ReaID     : [],
  ReaNum    : 0,
  ReaQty    : [],
  SmellID   : SMELL_NONE,
  SolidColor: null,
  Stirred   : true,
  Type      : GLASS_TYPE_TESTTUBE,
  Water     : false,

  /**** Actions ****/

  Bath      : true,
  Centrifuge: true,
  Dropper   : true,
  Heater    : false,
  Lighter   : false,
  Stirrer   : true,
  Reagent   : true,
  WashBottle: true
};

var TestTube2 = {
  AnaAdspect: ADSPECT_SOLID,
  AnaID     : 0,
  AnaQty    : 0,
  Boiling   : false,
  Burning   : false,
  CentTime  : 0,
  Clean     : false,
  Dock      : null,
  Handle    : null,
  HeatTime  : 0,
  Name      : 'TestTube2',
  LiqAdspect: ADSPECT_LIQUID_NONE,
  LiqColor  : null,
  LiqLvl    : 0,
  LiqLvlMax : 10,
  LiqOpac   : 0.4,
  LiqDefOpac: 0.4,
  OrgColor  : null,
  PaperColor: null,
  PaperID   : 0,
  PaperReaID: 0,
  PaperWater: false,
  PosX      : 0,
  PosY      : 0,
  PosZ      : 0,
  ReaAdspect: [],
  ReaID     : [],
  ReaNum    : 0,
  ReaQty    : [],
  SmellID   : SMELL_NONE,
  SolidColor: null,
  Stirred   : true,
  Type      : GLASS_TYPE_TESTTUBE,
  Water     : false,

  /**** Actions ****/

  Bath      : true,
  Centrifuge: true,
  Dropper   : true,
  Heater    : false,
  Lighter   : false,
  Stirrer   : true,
  Reagent   : true,
  WashBottle: true
};

var TestTube3 = {
  AnaAdspect: ADSPECT_SOLID,
  AnaID     : 0,
  AnaQty    : 0,
  Boiling   : false,
  Burning   : false,
  CentTime  : 0,
  Clean     : false,
  Dock      : null,
  Handle    : null,
  HeatTime  : 0,
  Name      : 'TestTube3',
  LiqAdspect: ADSPECT_LIQUID_NONE,
  LiqColor  : null,
  LiqLvl    : 0,
  LiqLvlMax : 10,
  LiqOpac   : 0.4,
  LiqDefOpac: 0.4,
  OrgColor  : null,
  PaperColor: null,
  PaperID   : 0,
  PaperReaID: 0,
  PaperWater: false,
  PosX      : 0,
  PosY      : 0,
  PosZ      : 0,
  ReaAdspect: [],
  ReaID     : [],
  ReaNum    : 0,
  ReaQty    : [],
  SmellID   : SMELL_NONE,
  SolidColor: null,
  Stirred   : true,
  Type      : GLASS_TYPE_TESTTUBE,
  Water     : false,

  /**** Actions ****/

  Bath      : true,
  Centrifuge: true,
  Dropper   : true,
  Heater    : false,
  Lighter   : false,
  Reagent   : true,
  Stirrer   : true,
  WashBottle: true
};

var TestTube4 = {
  AnaAdspect: ADSPECT_SOLID,
  AnaID     : 0,
  AnaQty    : 0,
  Boiling   : false,
  Burning   : false,
  CentTime  : 0,
  Clean     : false,
  Dock      : null,
  Handle    : null,
  HeatTime  : 0,
  Name      : 'TestTube4',
  LiqAdspect: ADSPECT_LIQUID_NONE,
  LiqColor  : null,
  LiqLvl    : 0,
  LiqLvlMax : 10,
  LiqOpac   : 0.4,
  LiqDefOpac: 0.4,
  OrgColor  : null,
  PaperColor: null,
  PaperID   : 0,
  PaperReaID: 0,
  PaperWater: false,
  PosX      : 0,
  PosY      : 0,
  PosZ      : 0,
  ReaAdspect: [],
  ReaID     : [],
  ReaNum    : 0,
  ReaQty    : [],
  SmellID   : SMELL_NONE,
  SolidColor: null,
  Stirred   : true,
  Type      : GLASS_TYPE_TESTTUBE,
  Water     : false,

  /**** Actions ****/

  Bath      : true,
  Centrifuge: true,
  Dropper   : true,
  Heater    : false,
  Lighter   : false,
  Reagent   : true,
  Stirrer   : true,
  WashBottle: true
};

/**** TV data ****/

var Tv = {
  Controls : null,
  Counter  : null,
  Cursor   : null,
  Handle   : null,
  Menu     : null,
  Log      : null,
  Mode     : TV_MODE_LOG,
  Panel    : null,
  Player   : null,
  PlayMode : TV_PLAYMODE_SINGLE,
  Video    : null,
  VideoCur : 0,
  VideoMax : 0
};

/**** Water bath ****/

var WaterBath = {
  AnaAdspect: ADSPECT_SOLID,
  AnaID     : 0,
  AnaQty    : 0,
  Boiling   : true,
  Burning   : false,
  CentTime  : 0,
  Clean     : false,
  Dock      : null,
  Handle    : null,
  HeatTime  : 0,
  Name      : 'Bath',
  LiqAdspect: ADSPECT_LIQUID_NONE,
  LiqColor  : null,
  LiqLvl    : 8,
  LiqLvlMax : 10,
  LiqOpac   : 0.4,
  LiqDefOpac: 0.4,
  OrgColor  : null,
  PaperColor: null,
  PaperReaID: 0,
  PaperID   : 0,
  PaperWater: false,
  PosX      : 0,
  PosY      : 0,
  PosZ      : 0,
  ReaAdspect: [],
  ReaID     : [],
  ReaNum    : 0,
  ReaQty    : [],
  SmellID   : SMELL_NONE,
  SolidColor: null,
  Stirred   : true,
  Type      : GLASS_TYPE_BEAKER,
  Water     : true,

  /**** Actions ****/

  Bath      : false,
  Centrifuge: false,
  Dropper   : false,
  Heater    : true,
  Lighter   : false,
  Reagent   : false,
  Stirrer   : false,
  WashBottle: false,

  /**** Specific ****/

  DockHole  : [null, null, null, null]
};

/**** WashBottle glass ****/

var WashBottle = {
  AnaAdspect: ADSPECT_SOLID,
  AnaID     : 0,
  AnaQty    : 0,
  Boiling   : false,
  Burning   : false,
  CentTime  : 0,
  Clean     : false,
  Dock      : null,
  Handle    : null,
  Name      : 'WashBottle',
  HeatTime  : 0,
  LiqAdspect: ADSPECT_LIQUID_NONE,
  LiqColor  : null,
  LiqLvl    : 5,
  LiqLvlMax : 10,
  LiqOpac   : 0.4,
  LiqDefOpac: 0.4,
  OrgColor  : null,
  PaperColor: null,
  PaperID   : 0,
  PaperReaID: 0,
  PaperWater: false,
  PosX      : 0,
  PosY      : 0,
  PosZ      : 0,
  ReaAdspect: [],
  ReaID     : [],
  ReaNum    : 0,
  ReaQty    : [],
  SmellID   : SMELL_NONE,
  SolidColor: null,
  Stirred   : true,
  Type      : GLASS_TYPE_WASHBOTTLE,
  Water     : true,

  /**** Actions ****/

  Bath      : false,
  Centrifuge: false,
  Dropper   : false,
  Heater    : false,
  Lighter   : false,
  Reagent   : false,
  Stirrer   : false,
  WashBottle: false
};

/**** Watch glass ****/

var WatchGlass = {
  AnaAdspect: ADSPECT_SOLID,
  AnaID     : 0,
  AnaQty    : 0,
  Boiling   : false,
  CentTime  : 0,
  Clean     : false,
  Dock      : null,
  Handle    : null,
  Name      : 'WatchGlass',
  HeatTime  : 0,
  LiqAdspect: ADSPECT_LIQUID_NONE,
  LiqColor  : null,
  LiqLvl    : 0,
  LiqLvlMax : 5,
  LiqOpac   : 0.5,
  LiqDefOpac: 0.5,
  OrgColor  : null,
  PaperColor: null,
  PaperID   : 0,
  PaperReaID: 0,
  PaperWater: false,
  PosX      : 0,
  PosY      : 0,
  PosZ      : 0,
  ReaAdspect: [],
  ReaID     : [],
  ReaNum    : 0,
  ReaQty    : [],
  SmellID   : SMELL_NONE,
  SolidColor: null,
  Stirred   : true,
  Type      : GLASS_TYPE_WATCHGLASS,
  Water     : false,

  /**** Actions ****/

  Bath      : false,
  Centrifuge: false,
  Dropper   : true,
  Heater    : false,
  Reagent   : true,
  Stirrer   : true,
  WashBottle: true
};

/**** Adspect to ID conversion ****/

var Adspect2Id = {
  [ADSPECT_PAPER]  : "#Solid-Paper",
  [ADSPECT_PLATE]  : "#Solid-Copper",
  [ADSPECT_POWDER] : "#Solid"
};

/**** Glassware list ****/

var GlassWare = [Beaker, Curcible, Dropper, Lighter, Nichrome, Stirrer, TestTube1, TestTube2, TestTube3,
                 TestTube4, WaterBath, WatchGlass, WashBottle];

/**** Test tube list ****/

var TestTube  = [TestTube1, TestTube2, TestTube3, TestTube4];

