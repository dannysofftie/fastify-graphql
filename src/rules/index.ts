import { isAdmin } from '@hooks/auth';
import { and, shield } from 'graphql-shield';

export default shield(
    {
        Query: {
            getUsers: and(isAdmin),
        },
    },
    { allowExternalErrors: true }
);
