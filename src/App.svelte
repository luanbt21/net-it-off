<script lang="ts">
  import { onMount } from "svelte";
  import Handsontable from "handsontable";
  import "handsontable/dist/handsontable.full.min.css";

  import { findSubsetWithSum } from "./utils";

  let hot: Handsontable | undefined;
  let result: Handsontable | undefined;
  let summaryText = "";
  let resultText = "";

  let colsCount = 1;
  let sum = 0;
  let data: any[] = [];

  init();
  function init() {
    data = new Array(20)
      .fill(0)
      .map(() => [((Math.random() - 0.35) * 20).toFixed(0)]);
  }

  // user data
  let amountColIdx = 0;
  let nOfColumnData = colsCount;

  $: if (colsCount) {
    const amountCol = hot?.getDataAtCol(amountColIdx) || [];
    sumData(amountCol);
    sum = sum;
  }

  function calculate() {
    // data = hot?.getSourceData() || [];

    const amountCol = hot?.getDataAtCol(amountColIdx);
    const subset = findSubsetWithSum(
      amountCol?.map((n) => parseFloat(n) || 0) || []
    );
    if (subset) {
      summaryText = `length: ${subset.length}, sum: ${subset.reduce(
        (pre, cur) => pre + cur
      )}`;
      if (subset.length < 300) {
        result?.loadData(subset.map((n) => [n]));
      } else {
        resultText = subset.join("\n");
      }
    }
  }

  function summary() {
    colsCount = hot?.countCols() || 0;
    nOfColumnData = colsCount;
    const amountCol = hot?.getDataAtCol(amountColIdx) || [];
    sumData(amountCol);
  }

  function sumData(numbers: string[]) {
    sum = numbers
      .map((n) => parseFloat(n) || 0)
      .reduce((pre, cur) => pre + cur, 0);
  }

  onMount(() => {
    const container = document.querySelector<HTMLDivElement>("#table")!;
    hot = new Handsontable(container, {
      data,
      startRows: 10,
      startCols: colsCount,
      afterChange: summary,
      renderAllRows: true,
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

    const resultContainer = document.querySelector<HTMLDivElement>("#result")!;
    result = new Handsontable(resultContainer, {
      startRows: 0,
      startCols: 0,
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
    summary();
  });
</script>

<main class="flex justify-center align-middle items-center min-h-screen">
  <div class="w-1/2 resize-x overflow-auto mx-auto">
    <button
      class="btn btn-sm btn-warning"
      on:click={() => {
        init();
        hot?.loadData(data);
      }}>Refresh demo data</button
    >
    <div class="w-full m-2">
      <label class="form-control w-full max-w-xs">
        <div class="label">
          <span class="label-text">How many columns of data do you have?</span>
        </div>
        <select class="select select-bordered" bind:value={nOfColumnData}>
          {#each new Array(colsCount) as _, i}
            <option value={i + 1}>{i + 1}</option>
          {/each}
        </select>
      </label>

      <label class="form-control w-full max-w-xs">
        <div class="label">
          <span class="label-text">Which the amount column?</span>
        </div>
        <select class="select select-bordered" bind:value={amountColIdx}>
          {#each new Array(colsCount) as _, i}
            <option value={i}>{String.fromCharCode(65 + i)}</option>
          {/each}
        </select>
      </label>
    </div>

    <div id="table"></div>

    <div class="stats shadow m-2">
      <div class="stat">
        <div class="stat-title">Amount Sum</div>
        <div class="stat-value">{sum}</div>
        <!-- <div class="stat-desc">21% more than last month</div> -->
      </div>
    </div>

    <div>
      <div class="controls m-2">
        <button on:click={calculate} class="btn btn-primary">Calculate</button>
      </div>

      <h2 class="text-xl">Result</h2>
      <p class="text-lg">{summaryText}</p>
      <div id="result"></div>
      <pre contenteditable>{resultText}</pre>
    </div>
  </div>
</main>
