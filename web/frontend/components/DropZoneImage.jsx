import {DropZone, Stack, Thumbnail, Banner, List} from '@shopify/polaris';
import {useState, useCallback} from 'react';


export default function DropZoneImage({ addImage }) {
  
  //Local state
  const [files, setFiles] = useState([]);
  const [rejectedFiles, setRejectedFiles] = useState([]);
  const hasError = rejectedFiles.length > 0;

  const handleDrop = useCallback(async (_droppedFiles, acceptedFiles, rejectedFiles) => {
    const newFiles = [...files, ...acceptedFiles];
    setFiles(newFiles);
    setRejectedFiles(rejectedFiles);


    // newFiles.forEach( file => {
    //   let reader = new FileReader();
    //   reader.readAsDataURL(file);
    //   reader.onloadend = function () {
    //     reader.result;
    //   }
    // })

    const filePromises = newFiles.map((file) => {
    
      return new Promise((resolve, reject) => {
        const reader = new FileReader();
        reader.readAsDataURL(file);

        reader.onloadend = async () => {
          const result = await reader.result;
          resolve(result)
        }
      })

    // new Promise((resolve, reject) => {
    //   const reader = new FileReader();
    //   reader.onload = (event) => {
        
    //     resolve(event.target.result)
    //   };
    //   let i = reader.readAsDataURL(file);
    //   console.log(resolve(i))
    })
    const convertedImages = await Promise.all(filePromises)
    console.log(convertedImages)
    // {

    //   reader.readAsDataURL(file).result;
    //   console.log('Base64 String - ', base64String);

    // });

    addImage(convertedImages);

  }, [files, rejectedFiles]);

  const fileUpload = !files.length && <DropZone.FileUpload />;
  const uploadedFiles = files.length > 0 && (
    <Stack vertical>
      {files.map((file, index) => (
        <Stack alignment="center" key={index}>
          <Thumbnail
            size="small"
            alt={file.name}
            source={window.URL.createObjectURL(file)}
          />
          {/* <div>
            {file.name}{' '}
            <Text variant="bodySm" as="p">
              {file.size} bytes
            </Text>
          </div> */}
        </Stack>
      ))}
    </Stack>
  );

  const errorMessage = hasError && (
    <Banner
      title="The following images couldn’t be uploaded:"
      status="critical"
    >
      <List type="bullet">
        {rejectedFiles.map((file, index) => (
          <List.Item key={index}>
            {`"${file.name}" is not supported. File type must be .gif, .jpg, .png or .svg.`}
          </List.Item>
        ))}
      </List>
    </Banner>
  );

  return (
    <Stack vertical>
      {errorMessage}
      <DropZone accept="image/*" 
                type="image" 
                onDrop={handleDrop}>
        {uploadedFiles}
        {fileUpload}
      </DropZone>
    </Stack>
  );
}
