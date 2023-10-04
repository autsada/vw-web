import { GraphQLClient } from "graphql-request"

const apiURL = process.env.API_URL || "http://localhost:4000"
export const client = new GraphQLClient(`${apiURL}/graphql`, {
  headers: {
    "Content-Type": "application/json",
  },
})
