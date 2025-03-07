﻿/* eslint-disable react/no-children-prop */
/* eslint-disable react-hooks/rules-of-hooks */
import { useQuery } from "@tanstack/react-query";
import { GET2 as GET } from "../Controllers/ApiControllers2";
import {
  Box,
  Flex,
  Image,
  Skeleton,
  Text,
  Grid,
  GridItem,
  Divider,
  IconButton,
  HStack,
  Alert,
  AlertIcon,
  AlertTitle,
  InputGroup,
  InputLeftElement,
  Input,
} from "@chakra-ui/react";
import imageBaseURL from "./../Controllers/image";
import "swiper/css";
import "swiper/css/pagination";
import Loading from "../Components/Loading";
import RatingStars from "../Hooks/RatingStars";
import {
  FaInstagram,
  FaFacebook,
  FaTwitter,
  FaYoutube,
  FaUserAlt,
} from "react-icons/fa";
import { Link } from "react-router-dom";
import ErrorPage from "./ErrorPage";
import { useState } from "react";
import { SearchIcon } from "@chakra-ui/icons";

export default function Doctors() {
  const getData = async () => {
    const res = await GET("get_doctor");
    return res.data;
  };
  const { isLoading, data, error } = useQuery({
    queryKey: ["Doctors"],
    queryFn: getData,
  });

  const [searchTerm, setSearchTerm] = useState("");

  const filteredDoctors = data?.filter(
    (doctor) =>
      doctor.f_name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      doctor.l_name.toLowerCase().includes(searchTerm.toLowerCase())
  );

  if (isLoading) return <Loading />;
  if (error) return <ErrorPage />;

  return (
    <Box>
      <Box bg={"primary.main"} p={4} py={{ base: "4", md: "20" }}>
        <Box className="container">
          <Text
            fontFamily={"Quicksand, sans-serif"}
            fontSize={{ base: 32, md: 48 }}
            fontWeight={700}
            textAlign={"center"}
            mt={0}
            color={"#fff"}
          >
            Our Doctors
          </Text>

          <Text
            fontFamily={"Quicksand, sans-serif"}
            fontSize={{ base: 22, md: 32 }}
            fontWeight={700}
            textAlign={"center"}
            mt={0}
            color={"#fff"}
          >
            Explore a Multifaceted Team of <br />
            <Text as={"span"} color={"green.text"} fontWeight={800}>
              Healthcare Specialists
            </Text>
          </Text>
        </Box>
      </Box>{" "}
      <Box
        mt={{ base: 0, md: 0 }}
        className="container"
        pt={5}
        position={"relative"}
      >
        {data ? (
          <>
            {" "}
            <Text
              fontSize={16}
              textAlign={"center"}
              mt={2}
              color={"gray.500"}
              fontWeight={500}
            >
              Experience the ease of finding the right medical <br /> expert for
              your needs with our comprehensive selection of doctors.
            </Text>
            <Box>
              <Flex justifyContent={"center"} w={"100%"}>
                {" "}
                <InputGroup mb={4} mt={3} maxW={"fit-content"}>
                  <InputLeftElement
                    pointerEvents="none"
                    children={<SearchIcon />}
                  />
                  <Input
                    placeholder="Search doctors..."
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    variant="outline"
                    w={500}
                    maxW={"95vw"}
                    bg={"#fff"}
                  />
                </InputGroup>
              </Flex>
              <Box mt={4}>
                <Grid
                  templateColumns={{
                    base: "repeat(1, 1fr)",
                    md: "repeat(2, 1fr)",
                    lg: "repeat(3, 1fr)",
                  }}
                  gap={6}
                >
                  {filteredDoctors?.map((item) => (
                    <GridItem
                      key={item.id}
                      backgroundColor={"#FFF"}
                      borderRadius={10}
                      cursor={"pointer"}
                      boxShadow={"2px 2px 20px 0 rgb(82 66 47 / 12%)"}
                      _hover={{ border: "1px solid #0032ff" }}
                      transition={"border 0.1s ease"}
                      border={"1px solid #fff"}
                      as={Link}
                      to={`/doctor/${item.id}`}
                    >
                      <Box cursor={"pointer"} padding={5}>
                        {" "}
                        <Flex gap={5} align={"center"}>
                          <Box
                            overflow={"hidden"}
                            h={"90px"}
                            w={"90px"}
                            borderRadius={item.image ? "10%" : "0"}
                            borderTopRadius={"50%"}
                            border={"8px solid #fff"}
                          >
                            {" "}
                            <Image
                              src={item.image ? `${item.image}` : "user.png"}
                              w={{ base: "80px", md: "80px" }}
                            />
                          </Box>
                          <Box>
                            {" "}
                            <Text mt={5} fontSize={15} fontWeight={500} m={0}>
                              {item.f_name} {item.l_name}
                            </Text>
                            <Text
                              mt={"2px"}
                              fontSize={{
                                base: "14px",
                                md: "14px",
                                lg: "14px",
                              }}
                              fontWeight={600}
                              m={0}
                              color={"primary.text"}
                              fontFamily={"Quicksand, sans-serif"}
                            >
                              {item.department_name}
                            </Text>
                            <Text
                              mt={"2px"}
                              fontSize={{
                                base: "12px",
                                md: "13px",
                                lg: "13px",
                              }}
                              m={0}
                              color={"primary.text"}
                              fontWeight={600}
                              fontFamily={"Quicksand, sans-serif"}
                            >
                              {item.specialization}
                            </Text>
                          </Box>
                        </Flex>
                        <Divider my={2} />
                        <Flex justify={"space-between"}>
                          <Text
                            fontSize={12}
                            fontFamily={"Quicksand, sans-serif"}
                            fontWeight={600}
                            color={"gray.500"}
                          >
                            Total Rating
                            <Text
                              as={"span"}
                              display={"flex"}
                              gap={1}
                              alignItems={"center"}
                            >
                              <RatingStars rating={item.average_rating} />{" "}
                              <Text as={"span"} mb={0} color={"#000"}>
                                {parseFloat(item.average_rating).toFixed(1)} (
                                {item.number_of_reviews})
                              </Text>
                            </Text>
                          </Text>
                          <Text
                            fontSize={12}
                            fontFamily={"Quicksand, sans-serif"}
                            fontWeight={600}
                            color={"gray.500"}
                          >
                            Total Experience
                            <Text
                              as={"span"}
                              display={"flex"}
                              gap={1}
                              alignItems={"center"}
                              fontSize={14}
                              color={"#000"}
                              fontWeight={700}
                            >
                              {item.ex_year}+ Years
                            </Text>
                          </Text>
                        </Flex>
                        <Flex justify={"space-between"} mt={1}>
                          <Text
                            fontSize={12}
                            fontFamily={"Quicksand, sans-serif"}
                            fontWeight={600}
                            color={"gray.500"}
                            display={"flex"}
                            align={"center"}
                            gap={2}
                          >
                            <FaUserAlt fontSize={12} />{" "}
                            <Text mt={-0.5}>
                              {item.total_appointment_done} Appointments Done
                            </Text>
                          </Text>
                        </Flex>
                        {item?.stop_booking === 1 && (
                          <Alert
                            status="error"
                            size={"xs"}
                            py={1}
                            px={1}
                            mt={4}
                          >
                            <AlertIcon />
                            <AlertTitle fontSize={"xs"}>
                              {" "}
                              Currently Not Accepting Appointments
                            </AlertTitle>
                          </Alert>
                        )}
                        <Divider my={2} />
                        <HStack spacing={2}>
                          <IconButton
                            as="a"
                            href={item.insta_link}
                            target="_blank"
                            rel="noopener noreferrer"
                            aria-label="Instagram"
                            icon={<FaInstagram />}
                            variant="ghost"
                            colorScheme="pink"
                            onClick={(e) => e.stopPropagation()}
                          />{" "}
                          <IconButton
                            as="a"
                            href={item.fb_linik}
                            target="_blank"
                            rel="noopener noreferrer"
                            aria-label="Facebook"
                            icon={<FaFacebook />}
                            variant="ghost"
                            colorScheme="facebook"
                            onClick={(e) => e.stopPropagation()}
                          />
                          <IconButton
                            as="a"
                            href={item.twitter_link}
                            target="_blank"
                            rel="noopener noreferrer"
                            aria-label="Twitter"
                            icon={<FaTwitter />}
                            variant="ghost"
                            colorScheme="twitter"
                            onClick={(e) => e.stopPropagation()}
                          />{" "}
                          <IconButton
                            as="a"
                            href={item.you_tube_link}
                            target="_blank"
                            rel="noopener noreferrer"
                            aria-label="YouTube"
                            icon={<FaYoutube />}
                            variant="ghost"
                            colorScheme="red"
                            onClick={(e) => e.stopPropagation()}
                          />
                        </HStack>
                      </Box>
                    </GridItem>
                  ))}
                </Grid>
              </Box>
            </Box>
          </>
        ) : null}
        {isLoading ? (
          <>
            {" "}
            <Skeleton h={"100px"} w={"100%"} mt={5} />
          </>
        ) : null}
        {error ? (
          <>
            {" "}
            <Text
              fontSize={{ base: 12, md: 14 }}
              fontWeight={400}
              color={"red"}
              textAlign={"center"}
            >
              Something Went wrong!
            </Text>
            <Text
              fontSize={{ base: 12, md: 14 }}
              fontWeight={400}
              color={"red"}
              textAlign={"center"}
            >
              Cant Fetch Doctors!
            </Text>
          </>
        ) : null}
      </Box>
    </Box>
  );
}
