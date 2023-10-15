import {
  Handler,
  HandlerEvent,
  HandlerContext,
  schedule,
} from "@netlify/functions";
import { getPhrases } from "../../services/phrases";
import { updateTwitterStatus } from "../../utils/updateTwitterStatus";
import { getTwitterIndex, updateTwitterIndex } from "../../services/settings";

const myHandler: Handler = async (
  event: HandlerEvent,
  context: HandlerContext,
) => {
  let twitterIndex = await getTwitterIndex();
  const phrases = (await getPhrases()) as string[][];
  if (twitterIndex >= phrases.length) {
    twitterIndex = twitterIndex % phrases.length;
  }
  const status = phrases?.[twitterIndex]?.[0] || "";
  if (status.trim() !== "") await updateTwitterStatus(status);

  await updateTwitterIndex(twitterIndex + 1);

  return { statusCode: 200 };
};

// const handler = schedule('@hourly', myHandler)
const handler = schedule("* * * * *", myHandler);

export { handler };
