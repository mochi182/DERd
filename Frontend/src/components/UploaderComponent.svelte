<script>
    import { onMount } from "svelte";
    import { createGraph } from "../utils/graph";
    import { globalState } from "../stores.js";

    let uploadedData = null;
    let textAreaValue = "stff";

    async function handleFileUpload(event) {
        event.preventDefault();
        console.log(textAreaValue)

        const formData = new FormData();
        //formData.append("file", file);

        try {
            const response = await fetch(
                "http://localhost:3050/parse_sql",
                {
                    method: "POST",
                    body: textAreaValue,
                },
            );

            if (response.ok) {
                const data = await response.json();

                console.log(data.message)
                uploadedData = data.object;
            } else {
                console.error("Upload failed");
            }
        } catch (error) {
            console.error("Error during upload:", error);
        }
    }

    $: if (uploadedData) {
        console.log(uploadedData)
        $globalState.uploadedData = uploadedData;
    }
</script>

<div>
    <form id="queryForm">
        <label>
            <input
                type="radio"
                name="queryType"
                value="write"
                id="writeQuery"
                checked
            />
            Write query
        </label>
        <label>
            <input
                type="radio"
                name="queryType"
                value="upload"
                id="uploadQuery"
            /> Upload SQL file
        </label>

        <div id="writeQueryDiv">
            <textarea
                bind:value={textAreaValue}
                name="queryText"
                id="queryText"
                rows="4"
                cols="50"
                placeholder="Enter your SQL query here"
            ></textarea>
        </div>

        <div id="uploadQueryDiv">
            <label for="SQLfile">Upload SQL file:</label>
            <input type="file" name="SQLfile" id="SQLfile" accept=".sql" />
        </div>

        <input
            on:click={handleFileUpload}
            type="submit"
            value="Submit"
            class="btn btn-success"
        />
    </form>
</div>
