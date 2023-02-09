import { Card, Page, Layout } from "@shopify/polaris";
import { useAuthenticatedFetch } from "../hooks/useAuthenticatedFetch";
import { useState, useEffect  } from "react";
import AllProductsList  from "../components/AllProductsList";


export default function AddToCollection() {
  
  const fetch = useAuthenticatedFetch();

  const [state, setState] = useState([]);

  useEffect( async () => {
    const response = await fetch ("/api/products.json");
    const result = await response.json();
    setState(result)  
    }, []);

  console.log("Result: ", state);

  
  return (
    <Page narrowWidth>
      <Layout>
        <Layout.Section oneThird>
     
          <Card sectioned title="All products">
          {state != null && (
            <AllProductsList itemsArray= {state}/>
          )}
          </Card>

        </Layout.Section>
        <Layout.Section oneThird>
    
          <Card sectioned title="Collection">
            
          </Card>

        </Layout.Section>
      </Layout>
    </Page>
  );
}
