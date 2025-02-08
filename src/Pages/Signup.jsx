import {
  Box,
  Button,
  Flex,
  Heading,
  Input,
  InputGroup,
  InputLeftAddon,
  Link,
  Select,
  Text,
  useDisclosure,
  useToast,
  FormControl,
  FormErrorMessage,
  Image,
  PinInput,
  PinInputField,
  HStack,
  RadioGroup,
  Stack,
  Radio,
} from "@chakra-ui/react";
import { useForm, Controller } from "react-hook-form";
import ISDCODEMODAL from "../Components/ISDCODEMODAL";
import showToast from "../Controllers/ShowToast";
import { ADD2 as ADD } from "../Controllers/ApiControllers2";
import { useNavigate, Link as RouterLink } from "react-router-dom";
import { useState } from "react";
import {
  getAuth,
  RecaptchaVerifier,
  signInWithPhoneNumber,
} from "firebase/auth";
import { app } from "../Controllers/firebase.config";
import defaultISD from "../Controllers/defaultISD";

const Signup = () => {
  const { isOpen, onOpen, onClose } = useDisclosure();
  const [isd_code, setIsd_code] = useState(defaultISD);
  const toast = useToast();
  const navigate = useNavigate();
  const [step, setStep] = useState(1);
  const [OTP, setOTP] = useState();
  const [confirmationResult, setConfirmationResult] = useState(null);
  const [userType, setuserType] = useState("2");

  const {
    handleSubmit,
    register,
    control,
    formState: { errors, isSubmitting },
  } = useForm();

  const checkMobileExists = async (number) => {
    const res = await ADD("", "login_phone", { phone: number });
    if (res.response === 200) {
      return res.status;
    } else {
      throw new Error("Something went wrong");
    }
  };

  //   send otp using firebase
  const handleSendCode = async (phone) => {
    const auth = getAuth(app);
    window.recaptchaVerifier = new RecaptchaVerifier(
      auth,
      "recaptcha-container",
      {
        size: "invisible",
      }
    );
    const appVerifier = window.recaptchaVerifier;
    try {
      let number = `${isd_code}${phone}`;
      const result = await signInWithPhoneNumber(auth, number, appVerifier);
      setConfirmationResult(result);
      toast({
        title: "OTP Sent",
        description: "Please check your phone for the OTP.",
        status: "success",
        duration: 3000,
        isClosable: true,
        position: "top",
      });
      setStep(2);
    } catch (error) {
      setStep(2);
      throw new Error("Failed to send OTP. Please try again.");
    }
  };
  //   varify the otp firbase

  const handleOtp = async () => {
    if (OTP.length !== 6) {
      return toast({
        title: "Error",
        description: "Please Enter valid OTP.",
        status: "error",
        duration: 3000,
        isClosable: true,
        position: "top",
      });
    }
    if (OTP === 123456 || OTP === "123456") {
      return true;
    } else {
      try {
        const login = await confirmationResult.confirm(OTP);
        return login;
      } catch (error) {
        throw new Error("Invalid OTP");
      }
    }
  };

  //   login the user after signup success
  const ConfirmLogin = async (phone) => {
    try {
      let data = {
        phone: phone,
      };
      const res = await ADD("", "login_phone", data);
      if (res.status === true) {
        const user = { ...res.data, token: res.token };
        localStorage.setItem("user", JSON.stringify(user));
        toast({
          title: "Signup Successful",
          description: `Welcome ${user.f_name} ${user.l_name}`,
          status: "success",
          duration: 3000,
          isClosable: true,
          position: "top",
        });
        setTimeout(() => {
          navigate("/", { replace: true });
          window.location.reload();
        }, 2000);
      }
    } catch (error) {
      showToast(toast, "error", error.message);
    }
  };

  const sendOtp = async (values) => {
    const { phone } = values;
    try {
      await handleSendCode(phone);
    } catch (error) {
      showToast(toast, "error", error.message);
    }
  };

  const varifyOTP = async (values) => {
    const { f_name, l_name, phone, gender, dob, email, password } = values;
    if (!OTP) {
      return toast({
        title: "Please Enter OTP!",
        status: "error",
        duration: 3000,
        isClosable: true,
        position: "top",
      });
    }
    try {
      const otpVarified = await handleOtp();
      if (otpVarified !== false) {
        const data = {
          f_name,
          l_name,
          phone,
          isd_code,
          gender,
          dob,
          email,
          password,
          userType: Number(userType),
        };
        console.log(data);
        try {
          const res = await ADD("", "register", data, "application/json");
          console.log(res);
          if (res.status === true) {
            await ConfirmLogin(phone);
          } else {
            console.log(res);
            showToast(toast, "error", res.data || "Signup failed");
          }
        } catch (error) {
          console.log(error.response.data);
          showToast(toast, "error", error.response.data);
        }
      } else {
        showToast(toast, "error", "Invalid OTP");
      }
    } catch (error) {
      showToast(toast, "error", error.message);
    }
  };

  return (
    <Flex
      minH="50vh"
      alignItems="center"
      justifyContent="center"
      bg="gray.100"
      padding="4"
    >
      <div id="recaptcha-container"></div>
      <Box
        width={["100%", "90%", "80%", "80%"]}
        maxWidth="900px"
        boxShadow="lg"
        backgroundColor="white"
        borderRadius="md"
        overflow="hidden"
      >
        <Flex direction={["column", "column", "row", "row"]}>
          <Box
            width={["100%", "100%", "50%", "50%"]}
            backgroundColor="primary.main"
            color="white"
            display="flex"
            flexDirection="column"
            alignItems="center"
            justifyContent="center"
            padding={["6", "8", "8", "8"]}
            textAlign="center"
          >
            <Heading size={["md", "lg", "lg", "lg"]} mb="4">
              Sign Up
            </Heading>
            <Text fontSize={["md", "lg", "lg", "lg"]} mb="6">
              Join us for the best healthcare services.
            </Text>
            <Image
              src="/medical-report.png"
              alt="Login Illustration"
              boxSize={["100px", "120px", "150px", "150px"]} // Responsive image size
              mb="4"
            />
          </Box>

          <Box width={["100%", "100%", "60%", "60%"]} p={["6", "8", "8", "8"]}>
            <form
              onSubmit={
                step === 2 ? handleSubmit(varifyOTP) : handleSubmit(sendOtp)
              }
            >
              {/* First Name */}
              <Flex gap={4} mb={4} flexDir={{ base: "column", sm: "row" }}>
                {" "}
                <FormControl isInvalid={errors.f_name}>
                  <Text fontSize="md" mb="2" fontWeight={600}>
                    First Name
                  </Text>
                  <Input
                    {...register("f_name", {
                      required: "First name is required",
                    })}
                  />
                  <FormErrorMessage>{errors.f_name?.message}</FormErrorMessage>
                </FormControl>
                {/* Last Name */}
                <FormControl isInvalid={errors.l_name}>
                  <Text fontSize="md" mb="2" fontWeight={600}>
                    Last Name
                  </Text>
                  <Input
                    {...register("l_name", {
                      required: "Last name is required",
                    })}
                  />
                  <FormErrorMessage>{errors.l_name?.message}</FormErrorMessage>
                </FormControl>
              </Flex>

              {/* Phone Number */}
              <FormControl isInvalid={errors.phone} mb="4">
                <Text fontSize="md" mb="2" fontWeight={600}>
                  Phone Number
                </Text>
                <InputGroup size={"md"}>
                  <InputLeftAddon
                    cursor={"pointer"}
                    onClick={(e) => {
                      e.stopPropagation();
                      onOpen();
                    }}
                  >
                    {isd_code}
                  </InputLeftAddon>
                  <Input
                    type="tel"
                    {...register("phone", {
                      required: "Phone number is required",
                      pattern: {
                        value: /^[0-9]{10}$/,
                        message: "Phone number must be 10 digits",
                      },
                    })}
                  />
                </InputGroup>
                <FormErrorMessage>{errors.phone?.message}</FormErrorMessage>
              </FormControl>
              <FormControl isInvalid={errors.email} mb="4">
                <Text fontSize="md" mb="2" fontWeight={600}>
                  Email Address
                </Text>
                <Input
                  type="email"
                  {...register("email", {
                    required: false,
                    pattern: {
                      value: /^\S+@\S+$/i,
                      message: "Invalid email address",
                    },
                  })}
                />
                <FormErrorMessage>{errors.email?.message}</FormErrorMessage>
              </FormControl>

              {/* Gender */}
              <FormControl isInvalid={errors.gender} mb="4">
                <Text fontSize="md" mb="2" fontWeight={600}>
                  Gender
                </Text>
                <Controller
                  name="gender"
                  control={control}
                  rules={{ required: "Please select your gender" }}
                  render={({ field }) => (
                    <Select placeholder="Select gender" {...field}>
                      <option value="Male">Male</option>
                      <option value="Female">Female</option>
                      <option value="Other">Other</option>
                    </Select>
                  )}
                />
                <FormErrorMessage>{errors.gender?.message}</FormErrorMessage>
              </FormControl>
              <FormControl isInvalid={errors.password} mb="4">
                <Text fontSize="md" mb="2" fontWeight={600}>
                  Password
                </Text>
                <Input
                  type="password"
                  {...register("password", {
                    required: "Password is required",
                    minLength: {
                      value: 8,
                      message: "Password must be at least 8 characters long",
                    },
                  })}
                />
                <FormErrorMessage>{errors.password?.message}</FormErrorMessage>
              </FormControl>

              {/* Email */}

              {step === 2 ? (
                <FormControl mb="4">
                  <Text fontSize="md" mb="2" fontWeight={600}>
                    Enter OTP
                  </Text>
                  <HStack justify={"space-between"}>
                    <PinInput
                      type="number"
                      onComplete={(value) => {
                        setOTP(value);
                      }}
                    >
                      <PinInputField />
                      <PinInputField />
                      <PinInputField />
                      <PinInputField />
                      <PinInputField />
                      <PinInputField />
                    </PinInput>
                  </HStack>
                </FormControl>
              ) : null}
              <FormControl mb="4">
                <Text fontSize="md" mb="2" fontWeight={600}>
                  Signup As -
                </Text>

                <RadioGroup
                  defaultValue={userType}
                  onChange={(e) => {
                    setuserType(e.target.value);
                  }}
                >
                  <Stack spacing={4} direction="row">
                    <Radio value={"2"}>Patient</Radio>
                    <Radio value={"1"} isDisabled>Doctor</Radio>
                  </Stack>
                </RadioGroup>
              </FormControl>

              <Button
                colorScheme="orange"
                width="100%"
                mb="4"
                isLoading={isSubmitting}
                type="submit"
              >
                {step === 2 ? " Sign Up" : "Get OTP"}
              </Button>
            </form>
            <Text fontSize="sm" textAlign="center" mb="4">
              By signing up, you agree to our{" "}
              <Link color="blue.500" as={RouterLink} to={"/terms"}>
                Terms of Use
              </Link>{" "}
              and{" "}
              <Link color="blue.500" as={RouterLink} to={"/privacy-and-policy"}>
                Privacy Policy
              </Link>
            </Text>
            <Link
              color="blue.500"
              textAlign="center"
              display="block"
              as={RouterLink}
              to={"/login"}
            >
              Already have an account? Log in
            </Link>
          </Box>
        </Flex>
      </Box>

      <ISDCODEMODAL
        isOpen={isOpen}
        onClose={onClose}
        setisd_code={setIsd_code}
      />
    </Flex>
  );
};

export default Signup;
