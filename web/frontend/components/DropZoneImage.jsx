import {DropZone, Stack, Thumbnail, Banner, List, Button} from '@shopify/polaris';
import {useState, useCallback} from 'react';


export default function DropZoneImage({ files, setFiles, setImagesId }) {
  
  //Local state
  let [rejectedFiles, setRejectedFiles] = useState([]);
  let convertedImages = [];
  let hasError = rejectedFiles.length > 0;


  const remove = () => {
    setFiles([]);
    setRejectedFiles([]);
    hasError = false
    setImagesId([])
  };

  const handleDrop = useCallback(async (_droppedFiles, acceptedFiles, rejectedFiles) => {
    const newFiles = [...files, ...acceptedFiles];
    setFiles(newFiles);
    setRejectedFiles(rejectedFiles);

    const filePromises = newFiles.map((file) => {
    
      return new Promise((resolve, reject) => {
        const reader = new FileReader();
        reader.readAsDataURL(file);

        reader.onloadend = async () => {
          const result = await reader.result;
          resolve(result)
        }
      })
    })
    convertedImages = await Promise.all(filePromises)
    setImagesId(convertedImages);

  }, [files, rejectedFiles]);

  const fileUpload = !files.length && <DropZone.FileUpload />;
  const uploadedFiles = files.length > 0 && (
    <Stack vertical = {false}>
      {files.map((file, index) => (
        <Stack alignment="center" key={index}>
          <Thumbnail
            size="small"
            alt={file.name}
            source={window.URL.createObjectURL(file)}
          />
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
                onDrop={handleDrop}
                allowMultiple = {false}>
        {uploadedFiles}
        {fileUpload}
      </DropZone>
      {files.length > 0 && (
          <Button plain destructive onClick={remove}>Remove images</Button>
        )}
    </Stack>
  );
}

