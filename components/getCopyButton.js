// interface CopyButtonProps {
//     text: string;
//     name: string;
// }

const getCopyButton = (text, name) => {
	function copyToClipboard() {
		navigator.clipboard
			.writeText(text)
			.then(() => {
				const button = document.getElementById(name);
				button.textContent = "Copied " + name + "!";
				button.classList.add("secondary");
			})
			.catch((err) => {
				console.error("Failed to copy: ", err);
			});
	}

	const button = document.createElement("button");
	button.id = name;
	button.classList.add("copy-button");
	button.textContent = "Copy " + name;
	button.addEventListener("click", copyToClipboard);

	return button;
};

export default getCopyButton;
