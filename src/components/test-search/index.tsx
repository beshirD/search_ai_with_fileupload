import React, { useState, useRef, useEffect } from 'react';
import axios from 'axios';
import {
  Input,
  Kbd,
  Modal as ChakraModal,
  ModalOverlay,
  ModalContent,
  ModalBody,
  ModalCloseButton,
  useDisclosure,
  Button,
  Text,
} from '@chakra-ui/react';

const Search = () => {
  const { isOpen, onOpen, onClose } = useDisclosure();
  const [question, setQuestion] = useState('');
  const [answer, setAnswer] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const inputRef = useRef(null);

  useEffect(() => {
    if (inputRef.current) {
      inputRef.current.value = question;
    }
  }, [question]);

  const answerQuestion = async () => {
    setIsLoading(true);
    try {
      const reqeustBody = { query: question };
      const response = await axios.post('/api/testupload/search', reqeustBody);
      console.log(response, "the reponse haha");
      setAnswer(response?.data?.data);
    } catch (error) {
      console.log("error:", error);
    }finally{
      setIsLoading(false);
    }
  };

  return (
    <>
      <div className="nextra-search nx-relative md:nx-w-64 nx-hidden md:nx-inline-block mx-min-w-[200px]">
        <div className="nx-relative nx-flex nx-items-center nx-text-gray-900 contrast-more:nx-text-gray-800 dark:nx-text-gray-300 contrast-more:dark:nx-text-gray-300">
          <Input
            spellCheck="false"
            className="nx-block nx-w-full nx-appearance-none nx-rounded-lg nx-px-3 nx-py-2 nx-transition-colors nx-text-base nx-leading-tight md:nx-text-sm nx-bg-black/[.05] dark:nx-bg-gray-50/10 focus:nx-bg-white dark:focus:nx-bg-dark placeholder:nx-text-gray-500 dark:placeholder:nx-text-gray-400 contrast-more:nx-border contrast-more:nx-border-current"
            type="search"
            placeholder="Search documentation…"
            onClick={onOpen}
            ref={inputRef}
          />
          {/* <Kbd className="nx-absolute nx-my-1.5 nx-select-none ltr:nx-right-1.5 rtl:nx-left-1.5 nx-h-5 nx-rounded nx-bg-white nx-px-1.5 nx-font-mono nx-text-[10px] nx-font-medium nx-text-gray-500 nx-border dark:nx-border-gray-100/20 dark:nx-bg-dark/50 contrast-more:nx-border-current contrast-more:nx-text-current contrast-more:dark:nx-border-current nx-items-center nx-gap-1 nx-pointer-events-none nx-hidden sm:nx-flex nx-opacity-100">
            CTRL K
          </Kbd> */}
        </div>
      </div>
      <ChakraModal isOpen={isOpen} onClose={onClose}>
        <ModalOverlay />
        <ModalContent>
          <ModalCloseButton />
          <ModalBody>
            <div style={{display:"flex"}}>

            <Input
              spellCheck="false"
              className="nx-block nx-w-full nx-appearance-none nx-rounded-lg nx-px-3 nx-py-2 nx-transition-colors nx-text-base nx-leading-tight md:nx-text-sm nx-bg-black/[.05] dark:nx-bg-gray-50/10 focus:nx-bg-white dark:focus:nx-bg-dark placeholder:nx-text-gray-500 dark:placeholder:nx-text-gray-400 contrast-more:nx-border contrast-more:nx-border-current"
              type="search"
              placeholder="Search documentation…"
              value={question}
              onChange={(e) => setQuestion(e.target.value)}
              />
            <Button style={{marginLeft:"10px"}} disabled={isLoading} onClick={answerQuestion}>Ask</Button>
              </div>
            <Text mt={6}>
              {isLoading ? 'Loading...' : answer}
            </Text>
          </ModalBody>
        </ModalContent>
      </ChakraModal>
    </>
  );
};

export { Search };
