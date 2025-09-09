import axios from "axios";
import GenerateToken from "./token";
//const api = "https://localhost:44324/api/auth";
 const api = "https://siwandoctorapi.onrender.com/api/auth";
const handleSessionExpiration = (error) => {
  if (
    error.response &&
    error.response.data &&
    error.response.data.response === 401 &&
    error.response.data.status === false &&
    error.response.data.message === "Session expired. Please log in again."
  ) {
    console.error(error.response.data.message);
    setTimeout(() => {
      localStorage.removeItem("user");
      window.location.href = "/login";
    }, 2000);

    return {
      sessionExpired: true,
      message: "Session expired. Please log-in again.",
    };
  }

  throw error.response.data;
};

const GET2 = async (endPoint) => {
  var config = {
    method: "get",
    maxBodyLength: Infinity,
    url: `${api}/${endPoint}`,
  };
  try {
    const response = await axios(config);
    return response.data;
  } catch (error) {
    console.error(error);
    throw new Error(error);
  }
};

const ADD2 = async (token, endPoint, data) => {
  var config = {
    method: "post",
    maxBodyLength: Infinity,
    url: `${api}/${endPoint}`,
    headers: {
      Authorization: GenerateToken(token),
      Accept: "*/*",
      "Content-Type": "multipart/form-data",
    },
    data: data,
  };
  try {
    const response = await axios(config);
    console.log(response.data);
    return response.data;
  } catch (error) {
    console.error(error);
    return handleSessionExpiration(error);
  }
};
const ADDMulti2 = async (token, url, data) => {
  var config = {
    method: "post",
    maxBodyLength: Infinity,
    url: url,
    headers: {
      Authorization: GenerateToken(token),
      "Content-Type": "multipart/form-data",
    },
    data: data,
  };
  try {
    const response = await axios(config);

    return response.data;
  } catch (error) {
    console.error(error);
    return handleSessionExpiration(error);
  }
};

const UPDATE2 = async (token, endPoint, data) => {
  var config = {
    method: "post",
    maxBodyLength: Infinity,
    url: `${api}/${endPoint}`,
    headers: {
      Authorization: GenerateToken(token),
      "Content-Type": "multipart/form-data",
    },
    data: data,
  };
  try {
    const response = await axios(config);
    return response.data;
  } catch (error) {
    console.error(error);
    return handleSessionExpiration(error);
  }
};

const DELETE2 = async (token, endPoint, data) => {
  var config = {
    method: "delete",
    maxBodyLength: Infinity,
    url: `${api}/${endPoint}`,
    headers: {
      Authorization: GenerateToken(token),
      "Content-Type": "multipart/form-data",
    },
    data: data,
  };
  try {
    const response = await axios(config);
    console.log(response.data);
    return response.data;
  } catch (error) {
    console.error(error);
    return handleSessionExpiration(error);
  }
};

const UPLOAD2 = async (token, url, data) => {
  var config = {
    method: "post",
    maxBodyLength: Infinity,
    url: url,
    headers: {
      Authorization: GenerateToken(token),
      "Content-Type": "multipart/form-data",
    },
    data: data,
  };
  try {
    const response = await axios(config);

    return response.data;
  } catch (error) {
    console.error(error);
    return handleSessionExpiration(error);
  }
};

export { GET2, ADD2, DELETE2, UPDATE2, UPLOAD2, ADDMulti2 };
