import { twitterClient } from "../twitter-client";

export function updateTwitterStatus(status: string) {
  return twitterClient.v2.tweet(status);
}
