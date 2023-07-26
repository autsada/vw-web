import { GraphQLClient } from "graphql-request"

const { API_URL, NODE_ENV } = process.env

const apiURL = NODE_ENV === "development" ? "http://localhost:4000" : API_URL
export const client = new GraphQLClient(`${apiURL}/graphql`, {
  headers: {
    "Content-Type": "application/json",
  },
})
