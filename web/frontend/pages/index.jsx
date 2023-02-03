import {
  Card,
  Page,
  Layout,
  TextContainer,
  Image,
  Stack,
  Link,
  Heading,
} from "@shopify/polaris";
import { TitleBar } from "@shopify/app-bridge-react";

import { trophyImage } from "../assets";

import { ProductsCard } from "../components";

import {useAuthenticatedFetch} from "../hooks/useAuthenticatedFetch"

export default function HomePage() {
  const fetch = useAuthenticatedFetch();

  let productTitle;
  let productPrice;


  const getProductsCount = async () => {
    const response = await fetch ("/api/products/count", {
      body: {
        title,
        description
      }
    })
    const result = await response.json()
    console.log(result)
  }

  const addProduct = async () => {
    const response = await fetch ("/api/products/addnewproduct")
    const result = await response.json()
    //productTitle = result.title
    //productPrice = result.price
    console.log(result)
  }

  return (
    <Page narrowWidth>
      <Layout>
        <Layout.Section>
          <Card sectioned>
            <button onClick={getProductsCount}>Click me</button>
            <button onClick={addProduct}>Add product</button>
            
          </Card>
        </Layout.Section>
      </Layout>
    </Page>
  );
}
