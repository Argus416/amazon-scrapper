require("dotenv").config();

// +12057076702

const axios = require("axios");
const cheerio = require("cheerio");
const url =
	"https://www.amazon.fr/nouveau-support-made-for-amazon-pour-echo-dot-4e-generation-noir/dp/B08D7LDQTQ/?pf_rd_r=R9VCV90F9YYDRM4CQNCQ&pf_rd_p=d965b23c-62ed-48b5-869c-b7bb891430a3&pd_rd_r=17cc3e36-bf67-436b-ae89-895e88268233&pd_rd_w=BzP7d&pd_rd_wg=9iwWe&ref_=pd_gw_unk";

const accountSid = process.env.TWILIO_ACCOUNT_SID;
const authToken = process.env.TWILIO_AUTH_TOKEN;
const client = require("twilio")(accountSid, authToken);

const product = {
	name: "",
	price: "",
	link: "",
};

// const handler = setInterval(() => {
// 	scrape();
// }, 2000);

const scrape = async () => {
	try {
		const { data } = await axios.get(url);
		// load up html
		const $ = cheerio.load(data);
		const item = $("#centerCol");
		product.name = $(item).find("h1 span#productTitle").text().trim();
		product.price = $(item).find(".a-price-whole").first().text().replace(/[,.]/, "");
		product.price = parseInt(product.price);
		product.link = url;

		client.messages
			.create({
				body: `\nthe price of ${product.name} is ${product.price}. Purshase at ${product.link}`,
				from: "+12057076702",
				to: "+33646777804",
			})
			.then((res) => {
				console.log(`Message sent to +33464777804`, res);
			});
	} catch (err) {
		console.error(err);
	}
};

// handler();
scrape();
