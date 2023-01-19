import { Configuration, OpenAIApi } from "openai";
// import Stripe from "stripe";

// const { STRIPE_SECRET_KEY } = process.env;

// if (!STRIPE_SECRET_KEY) {
//   throw new Error("No Stripe secret key provided.");
// }

// export const STRIPE = new Stripe(
//   STRIPE_SECRET_KEY,
//   {
//     apiVersion: "2022-08-01",
//   }
// );

// if (!process.env.AUTH0_SECRET) {
//   throw new Error("No Auth0 secret provided.");
// }

// export const { AUTH0_SECRET } = process.env;


/**
 * OpenAI config and client.
 */

export const { OPENAI_API_KEY, TWITTER_BEARER_TOKEN } = process.env;

if (!OPENAI_API_KEY) {
  throw new Error("OPENAI_API_KEY is not defined.");
}

export const OPENAI_CONFIG = new Configuration({
  apiKey: OPENAI_API_KEY,
});

export const OPENAI = new OpenAIApi(OPENAI_CONFIG);