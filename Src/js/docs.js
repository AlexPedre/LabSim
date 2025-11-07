
/*******************************************
****         LabSim - Documents         ****
**** (c) 2020-2025, Alessandro Pedretti ****
*******************************************/

/**** Global variables ****/

var hBT_Menu;
var hMenu;


/**** Menu button click ****/

function BT_MenuClick() {
  Menu.style.visibility     = "visible";
  Menu.style.opacity        = 1;
  hBT_Menu.style.visibility = "hidden";
  hBT_Menu.style.opacity    = 0;
}


/**** Top button click ****/

function BT_TopClick() {
  document.body.scrollTop            = 0; // For Safari
  document.documentElement.scrollTop = 0; // For Chrome, Firefox, IE and Opera
}


/**** Menu item click ****/

function MenuClick(Anchor) {
  Menu.style.visibility     = "hidden";
  Menu.style.opacity        = 0;
  hBT_Menu.style.visibility = "visible";
  hBT_Menu.style.opacity    = 0.8;

  if (Anchor)
    location.hash = "#" + Anchor;
}


/**** Show event ****/

function ShowEvent()
{
  hBT_Menu = document.getElementById("BT_Menu");
  hBT_Top  = document.getElementById("BT_Top");
  hMenu    = document.getElementById("Menu");

  /**** Scroll to top button ****/

  window.onscroll = function() {
    if (document.body.scrollTop > 20 || document.documentElement.scrollTop > 20) {
      hBT_Top.style.visibility = "visible";
      hBT_Top.style.opacity    = 0.8;
    } else {
      hBT_Top.style.visibility = "hidden";
      hBT_Top.style.opacity    = 0;
    }
  };

  /**** Update the copyright ****/

  var Year = new Date().getFullYear();
  document.querySelector('#year1').textContent = Year;
  document.querySelector('#year2').textContent = Year;

  mybutton = document.getElementById("myBtn");
}