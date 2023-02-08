import {DropZone, Stack, Thumbnail, Banner, List} from '@shopify/polaris';
import {useState, useCallback} from 'react';


export default function DropZoneImage(props) {
  //Local state
  const [files, setFiles] = useState([]);
  const [rejectedFiles, setRejectedFiles] = useState([]);
  const hasError = rejectedFiles.length > 0;

  const handleDrop = (_droppedFiles, acceptedFiles, rejectedFiles) => {
    setFiles((files) => [...files, ...acceptedFiles]);
    setRejectedFiles(rejectedFiles);
  };
  files.forEach((file) =>{
    console.log(window.URL.createObjectURL(file))
  } )
  

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
                onDrop={handleDrop} 
                onDropAccepted={() => props.addImage(files)}>
        {uploadedFiles}
        {fileUpload}
      </DropZone>
    </Stack>
  );
}
