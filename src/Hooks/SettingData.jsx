import { useQuery } from "@tanstack/react-query"; // Adjust the import according to your project structure
import { GET } from "../Controllers/ApiControllers";

const getData = async () => {
   const res = await GET(`get_configurations`);

  //const res = await fetch('https://clinicmanagement.techashna.com/api/v1/get_configurations');
  console.log(res)
  return res.data;
    //const json = await res.json();
   // return json.data; // Return the 'data' array from the response
};

const useSettingsData = () => {
  const {
    isLoading: settingsLoading,
    data: settingsData,
    error: settingsError,
  } = useQuery({
    queryKey: ["settings"],
    queryFn: getData,
  });
  return { settingsData, settingsLoading, settingsError };
};

export default useSettingsData;
