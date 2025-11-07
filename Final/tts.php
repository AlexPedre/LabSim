<?php

  /*******************************************
  **** LabSim - On-line speach synthesis  ****
  **** (c) 2020-2021, Alessandro Pedretti ****
  *******************************************/

  /**** Parameters ****/

  define('LSTTS_HOME'      , '/labsim/');
  define('LSTTS_TTS_EXE'   , '/usr/bin/pico2wave');
  define('LSTTS_LAME_EXE'  , '/usr/bin/lame');
  define('LSTTS_LAME_OPT'  , '-f -m m --quiet');
  define('LSTTS_OUTDIR'    , LSTTS_HOME.'ttscache');

  /**** Commands ****/

  define('LSTTS_COM_CACHECLEAR', 0);
  define('LSTTS_COM_SPEECH'    , 1);

  $Command      = LSTTS_COM_SPEECH;
  $SuppCommands = array('cacheclear', 'speech');

  if ((isset($_GET['command'])) && ($_GET['command'])) {
    $Command = array_search(strtolower($_GET['command']), $SuppCommands);
    if ($Command === false)
      die("ERROR: Unknown command");
  }

  if (strtoupper(substr(PHP_OS, 0, 3)) === 'WIN') {
    define("DIR_SEP", "\\");
    define("LSTTS_RMDIR", "rd /S /Q");
  } else {
    define("DIR_SEP", "/");
    define("LSTTS_RMDIR", "rm -rf");
  }

  /*** Output directory ****/

  $OutDir = realpath($_SERVER["DOCUMENT_ROOT"].LSTTS_OUTDIR);
  switch($Command) {
  case LSTTS_COM_CACHECLEAR:
    exec(LSTTS_RMDIR.' "'.$OutDir.DIR_SEP.'"*');
    echo ' TTS chache is now empty';
    break;

  case LSTTS_COM_SPEECH:

    /**** Supported languages ***/

    $SuppLang = array('de-DE', 'en-US', 'en-GB', 'es-ES', 'fr-FR', 'it-IT');

    if ((!isset($_GET['text'])) || (!$_GET['text']))
      die("ERROR: missing text");

    $Lang = 'it-IT';
    if (isset($_GET['lang']))
      $Lang = $_GET['lang'];

    if (array_search($Lang, $SuppLang) === false)
      die("ERROR: Language not supported");

    if (!is_writable($OutDir))
      die("ERROR: Can't write into cache directory");

    /**** Create the language cache ****/

    $OutDir = $OutDir.DIR_SEP.$Lang;
    if (!file_exists($OutDir))
      mkdir($OutDir);

    $Text    = $_GET['text'];
    $OutFile = $OutDir.DIR_SEP.md5($Text);
    $TmpFile = $OutFile.'.wav';
    $OutFile = $OutFile.'.mp3';

    /**** Fix wrong words
     **** Clear the chache if you change the list
     */

      $LangFix = array(
      'de-DE' => array(
        'Word' => array(
        ),
        'Fix' => array(
        )
      ),

      'en-US' => array(
        'Word' => array(
        ),
        'Fix' => array(
        )
      ),

      'en-GB' => array(
        'Word' => array(
        ),
        'Fix' => array(
        )
      ),

      'es-ES' => array(
        'Word' => array(
        ),
        'Fix' => array(
        )
      ),

      'fr-FR' => array(
        'Word' => array(
        ),
        'Fix' => array(
        )
      ),

      'it-IT' => array(
        'Word' => array(
          '/\bAccendino\b/i',
          '/\bAcido\b/i',
          '/\bAspirala\b/i',
          '/\bBagnomaria\b/i',
          '/\bBiossido\b/i',
          '/\bBunsen\b/i',
          '/\bDiclorometano\b/i',
          '/\bDispari\b/i',
          '/\bGoogle\b/i',
          '/\bIdrogeno\b/i',
          '/\bIdrossido\b/i',
          '/\bInutile\b/i',
          '/\bLamina\b/i',
          '/\bOrecchie\b/i',
          '/\bOssido\b/i',
          '/\bSpatola\b/i',
          '/\bUsa\b(.*)/i',
          '/\bUtile\b/i'
        ),
        'Fix' => array(
          'accendinho',
          'aci do',
          'aspira la',
          'bagnomarhia',
          'biossi do',
          'bun sen', //"bun'shen",
          'diclorometaano',
          'dispa ri',
          'guugol',
          'hidrogeno',
          'idrossi do',
          'inutil e',
          'lami na',
          'orecchi e',
          'ossi do',
          'spato laa',
          'usha',
          'util e'
        )
      )
    );

    if (count($LangFix[$Lang]['Word']))
      $Text = preg_replace($LangFix[$Lang]['Word'], $LangFix[$Lang]['Fix'], $Text);

    /**** Create the tts file ****/

    if (!file_exists($OutFile)) {
      exec(LSTTS_TTS_EXE.' -l '.$Lang.' -w "'.$TmpFile.'" "'.$Text.'"');
      exec(LSTTS_LAME_EXE.' '.LSTTS_LAME_OPT.' "'.$TmpFile.'" "'.$OutFile.'"');
      unlink($TmpFile);
    }

    /**** Send the file ****/

//  header('Location: '.LSTTS_OUTDIR.$Lang.'/'.md5($_GET['text']).'.mp3');

    /**** For Apache2 ****/

    header("X-Sendfile: ".$OutFile);
    header('Content-Type: audio/mpeg');
    header('Content-Disposition: attachment; filename="' . basename($OutFile) . '"');

    exit();
  } /* End of switch */
?>
