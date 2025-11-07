
/*******************************************
****     LabSim - Analysis Generator    ****
**** (c) 2020-2025, Alessandro Pedretti ****
*******************************************/


/**** Generate the code from analyte ID ****/

function CodeFromID(AnaID)
{
  var EncKey = Math.floor(Math.random() * 254 + 1);
  var Crc    = AnaID + EncKey;
  if (Crc > 255) Crc -= 255;

//  console.log("****", EncKey, AnaID, Crc);

  AnaID   = (AnaID ^ EncKey) ^ CODE_INTK;
  Crc     = (Crc   ^ EncKey) ^ CODE_INTK;
  EncKey ^= CODE_INTK;
  Code    = (Crc + (AnaID << 8) + (EncKey << 16)).toString(16).toUpperCase();

  while (Code.length < 6) {
    Code = "0" + Code;
  } /* End of while */

  return Code;
}


/**** Generate the codes for the analysis ****/

function CodeGen(Students, Sol, Insol)
{
  if ((!Students) || ((!Sol) && (!Insol)))
    return;

  /**** Csv file header ****/

  var i;
  var AnaNum  = Sol + Insol;
  var CsvFile = Msg.AnaCsvStudentID;

  for(i = 1; i <= AnaNum; ++i)
    CsvFile += ';' + Msg.AnaCsvAnalyteID + ' ' + i + ';' + Msg.AnaCsvAnalyte + ' ' + i + ';' + Msg.AnaCsvCode + ' ' + i;
  CsvFile += '\n';

  for(i = 1; i <= Students; ++i) {
    var AnaID, k, Stmt;
    var AnaVect = [];

    CsvFile += i;

    /**** Soluble ****/

    for(k = 1; k <= Sol; ++k) {
      for(;;) {
        Stmt = hDb.prepare('SELECT MoleculeID FROM Molecules WHERE (Analyte AND SolWater) ORDER BY RANDOM() LIMIT 1');
        if (Stmt.step()) {
          AnaID = Stmt.getAsObject().MoleculeID;
          if (AnaVect.indexOf(AnaID) === -1) {
            AnaVect.push(AnaID);
            Stmt.free();
            break;
          }
        }
        Stmt.free();
      } /* End of for */
    } /* End of for (k) */

    /**** Insoluble ****/

    for(k = 1; k <= Insol; ++k) {
      for(;;) {
        Stmt = hDb.prepare('SELECT MoleculeID FROM Molecules WHERE (Analyte AND NOT SolWater) ORDER BY RANDOM() LIMIT 1');
        if (Stmt.step()) {
          AnaID = Stmt.getAsObject().MoleculeID;
          if (AnaVect.indexOf(AnaID) === -1) {
            AnaVect.push(AnaID);
            Stmt.free();
            break;
          }
        }
        Stmt.free();
      } /* End of for */
    } /* End of for (k) */

    if ((Sol) && (Insol)) ShuffleArray(AnaVect);

    for(k of AnaVect)
      CsvFile += ';' + k + ';' + GetMolFormulaByID(k) + ';="' + CodeFromID(k) + '"';

    CsvFile += '\n';
  } /* End of for (i) */

  SaveAs(CsvFile, Msg.AnaFileName, "text/plain;charset=utf-8");
}


/**** Generate click ****/

function GenerateClick()
{
  var Insoluble = parseInt(document.querySelector('#str_insoluble').value);
  var Soluble   = parseInt(document.querySelector('#str_soluble'  ).value);
  var Students  = parseInt(document.querySelector('#str_students' ).value);

  if ((Insoluble + Soluble) < 1) {
    alert(Msg.AnaErrSubstNum);
    return;
  }

  CodeGen(Students, Soluble, Insoluble);
}


/**** Show event ****/

function ShowEvent()
{
  LoadBinaryFile('db/LabSim.sqlite?ver=' + LABSIM_VER, function(data) {
    initSqlJs({locateFile: () => 'dist/sql-wasm.wasm'}).then(function(SQL) {
      hDb = new SQL.Database(data);

      var Page  = document.querySelector('#page');

      Page.querySelector('#bt_generate'  ).value       = Msg.AnaBtGenerate;
      Page.querySelector('#lbl_insoluble').textContent = Msg.AnaLblInsoluble;
      Page.querySelector('#lbl_soluble'  ).textContent = Msg.AnaLblSoluble;
      Page.querySelector('#lbl_students' ).textContent = Msg.AnaLblStudents;
      Page.querySelector('#title'        ).textContent = Msg.AnaTitle;
      Page.querySelector('#year2'        ).textContent = new Date().getFullYear();

      /**** Show the page ****/

      document.getElementById("DivSplash").style.display = "none";
      document.getElementById("pagecont" ).style.display = "";
    });
  });
}
