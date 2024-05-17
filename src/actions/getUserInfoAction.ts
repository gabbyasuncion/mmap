import { customFetch } from "./actionUtils";

export const getUserInfoAction = async (): Promise<any> => {
  const at = localStorage.getItem("access_token");
  try {
    const profile = await customFetch("https://api.spotify.com/v1/me", {
      method: "GET",
      headers: { Authorization: `Bearer ${at}` },
    });
    return profile;
  } catch (err) {
    console.log(err);
  }
};
