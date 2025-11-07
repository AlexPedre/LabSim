# LabSim
**Simulator for Inorganic Qualitative Analysis Laboratory**

## Overview
LabSim is a web‑based 3D laboratory simulator designed for inorganic qualitative chemical analysis. It enables students to perform virtual lab tasks in their browser (Chromium‑based, e.g. Chrome or Edge) and supports multiple devices, including mobile and VR headsets.

Key features:
- Built on the [A‑Frame](https://aframe.io) Web VR framework, allowing immersive 3D interaction.
- Voice commands support (e.g., “take the hydrochloric acid”) and speech synthesis to assist students, including those with accessibility needs.
- Multilingual interface (Italian & English).
- A SQLite database with over 3,500 reactions, enabling recognition of about 60 inorganic analytes.
- Built‑in multimedia player with tutorial videos integrated into the 3D environment.

## What you can do
Using LabSim, a student can carry out many tasks similar to a real inorganic qualitative analysis laboratory. These include:
- Checking solubility of a substance in water (including in presence of strong/weak acids or bases).
- Measuring pH of a solution with indicator paper.
- Phase separation using a centrifuge.
- Heating using a plate or a water bath.
- Wet tests for anions and cations.
- Dry tests (for non‑water soluble substances).
- Flame test.
- Complete analysis of an unknown inorganic substance (whether water soluble or not).
- Viewing tutorial videos on both the virtual simulator and real laboratory work.

## What it *cannot* do
LabSim has some limitations:
- It does not support carbonate/bicarbonate tests with the U‑tube apparatus.
- It does not include recognition of barium sulfate via the anion solution method (although it includes a tutorial video to help).
- pH measurement by transferring liquid using the stirrer is not possible (only via the Pasteur pipette).
- Sodium and potassium recognition via wet tests is not available (flame test recommended).

## Requirements
### Hardware
LabSim works on:
- Desktop/laptop (Linux, macOS, Windows)
- Tablet (Android, iOS, Windows)
- Smartphone (Android, iOS) — though smaller screens/weak GPUs are not ideal.

### VR (optional, for full immersive experience)
- Stand‑alone VR headset (e.g., Oculus Quest) or PC‑connected VR headset (e.g., HTC, Oculus).
- Internet connection is required; slow connections mainly impact video loading.

**Tips for less powerful devices:**
- Disable “Detailed Graphics” in Settings → Graphics for better performance.
- On mobile: consider using a USB‑OTG or Bluetooth mouse for better control.

## Getting Started
1. Open your browser (preferably Chromium‑based).
2. Navigate to:
   ```
   https://www.ddl.unimi.it/labsim/
   ```
3. You will see the loading screen, then the main menu. Press **OK** to start.
4. For VR mode, press the “VR” button to switch to full‑screen immersive view; to exit, press **Esc**.

## Interaction & Controls
- **Mouse / Touch**: Use click/tap to select and interact with objects; objects highlight when you hover over them.
- **Keyboard**:
  - Arrow keys: move/translate scene
  - Spacebar or **M**: open main menu
  - **Esc**: close menu
- **VR Controllers**: Laser pointer from controller selects objects; trigger behaves like mouse click.

## Supported Objects & Lab Equipment
You can interact with various items placed on the lab bench – e.g., an interactive book (open menu), a photograph (to “smell” the air), a centrifuge, TV for videos.
Example workflow:
- Select object (e.g., pipette, beaker)
- Click or tap another object to transfer or apply reagents (solid or liquid)
- For some items, double‑click empties or clears them (e.g., waste beaker)

## Chemical Reactions & Simulation Engine
- The application uses a database of approximately 3,700 reactions (analysate + reagent, up to two reagents, or product + reagent(s)).
- Physical phenomena like heat (water bath or electric plate) and time are considered in reaction outcomes.
- Proper mixing is required: after each reagent addition, students must agitate for reaction to proceed correctly.

## License & Terms of Use
- LabSim is freely usable provided it is distributed from a server of the Università degli Studi di Milano.
- The authors make no warranties regarding hardware/software performance or any resulting damages.
- The simulator was developed starting in 2020 by Alessandro Pedretti (Department of Pharmaceutical Sciences, Università degli Studi di Milano).

## Contribution
If you wish to contribute to LabSim (for example by adding new reactions, translating interface, optimizing performance, etc.), please fork the repository, make your changes, and submit a pull request.
Please ensure that any new content (e.g., reactions) is backed by reliable chemical sources and is properly tested within the simulator environment.

## Contact
For any issues, bug reports or feature requests, please contact:
**Alessandro Pedretti** – Department of Pharmaceutical Sciences, Università degli Studi di Milano.  
Email: info@vegazz.net
