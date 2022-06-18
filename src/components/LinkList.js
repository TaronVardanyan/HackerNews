import Link from './Link';
import React from 'react';
import { useQuery, gql } from '@apollo/client';

const FEED_QUERY = gql`
  {
    feed {
      id
      links {
        id
        createdAt
        url
        description
      }
    }
  }
`;

const LinkList = () => {
    const { data, loading } = useQuery(FEED_QUERY);

    return loading ? <div>Loading...</div> : (<div>
        {data ? data.feed.links.map((link) => (
            <Link key={link.id} link={link} />
        )) : <div>There is no any link submitted!</div>}
    </div>);
};

export default LinkList;