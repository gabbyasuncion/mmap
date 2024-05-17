const clientId = import.meta.env.VITE_SPOTIFY_CLIENT_ID;
export const mmapBaseURL = import.meta.env.VITE_MMAP_CENTRAL_URL;
const redirectURI = `${mmapBaseURL}/authorized`;
const spotifyAuthUrl = new URL("https://accounts.spotify.com/authorize");

// user granted permissions we need to make playlists
const scope =
  "playlist-modify-public playlist-modify-private ugc-image-upload user-read-private user-read-email";

const tokenEndpoint = "https://accounts.spotify.com/api/token";

const generateCodeVerifier = (length: number) => {
  const possible =
    "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789";
  const values = crypto.getRandomValues(new Uint8Array(length));
  return values.reduce((acc, x) => acc + possible[x % possible.length], "");
};

const generateCodeChallenge = async (codeVerifier: string) => {
  // hash code verifier
  const data = new TextEncoder().encode(codeVerifier);
  const digest = await window.crypto.subtle.digest("SHA-256", data);

  // base 64 encode hashed verifier
  return btoa(String.fromCharCode.apply(null, [...new Uint8Array(digest)]))
    .replace(/\+/g, "-")
    .replace(/\//g, "_")
    .replace(/=+$/, "");
};

export const redirectToSpotifyAuthFlow = async () => {
  const verifier = generateCodeVerifier(128);
  const challenge = await generateCodeChallenge(verifier);

  localStorage.setItem("verifier", verifier);

  const params = new URLSearchParams();
  params.append("client_id", clientId ?? "");
  params.append("response_type", "code");
  params.append("redirect_uri", redirectURI);
  params.append("scope", scope);
  params.append("code_challenge_method", "S256");
  params.append("code_challenge", challenge);

  document.location = `${spotifyAuthUrl}?${params.toString()}`;
};

export const generateAccessToken = async (
  code: string | null
): Promise<string> => {
  if (!code) {
    console.error("code is null");
    return "";
  }
  const verifier = localStorage.getItem("verifier");

  console.log({ verifier, clientId, code, redirectURI });
  const params = new URLSearchParams();
  params.append("client_id", clientId ?? "");
  params.append("grant_type", "authorization_code");
  params.append("code", code);
  params.append("redirect_uri", redirectURI);
  params.append("code_verifier", verifier ?? "");

  const result = await fetch(tokenEndpoint, {
    method: "POST",
    headers: { "Content-Type": "application/x-www-form-urlencoded" },
    body: params,
  });

  const tokenInfo = await result.json();
  return tokenInfo;
};

export const saveToken = async (tokenInfo: any) => {
  const { access_token, refresh_token, expires_in } = tokenInfo;
  localStorage.setItem("access_token", access_token);
  localStorage.setItem("refresh_token", refresh_token);
  localStorage.setItem("expires_in", expires_in);

  const now = new Date();
  const expiry = new Date(now.getTime() + expires_in * 1000);
  localStorage.setItem("expires", expiry.toISOString());
};

export const refreshAccessToken = async (rt: string) => {
  const response = await fetch(tokenEndpoint, {
    method: "POST",
    headers: {
      "Content-Type": "application/x-www-form-urlencoded",
    },
    body: new URLSearchParams({
      client_id: clientId,
      grant_type: "refresh_token",
      refresh_token: rt,
    }),
  });

  return await response.json();
};
