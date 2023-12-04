<script>
    import { onMount } from "svelte";
    import { globalState } from "../stores.js";

    export let imageSrc;
</script>

<div>
    <img id="ErDiagram" title="Click to edit image" alt="ER diagram" src={imageSrc} />
</div>

<style>
    #ErDiagram {
        cursor: pointer;
        border: 1px solid black;
    }

</style>
