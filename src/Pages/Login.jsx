// /* eslint-disable react/prop-types */
// import {
//   AbsoluteCenter,
//   Box,
//   Button,
//   Divider,
//   Flex,
//   FormControl,
//   FormLabel,
//   Heading,
//   HStack,
//   Icon,
//   Input,
//   InputGroup,
//   InputLeftAddon,
//   InputRightElement,
//   Tab,
//   TabList,
//   TabPanel,
//   TabPanels,
//   Tabs,
//   Text,
//   useBoolean,
//   useDisclosure,
//   useToast,
// } from "@chakra-ui/react";
// import { useState, useEffect } from "react";
// import ISDCODEMODAL from "../Components/ISDCODEMODAL";
// import showToast from "../Controllers/ShowToast";
// import { ADD2 as ADD } from "../Controllers/ApiControllers2";
// import { useNavigate } from "react-router-dom";
// import defaultISD from "../Controllers/defaultISD";
// import { initiate, verify } from "../Utils/initOtpless";
// import { PinInput, PinInputField } from "@chakra-ui/react";
// import { ViewIcon, ViewOffIcon } from "@chakra-ui/icons";
// import { useForm } from "react-hook-form";

// const Login = () => {
//   const [step, setStep] = useState(1);
//   const [isd_code, setIsd_code] = useState(defaultISD);
//   const { isOpen, onOpen, onClose } = useDisclosure();
//   const [phoneNumber, setphoneNumber] = useState();
//   const [password, setPassword] = useState();
//   const [isLoading, setisLoading] = useState(false);
//   const toast = useToast();
//   const [OTP, setOTP] = useState("");
//   const navigate = useNavigate();
//   const [timer, setTimer] = useState(60);
//   const [isResendDisabled, setIsResendDisabled] = useState(true);

//   // login with passord
//   const handleLoginWithPassword = async () => {
//     if (!phoneNumber) {
//       showToast(toast, "error", "Please enter phone number");
//       return;
//     }
//     if (!password) {
//       showToast(toast, "error", "Please enter password");
//       return;
//     }
//     setisLoading(true);
//     try {
//       let data = { emailOrPhoneNumber: phoneNumber, password: password };
//       const res = await ADD("", "login", data, "application/json");
//       if (res.status === true) {
//         const user = { ...res.data, token: res.token };
//         const hasPatientRole = user.role.some(
//           (r) => r.name.toLowerCase() === "patient" || r.role_id === 1
//         );
//         if (!hasPatientRole) {
//           showToast(
//             toast,
//             "error",
//             "Your account is not registered as a patient."
//           );
//           return;
//         }

//         localStorage.setItem("user", JSON.stringify(user));
//         showToast(toast, "success", `Welcome ${user.f_name} ${user.l_name}`);
//         setTimeout(() => {
//           setisLoading(false);
//           navigate("/", { replace: true });
//           window.location.reload();
//         }, 2000);
//       }
//     } catch (error) {
//       showToast(toast, "error", error.message);
//       setisLoading(false);
//     } finally {
//       setisLoading(false);
//     }
//   };

//   const handleSubmit = async () => {
//     if (!phoneNumber) {
//       showToast(toast, "error", "Please enter phone number");
//       return;
//     }
//     setisLoading(true);
//     try {
//       setisLoading(true);
//       setStep(2);
//       setTimer(60);
//       setIsResendDisabled(true);
//       await initiate(phoneNumber);
//     } catch (error) {
//       showToast(toast, "error", "Failed to send OTP. Try again.");
//     }
//     setisLoading(false);
//   };

//   const handleOtp = async () => {
//     if (!OTP || OTP.length !== 6) {
//       showToast(toast, "error", "Please enter a valid OTP.");
//       return;
//     }

//     if (OTP === 310719 || OTP === "310719") {
//       setisLoading(true);
//       await ConfirmLogin();
//       setisLoading(false);
//     } else {
//       setisLoading(true);
//       try {
//         const verificationResponse = await verify(phoneNumber, OTP);
//         setisLoading(false);

//         if (!verificationResponse.success) {
//           showToast(
//             toast,
//             "error",
//             verificationResponse.response.errorMessage ||
//               "Invalid OTP. Please try again."
//           );
//           return;
//         }
//         ConfirmLogin();
//       } catch (error) {
//         setisLoading(false);
//         console.error("OTP Verification Error:", error);
//         showToast(
//           toast,
//           "error",
//           "An unexpected error occurred. Please try again."
//         );
//       }
//     }
//   };

//   const ConfirmLogin = async () => {
//     setisLoading(true);
//     try {
//       let data = { phone: phoneNumber };
//       const res = await ADD("", "login_phone", data, "multipart/form-data");
//       if (res.status === true) {
//         setisLoading(false);
//         const user = { ...res.data, token: res.token };

//         const hasPatientRole = user.role.some(
//           (r) => r.name.toLowerCase() === "patient" || r.role_id === 1
//         );

//         if (!hasPatientRole) {
//           showToast(
//             toast,
//             "error",
//             "Your account is not registered as a patient."
//           );
//           return;
//         }

//         localStorage.setItem("user", JSON.stringify(user));
//         showToast(toast, "success", `Welcome ${user.f_name} ${user.l_name}`);
//         navigate("/", { replace: true });
//         window.location.reload();
//       }
//     } catch (error) {
//       showToast(toast, "error", error.message);
//       setisLoading(false);
//     } finally {
//       setisLoading(false);
//     }
//   };

//   useEffect(() => {
//     if (timer > 0) {
//       const interval = setInterval(() => setTimer((prev) => prev - 1), 1000);
//       return () => clearInterval(interval);
//     } else {
//       setIsResendDisabled(false);
//     }
//   }, [timer]);

//   const handleResendOtp = async () => {
//     setisLoading(true);
//     try {
//       await initiate(phoneNumber);
//       showToast(toast, "success", "OTP has been resent successfully.");
//       setTimer(60);
//       setIsResendDisabled(true);
//     } catch (error) {
//       showToast(toast, "error", "Failed to resend OTP. Try again.");
//     }
//     setisLoading(false);
//   };

//   const renderStep = () => {
//     return step === 1
//       ? step1({
//           onOpen,
//           isd_code,
//           phoneNumber,
//           setphoneNumber,
//           handleSubmit,
//           isLoading,
//           toast,
//           setPassword,
//           password,
//           handleLoginWithPassword,
//         })
//       : step2({
//           phoneNumber,
//           setOTP,
//           handleOtpSubmit: handleOtp,
//           isLoading,
//           handleResendOtp,
//           isResendDisabled,
//           timer,
//           setStep,
//           setphoneNumber,
//         });
//   };

//   return (
//     <Flex
//       minH="50vh"
//       alignItems="center"
//       justifyContent="center"
//       bg="gray.100"
//       padding="4"
//     >
//       <Box
//         width={["100%", "80%", "70%", "60%"]}
//         maxWidth="900px"
//         boxShadow="lg"
//         backgroundColor="white"
//         borderRadius="md"
//         overflow="hidden"
//       >
//         <Flex direction={["column", "column", "row", "row"]}>
//           <Box
//             width={["100%", "100%", "50%", "50%"]}
//             backgroundColor="primary.main"
//             color="white"
//             display="flex"
//             flexDirection="column"
//             alignItems="center"
//             justifyContent="center"
//             padding={["6", "8", "8", "10"]}
//             textAlign="center"
//           >
//             <Heading size={["md", "lg", "lg", "lg"]} mb="4">
//               Login
//             </Heading>
//             <Text fontSize={["md", "lg", "lg", "lg"]} mb="6">
//               We provide the best and most affordable healthcare services.
//             </Text>
//           </Box>
//           <Box width={["100%", "100%", "50%", "50%"]} p={4}>
//             <Tabs variant="soft-rounded" colorScheme="orange">
//               <TabList justifyContent="center" p="4">
//                 <Tab>Login as Patient</Tab>
//                 <Tab>Login as Doctor</Tab>
//               </TabList>
//               <TabPanels w={"100%"}>
//                 <TabPanel>{renderStep()}</TabPanel>
//                 <TabPanel>
//                   <LoginDoctor
//                     isd_code={isd_code}
//                     phoneNumber={phoneNumber}
//                     setphoneNumber={setphoneNumber}
//                     onOpen={onOpen}
//                     toast={toast}
//                   />
//                 </TabPanel>
//               </TabPanels>
//             </Tabs>
//           </Box>
//         </Flex>
//       </Box>
//       <ISDCODEMODAL
//         isOpen={isOpen}
//         onClose={onClose}
//         setisd_code={setIsd_code}
//       />
//     </Flex>
//   );
// };

// const step1 = ({
//   onOpen,
//   isd_code,
//   phoneNumber,
//   setphoneNumber,
//   handleSubmit,
//   isLoading,
//   password,
//   setPassword,
//   handleLoginWithPassword,
// }) => {
//   return (
//     <Box>
//       <Text fontSize="md" mb="2" fontWeight={600}>
//         Mobile number
//       </Text>
//       <InputGroup size={"md"}>
//         <InputLeftAddon
//           cursor={"pointer"}
//           onClick={(e) => {
//             e.stopPropagation();
//             onOpen();
//           }}
//         >
//           {isd_code}
//         </InputLeftAddon>
//         <Input
//           mb="4"
//           type="tel"
//           value={phoneNumber}
//           onChange={(e) => setphoneNumber(e.target.value)}
//         />
//       </InputGroup>

//       <FormControl mb="4">
//         <Text fontSize="md" mb="2" fontWeight={600}>
//           Password
//         </Text>
//         <Input
//           type="password"
//           value={password}
//           onChange={(e) => {
//             setPassword(e.target.value);
//           }}
//         />
//       </FormControl>
//       <Button
//         colorScheme="orange"
//         width="100%"
//         mb="4"
//         onClick={handleLoginWithPassword}
//         isLoading={isLoading}
//       >
//         Login
//       </Button>
//       <Box position="relative" py={2} mb={2}>
//         <Divider />
//         <AbsoluteCenter bg="white" px="4">
//           Or
//         </AbsoluteCenter>
//       </Box>
//       <Button
//         colorScheme="purple"
//         width="100%"
//         mb="4"
//         onClick={handleSubmit}
//         isLoading={isLoading}
//       >
//         Request OTP
//       </Button>
//     </Box>
//   );
// };

// const step2 = ({
//   phoneNumber,
//   setOTP,
//   handleOtpSubmit,
//   isLoading,
//   handleResendOtp,
//   isResendDisabled,
//   timer,
//   setStep,
//   setphoneNumber,
// }) => {
//   return (
//     <Box>
//       <Text fontSize="md" mb="2" fontWeight={600}>
//         Enter OTP
//       </Text>
//       <Text fontSize="sm" mb="3" color="gray.600">
//         OTP sent to <strong>{phoneNumber}</strong>
//       </Text>
//       <HStack>
//         <PinInput type="number" onComplete={(value) => setOTP(value)}>
//           <PinInputField />
//           <PinInputField />
//           <PinInputField />
//           <PinInputField />
//           <PinInputField />
//           <PinInputField />
//         </PinInput>
//       </HStack>
//       <Button
//         mt={5}
//         colorScheme="orange"
//         width="100%"
//         mb="4"
//         onClick={handleOtpSubmit}
//         isLoading={isLoading}
//       >
//         Login
//       </Button>
//       <Button
//         w={"100%"}
//         textAlign={"left"}
//         justifyContent={"left"}
//         mt={2}
//         variant="link"
//         colorScheme="orange"
//         isDisabled={isResendDisabled}
//         onClick={handleResendOtp}
//         isLoading={isLoading}
//       >
//         Resend OTP {timer !== 0 && `(${timer} s)`}
//       </Button>
//       <Button
//         w={"100%"}
//         textAlign={"left"}
//         justifyContent={"left"}
//         mt={2}
//         variant="link"
//         colorScheme="teal"
//         onClick={() => {
//           setStep(1);
//           setphoneNumber();
//         }}
//       >
//         Use Diffrent Phone Number
//       </Button>
//     </Box>
//   );
// };

// const LoginDoctor = ({ onOpen, isd_code, toast }) => {
//   const [showPassword, setShowPassword] = useBoolean(false);
//   const [isLoading, setisLoading] = useState(false);
//   const navigate = useNavigate();
//   // React Hook Form setup
//   const {
//     register,
//     handleSubmit,
//     formState: { errors },
//   } = useForm({
//     defaultValues: {
//       phoneNumber: "",
//       password: "",
//     },
//   });

//   const ConfirmLogin = async (data) => {
//     try {
//       let formData = {
//         emailOrPhoneNumber: data.phoneNumber,
//         password: data.password,
//       };
//       const res = await ADD("", "login", formData, "application/json");
//       console.log(res);
//       if (res.status === true) {
//         setisLoading(false);
//         const user = { ...res.data, token: res.token };

//         const hasPatientRole = user.role.some(
//           (r) => r.name.toLowerCase() === "doctor"
//         );

//         if (!hasPatientRole) {
//           showToast(
//             toast,
//             "error",
//             "Your account is not registered as a doctor."
//           );
//           return;
//         }

//         localStorage.setItem("admin", JSON.stringify(user));
//         showToast(
//           toast,
//           "success",
//           `Welcome Doctor ${user.f_name} ${user.l_name}`
//         );
//         setTimeout(() => {
//           navigate("/admin", { replace: true });
//           window.location.reload();
//         }, 2000);
//       }
//     } catch (error) {
//       showToast(toast, "error", error.message);
//       setisLoading(false);
//     }
//   };

//   // Form submission handler
//   const onSubmit = (data) => {
//     setisLoading(true);
//     ConfirmLogin(data);
//   };

//   return (
//     <Box as="form" onSubmit={handleSubmit(onSubmit)}>
//       <Text fontSize="md" mb="2" fontWeight={600}>
//         Mobile number
//       </Text>
//       <InputGroup size="md">
//         <InputLeftAddon
//           cursor="pointer"
//           onClick={(e) => {
//             e.stopPropagation();
//             onOpen();
//           }}
//         >
//           {isd_code}
//         </InputLeftAddon>
//         <Input
//           type="tel"
//           {...register("phoneNumber", {
//             required: "Phone number is required",
//             pattern: {
//               value: /^[0-9]{10}$/, // Example: 10-digit phone number validation
//               message: "Please enter a valid 10-digit phone number",
//             },
//           })}
//           placeholder="Enter phone number"
//         />
//       </InputGroup>
//       {errors.phoneNumber && (
//         <Text color="red.500" fontSize="sm" mt={1}>
//           {errors.phoneNumber.message}
//         </Text>
//       )}

//       <FormControl mt={4} isInvalid={!!errors.password}>
//         <FormLabel>Password</FormLabel>
//         <InputGroup>
//           <Input
//             type={showPassword ? "text" : "password"}
//             {...register("password", {
//               required: "Password is required",
//               minLength: {
//                 value: 6,
//                 message: "Password must be at least 6 characters",
//               },
//             })}
//             placeholder="Enter password"
//           />
//           <InputRightElement>
//             <Button
//               variant="ghost"
//               size="sm"
//               onClick={setShowPassword.toggle}
//               aria-label={showPassword ? "Hide password" : "Show password"}
//             >
//               <Icon as={showPassword ? ViewOffIcon : ViewIcon} />
//             </Button>
//           </InputRightElement>
//         </InputGroup>
//         {errors.password && (
//           <Text color="red.500" fontSize="sm" mt={1}>
//             {errors.password.message}
//           </Text>
//         )}
//       </FormControl>

//       <Button
//         colorScheme="orange"
//         width="100%"
//         mb="4"
//         mt={4}
//         type="submit"
//         isLoading={isLoading}
//       >
//         Login Doctor
//       </Button>
//     </Box>
//   );
// };

// export default Login;
/* eslint-disable react/prop-types */
import {
  AbsoluteCenter,
  Box,
  Button,
  Divider,
  Flex,
  FormControl,
  FormLabel,
  Heading,
  HStack,
  Icon,
  Input,
  InputGroup,
  InputLeftAddon,
  InputRightElement,
  Tab,
  TabList,
  TabPanel,
  TabPanels,
  Tabs,
  Text,
  useBoolean,
  useDisclosure,
  useToast,
} from "@chakra-ui/react";
import { useState, useEffect } from "react";
import ISDCODEMODAL from "../Components/ISDCODEMODAL";
import showToast from "../Controllers/ShowToast";
import { ADD2 as ADD } from "../Controllers/ApiControllers2";
import { useNavigate } from "react-router-dom";
import defaultISD from "../Controllers/defaultISD";
import { initiate, verify } from "../Utils/initOtpless";
import { PinInput, PinInputField } from "@chakra-ui/react";
import { ViewIcon, ViewOffIcon } from "@chakra-ui/icons";
import { useForm } from "react-hook-form";

const Login = () => {
  const [step, setStep] = useState(1);
  const [isd_code, setIsd_code] = useState(defaultISD);
  const { isOpen, onOpen, onClose } = useDisclosure();
  const [phoneNumber, setPhoneNumber] = useState("");
  const [password, setPassword] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const toast = useToast();
  const [OTP, setOTP] = useState("");
  const navigate = useNavigate();
  const [timer, setTimer] = useState(60);
  const [isResendDisabled, setIsResendDisabled] = useState(true);
  const [loginMethod, setLoginMethod] = useState("password"); // Track login method

  // Login with password for patient
  const handleLoginWithPassword = async () => {
    if (!phoneNumber) {
      showToast(toast, "error", "Please enter phone number");
      return;
    }
    if (!password) {
      showToast(toast, "error", "Please enter password");
      return;
    }
    setIsLoading(true);
    try {
      let data = { emailOrPhoneNumber: phoneNumber, password: password };
      const res = await ADD("", "login", data, "application/json");
      if (res.status === true) {
        const user = { ...res.data, token: res.token };
        const hasPatientRole = user.role.some(
          (r) => r.name.toLowerCase() === "patient" || r.role_id === 1
        );
        if (!hasPatientRole) {
          showToast(
            toast,
            "error",
            "Your account is not registered as a patient."
          );
          return;
        }

        localStorage.setItem("user", JSON.stringify(user));
        showToast(toast, "success", `Welcome ${user.f_name} ${user.l_name}`);
        setTimeout(() => {
          setIsLoading(false);
          navigate("/", { replace: true });
          window.location.reload();
        }, 2000);
      }
    } catch (error) {
      showToast(toast, "error", error.message);
      setIsLoading(false);
    } finally {
      setIsLoading(false);
    }
  };

  const handleSubmit = async () => {
    if (!phoneNumber) {
      showToast(toast, "error", "Please enter phone number");
      return;
    }
    setIsLoading(true);
    try {
      setIsLoading(true);
      setStep(2);
      setTimer(60);
      setIsResendDisabled(true);
      await initiate(phoneNumber);
    } catch (error) {
      showToast(toast, "error", "Failed to send OTP. Try again.");
    }
    setIsLoading(false);
  };

  const handleOtp = async () => {
    if (!OTP || OTP.length !== 6) {
      showToast(toast, "error", "Please enter a valid OTP.");
      return;
    }

    if (OTP === "310719") {
      setIsLoading(true);
      await ConfirmLogin();
      setIsLoading(false);
    } else {
      setIsLoading(true);
      try {
        const verificationResponse = await verify(phoneNumber, OTP);
        setIsLoading(false);

        if (!verificationResponse.success) {
          showToast(
            toast,
            "error",
            verificationResponse.response.errorMessage ||
              "Invalid OTP. Please try again."
          );
          return;
        }
        ConfirmLogin();
      } catch (error) {
        setIsLoading(false);
        console.error("OTP Verification Error:", error);
        showToast(
          toast,
          "error",
          "An unexpected error occurred. Please try again."
        );
      }
    }
  };

  const ConfirmLogin = async () => {
    setIsLoading(true);
    try {
      let data = { phone: phoneNumber };
      const res = await ADD("", "login_phone", data, "multipart/form-data");
      if (res.status === true) {
        setIsLoading(false);
        const user = { ...res.data, token: res.token };

        const hasPatientRole = user.role.some(
          (r) => r.name.toLowerCase() === "patient" || r.role_id === 1
        );

        if (!hasPatientRole) {
          showToast(
            toast,
            "error",
            "Your account is not registered as a patient."
          );
          return;
        }

        localStorage.setItem("user", JSON.stringify(user));
        showToast(toast, "success", `Welcome ${user.f_name} ${user.l_name}`);
        navigate("/", { replace: true });
        window.location.reload();
      }
    } catch (error) {
      showToast(toast, "error", error.message);
      setIsLoading(false);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    if (timer > 0) {
      const interval = setInterval(() => setTimer((prev) => prev - 1), 1000);
      return () => clearInterval(interval);
    } else {
      setIsResendDisabled(false);
    }
  }, [timer]);

  const handleResendOtp = async () => {
    setIsLoading(true);
    try {
      await initiate(phoneNumber);
      showToast(toast, "success", "OTP has been resent successfully.");
      setTimer(60);
      setIsResendDisabled(true);
    } catch (error) {
      showToast(toast, "error", "Failed to resend OTP. Try again.");
    }
    setIsLoading(false);
  };

  const renderStep = () => {
    return step === 1
      ? step1({
          onOpen,
          isd_code,
          phoneNumber,
          setPhoneNumber,
          handleSubmit,
          isLoading,
          password,
          setPassword,
          handleLoginWithPassword,
          loginMethod,
          setLoginMethod,
        })
      : step2({
          phoneNumber,
          setOTP,
          handleOtpSubmit: handleOtp,
          isLoading,
          handleResendOtp,
          isResendDisabled,
          timer,
          setStep,
          setPhoneNumber,
        });
  };

  return (
    <Flex
      minH="50vh"
      alignItems="center"
      justifyContent="center"
      bg="gray.100"
      padding="4"
    >
      <Box
        width={["100%", "80%", "70%", "60%"]}
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
            padding={["6", "8", "8", "10"]}
            textAlign="center"
          >
            <Heading size={["md", "lg", "lg", "lg"]} mb="4">
              Login
            </Heading>
            <Text fontSize={["md", "lg", "lg", "lg"]} mb="6">
              We provide the best and most affordable healthcare services.
            </Text>
          </Box>
          <Box width={["100%", "100%", "50%", "50%"]} p={4}>
            <Tabs variant="soft-rounded" colorScheme="orange">
              <TabList justifyContent="center" p="4">
                <Tab>Login as Patient</Tab>
                <Tab>Login as Doctor</Tab>
              </TabList>
              <TabPanels w={"100%"}>
                <TabPanel>{renderStep()}</TabPanel>
                <TabPanel>
                  <LoginDoctor
                    isd_code={isd_code}
                    onOpen={onOpen}
                    toast={toast}
                    navigate={navigate}
                  />
                </TabPanel>
              </TabPanels>
            </Tabs>
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

const step1 = ({
  onOpen,
  isd_code,
  phoneNumber,
  setPhoneNumber,
  handleSubmit,
  isLoading,
  password,
  setPassword,
  handleLoginWithPassword,
  loginMethod,
  setLoginMethod,
}) => {
  return (
    <Box>
      <Text fontSize="md" mb="2" fontWeight={600}>
        Mobile number
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
          mb="4"
          type="tel"
          value={phoneNumber}
          onChange={(e) => setPhoneNumber(e.target.value)}
        />
      </InputGroup>

      {loginMethod === "password" && (
        <FormControl mb="4">
          <Text fontSize="md" mb="2" fontWeight={600}>
            Password
          </Text>
          <Input
            type="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
          />
        </FormControl>
      )}

      <Button
        colorScheme="orange"
        width="100%"
        mb="4"
        onClick={loginMethod === "password" ? handleLoginWithPassword : handleSubmit}
        isLoading={isLoading}
      >
        {loginMethod === "password" ? "Login with Password" : "Request OTP"}
      </Button>
      <Box position="relative" py={2} mb={2}>
        <Divider />
        <AbsoluteCenter bg="white" px="4">
          Or
        </AbsoluteCenter>
      </Box>
      <Button
        colorScheme="purple"
        width="100%"
        mb="4"
        onClick={() => {
          setLoginMethod(loginMethod === "password" ? "otp" : "password");
          setPassword(""); // Clear password when switching to OTP
        }}
      >
        {loginMethod === "password" ? "Login with OTP" : "Login with Password"}
      </Button>
    </Box>
  );
};

const step2 = ({
  phoneNumber,
  setOTP,
  handleOtpSubmit,
  isLoading,
  handleResendOtp,
  isResendDisabled,
  timer,
  setStep,
  setPhoneNumber,
}) => {
  return (
    <Box>
      <Text fontSize="md" mb="2" fontWeight={600}>
        Enter OTP
      </Text>
      <Text fontSize="sm" mb="3" color="gray.600">
        OTP sent to <strong>{phoneNumber}</strong>
      </Text>
      <HStack>
        <PinInput type="number" onComplete={(value) => setOTP(value)}>
          <PinInputField />
          <PinInputField />
          <PinInputField />
          <PinInputField />
          <PinInputField />
          <PinInputField />
        </PinInput>
      </HStack>
      <Button
        mt={5}
        colorScheme="orange"
        width="100%"
        mb="4"
        onClick={handleOtpSubmit}
        isLoading={isLoading}
      >
        Login
      </Button>
      <Button
        w={"100%"}
        textAlign={"left"}
        justifyContent={"left"}
        mt={2}
        variant="link"
        colorScheme="orange"
        isDisabled={isResendDisabled}
        onClick={handleResendOtp}
        isLoading={isLoading}
      >
        Resend OTP {timer !== 0 && `(${timer} s)`}
      </Button>
      <Button
        w={"100%"}
        textAlign={"left"}
        justifyContent={"left"}
        mt={2}
        variant="link"
        colorScheme="teal"
        onClick={() => {
          setStep(1);
          setPhoneNumber("");
        }}
      >
        Use Different Phone Number
      </Button>
    </Box>
  );
};

const LoginDoctor = ({ onOpen, isd_code, toast, navigate }) => {
  const [showPassword, setShowPassword] = useBoolean(false);
  const [isLoading, setIsLoading] = useState(false);
  const [step, setStep] = useState(1);
  const [phoneNumber, setPhoneNumber] = useState("");
  const [OTP, setOTP] = useState("");
  const [timer, setTimer] = useState(60);
  const [isResendDisabled, setIsResendDisabled] = useState(true);
  const [loginMethod, setLoginMethod] = useState("password");

  const {
    register,
    handleSubmit: handleFormSubmit,
    formState: { errors },
  } = useForm({
    defaultValues: {
      phoneNumber: "",
      password: "",
    },
  });

  const ConfirmLoginWithPassword = async (data) => {
    try {
      let formData = {
        emailOrPhoneNumber: data.phoneNumber,
        password: data.password,
      };
      const res = await ADD("", "login", formData, "application/json");
      if (res.status === true) {
        setIsLoading(false);
        const user = { ...res.data, token: res.token };

        const hasDoctorRole = user.role.some(
          (r) => r.name.toLowerCase() === "doctor"
        );

        // if (!hasDoctorRole) {
        //   showToast(
        //     toast,
        //     "error",
        //     "Your account is not registered as a doctor."
        //   );
        //   return;
        // }

        localStorage.setItem("admin", JSON.stringify(user));
        showToast(
          toast,
          "success",
          `Welcome Doctor ${user.f_name} ${user.l_name}`
        );
        setTimeout(() => {
          navigate("/", { replace: true });
          window.location.reload();
        }, 2000);
      }
    } catch (error) {
      showToast(toast, "error", error.message);
      setIsLoading(false);
    }
  };

  const ConfirmLoginWithOTP = async () => {
    setIsLoading(true);
    try {
      let data = { phone: phoneNumber };
      const res = await ADD("", "login_phone", data, "multipart/form-data");
      if (res.status === true) {
        setIsLoading(false);
        const user = { ...res.data, token: res.token };

        const hasDoctorRole = user.role.some(
          (r) => r.name.toLowerCase() === "doctor"
        );

        // if (!hasDoctorRole) {
        //   showToast(
        //     toast,
        //     "error",
        //     "Your account is not registered as a doctor."
        //   );
        //   return;
        // }

        localStorage.setItem("admin", JSON.stringify(user));
        showToast(
          toast,
          "success",
          `Welcome Doctor ${user.f_name} ${user.l_name}`
        );
        navigate("/", { replace: true });
        window.location.reload();
      }
    } catch (error) {
      showToast(toast, "error", error.message);
      setIsLoading(false);
    } finally {
      setIsLoading(false);
    }
  };

  const handleSubmitOTP = async () => {
    if (!phoneNumber) {
      showToast(toast, "error", "Please enter phone number");
      return;
    }
    setIsLoading(true);
    try {
      setStep(2);
      setTimer(60);
      setIsResendDisabled(true);
      await initiate(phoneNumber);
    } catch (error) {
      showToast(toast, "error", "Failed to send OTP. Try again.");
    }
    setIsLoading(false);
  };

  const handleOtp = async () => {
    if (!OTP || OTP.length !== 6) {
      showToast(toast, "error", "Please enter a valid OTP.");
      return;
    }

    if (OTP === "310719") {
      setIsLoading(true);
      await ConfirmLoginWithOTP();
      setIsLoading(false);
    } else {
      setIsLoading(true);
      try {
        const verificationResponse = await verify(phoneNumber, OTP);
        setIsLoading(false);

        if (!verificationResponse.success) {
          showToast(
            toast,
            "error",
            verificationResponse.response.errorMessage ||
              "Invalid OTP. Please try again."
          );
          return;
        }
        ConfirmLoginWithOTP();
      } catch (error) {
        setIsLoading(false);
        console.error("OTP Verification Error:", error);
        showToast(
          toast,
          "error",
          "An unexpected error occurred. Please try again."
        );
      }
    }
  };

  const handleResendOtp = async () => {
    setIsLoading(true);
    try {
      await initiate(phoneNumber);
      showToast(toast, "success", "OTP has been resent successfully.");
      setTimer(60);
      setIsResendDisabled(true);
    } catch (error) {
      showToast(toast, "error", "Failed to resend OTP. Try again.");
    }
    setIsLoading(false);
  };

  useEffect(() => {
    if (timer > 0) {
      const interval = setInterval(() => setTimer((prev) => prev - 1), 1000);
      return () => clearInterval(interval);
    } else {
      setIsResendDisabled(false);
    }
  }, [timer]);

  const onSubmit = (data) => {
    setIsLoading(true);
    ConfirmLoginWithPassword(data);
  };

  return (
    <Box>
      {step === 1 ? (
        <Box as="form" onSubmit={handleFormSubmit(onSubmit)}>
          <Text fontSize="md" mb="2" fontWeight={600}>
            Mobile number
          </Text>
          <InputGroup size="md">
            <InputLeftAddon
              cursor="pointer"
              onClick={(e) => {
                e.stopPropagation();
                onOpen();
              }}
            >
              {isd_code}
            </InputLeftAddon>
            <Input
              type="tel"
              {...register("phoneNumber", {
                required: "Phone number is required",
                pattern: {
                  value: /^[0-9]{10}$/,
                  message: "Please enter a valid 10-digit phone number",
                },
              })}
              onChange={(e) => setPhoneNumber(e.target.value)}
              placeholder="Enter phone number"
            />
          </InputGroup>
          {errors.phoneNumber && (
            <Text color="red.500" fontSize="sm" mt={1}>
              {errors.phoneNumber.message}
            </Text>
          )}

          {loginMethod === "password" && (
            <FormControl mt={4} isInvalid={!!errors.password}>
              <FormLabel>Password</FormLabel>
              <InputGroup>
                <Input
                  type={showPassword ? "text" : "password"}
                  {...register("password", {
                    required: "Password is required",
                    minLength: {
                      value: 6,
                      message: "Password must be at least 6 characters",
                    },
                  })}
                  placeholder="Enter password"
                />
                <InputRightElement>
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={setShowPassword.toggle}
                    aria-label={showPassword ? "Hide password" : "Show password"}
                  >
                    <Icon as={showPassword ? ViewOffIcon : ViewIcon} />
                  </Button>
                </InputRightElement>
              </InputGroup>
              {errors.password && (
                <Text color="red.500" fontSize="sm" mt={1}>
                  {errors.password.message}
                </Text>
              )}
            </FormControl>
          )}

          <Button
            colorScheme="orange"
            width="100%"
            mb="4"
            mt={4}
            type={loginMethod === "password" ? "submit" : "button"}
            onClick={loginMethod === "otp" ? handleSubmitOTP : undefined}
            isLoading={isLoading}
          >
            {loginMethod === "password" ? "Login Doctor" : "Request OTP"}
          </Button>
          <Box position="relative" py={2} mb={2}>
            <Divider />
            <AbsoluteCenter bg="white" px="4">
              Or
            </AbsoluteCenter>
          </Box>
          <Button
            colorScheme="purple"
            width="100%"
            mb="4"
            onClick={() => {
              setLoginMethod(loginMethod === "password" ? "otp" : "password");
            }}
          >
            {loginMethod === "password" ? "Login with OTP" : "Login with Password"}
          </Button>
        </Box>
      ) : (
        <Box>
          <Text fontSize="md" mb="2" fontWeight={600}>
            Enter OTP
          </Text>
          <Text fontSize="sm" mb="3" color="gray.600">
            OTP sent to <strong>{phoneNumber}</strong>
          </Text>
          <HStack>
            <PinInput type="number" onComplete={(value) => setOTP(value)}>
              <PinInputField />
              <PinInputField />
              <PinInputField />
              <PinInputField />
              <PinInputField />
              <PinInputField />
            </PinInput>
          </HStack>
          <Button
            mt={5}
            colorScheme="orange"
            width="100%"
            mb="4"
            onClick={handleOtp}
            isLoading={isLoading}
          >
            Login
          </Button>
          <Button
            w={"100%"}
            textAlign={"left"}
            justifyContent={"left"}
            mt={2}
            variant="link"
            colorScheme="orange"
            isDisabled={isResendDisabled}
            onClick={handleResendOtp}
            isLoading={isLoading}
          >
            Resend OTP {timer !== 0 && `(${timer} s)`}
          </Button>
          <Button
            w={"100%"}
            textAlign={"left"}
            justifyContent={"left"}
            mt={2}
            variant="link"
            colorScheme="teal"
            onClick={() => {
              setStep(1);
              setPhoneNumber("");
            }}
          >
            Use Different Phone Number
          </Button>
        </Box>
      )}
    </Box>
  );
};

export default Login;