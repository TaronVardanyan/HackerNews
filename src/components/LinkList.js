import Link from './Link';
import React from 'react';
import { useQuery } from '@apollo/client';
import { FEED_QUERY } from "../graphql/query";

const LinkList = () => {
    const { data } = useQuery(FEED_QUERY);

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