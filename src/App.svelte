<script lang="ts">
  import { onMount } from "svelte";
  import Handsontable from "handsontable";
  import "handsontable/dist/handsontable.full.min.css";

  import { findSubsetWithSum } from "./utils";

  let hot: Handsontable | undefined;
  let result: Handsontable | undefined;

  let colsCount = 1;
  let sum = 0;
  let data: any[] = [];
  // user data
  let amountColIdx = 0;
  let nOfColumnData = colsCount;

  $: if (colsCount) {
    const amountCol = hot?.getDataAtCol(amountColIdx) || [];
    sumData(amountCol);
    sum = sum;
  }

  function caculate() {
    // data = hot?.getSourceData() || [];

    const amountCol = hot?.getDataAtCol(amountColIdx);
    const subset = findSubsetWithSum(
      amountCol?.map((n) => parseFloat(n) || 0) || [],
    );
    if (subset) {
      result?.loadData(subset.map((n) => [n]));
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
      startRows: 10,
      startCols: colsCount,
      afterChange: summary,
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
  <div class="w-2/3 resize-x overflow-auto mx-auto">
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

    <div class="controls m-2">
      <button on:click={caculate} class="btn btn-primary">Caculate</button>
    </div>

    <h2 class="text-xl">Result</h2>
    <div id="result"></div>
  </div>
</main>
