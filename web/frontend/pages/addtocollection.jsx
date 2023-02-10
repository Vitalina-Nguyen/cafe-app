import { Card, Page, Layout, TextField, Button, Spinner } from "@shopify/polaris";
import { useAuthenticatedFetch } from "../hooks/useAuthenticatedFetch";
import { useState, useEffect, useCallback  } from "react";

import AllProductsList  from "../components/AllProductsList";

import s from '../scss/addtocollection.scss'


export default function AddToCollection() {

  const fetch = useAuthenticatedFetch();

  const [state, setState] = useState([]);
  const [inputText, setinputText] = useState('');
  const [selectedId, setSelectedId] = useState([]);

  useEffect( async () => {
    const response = await fetch ("/api/products/all");
    const result = await response.json();
    setState(result)  
    }, []);

  const setInputState = useCallback((newValue) => setinputText(newValue), []);

  console.log("SelectedId: ", selectedId);
  console.log("Input: ", inputText);

  const addCollection = async () => {
    if (selectedId && inputText) {

      console.log("FOR BODY: ",JSON.stringify({
        title: inputText,
        selectedId: selectedId
      }))

      const response = await fetch("/api/collection/create", {
        method: "POST",
        body: JSON.stringify({
          title: inputText,
          selectedId: selectedId
        }),
      });
      
      const result = await response.json();
      console.log(result);
      if (result.data === 'success') {
        setinputText('');
        setSelectedId([]);
      }
    }
  };

  return (
    <Page narrowWidth>
      {state.length > 0 && (
        <Layout>
          <Layout.Section oneThird>
      
            <Card sectioned title="All products">
            {state != null && (
              <AllProductsList itemsArray= {state} selectedId = {selectedId} setSelectedId= {setSelectedId}/>
            )}
            </Card>

          </Layout.Section>
        <Layout.Section oneThird>
      
            <Card sectioned title="Collection">
              <TextField
                label="Add a new collection"
                value={inputText}
                onChange={setInputState}
                autoComplete="off"
              />
              <Button  primary onClick={addCollection}>Save collection</Button>
            </Card>

          </Layout.Section>
        </Layout>
      )}
      {state.length == 0 && (
      <Spinner accessibilityLabel="Loading" size="large" />
      )};
    </Page>
  );
}
