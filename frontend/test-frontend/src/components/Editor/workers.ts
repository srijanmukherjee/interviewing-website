const workerPath = (name: TemplateStringsArray) => `/_next/static/${name[0]}.worker.js`;

export const workers: { [index: string]: string } = {
	typescript: workerPath`ts`,
	javascript: workerPath`ts`,
	swift: workerPath`swift`,
	cpp: workerPath`cpp`,
	c: workerPath`c`,
	java: workerPath`java`,
	python: workerPath`python`,

	editor: workerPath`editor`,
};
