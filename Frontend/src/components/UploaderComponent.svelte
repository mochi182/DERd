<script>
    import { onMount } from "svelte";
    import { createGraph } from "../utils/graph";
    
    let uploadedData = null;
  
    async function handleFileUpload(event) {
      const file = event.target.files[0];
  
      if (file) {
        const formData = new FormData();
        formData.append("file", file);
  
        try {
          const response = await fetch("http://localhost:3050/parse_sql", {
            method: "POST",
            body: formData,
          });
  
          if (response.ok) {
            const data = await response.json();
            uploadedData = data;
          } else {
            console.error("Upload failed");
          }
        } catch (error) {
          console.error("Error during upload:", error);
        }
      }
    }
  
    $: if (uploadedData) {
      $globalState.uploadedData = uploadedData;
    }
  </script>
  
  <div>
    <form id="queryForm">
      <label>
        <input type="radio" name="queryType" value="write" id="writeQuery" checked>
        Write query
      </label>
      <label>
        <input type="radio" name="queryType" value="upload" id="uploadQuery"> Upload SQL file
      </label>
  
      <div id="writeQueryDiv">
        <textarea name="queryText" id="queryText" rows="4" cols="50" placeholder="Enter your SQL query here">
        </textarea>
      </div>
  
      <div id="uploadQueryDiv">
        <label for="SQLfile">Upload SQL file:</label>
        <input type="file" name="SQLfile" id="SQLfile" accept=".sql" on:change={handleFileUpload}>
      </div>
  
      <input type="submit" value="Submit" class="btn btn-success">
    </form>
  </div>
  