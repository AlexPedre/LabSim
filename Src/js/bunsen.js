
/*******************************************
****       LabSim - Bunsen burner       ****
**** (c) 2020-2025, Alessandro Pedretti ****
*******************************************/


/**** Turn on/off the bunsen ****/

function BunsenBurn(On)
{
  if (On) {
    if (!Bunsen.On) {
      Speak(Msg.SsBunsenNoGas);
      return;
    }

    StopSound('SND_BunsenGasLoop');
    clearInterval(Bunsen.hTimer);
    Bunsen.Handle.querySelector('#FlameRed').setAttribute('particle-system', 'enabled: true');
    PlaySound('SND_BunsenLoop');
    DisableShadowAll();
    Bunsen.Burning = true;
    Speak(Msg.SsBunsenOn);
  } else {
    if (!Bunsen.On) {
      ShowError(Msg.SsBunsenAlrOff);
      return;
    }
    BunsenGas(On);
  }

  Bunsen.On = On;
}


/**** Change the flame color ****/

function BunsenColor(Colors)
{
  if ((!Bunsen.On) || (!Bunsen.Ox)) return;

  if (typeof(Colors) === 'undefined')
    Bunsen.FlameOxHandle.setAttribute('particle-system', 'color: #020202,#0000FF,#0000FF');
  else
    Bunsen.FlameOxHandle.setAttribute('particle-system', 'color: ' + Colors);

  DisableShadowAll();
}


/**** Turn the flame to oxidant ***/

function BunsenOxidant(Ox)
{
  var Ring = Bunsen.Handle.querySelector('#Ring');

  if (Ox) {
    if (Bunsen.Ox) {
      ShowError(Msg.SsBunsenAlrOx);
      return;
    }
    Bunsen.Handle.querySelector('#AirHole1').setAttribute('position', "0 0.032 0");
    Ring.setAttribute('rotation', '0 90 0');
    Speak(Msg.SsBunsenOx);
  } else {
    if (!Bunsen.Ox) {
      ShowError(Msg.SsBunsenAlrRed);
      return;
    }
    Bunsen.Handle.querySelector('#AirHole1').setAttribute('position', "0 -3 0");
    Ring.setAttribute('rotation', '0 0 0');
    Speak(Msg.SsBunsenRed);
  }

  if (Bunsen.Burning) {
    Bunsen.Handle.querySelector('#FlameOx' ).setAttribute('particle-system', Ox ? 'enabled: true'  : 'enabled: false');
    Bunsen.Handle.querySelector('#FlameRed').setAttribute('particle-system', Ox ? 'enabled: false' : 'enabled: true');
    DisableShadowAll();
  }

  Bunsen.Ox = Ox;
}


/**** Turn on/off the gas ****/

function BunsenGas(On)
{
  if (On) {
    if (Bunsen.On) {
      ShowError(Msg.SsBunsenAlrGasOpen);
      return;
    }

    Bunsen.Timer  = 0;
    Bunsen.hTimer = setInterval(function() {
      ++Bunsen.Timer;
      switch(Bunsen.Timer) {
      case 15:
        Speak(Msg.SsSmellGas1);
        break;

      case 30:
        Speak(Msg.SsSmellGas2);
        break;

      case 60:
        Speak(Msg.SsSmellGas3);
        break;

      case 120:
        Explosion();
        break;
      } /* End of switch */
    }, 1000);

    PlaySound('SND_BunsenGasLoop');
  } else {
    if (!Bunsen.On) {
      ShowError(Msg.SsBunsenAlrGasClose);
      return;
    }

    if (Bunsen.Burning) {
      Bunsen.Handle.querySelector(Bunsen.Ox ? '#FlameOx' : '#FlameRed').setAttribute('particle-system', 'enabled: false');
      DisableShadowAll();
      StopSound('SND_BunsenLoop');
      Bunsen.Burning = false;
      Speak(Msg.SsBunsenOff);
    } else {
      StopSound('SND_BunsenGasLoop');
      clearInterval(Bunsen.hTimer);
    }
  }

  Bunsen.On = On;
}


/**** Turn on ****/

function BunsenTurnOn()
{
  if (Bunsen.Burning) {
    Speak(Msg.SsBunsenAlrOn);
    return;
  }

  if (GlassReady.Obj !== Lighter) {
    Speak(Msg.SsBunsenNoLighter);
    return;
  }

  ScLighterClick(Bunsen);
}