import {
  Card,
  Page,
  Layout,
  Form, 
  FormLayout, 
  TextField, 
  Button,
  Toast
} from "@shopify/polaris";

import {useState, useCallback} from 'react';

import {useAuthenticatedFetch} from "../hooks/useAuthenticatedFetch"


export default function HomePage() {

  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');

  const fetch = useAuthenticatedFetch();

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


  const addProduct = async () => {
    if(title && description){
      const response = await fetch ("/api/products/addnewproduct", {
        method: "POST",
        body: JSON.stringify({
          title: title,
          description: description
        })
      })
      const result = await response.json()
    } 

  }

  return (
    <Page narrowWidth>
      <Layout>
        <Layout.Section>
          <Card sectioned>

            <Form onSubmit={addProduct}>
              <FormLayout>

                <TextField
                  value={title}
                  onChange={setTitle}
                  label="Title"
                  type="text"
                />

                <TextField
                  value={description}
                  onChange={setDescription}
                  label="Description"
                  type="text"
                />

                <Button submit>Submit</Button>
       
              </FormLayout>
            </Form>
            
          </Card>
        </Layout.Section>
      </Layout>
    </Page>
  );
}
