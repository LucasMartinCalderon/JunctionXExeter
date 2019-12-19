import ApolloClient from 'apollo-boost';
import gql from 'graphql-tag';
import config from '../../config';

const client = new ApolloClient({
    uri: config.GRAPHQL_BASE_URL
});

/**
 * You can try these out at http://localhost:1337/graphql
 */

export const getStaticContent = () => {
    return client
        .query({
            query: gql`
                query {
                    textfields {
                        key
                        content
                    }
                    mediafields {
                        key
                        media {
                            url
                            public_id
                        }
                    }
                }
            `
        })
};
/* Add any content for additional content types here */
export const getDynamicContent = () => {
    return client.query({
        query: gql`
            query {
                partners {
                    name
                    logo
                    link
                }
            }
        `
    });
};
