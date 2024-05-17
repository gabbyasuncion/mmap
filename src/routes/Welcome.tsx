// utils
import * as auth from "../authUtils";

// styling / components
import "../App.css";
import Button from "@mui/joy/Button";
import { useEffect } from "react";

const Welcome = () => {
  useEffect(() => {
    const cacheToken = async () => {
      const params = new URLSearchParams(window.location.search);
      const code = params.get("code");
      const at = localStorage.getItem("access_token");

      if (code) {
        const tokenInfo = await auth.generateAccessToken(code);
        auth.saveToken(tokenInfo);

        const url = new URL(window.location.href);
        url.searchParams.delete("code");
        document.location = `${auth.mmapBaseURL}/playlist`;
      }
    };

    cacheToken();
  }, []);

  const handleAuth = async () => {
    const params = new URLSearchParams(window.location.search);
    let code = params.get("code");

    if (!code) {
      try {
        await auth.redirectToSpotifyAuthFlow();
        const params = new URLSearchParams(window.location.search);
        code = params.get("code");
      } catch (err) {
        console.error(err);
      }
    }
  };

  return (
    <>
      <Button variant="soft" onClick={handleAuth}>
        Login to Spotify
      </Button>
    </>
  );
};

export default Welcome;
