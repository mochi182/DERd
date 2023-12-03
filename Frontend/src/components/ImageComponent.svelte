<script>
    import { onMount } from "svelte";
  
    export let data;
  
    let svgContent = "";
  
    onMount(() => {
      svgContent = `<svg></svg>`;
    });
  </script>
  
  <div>
    {#if svgContent}
      {@html svgContent}
    {/if}
  </div>
  