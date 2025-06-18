import { request, gql } from "graphql-request";

const endpoint = "https://gql.hashnode.com";

const query = gql`
  query {
    publication(host: "dakshsawhneyy.hashnode.dev") {
      posts(first: 10) {
        edges {
          node {
            title
            brief
            slug
            coverImage {
              url
            }
            publishedAt
          }
        }
      }
    }
  }
`;

export const fetchBlogs = async () => {
  try {
    const res = await request(endpoint, query);
    return res.publication.posts.edges.map(edge => edge.node); // flatten the edges
  } catch (error) {
    console.error("Blog fetch failed:", error);
    return [];
  }
};