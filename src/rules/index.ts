import { allowedUserRoles } from '@hooks/auth';
import { and, shield } from 'graphql-shield';

export default shield(
  {
    Query: {
      getUsers: allowedUserRoles(and, ['ADMIN']),
    },
  },
  { allowExternalErrors: true }
);
