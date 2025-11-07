
/*******************************************
****           LabSim - Debug           ****
**** (c) 2020-2025, Alessandro Pedretti ****
*******************************************/

/*
 * This file can be removed in the production version
 *
 * Commands:
 * ~~~~~~~~~
 * CodeGen(Students, Sol, Insol) -> Generate the codes for the analysi
 * DebugAgBr()                   -> Perform the precipitation of AgBr in tube 1
 * DebugAgCl()                   -> Perform the precipitation of AgCl in tube 1
 * DebugAgI()                    -> Perform the precipitation of AgCl in tube 1
 * DebugCentrifuge()             -> Perform the phase separation
 * DebugFormula(Formula, Glass)  -> Prepare a solution
 * DebugH3BO3()                  -> Prepare the test for H3BO3
 * DebugHeat(Time, What)         -> Heat the glassware
 * DebugRingTest(Tube, LiqLevel) -> Prepare the solution for the ring test
 * DebugTiO2()                   -> Prepare the test for TiO2
 */


/**** Perform the precipitation of AgBr in tube 1 ****/

function DebugAgBr()
{
  DebugPrec(62, "#FFFFCC");
}


/**** Perform the precipitation of AgCl in tube 1 ****/

function DebugAgCl()
{
  DebugPrec(61, "#FFFFFF");
}


/**** Perform the precipitation of AgI in tube 1 ****/

function DebugAgI()
{
  DebugPrec(62, "#FFFF00");
}


/**** Perform the phase separation ****/

function DebugCentrifuge()
{
  for(var k = 0; k < 4; ++k) {
    var Tube = TestTube[k];

    if ((Tube.AnaID) && (Tube.LiqAdspect === ADSPECT_LIQUID_SUSP))
      CentrifugeDoSeparation(Tube);
  } /* End of for (k) */

  console.log(LOG_PROMPT, "Ok");
}


/**** Perepare a solution of a salt ****/

function DebugFormula(Formula, Glass)
{
  var MolID = GetMolIDByFormula(Formula);

  if (!MolID) {
    console.log(LOG_PROMPT, 'ERROR: Unknown molecule', Formula);
    return;
  }

  DebugSol(MolID, COLOR_WHITE, Glass);
}


/**** Debug H3BO3 ****/

function DebugH3BO3()
{
  GlassEmpty(Curcible);

  Curcible.AnaAdspect = ADSPECT_SOLID;
  Curcible.AnaID      = 47; // 47 = H3BO3
  Curcible.AnaQty     = 1;
  Curcible.Boiling    = false;
  Curcible.Burning    = false;
  Curcible.Clean      = false;
  Curcible.HeatTime   = 0;
  Curcible.LiqAdspect = ADSPECT_LIQUID_NONE;
  Curcible.LiqColor   = COLOR_WHITE;
  Curcible.LiqLvl     = 3;
  Curcible.SolidColor = COLOR_WHITE;
  Curcible.ReaAdspect = [ADSPECT_LIQUID, ADSPECT_LIQUID];
  Curcible.ReaID      = [REA_ID_H2SO4_CONC, REA_ID_CH3OH];
  Curcible.ReaNum     = 2;
  Curcible.ReaQty     = [1, 2];
  Curcible.Stirred    = true;
  Curcible.Water      = false;

  Reaction(Curcible);
}


/**** Heat the glassware ****/

function DebugHeat(Time, What)
{
  if (!What) What = TestTube1;
  if (!Time) Time = 1000;

  What.HeatTime = Time;

  Reaction(What);
}


/**** Perform the precipitation of a salt ****/

function DebugPrec(AnaID, SolidColor)
{
  var Tube = TestTube1;

  Tube.AnaAdspect = ADSPECT_SOLID;
  Tube.AnaID      = AnaID;
  Tube.AnaQty     = 1;
  Tube.Boiling    = false;
  Tube.CentTime   = 0;
  Tube.Clean      = false;
  Tube.HeatTime   = 0;
  Tube.LiqAdspect = 1;
  Tube.LiqColor   = COLOR_WHITE;
  Tube.LiqLvl     = 2;
  Tube.ReaAdspect = [4];
  Tube.ReaID      = [12];
  Tube.ReaNum     = 1;
  Tube.ReaQty     = [1];
  Tube.SolidColor = SolidColor;
  Tube.Stirred    = false;
  Tube.Water      = true;

  LiquidUpdate(Tube);
  DebugCentrifugue();
}


/**** Perepare a solution of a salt ****/

function DebugSol(AnaID, SolidColor, Tube)
{
  if (!AnaID     ) AnaID = 37 // Na2SO3
  if (!Tube      ) Tube = TestTube1;
  if (!SolidColor) SolidColor = COLOR_WHITE;

  GlassEmpty(Tube);

  Tube.AnaAdspect = ADSPECT_LIQUID;
  Tube.AnaID      = AnaID;
  Tube.AnaQty     = 1;
  Tube.Boiling    = false;
  Tube.Clean      = false;
  Tube.HeatTime   = 0;
  Tube.LiqAdspect = ADSPECT_LIQUID_NONE;
  Tube.LiqColor   = COLOR_WHITE;
  Tube.LiqLvl     = 2;
  Tube.SolidColor = SolidColor;
  Tube.Water      = true;
  Tube.Stirred    = true;

  Reaction(Tube);
}


/**** Debug TiO2 ****/

function DebugTiO2()
{
  GlassEmpty(Curcible);

  Curcible.AnaAdspect = ADSPECT_SOLID;
  Curcible.AnaID      = 59; // 59 = TiO2
  Curcible.AnaQty     = 1;
  Curcible.Boiling    = false;
  Curcible.Burning    = false;
  Curcible.Clean      = false;
  Curcible.HeatTime   = 0;
  Curcible.LiqAdspect = ADSPECT_LIQUID_NONE;
  Curcible.LiqColor   = null;
  Curcible.LiqLvl     = 0;
  Curcible.SolidColor = COLOR_WHITE;
  Curcible.ReaAdspect = [ADSPECT_SOLID];
  Curcible.ReaID      = [27]; // KHSO4
  Curcible.ReaNum     = 1;
  Curcible.ReaQty     = [1];
  Curcible.Stirred    = true;
  Curcible.Water      = false;

  Reaction(Curcible);

  DebugHeat(10000, Curcible);

  Curcible.LiqLvl     = 2;
  Curcible.Water      = true;
  Curcible.Stirred    = true;
  LiquidUpdate(Curcible);

 // Reaction(Curcible);
}


/**** Prepare the solution for the ring test ****/

function DebugRingTest(Tube, LiqLevel)
{
  if (!Tube    ) Tube     = TestTube1;
  if (!LiqLevel) LiqLevel = 2;

  GlassEmpty(Tube);
  Tube.AnaAdspect = ADSPECT_LIQUID;
  Tube.AnaID      = 17; // 17 = KNO3
  Tube.AnaQty     = 1;
  Tube.Boiling    = false;
  Tube.Clean      = false;
  Tube.HeatTime   = 0;
  Tube.LiqAdspect = ADSPECT_LIQUID_NONE;
  Tube.LiqColor   = COLOR_WHITE;
  Tube.LiqLvl     = LiqLevel;
  Tube.SolidColor = "#e8ffe5";
  Tube.Water      = true;
  Tube.ReaAdspect = [ADSPECT_LIQUID, ADSPECT_LIQUID];
  Tube.ReaID      = [REA_ID_FESO4, REA_ID_H2SO4];
  Tube.ReaNum     = 2;
  Tube.ReaQty     = [2, 1];
  Tube.Stirred    = true;
  Tube.Water      = true;

  Reaction(Tube);
}



