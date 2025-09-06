﻿/* eslint-disable react-hooks/rules-of-hooks */
import {
  Box,
  Button,
  Flex,
  FormControl,
  FormLabel,
  Input,
  VStack,
  InputGroup,
  InputLeftElement,
  useColorModeValue,
  Divider,
  Select, useToast
} from "@chakra-ui/react";
import { BsPerson, BsEnvelope, BsPhone } from "react-icons/bs";
import { useForm } from "react-hook-form";
import user from "../Controllers/user";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { ADD2 as ADD, GET2 as GET } from "../Controllers/ApiControllers2";
import Loading from "./Loading";
import { useEffect } from "react";
import ProfilePicture from "./ProfilePicture";
import showToast from "../Controllers/ShowToast";
import ErrorPage from "../Pages/ErrorPage";
import { updateUserLocalStorage } from "../Controllers/updateUserLocalStorage";

const getData = async () => {
  const res = await GET(`get_user/${user.id}`);
  console.log(res)
  return res.data;
};

const handleUpdate = async (data) => {
  const res = await ADD(user.token, "update_user", data);
  console.log(res)
  if (res.response !== 200) {
    throw new Error(res.message);
  }
  return res;
};

const UserProfile = () => {
  const queryClient = useQueryClient();
  const {
    data: userData,
    isLoading,
    error,
  } = useQuery({
    queryKey: ["user-details"],
    queryFn: getData,
  });

  const { register, handleSubmit, reset } = useForm();
  const toast = useToast();

  useEffect(() => {
    if (userData) {
      reset({
        f_name: userData.f_name || "",
        l_name: userData.l_name || "",
        email: userData.email || "",
        phone: userData.phone || "",
        gender: userData.gender || "Male",
        dob: userData.dob || "",
        city: userData.city || "",
        state: userData.state || "",
        postal_code: userData.postal_code || "",
        address: userData.address || "",
      });
    }
  }, [userData, reset]);

  const mutation = useMutation({
    mutationFn: async (data) => {
      let formData = {
        ...data,
        id: user.id,
      };
      await handleUpdate(formData);
    },
    onSuccess: () => {
      showToast(toast, "success", "User Details Updated");
      queryClient.invalidateQueries("user");
      updateUserLocalStorage(user.id)
    },
    onError: (error) => {
      showToast(toast, "error", error.message);
    },
  });

  const onSubmit = (data) => {
    mutation.mutate(data);
  };

  if (isLoading) return <Loading />;
  if (error) return <ErrorPage />;



  console.log(userData)
  return (
    <>
      {userData ? (
        <Box
          w={"full"}
          bg={useColorModeValue("white", "gray.800")}
          boxShadow={"xl"}
          rounded={"lg"}
          mt={5}
          borderRadius={8}
          overflow={"hidden"}
        >
          <VStack
            as="form"
            onSubmit={handleSubmit(onSubmit)}
            mt={1}
            spacing={4}
            p={6}
          >
            <ProfilePicture img={userData?.image} />
            <Divider />
            <Flex
              w="full"
              gap={4}
              mt={2}
              flexDir={{ base: "column", md: "row" }}
            >
              <FormControl id="f_name" isRequired>
                <FormLabel>First Name</FormLabel>
                <InputGroup>
                  <InputLeftElement pointerEvents="none">
                    <BsPerson color="gray.800" />
                  </InputLeftElement>
                  <Input
                    type="text"
                    {...register("f_name", { required: true })}
                  />
                </InputGroup>
              </FormControl>

              <FormControl id="l_name" isRequired>
                <FormLabel>Last Name</FormLabel>
                <InputGroup>
                  <InputLeftElement pointerEvents="none">
                    <BsPerson color="gray.800" />
                  </InputLeftElement>
                  <Input
                    type="text"
                    {...register("l_name", { required: true })}
                  />
                </InputGroup>
              </FormControl>
            </Flex>
            <Flex w="full" gap={4} flexDir={{ base: "column", md: "row" }}>
              <FormControl id="phone" isRequired>
                <FormLabel>Phone</FormLabel>
                <InputGroup>
                  <InputLeftElement pointerEvents="none">
                    <BsPhone color="gray.800" />
                  </InputLeftElement>
                  <Input
                    type="tel"
                    isReadOnly
                    {...register("phone", { required: true })}
                  />
                </InputGroup>
              </FormControl>
              <FormControl id="email">
                <FormLabel>Email</FormLabel>
                <InputGroup>
                  <InputLeftElement pointerEvents="none">
                    <BsEnvelope color="gray.800" />
                  </InputLeftElement>
                  <Input
                    type="email"
                    {...register("email", {
                      pattern: {
                        value:
                          /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/,
                        message: "Invalid email address",
                      },
                    })}
                  />
                </InputGroup>
              </FormControl>
            </Flex>

            <Flex w={"full"} gap={4}>
              <FormControl id="gender" isRequired>
                <FormLabel>Gender</FormLabel>
                <Select {...register("gender", { required: true })}>
                  <option value={"Male"}>Male</option>
                  <option value={"Female"}>Female</option>
                </Select>
              </FormControl>
          
            </Flex>

            {/* <Flex w="full" gap={2} flexDir={{ base: "column", md: "row" }}>
              <FormControl id="city">
                <FormLabel>City</FormLabel>
                <Input type="text" {...register("city")} />
              </FormControl>

              <FormControl id="state">
                <FormLabel>State</FormLabel>
                <Input type="text" {...register("state")} />
              </FormControl>
              <FormControl id="postal_code">
                <FormLabel>Postal Code</FormLabel>
                <Input type="text" {...register("postal_code")} />
              </FormControl>
            </Flex>
            <FormControl id="address">
              <FormLabel>Address</FormLabel>
              <Textarea type="text" {...register("address")} />
            </FormControl> */}

            <Button
              size={"sm"}
              type="submit"
              w={"full"}
              bg={"green.500"}
              color={"white"}
              rounded={"md"}
              _hover={{
                bg: "green.600",
              }}
              isLoading={mutation.isPending}
            >
              Update Profile
            </Button>
          </VStack>
        </Box>
      ) : null}
    </>
  );
};

export default UserProfile;
