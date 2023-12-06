<script>
    import UploaderComponent from "./components/UploaderComponent.svelte";
    import ImageComponent from "./components/ImageComponent.svelte";
    import { Graph } from "./utils/graph";
    import { createGraph } from "./utils/createGraph";
    import { optimize } from "./utils/optimize.js"
    import { globalState } from "./stores.js";
    import { draw } from "./utils/drawingFunctions.js";

    var imageSrc = "";

    $: if ($globalState.uploadedData) {
        $globalState.graph = new Graph();
        createGraph($globalState);
        optimize($globalState);
        $globalState.graph.centerGraph();
        imageSrc = draw($globalState);
    }

</script>

<div>
    <UploaderComponent />
    {#if $globalState.uploadedData} 
        <ImageComponent {imageSrc} />
    {/if}
</div>

<style>
</style>
