<script>
    import UploaderComponent from "./components/UploaderComponent.svelte";
    import ImageComponent from "./components/ImageComponent.svelte";
    import { Graph } from "./utils/graph";
    import { createGraph } from "./utils/createGraph";
    import { globalState } from "./stores.js";
    import { draw } from "./utils/drawingFunctions.js";

    var imageSrc = "";

    $: if ($globalState.uploadedData) {
        $globalState.graph = new Graph();
        createGraph($globalState);
        imageSrc = draw($globalState);
    }

</script>

<div>
    <UploaderComponent />
    <ImageComponent {imageSrc} />
</div>

<style>
</style>
