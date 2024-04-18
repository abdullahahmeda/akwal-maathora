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
  const phrases = (await getPhrases()) as string[][];
  let twitterIndex = await getTwitterIndex();
  let hasPosted = false;
  while (!hasPosted) {
    if (twitterIndex >= phrases.length) {
      twitterIndex = twitterIndex % phrases.length;
    }
    const status = phrases?.[twitterIndex]?.[0] || "";
    if (status.trim() !== "") {
      try {
        await updateTwitterStatus(status);
        hasPosted = true;
      } catch (error) {
        // Do nothing
      }
    }

    await updateTwitterIndex(++twitterIndex);
  }

  return { statusCode: 200 };
};

export const handler = myHandler;
// const handler = schedule("@hourly", myHandler);

// export { handler };
