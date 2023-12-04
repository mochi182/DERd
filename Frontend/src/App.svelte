  <script>
    import UploaderComponent from "./components/UploaderComponent.svelte";
    import ImageComponent from "./components/ImageComponent.svelte";
    import { createGraph } from "./utils/graph";
    import { globalState } from "./stores.js"

    if ($globalState.uploadedData) {
      $globalState.graph = createGraph($globalState.uploadedData.object);
    }
  
  </script>
  
  <div>
    {JSON.stringify($globalState)}

    <UploaderComponent />
    {#if $globalState.graph}
      <ImageComponent />
    {/if}
  </div>
  
  <style>
  </style>
  