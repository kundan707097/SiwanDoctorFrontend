import { GET2 as GET } from "./ApiControllers2";
export const updateUserLocalStorage = async (userID) => {
  try {
    const res = await GET(`get_user/${userID}`);
    if (res.status === true) {
      const user = { ...res.data, token: user.token };
      console.log(user);
      localStorage.setItem("user", JSON.stringify(user));
    } else {
      console.error(
        "Failed to update user data:",
        res.message || "Unknown error"
      );
    }
  } catch (error) {
    console.error("Error updating user data:", error.message);
  }
};
