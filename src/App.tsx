import "@fontsource/montserrat/700.css";
import "@fontsource/montserrat/400.css";
import "@fontsource/montserrat/300.css";

import * as React from "react";
import {
  ChakraProvider,
  Box,
  VStack,
  Grid,
  Heading,
  Text,
  extendTheme,
} from "@chakra-ui/react";
import { ColorModeSwitcher } from "./ColorModeSwitcher";
import { Logo } from "./Logo";
import Counter from "./donation/Counter";
import { useQuery, useSubscription } from "urql";

const TotalDonationQuery = `
query Query{
  totalDonations
}
`;

const TotalUpdationQuery = `
subscription Subscription {
  totalUpdated {
    total
  }
}
`;

const handleSubscription = (previous: any, newTotal: any) => {
  return newTotal?.totalUpdated?.total;
};
const theme = extendTheme({
  fonts: {
    heading: "Montserrat",
    body: "Montserrat",
  },
});

export const App = () => {
  const [res] = useSubscription(
    { query: TotalUpdationQuery },
    handleSubscription
  );

  const [{ data, fetching, error }] = useQuery({
    query: TotalDonationQuery,
  });

  if (fetching) return <p>Loading...</p>;
  if (error) return <p>Oh no!... {error.message}</p>;
  return (
    <ChakraProvider theme={theme}>
      <Box textAlign="center" fontSize="xl">
        <Grid minH="100vh" p={3} bg={"gray.50"}>
          <ColorModeSwitcher justifySelf="flex-end" />
          <VStack spacing={8}>
            <Logo h="20vmin" pointerEvents="none" />
            <Heading as="h1" size="xl">
              JOIN THE MOVEMENT!
            </Heading>
            <Text fontWeight="light">
              We did it! Now let’s keep going. Come back anytime <br /> you feel
              like removing some trash!
            </Text>
            <Heading as="h2" size="4xl" fontWeight="bold">
              <Counter from={0} to={res.data || data.totalDonations} />
            </Heading>
          </VStack>
        </Grid>
      </Box>
    </ChakraProvider>
  );
};
