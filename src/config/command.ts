const config = {
	/**
   * 命令配置
	 * 键值需要对应 {@link TemplateParamsType} 的键(除了 git)
	 */
	execCommandOption: {
		frame: [
			{ name: "Vue", checked: true },
			{ name: "React" },
			{ name: "Native" },
		],
		language: [
			{ name: "TypeScript", checked: true },
			{ name: "JavaScript" }
		],
		packages: (frame: FrameType) => getPackagesOptionByFrame(frame),
	},
}


// 根据框架返回对应的可以选择的 package
type PackageListType = Array<{ name: string, checked?: boolean }>;
const getPackagesOptionByFrame = (frame: FrameType): PackageListType => {

	let choicesPackages: PackageListType = [];
	// 通用 package
	const common = [
		{ name: "Eslint", checked: true },
		{ name: "Axios" },
		{ name: "Prettier" },
		{ name: "Lodash" },
		{ name: "Dayjs" },
		{ name: "Husky" },
		{ name: "Commitlint" },
	];


	switch (frame) {
		case "Vue":
			choicesPackages = [
				{ name: "Element-Plus", checked: true },
				{ name: "Sass", checked: true },
				{ name: "Pinia" },
				{ name: "Vue-router" },
				{ name: "Vueuse" },
				{ name: "JSX(TSX)" },
				{ name: "Tailwind CSS" },
			];
			break;
		case "React":
			choicesPackages = [
				{ name: "Ant-Design", checked: true },
				{ name: "Reducx" },
				{ name: "React-router" },
				{ name: "React-use" },
				{ name: "Tailwind CSS" },
			];
			break;
		case "Native":
			choicesPackages = [
				{ name: "Vitest", checked: true },
				{ name: "Fs-extra", checked: true },
				{ name: "Rollup" },
				{ name: "Ora" },
				{ name: "Chalk" },
				{ name: "Log-symbols" },
				{ name: "Puppeteer-core" },
				// { name: "Commander" },
				// { name: "Inquirer" },
			];
			break;
		default:
			console.log("未知的类型 -->", frame);
			break;
	}

	// 排序
	return [
		...choicesPackages,
		...common
	].sort((a, b) => a.name.localeCompare(b.name));
};


export const { execCommandOption } = config;
export {
  getPackagesOptionByFrame
};