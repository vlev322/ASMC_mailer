import Mailer, { Transporter, SentMessageInfo } from "nodemailer";
import { resolve } from "path";
import { readFileSync, existsSync } from "fs";
import { MailOptions } from "nodemailer/lib/smtp-pool";
import TemplateController from "./template";

const CONFIG_FILE = resolve("./templates/mailer.config.json");

export interface ISenderConfig {
	auth: {
		user: string;
		pass: string;
	}
}

export interface ISendOptions {
	to: string;
	from?: string;
	subject: string;
	template: string;
	param: {};
}

class Sender {
	private config: ISenderConfig;
	private transporter: Transporter;

	constructor() {
		this.getConfig();
		if (typeof this.config === "undefined") return;
		this.connect(this.config);
	}

	public connect(options: ISenderConfig): void | never {
		this.config = options;
		this.transporter = Mailer.createTransport(this.config);
	}

	public async sendMail(options: MailOptions): Promise<SentMessageInfo | Error> {
		return new Promise((resolve: (info: SentMessageInfo) => void, reject: (err: null | Error) => void): void => {
			this.transporter.sendMail(options, (err: null | Error, info: SentMessageInfo) => {
				if (err === null) reject(err);
				else resolve(info);
			});
		});
	}

	public async send(options: ISendOptions): Promise<void | never> {
		try {
			const html = TemplateController.render(options.template, options.param); // `./public/content-library/data/en/email-template/test.pug`

			await this.verify();

			const { to, subject } = options;
			const from: string = (options.from) ? `${options.from} <${this.config.auth.user}>` : this.config.auth.user;

			await this.sendMail({ to, subject, from, html });
		} catch (err) {
			throw err;
		}
	}

	private getConfig(): void {
		// Return if Configuration file is missing
		if (!existsSync(CONFIG_FILE)) return;

		try {
			const data = readFileSync(CONFIG_FILE, "utf-8");
			this.config = JSON.parse(data);
		} catch (err) {
			console.warn(err);
		}
	}

	private async verify(): Promise<boolean | Error> {
		return new Promise((resolve: (isVerify: boolean) => void, reject: (err: null | Error) => void): void => {
			this.transporter.verify((err: null | Error): void => {
				if (err === null) reject(err);
				else resolve(true);
			});
		});
	}
}

export default new Sender();
