<script>
    import { basketSize } from "../stores";
    
    let svgElement;
    let pathElement;

    $: outerOffset = 40;
    $: innerOffset = 50;
    $: svgWidth = $basketSize.width + (2 * outerOffset) + (2 * innerOffset);
    $: svgHeight = $basketSize.height + 30;
    $: basketOriginY = (svgHeight / 2) - ($basketSize.height / 2);
    $: basketOriginX = (svgWidth / 2) - ($basketSize.width / 2) - innerOffset;

    $: basketPath = `
    M ${basketOriginX} ${basketOriginY} 
    C ${basketOriginX} ${basketOriginY} ${basketOriginX - outerOffset} ${basketOriginY + $basketSize.height} ${basketOriginX + innerOffset} ${basketOriginY + $basketSize.height}
    L ${basketOriginX + innerOffset + $basketSize.width} ${basketOriginY + $basketSize.height}
    C ${basketOriginX + $basketSize.width + outerOffset + (2*innerOffset)} ${basketOriginY + $basketSize.height} ${basketOriginX + $basketSize.width + (2*innerOffset)} ${basketOriginY} ${basketOriginX + $basketSize.width + (2*innerOffset)} ${basketOriginY}
    `
    import { onMount } from 'svelte';

    let mousePressDown = false;
    let initialMouseX = 0;
    let initialMouseY = 0;
    $: mouseOverClass = mousePressDown ? "grabbingCursor" : "grabCursor";

    function handleMouseDown(event) {
        mousePressDown = true;
        initialMouseX = event.clientX;
        initialMouseY = event.clientY;
    }

    function handleMouseUp() {
        mousePressDown = false;
    }

    function handleMouseMove(event) {
        const Bbox = svgElement.getBoundingClientRect();
        if (mousePressDown) {
            const deltaX = event.clientX - initialMouseX;
            const deltaY = event.clientY - initialMouseY;

            // Determine the quadrant
            const isLeftQuadrant = event.clientX > (Bbox.left) && event.clientX < (Bbox.left + Bbox.width / 2) ;
            const isRightQuadrant = event.clientX > (Bbox.left + Bbox.width / 2) && event.clientX < (Bbox.right) ;

            const isTopQuadrant = event.clientY > (Bbox.top) && event.clientY < (Bbox.top + Bbox.height / 2);
            const isBottomQuadrant = event.clientY > (Bbox.top + Bbox.height / 2) && event.clientY < (Bbox.bottom);
            
            // Resize logic based on the quadrant
            if (isLeftQuadrant) {
                $basketSize.width += -deltaX
            } else if (isRightQuadrant) {
                $basketSize.width += deltaX
            } 
            if (isTopQuadrant) {
                $basketSize.height += -deltaY
            } else if (isBottomQuadrant) {
                $basketSize.height += deltaY
            }

            // Update initial mouse position for the next move
            initialMouseX = event.clientX;
            initialMouseY = event.clientY;
        }
    }

    onMount(() => {
        pathElement.addEventListener('mousedown', handleMouseDown);
        pathElement.addEventListener('mouseup', handleMouseUp);
        pathElement.addEventListener('mouseleave', handleMouseUp);
        pathElement.addEventListener('mousemove', handleMouseMove);
    });

</script>

<div>
    <svg
    xmlns="http://www.w3.org/2000/svg"
    width={svgWidth}
    height={svgHeight}
    bind:this={svgElement}
    >    
    <path 
    class={mouseOverClass}
    d={basketPath}
    bind:this={pathElement}
    stroke-linecap="butt" 
    ></path>
</svg>
</div>

<style>

    path {
        fill: none;
        stroke: rgb(40, 85, 182);
        paint-order: fill;
        stroke-width: 30px;
    }

    div {
        padding: 10px;
        box-sizing: border-box;
    }

    .grabCursor {
        cursor: grab;
    }

    .grabbingCursor {
        cursor: grabbing;
    }
    
    path:hover {
        filter: drop-shadow( 0 0 10px #719ECE);
    }
</style>
