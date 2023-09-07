import { useState } from 'react';
import axios from 'axios';
import { Input, Button, Box, Heading, Text, Spinner, Flex, VStack, useToast } from '@chakra-ui/react';

const FileUpload = () => {
  const [selectedFile, setSelectedFile] = useState(null);
  const [question, setQuestion] = useState('');
  const [responses, setResponses] = useState([]);
  const [uploadLoading, setUploadLoading] = useState(false);
  const [searchLoading, setSearchLoading] = useState(false);
  const [isFileSelected, setIsFileSelected] = useState(false);
  const toast = useToast();

  const handleFileChange = (e: any) => {
    setSelectedFile(e.target.files[0]);
    setIsFileSelected(!!e.target.files[0]);
  };

  const handleUpload = async () => {
    if (!selectedFile) return;

    const formData = new FormData();
    formData.append('file', selectedFile);

    try {
      setUploadLoading(true);
      await axios.post('/api/testupload/embedding', formData, {
        headers: {
          'Content-Type': 'multipart/form-data',
        },
      });
      console.log('File uploaded successfully');
      toast({
        title: 'Upload Successful',
        status: 'success',
        duration: 3000,
        isClosable: true,
        position: 'top-right',
      });
      setSelectedFile(null);
      setIsFileSelected(false);
    } catch (error) {
      console.error('Error uploading file:', error);
      toast({
        title: 'Upload Error',
        description: 'An error occurred while uploading the file.',
        status: 'error',
        duration: 3000,
        isClosable: true,
        position: 'top-right',
      });
    } finally {
      setUploadLoading(false);
    }
  };

  const handleSearch = async () => {
    console.log(question, 'the query here');

    try {
      setSearchLoading(true);
      const requestBody = { query: question };
      const response = await axios.post('/api/testupload/search', requestBody);
      console.log(response, 'the response haha');
      setResponses([response?.data?.data, ...responses]);
    } catch (error) {
      console.log('error:', error);
    } finally {
      setSearchLoading(false);
    }
  };

  const clearResponses = () => {
    setResponses([]);
    setQuestion('');
  };

  return (
    <Box p="4" maxH="full">
      <Input type="file" accept=".pdf,.txt,.doc,.docx" onChange={handleFileChange} p={1} width="md" />

      <Button
        colorScheme="cyan"
        onClick={handleUpload}
        isLoading={uploadLoading}
        loadingText="Uploading..."
        isDisabled={!isFileSelected}
        ml={3}
      >
        {uploadLoading ? 'Uploading...' : 'Upload File'}
      </Button>
      <Box mt="4" border="1px" borderColor="gray.600" borderStyle="dashed" minH={300} p="4" borderRadius="md">
        <Heading size="md">Search</Heading>
        <Flex justifyContent="space-between">
          <Input
            mt="2"
            mr={2}
            variant="outline"
            width="90%"
            value={question}
            onChange={(e) => setQuestion(e.target.value)}
          />
          <Button
            mt="2"
            colorScheme="cyan"
            size="md"
            onClick={handleSearch}
            isLoading={searchLoading}
            loadingText="Searching..."
          >
            {searchLoading ? 'Searching...' : 'Search'}
          </Button>
        </Flex>

        <VStack
          mt="4"
          width="full"
          height="auto"
          overflow="auto"
          spacing="2"
          border="2px"
          borderColor="gray.600"
          p={2}
          borderRadius="lg"
        >
          {responses.reverse().map((response, index) => (
            <Box
              key={index}
              p="2"
              borderRadius="8px"
              bg="gray.200"
              textColor="black"
              alignSelf={response ? 'flex-end' : 'flex-start'}
            >
              <Text>{response}</Text>
            </Box>
          ))}
        </VStack>
        <Button mt="4" colorScheme="red" onClick={clearResponses} isDisabled={responses.length === 0}>
          Clear
        </Button>
      </Box>
    </Box>
  );
};

export default FileUpload;
