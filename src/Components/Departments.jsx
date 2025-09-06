/* eslint-disable react-hooks/rules-of-hooks */
import { useQuery } from "@tanstack/react-query";
import { GET2 as GET } from "../Controllers/ApiControllers2";
import {
  Box,
  Flex,
  Grid,
  GridItem,
  Heading,
  Image,
  Skeleton,
  Text,
} from "@chakra-ui/react";
import imageBaseURL from "./../Controllers/image";
import "swiper/css";
import { Link } from "react-router-dom";
import ErrorPage from "../Pages/ErrorPage";
  //  const response = await fetch("https://clinicmanagement.techashna.com/api/v1/get_department_active");

export default function Departments() {
  const getData = async () => {
    
    const res = await GET("get_department");
    return res.data;
  };
// const getData = async () => {
//   try {
//     //const res = await fetch('https://clinicmanagement.techashna.com/api/v1/get_department_active', {
//     const res = await fetch('https://localhost:44324/api/v1/get_department_active', {
//       method: 'GET',
//       headers: {
//         'Content-Type': 'application/json',
//       },
//     });

//     if (!res.ok) {
//       throw new Error(`HTTP error! status: ${res.status}`);
//     }

//     const json = await res.json();
//     return json.data; // Return the 'data' array from the response
//   } catch (error) {
//     console.error('Error fetching data:', error);
//     throw error; // Re-throw the error for the caller to handle
//   }
// };
  const { isLoading, data, error } = useQuery({
    queryKey: ["departments"],
    queryFn: getData,
  });

 
  if(error ) return <ErrorPage />

  return (
    <Box mt={5} className="container">
      {data ? (
        <>
          <Heading color={"primary.text"} fontWeight={600} textAlign={"center"}>
            Departments
          </Heading>
          <Text
            fontSize={14}
            textAlign={"center"}
            mt={2}
            color={"gray.500"}
            fontWeight={500}
          >
            Experience the ease of finding everything you need under one roof
            with our comprehensive departmental offerings.
          </Text>
          <Box mt={4}>
            <Grid
              templateColumns={{
                base: "repeat(2, 1fr)",
                md: "repeat(4, 1fr)",
                lg: "repeat(5, 1fr)",
              }}
              gap={6}
            >
              {data?.map((item) => (
                <GridItem
                  key={item.id}
                  backgroundColor={"gray.100"}
                  borderRadius={10}
                  cursor={"pointer"}
                  _hover={{
                    backgroundColor: "primary.bg",
                    color: "#fff",
                  }}
                  // as={Link}
                  as={Link}
                  to={`/department/${item.title}/${item.id}`}
                >
                  <Flex
                    flexDir={"column"}
                    align={"center"}
                    cursor={"pointer"}
                    padding={5}
                    justify={"center"}
                  >
                    <Box
                      overflow={"hidden"}
                      h={"80px"}
                      w={"80px"}
                      borderRadius={item.image ? "10%" : "0"}
                    >
                      {" "}
                      <Image
                        src={
                          item.image
                            ? `${item.image}`
                            : "imagePlaceholder.png"
                        }
                        w={{ base: "80px", md: "80px" }}
                        lazy
                      />
                    </Box>
                    <Text
                      mt={2}
                      fontSize={{ base: "15px", md: "16px", lg: "16px" }}
                      fontWeight={600}
                    >
                      {item.title}
                    </Text>
                  </Flex>
                </GridItem>
              ))}
            </Grid>
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
            Can&apos;t Fetch Departments!
          </Text>
        </>
      ) : null}
    </Box>
  );
}
