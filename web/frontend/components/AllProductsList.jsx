import {Card, ResourceList, ResourceItem, Thumbnail} from '@shopify/polaris';
import {useState} from 'react';

export default function AllProductsList({itemsArray}) {

  const [selectedItems, setSelectedItems] = useState([]);

  const resourceName = {
    singular: 'product',
    plural: 'products',
  };

  console.log("itemsArray= ", itemsArray);
  const items = itemsArray.map ( item => {
  return {
    id: item.id,
    url: `products/${item.name}`,
    name: item.title,
    price: item.price,
    media: (
        <Thumbnail source= {item.url} />
    )
  }
})
  
  console.log("AllProducts items= ", items);




  return (
    <Card>
      <ResourceList
        resourceName={resourceName}
        items={items}
        renderItem={renderItem}
        selectedItems={selectedItems}
        onSelectionChange={setSelectedItems}
        selectable
      />
    </Card>
  );

  function renderItem(item) {
    const {id, name} = item;
    const media = <Thumbnail source= {url}
                             alt={name}/>;

    return (
      <ResourceItem
        id={id}
        media={media}
        accessibilityLabel={`View details for ${name}`}
      >
        <TextContainer variant="bodyMd" fontWeight="bold" as="h3">
          {name}
        </TextContainer>

        <div>{price}</div>
      </ResourceItem>
    );
  }
}

// <Text variant="bodyMd" fontWeight="bold" as="h3">
//           {name}
//         </Text>