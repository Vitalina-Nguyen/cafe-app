import {
  Card,
  Page,
  Layout,
  Form,
  FormLayout,
  TextField,
  Frame,
} from "@shopify/polaris";

import { useState, useCallback } from "react";
import ErrorToast from "../components/ErrorToast";
import DropZoneImage from "../components/DropZoneImage"

import { useAuthenticatedFetch } from "../hooks/useAuthenticatedFetch";

export default function HomePage() {

  const cleanForm = () => {
    setTitle('')
    setDescription('')
    setPrice('')
  }

  const fetch = useAuthenticatedFetch();


  //---------------------STATE-------------------------
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [price, setPrice] = useState("");

  const [files, setFiles] = useState([]);


  //Изменяет state загруженных картинок 

  const addImage = (files) => {
    setFiles(files);
  }

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
    if (title && description && price) {
      const response = await fetch("/api/products/addnewproduct", {
        method: "POST",
        body: JSON.stringify({
          title: title,
          description: description,
          price: price,
          image: files,
        }),
      });
      const result = await response.json();
      console.log(result)

      if (result.data === "success") {
        cleanForm();
      }
    }
  };

  return (
    <Page narrowWidth>
      <Layout>
        <Layout.Section>
          <Card sectioned>
            <Frame>
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

                  <TextField
                    value={price}
                    onChange={setPrice}
                    label="Price"
                    type="text"
                  />

                  <DropZoneImage addImage= {addImage}/>

                  <ErrorToast
                    title={title}
                    description={description}
                    price={price}
                  />
                </FormLayout>
              </Form>
            </Frame>
          </Card>
        </Layout.Section>
      </Layout>
    </Page>
  );
}

