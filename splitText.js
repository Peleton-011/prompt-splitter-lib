const splitText = (text, chunkSize, promptList) => {
	const textLength = text.length;
	if (textLength < chunkSize) {
		return [text];
	}

	const promptLengths = Object.values(promptList).map(
		(prompt) => prompt?.length || 0
	);

	// Calculate sizes for different chunk types
	const firstChunkSize =
		chunkSize -
		(promptList.initialPrompt.length +
			promptLengths[1] +
			promptLengths[2] +
			1); // +1 for newline
	const normalChunkSize = chunkSize - (promptLengths[1] + promptLengths[2]);
	const lastChunkSize = chunkSize - (promptLengths[3] + promptLengths[4]);

	// Calculate number of chunks needed after the first chunk
	const remainingText = text.substring(firstChunkSize);
	const numRemainingChunks = Math.ceil(
		remainingText.length / normalChunkSize
	);
	const totalChunks = numRemainingChunks + 1;

	// Initialize chunks array
	const textChunks = [];

	// Create first chunk with initial prompt and standard parts
	const firstChunk =
		promptList.initialPrompt +
		"\n" +
		promptList.startPart.replace(
			/XXX\/XXX/g,
			`001/${String(totalChunks).padStart(3, "0")}`
		) +
		text.substring(0, firstChunkSize) +
		promptList.endPart.replace(
			/XXX\/XXX/g,
			`001/${String(totalChunks).padStart(3, "0")}`
		);

	textChunks.push(firstChunk);

	// Process remaining chunks
	let start = firstChunkSize;
	let end = start + normalChunkSize;

	for (let i = 1; i < totalChunks; i++) {
		const isLastChunk = i === totalChunks - 1;
		const currentChunkSize = isLastChunk ? lastChunkSize : normalChunkSize;

		const formattedPartNumber = String(i + 1).padStart(3, "0");
		const formattedTotalParts = String(totalChunks).padStart(3, "0");
		const partCounter = `${formattedPartNumber}/${formattedTotalParts}`;

		const chunk =
			promptList[isLastChunk ? "startFinalPart" : "startPart"].replace(
				/XXX\/XXX/g,
				partCounter
			) +
			text.substring(
				start,
				isLastChunk ? start + currentChunkSize : end
			) +
			promptList[isLastChunk ? "endFinalPart" : "endPart"].replace(
				/XXX\/XXX/g,
				partCounter
			);

		textChunks.push(chunk);
		start = end;
		end = start + normalChunkSize;
	}

	return textChunks;
};

export default splitText;
