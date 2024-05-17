import { customFetch } from "./actionUtils";

export const generateRecommendationsAction = async (phrase: string) => {
  try {
    const recs = await customFetch(
      "https://us-east-1.aws.data.mongodb-api.com/app/application-0-dnrkcjg/endpoint/get_recommended_tracks",
      { method: "POST", body: JSON.stringify({ phrase: `${phrase}` }) }
    );
    return recs;
  } catch (err) {
    console.log(err);
  }
};
