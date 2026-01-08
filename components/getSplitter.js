import promptsImport from "../assets/prompts.json";
import languagesImport from "../assets/languages.json";
import splitText from "../splitText";
import getCopyButton from "./getCopyButton";

// type PromptLanguage = {
// 	initialPrompt: string;
// 	startPart: string;
// 	endPart: string;
// 	startFinalPart: string;
// 	endFinalPart: string;
// };
// type Prompts = {
// 	[key: string]: PromptLanguage;
// };

// type Language = {
// 	code: string;
// 	name: string;
// 	native: string;
// 	rtl?: boolean | number | undefined;
// };

const getSplitter = () => {
	const chunks = [];
	let text = "";
	const chunkSize = 15000;
	let selectedLanguage = "es"; // Default set to Spanish

	let promptList = promptsImport.es; // Set default prompts to Spanish

	function setSelectedLanguage(lang) {
		selectedLanguage = lang;
		promptList = promptsImport[lang];

		if (selectedLanguage in promptsImport) {
			promptList = promptsImport[selectedLanguage];
		} else {
			console.error("Language not found: ", selectedLanguage);
		}
	}

	function handleSplitText() {
		const chunks = splitText(text, chunkSize, promptList);

		populateCopyButtons();

		if (chunks.length < 2) {
			document.getElementById("tooShort").style.display = "block";
		} else {
			document.getElementById("tooShort").style.display = "none";
		}
	}

	function populateCopyButtons() {
		const copyButtons = document.getElementById("copyButtons");
		chunks.forEach((chunk, index) => {
			const copyButton = getCopyButton(chunk, `Chunk ${index + 1}`);
			copyButtons.appendChild(copyButton);
		});
	}

	const splitter = document.createElement("section");
	splitter.classList.add("container");
	splitter.style.marginTop = "40px";

	const h1 = document.createElement("h1");
	h1.textContent = "ChatGPT 🤖 prompt Splitter";
	splitter.appendChild(h1);

	const textarea = document.createElement("textarea");
	textarea.placeholder = "Enter text to split";
	textarea.value = text;
	textarea.addEventListener("change", (e) => {
		text = String(e.target.value);
	});
	textarea.rows = 10;
	textarea.cols = 50;
	splitter.appendChild(textarea);

	// Language selector "bundle"
	const languageSelector = document.createElement("div");

	const languageSelect = document.createElement("select");
	languageSelect.id = "languages";
	languageSelect.value = selectedLanguage;
	languageSelect.addEventListener("change", (e) => {
		setSelectedLanguage(e.target.value);
	});

	languagesImport.forEach((lang, index) => {
		const option = document.createElement("option");
		option.value = lang.code;
		option.textContent = lang.native;
		languageSelect.appendChild(option);
	});

	const languageSelectLabel = document.createElement("label");
	languageSelectLabel.for = "languages";
	languageSelectLabel.textContent = "Choose a language:";

	languageSelector.appendChild(languageSelectLabel);
	languageSelector.appendChild(languageSelect);

	splitter.appendChild(languageSelector);

	const splitButton = document.createElement("button");
	splitButton.textContent = "Split Text";
	splitButton.disabled = !text;
	splitButton.addEventListener("click", handleSplitText);
	splitter.appendChild(splitButton);

	const tooShort = document.createElement("h3");
	tooShort.id = "tooShort";
	tooShort.textContent =
		"Text is too short to split! You could have sent as one chunk! 😂";
	tooShort.style.display = "none";
	splitter.appendChild(tooShort);

	const copyButtons = document.createElement("div");
	copyButtons.id = "copyButtons";
	copyButtons.style.display = "flex";
	copyButtons.style.flexWrap = "wrap";
	copyButtons.style.gap = "10px";

	populateCopyButtons();

	splitter.appendChild(copyButtons);

	return splitter;
};

export default getSplitter;
