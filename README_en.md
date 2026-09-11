# arbys-obs-widget

An OBS overlay widget for displaying Warframe Arbitration mission details in real-time.

![Widget Preview](preview_en.png)

---

## Setup Instructions

### 1. Copy the Widget URL
First, copy the following URL:
* `https://wasurengel.github.io/arbys-obs-widget/`

### 2. Add a "Browser" Source in OBS
1. Open **OBS Studio**.
2. Click the **"+"** icon in the **Sources** dock at the bottom of the screen.
3. Select **"Browser"** from the menu.
4. Name it something recognizable (e.g., `Arbitration Overlay`) and click **OK**.

### 3. Configure Properties
When the properties window opens, set the parameters as follows:

* **URL**: Delete the default URL and paste `https://wasurengel.github.io/arbys-obs-widget/`
* **Width / Height**: 
  Set the size to fit the overlay properly. Starting with `350` × `100` is recommended, and you can adjust it later according to your stream layout.
* **Custom CSS**: 
  Keep the default CSS to make the background transparent:
  ```css
  body { background-color: rgba(0, 0, 0, 0); margin: 0px; auto; overflow: hidden; }
  ```
  *Note: You can adjust background opacity by changing the last value in `rgba(0, 0, 0, 0)` (e.g., changing it to `0.3` to `0.5` adds a subtle semi-transparent dark background for better text readability).*

Click **OK** when finished.

### 4. Adjust Position and Size

The overlay will appear in the OBS preview window. Drag the red boundary box to position and resize it wherever you like.

---
## License

This project is licensed under the [MIT License](LICENSE).

## Credits & External Data Sources

This tool utilizes data provided by the following communities and repositories:

### **Arbitration Schedule Data (`arbys.txt`)**
* Source: [browse.wf (calamity-inc)](https://github.com/calamity-inc/browse.wf)
* License: MIT License
* Copyright: Copyright (c) 2025 Calamity, Inc.


### **Arbitration Tier List Data**
* Source: Arbitration Goons


### **Node Mapping Data**
* Source: [WFCD (Warframe Community Developers)](https://github.com/WFCD)

## Disclaimer

* This is an unofficial fan-made tool and is not affiliated with Digital Extremes Ltd.
