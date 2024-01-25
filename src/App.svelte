<script lang="ts">
  import { onMount } from "svelte";

  import Handsontable from "handsontable";
  import "handsontable/dist/handsontable.full.min.css";

  let text = `3	2023	Kg
2	2023	Kg
-1	2023	Kg
-2	2023	Kg`;

  const data = text.split("\n").map((line) => line.split("\t"));
  console.log(data);

  onMount(() => {
    const output = document.querySelector<HTMLOutputElement>("#output")!;
    const getButton = document.querySelector<HTMLButtonElement>("#getButton")!;

    const container = document.querySelector<HTMLDivElement>("#table")!;
    const hot = new Handsontable(container, {
      // data: [
      //   ["A1", "B1", "C1", "D1", "E1", "F1", "G1", "H1", "I1"],
      //   ["A2", "B2", "C2", "D2", "E2", "F2", "G2", "H2", "I2"],
      //   ["A3", "B3", "C3", "D3", "E3", "F3", "G3", "H3", "I3"],
      //   ["A4", "B4", "C4", "D4", "E4", "F4", "G4", "H4", "I4"],
      //   ["A5", "B5", "C5", "D5", "E5", "F5", "G5", "H5", "I5"],
      //   ["A6", "B6", "C6", "D6", "E6", "F6", "G6", "H6", "I6"],
      //   ["A7", "B7", "C7", "D7", "E7", "F7", "G7", "H7", "I7"],
      //   ["A8", "B8", "C8", "D8", "E8", "F8", "G8", "H8", "I8"],
      //   ["A9", "B9", "C9", "D9", "E9", "F9", "G9", "H9", "I9"],
      // ],
      startRows: 10,
      startCols: 4,
      width: "auto",
      height: "auto",
      colWidths: 200,
      rowHeights: 23,
      rowHeaders: true,
      colHeaders: true,
      outsideClickDeselects: false,
      selectionMode: "multiple",
      autoWrapRow: true,
      autoWrapCol: true,
      licenseKey: "non-commercial-and-evaluation",
    });

    getButton.addEventListener("click", (event) => {
      const selected = hot.getSelected() || [];
      const data = [];

      for (let i = 0; i < selected.length; i += 1) {
        const item = selected[i];

        data.push(hot.getData(...item));
      }

      output.innerText = JSON.stringify(data);
    });
  });
</script>

<main class="flex justify-center align-middle items-center min-h-screen">
  <div class="w-1/2 resize-x overflow-auto mx-auto">
    <div id="table"></div>
    <output class="console" id="output">Here you will see the log</output>
    <div class="controls">
      <button id="getButton">Get data</button>
    </div>
  </div>
</main>
