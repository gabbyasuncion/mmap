import { useEffect, useState } from "react";

import Input from "@mui/joy/Input";
import Button from "@mui/joy/Button";
import { generateRecommendationsAction } from "../actions/generateRecommendationsAction";

import styled from "@emotion/styled";
import { getUserInfoAction } from "../actions/getUserInfoAction";

import { createPlaylistAction } from "../actions/createPlaylistAction";
import { Spotify } from "react-spotify-embed";

const StyledButton = styled(Button)`
  margin: 16px;
  width: 200px;
`;

const StyledInput = styled(Input)`
  margin-bottom: 10px;
  width: 500px;
`;

const Container = styled.div`
  flex-direction: column;
  display: flex;
  font-size: 24pt;
  align-items: center;
`;

const PlaylistGenerator = () => {
  const [seedPhrase, setSeedPhrase] = useState("");
  const [userId, setUserId] = useState("");
  const [username, setUsername] = useState("Music Lover");
  const [playlistURL, setPlaylistURL] = useState<string | undefined>("");

  const generatePlaylist = async (phrase: string) => {
    let tracks;
    try {
      const resp = await generateRecommendationsAction(phrase);
      tracks = resp.trackURIs;
    } catch (err) {
      console.log(err);
    }

    try {
      const url = await createPlaylistAction({
        userId,
        name: seedPhrase,
        description: seedPhrase,
        tracks,
      });
      setPlaylistURL(url);
    } catch (err) {
      console.log(err);
    }
  };

  const reset = () => {
    setSeedPhrase("");
    setPlaylistURL("");
  };

  useEffect(() => {
    const getUserInfo = async () => {
      const accessToken = localStorage.getItem("access_token");

      if (accessToken) {
        try {
          const userInfo = await getUserInfoAction();
          setUserId(userInfo.id);
          setUsername(userInfo.display_name);
        } catch (err) {
          setUsername("Music Lover");
          console.log(err);
        }
      }
    };

    getUserInfo();
  }, []);

  return (
    <Container>
      {playlistURL ? (
        <>
          I made you a playlist!
          <StyledButton variant="soft" size="lg" onClick={() => reset()}>
            Make another?
          </StyledButton>
          <Spotify link={playlistURL} width="500px" height="700px" />
        </>
      ) : (
        <>
          Hey {username}! Generate a playlist with a phrase:
          <StyledInput
            placeholder="I'm feeling main character energy today."
            variant="soft"
            size="lg"
            onChange={(e) => setSeedPhrase(e.target.value)}
          />
          <StyledButton
            variant="soft"
            size="lg"
            onClick={() => generatePlaylist(seedPhrase)}
          >
            Make me a playlist!
          </StyledButton>
        </>
      )}
    </Container>
  );
};

export default PlaylistGenerator;
