import {Card, ResourceList, ResourceItem, Thumbnail, TextContainer, DisplayText} from '@shopify/polaris';

export default function AllProductsList({itemsArray, selectedId, setSelectedId}) {

  const resourceName = {
    singular: 'product',
    plural: 'products',
  };

  const items = itemsArray.map ( item => {
  return {
    id: item.id,
    name: item.title,
    price: item.price,
    source: item.image,
    media: (
        <Thumbnail source= {item.image} />
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
        selectedItems={selectedId}
        onSelectionChange={setSelectedId}
        selectable
      />
    </Card>
  );

  function renderItem(item) {
    const {id, name, price, source} = item;
    const media = <Thumbnail source= {source}
                             alt={name}/>;

    return (
      <ResourceItem
        id={id}
        media={media}
        accessibilityLabel={`View details for ${name}`}
      >
        <DisplayText size="small" >{name}</DisplayText>
        <div>{price}$</div>
      </ResourceItem>
    );
  }
}