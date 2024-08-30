import { createRoot } from "react-dom/client";
import { StrictMode } from "react";
import { ApolloProvider } from "@apollo/client";
import App from "@/App";
import { client } from "@/graphql";

import "./styles/style.css";
import "antd/dist/reset.css";

createRoot(document.getElementById("root")!).render(
  <StrictMode>
    <ApolloProvider client={client}>
      <App />
    </ApolloProvider>
  </StrictMode>
);
