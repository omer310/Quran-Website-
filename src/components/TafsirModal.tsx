import React, { useState, useEffect } from 'react';
import {
  Modal,
  ModalOverlay,
  ModalContent,
  ModalHeader,
  ModalFooter,
  ModalBody,
  ModalCloseButton,
  Button,
  Text,
  Spinner,
  Select,
} from '@chakra-ui/react';
import axios from 'axios';

interface TafsirModalProps {
  isOpen: boolean;
  onClose: () => void;
  surahNumber: number;
  verseNumber: number;
}

interface Tafseer {
  id: number;
  name: string;
  language: string;
  author: string;
}

const TafsirModal: React.FC<TafsirModalProps> = ({ isOpen, onClose, surahNumber, verseNumber }) => {
  const [tafseerList, setTafseerList] = useState<Tafseer[]>([]);
  const [selectedTafseer, setSelectedTafseer] = useState<number | null>(null);
  const [tafseerText, setTafseerText] = useState<string>('');
  const [loading, setLoading] = useState<boolean>(false);

  useEffect(() => {
    fetchTafseerList();
  }, []);

  const fetchTafseerList = async () => {
    try {
      const response = await axios.get('http://api.quran-tafseer.com/tafseer');
      setTafseerList(response.data);
      if (response.data.length > 0) {
        setSelectedTafseer(response.data[0].id);
      }
    } catch (error) {
      console.error('Error fetching tafseer list:', error);
    }
  };

  const fetchTafseer = async () => {
    if (!selectedTafseer) return;

    setLoading(true);
    try {
      const response = await axios.get(`http://api.quran-tafseer.com/tafseer/${selectedTafseer}/${surahNumber}/${verseNumber}`);
      setTafseerText(response.data.text);
    } catch (error) {
      console.error('Error fetching tafseer:', error);
      setTafseerText('Failed to load tafseer. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (isOpen && selectedTafseer) {
      fetchTafseer();
    }
  }, [isOpen, selectedTafseer, surahNumber, verseNumber]);

  return (
    <Modal isOpen={isOpen} onClose={onClose} size="xl">
      <ModalOverlay />
      <ModalContent>
        <ModalHeader>Tafsir</ModalHeader>
        <ModalCloseButton />
        <ModalBody>
          <Select
            value={selectedTafseer || ''}
            onChange={(e) => setSelectedTafseer(Number(e.target.value))}
            mb={4}
          >
            {tafseerList.map((tafseer) => (
              <option key={tafseer.id} value={tafseer.id}>
                {tafseer.name} - {tafseer.author}
              </option>
            ))}
          </Select>
          {loading ? (
            <Spinner size="xl" />
          ) : (
            <Text>{tafseerText}</Text>
          )}
        </ModalBody>
        <ModalFooter>
          <Button colorScheme="blue" mr={3} onClick={onClose}>
            Close
          </Button>
        </ModalFooter>
      </ModalContent>
    </Modal>
  );
};

export default TafsirModal;
