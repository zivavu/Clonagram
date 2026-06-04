const ENDPOINT = 'https://graphql.lottiefiles.com/2022-08';

export interface LottieAnimation {
   id: string;
   name: string;
   jsonUrl: string;
   bgColor: string;
}

async function gql(query: string, variables: Record<string, unknown>): Promise<unknown> {
   const res = await fetch(ENDPOINT, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ query, variables }),
   });
   const json = await res.json();
   return json.data;
}

const FEATURED_QUERY = `
   query Featured($first: Int!) {
      featuredPublicAnimations(first: $first) {
         edges { node { id name jsonUrl bgColor } }
      }
   }
`;

const SEARCH_QUERY = `
   query Search($query: String!, $first: Int!) {
      searchPublicAnimations(query: $query, first: $first) {
         edges { node { id name jsonUrl bgColor } }
      }
   }
`;

type AnimationEdge = { node: LottieAnimation };

export async function fetchFeaturedAnimations(count = 24): Promise<LottieAnimation[]> {
   const data = (await gql(FEATURED_QUERY, { first: count })) as {
      featuredPublicAnimations: { edges: AnimationEdge[] };
   };
   return data.featuredPublicAnimations.edges.map(e => e.node);
}

export async function searchAnimations(query: string, count = 24): Promise<LottieAnimation[]> {
   const data = (await gql(SEARCH_QUERY, { query, first: count })) as {
      searchPublicAnimations: { edges: AnimationEdge[] };
   };
   return data.searchPublicAnimations.edges.map(e => e.node);
}
