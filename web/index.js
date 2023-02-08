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

// app.get("/api/products/addnewproduct", async (_req, res) => {
//   const product = new shopify.api.rest.Product({session: res.locals.shopify.session});
//   product.title = "Coffee 1"
//   product.description = "3.5"

//   const newProduct = await product.save({
//     update: true,
//   });
//   res.status(200).send({
//     data: 'success'
//   });
// });

app.post("/api/products/addnewproduct", async (_req, res) => {

  const session = res.locals.shopify.session;
  const data = JSON.parse(_req.body);

  const product = new shopify.api.rest.Product({
    session: session,
  });

  product.title = data.title;
  product.body_html = data.description;

  await product.save({
    update: true,
  });

  //Создание Product Variant
  const variant = new shopify.api.rest.Variant({session: session});
  if (product.variants){
    variant.id = product.variants[0].id;
    variant.price = data.price;
    variant.position = 2;
    await variant.save({
      update: true,
    });
  }

  //Создание Image

  // const productImage = new shopify.api.rest.Image({session: session});

  // data.images.forEach((image) => {
  //   productImage.src = window.URL.createObjectURL(image);

  //   product.images?.push(productImage);
  // })

  // await productImage.save({
  //   update: true,
  // });


  // const productImage = new shopify.api.rest.Image({session: session});

  // productImage.src = window.URL.createObjectURL(data.images[0]);

  // if (product.images) {
  //   product.images[0].push(productImage);
  // }

  // await productImage.save({
  //   update: true,
  // });

  
  res.status(200).send({
    data: "success",
  });
});


//Сохранить продукт без цены
//Создать новый variant https://shopify.dev/api/admin-rest/2023-01/resources/product-variant#post-products-product-id-variants
//Добавить цену в вариант через id созданного продукта


// app.get("/api/products/create", async (_req, res) => {
//   let status = 200;
//   let error = null;

//   try {
//     await productCreator(res.locals.shopify.session);
//   } catch (e) {
//     console.log(`Failed to process products/create: ${e.message}`);
//     status = 500;
//     error = e.message;
//   }
//   res.status(status).send({ success: status === 200, error });
// });

app.use(serveStatic(STATIC_PATH, { index: false }));

app.use("/*", shopify.ensureInstalledOnShop(), async (_req, res, _next) => {
  return res
    .status(200)
    .set("Content-Type", "text/html")
    .send(readFileSync(join(STATIC_PATH, "index.html")));
});

app.listen(PORT);
