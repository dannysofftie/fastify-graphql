import type { GraphQLResolveInfo, GraphQLScalarType, GraphQLScalarTypeConfig } from 'graphql';
import type { MercuriusContext } from 'mercurius';
export type Maybe<T> = T | null;
export type Exact<T extends { [key: string]: unknown }> = { [K in keyof T]: T[K] };
export type MakeOptional<T, K extends keyof T> = Omit<T, K> & { [SubKey in K]?: Maybe<T[SubKey]> };
export type MakeMaybe<T, K extends keyof T> = Omit<T, K> & { [SubKey in K]: Maybe<T[SubKey]> };
export type ResolverFn<TResult, TParent, TContext, TArgs> = (parent: TParent, args: TArgs, context: TContext, info: GraphQLResolveInfo) => Promise<import('mercurius-codegen').DeepPartial<TResult>> | import('mercurius-codegen').DeepPartial<TResult>;
export type RequireFields<T, K extends keyof T> = { [X in Exclude<keyof T, K>]?: T[X] } & { [P in K]-?: NonNullable<T[P]> };
/** All built-in and custom scalars, mapped to their actual values */
export type Scalars = {
  ID: string;
  String: string;
  Boolean: boolean;
  Int: number;
  Float: number;
  JSON: any;
  Date: any;
  Number: any;
  Upload: any;
  _FieldSet: any;
};

export type Mutation = {
  __typename?: 'Mutation';
  /** Create account */
  signUp?: Maybe<Account>;
  /** Sign in */
  signIn?: Maybe<ApiResponse>;
};

export type MutationsignUpArgs = {
  input: SignUpInput;
};

export type MutationsignInArgs = {
  input: SignInInput;
};

export type Query = {
  __typename?: 'Query';
  /** Get registred users */
  getUsers?: Maybe<Array<Maybe<Account>>>;
  /** Get created and generated posts */
  getPosts?: Maybe<Array<Maybe<Account>>>;
};

export type Error = {
  __typename?: 'Error';
  field: Scalars['String'];
  message: Scalars['String'];
};

export type ApiResponse = {
  __typename?: 'ApiResponse';
  message?: Maybe<Scalars['String']>;
  error?: Maybe<Error>;
};

export type Account = {
  __typename?: 'Account';
  id?: Maybe<Scalars['String']>;
  name?: Maybe<Scalars['String']>;
  phone?: Maybe<Scalars['String']>;
  email?: Maybe<Scalars['String']>;
  address?: Maybe<Scalars['String']>;
  idNumber?: Maybe<Scalars['String']>;
  createdAt?: Maybe<Scalars['Date']>;
  updatedAt?: Maybe<Scalars['Date']>;
};

export type TokenPayload = {
  __typename?: 'TokenPayload';
  token?: Maybe<Scalars['String']>;
};

export type SignInResponse = {
  __typename?: 'SignInResponse';
  message?: Maybe<Scalars['String']>;
  user?: Maybe<Account>;
  payload?: Maybe<TokenPayload>;
};

/**
 * end of type definitions
 * beginning of input type definitions
 */
export type SignUpInput = {
  name: Scalars['String'];
  phone: Scalars['String'];
  email?: Maybe<Scalars['String']>;
  password: Scalars['String'];
  address?: Maybe<Scalars['String']>;
  idNumber?: Maybe<Scalars['String']>;
};

export type SignInInput = {
  phone?: Maybe<Scalars['String']>;
  password?: Maybe<Scalars['String']>;
};

/**
 * end of input type definitions
 * beginning of enum definitions
 */
export enum Role {
  SUPER_ADMIN = 'SUPER_ADMIN',
  CLIENT = 'CLIENT',
}

export type WithIndex<TObject> = TObject & Record<string, any>;
export type ResolversObject<TObject> = WithIndex<TObject>;

export type ResolverTypeWrapper<T> = Promise<T> | T;

export type ResolverWithResolve<TResult, TParent, TContext, TArgs> = {
  resolve: ResolverFn<TResult, TParent, TContext, TArgs>;
};

export type LegacyStitchingResolver<TResult, TParent, TContext, TArgs> = {
  fragment: string;
  resolve: ResolverFn<TResult, TParent, TContext, TArgs>;
};

export type NewStitchingResolver<TResult, TParent, TContext, TArgs> = {
  selectionSet: string;
  resolve: ResolverFn<TResult, TParent, TContext, TArgs>;
};
export type StitchingResolver<TResult, TParent, TContext, TArgs> = LegacyStitchingResolver<TResult, TParent, TContext, TArgs> | NewStitchingResolver<TResult, TParent, TContext, TArgs>;
export type Resolver<TResult, TParent = {}, TContext = {}, TArgs = {}> = ResolverFn<TResult, TParent, TContext, TArgs> | ResolverWithResolve<TResult, TParent, TContext, TArgs> | StitchingResolver<TResult, TParent, TContext, TArgs>;

export type SubscriptionSubscribeFn<TResult, TParent, TContext, TArgs> = (parent: TParent, args: TArgs, context: TContext, info: GraphQLResolveInfo) => AsyncIterator<TResult> | Promise<AsyncIterator<TResult>>;

export type SubscriptionResolveFn<TResult, TParent, TContext, TArgs> = (parent: TParent, args: TArgs, context: TContext, info: GraphQLResolveInfo) => TResult | Promise<TResult>;

export interface SubscriptionSubscriberObject<TResult, TKey extends string, TParent, TContext, TArgs> {
  subscribe: SubscriptionSubscribeFn<{ [key in TKey]: TResult }, TParent, TContext, TArgs>;
  resolve?: SubscriptionResolveFn<TResult, { [key in TKey]: TResult }, TContext, TArgs>;
}

export interface SubscriptionResolverObject<TResult, TParent, TContext, TArgs> {
  subscribe: SubscriptionSubscribeFn<any, TParent, TContext, TArgs>;
  resolve: SubscriptionResolveFn<TResult, any, TContext, TArgs>;
}

export type SubscriptionObject<TResult, TKey extends string, TParent, TContext, TArgs> = SubscriptionSubscriberObject<TResult, TKey, TParent, TContext, TArgs> | SubscriptionResolverObject<TResult, TParent, TContext, TArgs>;

export type SubscriptionResolver<TResult, TKey extends string, TParent = {}, TContext = {}, TArgs = {}> = ((...args: any[]) => SubscriptionObject<TResult, TKey, TParent, TContext, TArgs>) | SubscriptionObject<TResult, TKey, TParent, TContext, TArgs>;

export type TypeResolveFn<TTypes, TParent = {}, TContext = {}> = (parent: TParent, context: TContext, info: GraphQLResolveInfo) => Maybe<TTypes> | Promise<Maybe<TTypes>>;

export type IsTypeOfResolverFn<T = {}, TContext = {}> = (obj: T, context: TContext, info: GraphQLResolveInfo) => boolean | Promise<boolean>;

export type NextResolverFn<T> = () => Promise<T>;

export type DirectiveResolverFn<TResult = {}, TParent = {}, TContext = {}, TArgs = {}> = (next: NextResolverFn<TResult>, parent: TParent, args: TArgs, context: TContext, info: GraphQLResolveInfo) => TResult | Promise<TResult>;

/** Mapping between all available schema types and the resolvers types */
export type ResolversTypes = ResolversObject<{
  Mutation: ResolverTypeWrapper<{}>;
  Query: ResolverTypeWrapper<{}>;
  JSON: ResolverTypeWrapper<Scalars['JSON']>;
  Date: ResolverTypeWrapper<Scalars['Date']>;
  Number: ResolverTypeWrapper<Scalars['Number']>;
  Upload: ResolverTypeWrapper<Scalars['Upload']>;
  Error: ResolverTypeWrapper<Error>;
  String: ResolverTypeWrapper<Scalars['String']>;
  ApiResponse: ResolverTypeWrapper<ApiResponse>;
  Account: ResolverTypeWrapper<Account>;
  TokenPayload: ResolverTypeWrapper<TokenPayload>;
  SignInResponse: ResolverTypeWrapper<SignInResponse>;
  SignUpInput: SignUpInput;
  SignInInput: SignInInput;
  Role: Role;
  Boolean: ResolverTypeWrapper<Scalars['Boolean']>;
}>;

/** Mapping between all available schema types and the resolvers parents */
export type ResolversParentTypes = ResolversObject<{
  Mutation: {};
  Query: {};
  JSON: Scalars['JSON'];
  Date: Scalars['Date'];
  Number: Scalars['Number'];
  Upload: Scalars['Upload'];
  Error: Error;
  String: Scalars['String'];
  ApiResponse: ApiResponse;
  Account: Account;
  TokenPayload: TokenPayload;
  SignInResponse: SignInResponse;
  SignUpInput: SignUpInput;
  SignInInput: SignInInput;
  Boolean: Scalars['Boolean'];
}>;

export type MutationResolvers<ContextType = MercuriusContext, ParentType extends ResolversParentTypes['Mutation'] = ResolversParentTypes['Mutation']> = ResolversObject<{
  signUp?: Resolver<Maybe<ResolversTypes['Account']>, ParentType, ContextType, RequireFields<MutationsignUpArgs, 'input'>>;
  signIn?: Resolver<Maybe<ResolversTypes['ApiResponse']>, ParentType, ContextType, RequireFields<MutationsignInArgs, 'input'>>;
}>;

export type QueryResolvers<ContextType = MercuriusContext, ParentType extends ResolversParentTypes['Query'] = ResolversParentTypes['Query']> = ResolversObject<{
  getUsers?: Resolver<Maybe<Array<Maybe<ResolversTypes['Account']>>>, ParentType, ContextType>;
  getPosts?: Resolver<Maybe<Array<Maybe<ResolversTypes['Account']>>>, ParentType, ContextType>;
}>;

export interface JSONScalarConfig extends GraphQLScalarTypeConfig<ResolversTypes['JSON'], any> {
  name: 'JSON';
}

export interface DateScalarConfig extends GraphQLScalarTypeConfig<ResolversTypes['Date'], any> {
  name: 'Date';
}

export interface NumberScalarConfig extends GraphQLScalarTypeConfig<ResolversTypes['Number'], any> {
  name: 'Number';
}

export interface UploadScalarConfig extends GraphQLScalarTypeConfig<ResolversTypes['Upload'], any> {
  name: 'Upload';
}

export type ErrorResolvers<ContextType = MercuriusContext, ParentType extends ResolversParentTypes['Error'] = ResolversParentTypes['Error']> = ResolversObject<{
  field?: Resolver<ResolversTypes['String'], ParentType, ContextType>;
  message?: Resolver<ResolversTypes['String'], ParentType, ContextType>;
  isTypeOf?: IsTypeOfResolverFn<ParentType, ContextType>;
}>;

export type ApiResponseResolvers<ContextType = MercuriusContext, ParentType extends ResolversParentTypes['ApiResponse'] = ResolversParentTypes['ApiResponse']> = ResolversObject<{
  message?: Resolver<Maybe<ResolversTypes['String']>, ParentType, ContextType>;
  error?: Resolver<Maybe<ResolversTypes['Error']>, ParentType, ContextType>;
  isTypeOf?: IsTypeOfResolverFn<ParentType, ContextType>;
}>;

export type AccountResolvers<ContextType = MercuriusContext, ParentType extends ResolversParentTypes['Account'] = ResolversParentTypes['Account']> = ResolversObject<{
  id?: Resolver<Maybe<ResolversTypes['String']>, ParentType, ContextType>;
  name?: Resolver<Maybe<ResolversTypes['String']>, ParentType, ContextType>;
  phone?: Resolver<Maybe<ResolversTypes['String']>, ParentType, ContextType>;
  email?: Resolver<Maybe<ResolversTypes['String']>, ParentType, ContextType>;
  address?: Resolver<Maybe<ResolversTypes['String']>, ParentType, ContextType>;
  idNumber?: Resolver<Maybe<ResolversTypes['String']>, ParentType, ContextType>;
  createdAt?: Resolver<Maybe<ResolversTypes['Date']>, ParentType, ContextType>;
  updatedAt?: Resolver<Maybe<ResolversTypes['Date']>, ParentType, ContextType>;
  isTypeOf?: IsTypeOfResolverFn<ParentType, ContextType>;
}>;

export type TokenPayloadResolvers<ContextType = MercuriusContext, ParentType extends ResolversParentTypes['TokenPayload'] = ResolversParentTypes['TokenPayload']> = ResolversObject<{
  token?: Resolver<Maybe<ResolversTypes['String']>, ParentType, ContextType>;
  isTypeOf?: IsTypeOfResolverFn<ParentType, ContextType>;
}>;

export type SignInResponseResolvers<ContextType = MercuriusContext, ParentType extends ResolversParentTypes['SignInResponse'] = ResolversParentTypes['SignInResponse']> = ResolversObject<{
  message?: Resolver<Maybe<ResolversTypes['String']>, ParentType, ContextType>;
  user?: Resolver<Maybe<ResolversTypes['Account']>, ParentType, ContextType>;
  payload?: Resolver<Maybe<ResolversTypes['TokenPayload']>, ParentType, ContextType>;
  isTypeOf?: IsTypeOfResolverFn<ParentType, ContextType>;
}>;

export type Resolvers<ContextType = MercuriusContext> = ResolversObject<{
  Mutation?: MutationResolvers<ContextType>;
  Query?: QueryResolvers<ContextType>;
  JSON?: GraphQLScalarType;
  Date?: GraphQLScalarType;
  Number?: GraphQLScalarType;
  Upload?: GraphQLScalarType;
  Error?: ErrorResolvers<ContextType>;
  ApiResponse?: ApiResponseResolvers<ContextType>;
  Account?: AccountResolvers<ContextType>;
  TokenPayload?: TokenPayloadResolvers<ContextType>;
  SignInResponse?: SignInResponseResolvers<ContextType>;
}>;

/**
 * @deprecated
 * Use "Resolvers" root object instead. If you wish to get "IResolvers", add "typesPrefix: I" to your config.
 */
export type IResolvers<ContextType = MercuriusContext> = Resolvers<ContextType>;

type Loader<TReturn, TObj, TParams, TContext> = (
  queries: Array<{
    obj: TObj;
    params: TParams;
  }>,
  context: TContext & {
    reply: import('fastify').FastifyReply;
  }
) => Promise<Array<import('mercurius-codegen').DeepPartial<TReturn>>>;
type LoaderResolver<TReturn, TObj, TParams, TContext> =
  | Loader<TReturn, TObj, TParams, TContext>
  | {
      loader: Loader<TReturn, TObj, TParams, TContext>;
      opts?: {
        cache?: boolean;
      };
    };
export interface Loaders<TContext = import('mercurius').MercuriusContext & { reply: import('fastify').FastifyReply }> {
  Error?: {
    field?: LoaderResolver<Scalars['String'], Error, {}, TContext>;
    message?: LoaderResolver<Scalars['String'], Error, {}, TContext>;
  };

  ApiResponse?: {
    message?: LoaderResolver<Maybe<Scalars['String']>, ApiResponse, {}, TContext>;
    error?: LoaderResolver<Maybe<Error>, ApiResponse, {}, TContext>;
  };

  Account?: {
    id?: LoaderResolver<Maybe<Scalars['String']>, Account, {}, TContext>;
    name?: LoaderResolver<Maybe<Scalars['String']>, Account, {}, TContext>;
    phone?: LoaderResolver<Maybe<Scalars['String']>, Account, {}, TContext>;
    email?: LoaderResolver<Maybe<Scalars['String']>, Account, {}, TContext>;
    address?: LoaderResolver<Maybe<Scalars['String']>, Account, {}, TContext>;
    idNumber?: LoaderResolver<Maybe<Scalars['String']>, Account, {}, TContext>;
    createdAt?: LoaderResolver<Maybe<Scalars['Date']>, Account, {}, TContext>;
    updatedAt?: LoaderResolver<Maybe<Scalars['Date']>, Account, {}, TContext>;
  };

  TokenPayload?: {
    token?: LoaderResolver<Maybe<Scalars['String']>, TokenPayload, {}, TContext>;
  };

  SignInResponse?: {
    message?: LoaderResolver<Maybe<Scalars['String']>, SignInResponse, {}, TContext>;
    user?: LoaderResolver<Maybe<Account>, SignInResponse, {}, TContext>;
    payload?: LoaderResolver<Maybe<TokenPayload>, SignInResponse, {}, TContext>;
  };
}
declare module 'mercurius' {
  interface IResolvers extends Resolvers<import('mercurius').MercuriusContext> {}
  interface MercuriusLoaders extends Loaders {}
}
