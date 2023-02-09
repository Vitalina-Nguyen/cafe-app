import {Frame, Navigation} from '@shopify/polaris';
import {HomeMinor, OrdersMinor, ProductsMinor} from '@shopify/polaris-icons';
import React from 'react';


import { useAuthenticatedFetch } from "../hooks/useAuthenticatedFetch";

export default function HomePage() {

  // const getProductsCount = async () => {
  //   const response = await fetch ("/api/products/count"
  //   )
  //   const result = await response.json()
  //   console.log(result)
  // }

  // const addProduct = async () => {
  //   const response = await fetch ("/api/products/addnewproduct")
  //   const result = await response.json()
  //   console.log(result)
  // }

  // const addProduct = async () => {
  //   if (title && description && price) {
  //     const response = await fetch("/api/products/addnewproduct", {
  //       method: "POST",
  //       body: JSON.stringify({
  //         title: title,
  //         description: description,
  //         price: price,
  //         images: files[0],
  //       }),
  //     });
  //     const result = await response.json();
  //     console.log(result);

  //     if (result.data === "success") {
  //       cleanForm();
  //     }
  //   }
  // };

  return (
    <Frame>
      <Navigation location="/">
        <Navigation.Section
          items={[
            {
              url: 'https://teststoreqwertyu.myshopify.com/admin/apps/cafe-app/addproduct',
              label: 'Add new product',
              icon: ProductsMinor,
              matches: false,
            },
            {
              url: 'https://teststoreqwertyu.myshopify.com/admin/apps/cafe-app/addtocollection',
              label: 'Add products to collection',
              icon: OrdersMinor,
              matches: false,
            },
          ]}
        />
      </Navigation>
    </Frame>
  );
}
