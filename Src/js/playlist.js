
/*******************************************
****      LabSim - Video playlist       ****
**** (c) 2020-2025, Alessandro Pedretti ****
*******************************************/

var PlayListVideo;

/**** Italian ****/

if (Lang == 'it') {
  PlayListVideo = [

    /***************
    **** LabSim ****
    ***************/

    /**** Base techniques ****/

    'LS Solubilit&agrave;', 'it/labsim_solubility_720p.mp4',
    'LS Misura pH', 'it/labsim_ph_720p.mp4',
    'LS Uso della centrifuga', 'it/labsim_centrifuge_720p.mp4',

    /**** Anions ****/

    'LS Riconoscimento Cl<SUP>-</SUP>', 'it/labsim_anions_cl_720p.mp4',
    'LS Riconoscimento Br<SUP>-</SUP>', 'it/labsim_anions_br_720p.mp4',
    'LS Riconoscimento I<SUP>-</SUP>', 'it/labsim_anions_i_720p.mp4',
    'LS Riconoscimento IO<SUB>3</SUB><SUP>-</SUP>', 'it/labsim_anions_io3_720p.mp4',
    'LS Riconoscimento SO<SUB>3</SUB><SUP>2-</SUP>', 'it/labsim_anions_so3_720p.mp4',
    'LS Riconoscimento S<SUB>2</SUB>O<SUB>3</SUB><SUP>2-</SUP>', 'it/labsim_anions_s2o3_720p.mp4',
    'LS Riconoscimento S<SUB>2</SUB>O<SUB>5</SUB><SUP>2-</SUP>', 'it/labsim_anions_s2o5_720p.mp4',
    'LS Riconoscimento SO<SUB>4</SUB><SUP>2-</SUP>', 'it/labsim_anions_so4_720p.mp4',
    'LS Riconoscimento NO<SUB>2</SUB><SUP>-</SUP>', 'it/labsim_anions_no2_720p.mp4',
    'LS Riconoscimento NO<SUB>3</SUB><SUP>-</SUP>', 'it/labsim_anions_no3_720p.mp4',
    'LS Riconoscimento CO<SUB>3</SUB><SUP>2-</SUP> e HCO<SUB>3</SUB><SUP>-</SUP>', 'it/labsim_anions_co3_720p.mp4',
    'LS Riconoscimento PO<SUB>4</SUB><SUP>3-</SUP>', 'it/labsim_anions_po4_720p.mp4',
    'LS Riconoscimento CH<SUB>3</SUB>COO<SUP>-</SUP>', 'it/labsim_anions_aco_720p.mp4',
    'LS Riconoscimento F<SUP>-</SUP>', 'it/labsim_anions_f_720p.mp4',
    'LS Riconoscimento BO<SUB>3</SUB><SUP>3-</SUP>', 'it/labsim_anions_bo3_720p.mp4',

    /**** Cations ****/

    'LS Riconoscimento I gruppo (Ag<SUP>+</SUP>)', 'it/labsim_cations_ag_720p.mp4',
    'LS Riconoscimento II gruppo (Hg<SUP>2+</SUP>)', 'it/labsim_cations_hg_720p.mp4',
    'LS Riconoscimento III gruppo (Al<SUP>3+</SUP>)', 'it/labsim_cations_al_720p.mp4',
    'LS Riconoscimento IV gruppo (Zn<SUP>2+</SUP>)', 'it/labsim_cations_zn_720p.mp4',
    'LS Riconoscimento V gruppo (Ca<SUP>2+</SUP>)', 'it/labsim_cations_ca_720p.mp4',
    'LS Riconoscimento VI gruppo (NH<SUB>4</SUB><SUP>+</SUP>)', 'it/labsim_cations_nh4_720p.mp4',
    'LS Riconoscimento VI gruppo (Mg<SUP>2+</SUP>)', 'it/labsim_cations_mg_720p.mp4',
    'LS Riconoscimento VI gruppo (Li<SUP>+</SUP>)', 'it/labsim_cations_li_720p.mp4',
    'LS Riconoscimento VI gruppo (K<SUP>+</SUP>)', 'it/labsim_cations_k_720p.mp4',
    'LS Riconoscimento VI gruppo (Na<SUP>+</SUP>)', 'it/labsim_cations_na_720p.mp4',
    'LS Saggio alla fiamma', 'it/labsim_flame_720p.mp4',

    /**** Insolubles ****/

    'LS Riconoscimento (BiO)<SUB>2</SUB>CO<SUB>3</SUB>', 'it/labsim_insol_(bio)2co3.mp4',
    'LS Riconoscimento ZnO<SUB>2</SUB>', 'it/labsim_insol_zno2.mp4',
    'LS Riconoscimento Ca(OH)<SUB>2</SUB>', 'it/labsim_insol_ca(oh)2.mp4',
    'LS Riconoscimento Ca<SUB>3</SUB>(PO<SUB>4</SUB>)<SUB>2</SUB>', 'it/labsim_insol_ca3(po4)2.mp4',
    'LS Riconoscimento CaCO<SUB>3</SUB>', 'it/labsim_insol_caco3.mp4',
    'LS Riconoscimento CaSO<SUB>4</SUB>', 'it/labsim_insol_caso4.mp4',
    'LS Riconoscimento Mg(OH)<SUB>2</SUB>', 'it/labsim_insol_mg(oh)2.mp4',
    'LS Riconoscimento MgCO<SUB>3</SUB>', 'it/labsim_insol_mgco3.mp4',
    'LS Riconoscimento AlPO<SUB>4</SUB>', 'it/labsim_insol_alpo4.mp4',
    'LS Riconoscimento Al(OH)<SUB>3</SUB>', 'it/labsim_insol_al(oh)3.mp4',
    'LS Riconoscimento TiO<SUB>2</SUB>', 'it/labsim_insol_tio2_720p.mp4',
    'LS Riconoscimento BaSO<SUB>4</SUB>', 'it/labsim_insol_baso4.mp4',

    /**** Full analysis ****/

    'LS Analisi incognita 1', 'it/labsim_analinc_cacl2_720p.mp4',
    'LS Analisi incognita 2', 'it/labsim_analinc_agno3_720p.mp4',


    /************************
    **** Real laboratory ****
    ************************/


    /**** Anions ****/

    'Riconoscimento Cl<SUP>-</SUP>', 'it/test_cl_720p.mp4',
    'Riconoscimento Br<SUP>-</SUP>', 'it/test_br_720p.mp4',
    'Riconoscimento I<SUP>-</SUP>', 'it/test_i_720p.mp4',
    'Distinzione tra Br<SUP>-</SUP> e I<SUP>-</SUP> con NH<SUB>3</SUB>', 'it/test_br_i_nh3_720p.mp4',
    'Distinzione tra Br<SUP>-</SUP> e I<SUP>-</SUP> con NaClO', 'it/test_br_i_naclo_720p.mp4',
    'Riconoscimento IO<SUB>3</SUB><SUP>-</SUP> con AgNO<SUB>3</SUB>', 'it/test_io3_agno3_720p.mp4',
    'Riconoscimento IO<SUB>3</SUB><SUP>-</SUP> con KI', 'it/test_io3_ki_720p.mp4',
    'Riconoscimento SO<SUB>3</SUB><SUP>2-</SUP>, S<SUB>2</SUB>O<SUB>3</SUB><SUP>2-</SUP> e S<SUB>2</SUB>O<SUB>5</SUB><SUP>2-</SUP>', 'it/test_so3_s2o3_s2o5_720p.mp4',
    'Distinzione tra SO<SUB>3</SUB><SUP>2-</SUP>, S<SUB>2</SUB>O<SUB>3</SUB><SUP>2-</SUP>', 'it/test_so3_s2o3_720p.mp4',
    'Riconoscimento SO<SUB>4</SUB><SUP>2-</SUP> con BaCl<SUB>2</SUB>', 'it/test_so4_720p.mp4',
    'Riconoscimento NO<SUB>2</SUB><SUP>-</SUP> con KI', 'it/test_no2_720p.mp4',
    'Riconoscimento NO<SUB>3</SUB><SUP>-</SUP>', 'it/test_no3_720p.mp4',
    'Riconoscimento CO<SUB>3</SUB><SUP>2-</SUP> e HCO<SUB>3</SUB><SUP>-</SUP>', 'it/test_co3_720p.mp4',
    'Riconoscimento PO<SUB>4</SUB><SUP>3-</SUP>', 'it/test_po4_720p.mp4',
    'Riconoscimento CH<SUB>3</SUB>COO<SUP>-</SUP>', 'it/test_aco_720p.mp4',
    'Riconoscimento F<SUP>-</SUP>', 'it/test_f_720p.mp4',
    'Riconoscimento BO<SUB>3</SUB><SUP>3-</SUP>', 'it/test_bo3_720p.mp4',

    /**** Cations ****/

    'Riconoscimento I gruppo (Ag<SUP>+</SUP>)', 'it/test_ag_720p.mp4',
    'Riconoscimento II gruppo (Hg<SUP>2+</SUP>)', 'it/test_hg_720p.mp4',
    'Riconoscimento III gruppo (Al<SUP>3+</SUP>)', 'it/test_al_720p.mp4',
    'Riconoscimento IV gruppo (Zn<SUP>2+</SUP>)', 'it/test_zn_720p.mp4',
    'Riconoscimento V gruppo (Ca<SUP>2+</SUP>)', 'it/test_ca_720p.mp4',
    'Riconoscimento VI gruppo (NH<SUB>4</SUB><SUP>+</SUP>)', 'it/test_nh4_720p.mp4',
    'Riconoscimento VI gruppo (Mg<SUP>2+</SUP>)', 'it/test_mg_720p.mp4',
    'Saggio alla fiamma', 'it/test_flame_720p.mp4',

    /**** Insolubles ****/

    'Riconoscimento Al(OH)<SUB>3</SUB> e TiO<SUB>2</SUB>', 'it/test_al(oh)3_tio2_720p.mp4',
    'Riconoscimento BaSO<SUB>4</SUB>', 'it/test_baso4_720p.mp4'
  ];
} else {

  /**** English ****/

  PlayListVideo = [

    /***************
    **** LabSim ****
    ***************/

    /**** Base techniques ****/

    'LS Solubility', 'it/labsim_solubility_720p.mp4',
    'LS pH measure', 'it/labsim_ph_720p.mp4',
    'LS Centrifugue use', 'it/labsim_centrifuge_720p.mp4',

    /**** Anions ****/

    'LS Cl<SUP>-</SUP> test', 'it/labsim_anions_cl_720p.mp4',
    'LS Br<SUP>-</SUP> test', 'it/labsim_anions_br_720p.mp4',
    'LS I<SUP>-</SUP> test', 'it/labsim_anions_i_720p.mp4',
    'LS IO<SUB>3</SUB><SUP>-</SUP> test', 'it/labsim_anions_io3_720p.mp4',
    'LS SO<SUB>3</SUB><SUP>2-</SUP> test', 'it/labsim_anions_so3_720p.mp4',
    'LS S<SUB>2</SUB>O<SUB>3</SUB><SUP>2-</SUP> test', 'it/labsim_anions_s2o3_720p.mp4',
    'LS S<SUB>2</SUB>O<SUB>5</SUB><SUP>2-</SUP> test', 'it/labsim_anions_s2o5_720p.mp4',
    'LS SO<SUB>4</SUB><SUP>2-</SUP> test', 'it/labsim_anions_so4_720p.mp4',
    'LS NO<SUB>2</SUB><SUP>-</SUP> test', 'it/labsim_anions_no2_720p.mp4',
    'LS NO<SUB>3</SUB><SUP>-</SUP> test', 'it/labsim_anions_no3_720p.mp4',
    'LS CO<SUB>3</SUB><SUP>2-</SUP> and HCO<SUB>3</SUB><SUP>-</SUP> test', 'it/labsim_anions_co3_720p.mp4',
    'LS PO<SUB>4</SUB><SUP>3-</SUP> test', 'it/labsim_anions_po4_720p.mp4',
    'LS CH<SUB>3</SUB>COO<SUP>-</SUP> test', 'it/labsim_anions_aco_720p.mp4',
    'LS F<SUP>-</SUP> test', 'it/labsim_anions_f_720p.mp4',
    'LS BO<SUB>3</SUB><SUP>3-</SUP> test', 'it/labsim_anions_bo3_720p.mp4',

    /**** Cations ****/

    'LS I group test (Ag<SUP>+</SUP>)', 'it/labsim_cations_ag_720p.mp4',
    'LS II group test (Hg<SUP>2+</SUP>)', 'it/labsim_cations_hg_720p.mp4',
    'LS III group test (Al<SUP>3+</SUP>)', 'it/labsim_cations_al_720p.mp4',
    'LS IV gruppo (Zn<SUP>2+</SUP>)', 'it/labsim_cations_zn_720p.mp4',
    'LS V group test (Ca<SUP>2+</SUP>)', 'it/labsim_cations_ca_720p.mp4',
    'LS VI group test (NH<SUB>4</SUB><SUP>+</SUP>)', 'it/labsim_cations_nh4_720p.mp4',
    'LS VI group test (Mg<SUP>2+</SUP>)', 'it/labsim_cations_mg_720p.mp4',
    'LS VI group test (Li<SUP>+</SUP>)', 'it/labsim_cations_li_720p.mp4',
    'LS VI group test (K<SUP>+</SUP>)', 'it/labsim_cations_k_720p.mp4',
    'LS VI group test (Na<SUP>+</SUP>)', 'it/labsim_cations_na_720p.mp4',
    'LS Flame test', 'it/labsim_flame_720p.mp4',

    /**** Insolubles ****/

    'LS (BiO)<SUB>2</SUB>CO<SUB>3</SUB> analysis', 'it/labsim_insol_(bio)2co3.mp4',
    'LS ZnO<SUB>2</SUB> analysis', 'it/labsim_insol_zno2.mp4',
    'LS Ca(OH)<SUB>2</SUB> analysis', 'it/labsim_insol_ca(oh)2.mp4',
    'LS Ca<SUB>3</SUB>(PO<SUB>4</SUB>)<SUB>2</SUB> analysis', 'it/labsim_insol_ca3(po4)2.mp4',
    'LS CaCO<SUB>3</SUB> analysis', 'it/labsim_insol_caco3.mp4',
    'LS CaSO<SUB>4</SUB> analysis', 'it/labsim_insol_caso4.mp4',
    'LS Mg(OH)<SUB>2</SUB> analysis', 'it/labsim_insol_mg(oh)2.mp4',
    'LS MgCO<SUB>3</SUB> analysis', 'it/labsim_insol_mgco3.mp4',
    'LS AlPO<SUB>4</SUB> analysis', 'it/labsim_insol_alpo4.mp4',
    'LS Al(OH)<SUB>3</SUB> analysis', 'it/labsim_insol_al(oh)3.mp4',
    'LS TiO<SUB>2</SUB> analysis', 'it/labsim_insol_tio2_720p.mp4',
    'LS BaSO<SUB>4</SUB> analysis', 'it/labsim_insol_baso4.mp4',

    /**** Full analysis ****/

    'LS Unknown substance #1', 'it/labsim_analinc_cacl2_720p.mp4',
    'LS Unknown substance #2', 'it/labsim_analinc_agno3_720p.mp4',


    /************************
    **** Real laboratory ****
    ************************/


    /**** Anions ****/

    'Cl<SUP>-</SUP> test', 'en/test_cl_720p.mp4',
    'Br<SUP>-</SUP> test', 'en/test_br_720p.mp4',
    'I<SUP>-</SUP> test', 'en/test_i_720p.mp4',
    'Br<SUP>-</SUP> and I<SUP>-</SUP> distinction with NH<SUB>3</SUB>', 'en/test_br_i_nh3_720p.mp4',
    'Br<SUP>-</SUP> and I<SUP>-</SUP> distinction with NaClO', 'en/test_br_i_naclo_720p.mp4',
    'IO<SUB>3</SUB><SUP>-</SUP> test with AgNO<SUB>3</SUB>', 'en/test_io3_agno3_720p.mp4',
    'IO<SUB>3</SUB><SUP>-</SUP> test with KI', 'en/test_io3_ki_720p.mp4',
    'SO<SUB>3</SUB><SUP>2-</SUP>, S<SUB>2</SUB>O<SUB>3</SUB><SUP>2-</SUP> and S<SUB>2</SUB>O<SUB>5</SUB><SUP>2-</SUP> test', 'en/test_so3_s2o3_s2o5_720p.mp4',
    'SO<SUB>3</SUB><SUP>2-</SUP>, S<SUB>2</SUB>O<SUB>3</SUB><SUP>2-</SUP> distinction', 'en/test_so3_s2o3_720p.mp4',
    'SO<SUB>4</SUB><SUP>2-</SUP> test with BaCl<SUB>2</SUB>', 'en/test_so4_720p.mp4',
    'NO<SUB>2</SUB><SUP>-</SUP> test with KI', 'en/test_no2_720p.mp4',
    'NO<SUB>3</SUB><SUP>-</SUP> test', 'en/test_no3_720p.mp4',
    'CO<SUB>3</SUB><SUP>2-</SUP> and HCO<SUB>3</SUB><SUP>-</SUP> test', 'en/test_co3_720p.mp4',
    'PO<SUB>4</SUB><SUP>3-</SUP> test', 'en/test_po4_720p.mp4',
    'CH<SUB>3</SUB>COO<SUP>-</SUP> test', 'en/test_aco_720p.mp4',
    'F<SUP>-</SUP> test', 'en/test_f_720p.mp4',
    'BO<SUB>3</SUB><SUP>3-</SUP> test', 'en/test_bo3_720p.mp4',

    /**** Cations ****/

    'I group test (Ag<SUP>+</SUP>)', 'en/test_ag_720p.mp4',
    'II group test (Hg<SUP>2+</SUP>)', 'en/test_hg_720p.mp4',
    'III group test (Al<SUP>3+</SUP>)', 'en/test_al_720p.mp4',
    'IV group test (Zn<SUP>2+</SUP>)', 'en/test_zn_720p.mp4',
    'V group test (Ca<SUP>2+</SUP>)', 'en/test_ca_720p.mp4',
    'VI group test (NH<SUB>4</SUB><SUP>+</SUP>)', 'en/test_nh4_720p.mp4',
    'VI group test (Mg<SUP>2+</SUP>)', 'en/test_mg_720p.mp4',
    'Flame test', 'en/test_flame_720p.mp4',

    /**** Insolubles ****/

    'Al(OH)<SUB>3</SUB> and TiO<SUB>2</SUB> analysis', 'en/test_al(oh)3_tio2_720p.mp4',
    'BaSO<SUB>4</SUB> analysis', 'en/test_baso4_720p.mp4'
  ];
}
