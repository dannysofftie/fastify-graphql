import { Role } from '.prisma/client';
import { rule } from 'graphql-shield';
import { RuleAnd, RuleNot, RuleOr } from 'graphql-shield/dist/rules';
import { ShieldRule } from 'graphql-shield/dist/types';
import { MercuriusContext } from 'mercurius';

export const allowedUserRoles = (
  action: (...rules: ShieldRule[]) => RuleAnd | RuleOr | RuleNot,
  roles: Role[] = [
    // line break
    'ADMIN',
    'USER',
  ]
) => {
  const rules = roles.map(role => {
    return rule({ cache: 'no_cache' })(async (_root, _args, ctx: MercuriusContext, _info) => {
      const { id } = ctx.app.plugins.decodeJwtToken(ctx.app, ctx.reply.request);
      if (!id) {
        return false;
      }
      const user = await ctx.app.libs.prisma.user.findUnique({ where: { id } });
      // unverified/disabled accounts
      if (['UNVERIFIED', 'DISABLED'].includes(user.status)) return Error(`Request failed! Your account is ${user.status}!`);
      if (user.role !== role) return false;
      return true;
    });
  });
  return action(...rules);
};
