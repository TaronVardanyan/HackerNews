import Link from './Link';
import React from 'react';
import { useQuery } from '@apollo/client';
import { FEED_QUERY } from "../graphql/query";
import { NEW_LINKS_SUBSCRIPTION , NEW_VOTES_SUBSCRIPTION} from "../graphql/subscription";

const LinkList = () => {
    const { data, subscribeToMore } = useQuery(FEED_QUERY);

    subscribeToMore({
        document: NEW_LINKS_SUBSCRIPTION,
        updateQuery: (prev, { subscriptionData }) => {
            if (!subscriptionData.data) return prev;
            const newLink = subscriptionData.data.newLink;
            const exists = prev.feed.links.find(
                ({ id }) => id === newLink.id
            );
            if (exists) return prev;

            return Object.assign({}, prev, {
                feed: {
                    links: [newLink, ...prev.feed.links],
                    count: prev.feed.links.length + 1,
                    __typename: prev.feed.__typename
                }
            });
        }
    });

    subscribeToMore({
        document: NEW_VOTES_SUBSCRIPTION
    });

    return (
        <div>
            {data && (
                <>
                    {data.feed.links.map((link, index) => (
                        <Link key={link.id} link={link} index={index} />
                    ))}
                </>
            )}
        </div>
    );
};

export default LinkList;