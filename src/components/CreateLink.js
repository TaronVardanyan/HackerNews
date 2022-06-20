import { useState } from 'react';
import {gql, useMutation} from '@apollo/client';

//this query should be separated

const CREATE_LINK_MUTATION = gql`
 mutation PostMutation(
    $description: String!
    $url: String!
  ) {
    post(description: $description, url: $url) {
      id
      createdAt
      url
      description
    }
  }
`

const CreateLink = () => {
    const [formState, setFormState] = useState({
        description: '',
        url: ''
    });

    const [createLink] = useMutation(CREATE_LINK_MUTATION, {
        variables: formState
    });

    const handleSubmit = async (e) => {
        e.preventDefault();
        await createLink();
    }

    return (
        <div>
            <form
                onSubmit={handleSubmit}
            >
                <div className="flex flex-column mt3">
                    <input
                        className="mb2"
                        value={formState.description}
                        onChange={(e) =>
                            setFormState({
                                ...formState,
                                description: e.target.value
                            })
                        }
                        type="text"
                        placeholder="A description for the link"
                    />
                    <input
                        className="mb2"
                        value={formState.url}
                        onChange={(e) =>
                            setFormState({
                                ...formState,
                                url: e.target.value
                            })
                        }
                        type="text"
                        placeholder="The URL for the link"
                    />
                </div>
                <button type="submit">Submit</button>
            </form>
        </div>
    );
};

export default CreateLink;