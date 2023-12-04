<script>
    import { onMount } from "svelte";
    import { globalState } from '../stores.js'
    
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
  