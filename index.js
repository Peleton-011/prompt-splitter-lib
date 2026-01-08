import getSplitter  from "./components/getSplitter";
function Greeting(name) {
	const greeting = document.createElement("h1");
	greeting.textContent = `Hello ${name}`;
	return greeting;
}

export { Greeting, getSplitter };
