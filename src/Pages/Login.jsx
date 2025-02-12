import {
  Box,
  Button,
  Flex,
  Heading,
  HStack,
  Input,
  InputGroup,
  InputLeftAddon,
  Tab,
  TabList,
  TabPanel,
  TabPanels,
  Tabs,
  Text,
  useDisclosure,
  useToast,
} from "@chakra-ui/react";
import { useState, useEffect } from "react";
import ISDCODEMODAL from "../Components/ISDCODEMODAL";
import showToast from "../Controllers/ShowToast";
import { ADD2 as ADD } from "../Controllers/ApiControllers2";
import { useNavigate } from "react-router-dom";
import defaultISD from "../Controllers/defaultISD";
import { initiate, verify, oauth } from "../Utils/initOtpless";
import { PinInput, PinInputField } from "@chakra-ui/react";
import { FaWhatsapp } from "react-icons/fa";

const Login = () => {
  const [step, setStep] = useState(1);
  const [isd_code, setIsd_code] = useState(defaultISD);
  const { isOpen, onOpen, onClose } = useDisclosure();
  const [phoneNumber, setphoneNumber] = useState("");
  const [isLoading, setisLoading] = useState(false);
  const toast = useToast();
  const [OTP, setOTP] = useState("");
  const navigate = useNavigate();
  const [LoginAs, setLoginAs] = useState("2");

  const handleSubmit = async () => {
    if (!phoneNumber) {
      showToast(toast, "error", "Please enter phone number");
      return;
    }
    setisLoading(true);
    try {
      setisLoading(true);
      setStep(2);
      setTimer(60);
      setIsResendDisabled(true);
      await initiate(phoneNumber);
    } catch (error) {
      showToast(toast, "error", "Failed to send OTP. Try again.");
    }
    setisLoading(false);
  };

  const handleOtp = async () => {
    if (!OTP || OTP.length !== 6) {
      showToast(toast, "error", "Please enter a valid OTP.");
      return;
    }

    setisLoading(true);
    try {
      const verificationResponse = await verify(phoneNumber, OTP);
      setisLoading(false);

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
      setisLoading(false);
      console.error("OTP Verification Error:", error);
      showToast(
        toast,
        "error",
        "An unexpected error occurred. Please try again."
      );
    }
  };

  const ConfirmLogin = async () => {
    try {
      let data = { phone: phoneNumber };
      const res = await ADD("", "login_phone", data, "multipart/form-data");

      if (res.status === true) {
        setisLoading(false);
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
      setisLoading(false);
    }
  };

  const [timer, setTimer] = useState(60);
  const [isResendDisabled, setIsResendDisabled] = useState(true);

  useEffect(() => {
    if (timer > 0) {
      const interval = setInterval(() => setTimer((prev) => prev - 1), 1000);
      return () => clearInterval(interval);
    } else {
      setIsResendDisabled(false);
    }
  }, [timer]);

  const handleResendOtp = async () => {
    setisLoading(true);
    try {
      await initiate(phoneNumber);
      showToast(toast, "success", "OTP has been resent successfully.");
      setTimer(60);
      setIsResendDisabled(true);
    } catch (error) {
      showToast(toast, "error", "Failed to resend OTP. Try again.");
    }
    setisLoading(false);
  };

  const renderStep = () => {
    return step === 1
      ? step1({
          onOpen,
          isd_code,
          phoneNumber,
          setphoneNumber,
          handleSubmit,
          isLoading,
          toast,
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
          setphoneNumber,
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
            <Tabs
              variant="soft-rounded"
              colorScheme="orange"
              onChange={(index) => setLoginAs(index === 0 ? "2" : "1")}
            >
              <TabList justifyContent="center" p="4">
                <Tab>Login as Patient</Tab>
                <Tab isDisabled>Login as Doctor</Tab>
              </TabList>
              <TabPanels w={"100%"}>
                <TabPanel>{renderStep()}</TabPanel>
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
  setphoneNumber,
  handleSubmit,
  isLoading,
  toast,
}) => {
  const handleWhatsAppAuth = async () => {
    try {
      const result = await oauth("WHATSAPP");

      if (!result.success) {
        toast({
          title: "Authentication Failed",
          description: result.response.errorMessage,
          status: "error",
          duration: 5000,
          isClosable: true,
          position: "top",
        });
        return;
      }
     
      console.log(result);
      setphoneNumber();
    } catch (error) {
      console.error("WhatsApp Auth Error:", error);
      toast({
        title: "Unexpected Error",
        description: "Something went wrong. Please try again later.",
        status: "error",
        duration: 5000,
        isClosable: true,
        position: "top",
      });
    }
  };

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
          onChange={(e) => setphoneNumber(e.target.value)}
        />
      </InputGroup>
      <Button
        colorScheme="orange"
        width="100%"
        mb="4"
        onClick={handleSubmit}
        isLoading={isLoading}
      >
        Request OTP
      </Button>

      <Button
        leftIcon={<FaWhatsapp />}
        colorScheme="green"
        variant="solid"
        width="100%"
        size="md"
        onClick={handleWhatsAppAuth}
      >
        Authenticate with WhatsApp
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
  setphoneNumber,
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
          setphoneNumber();
        }}
      >
        Use Diffrent Phone Number
      </Button>
    </Box>
  );
};

export default Login;
