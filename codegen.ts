import type { CodegenConfig } from "@graphql-codegen/cli"

const config: CodegenConfig = {
  schema: process.env.API_URL
    ? `${process.env.API_URL}/graphql`
    : "http://localhost:4000/graphql",
  //   documents: ["src/**/*.tsx"],
  generates: {
    "./graphql/codegen/": {
      preset: "client",
    },
  },
}
export default config
