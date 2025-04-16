import { Prisma } from '@prisma/client';

export const softDeleteMiddleware: Prisma.Middleware = async (params, next) => {
  // const softDeleteModels = ['User', 'Venue', 'Account'];
  // if (
  //   ['findMany', 'findFirst', 'findUnique'].includes(params.action) &&
  //   softDeleteModels.includes(params.model!)
  // ) {
  //   if (!params.args?.includeDeleted) {
  //     params.args = {
  //       ...params.args,
  //       isDeleted: false,
  //     };
  //   } else {
  //     delete params.args.includeDeleted;
  //   }
  // }
  return next(params);
};
