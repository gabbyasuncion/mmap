import { customFetch } from "./actionUtils";

interface CreatePlaylistProps {
  userId: string;
  name: string;
  description: string;
  tracks: string[];
}

export const createPlaylistAction = async ({
  userId,
  name,
  description,
  tracks,
}: CreatePlaylistProps): Promise<string | undefined> => {
  const at = localStorage.getItem("access_token");

  let playlist;
  try {
    playlist = await customFetch(
      `https://api.spotify.com/v1/users/${userId}/playlists`,
      {
        method: "POST",
        body: JSON.stringify({ name, description }),
        headers: { Authorization: `Bearer ${at}` },
      }
    );
  } catch (err) {
    console.log(err);
    return undefined;
  }

  if (playlist.id) {
    try {
      await customFetch(
        `https://api.spotify.com/v1/playlists/${playlist.id}/tracks`,
        {
          method: "POST",
          headers: { Authorization: `Bearer ${at}` },
          body: JSON.stringify({ uris: tracks }),
        }
      );
      return playlist.external_urls.spotify;
    } catch (err) {
      console.log(err);
    }
  }

  return undefined;
};
