import Link from './Link';
import React from 'react';
import { useQuery } from '@apollo/client';
import { LINKS_PER_PAGE } from '../constants';
import { useLocation, useNavigate } from 'react-router-dom';
import { FEED_QUERY } from "../graphql/query";
import { NEW_LINKS_SUBSCRIPTION , NEW_VOTES_SUBSCRIPTION} from "../graphql/subscription";

const LinkList = () => {
    const location = useLocation();
    const navigate = useNavigate();
    const isNewPage = location.pathname.includes(
        'new'
    );
    const pageIndexParams = location.pathname.split(
        '/'
    );
    const page = parseInt(
        pageIndexParams[pageIndexParams.length - 1]
    );

    const getQueryVariables = (isNewPage, page) => {
        const skip = isNewPage ? (page - 1) * LINKS_PER_PAGE : 0;
        const take = isNewPage ? LINKS_PER_PAGE : 100;
        const orderBy = { createdAt: 'desc' };
        return { take, skip, orderBy };
    };

    const pageIndex = page ? (page - 1) * LINKS_PER_PAGE : 0;

    const {
        data,
        subscribeToMore,
        loading,
        error,
    } = useQuery(FEED_QUERY, {
        variables: getQueryVariables(isNewPage, page),
    });

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

    const getLinksToRender = (isNewPage, data) => {
        if (isNewPage) {
            return data.feed.links;
        }
        const rankedLinks = data.feed.links.slice();
        rankedLinks.sort(
            (l1, l2) => l2.votes.length - l1.votes.length
        );
        return rankedLinks;
    };

    return (
        <>
            {loading && <p>Loading...</p>}
            {error && <pre>{JSON.stringify(error, null, 2)}</pre>}
            {data && (
                <>
                    {getLinksToRender(isNewPage, data).map(
                        (link, index) => (
                            <Link
                                key={link.id}
                                link={link}
                                index={index + pageIndex}
                            />
                        )
                    )}
                    {isNewPage && (
                        <div className="flex ml4 mv3 gray">
                            <div
                                className="pointer mr2"
                                onClick={() => {
                                    if (page > 1) {
                                        navigate(`/new/${page - 1}`);
                                    }
                                }}
                            >
                                Previous
                            </div>
                            <div
                                className="pointer"
                                onClick={() => {
                                    if (
                                        page <=
                                        data.feed.count / LINKS_PER_PAGE
                                    ) {
                                        const nextPage = page + 1;
                                        navigate(`/new/${nextPage}`);
                                    }
                                }}
                            >
                                Next
                            </div>
                        </div>
                    )}
                </>
            )}
        </>
    );
};

export default LinkList;