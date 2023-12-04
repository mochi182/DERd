<script>
    import UploaderComponent from "./components/UploaderComponent.svelte";
    import ImageComponent from "./components/ImageComponent.svelte";
    import { Graph } from "./utils/graph";
    import { createGraph } from "./utils/createGraph";
    import { globalState } from "./stores.js";

    $: if ($globalState.uploadedData) {
        $globalState.graph = new Graph();
        createGraph($globalState)
        console.log($globalState)
    }

</script>

<div>

    <UploaderComponent />
    {#if $globalState.graph}
        {JSON.stringify($globalState.graph)}
        <ImageComponent />
    {/if}
</div>

<style>
</style>
