import Link from './Link';
import React from 'react';
import { useQuery } from '@apollo/client';
import { FEED_QUERY } from "../graphql/query";

const LinkList = () => {
    const { data, loading } = useQuery(FEED_QUERY);

    return loading ? <div>Loading...</div> : (<div>
        {data ? data.feed.links.map((link) => (
            <Link key={link.id} link={link} />
        )) : <div>There is no any link submitted!</div>}
    </div>);
};

export default LinkList;