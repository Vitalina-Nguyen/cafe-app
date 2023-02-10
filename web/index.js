// @ts-check
import { join } from "path";
import { readFileSync } from "fs";
import express from "express";
import serveStatic from "serve-static";

import shopify from "./shopify.js";
import productCreator from "./product-creator.js";
import GDPRWebhookHandlers from "./gdpr.js";

const PORT = parseInt(process.env.BACKEND_PORT || process.env.PORT, 10);

const STATIC_PATH =
  process.env.NODE_ENV === "production"
    ? `${process.cwd()}/frontend/dist`
    : `${process.cwd()}/frontend/`;

const app = express();

app.use(/\/api(|\/[a-z]*)*/, (req, res, next) => {
  req.body = "";
  req.setEncoding("utf8");

  req.on("data", (chunk) => {
    req.body += chunk;
  });

  req.on("end", () => {
    next();
  });
});

// Set up Shopify authentication and webhook handling
app.get(shopify.config.auth.path, shopify.auth.begin());
app.get(
  shopify.config.auth.callbackPath,
  shopify.auth.callback(),
  shopify.redirectToShopifyOrAppRoot()
);
app.post(
  shopify.config.webhooks.path,
  shopify.processWebhooks({ webhookHandlers: GDPRWebhookHandlers })
);

// All endpoints after this point will require an active session
app.use("/api/*", shopify.validateAuthenticatedSession());

app.use(express.json());

app.get("/api/products/count", async (_req, res) => {
  const countData = await shopify.api.rest.Product.count({
    session: res.locals.shopify.session,
  });
  res.status(200).send(countData);
});


app.get("/api/products/all", async (_req, res) => {
  const session = res.locals.shopify.session;
  let allPr;
  let status = 200;
  let error = null;
  
  try {

    const allProducts = await shopify.api.rest.Product.all({ session: session });

    allPr = allProducts.map( pr => {
      const price = (pr.variants) ? pr.variants[0].price : '';
      const image = (pr.image) ? pr.image.src : '';
      return (
        {
          id: pr.id,
          title: pr.title,
          price: price,
          image: image,
        }
      )
    })
    
    
  } catch (e) {
    console.log(`Failed to get product(s): ${e.message}`);
    status = 500;
    error = e.message;
  }

  res.status(status).send(allPr);
})


app.post("/api/products/addnewproduct", async (_req, res) => {
  const session = res.locals.shopify.session;
  const data = JSON.parse(_req.body);

  const product = new shopify.api.rest.Product({ session: session });

  product.title = data.title;
  product.body_html = data.description;

  await product.save({
    update: true,
  });

  //Создание Product Variant
  const variant = new shopify.api.rest.Variant({ session: session });
  if (product.variants) {
    variant.id = product.variants[0].id;
    variant.price = data.price;
    await variant.save({
      update: true,
    });
  }

  //Создание Image
  if (data.images){
    const productImage = new shopify.api.rest.Image({ session: session });
    productImage.product_id = product.id;
    productImage.attachment = String(data.images).split("base64,")[1];
    productImage.position = 1;
  
    await productImage.save({
      update: true,
    });
  }

  res.status(200).send({
    data: "success",
  });
});


app.post("/api/collection/create", async (_req, res) => {
  const session = res.locals.shopify.session;
  
  // console.log("TYPE", typeof JSON.stringify(_req.body));
  // console.log("DATA: ", _req.body);
  const data = JSON.parse(_req.body); 

  const custom_collection = new shopify.api.rest.CustomCollection({session: session});
  custom_collection.title = data.title;

  custom_collection.collects = data.selectedId.map( id => {
    return ({
      "product_id": id,
    })
  });
  
  await custom_collection.save({
    update: true,
  });

  res.status(200).send({
    data: "success",
  });
});


app.use(serveStatic(STATIC_PATH, { index: false }));

app.use("/*", shopify.ensureInstalledOnShop(), async (_req, res, _next) => {
  return res
    .status(200)
    .set("Content-Type", "text/html")
    .send(readFileSync(join(STATIC_PATH, "index.html")));
});

app.listen(PORT);
