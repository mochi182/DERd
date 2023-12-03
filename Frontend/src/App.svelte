<script>
    import UploaderComponent from "./components/UploaderComponent.svelte";
    import ImageComponent from "./components/ImageComponent.svelte";
    import { createGraph } from "./utils/graph";
  
    let globalState = {
      uploadedData: null,
      graph: null,
    };
  
    $: if ($globalState.uploadedData) {
      $globalState.graph = createGraph($globalState.uploadedData.object);
    }
  </script>
  
  <div>
    <UploaderComponent {globalState} />
    {#if $globalState.graph}
      <ImageComponent {graph: $globalState.graph} />
    {/if}
  </div>
  
  <style>
    /* Add your styles here */
  </style>
  