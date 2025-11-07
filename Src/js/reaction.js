
/*******************************************
****         LabSim - Reactions         ****
**** (c) 2020-2025, Alessandro Pedretti ****
*******************************************/


/**** Empirical pH ramp ****/

const AmbientValMtx = [
   0,   /* REA_TYPE_UNKNOWN       */
   4,   /* REA_TYPE_ACIDSTRONG    */
   8,   /* REA_TYPE_ACIDSTRONGCO  */
   2,   /* REA_TYPE_ACIDWEAK      */
  -4,   /* REA_TYPE_BASESTRONG    */
  -2    /* REA_TYPE_BASEWEAK      */
];

const AMB_BUFFERCONC = 4;
const AMB_DILEFFECT  = 6;


/**** Get the ambient for solubility test ****/

function GetAmbientForSolubility(Glass)
{
  var i, Type;

  switch(Glass.ReaNum) {
  case 0:
    return REA_TYPE_UNKNOWN;

  case 1:
    Type = GetReaTypeByID(Glass.ReaID[0]);
    if (Type === REA_TYPE_BUFFER) {
      switch(Glass.ReaID[0]) {
      case REA_ID_BUFFER_PH5:
        return REA_TYPE_ACIDWEAK;

      case REA_ID_BUFFER_PH9:
        return REA_TYPE_BASEWEAK;

      default:
        return REA_TYPE_UNKNOWN;
      } /* End of switch */
    } else if (Type > REA_TYPE_BASEWEAK) return REA_TYPE_UNKNOWN;
    break;
  } /* End of switch */

  if (Glass.ReaNum > 1) {

    /**** Calculate the ponderal mean ****/

    var BufID   = 0;
    var BufNum  = 0;
    var BufQty  = 0;
    var Num     = 0;
    var Sum     = 0;
    for(i = 0; i < Glass.ReaNum; ++i) {
      if (Glass.ReaAdspect[i] === ADSPECT_LIQUID) {
        var ReaType = GetReaTypeByID(Glass.ReaID[i]);
        if (ReaType <= REA_TYPE_BASEWEAK) {
          Num += Glass.ReaQty[i];
          Sum += Glass.ReaQty[i] * AmbientValMtx[ReaType];
        } else if (ReaType === REA_TYPE_BUFFER) {
          BufID   = Glass.ReaID[i];
          BufQty += Glass.ReaQty[i] * AMB_BUFFERCONC;
          ++BufNum;
        }
      }
    } /* End of for (i) */

    /**** Evaluate the buffer effect ****/

    if (BufNum === 1) {
      if (BufID === REA_ID_BUFFER_PH5) {
        if (Math.abs(Sum) <= BufQty) return REA_TYPE_ACIDWEAK;
      } else {
        if (Math.abs(Sum) <= BufQty) return REA_TYPE_BASEWEAK;
      }
    } else if (BufNum === 2) {
      if (Math.abs(Sum) < BufQty) return REA_TYPE_UNKNOWN;
    }
  } else {
    Num = Glass.ReaQty[0];
    Sum = AmbientValMtx[Type] * Num;
  }

   if (Num) {
     Sum /= Num;

     /**** Adjust the concentration ****/

     if ((Glass.LiqLvl > 1) && (Sum > 0))
       Sum /= 1 + Glass.LiqLvl / AMB_DILEFFECT;

          if (Sum >  AmbientValMtx[REA_TYPE_ACIDSTRONG]) Type = REA_TYPE_ACIDSTRONGCO;
     else if (Sum >  AmbientValMtx[REA_TYPE_ACIDWEAK  ]) Type = REA_TYPE_ACIDSTRONG;
     else if (Sum >  0                                 ) Type = REA_TYPE_ACIDWEAK;
     else if (Sum >= AmbientValMtx[REA_TYPE_BASEWEAK  ]) Type = REA_TYPE_BASEWEAK;
     else Type = REA_TYPE_BASESTRONG;
   } else Type = REA_TYPE_UNKNOWN;


  return Type;
}


/**** Get the event name by ID ****/

function GetEventByID(EventID)
{
  if (!EventID) return null;

  var Event;
  var Stmt = hDb.prepare('SELECT ' + Msg.SqlEvent + ' FROM Events WHERE (EventID=' + EventID + ');');

  if (Stmt.step())
    Event = Stmt.getAsObject()[Msg.SqlEvent];

  Stmt.free();

  return Event;
}


/**** Get the ion ID from molecule ID ****/

function GetIonID(MolID, What)
{
  var   IonID   = 0;
  const WhatStr = ['AnionID', 'CationID1', 'CationID2'];

  var Stmt = hDb.prepare('SELECT ' + WhatStr[What] + ' FROM Molecules WHERE (MoleculeID=' + MolID + ');');

  if (Stmt.step())
    IonID = Stmt.getAsObject()[WhatStr[What]];

  Stmt.free();

  return IonID;
}


/**** Get the ion name by ID ****/

function GetIonFormulaByID(IonID)
{
  if (!IonID) return null;

  var Formula;
  var Stmt = hDb.prepare('SELECT Formula FROM Ions WHERE (IonID=' + IonID + ');');

  if (Stmt.step())
    Formula = Stmt.getAsObject().Formula;

  Stmt.free();

  return Formula;
}


/**** Get ion pH ****/

function GetIonPh(IonID)
{
  var pHVal = PHID_ND;

  if (IonID) {
    var Stmt = hDb.prepare('SELECT pHs.pHVal FROM pHs INNER JOIN Ions ON pHs.pHID = Ions.pHID ' +
                           'WHERE (Ions.IonID=' + IonID + ');');

    if (Stmt.step())
      pHVal = Stmt.getAsObject().pHVal;

    Stmt.free();
  }

  return pHVal;
}


/**** Get ion pH ID ****/

function GetIonPhID(IonID)
{
  var pHVal = PHID_ND;

  if (IonID) {
    var Stmt = hDb.prepare('SELECT pHs.pHID FROM pHs INNER JOIN Ions ON pHs.pHID = Ions.pHID ' +
                           'WHERE (Ions.IonID=' + IonID + ');');

    if (Stmt.step())
      pHVal = Stmt.getAsObject().pHID;

    Stmt.free();
  }

  return pHVal;
}


/**** Get the pH of a mixture ****/

function GetMixPh(Glass)
{
  var Num, MixPh

  if ((Glass.AnaID) && (Glass.AnaAdspect === ADSPECT_LIQUID)) {
    MixPh = GetMolPh(Glass.AnaID);
    Num   = 1;
  } else {
    MixPh = 0;
    Num   = 0;
  }

  var Fix = false;

  for(var i = 0; i < Glass.ReaNum; ++i) {
    if (Glass.ReaAdspect[i] === ADSPECT_LIQUID) {
      var ReaID = Glass.ReaID[i];
      switch(ReaID) {
      case REA_ID_BUFFER_PH5:
        Fix    = true;
        MixPh  = 5;
        Num    = 1;
        continue;

      case REA_ID_BUFFER_PH9:
        Fix    = true;
        MixPh  = 9;
        Num    = 1;
        continue;

      case REA_ID_H2SO4_CONC:
      case REA_ID_HCL_6M:
      case REA_ID_HCL_CONC:
        Fix    = true;
        MixPh  = 1;
        Num    = 1;
        continue;
      } /* End of switch */

      if (!Fix) {
        var Stmt = hDb.prepare('SELECT Reagents.MoleculeID1, Reagents.MoleculeID2, Reagents.MoleculeID3 FROM Reagents ' +
                               'WHERE (Reagents.ReagentID=' + ReaID + ');');
        if (Stmt.step()) {
          var Obj = Stmt.getAsObject();
          for(var k = 1; k <= 3; ++k) {
            var MolID = Obj['MoleculeID' + k];
            if (MolID) {
              var ReaPh = GetMolPh(MolID);
              if (ReaPh !== 7) {
                MixPh += ReaPh;
                ++Num;
              }
            }
          } /* End of for (k) */
        }
        Stmt.free();
      }
    }
  } /* End of for (i) */

  if (!MixPh) return 7;

  return (MixPh / Num);
}


/**** Get the molecule formula by ID ****/

function GetMolIDByFormula(Formula)
{
  if (!Formula) return 0;

  var MoleculeID;
  var Stmt = hDb.prepare('SELECT MoleculeID FROM Molecules WHERE (Formula = "' + Formula + '");');

  if (Stmt.step())
    MoleculeID = Stmt.getAsObject().MoleculeID;

  Stmt.free();

  return MoleculeID;
}


/**** Get the pH of a molecule ****/

function GetMolPh(MolID)
{
  if (!MolID) return 7;

  var MolPh = 0;
  var Num   = 0;
  for(var i = 0; i < 3; ++i) {
    var IonPh = GetIonPh(GetIonID(MolID, i));
    if (IonPh !== 7) {
      MolPh += IonPh;
      ++Num;
    }
  } /* End if for (i) */

  if (!MolPh) return 7;

  return (MolPh / Num);
}


/**** Get the pH of a molecule ****/

function GetMolPhID(MolID)
{
  if (!MolID) return PHID_NEUTRAL;

  var MolPhID = PHID_NEUTRAL;
  for(var i = 0; i < 3; ++i) {
    var IonPhID = GetIonPhID(GetIonID(MolID, i));
    if (IonPhID !== PHID_ND) {
      if (MolPhID === PHID_NEUTRAL) MolPhID = IonPhID;
      else if (((MolPhID === PHID_5) && (IonPhID === PHID_8to10)) ||
               ((MolPhID === PHID_8to10) && (IonPhID === PHID_5)))
        MolPhID = PHID_NEUTRAL;
    }
  } /* End if for (i) */

  return MolPhID;
}


/**** Get the reagent label by ID ****/

function GetReaLabelByID(ReaID)
{
  if (!ReaID) return null;

  var Label;
  var Stmt = hDb.prepare('SELECT ' + Msg.SqlReagent + ' FROM Reagents WHERE (ReagentID=' + ReaID + ');');

  if (Stmt.step())
    Label = Stmt.getAsObject()[Msg.SqlReagent];

  Stmt.free();

  return Label;
}


/**** Get the reagent type by ID ****/

function GetReaTypeByID(ReaID)
{
  var ReaType = REA_TYPE_UNKNOWN;
  var Stmt    = hDb.prepare('SELECT ReagentTypeID FROM Reagents WHERE (ReagentID = ' + ReaID + ');');

  if (Stmt.step())
    ReaType = Stmt.getAsObject().ReagentTypeID;

  return ReaType;
}


/**** Get the smell by ID ****/

function GetSmellByID(SmellID)
{
  if (!SmellID) SmellID = SMELL_NONE;

  var Smell;
  var Stmt = hDb.prepare('SELECT ' + Msg.SqlSmell + ' FROM Smells WHERE (SmellID=' + SmellID + ');');

  if (Stmt.step())
    Smell = Stmt.getAsObject()[Msg.SqlSmell];

  Stmt.free();

  return Smell;
}


/**** Check if anything happen ****/

function Reaction(Glass)
{
  if (DEBUG) {
    console.log(LOG_PROMPT, "Reaction",
                '\nGlassware:', Glass.Name,
                '\nStirred:', Glass.Stirred,
                '\nHeat:', Glass.HeatTime,
                '\nWater:', Glass.Water);
  }

  if (GlassIsEmpty(Glass)) return;

  var Colors        = [null, null];
  var ColorID       = [0, 0];
  var EventID       = [EVENT_NONE, EVENT_NONE];
  var ProductID     = [0, 0];
  var SmellID       = SMELL_NONE;
  var GlasswareID   = [0, 0, 0];
  var LiqAdspect    = Glass.LiqAdspect;

  var AnaID, i, k, Evt;
  var EventID1, EventID2;
  var ReaType, Stmt;

  if ((Glass.Water) || (Glass.ReaID.indexOf(REA_ID_CH2CL2) !== -1)) {
    var SolGrade;

    var Ambient       = GetAmbientForSolubility(Glass);
    var SolutionColor = null;

    /**** Solubility ****/

    if (Glass.AnaID) {
      SolGrade = ((Glass.AnaAdspect === ADSPECT_SOLID) || (Glass.AnaAdspect === ADSPECT_POWDER)) ? SOLGRADE_INSOL : SOLGRADE_FULL;

      if ((Glass.Stirred) && (!Glass.ReaNum)) {
        Stmt = hDb.prepare('SELECT SolWater FROM Molecules WHERE (MoleculeID = ' + Glass.AnaID + ');');

        if (!Stmt.step()) {
          if (DEBUG)
           console.log(LOG_PROMPT, 'Unable to get the solubility for AnaID = ', Glass.AnaID);
          Stmt.free();
          return;
        }
        if (Stmt.getAsObject().SolWater)
          SolGrade = SOLGRADE_FULL;
        Stmt.free();
      }

      if (SolGrade !== SOLGRADE_FULL) {

        /**** Check the reagents ****/

        for(k = 0; k < Glass.ReaNum; ++k) {
          Stmt = hDb.prepare('SELECT SolGradeID, EventID1, ColorID1, EventID2, ColorID2, SmellID FROM Solubilities WHERE (' +
                             'Solubilities.MoleculeID = ' + Glass.AnaID + ' AND Solubilities.ReagentTypeID ' +
                             ((Ambient === REA_TYPE_UNKNOWN) ? 'IS NULL' : ('= ' + Ambient)) +
                             ' AND ReagentID = ' + Glass.ReaID[k] +
                             ');');
          if (Stmt.step()) {
            Colors[0]  = ColorByID(Stmt.getAsObject().ColorID1);
            Colors[1]  = ColorByID(Stmt.getAsObject().ColorID2);
            EventID[0] = Stmt.getAsObject().EventID1;
            EventID[1] = Stmt.getAsObject().EventID2;
            SmellID    = Stmt.getAsObject().SmellID;
            SolGrade   = Stmt.getAsObject().SolGradeID;
            if (SolGrade === SOLGRADE_FULL) {
              Stmt.free();
              break;
            }
          }
          Stmt.free();
        } /* End of for (k) */

        /**** Check the ambient ****/

        if (SolGrade !== SOLGRADE_FULL) {
          Stmt = hDb.prepare('SELECT SolGradeID, EventID1, ColorID1, EventID2, ColorID2, SmellID FROM Solubilities WHERE (' +
                             'Solubilities.MoleculeID = ' + Glass.AnaID + ' AND Solubilities.ReagentTypeID ' +
                             ((Ambient === REA_TYPE_UNKNOWN) ? 'IS NULL' : ('= ' + Ambient)) +
                             ');');
          if (Stmt.step()) {
            Colors[0]  = ColorByID(Stmt.getAsObject().ColorID1);
            Colors[1]  = ColorByID(Stmt.getAsObject().ColorID2);
            EventID[0] = Stmt.getAsObject().EventID1;
            EventID[1] = Stmt.getAsObject().EventID2;
            SmellID    = Stmt.getAsObject().SmellID;
            SolGrade   = Stmt.getAsObject().SolGradeID;
          }
          Stmt.free();
        }

        /**** Check if it is not stirred ****/

        if (!Glass.Stirred) {
          for(Evt = 0; Evt < 2; ++Evt) {
            if ((EventID[Evt] === EVENT_EFFERV) || (EventID[Evt] === EVENT_EFFERVSLIGHT)) {
              Glass.Stirred = true;
              Reaction(Glass);
              return;
            }
          } /* End of for (Evt) */

          if ((Glass.AnaAdspect === ADSPECT_SOLID) &&  (SolGrade === SOLGRADE_FULL))
            SolGrade = SOLGRADE_INSOL;
        }
      }

      if (SolGrade === SOLGRADE_FULL) {
        Glass.AnaAdspect = ADSPECT_LIQUID;
        LiqAdspect       = ADSPECT_LIQUID_NONE;
      } else {
        if (Glass.AnaAdspect !== ADSPECT_SOLID) {
/*
          if ((Colors[0] !== COLOR_WHITE) && (!Glass.Stirred))
            Colors[0] = null;
        } else {
*/
          Glass.AnaAdspect = ADSPECT_SOLID;
          LiqAdspect = ADSPECT_LIQUID_SUSP;
        }
      }

      if (DEBUG)
        console.log(LOG_PROMPT, "Analyte solubility grade", SolGrade, EventID1, EventID2);
    }

    /**** Reagent solubility ****/

    for(i = 0; i < Glass.ReaNum; ++i) {
      if ((Glass.ReaAdspect[i] === ADSPECT_SOLID) || (Glass.ReaAdspect[i] === ADSPECT_POWDER)) {
        var MolID = ReaId2AnaId(Glass.ReaID[i]);
        SolGrade  = SOLGRADE_INSOL;

        if (Glass.ReaID[i] !== REA_ID_DUMMYINSOL) {
          if ((Glass.Stirred) && (Glass.ReaNum === 1)) {
            Stmt = hDb.prepare('SELECT SolWater, ColorID FROM Molecules WHERE (MoleculeID = ' + MolID + ');');

            if (!Stmt.step()) {
              if (DEBUG)
                console.log(LOG_PROMPT, 'Unable to get the solubility for ReaID =', Glass.ReaID[i], 'MolID =', MolID);
              Stmt.free();
              continue;
            }

            if (Stmt.getAsObject().SolWater) {
              SolGrade  = SOLGRADE_FULL;
              Colors[0] = ColorByID(Stmt.getAsObject().ColorID);
              Stmt.free();
            }
          }

          if (SolGrade !== SOLGRADE_FULL) {
            Stmt = hDb.prepare('SELECT SolGradeID, EventID1, ColorID1, EventID2, ColorID2, SmellID FROM Solubilities WHERE (' +
                               'Solubilities.MoleculeID = ' + MolID + ' AND Solubilities.ReagentTypeID ' +
                               ((Ambient === REA_TYPE_UNKNOWN) ? 'IS NULL' : ('= ' + Ambient)) +
                               ');');

            if (Stmt.step()) {
              SolGrade = Stmt.getAsObject().SolGradeID;

              if (SolGrade) {
                Colors[0]  = ColorByID(Stmt.getAsObject().ColorID1);
                Colors[1]  = ColorByID(Stmt.getAsObject().ColorID2);
                EventID[0] = Stmt.getAsObject().EventID1;
                EventID[1] = Stmt.getAsObject().EventID2;
                SmellID    = Stmt.getAsObject().SmellID;

                if (!Glass.Stirred) {
                  for(Evt = 0; Evt < 2; ++Evt) {
                    if ((EventID[Evt] === EVENT_EFFERV) || (EventID[Evt] === EVENT_EFFERVSLIGHT)) {
                      Glass.Stirred = true;
                      Reaction(Glass);
                      return;
                    }
                  } /* End of for (Evt) */
                  SolGrade = SOLGRADE_INSOL;
                }
              }
            }
            Stmt.free();
          }
        }

        if (SolGrade === SOLGRADE_FULL) {
          var MolColor        = ColorByMolID(MolID);
          Glass.ReaAdspect[i] = ADSPECT_LIQUID;
          if (MolColor !== COLOR_WHITE)
            Glass.LiqColor = ((!Glass.LiqColor) || (Glass.LiqColor === COLOR_WHITE)) ? MolColor : ColorBlend(Glass.LiqColor, MolColor, 0.5);
//          LiqAdspect    = ADSPECT_LIQUID_NONE;
        } else if ((Glass.ReaAdspect[i] !== ADSPECT_POWDER) && (Glass.ReaAdspect[i] !== ADSPECT_SOLID)) {
          Glass.ReaAdspect[i] = ADSPECT_SOLID;
          LiqAdspect          = ADSPECT_LIQUID_SUSP;
        }

        if (DEBUG)
          console.log(LOG_PROMPT, 'Reactive ID', Glass.ReaID[i], 'solubility grade', SolGrade, EventID[0], EventID[1]);
      }
    } /* End of for (i) */

    /**** Set the smell according the mixture components ****/

    for(i = 0; i < Glass.ReaNum; ++i) {
      if ((k = ReaId2SmellId(Glass.ReaID[i])) !== SMELL_NONE) {
        if (SmellID === SMELL_NONE) SmellID = k;
        else SmellID = SMELL_UNKNOWN;
      }
    } /* End of for (i) */

    if (SmellID !== SMELL_NONE)
      Glass.SmellID = (Glass.SmellID === SMELL_NONE) ? SmellID : SMELL_UNKNOWN;

    if (DEBUG)
      console.log(LOG_PROMPT, 'Solution smell:', GetSmellByID(Glass.SmellID));

    /**** Reaction ****/

    AnaID = Glass.AnaID;

//    if (Glass.Stirred) {
      if ((AnaID) && (Glass.AnaAdspect === ADSPECT_LIQUID)) {
        if (Glass.ReaNum) {

          /**** Analyte + reagents ****/

          for(i = 0; i < 3; ++i) {
            IonID = GetIonID(AnaID, i);
            if (!IonID) continue;

            switch(Glass.ReaNum) {
            case 1:
              Stmt = ReactionQueryA1R(Glass, IonID, Ambient);
              break;

            case 2:
              Stmt = ReactionQueryA2R(Glass, IonID, Ambient);
              break;

            case 3:

              /**** Check if there is the buffer and its power ****/

              var BufID = -1;
              for(k = 0; (k < Glass.ReaNum); ++k) {
                if (Glass.ReaID[k] === REA_ID_BUFFER_PH5) {
                  BufID = k;
                  if (Ambient !== REA_TYPE_ACIDWEAK) break;
                } else if (Glass.ReaID[k] === REA_ID_BUFFER_PH9) {
                  BufID = k;
                  if (Ambient !== REA_TYPE_BASEWEAK) break;
                }
              } /* End of for (k) */

              Stmt = null;


              if (BufID === -1) {

                /**** Check if some reagents neutralizes each other (Check MgSO4) ****/

                var Num = 0;
                var Sum = 0;
                for(k = 0; k < Glass.ReaNum; ++k) {
                  ReaType = GetReaTypeByID(Glass.ReaID[k]);
                  if (ReaType <= REA_TYPE_BASEWEAK) {
                    Num += Glass.ReaQty[k];
                    Sum += Glass.ReaQty[k] * AmbientValMtx[ReaType];
                  }
                } /* End of for (k) */
                if (Num) {
                  Sum /= Num;

                  if (Sum) {
                    for(k = 0; k < Glass.ReaNum; ++k) {
                      ReaType = GetReaTypeByID(Glass.ReaID[k]);
                      if (Sum > 0) {
                        if ((ReaType === REA_TYPE_BASESTRONG) || (ReaType === REA_TYPE_BASEWEAK))
                          break;
                      } else {
                        if ((ReaType === REA_TYPE_ACIDSTRONG) || (ReaType === REA_TYPE_ACIDSTRONGCO))
                          break;
                      }
                    } /* End of for (k) */

                    if (k < Glass.ReaNum)
                      Stmt = ReactionQueryA3R1E(Glass, IonID, Ambient, k);
                  } else {

                    /**** Exclude all acid/basic reagents ****/

                    var KeepVect = [];
                    for(k = 0; k < Glass.ReaNum; ++k) {
                      ReaType = GetReaTypeByID(Glass.ReaID[k]);
                      if (ReaType > REA_TYPE_BASEWEAK)
                        KeepVect.push(Glass.ReaID[k]);
                    } /* End of for (k) */

                    switch(KeepVect.length) {
                    case 1:
                      Stmt = ReactionQueryA1R(Glass, IonID, Ambient, KeepVect[0])
                      break;

                    case 2:
                      Stmt = ReactionQueryA2R(Glass, IonID, Ambient, KeepVect[0], KeepVect[1])
                      break;
                    } /* End of switch */
                  }
                }
              } else {

                /**** Exclude the acid/basic reagent ****/

                if (k === Glass.ReaNum) {
                   for(k = 0; k < Glass.ReaNum; ++k) {
                     ReaType = GetReaTypeByID(Glass.ReaID[k]);
                     if ((ReaType > REA_TYPE_UNKNOWN) && (ReaType <= REA_TYPE_BASEWEAK))
                       break;
                   } /* End of for (k) */
                }

                /**** Otherwise exclude the buffer ****/

                if (k < Glass.ReaNum)
                  Stmt = ReactionQueryA3R1E(Glass, IonID, Ambient, k);
              }

              if (!Stmt)
                Stmt = ReactionQueryA3R(Glass, IonID);
              break;
            } /* End of switch */

            if (Stmt.step()) {
              var Id = Stmt.getAsObject().ProductID1;
              if (Id) ProductID[0] = Id;
              Id = Stmt.getAsObject().ProductID2;
              if ((Id) && (!ProductID[1])) ProductID[1] = Id;
              Id = Stmt.getAsObject().SolutionColorID;
              if (Id) SolutionColor = (!SolutionColor) ? ColorByID(Id) : ColorBlend(SolutionColor, ColorByID(Id));
              Id = Stmt.getAsObject().ColorID1;
              if (Id) Colors[0] = (!Colors[0]) ? ColorByID(Id) : ColorBlend(Colors[0], ColorByID(Id));
              Id = Stmt.getAsObject().ColorID2;
              if (Id) Colors[1] = (!Colors[1]) ? ColorByID(Id) : ColorBlend(Colors[1], ColorByID(Id));
              Id = Stmt.getAsObject().EventID1;
              if (((Id) && (!EventID[0])) || (EventID[0] === EVENT_CLEAR_SOL)) EventID[0] = Id;
              Id = Stmt.getAsObject().EventID2;
              if (((Id) && (!EventID[1])) || (EventID[1] === EVENT_CLEAR_SOL)) EventID[1] = Id;
              Id = Stmt.getAsObject().SmellID;
              if ((Id) && (Id !== SMELL_NONE)) Glass.SmellID = Id;
              Id = Stmt.getAsObject().GlasswareID1;
              if (Id) GlasswareID[i] = Id;

              if ((ProductID[0]) && (Glass.AnaID !== ProductID[0])) {

                /**** Check the FeSO4 concentration for the ring test ****/

                if (ProductID[0] === MOLID_FENOSO4) {
                  var FeIndex = Glass.ReaID.indexOf(REA_ID_FESO4);
                  if ((Glass.ReaQty[FeIndex] / Glass.LiqLvl) >= REA_RINGTEST_FECONC)
                    Glass.AnaID = ProductID[0];
                  else if (DEBUG)
                    console.log(LOG_PROMPT, 'WARNING: FeSO4 not enough concentrated');
                } else {

                  /**** Here is a possible problem ****/

                  if (ProductID[0] !== MOLID_CO2)
                    Glass.AnaID = ProductID[0];
                }
                Glass.AnaAdspect = ADSPECT_LIQUID;
              }

              if (DEBUG) {
                console.log(LOG_PROMPT, 'Reaction ID', Stmt.getAsObject().TestID, 'between analyte and reagents\n',
                            GetIonFormulaByID(IonID), '+',
                            GetReaLabelByID(Glass.ReaID[0]), '+', GetReaLabelByID(Glass.ReaID[1]), '+', GetReaLabelByID(Glass.ReaID[2]), '->',
                            GetMolFormulaByID(ProductID[0]), '+', GetMolFormulaByID(ProductID[1]),
                            '\nEvents:', GetEventByID(EventID[0]), ',', GetEventByID(EventID[1]),
                            '\nSmell:', GetSmellByID(Glass.SmellID));
              }
            }
            Stmt.free();
          } /* End of for (i) */
        }
      }

      /**** Reaction beween reagents ****/

      if ((Glass.ReaNum) && (Glass.AnaID === AnaID)) {
        i = 0;
        do {
          k = i + 1;
          do {
            if (Glass.ReaNum === 1) {
              if ((Glass.PaperID === REA_ID_UNIVIND) &&
                  (Glass.Type === GLASS_TYPE_TESTTUBE) && (Glass.PaperWater))
                Stmt = ReactionQuery2R(Glass);
              else Stmt = null;
            } else Stmt = ReactionQuery2R(Glass, Glass.ReaID[i], Glass.ReaID[k]);

            if (Stmt) {
              if (Stmt.step()) {
                ProductID[0] = Stmt.getAsObject().ProductID1;
                if (ProductID[0]) {
                  SolutionColor  = ColorByID(Stmt.getAsObject().SolutionColorID);
                  Colors[0]      = ColorByID(Stmt.getAsObject().ColorID1);
                  Colors[1]      = ColorByID(Stmt.getAsObject().ColorID2);
                  EventID[0]     = Stmt.getAsObject().EventID1;
                  EventID[1]     = Stmt.getAsObject().EventID2;
                  ProductID[1]   = Stmt.getAsObject().ProductID2;
                  SmellID        = Stmt.getAsObject().SmellID;
                  GlasswareID[0] = Stmt.getAsObject().GlasswareID1;

                  if ((SmellID) && (SmellID !== SMELL_NONE)) Glass.SmellID = SmellID;

                  if ((ProductID[0]) && (Glass.AnaID !== ProductID[0])) {

                    /**** Check the FeSO4 concentration for the ring test ****/

                    if (ProductID[0] === MOLID_FENOSO4) {
                      var FeIndex = Glass.ReaID.indexOf(REA_ID_FESO4);
                      if ((Glass.ReaQty[FeIndex] / Glass.LiqLvl) >= REA_RINGTEST_FECONC)
                        Glass.AnaID = ProductID[0];
                      else if (DEBUG)
                        console.log(LOG_PROMPT, 'WARNING: FeSO4 not enough concentrated');
                    } else Glass.AnaID = ProductID[0];
                    Glass.AnaAdspect = ADSPECT_LIQUID;
                  }

                  if (DEBUG) {
                    console.log(LOG_PROMPT, 'Reaction ID', Stmt.getAsObject().TestID, 'between 2 reagents\n',
                                GetReaLabelByID(Glass.ReaID[0]), '+', GetReaLabelByID(Glass.ReaID[1]), '->',
                                GetMolFormulaByID(ProductID[0]), '+', GetMolFormulaByID(ProductID[1]),
                                '\nEvents:', GetEventByID(EventID[0]), ',', GetEventByID(EventID[1]),
                                '\nSmell:', GetSmellByID(Glass.SmellID));
                  }
                }
              }
              Stmt.free();
              }
            ++k;
          } while(k < Glass.ReaNum);
          ++i;
        } while(i < (Glass.ReaNum - 1));
      }
//    }
  } else {

    /**** Reaction without water ****/

//    if (Glass.Stirred) {
      if (Glass.AnaID) {
        var AnaID = Glass.AnaID;
        if (Glass.ReaNum) {

          /**** Analyte + reagents ****/

          AnaID = Glass.AnaID;
          for(i = 0; i < 3; ++i) {
            IonID = GetIonID(AnaID, i);
            if (!IonID) continue;

            switch(Glass.ReaNum) {
            case 1:
              Stmt = ReactionQueryA1R(Glass, IonID);
              break;

            case 2:
              Stmt = ReactionQueryA2R(Glass, IonID);
              break;

            case 3:
              Stmt = ReactionQueryA3R(Glass, IonID);
              break;
            } /* End of switch */

            if (Stmt.step()) {
              var Id = Stmt.getAsObject().ProductID1;
              if ((Id) && (!ProductID[0])) ProductID[0] = Id;
              Id = Stmt.getAsObject().ProductID2;
              if ((Id) && (!ProductID[1])) ProductID[1] = Id;
              Id = Stmt.getAsObject().SolutionColorID;
              if (Id) SolutionColor = (!SolutionColor) ? ColorByID(Id) : ColorBlend(SolutionColor, ColorByID(Id));
              ColorID[0] = Stmt.getAsObject().ColorID1;
              if (Id) Colors[0] = (!Colors[0]) ? ColorByID(ColorID[0]) : ColorBlend(Colors[0], ColorByID(ColorID[0]));
              ColorID[1] = Stmt.getAsObject().ColorID2;
              if (Id) Colors[1] = (!Colors[1]) ? ColorByID(ColorID[1]) : ColorBlend(Colors[1], ColorByID(ColorID[1]));
              Id = Stmt.getAsObject().EventID1;
              if (((Id) && (!EventID[0])) || (EventID[0] === EVENT_CLEAR_SOL)) EventID[0] = Id;
              Id = Stmt.getAsObject().EventID2;
              if (((Id) && (!EventID[1])) || (EventID[1] === EVENT_CLEAR_SOL)) EventID[1] = Id;
              Id = Stmt.getAsObject().SmellID;
              if ((Id) && (Id !== SMELL_NONE)) Glass.SmellID = Id;
              Id = Stmt.getAsObject().GlasswareID1;
              if (Id) GlasswareID[i] = Id;

              if ((ProductID[0]) && (Glass.AnaID !== ProductID[0])) {
                Glass.AnaID      = ProductID[0];
                Glass.AnaAdspect = ADSPECT_SOLID;
              }

              if (DEBUG) {
                console.log(LOG_PROMPT, 'Reaction ID', Stmt.getAsObject().TestID, 'between analyte and reagents without water\n',
                            GetIonFormulaByID(IonID), '+',
                            GetReaLabelByID(Glass.ReaID[0]), '+', GetReaLabelByID(Glass.ReaID[1]), '+', GetReaLabelByID(Glass.ReaID[2]), '->',
                            GetMolFormulaByID(ProductID[0]), '+', GetMolFormulaByID(ProductID[1]),
                            '\nEvents:', GetEventByID(EventID[0]), ',', GetEventByID(EventID[1]),
                            '\nSmell:', GetSmellByID(Glass.SmellID));
              }
            }
            Stmt.free();
          } /* End of for (i) */
        }
      } else if (Glass.ReaNum === 2) {
        Stmt = ReactionQuery2R(Glass);

        if (Stmt.step()) {
          ProductID[0] = Stmt.getAsObject().ProductID1;
          if (ProductID[0]) {
            SolutionColor  = ColorByID(Stmt.getAsObject().SolutionColorID);
            ColorID[0]     = Stmt.getAsObject().ColorID1;
            ColorID[1]     = Stmt.getAsObject().ColorID2;
            Colors[0]      = ColorByID(ColorID[0]);
            Colors[1]      = ColorByID(ColorID[1]);
            EventID[0]     = Stmt.getAsObject().EventID1;
            EventID[1]     = Stmt.getAsObject().EventID2;
            ProductID[1]   = Stmt.getAsObject().ProductID2;
            SmellID        = Stmt.getAsObject().SmellID;
            GlasswareID[i] = Stmt.getAsObject().GlasswareID1;

            if ((SmellID) && (SmellID !== SMELL_NONE)) Glass.SmellID = SmellID;

            if ((ProductID[0]) && (Glass.AnaID != ProductID[0])) {
              Glass.AnaID      = ProductID[0];
              Glass.AnaAdspect = ADSPECT_SOLID;
            }

            if (DEBUG) {
              console.log(LOG_PROMPT, 'Reaction ID', Stmt.getAsObject().TestID, 'between 2 reagents whitout water\n',
                          GetReaLabelByID(Glass.ReaID[0]), '+', GetReaLabelByID(Glass.ReaID[1]), '->',
                          GetMolFormulaByID(ProductID[0]), '+', GetMolFormulaByID(ProductID[1]),
                          '\nEvents:', GetEventByID(EventID[0]), ',', GetEventByID(EventID[1]),
                          '\nSmell:', GetSmellByID(Glass.SmellID));
            }
          }
        }
        Stmt.free();
      }

      /**** Incomplete reaction ****/

      if(ProductID[1] === AnaID) {
        Glass.AnaQty /= 2;
        ReaAdd(Glass, REA_ID_DUMMYINSOL, Glass.AnaQty, ADSPECT_SOLID);
      }

//        }
  }

  /**** Fix for acetate test ****/

  if ((Glass.Water) && (Glass.Type !== GLASS_TYPE_WATCHGLASS) &&
      ((GlasswareID[0] === GLASS_ID_WATCHGLASS) || (GlasswareID[1] === GLASS_ID_WATCHGLASS) ||
       (GlasswareID[2] === GLASS_ID_WATCHGLASS))) {
    EventID[0] = EVENT_NONE;
  }

  /**** Update the content ****/

  var ColorEfferv, ColorFlame, ColorPaper, ColorPlate, Obj;

  var ShowEfferv = false;
  var ShowFlame  = false;
  var ShowLiquid = false;
  var ShowSolid  = false;
  var ShowPaper  = (Glass.PaperID !== 0);
  var ShowPlate  = false;

  /**** Solution color ****/

  if ((SolutionColor) && (SolutionColor != COLOR_WHITE) &&
      ((!Glass.LiqColor) || (Glass.LiqColor === COLOR_RED) ||
       (Glass.LiqColor === "#FFAAAA") || // Red blended with white
       (Glass.LiqColor === COLOR_WHITE)))
    Glass.LiqColor = SolutionColor;

  /**** Organic phase color ****/

  if (Glass.AnaID) {
    if (Glass.AnaAdspect === ADSPECT_LIQUID) ShowLiquid = true;
    else ShowSolid = true;
  }

  for(var i = 0; i < Glass.ReaNum; ++i) {
    switch(Glass.ReaAdspect[i]) {
    case ADSPECT_LIQUID:
//      Colors[0]      =  ColorTone(Colors[0], -20);
//      Glass.LiqColor = (Glass.LiqColor) ? ColorBlend(Glass.LiqColor, Colors[0], 0.5) : Colors[0];
      ShowLiquid     = true;
      break;

    case ADSPECT_PAPER:
      ShowPaper = true;
      break;

    case ADSPECT_PLATE:
      ColorPlate = ColorByID(COLOR_ID_METALLICRED);
      ShowPlate  = true;
      break;

    case ADSPECT_POWDER:
    case ADSPECT_SOLID:
      ShowSolid = true;
      break;
    } /* End of switch */
  } /* End of for (i) */


  /**** Analyze the events ****/

  Glass.LiqOpac = Glass.LiqDefOpac;

  for(var Evt = 0; Evt < 2; ++Evt) {
    switch(EventID[Evt]) {
    case EVENT_BIPHASIC:
      Glass.OrgColor = Colors[Evt];
      break;

    case EVENT_EFFERV:
    case EVENT_EFFERVSLIGHT:
      ColorEfferv = Colors[Evt];
      ShowEfferv  = true;
      break;

    case EVENT_FLAME:
      ColorFlame = ColorFlameByID(ColorID[Evt]);
      ShowFlame  = true;
      break;

    case EVENT_INDICATORCOL:
      ColorPaper = Colors[Evt];
      break;

    case EVENT_PLATECOL:
      ColorPlate = Colors[Evt];
      break;

    case EVENT_PRECIPITATE:
//      Glass.LiqColor   = Colors[Evt];
      LiqAdspect       = ADSPECT_LIQUID_SUSP;
      Glass.SolidColor = Colors[Evt];
      ShowLiquid       = true;

      if (!Evt) {
        Glass.AnaAdspect = ADSPECT_SOLID;
        ShowSolid        = true;
      }
      break;

    case EVENT_SUSPENSION:
      Glass.LiqColor = Colors[Evt];
      Glass.LiqOpac  = SUSP_OPACITY;
      ShowSolid      = false;
      break;
    } /* End of switch */
  } /* End of for (Evt) */


  if (ShowSolid)
    Glass.LiqAdspect = LiqAdspect;
  else
    Glass.LiqAdspect = ADSPECT_LIQUID_NONE;

  Obj = Glass.Handle.querySelector('#Solid');
  if (Obj) {
    Obj.setAttribute('visible', ShowSolid);
    if (ShowSolid)
      ColorSet(Obj, Glass.SolidColor);
  }

  /**** Paper ****/

  Obj = Glass.Handle.querySelector('#Solid-Paper');
  if (Obj) {
    if (ShowPaper) {
      if (Glass.Type === GLASS_TYPE_TESTTUBE) {
        switch(Glass.PaperID) {
        case REA_ID_PAPER:
          if ((Glass.AnaID === MOLID_SO2) && (Glass.PaperReaID === REA_ID_K2CR2O7))
            ColorPaperSet(Glass, '#D0FFCB');
          break;

        case REA_ID_UNIVIND:
          if ((Glass.AnaID === MOLID_NH4OH) && (Glass.PaperWater) && (ColorPaper))
            ColorPaperSet(Glass, ColorFromPh(9));
          break;
        } /* End of switch */
      } else if ((Glass.PaperID === REA_ID_UNIVIND) &&
                 ((Glass.PaperWater) || (Glass.Water))) {
        ColorPaperSet(Glass, ColorFromPh(GetMixPh(Glass)));
      }
    }
    Obj.setAttribute('visible', ShowPaper);
  }

  /**** Copper plate ****/

  Obj = Glass.Handle.querySelector('#Solid-Copper');
  if (Obj) {
    if (ShowPlate)
      ColorSet(Obj, ColorPlate);
    Obj.setAttribute('visible', ShowPlate);
  }

  LiquidUpdate(Glass);

  /**** Show the effervescence ****/

  if (ShowEfferv) {
    Obj = Glass.Handle.querySelector('#Particle');
    if (Obj) {
      if (ColorEfferv === COLOR_WHITE) {
        Obj.setAttribute('particle-system', 'color: white');
      } else {
        Obj.setAttribute('particle-system', 'color: ' + ColorEfferv);
      }
      Obj.setAttribute('particle-system', 'enabled: true');
      DisableShadowAll();
      setTimeout(function() {
        Obj.setAttribute('particle-system', 'enabled: false');
        DisableShadowAll();
      }, EFFERV_DURATION);
    }
    Glass.Stirred = true;
  }

  /**** Flame ****/

  if (ShowFlame) {
    Obj = Glass.Handle.querySelector('#Flame');
    if (Obj) {
      if (ColorFlame !== COLOR_WHITE)
        Obj.setAttribute('particle-system', 'color: ' + ColorFlame);

      if (!Glass.Burning) {
        Obj.setAttribute('particle-system', 'enabled: true');
        Glass.Burning = true;
      }
      DisableShadowAll();
    }
  }


  /**** Summarize the showing events ****/

  if (DEBUG) {
    console.log(LOG_PROMPT, 'Show:',
                '\nEffervescence:', ShowEfferv,
                '\nLiquid:', ShowLiquid,
                '\nSolid:' , ShowSolid,
                '\nPaper:' , ShowPaper,
                '\nPlate:' , ShowPlate,
                '\nColor1:', Colors[0],
                '\nColor2:', Colors[1]);
  }
}


/**** SQL query analyte + 1 reagent ****/

function ReactionQueryA1R(Glass, IonID, Ambient, ReaID)
{
  if (!ReaID) ReaID = Glass.ReaID[0];

  if (Glass.Water) {
    if ((Glass.PaperID === REA_ID_UNIVIND) && (Glass.Type === GLASS_TYPE_TESTTUBE) && (Glass.PaperWater)) {
      return hDb.prepare('SELECT TestID, ProductID1, ProductID2, SolutionColorID, EventID1, ColorID1, EventID2, ColorID2, SmellID, GlasswareID1 FROM Tests ' +
                         'WHERE (IonID = ' + IonID + ' AND Water AND ReagentID1 = ' + ReaID +
                         ' AND ReagentID2 = ' + REA_ID_UNIVIND + ' AND ReagentID3 IS NULL AND HeatTime <= ' + Glass.HeatTime + ');');
    }

    return hDb.prepare('SELECT TestID, ProductID1, ProductID2, SolutionColorID, EventID1, ColorID1, EventID2, ColorID2, SmellID, GlasswareID1 FROM Tests ' +
                       'WHERE (IonID = ' + IonID + ' AND (AmbientID IS NULL OR AmbientID = ' + Ambient + ') AND Water AND ReagentID1 = ' + ReaID +
                       ' AND ReagentID2 IS NULL AND ReagentID3 IS NULL AND HeatTime <= ' + Glass.HeatTime + ');');
  }


  return hDb.prepare('SELECT TestID, ProductID1, ProductID2, SolutionColorID, EventID1, ColorID1, EventID2, ColorID2, SmellID, GlasswareID1 FROM Tests ' +
                     'WHERE (IonID = ' + IonID + ' AND NOT Water AND ' + (Glass.Burning ? '' : 'NOT ') +
                     'Fire AND ReagentID1 = ' + ReaID +
                     ' AND ReagentID2 IS NULL AND ReagentID3 IS NULL AND HeatTime <= ' + Glass.HeatTime + ');');
}


/**** SQL query analyte + 2 reagents ****/

function ReactionQueryA2R(Glass, IonID, Ambient, ReaID0, ReaID1)
{
  if (!ReaID0) {
    ReaID0 = Glass.ReaID[0];
    ReaID1 = Glass.ReaID[1];
  }

  if (Glass.Water) {
    return hDb.prepare('SELECT TestID, ProductID1, ProductID2, SolutionColorID, EventID1, ColorID1, EventID2, ColorID2, SmellID, GlasswareID1 FROM Tests ' +
                       'WHERE (IonID = ' + IonID + ' AND (AmbientID IS NULL OR AmbientID = ' + Ambient + ') AND Water AND ((ReagentID1 = ' + ReaID0 +
                       ' AND ReagentID2 = ' + ReaID1 + ') OR (ReagentID1 = ' + ReaID1 +
                       ' AND ReagentID2 = ' + ReaID0 + ')) AND ReagentID3 IS NULL AND HeatTime <= ' + Glass.HeatTime + ');');
  }

  return hDb.prepare('SELECT TestID, ProductID1, ProductID2, SolutionColorID, EventID1, ColorID1, EventID2, ColorID2, SmellID, GlasswareID1 FROM Tests ' +
                     'WHERE (IonID = ' + IonID + ' AND NOT Water AND ' + (Glass.Burning ? '' : 'NOT ') +
                     'Fire AND ((ReagentID1 = ' + ReaID0 +
                     ' AND ReagentID2 = ' + ReaID1 + ') OR (ReagentID1 = ' + ReaID1 +
                     ' AND ReagentID2 = ' + ReaID0 + ')) AND ReagentID3 IS NULL AND HeatTime <= ' + Glass.HeatTime + ');');
}


/**** SQL query analyte + 3 reagents ****/

function ReactionQueryA3R(Glass, IonID, ReaID0, ReaID1, ReaID2)
{
  if (!ReaID0) {
    ReaID0 = Glass.ReaID[0];
    ReaID1 = Glass.ReaID[1];
    ReaID2 = Glass.ReaID[2];
  }

  if (Glass.Water) {
    return hDb.prepare('SELECT TestID, ProductID1, ProductID2, SolutionColorID, EventID1, ColorID1, EventID2, ColorID2, SmellID, GlasswareID1 FROM Tests ' +
                       'WHERE (IonID = ' + IonID + ' AND Water AND (' +
                       '(ReagentID1 = ' + ReaID0 + ' AND ReagentID2 = ' + ReaID1 + ' AND ReagentID3 = ' + ReaID2 + ') OR ' +
                       '(ReagentID1 = ' + ReaID0 + ' AND ReagentID2 = ' + ReaID2 + ' AND ReagentID3 = ' + ReaID1 + ') OR ' +
                       '(ReagentID1 = ' + ReaID1 + ' AND ReagentID2 = ' + ReaID2 + ' AND ReagentID3 = ' + ReaID0 + ') OR ' +
                       '(ReagentID1 = ' + ReaID1 + ' AND ReagentID2 = ' + ReaID0 + ' AND ReagentID3 = ' + ReaID2 + ') OR ' +
                       '(ReagentID1 = ' + ReaID2 + ' AND ReagentID2 = ' + ReaID0 + ' AND ReagentID3 = ' + ReaID1 + ') OR ' +
                       '(ReagentID1 = ' + ReaID2 + ' AND ReagentID2 = ' + ReaID1 + ' AND ReagentID3 = ' + ReaID0 + ')) AND ' +
                       'HeatTime <= ' + Glass.HeatTime + ');');
  }

  return hDb.prepare('SELECT TestID, ProductID1, ProductID2, SolutionColorID, EventID1, ColorID1, EventID2, ColorID2, SmellID, GlasswareID1 FROM Tests ' +
                     'WHERE (IonID = ' + IonID + ' AND NOT Water AND ' + (Glass.Burning ? '' : 'NOT ') + 'Fire AND (' +
                     '(ReagentID1 = ' + ReaID0 + ' AND ReagentID2 = ' + ReaID1 + ' AND ReagentID3 = ' + ReaID2 + ') OR ' +
                     '(ReagentID1 = ' + ReaID0 + ' AND ReagentID2 = ' + ReaID2 + ' AND ReagentID3 = ' + ReaID1 + ') OR ' +
                     '(ReagentID1 = ' + ReaID1 + ' AND ReagentID2 = ' + ReaID2 + ' AND ReagentID3 = ' + ReaID0 + ') OR ' +
                     '(ReagentID1 = ' + ReaID1 + ' AND ReagentID2 = ' + ReaID0 + ' AND ReagentID3 = ' + ReaID2 + ') OR ' +
                     '(ReagentID1 = ' + ReaID2 + ' AND ReagentID2 = ' + ReaID0 + ' AND ReagentID3 = ' + ReaID1 + ') OR ' +
                     '(ReagentID1 = ' + ReaID2 + ' AND ReagentID2 = ' + ReaID1 + ' AND ReagentID3 = ' + ReaID0 + ')) AND ' +
                     'HeatTime <= ' + Glass.HeatTime + ');');
}


/**** SQL query analyte + 3 - 1 reagents ****/

function ReactionQueryA3R1E(Glass, IonID, Ambient, ReaEx)
{
/*
  const r = [1, 2, 0, 2, 0, 1];

  ReaEx *= 2;
  return hDb.prepare('SELECT TestID, ProductID1, ProductID2, SolutionColorID, EventID1, ColorID1, EventID2, ColorID2, SmellID, GlasswareID1 FROM Tests ' +
                     'WHERE (IonID = ' + IonID + ' AND Water AND ((ReagentID1 = ' + Glass.ReaID[r[ReaEx]] +
                     ' AND ReagentID2 = ' + Glass.ReaID[r[ReaEx + 1]] + ') OR (ReagentID1 = ' + Glass.ReaID[r[ReaEx + 1]] +
                     ' AND ReagentID2 = ' + Glass.ReaID[r[ReaEx]] + ')) AND ReagentID3 IS NULL AND HeatTime <= ' + Glass.HeatTime + ');');
*/

  var KeepVect = [];
  for(k = 0; k < Glass.ReaNum; ++k)
    if (k !== ReaEx) KeepVect.push(Glass.ReaID[k]);

  return ReactionQueryA2R(Glass, IonID, Ambient, KeepVect[0], KeepVect[1])
}


/**** SQL query reagents ****/

function ReactionQuery2R(Glass, ReaID0, ReaID1)
{
  if (!ReaID0) {
    ReaID0 = Glass.ReaID[0];
    ReaID1 = Glass.ReaID[1];
  }

  if (Glass.Water) {
    if (Glass.ReaNum === 1) {

      /**** One reagent + Universal indicator ****/

      return hDb.prepare('SELECT TestID, ProductID1, ProductID2, SolutionColorID, EventID1, ColorID1, EventID2, ColorID2, SmellID, GlasswareID1 FROM Tests ' +
                         'WHERE (IonID IS NULL AND Water AND ReagentID1 = ' + ReaID0 + ' AND ReagentID2 = ' + REA_ID_UNIVIND + ' AND ' +
                         'HeatTime <= ' + Glass.HeatTime + ');');
    }

    return hDb.prepare('SELECT TestID, ProductID1, ProductID2, SolutionColorID, EventID1, ColorID1, EventID2, ColorID2, SmellID, GlasswareID1 FROM Tests ' +
                       'WHERE ((IonID IS NULL AND Water AND ReagentID1 = ' + ReaID0 + ' AND ReagentID2 = ' + ReaID1 + ') OR ' +
                       '(IonID IS NULL AND ReagentID1 = ' + ReaID1 + ' AND ReagentID2 = ' + ReaID0 + ') AND ' +
                       'HeatTime <= ' + Glass.HeatTime + ');');
  }

  return hDb.prepare('SELECT TestID, ProductID1, ProductID2, SolutionColorID, EventID1, ColorID1, EventID2, ColorID2, SmellID, GlasswareID1 FROM Tests ' +
                     'WHERE ((IonID IS NULL AND NOT Water AND ' + (Glass.Burning ? '' : 'NOT ') +
                     'Fire AND ReagentID1 = ' + ReaID0 + ' AND ReagentID2 = ' + ReaID1 + ') OR ' +
                     '(IonID IS NULL AND ReagentID1 = ' + ReaID1 + ' AND ReagentID2 = ' + ReaID0 + ') AND ' +
                     'HeatTime <= ' + Glass.HeatTime + ');');
}