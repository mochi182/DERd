<script>
    import { globalState, basketSize } from "../stores.js";
    import BasketComponent from "./BasketComponent.svelte"
	import { tweened } from 'svelte/motion';
	import { cubicOut } from 'svelte/easing';

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

	const movement = tweened(0, {
		duration: 100,
		easing: cubicOut
	});

    async function setMove(v) {
        await movement.set(v)
        await movement.set(-v)
        movement.set(0)
    }

    // https://stackoverflow.com/questions/75601130/is-it-possible-to-get-the-state-of-a-svelte-tweened-motion

</script>

<div>

    <div class="inputContainer" style="width: calc({$basketSize.width}px + 80px); transform: rotate({$movement}deg);">
            <textarea
                bind:value={textAreaValue}
                name="queryText"
                id="queryText"
                placeholder="Enter your SQL query here"
                style="
                width: calc({$basketSize.width}px + 30px);
                height: calc({$basketSize.height}px - 40px);
                "
                on:input={() => setMove(10)}
            ></textarea>
    </div>

    <BasketComponent />

    <button
    on:click={handleFileUpload}
    class="btn btn-success"
    >Draw ER <span>diagram</span></button>

</div>

<style>
    .inputContainer {
        margin-left: auto;
        margin-right: auto;
        position: relative;
    }

    #queryText {
        position: absolute;
        top: 30px;
        left: 24px;
        resize: none;
        border: none;
    }

    #queryText:focus {
        outline: none !important;
    }

    #queryText {
    scrollbar-width: thin;
    scrollbar-color: #c4d5e7 #FFFFFF; /* Track color and thumb color */
    }

    /* For Webkit browsers (Chrome, Safari) */
    #queryText::-webkit-scrollbar {
    width: 8px; /* Adjust the width as needed */
    }

    #queryText::-webkit-scrollbar-track {
    background-color: #FFFFFF; /* Track color */
    }

    #queryText::-webkit-scrollbar-thumb {
    background-color: #c4d5e7; /* Thumb color */
    border-radius: 8px; /* Rounded corners */
    }

    #queryText::-webkit-scrollbar-thumb:hover {
    background-color: #abc4df; /* Thumb color on hover */
    }

    button {
        color:white;
        background-color: rgb(40, 85, 182);
    }

    button:hover {
        box-shadow: 0 0 10px #719ECE;
    }

    button:focus {
        outline: none !important;
    }

    .inputContainer,
    BasketComponent {
        transition: transform 300ms ease-in-out;
    }
</style>