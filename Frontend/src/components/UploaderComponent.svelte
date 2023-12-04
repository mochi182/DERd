<script>
    import { globalState } from "../stores.js";

    let uploadedData = null;
    let textAreaValue = 'CREATE TABLE `teams` ( \
  `team_name` varchar(50) NOT NULL, \
  `logo` varchar(100) NOT NULL, \
  `description` text NOT NULL \
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci; \
ALTER TABLE `teams` \
  ADD PRIMARY KEY (`team_name`); \
  CREATE TABLE `players` ( \
  `player_id` int(11) NOT NULL, \
  `player_name` varchar(50) NOT NULL, \
  `team` varchar(50) NOT NULL \
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci; \
ALTER TABLE `players` \
  ADD PRIMARY KEY (`player_id`), \
  ADD KEY `team` (`team`); \
  ALTER TABLE `players` \
  ADD CONSTRAINT `players_ibfk_1` FOREIGN KEY (`team`) REFERENCES `teams` (`team_name`); \
COMMIT;';

    async function handleFileUpload(event) {
        event.preventDefault();

        //const formData = new FormData();
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
        //console.log(uploadedData)
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
