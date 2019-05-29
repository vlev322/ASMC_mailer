import pug from "pug";
import sass from "node-sass";
import juice from "juice";
import { resolve } from "path";

const TEMPLATE_PATH = `./templates/`;

class TemplateController {
	public static render(template: string, param: {}): string | never {
		const tPath = resolve(TEMPLATE_PATH + template);
		const sPath = `${tPath}/style.sass`;
		const pPath = `${tPath}/index.pug`;

		const cssBuffer: { css: Buffer } = sass.renderSync({ file: sPath });
		const style = cssBuffer.css.toString();

		const options = Object.assign(param, { style });
		const html: string = pug.renderFile(pPath, options);

		return juice(html);
	}
}

export default TemplateController;
