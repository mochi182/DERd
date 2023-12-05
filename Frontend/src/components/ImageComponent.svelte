<script>
    import { onMount } from "svelte";
    import { DiagramEditor } from "../utils/diagramEditor";
  
    export let imageSrc;
  
    onMount(() => {
      const imgElement = document.getElementById("ErDiagram");
      imgElement.addEventListener("click", () => {
        DiagramEditor.editElement(imgElement, null, "sketch", null, ["dark=1", "pv=0"]);
      });
    });
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