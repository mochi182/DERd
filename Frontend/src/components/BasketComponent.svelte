<script>
    let svgElement;
    let pathElement;

    $: basketHeight = 200;
    $: basketWidth = 300;
    $: outerOffset = 40;
    $: innerOffset = 50;
    $: svgWidth = basketWidth + (2 * outerOffset) + (2 * innerOffset);
    $: svgHeight = basketHeight + 30;
    $: basketOriginY = (svgHeight / 2) - (basketHeight / 2);
    $: basketOriginX = (svgWidth / 2) - (basketWidth / 2) - innerOffset;

    $: basketPath = `
    M ${basketOriginX} ${basketOriginY} 
    C ${basketOriginX} ${basketOriginY} ${basketOriginX - outerOffset} ${basketOriginY + basketHeight} ${basketOriginX + innerOffset} ${basketOriginY + basketHeight}
    L ${basketOriginX + innerOffset + basketWidth} ${basketOriginY + basketHeight}
    C ${basketOriginX + basketWidth + outerOffset + (2*innerOffset)} ${basketOriginY + basketHeight} ${basketOriginX + basketWidth + (2*innerOffset)} ${basketOriginY} ${basketOriginX + basketWidth + (2*innerOffset)} ${basketOriginY}
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
                basketWidth += -deltaX
            } else if (isRightQuadrant) {
                basketWidth += deltaX
            } 
            if (isTopQuadrant) {
                basketHeight += -deltaY
            } else if (isBottomQuadrant) {
                basketHeight += deltaY
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
    ></path>
</svg>
</div>

<style>

    path {
        fill: none;
        stroke: blue;
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
    
    .overLeftBorder {
        border-left: 1px solid black;
        stroke-width: 3;
    }
    
    .overRightBorder {
        border-right: 1px solid black;
        stroke-width: 3;
    }
    
    .overBottomBorder {
        border-bottom: 1px solid black;
        stroke-width: 3;
    }
</style>
