import {
  Box,
  Heading,
  Text,
  SimpleGrid,
  GridItem,
  FormControl,
  FormLabel,
  Input,
  Textarea,
  Button,
  Icon,
} from "@chakra-ui/react";
import { BiLocationPlus } from "react-icons/bi";
import { FaEnvelope } from "react-icons/fa";
import { IoMdCall } from "react-icons/io";
import useSettingsData from "../Hooks/SettingData";

export default function ContactUs() {
  const { settingsData } = useSettingsData();
  const phone1 = settingsData?.find((value) => value.id_name === "phone");
  const phone2 = settingsData?.find(
    (value) => value.id_name === "phone_second"
  );
  const email = settingsData?.find((value) => value.id_name === "email");
  const address = settingsData?.find((value) => value.id_name === "address");
  const latitude = settingsData?.find(
    (value) => value.id_name === "clinic_location_latitude"
  );
  const longitude = settingsData?.find(
    (value) => value.id_name === "clinic_location_longitude"
  );

  return (
    <Box>
      {" "}
      <Box bg={"primary.main"} p={4} py={{ base: "4", md: "20" }}>
        <Box className="container">
          <Text
            fontFamily={"Quicksand, sans-serif"}
            fontSize={{ base: 20, md: 32 }}
            fontWeight={700}
            textAlign={"center"}
            mt={0}
            color={"#fff"}
          >
            Contact Us
          </Text>

          <Text
            fontFamily={"Quicksand, sans-serif"}
            fontSize={{ base: 12, md: 16 }}
            fontWeight={500}
            textAlign={"center"}
            mt={0}
            color={"#fff"}
          >
            We are here to assist you with any inquiries or support. Feel free
            to contact us, and we will get back to you as soon as possible.
          </Text>
        </Box>
      </Box>{" "}
      <Box p={8} maxW="1200px" mx="auto">
        <SimpleGrid columns={{ base: 1, md: 3 }} spacing={6} mb={8}>
          <Box
            p={6}
            boxShadow="md"
            borderRadius="md"
            textAlign="center"
            bg="white"
          >
            <Icon as={BiLocationPlus} boxSize={8} mb={4} color="blue.500" />
            <Heading as="h3" size="md" mb={2}>
              Address
            </Heading>
            <Text>{address.value}</Text>
          </Box>

          <Box
            p={6}
            boxShadow="md"
            borderRadius="md"
            textAlign="center"
            bg="white"
          >
            <Icon as={IoMdCall} boxSize={8} mb={4} color="blue.500" />
            <Heading as="h3" size="md" mb={2}>
              Call Us
            </Heading>
            <Text>{phone1.value}</Text>
            <Text>{phone2.value}</Text>
          </Box>

          <Box
            p={6}
            boxShadow="md"
            borderRadius="md"
            textAlign="center"
            bg="white"
          >
            <Icon as={FaEnvelope} boxSize={8} mb={4} color="blue.500" />
            <Heading as="h3" size="md" mb={2}>
              Email Us
            </Heading>
            <Text>{email.value}</Text>
          </Box>
        </SimpleGrid>

        <SimpleGrid columns={{ base: 1, md: 2 }} spacing={6}>
          <GridItem>
            <Box
              as="iframe"
              src={`https://www.google.com/maps?q=${latitude.value},${longitude.value}&hl=es;z=14&output=embed`}
              width="100%"
              height="400"
              frameBorder="0"
              style={{ border: 0 }}
              allowFullScreen=""
              aria-hidden="false"
              tabIndex="0"
            />
          </GridItem>
          <GridItem>
            <Box p={6} boxShadow="md" borderRadius="md" bg="white">
              <SimpleGrid columns={2} spacing={4}>
                <FormControl>
                  <FormLabel>Your Name</FormLabel>
                  <Input type="text" placeholder="Your Name" />
                </FormControl>
                <FormControl>
                  <FormLabel>Your Email</FormLabel>
                  <Input type="email" placeholder="Your Email" />
                </FormControl>
              </SimpleGrid>
              <FormControl mt={4}>
                <FormLabel>Subject</FormLabel>
                <Input type="text" placeholder="Subject" />
              </FormControl>
              <FormControl mt={4}>
                <FormLabel>Message</FormLabel>
                <Textarea placeholder="Message" />
              </FormControl>
              <Button colorScheme="blue" mt={4} width="full">
                Send Message
              </Button>
            </Box>
          </GridItem>
        </SimpleGrid>
      </Box>
    </Box>
  );
}
