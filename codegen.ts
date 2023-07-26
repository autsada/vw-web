import type { CodegenConfig } from "@graphql-codegen/cli"

const config: CodegenConfig = {
  schema: "http://localhost:4000/graphql",
  //   documents: ["src/**/*.tsx"],
  generates: {
    "./graphql/codegen/": {
      preset: "client",
    },
  },
}
export default config
