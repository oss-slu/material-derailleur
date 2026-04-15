/**
 * Client
 **/

import * as runtime from './runtime/client.js';
import $Types = runtime.Types; // general types
import $Public = runtime.Types.Public;
import $Utils = runtime.Types.Utils;
import $Extensions = runtime.Types.Extensions;
import $Result = runtime.Types.Result;

export type PrismaPromise<T> = $Public.PrismaPromise<T>;

/**
 * Model Donor
 *
 */
export type Donor = $Result.DefaultSelection<Prisma.$DonorPayload>;
/**
 * Model Program
 *
 */
export type Program = $Result.DefaultSelection<Prisma.$ProgramPayload>;
/**
 * Model DonatedItem
 *
 */
export type DonatedItem = $Result.DefaultSelection<Prisma.$DonatedItemPayload>;
/**
 * Model DonatedItemStatus
 *
 */
export type DonatedItemStatus =
    $Result.DefaultSelection<Prisma.$DonatedItemStatusPayload>;
/**
 * Model User
 *
 */
export type User = $Result.DefaultSelection<Prisma.$UserPayload>;

/**
 * Enums
 */
export namespace $Enums {
    export const Role: {
        ADMIN: 'ADMIN';
        DONOR: 'DONOR';
        TIER_ONE: 'TIER_ONE';
        TIER_TWO: 'TIER_TWO';
        TIER_THREE: 'TIER_THREE';
    };

    export type Role = (typeof Role)[keyof typeof Role];

    export const UserStatus: {
        PENDING: 'PENDING';
        ACTIVE: 'ACTIVE';
        SUSPENDED: 'SUSPENDED';
    };

    export type UserStatus = (typeof UserStatus)[keyof typeof UserStatus];
}

export type Role = $Enums.Role;

export const Role: typeof $Enums.Role;

export type UserStatus = $Enums.UserStatus;

export const UserStatus: typeof $Enums.UserStatus;

/**
 * ##  Prisma Client ʲˢ
 *
 * Type-safe database client for TypeScript & Node.js
 * @example
 * ```
 * const prisma = new PrismaClient({
 *   adapter: new PrismaPg({ connectionString: process.env.DATABASE_URL })
 * })
 * // Fetch zero or more Donors
 * const donors = await prisma.donor.findMany()
 * ```
 *
 *
 * Read more in our [docs](https://pris.ly/d/client).
 */
export class PrismaClient<
    ClientOptions extends Prisma.PrismaClientOptions =
        Prisma.PrismaClientOptions,
    const U = 'log' extends keyof ClientOptions
        ? ClientOptions['log'] extends Array<
              Prisma.LogLevel | Prisma.LogDefinition
          >
            ? Prisma.GetEvents<ClientOptions['log']>
            : never
        : never,
    ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs,
> {
    [K: symbol]: { types: Prisma.TypeMap<ExtArgs>['other'] };

    /**
     * ##  Prisma Client ʲˢ
     *
     * Type-safe database client for TypeScript & Node.js
     * @example
     * ```
     * const prisma = new PrismaClient({
     *   adapter: new PrismaPg({ connectionString: process.env.DATABASE_URL })
     * })
     * // Fetch zero or more Donors
     * const donors = await prisma.donor.findMany()
     * ```
     *
     *
     * Read more in our [docs](https://pris.ly/d/client).
     */

    constructor(
        optionsArg?: Prisma.Subset<ClientOptions, Prisma.PrismaClientOptions>,
    );
    $on<V extends U>(
        eventType: V,
        callback: (
            event: V extends 'query' ? Prisma.QueryEvent : Prisma.LogEvent,
        ) => void,
    ): PrismaClient;

    /**
     * Connect with the database
     */
    $connect(): $Utils.JsPromise<void>;

    /**
     * Disconnect from the database
     */
    $disconnect(): $Utils.JsPromise<void>;

    /**
     * Executes a prepared raw query and returns the number of affected rows.
     * @example
     * ```
     * const result = await prisma.$executeRaw`UPDATE User SET cool = ${true} WHERE email = ${'user@email.com'};`
     * ```
     *
     * Read more in our [docs](https://pris.ly/d/raw-queries).
     */
    $executeRaw<T = unknown>(
        query: TemplateStringsArray | Prisma.Sql,
        ...values: any[]
    ): Prisma.PrismaPromise<number>;

    /**
     * Executes a raw query and returns the number of affected rows.
     * Susceptible to SQL injections, see documentation.
     * @example
     * ```
     * const result = await prisma.$executeRawUnsafe('UPDATE User SET cool = $1 WHERE email = $2 ;', true, 'user@email.com')
     * ```
     *
     * Read more in our [docs](https://pris.ly/d/raw-queries).
     */
    $executeRawUnsafe<T = unknown>(
        query: string,
        ...values: any[]
    ): Prisma.PrismaPromise<number>;

    /**
     * Performs a prepared raw query and returns the `SELECT` data.
     * @example
     * ```
     * const result = await prisma.$queryRaw`SELECT * FROM User WHERE id = ${1} OR email = ${'user@email.com'};`
     * ```
     *
     * Read more in our [docs](https://pris.ly/d/raw-queries).
     */
    $queryRaw<T = unknown>(
        query: TemplateStringsArray | Prisma.Sql,
        ...values: any[]
    ): Prisma.PrismaPromise<T>;

    /**
     * Performs a raw query and returns the `SELECT` data.
     * Susceptible to SQL injections, see documentation.
     * @example
     * ```
     * const result = await prisma.$queryRawUnsafe('SELECT * FROM User WHERE id = $1 OR email = $2;', 1, 'user@email.com')
     * ```
     *
     * Read more in our [docs](https://pris.ly/d/raw-queries).
     */
    $queryRawUnsafe<T = unknown>(
        query: string,
        ...values: any[]
    ): Prisma.PrismaPromise<T>;

    /**
     * Allows the running of a sequence of read/write operations that are guaranteed to either succeed or fail as a whole.
     * @example
     * ```
     * const [george, bob, alice] = await prisma.$transaction([
     *   prisma.user.create({ data: { name: 'George' } }),
     *   prisma.user.create({ data: { name: 'Bob' } }),
     *   prisma.user.create({ data: { name: 'Alice' } }),
     * ])
     * ```
     *
     * Read more in our [docs](https://www.prisma.io/docs/orm/prisma-client/queries/transactions).
     */
    $transaction<P extends Prisma.PrismaPromise<any>[]>(
        arg: [...P],
        options?: { isolationLevel?: Prisma.TransactionIsolationLevel },
    ): $Utils.JsPromise<runtime.Types.Utils.UnwrapTuple<P>>;

    $transaction<R>(
        fn: (
            prisma: Omit<PrismaClient, runtime.ITXClientDenyList>,
        ) => $Utils.JsPromise<R>,
        options?: {
            maxWait?: number;
            timeout?: number;
            isolationLevel?: Prisma.TransactionIsolationLevel;
        },
    ): $Utils.JsPromise<R>;

    $extends: $Extensions.ExtendsHook<
        'extends',
        Prisma.TypeMapCb<ClientOptions>,
        ExtArgs,
        $Utils.Call<
            Prisma.TypeMapCb<ClientOptions>,
            {
                extArgs: ExtArgs;
            }
        >
    >;

    /**
     * `prisma.donor`: Exposes CRUD operations for the **Donor** model.
     * Example usage:
     * ```ts
     * // Fetch zero or more Donors
     * const donors = await prisma.donor.findMany()
     * ```
     */
    get donor(): Prisma.DonorDelegate<ExtArgs, ClientOptions>;

    /**
     * `prisma.program`: Exposes CRUD operations for the **Program** model.
     * Example usage:
     * ```ts
     * // Fetch zero or more Programs
     * const programs = await prisma.program.findMany()
     * ```
     */
    get program(): Prisma.ProgramDelegate<ExtArgs, ClientOptions>;

    /**
     * `prisma.donatedItem`: Exposes CRUD operations for the **DonatedItem** model.
     * Example usage:
     * ```ts
     * // Fetch zero or more DonatedItems
     * const donatedItems = await prisma.donatedItem.findMany()
     * ```
     */
    get donatedItem(): Prisma.DonatedItemDelegate<ExtArgs, ClientOptions>;

    /**
     * `prisma.donatedItemStatus`: Exposes CRUD operations for the **DonatedItemStatus** model.
     * Example usage:
     * ```ts
     * // Fetch zero or more DonatedItemStatuses
     * const donatedItemStatuses = await prisma.donatedItemStatus.findMany()
     * ```
     */
    get donatedItemStatus(): Prisma.DonatedItemStatusDelegate<
        ExtArgs,
        ClientOptions
    >;

    /**
     * `prisma.user`: Exposes CRUD operations for the **User** model.
     * Example usage:
     * ```ts
     * // Fetch zero or more Users
     * const users = await prisma.user.findMany()
     * ```
     */
    get user(): Prisma.UserDelegate<ExtArgs, ClientOptions>;
}

export namespace Prisma {
    export import DMMF = runtime.DMMF;

    export type PrismaPromise<T> = $Public.PrismaPromise<T>;

    /**
     * Validator
     */
    export import validator = runtime.Public.validator;

    /**
     * Prisma Errors
     */
    export import PrismaClientKnownRequestError = runtime.PrismaClientKnownRequestError;
    export import PrismaClientUnknownRequestError = runtime.PrismaClientUnknownRequestError;
    export import PrismaClientRustPanicError = runtime.PrismaClientRustPanicError;
    export import PrismaClientInitializationError = runtime.PrismaClientInitializationError;
    export import PrismaClientValidationError = runtime.PrismaClientValidationError;

    /**
     * Re-export of sql-template-tag
     */
    export import sql = runtime.sqltag;
    export import empty = runtime.empty;
    export import join = runtime.join;
    export import raw = runtime.raw;
    export import Sql = runtime.Sql;

    /**
     * Decimal.js
     */
    export import Decimal = runtime.Decimal;

    export type DecimalJsLike = runtime.DecimalJsLike;

    /**
     * Extensions
     */
    export import Extension = $Extensions.UserArgs;
    export import getExtensionContext = runtime.Extensions.getExtensionContext;
    export import Args = $Public.Args;
    export import Payload = $Public.Payload;
    export import Result = $Public.Result;
    export import Exact = $Public.Exact;

    /**
     * Prisma Client JS version: 7.7.0
     * Query Engine version: 75cbdc1eb7150937890ad5465d861175c6624711
     */
    export type PrismaVersion = {
        client: string;
        engine: string;
    };

    export const prismaVersion: PrismaVersion;

    /**
     * Utility Types
     */

    export import Bytes = runtime.Bytes;
    export import JsonObject = runtime.JsonObject;
    export import JsonArray = runtime.JsonArray;
    export import JsonValue = runtime.JsonValue;
    export import InputJsonObject = runtime.InputJsonObject;
    export import InputJsonArray = runtime.InputJsonArray;
    export import InputJsonValue = runtime.InputJsonValue;

    /**
     * Types of the values used to represent different kinds of `null` values when working with JSON fields.
     *
     * @see https://www.prisma.io/docs/concepts/components/prisma-client/working-with-fields/working-with-json-fields#filtering-on-a-json-field
     */
    namespace NullTypes {
        /**
         * Type of `Prisma.DbNull`.
         *
         * You cannot use other instances of this class. Please use the `Prisma.DbNull` value.
         *
         * @see https://www.prisma.io/docs/concepts/components/prisma-client/working-with-fields/working-with-json-fields#filtering-on-a-json-field
         */
        class DbNull {
            private DbNull: never;
            private constructor();
        }

        /**
         * Type of `Prisma.JsonNull`.
         *
         * You cannot use other instances of this class. Please use the `Prisma.JsonNull` value.
         *
         * @see https://www.prisma.io/docs/concepts/components/prisma-client/working-with-fields/working-with-json-fields#filtering-on-a-json-field
         */
        class JsonNull {
            private JsonNull: never;
            private constructor();
        }

        /**
         * Type of `Prisma.AnyNull`.
         *
         * You cannot use other instances of this class. Please use the `Prisma.AnyNull` value.
         *
         * @see https://www.prisma.io/docs/concepts/components/prisma-client/working-with-fields/working-with-json-fields#filtering-on-a-json-field
         */
        class AnyNull {
            private AnyNull: never;
            private constructor();
        }
    }

    /**
     * Helper for filtering JSON entries that have `null` on the database (empty on the db)
     *
     * @see https://www.prisma.io/docs/concepts/components/prisma-client/working-with-fields/working-with-json-fields#filtering-on-a-json-field
     */
    export const DbNull: NullTypes.DbNull;

    /**
     * Helper for filtering JSON entries that have JSON `null` values (not empty on the db)
     *
     * @see https://www.prisma.io/docs/concepts/components/prisma-client/working-with-fields/working-with-json-fields#filtering-on-a-json-field
     */
    export const JsonNull: NullTypes.JsonNull;

    /**
     * Helper for filtering JSON entries that are `Prisma.DbNull` or `Prisma.JsonNull`
     *
     * @see https://www.prisma.io/docs/concepts/components/prisma-client/working-with-fields/working-with-json-fields#filtering-on-a-json-field
     */
    export const AnyNull: NullTypes.AnyNull;

    type SelectAndInclude = {
        select: any;
        include: any;
    };

    type SelectAndOmit = {
        select: any;
        omit: any;
    };

    /**
     * Get the type of the value, that the Promise holds.
     */
    export type PromiseType<T extends PromiseLike<any>> =
        T extends PromiseLike<infer U> ? U : T;

    /**
     * Get the return type of a function which returns a Promise.
     */
    export type PromiseReturnType<
        T extends (...args: any) => $Utils.JsPromise<any>,
    > = PromiseType<ReturnType<T>>;

    /**
     * From T, pick a set of properties whose keys are in the union K
     */
    type Prisma__Pick<T, K extends keyof T> = {
        [P in K]: T[P];
    };

    export type Enumerable<T> = T | Array<T>;

    export type RequiredKeys<T> = {
        [K in keyof T]-?: {} extends Prisma__Pick<T, K> ? never : K;
    }[keyof T];

    export type TruthyKeys<T> = keyof {
        [K in keyof T as T[K] extends false | undefined | null ? never : K]: K;
    };

    export type TrueKeys<T> = TruthyKeys<Prisma__Pick<T, RequiredKeys<T>>>;

    /**
     * Subset
     * @desc From `T` pick properties that exist in `U`. Simple version of Intersection
     */
    export type Subset<T, U> = {
        [key in keyof T]: key extends keyof U ? T[key] : never;
    };

    /**
     * SelectSubset
     * @desc From `T` pick properties that exist in `U`. Simple version of Intersection.
     * Additionally, it validates, if both select and include are present. If the case, it errors.
     */
    export type SelectSubset<T, U> = {
        [key in keyof T]: key extends keyof U ? T[key] : never;
    } & (T extends SelectAndInclude
        ? 'Please either choose `select` or `include`.'
        : T extends SelectAndOmit
          ? 'Please either choose `select` or `omit`.'
          : {});

    /**
     * Subset + Intersection
     * @desc From `T` pick properties that exist in `U` and intersect `K`
     */
    export type SubsetIntersection<T, U, K> = {
        [key in keyof T]: key extends keyof U ? T[key] : never;
    } & K;

    type Without<T, U> = { [P in Exclude<keyof T, keyof U>]?: never };

    /**
     * XOR is needed to have a real mutually exclusive union type
     * https://stackoverflow.com/questions/42123407/does-typescript-support-mutually-exclusive-types
     */
    type XOR<T, U> = T extends object
        ? U extends object
            ? (Without<T, U> & U) | (Without<U, T> & T)
            : U
        : T;

    /**
     * Is T a Record?
     */
    type IsObject<T extends any> =
        T extends Array<any>
            ? False
            : T extends Date
              ? False
              : T extends Uint8Array
                ? False
                : T extends BigInt
                  ? False
                  : T extends object
                    ? True
                    : False;

    /**
     * If it's T[], return T
     */
    export type UnEnumerate<T extends unknown> =
        T extends Array<infer U> ? U : T;

    /**
     * From ts-toolbelt
     */

    type __Either<O extends object, K extends Key> = Omit<O, K> &
        {
            // Merge all but K
            [P in K]: Prisma__Pick<O, P & keyof O>; // With K possibilities
        }[K];

    type EitherStrict<O extends object, K extends Key> = Strict<__Either<O, K>>;

    type EitherLoose<O extends object, K extends Key> = ComputeRaw<
        __Either<O, K>
    >;

    type _Either<O extends object, K extends Key, strict extends Boolean> = {
        1: EitherStrict<O, K>;
        0: EitherLoose<O, K>;
    }[strict];

    type Either<
        O extends object,
        K extends Key,
        strict extends Boolean = 1,
    > = O extends unknown ? _Either<O, K, strict> : never;

    export type Union = any;

    type PatchUndefined<O extends object, O1 extends object> = {
        [K in keyof O]: O[K] extends undefined ? At<O1, K> : O[K];
    } & {};

    /** Helper Types for "Merge" **/
    export type IntersectOf<U extends Union> = (
        U extends unknown ? (k: U) => void : never
    ) extends (k: infer I) => void
        ? I
        : never;

    export type Overwrite<O extends object, O1 extends object> = {
        [K in keyof O]: K extends keyof O1 ? O1[K] : O[K];
    } & {};

    type _Merge<U extends object> = IntersectOf<
        Overwrite<
            U,
            {
                [K in keyof U]-?: At<U, K>;
            }
        >
    >;

    type Key = string | number | symbol;
    type AtBasic<O extends object, K extends Key> = K extends keyof O
        ? O[K]
        : never;
    type AtStrict<O extends object, K extends Key> = O[K & keyof O];
    type AtLoose<O extends object, K extends Key> = O extends unknown
        ? AtStrict<O, K>
        : never;
    export type At<
        O extends object,
        K extends Key,
        strict extends Boolean = 1,
    > = {
        1: AtStrict<O, K>;
        0: AtLoose<O, K>;
    }[strict];

    export type ComputeRaw<A extends any> = A extends Function
        ? A
        : {
              [K in keyof A]: A[K];
          } & {};

    export type OptionalFlat<O> = {
        [K in keyof O]?: O[K];
    } & {};

    type _Record<K extends keyof any, T> = {
        [P in K]: T;
    };

    // cause typescript not to expand types and preserve names
    type NoExpand<T> = T extends unknown ? T : never;

    // this type assumes the passed object is entirely optional
    type AtLeast<O extends object, K extends string> = NoExpand<
        O extends unknown
            ?
                  | (K extends keyof O ? { [P in K]: O[P] } & O : O)
                  | ({ [P in keyof O as P extends K ? P : never]-?: O[P] } & O)
            : never
    >;

    type _Strict<U, _U = U> = U extends unknown
        ? U & OptionalFlat<_Record<Exclude<Keys<_U>, keyof U>, never>>
        : never;

    export type Strict<U extends object> = ComputeRaw<_Strict<U>>;
    /** End Helper Types for "Merge" **/

    export type Merge<U extends object> = ComputeRaw<_Merge<Strict<U>>>;

    /**
  A [[Boolean]]
  */
    export type Boolean = True | False;

    // /**
    // 1
    // */
    export type True = 1;

    /**
  0
  */
    export type False = 0;

    export type Not<B extends Boolean> = {
        0: 1;
        1: 0;
    }[B];

    export type Extends<A1 extends any, A2 extends any> = [A1] extends [never]
        ? 0 // anything `never` is false
        : A1 extends A2
          ? 1
          : 0;

    export type Has<U extends Union, U1 extends Union> = Not<
        Extends<Exclude<U1, U>, U1>
    >;

    export type Or<B1 extends Boolean, B2 extends Boolean> = {
        0: {
            0: 0;
            1: 1;
        };
        1: {
            0: 1;
            1: 1;
        };
    }[B1][B2];

    export type Keys<U extends Union> = U extends unknown ? keyof U : never;

    type Cast<A, B> = A extends B ? A : B;

    export const type: unique symbol;

    /**
     * Used by group by
     */

    export type GetScalarType<T, O> = O extends object
        ? {
              [P in keyof T]: P extends keyof O ? O[P] : never;
          }
        : never;

    type FieldPaths<
        T,
        U = Omit<T, '_avg' | '_sum' | '_count' | '_min' | '_max'>,
    > = IsObject<T> extends True ? U : T;

    type GetHavingFields<T> = {
        [K in keyof T]: Or<
            Or<Extends<'OR', K>, Extends<'AND', K>>,
            Extends<'NOT', K>
        > extends True
            ? // infer is only needed to not hit TS limit
              // based on the brilliant idea of Pierre-Antoine Mills
              // https://github.com/microsoft/TypeScript/issues/30188#issuecomment-478938437
              T[K] extends infer TK
                ? GetHavingFields<
                      UnEnumerate<TK> extends object
                          ? Merge<UnEnumerate<TK>>
                          : never
                  >
                : never
            : {} extends FieldPaths<T[K]>
              ? never
              : K;
    }[keyof T];

    /**
     * Convert tuple to union
     */
    type _TupleToUnion<T> = T extends (infer E)[] ? E : never;
    type TupleToUnion<K extends readonly any[]> = _TupleToUnion<K>;
    type MaybeTupleToUnion<T> = T extends any[] ? TupleToUnion<T> : T;

    /**
     * Like `Pick`, but additionally can also accept an array of keys
     */
    type PickEnumerable<
        T,
        K extends Enumerable<keyof T> | keyof T,
    > = Prisma__Pick<T, MaybeTupleToUnion<K>>;

    /**
     * Exclude all keys with underscores
     */
    type ExcludeUnderscoreKeys<T extends string> = T extends `_${string}`
        ? never
        : T;

    export type FieldRef<Model, FieldType> = runtime.FieldRef<Model, FieldType>;

    type FieldRefInputType<Model, FieldType> = Model extends never
        ? never
        : FieldRef<Model, FieldType>;

    export const ModelName: {
        Donor: 'Donor';
        Program: 'Program';
        DonatedItem: 'DonatedItem';
        DonatedItemStatus: 'DonatedItemStatus';
        User: 'User';
    };

    export type ModelName = (typeof ModelName)[keyof typeof ModelName];

    interface TypeMapCb<ClientOptions = {}> extends $Utils.Fn<
        { extArgs: $Extensions.InternalArgs },
        $Utils.Record<string, any>
    > {
        returns: Prisma.TypeMap<
            this['params']['extArgs'],
            ClientOptions extends { omit: infer OmitOptions } ? OmitOptions : {}
        >;
    }

    export type TypeMap<
        ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs,
        GlobalOmitOptions = {},
    > = {
        globalOmitOptions: {
            omit: GlobalOmitOptions;
        };
        meta: {
            modelProps:
                | 'donor'
                | 'program'
                | 'donatedItem'
                | 'donatedItemStatus'
                | 'user';
            txIsolationLevel: Prisma.TransactionIsolationLevel;
        };
        model: {
            Donor: {
                payload: Prisma.$DonorPayload<ExtArgs>;
                fields: Prisma.DonorFieldRefs;
                operations: {
                    findUnique: {
                        args: Prisma.DonorFindUniqueArgs<ExtArgs>;
                        result: $Utils.PayloadToResult<Prisma.$DonorPayload> | null;
                    };
                    findUniqueOrThrow: {
                        args: Prisma.DonorFindUniqueOrThrowArgs<ExtArgs>;
                        result: $Utils.PayloadToResult<Prisma.$DonorPayload>;
                    };
                    findFirst: {
                        args: Prisma.DonorFindFirstArgs<ExtArgs>;
                        result: $Utils.PayloadToResult<Prisma.$DonorPayload> | null;
                    };
                    findFirstOrThrow: {
                        args: Prisma.DonorFindFirstOrThrowArgs<ExtArgs>;
                        result: $Utils.PayloadToResult<Prisma.$DonorPayload>;
                    };
                    findMany: {
                        args: Prisma.DonorFindManyArgs<ExtArgs>;
                        result: $Utils.PayloadToResult<Prisma.$DonorPayload>[];
                    };
                    create: {
                        args: Prisma.DonorCreateArgs<ExtArgs>;
                        result: $Utils.PayloadToResult<Prisma.$DonorPayload>;
                    };
                    createMany: {
                        args: Prisma.DonorCreateManyArgs<ExtArgs>;
                        result: BatchPayload;
                    };
                    createManyAndReturn: {
                        args: Prisma.DonorCreateManyAndReturnArgs<ExtArgs>;
                        result: $Utils.PayloadToResult<Prisma.$DonorPayload>[];
                    };
                    delete: {
                        args: Prisma.DonorDeleteArgs<ExtArgs>;
                        result: $Utils.PayloadToResult<Prisma.$DonorPayload>;
                    };
                    update: {
                        args: Prisma.DonorUpdateArgs<ExtArgs>;
                        result: $Utils.PayloadToResult<Prisma.$DonorPayload>;
                    };
                    deleteMany: {
                        args: Prisma.DonorDeleteManyArgs<ExtArgs>;
                        result: BatchPayload;
                    };
                    updateMany: {
                        args: Prisma.DonorUpdateManyArgs<ExtArgs>;
                        result: BatchPayload;
                    };
                    updateManyAndReturn: {
                        args: Prisma.DonorUpdateManyAndReturnArgs<ExtArgs>;
                        result: $Utils.PayloadToResult<Prisma.$DonorPayload>[];
                    };
                    upsert: {
                        args: Prisma.DonorUpsertArgs<ExtArgs>;
                        result: $Utils.PayloadToResult<Prisma.$DonorPayload>;
                    };
                    aggregate: {
                        args: Prisma.DonorAggregateArgs<ExtArgs>;
                        result: $Utils.Optional<AggregateDonor>;
                    };
                    groupBy: {
                        args: Prisma.DonorGroupByArgs<ExtArgs>;
                        result: $Utils.Optional<DonorGroupByOutputType>[];
                    };
                    count: {
                        args: Prisma.DonorCountArgs<ExtArgs>;
                        result:
                            | $Utils.Optional<DonorCountAggregateOutputType>
                            | number;
                    };
                };
            };
            Program: {
                payload: Prisma.$ProgramPayload<ExtArgs>;
                fields: Prisma.ProgramFieldRefs;
                operations: {
                    findUnique: {
                        args: Prisma.ProgramFindUniqueArgs<ExtArgs>;
                        result: $Utils.PayloadToResult<Prisma.$ProgramPayload> | null;
                    };
                    findUniqueOrThrow: {
                        args: Prisma.ProgramFindUniqueOrThrowArgs<ExtArgs>;
                        result: $Utils.PayloadToResult<Prisma.$ProgramPayload>;
                    };
                    findFirst: {
                        args: Prisma.ProgramFindFirstArgs<ExtArgs>;
                        result: $Utils.PayloadToResult<Prisma.$ProgramPayload> | null;
                    };
                    findFirstOrThrow: {
                        args: Prisma.ProgramFindFirstOrThrowArgs<ExtArgs>;
                        result: $Utils.PayloadToResult<Prisma.$ProgramPayload>;
                    };
                    findMany: {
                        args: Prisma.ProgramFindManyArgs<ExtArgs>;
                        result: $Utils.PayloadToResult<Prisma.$ProgramPayload>[];
                    };
                    create: {
                        args: Prisma.ProgramCreateArgs<ExtArgs>;
                        result: $Utils.PayloadToResult<Prisma.$ProgramPayload>;
                    };
                    createMany: {
                        args: Prisma.ProgramCreateManyArgs<ExtArgs>;
                        result: BatchPayload;
                    };
                    createManyAndReturn: {
                        args: Prisma.ProgramCreateManyAndReturnArgs<ExtArgs>;
                        result: $Utils.PayloadToResult<Prisma.$ProgramPayload>[];
                    };
                    delete: {
                        args: Prisma.ProgramDeleteArgs<ExtArgs>;
                        result: $Utils.PayloadToResult<Prisma.$ProgramPayload>;
                    };
                    update: {
                        args: Prisma.ProgramUpdateArgs<ExtArgs>;
                        result: $Utils.PayloadToResult<Prisma.$ProgramPayload>;
                    };
                    deleteMany: {
                        args: Prisma.ProgramDeleteManyArgs<ExtArgs>;
                        result: BatchPayload;
                    };
                    updateMany: {
                        args: Prisma.ProgramUpdateManyArgs<ExtArgs>;
                        result: BatchPayload;
                    };
                    updateManyAndReturn: {
                        args: Prisma.ProgramUpdateManyAndReturnArgs<ExtArgs>;
                        result: $Utils.PayloadToResult<Prisma.$ProgramPayload>[];
                    };
                    upsert: {
                        args: Prisma.ProgramUpsertArgs<ExtArgs>;
                        result: $Utils.PayloadToResult<Prisma.$ProgramPayload>;
                    };
                    aggregate: {
                        args: Prisma.ProgramAggregateArgs<ExtArgs>;
                        result: $Utils.Optional<AggregateProgram>;
                    };
                    groupBy: {
                        args: Prisma.ProgramGroupByArgs<ExtArgs>;
                        result: $Utils.Optional<ProgramGroupByOutputType>[];
                    };
                    count: {
                        args: Prisma.ProgramCountArgs<ExtArgs>;
                        result:
                            | $Utils.Optional<ProgramCountAggregateOutputType>
                            | number;
                    };
                };
            };
            DonatedItem: {
                payload: Prisma.$DonatedItemPayload<ExtArgs>;
                fields: Prisma.DonatedItemFieldRefs;
                operations: {
                    findUnique: {
                        args: Prisma.DonatedItemFindUniqueArgs<ExtArgs>;
                        result: $Utils.PayloadToResult<Prisma.$DonatedItemPayload> | null;
                    };
                    findUniqueOrThrow: {
                        args: Prisma.DonatedItemFindUniqueOrThrowArgs<ExtArgs>;
                        result: $Utils.PayloadToResult<Prisma.$DonatedItemPayload>;
                    };
                    findFirst: {
                        args: Prisma.DonatedItemFindFirstArgs<ExtArgs>;
                        result: $Utils.PayloadToResult<Prisma.$DonatedItemPayload> | null;
                    };
                    findFirstOrThrow: {
                        args: Prisma.DonatedItemFindFirstOrThrowArgs<ExtArgs>;
                        result: $Utils.PayloadToResult<Prisma.$DonatedItemPayload>;
                    };
                    findMany: {
                        args: Prisma.DonatedItemFindManyArgs<ExtArgs>;
                        result: $Utils.PayloadToResult<Prisma.$DonatedItemPayload>[];
                    };
                    create: {
                        args: Prisma.DonatedItemCreateArgs<ExtArgs>;
                        result: $Utils.PayloadToResult<Prisma.$DonatedItemPayload>;
                    };
                    createMany: {
                        args: Prisma.DonatedItemCreateManyArgs<ExtArgs>;
                        result: BatchPayload;
                    };
                    createManyAndReturn: {
                        args: Prisma.DonatedItemCreateManyAndReturnArgs<ExtArgs>;
                        result: $Utils.PayloadToResult<Prisma.$DonatedItemPayload>[];
                    };
                    delete: {
                        args: Prisma.DonatedItemDeleteArgs<ExtArgs>;
                        result: $Utils.PayloadToResult<Prisma.$DonatedItemPayload>;
                    };
                    update: {
                        args: Prisma.DonatedItemUpdateArgs<ExtArgs>;
                        result: $Utils.PayloadToResult<Prisma.$DonatedItemPayload>;
                    };
                    deleteMany: {
                        args: Prisma.DonatedItemDeleteManyArgs<ExtArgs>;
                        result: BatchPayload;
                    };
                    updateMany: {
                        args: Prisma.DonatedItemUpdateManyArgs<ExtArgs>;
                        result: BatchPayload;
                    };
                    updateManyAndReturn: {
                        args: Prisma.DonatedItemUpdateManyAndReturnArgs<ExtArgs>;
                        result: $Utils.PayloadToResult<Prisma.$DonatedItemPayload>[];
                    };
                    upsert: {
                        args: Prisma.DonatedItemUpsertArgs<ExtArgs>;
                        result: $Utils.PayloadToResult<Prisma.$DonatedItemPayload>;
                    };
                    aggregate: {
                        args: Prisma.DonatedItemAggregateArgs<ExtArgs>;
                        result: $Utils.Optional<AggregateDonatedItem>;
                    };
                    groupBy: {
                        args: Prisma.DonatedItemGroupByArgs<ExtArgs>;
                        result: $Utils.Optional<DonatedItemGroupByOutputType>[];
                    };
                    count: {
                        args: Prisma.DonatedItemCountArgs<ExtArgs>;
                        result:
                            | $Utils.Optional<DonatedItemCountAggregateOutputType>
                            | number;
                    };
                };
            };
            DonatedItemStatus: {
                payload: Prisma.$DonatedItemStatusPayload<ExtArgs>;
                fields: Prisma.DonatedItemStatusFieldRefs;
                operations: {
                    findUnique: {
                        args: Prisma.DonatedItemStatusFindUniqueArgs<ExtArgs>;
                        result: $Utils.PayloadToResult<Prisma.$DonatedItemStatusPayload> | null;
                    };
                    findUniqueOrThrow: {
                        args: Prisma.DonatedItemStatusFindUniqueOrThrowArgs<ExtArgs>;
                        result: $Utils.PayloadToResult<Prisma.$DonatedItemStatusPayload>;
                    };
                    findFirst: {
                        args: Prisma.DonatedItemStatusFindFirstArgs<ExtArgs>;
                        result: $Utils.PayloadToResult<Prisma.$DonatedItemStatusPayload> | null;
                    };
                    findFirstOrThrow: {
                        args: Prisma.DonatedItemStatusFindFirstOrThrowArgs<ExtArgs>;
                        result: $Utils.PayloadToResult<Prisma.$DonatedItemStatusPayload>;
                    };
                    findMany: {
                        args: Prisma.DonatedItemStatusFindManyArgs<ExtArgs>;
                        result: $Utils.PayloadToResult<Prisma.$DonatedItemStatusPayload>[];
                    };
                    create: {
                        args: Prisma.DonatedItemStatusCreateArgs<ExtArgs>;
                        result: $Utils.PayloadToResult<Prisma.$DonatedItemStatusPayload>;
                    };
                    createMany: {
                        args: Prisma.DonatedItemStatusCreateManyArgs<ExtArgs>;
                        result: BatchPayload;
                    };
                    createManyAndReturn: {
                        args: Prisma.DonatedItemStatusCreateManyAndReturnArgs<ExtArgs>;
                        result: $Utils.PayloadToResult<Prisma.$DonatedItemStatusPayload>[];
                    };
                    delete: {
                        args: Prisma.DonatedItemStatusDeleteArgs<ExtArgs>;
                        result: $Utils.PayloadToResult<Prisma.$DonatedItemStatusPayload>;
                    };
                    update: {
                        args: Prisma.DonatedItemStatusUpdateArgs<ExtArgs>;
                        result: $Utils.PayloadToResult<Prisma.$DonatedItemStatusPayload>;
                    };
                    deleteMany: {
                        args: Prisma.DonatedItemStatusDeleteManyArgs<ExtArgs>;
                        result: BatchPayload;
                    };
                    updateMany: {
                        args: Prisma.DonatedItemStatusUpdateManyArgs<ExtArgs>;
                        result: BatchPayload;
                    };
                    updateManyAndReturn: {
                        args: Prisma.DonatedItemStatusUpdateManyAndReturnArgs<ExtArgs>;
                        result: $Utils.PayloadToResult<Prisma.$DonatedItemStatusPayload>[];
                    };
                    upsert: {
                        args: Prisma.DonatedItemStatusUpsertArgs<ExtArgs>;
                        result: $Utils.PayloadToResult<Prisma.$DonatedItemStatusPayload>;
                    };
                    aggregate: {
                        args: Prisma.DonatedItemStatusAggregateArgs<ExtArgs>;
                        result: $Utils.Optional<AggregateDonatedItemStatus>;
                    };
                    groupBy: {
                        args: Prisma.DonatedItemStatusGroupByArgs<ExtArgs>;
                        result: $Utils.Optional<DonatedItemStatusGroupByOutputType>[];
                    };
                    count: {
                        args: Prisma.DonatedItemStatusCountArgs<ExtArgs>;
                        result:
                            | $Utils.Optional<DonatedItemStatusCountAggregateOutputType>
                            | number;
                    };
                };
            };
            User: {
                payload: Prisma.$UserPayload<ExtArgs>;
                fields: Prisma.UserFieldRefs;
                operations: {
                    findUnique: {
                        args: Prisma.UserFindUniqueArgs<ExtArgs>;
                        result: $Utils.PayloadToResult<Prisma.$UserPayload> | null;
                    };
                    findUniqueOrThrow: {
                        args: Prisma.UserFindUniqueOrThrowArgs<ExtArgs>;
                        result: $Utils.PayloadToResult<Prisma.$UserPayload>;
                    };
                    findFirst: {
                        args: Prisma.UserFindFirstArgs<ExtArgs>;
                        result: $Utils.PayloadToResult<Prisma.$UserPayload> | null;
                    };
                    findFirstOrThrow: {
                        args: Prisma.UserFindFirstOrThrowArgs<ExtArgs>;
                        result: $Utils.PayloadToResult<Prisma.$UserPayload>;
                    };
                    findMany: {
                        args: Prisma.UserFindManyArgs<ExtArgs>;
                        result: $Utils.PayloadToResult<Prisma.$UserPayload>[];
                    };
                    create: {
                        args: Prisma.UserCreateArgs<ExtArgs>;
                        result: $Utils.PayloadToResult<Prisma.$UserPayload>;
                    };
                    createMany: {
                        args: Prisma.UserCreateManyArgs<ExtArgs>;
                        result: BatchPayload;
                    };
                    createManyAndReturn: {
                        args: Prisma.UserCreateManyAndReturnArgs<ExtArgs>;
                        result: $Utils.PayloadToResult<Prisma.$UserPayload>[];
                    };
                    delete: {
                        args: Prisma.UserDeleteArgs<ExtArgs>;
                        result: $Utils.PayloadToResult<Prisma.$UserPayload>;
                    };
                    update: {
                        args: Prisma.UserUpdateArgs<ExtArgs>;
                        result: $Utils.PayloadToResult<Prisma.$UserPayload>;
                    };
                    deleteMany: {
                        args: Prisma.UserDeleteManyArgs<ExtArgs>;
                        result: BatchPayload;
                    };
                    updateMany: {
                        args: Prisma.UserUpdateManyArgs<ExtArgs>;
                        result: BatchPayload;
                    };
                    updateManyAndReturn: {
                        args: Prisma.UserUpdateManyAndReturnArgs<ExtArgs>;
                        result: $Utils.PayloadToResult<Prisma.$UserPayload>[];
                    };
                    upsert: {
                        args: Prisma.UserUpsertArgs<ExtArgs>;
                        result: $Utils.PayloadToResult<Prisma.$UserPayload>;
                    };
                    aggregate: {
                        args: Prisma.UserAggregateArgs<ExtArgs>;
                        result: $Utils.Optional<AggregateUser>;
                    };
                    groupBy: {
                        args: Prisma.UserGroupByArgs<ExtArgs>;
                        result: $Utils.Optional<UserGroupByOutputType>[];
                    };
                    count: {
                        args: Prisma.UserCountArgs<ExtArgs>;
                        result:
                            | $Utils.Optional<UserCountAggregateOutputType>
                            | number;
                    };
                };
            };
        };
    } & {
        other: {
            payload: any;
            operations: {
                $executeRaw: {
                    args: [
                        query: TemplateStringsArray | Prisma.Sql,
                        ...values: any[],
                    ];
                    result: any;
                };
                $executeRawUnsafe: {
                    args: [query: string, ...values: any[]];
                    result: any;
                };
                $queryRaw: {
                    args: [
                        query: TemplateStringsArray | Prisma.Sql,
                        ...values: any[],
                    ];
                    result: any;
                };
                $queryRawUnsafe: {
                    args: [query: string, ...values: any[]];
                    result: any;
                };
            };
        };
    };
    export const defineExtension: $Extensions.ExtendsHook<
        'define',
        Prisma.TypeMapCb,
        $Extensions.DefaultArgs
    >;
    export type DefaultPrismaClient = PrismaClient;
    export type ErrorFormat = 'pretty' | 'colorless' | 'minimal';
    export interface PrismaClientOptions {
        /**
         * @default "colorless"
         */
        errorFormat?: ErrorFormat;
        /**
         * @example
         * ```
         * // Shorthand for `emit: 'stdout'`
         * log: ['query', 'info', 'warn', 'error']
         *
         * // Emit as events only
         * log: [
         *   { emit: 'event', level: 'query' },
         *   { emit: 'event', level: 'info' },
         *   { emit: 'event', level: 'warn' }
         *   { emit: 'event', level: 'error' }
         * ]
         *
         * / Emit as events and log to stdout
         * og: [
         *  { emit: 'stdout', level: 'query' },
         *  { emit: 'stdout', level: 'info' },
         *  { emit: 'stdout', level: 'warn' }
         *  { emit: 'stdout', level: 'error' }
         *
         * ```
         * Read more in our [docs](https://pris.ly/d/logging).
         */
        log?: (LogLevel | LogDefinition)[];
        /**
         * The default values for transactionOptions
         * maxWait ?= 2000
         * timeout ?= 5000
         */
        transactionOptions?: {
            maxWait?: number;
            timeout?: number;
            isolationLevel?: Prisma.TransactionIsolationLevel;
        };
        /**
         * Instance of a Driver Adapter, e.g., like one provided by `@prisma/adapter-planetscale`
         */
        adapter?: runtime.SqlDriverAdapterFactory;
        /**
         * Prisma Accelerate URL allowing the client to connect through Accelerate instead of a direct database.
         */
        accelerateUrl?: string;
        /**
         * Global configuration for omitting model fields by default.
         *
         * @example
         * ```
         * const prisma = new PrismaClient({
         *   omit: {
         *     user: {
         *       password: true
         *     }
         *   }
         * })
         * ```
         */
        omit?: Prisma.GlobalOmitConfig;
        /**
         * SQL commenter plugins that add metadata to SQL queries as comments.
         * Comments follow the sqlcommenter format: https://google.github.io/sqlcommenter/
         *
         * @example
         * ```
         * const prisma = new PrismaClient({
         *   adapter,
         *   comments: [
         *     traceContext(),
         *     queryInsights(),
         *   ],
         * })
         * ```
         */
        comments?: runtime.SqlCommenterPlugin[];
    }
    export type GlobalOmitConfig = {
        donor?: DonorOmit;
        program?: ProgramOmit;
        donatedItem?: DonatedItemOmit;
        donatedItemStatus?: DonatedItemStatusOmit;
        user?: UserOmit;
    };

    /* Types for Logging */
    export type LogLevel = 'info' | 'query' | 'warn' | 'error';
    export type LogDefinition = {
        level: LogLevel;
        emit: 'stdout' | 'event';
    };

    export type CheckIsLogLevel<T> = T extends LogLevel ? T : never;

    export type GetLogType<T> = CheckIsLogLevel<
        T extends LogDefinition ? T['level'] : T
    >;

    export type GetEvents<T extends any[]> =
        T extends Array<LogLevel | LogDefinition>
            ? GetLogType<T[number]>
            : never;

    export type QueryEvent = {
        timestamp: Date;
        query: string;
        params: string;
        duration: number;
        target: string;
    };

    export type LogEvent = {
        timestamp: Date;
        message: string;
        target: string;
    };
    /* End Types for Logging */

    export type PrismaAction =
        | 'findUnique'
        | 'findUniqueOrThrow'
        | 'findMany'
        | 'findFirst'
        | 'findFirstOrThrow'
        | 'create'
        | 'createMany'
        | 'createManyAndReturn'
        | 'update'
        | 'updateMany'
        | 'updateManyAndReturn'
        | 'upsert'
        | 'delete'
        | 'deleteMany'
        | 'executeRaw'
        | 'queryRaw'
        | 'aggregate'
        | 'count'
        | 'runCommandRaw'
        | 'findRaw'
        | 'groupBy';

    // tested in getLogLevel.test.ts
    export function getLogLevel(
        log: Array<LogLevel | LogDefinition>,
    ): LogLevel | undefined;

    /**
     * `PrismaClient` proxy available in interactive transactions.
     */
    export type TransactionClient = Omit<
        Prisma.DefaultPrismaClient,
        runtime.ITXClientDenyList
    >;

    export type Datasource = {
        url?: string;
    };

    /**
     * Count Types
     */

    /**
     * Count Type DonorCountOutputType
     */

    export type DonorCountOutputType = {
        donatedItems: number;
    };

    export type DonorCountOutputTypeSelect<
        ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs,
    > = {
        donatedItems?: boolean | DonorCountOutputTypeCountDonatedItemsArgs;
    };

    // Custom InputTypes
    /**
     * DonorCountOutputType without action
     */
    export type DonorCountOutputTypeDefaultArgs<
        ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs,
    > = {
        /**
         * Select specific fields to fetch from the DonorCountOutputType
         */
        select?: DonorCountOutputTypeSelect<ExtArgs> | null;
    };

    /**
     * DonorCountOutputType without action
     */
    export type DonorCountOutputTypeCountDonatedItemsArgs<
        ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs,
    > = {
        where?: DonatedItemWhereInput;
    };

    /**
     * Count Type ProgramCountOutputType
     */

    export type ProgramCountOutputType = {
        donatedItems: number;
    };

    export type ProgramCountOutputTypeSelect<
        ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs,
    > = {
        donatedItems?: boolean | ProgramCountOutputTypeCountDonatedItemsArgs;
    };

    // Custom InputTypes
    /**
     * ProgramCountOutputType without action
     */
    export type ProgramCountOutputTypeDefaultArgs<
        ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs,
    > = {
        /**
         * Select specific fields to fetch from the ProgramCountOutputType
         */
        select?: ProgramCountOutputTypeSelect<ExtArgs> | null;
    };

    /**
     * ProgramCountOutputType without action
     */
    export type ProgramCountOutputTypeCountDonatedItemsArgs<
        ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs,
    > = {
        where?: DonatedItemWhereInput;
    };

    /**
     * Count Type DonatedItemCountOutputType
     */

    export type DonatedItemCountOutputType = {
        statuses: number;
    };

    export type DonatedItemCountOutputTypeSelect<
        ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs,
    > = {
        statuses?: boolean | DonatedItemCountOutputTypeCountStatusesArgs;
    };

    // Custom InputTypes
    /**
     * DonatedItemCountOutputType without action
     */
    export type DonatedItemCountOutputTypeDefaultArgs<
        ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs,
    > = {
        /**
         * Select specific fields to fetch from the DonatedItemCountOutputType
         */
        select?: DonatedItemCountOutputTypeSelect<ExtArgs> | null;
    };

    /**
     * DonatedItemCountOutputType without action
     */
    export type DonatedItemCountOutputTypeCountStatusesArgs<
        ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs,
    > = {
        where?: DonatedItemStatusWhereInput;
    };

    /**
     * Models
     */

    /**
     * Model Donor
     */

    export type AggregateDonor = {
        _count: DonorCountAggregateOutputType | null;
        _avg: DonorAvgAggregateOutputType | null;
        _sum: DonorSumAggregateOutputType | null;
        _min: DonorMinAggregateOutputType | null;
        _max: DonorMaxAggregateOutputType | null;
    };

    export type DonorAvgAggregateOutputType = {
        id: number | null;
    };

    export type DonorSumAggregateOutputType = {
        id: number | null;
    };

    export type DonorMinAggregateOutputType = {
        id: number | null;
        firstName: string | null;
        lastName: string | null;
        contact: string | null;
        email: string | null;
        addressLine1: string | null;
        addressLine2: string | null;
        state: string | null;
        city: string | null;
        zipcode: string | null;
        emailOptIn: boolean | null;
    };

    export type DonorMaxAggregateOutputType = {
        id: number | null;
        firstName: string | null;
        lastName: string | null;
        contact: string | null;
        email: string | null;
        addressLine1: string | null;
        addressLine2: string | null;
        state: string | null;
        city: string | null;
        zipcode: string | null;
        emailOptIn: boolean | null;
    };

    export type DonorCountAggregateOutputType = {
        id: number;
        firstName: number;
        lastName: number;
        contact: number;
        email: number;
        addressLine1: number;
        addressLine2: number;
        state: number;
        city: number;
        zipcode: number;
        emailOptIn: number;
        _all: number;
    };

    export type DonorAvgAggregateInputType = {
        id?: true;
    };

    export type DonorSumAggregateInputType = {
        id?: true;
    };

    export type DonorMinAggregateInputType = {
        id?: true;
        firstName?: true;
        lastName?: true;
        contact?: true;
        email?: true;
        addressLine1?: true;
        addressLine2?: true;
        state?: true;
        city?: true;
        zipcode?: true;
        emailOptIn?: true;
    };

    export type DonorMaxAggregateInputType = {
        id?: true;
        firstName?: true;
        lastName?: true;
        contact?: true;
        email?: true;
        addressLine1?: true;
        addressLine2?: true;
        state?: true;
        city?: true;
        zipcode?: true;
        emailOptIn?: true;
    };

    export type DonorCountAggregateInputType = {
        id?: true;
        firstName?: true;
        lastName?: true;
        contact?: true;
        email?: true;
        addressLine1?: true;
        addressLine2?: true;
        state?: true;
        city?: true;
        zipcode?: true;
        emailOptIn?: true;
        _all?: true;
    };

    export type DonorAggregateArgs<
        ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs,
    > = {
        /**
         * Filter which Donor to aggregate.
         */
        where?: DonorWhereInput;
        /**
         * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
         *
         * Determine the order of Donors to fetch.
         */
        orderBy?:
            | DonorOrderByWithRelationInput
            | DonorOrderByWithRelationInput[];
        /**
         * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
         *
         * Sets the start position
         */
        cursor?: DonorWhereUniqueInput;
        /**
         * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
         *
         * Take `±n` Donors from the position of the cursor.
         */
        take?: number;
        /**
         * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
         *
         * Skip the first `n` Donors.
         */
        skip?: number;
        /**
         * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
         *
         * Count returned Donors
         **/
        _count?: true | DonorCountAggregateInputType;
        /**
         * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
         *
         * Select which fields to average
         **/
        _avg?: DonorAvgAggregateInputType;
        /**
         * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
         *
         * Select which fields to sum
         **/
        _sum?: DonorSumAggregateInputType;
        /**
         * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
         *
         * Select which fields to find the minimum value
         **/
        _min?: DonorMinAggregateInputType;
        /**
         * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
         *
         * Select which fields to find the maximum value
         **/
        _max?: DonorMaxAggregateInputType;
    };

    export type GetDonorAggregateType<T extends DonorAggregateArgs> = {
        [P in keyof T & keyof AggregateDonor]: P extends '_count' | 'count'
            ? T[P] extends true
                ? number
                : GetScalarType<T[P], AggregateDonor[P]>
            : GetScalarType<T[P], AggregateDonor[P]>;
    };

    export type DonorGroupByArgs<
        ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs,
    > = {
        where?: DonorWhereInput;
        orderBy?:
            | DonorOrderByWithAggregationInput
            | DonorOrderByWithAggregationInput[];
        by: DonorScalarFieldEnum[] | DonorScalarFieldEnum;
        having?: DonorScalarWhereWithAggregatesInput;
        take?: number;
        skip?: number;
        _count?: DonorCountAggregateInputType | true;
        _avg?: DonorAvgAggregateInputType;
        _sum?: DonorSumAggregateInputType;
        _min?: DonorMinAggregateInputType;
        _max?: DonorMaxAggregateInputType;
    };

    export type DonorGroupByOutputType = {
        id: number;
        firstName: string;
        lastName: string;
        contact: string | null;
        email: string;
        addressLine1: string | null;
        addressLine2: string | null;
        state: string | null;
        city: string | null;
        zipcode: string;
        emailOptIn: boolean;
        _count: DonorCountAggregateOutputType | null;
        _avg: DonorAvgAggregateOutputType | null;
        _sum: DonorSumAggregateOutputType | null;
        _min: DonorMinAggregateOutputType | null;
        _max: DonorMaxAggregateOutputType | null;
    };

    type GetDonorGroupByPayload<T extends DonorGroupByArgs> =
        Prisma.PrismaPromise<
            Array<
                PickEnumerable<DonorGroupByOutputType, T['by']> & {
                    [P in keyof T &
                        keyof DonorGroupByOutputType]: P extends '_count'
                        ? T[P] extends boolean
                            ? number
                            : GetScalarType<T[P], DonorGroupByOutputType[P]>
                        : GetScalarType<T[P], DonorGroupByOutputType[P]>;
                }
            >
        >;

    export type DonorSelect<
        ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs,
    > = $Extensions.GetSelect<
        {
            id?: boolean;
            firstName?: boolean;
            lastName?: boolean;
            contact?: boolean;
            email?: boolean;
            addressLine1?: boolean;
            addressLine2?: boolean;
            state?: boolean;
            city?: boolean;
            zipcode?: boolean;
            emailOptIn?: boolean;
            donatedItems?: boolean | Donor$donatedItemsArgs<ExtArgs>;
            _count?: boolean | DonorCountOutputTypeDefaultArgs<ExtArgs>;
        },
        ExtArgs['result']['donor']
    >;

    export type DonorSelectCreateManyAndReturn<
        ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs,
    > = $Extensions.GetSelect<
        {
            id?: boolean;
            firstName?: boolean;
            lastName?: boolean;
            contact?: boolean;
            email?: boolean;
            addressLine1?: boolean;
            addressLine2?: boolean;
            state?: boolean;
            city?: boolean;
            zipcode?: boolean;
            emailOptIn?: boolean;
        },
        ExtArgs['result']['donor']
    >;

    export type DonorSelectUpdateManyAndReturn<
        ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs,
    > = $Extensions.GetSelect<
        {
            id?: boolean;
            firstName?: boolean;
            lastName?: boolean;
            contact?: boolean;
            email?: boolean;
            addressLine1?: boolean;
            addressLine2?: boolean;
            state?: boolean;
            city?: boolean;
            zipcode?: boolean;
            emailOptIn?: boolean;
        },
        ExtArgs['result']['donor']
    >;

    export type DonorSelectScalar = {
        id?: boolean;
        firstName?: boolean;
        lastName?: boolean;
        contact?: boolean;
        email?: boolean;
        addressLine1?: boolean;
        addressLine2?: boolean;
        state?: boolean;
        city?: boolean;
        zipcode?: boolean;
        emailOptIn?: boolean;
    };

    export type DonorOmit<
        ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs,
    > = $Extensions.GetOmit<
        | 'id'
        | 'firstName'
        | 'lastName'
        | 'contact'
        | 'email'
        | 'addressLine1'
        | 'addressLine2'
        | 'state'
        | 'city'
        | 'zipcode'
        | 'emailOptIn',
        ExtArgs['result']['donor']
    >;
    export type DonorInclude<
        ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs,
    > = {
        donatedItems?: boolean | Donor$donatedItemsArgs<ExtArgs>;
        _count?: boolean | DonorCountOutputTypeDefaultArgs<ExtArgs>;
    };
    export type DonorIncludeCreateManyAndReturn<
        ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs,
    > = {};
    export type DonorIncludeUpdateManyAndReturn<
        ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs,
    > = {};

    export type $DonorPayload<
        ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs,
    > = {
        name: 'Donor';
        objects: {
            donatedItems: Prisma.$DonatedItemPayload<ExtArgs>[];
        };
        scalars: $Extensions.GetPayloadResult<
            {
                id: number;
                firstName: string;
                lastName: string;
                contact: string | null;
                email: string;
                addressLine1: string | null;
                addressLine2: string | null;
                state: string | null;
                city: string | null;
                zipcode: string;
                emailOptIn: boolean;
            },
            ExtArgs['result']['donor']
        >;
        composites: {};
    };

    type DonorGetPayload<
        S extends boolean | null | undefined | DonorDefaultArgs,
    > = $Result.GetResult<Prisma.$DonorPayload, S>;

    type DonorCountArgs<
        ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs,
    > = Omit<DonorFindManyArgs, 'select' | 'include' | 'distinct' | 'omit'> & {
        select?: DonorCountAggregateInputType | true;
    };

    export interface DonorDelegate<
        ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs,
        GlobalOmitOptions = {},
    > {
        [K: symbol]: {
            types: Prisma.TypeMap<ExtArgs>['model']['Donor'];
            meta: { name: 'Donor' };
        };
        /**
         * Find zero or one Donor that matches the filter.
         * @param {DonorFindUniqueArgs} args - Arguments to find a Donor
         * @example
         * // Get one Donor
         * const donor = await prisma.donor.findUnique({
         *   where: {
         *     // ... provide filter here
         *   }
         * })
         */
        findUnique<T extends DonorFindUniqueArgs>(
            args: SelectSubset<T, DonorFindUniqueArgs<ExtArgs>>,
        ): Prisma__DonorClient<
            $Result.GetResult<
                Prisma.$DonorPayload<ExtArgs>,
                T,
                'findUnique',
                GlobalOmitOptions
            > | null,
            null,
            ExtArgs,
            GlobalOmitOptions
        >;

        /**
         * Find one Donor that matches the filter or throw an error with `error.code='P2025'`
         * if no matches were found.
         * @param {DonorFindUniqueOrThrowArgs} args - Arguments to find a Donor
         * @example
         * // Get one Donor
         * const donor = await prisma.donor.findUniqueOrThrow({
         *   where: {
         *     // ... provide filter here
         *   }
         * })
         */
        findUniqueOrThrow<T extends DonorFindUniqueOrThrowArgs>(
            args: SelectSubset<T, DonorFindUniqueOrThrowArgs<ExtArgs>>,
        ): Prisma__DonorClient<
            $Result.GetResult<
                Prisma.$DonorPayload<ExtArgs>,
                T,
                'findUniqueOrThrow',
                GlobalOmitOptions
            >,
            never,
            ExtArgs,
            GlobalOmitOptions
        >;

        /**
         * Find the first Donor that matches the filter.
         * Note, that providing `undefined` is treated as the value not being there.
         * Read more here: https://pris.ly/d/null-undefined
         * @param {DonorFindFirstArgs} args - Arguments to find a Donor
         * @example
         * // Get one Donor
         * const donor = await prisma.donor.findFirst({
         *   where: {
         *     // ... provide filter here
         *   }
         * })
         */
        findFirst<T extends DonorFindFirstArgs>(
            args?: SelectSubset<T, DonorFindFirstArgs<ExtArgs>>,
        ): Prisma__DonorClient<
            $Result.GetResult<
                Prisma.$DonorPayload<ExtArgs>,
                T,
                'findFirst',
                GlobalOmitOptions
            > | null,
            null,
            ExtArgs,
            GlobalOmitOptions
        >;

        /**
         * Find the first Donor that matches the filter or
         * throw `PrismaKnownClientError` with `P2025` code if no matches were found.
         * Note, that providing `undefined` is treated as the value not being there.
         * Read more here: https://pris.ly/d/null-undefined
         * @param {DonorFindFirstOrThrowArgs} args - Arguments to find a Donor
         * @example
         * // Get one Donor
         * const donor = await prisma.donor.findFirstOrThrow({
         *   where: {
         *     // ... provide filter here
         *   }
         * })
         */
        findFirstOrThrow<T extends DonorFindFirstOrThrowArgs>(
            args?: SelectSubset<T, DonorFindFirstOrThrowArgs<ExtArgs>>,
        ): Prisma__DonorClient<
            $Result.GetResult<
                Prisma.$DonorPayload<ExtArgs>,
                T,
                'findFirstOrThrow',
                GlobalOmitOptions
            >,
            never,
            ExtArgs,
            GlobalOmitOptions
        >;

        /**
         * Find zero or more Donors that matches the filter.
         * Note, that providing `undefined` is treated as the value not being there.
         * Read more here: https://pris.ly/d/null-undefined
         * @param {DonorFindManyArgs} args - Arguments to filter and select certain fields only.
         * @example
         * // Get all Donors
         * const donors = await prisma.donor.findMany()
         *
         * // Get first 10 Donors
         * const donors = await prisma.donor.findMany({ take: 10 })
         *
         * // Only select the `id`
         * const donorWithIdOnly = await prisma.donor.findMany({ select: { id: true } })
         *
         */
        findMany<T extends DonorFindManyArgs>(
            args?: SelectSubset<T, DonorFindManyArgs<ExtArgs>>,
        ): Prisma.PrismaPromise<
            $Result.GetResult<
                Prisma.$DonorPayload<ExtArgs>,
                T,
                'findMany',
                GlobalOmitOptions
            >
        >;

        /**
         * Create a Donor.
         * @param {DonorCreateArgs} args - Arguments to create a Donor.
         * @example
         * // Create one Donor
         * const Donor = await prisma.donor.create({
         *   data: {
         *     // ... data to create a Donor
         *   }
         * })
         *
         */
        create<T extends DonorCreateArgs>(
            args: SelectSubset<T, DonorCreateArgs<ExtArgs>>,
        ): Prisma__DonorClient<
            $Result.GetResult<
                Prisma.$DonorPayload<ExtArgs>,
                T,
                'create',
                GlobalOmitOptions
            >,
            never,
            ExtArgs,
            GlobalOmitOptions
        >;

        /**
         * Create many Donors.
         * @param {DonorCreateManyArgs} args - Arguments to create many Donors.
         * @example
         * // Create many Donors
         * const donor = await prisma.donor.createMany({
         *   data: [
         *     // ... provide data here
         *   ]
         * })
         *
         */
        createMany<T extends DonorCreateManyArgs>(
            args?: SelectSubset<T, DonorCreateManyArgs<ExtArgs>>,
        ): Prisma.PrismaPromise<BatchPayload>;

        /**
         * Create many Donors and returns the data saved in the database.
         * @param {DonorCreateManyAndReturnArgs} args - Arguments to create many Donors.
         * @example
         * // Create many Donors
         * const donor = await prisma.donor.createManyAndReturn({
         *   data: [
         *     // ... provide data here
         *   ]
         * })
         *
         * // Create many Donors and only return the `id`
         * const donorWithIdOnly = await prisma.donor.createManyAndReturn({
         *   select: { id: true },
         *   data: [
         *     // ... provide data here
         *   ]
         * })
         * Note, that providing `undefined` is treated as the value not being there.
         * Read more here: https://pris.ly/d/null-undefined
         *
         */
        createManyAndReturn<T extends DonorCreateManyAndReturnArgs>(
            args?: SelectSubset<T, DonorCreateManyAndReturnArgs<ExtArgs>>,
        ): Prisma.PrismaPromise<
            $Result.GetResult<
                Prisma.$DonorPayload<ExtArgs>,
                T,
                'createManyAndReturn',
                GlobalOmitOptions
            >
        >;

        /**
         * Delete a Donor.
         * @param {DonorDeleteArgs} args - Arguments to delete one Donor.
         * @example
         * // Delete one Donor
         * const Donor = await prisma.donor.delete({
         *   where: {
         *     // ... filter to delete one Donor
         *   }
         * })
         *
         */
        delete<T extends DonorDeleteArgs>(
            args: SelectSubset<T, DonorDeleteArgs<ExtArgs>>,
        ): Prisma__DonorClient<
            $Result.GetResult<
                Prisma.$DonorPayload<ExtArgs>,
                T,
                'delete',
                GlobalOmitOptions
            >,
            never,
            ExtArgs,
            GlobalOmitOptions
        >;

        /**
         * Update one Donor.
         * @param {DonorUpdateArgs} args - Arguments to update one Donor.
         * @example
         * // Update one Donor
         * const donor = await prisma.donor.update({
         *   where: {
         *     // ... provide filter here
         *   },
         *   data: {
         *     // ... provide data here
         *   }
         * })
         *
         */
        update<T extends DonorUpdateArgs>(
            args: SelectSubset<T, DonorUpdateArgs<ExtArgs>>,
        ): Prisma__DonorClient<
            $Result.GetResult<
                Prisma.$DonorPayload<ExtArgs>,
                T,
                'update',
                GlobalOmitOptions
            >,
            never,
            ExtArgs,
            GlobalOmitOptions
        >;

        /**
         * Delete zero or more Donors.
         * @param {DonorDeleteManyArgs} args - Arguments to filter Donors to delete.
         * @example
         * // Delete a few Donors
         * const { count } = await prisma.donor.deleteMany({
         *   where: {
         *     // ... provide filter here
         *   }
         * })
         *
         */
        deleteMany<T extends DonorDeleteManyArgs>(
            args?: SelectSubset<T, DonorDeleteManyArgs<ExtArgs>>,
        ): Prisma.PrismaPromise<BatchPayload>;

        /**
         * Update zero or more Donors.
         * Note, that providing `undefined` is treated as the value not being there.
         * Read more here: https://pris.ly/d/null-undefined
         * @param {DonorUpdateManyArgs} args - Arguments to update one or more rows.
         * @example
         * // Update many Donors
         * const donor = await prisma.donor.updateMany({
         *   where: {
         *     // ... provide filter here
         *   },
         *   data: {
         *     // ... provide data here
         *   }
         * })
         *
         */
        updateMany<T extends DonorUpdateManyArgs>(
            args: SelectSubset<T, DonorUpdateManyArgs<ExtArgs>>,
        ): Prisma.PrismaPromise<BatchPayload>;

        /**
         * Update zero or more Donors and returns the data updated in the database.
         * @param {DonorUpdateManyAndReturnArgs} args - Arguments to update many Donors.
         * @example
         * // Update many Donors
         * const donor = await prisma.donor.updateManyAndReturn({
         *   where: {
         *     // ... provide filter here
         *   },
         *   data: [
         *     // ... provide data here
         *   ]
         * })
         *
         * // Update zero or more Donors and only return the `id`
         * const donorWithIdOnly = await prisma.donor.updateManyAndReturn({
         *   select: { id: true },
         *   where: {
         *     // ... provide filter here
         *   },
         *   data: [
         *     // ... provide data here
         *   ]
         * })
         * Note, that providing `undefined` is treated as the value not being there.
         * Read more here: https://pris.ly/d/null-undefined
         *
         */
        updateManyAndReturn<T extends DonorUpdateManyAndReturnArgs>(
            args: SelectSubset<T, DonorUpdateManyAndReturnArgs<ExtArgs>>,
        ): Prisma.PrismaPromise<
            $Result.GetResult<
                Prisma.$DonorPayload<ExtArgs>,
                T,
                'updateManyAndReturn',
                GlobalOmitOptions
            >
        >;

        /**
         * Create or update one Donor.
         * @param {DonorUpsertArgs} args - Arguments to update or create a Donor.
         * @example
         * // Update or create a Donor
         * const donor = await prisma.donor.upsert({
         *   create: {
         *     // ... data to create a Donor
         *   },
         *   update: {
         *     // ... in case it already exists, update
         *   },
         *   where: {
         *     // ... the filter for the Donor we want to update
         *   }
         * })
         */
        upsert<T extends DonorUpsertArgs>(
            args: SelectSubset<T, DonorUpsertArgs<ExtArgs>>,
        ): Prisma__DonorClient<
            $Result.GetResult<
                Prisma.$DonorPayload<ExtArgs>,
                T,
                'upsert',
                GlobalOmitOptions
            >,
            never,
            ExtArgs,
            GlobalOmitOptions
        >;

        /**
         * Count the number of Donors.
         * Note, that providing `undefined` is treated as the value not being there.
         * Read more here: https://pris.ly/d/null-undefined
         * @param {DonorCountArgs} args - Arguments to filter Donors to count.
         * @example
         * // Count the number of Donors
         * const count = await prisma.donor.count({
         *   where: {
         *     // ... the filter for the Donors we want to count
         *   }
         * })
         **/
        count<T extends DonorCountArgs>(
            args?: Subset<T, DonorCountArgs>,
        ): Prisma.PrismaPromise<
            T extends $Utils.Record<'select', any>
                ? T['select'] extends true
                    ? number
                    : GetScalarType<T['select'], DonorCountAggregateOutputType>
                : number
        >;

        /**
         * Allows you to perform aggregations operations on a Donor.
         * Note, that providing `undefined` is treated as the value not being there.
         * Read more here: https://pris.ly/d/null-undefined
         * @param {DonorAggregateArgs} args - Select which aggregations you would like to apply and on what fields.
         * @example
         * // Ordered by age ascending
         * // Where email contains prisma.io
         * // Limited to the 10 users
         * const aggregations = await prisma.user.aggregate({
         *   _avg: {
         *     age: true,
         *   },
         *   where: {
         *     email: {
         *       contains: "prisma.io",
         *     },
         *   },
         *   orderBy: {
         *     age: "asc",
         *   },
         *   take: 10,
         * })
         **/
        aggregate<T extends DonorAggregateArgs>(
            args: Subset<T, DonorAggregateArgs>,
        ): Prisma.PrismaPromise<GetDonorAggregateType<T>>;

        /**
         * Group by Donor.
         * Note, that providing `undefined` is treated as the value not being there.
         * Read more here: https://pris.ly/d/null-undefined
         * @param {DonorGroupByArgs} args - Group by arguments.
         * @example
         * // Group by city, order by createdAt, get count
         * const result = await prisma.user.groupBy({
         *   by: ['city', 'createdAt'],
         *   orderBy: {
         *     createdAt: true
         *   },
         *   _count: {
         *     _all: true
         *   },
         * })
         *
         **/
        groupBy<
            T extends DonorGroupByArgs,
            HasSelectOrTake extends Or<
                Extends<'skip', Keys<T>>,
                Extends<'take', Keys<T>>
            >,
            OrderByArg extends True extends HasSelectOrTake
                ? { orderBy: DonorGroupByArgs['orderBy'] }
                : { orderBy?: DonorGroupByArgs['orderBy'] },
            OrderFields extends ExcludeUnderscoreKeys<
                Keys<MaybeTupleToUnion<T['orderBy']>>
            >,
            ByFields extends MaybeTupleToUnion<T['by']>,
            ByValid extends Has<ByFields, OrderFields>,
            HavingFields extends GetHavingFields<T['having']>,
            HavingValid extends Has<ByFields, HavingFields>,
            ByEmpty extends T['by'] extends never[] ? True : False,
            InputErrors extends ByEmpty extends True
                ? `Error: "by" must not be empty.`
                : HavingValid extends False
                  ? {
                        [P in HavingFields]: P extends ByFields
                            ? never
                            : P extends string
                              ? `Error: Field "${P}" used in "having" needs to be provided in "by".`
                              : [
                                    Error,
                                    'Field ',
                                    P,
                                    ` in "having" needs to be provided in "by"`,
                                ];
                    }[HavingFields]
                  : 'take' extends Keys<T>
                    ? 'orderBy' extends Keys<T>
                        ? ByValid extends True
                            ? {}
                            : {
                                  [P in OrderFields]: P extends ByFields
                                      ? never
                                      : `Error: Field "${P}" in "orderBy" needs to be provided in "by"`;
                              }[OrderFields]
                        : 'Error: If you provide "take", you also need to provide "orderBy"'
                    : 'skip' extends Keys<T>
                      ? 'orderBy' extends Keys<T>
                          ? ByValid extends True
                              ? {}
                              : {
                                    [P in OrderFields]: P extends ByFields
                                        ? never
                                        : `Error: Field "${P}" in "orderBy" needs to be provided in "by"`;
                                }[OrderFields]
                          : 'Error: If you provide "skip", you also need to provide "orderBy"'
                      : ByValid extends True
                        ? {}
                        : {
                              [P in OrderFields]: P extends ByFields
                                  ? never
                                  : `Error: Field "${P}" in "orderBy" needs to be provided in "by"`;
                          }[OrderFields],
        >(
            args: SubsetIntersection<T, DonorGroupByArgs, OrderByArg> &
                InputErrors,
        ): {} extends InputErrors
            ? GetDonorGroupByPayload<T>
            : Prisma.PrismaPromise<InputErrors>;
        /**
         * Fields of the Donor model
         */
        readonly fields: DonorFieldRefs;
    }

    /**
     * The delegate class that acts as a "Promise-like" for Donor.
     * Why is this prefixed with `Prisma__`?
     * Because we want to prevent naming conflicts as mentioned in
     * https://github.com/prisma/prisma-client-js/issues/707
     */
    export interface Prisma__DonorClient<
        T,
        Null = never,
        ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs,
        GlobalOmitOptions = {},
    > extends Prisma.PrismaPromise<T> {
        readonly [Symbol.toStringTag]: 'PrismaPromise';
        donatedItems<T extends Donor$donatedItemsArgs<ExtArgs> = {}>(
            args?: Subset<T, Donor$donatedItemsArgs<ExtArgs>>,
        ): Prisma.PrismaPromise<
            | $Result.GetResult<
                  Prisma.$DonatedItemPayload<ExtArgs>,
                  T,
                  'findMany',
                  GlobalOmitOptions
              >
            | Null
        >;
        /**
         * Attaches callbacks for the resolution and/or rejection of the Promise.
         * @param onfulfilled The callback to execute when the Promise is resolved.
         * @param onrejected The callback to execute when the Promise is rejected.
         * @returns A Promise for the completion of which ever callback is executed.
         */
        then<TResult1 = T, TResult2 = never>(
            onfulfilled?:
                | ((value: T) => TResult1 | PromiseLike<TResult1>)
                | undefined
                | null,
            onrejected?:
                | ((reason: any) => TResult2 | PromiseLike<TResult2>)
                | undefined
                | null,
        ): $Utils.JsPromise<TResult1 | TResult2>;
        /**
         * Attaches a callback for only the rejection of the Promise.
         * @param onrejected The callback to execute when the Promise is rejected.
         * @returns A Promise for the completion of the callback.
         */
        catch<TResult = never>(
            onrejected?:
                | ((reason: any) => TResult | PromiseLike<TResult>)
                | undefined
                | null,
        ): $Utils.JsPromise<T | TResult>;
        /**
         * Attaches a callback that is invoked when the Promise is settled (fulfilled or rejected). The
         * resolved value cannot be modified from the callback.
         * @param onfinally The callback to execute when the Promise is settled (fulfilled or rejected).
         * @returns A Promise for the completion of the callback.
         */
        finally(
            onfinally?: (() => void) | undefined | null,
        ): $Utils.JsPromise<T>;
    }

    /**
     * Fields of the Donor model
     */
    interface DonorFieldRefs {
        readonly id: FieldRef<'Donor', 'Int'>;
        readonly firstName: FieldRef<'Donor', 'String'>;
        readonly lastName: FieldRef<'Donor', 'String'>;
        readonly contact: FieldRef<'Donor', 'String'>;
        readonly email: FieldRef<'Donor', 'String'>;
        readonly addressLine1: FieldRef<'Donor', 'String'>;
        readonly addressLine2: FieldRef<'Donor', 'String'>;
        readonly state: FieldRef<'Donor', 'String'>;
        readonly city: FieldRef<'Donor', 'String'>;
        readonly zipcode: FieldRef<'Donor', 'String'>;
        readonly emailOptIn: FieldRef<'Donor', 'Boolean'>;
    }

    // Custom InputTypes
    /**
     * Donor findUnique
     */
    export type DonorFindUniqueArgs<
        ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs,
    > = {
        /**
         * Select specific fields to fetch from the Donor
         */
        select?: DonorSelect<ExtArgs> | null;
        /**
         * Omit specific fields from the Donor
         */
        omit?: DonorOmit<ExtArgs> | null;
        /**
         * Choose, which related nodes to fetch as well
         */
        include?: DonorInclude<ExtArgs> | null;
        /**
         * Filter, which Donor to fetch.
         */
        where: DonorWhereUniqueInput;
    };

    /**
     * Donor findUniqueOrThrow
     */
    export type DonorFindUniqueOrThrowArgs<
        ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs,
    > = {
        /**
         * Select specific fields to fetch from the Donor
         */
        select?: DonorSelect<ExtArgs> | null;
        /**
         * Omit specific fields from the Donor
         */
        omit?: DonorOmit<ExtArgs> | null;
        /**
         * Choose, which related nodes to fetch as well
         */
        include?: DonorInclude<ExtArgs> | null;
        /**
         * Filter, which Donor to fetch.
         */
        where: DonorWhereUniqueInput;
    };

    /**
     * Donor findFirst
     */
    export type DonorFindFirstArgs<
        ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs,
    > = {
        /**
         * Select specific fields to fetch from the Donor
         */
        select?: DonorSelect<ExtArgs> | null;
        /**
         * Omit specific fields from the Donor
         */
        omit?: DonorOmit<ExtArgs> | null;
        /**
         * Choose, which related nodes to fetch as well
         */
        include?: DonorInclude<ExtArgs> | null;
        /**
         * Filter, which Donor to fetch.
         */
        where?: DonorWhereInput;
        /**
         * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
         *
         * Determine the order of Donors to fetch.
         */
        orderBy?:
            | DonorOrderByWithRelationInput
            | DonorOrderByWithRelationInput[];
        /**
         * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
         *
         * Sets the position for searching for Donors.
         */
        cursor?: DonorWhereUniqueInput;
        /**
         * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
         *
         * Take `±n` Donors from the position of the cursor.
         */
        take?: number;
        /**
         * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
         *
         * Skip the first `n` Donors.
         */
        skip?: number;
        /**
         * {@link https://www.prisma.io/docs/concepts/components/prisma-client/distinct Distinct Docs}
         *
         * Filter by unique combinations of Donors.
         */
        distinct?: DonorScalarFieldEnum | DonorScalarFieldEnum[];
    };

    /**
     * Donor findFirstOrThrow
     */
    export type DonorFindFirstOrThrowArgs<
        ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs,
    > = {
        /**
         * Select specific fields to fetch from the Donor
         */
        select?: DonorSelect<ExtArgs> | null;
        /**
         * Omit specific fields from the Donor
         */
        omit?: DonorOmit<ExtArgs> | null;
        /**
         * Choose, which related nodes to fetch as well
         */
        include?: DonorInclude<ExtArgs> | null;
        /**
         * Filter, which Donor to fetch.
         */
        where?: DonorWhereInput;
        /**
         * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
         *
         * Determine the order of Donors to fetch.
         */
        orderBy?:
            | DonorOrderByWithRelationInput
            | DonorOrderByWithRelationInput[];
        /**
         * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
         *
         * Sets the position for searching for Donors.
         */
        cursor?: DonorWhereUniqueInput;
        /**
         * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
         *
         * Take `±n` Donors from the position of the cursor.
         */
        take?: number;
        /**
         * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
         *
         * Skip the first `n` Donors.
         */
        skip?: number;
        /**
         * {@link https://www.prisma.io/docs/concepts/components/prisma-client/distinct Distinct Docs}
         *
         * Filter by unique combinations of Donors.
         */
        distinct?: DonorScalarFieldEnum | DonorScalarFieldEnum[];
    };

    /**
     * Donor findMany
     */
    export type DonorFindManyArgs<
        ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs,
    > = {
        /**
         * Select specific fields to fetch from the Donor
         */
        select?: DonorSelect<ExtArgs> | null;
        /**
         * Omit specific fields from the Donor
         */
        omit?: DonorOmit<ExtArgs> | null;
        /**
         * Choose, which related nodes to fetch as well
         */
        include?: DonorInclude<ExtArgs> | null;
        /**
         * Filter, which Donors to fetch.
         */
        where?: DonorWhereInput;
        /**
         * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
         *
         * Determine the order of Donors to fetch.
         */
        orderBy?:
            | DonorOrderByWithRelationInput
            | DonorOrderByWithRelationInput[];
        /**
         * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
         *
         * Sets the position for listing Donors.
         */
        cursor?: DonorWhereUniqueInput;
        /**
         * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
         *
         * Take `±n` Donors from the position of the cursor.
         */
        take?: number;
        /**
         * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
         *
         * Skip the first `n` Donors.
         */
        skip?: number;
        /**
         * {@link https://www.prisma.io/docs/concepts/components/prisma-client/distinct Distinct Docs}
         *
         * Filter by unique combinations of Donors.
         */
        distinct?: DonorScalarFieldEnum | DonorScalarFieldEnum[];
    };

    /**
     * Donor create
     */
    export type DonorCreateArgs<
        ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs,
    > = {
        /**
         * Select specific fields to fetch from the Donor
         */
        select?: DonorSelect<ExtArgs> | null;
        /**
         * Omit specific fields from the Donor
         */
        omit?: DonorOmit<ExtArgs> | null;
        /**
         * Choose, which related nodes to fetch as well
         */
        include?: DonorInclude<ExtArgs> | null;
        /**
         * The data needed to create a Donor.
         */
        data: XOR<DonorCreateInput, DonorUncheckedCreateInput>;
    };

    /**
     * Donor createMany
     */
    export type DonorCreateManyArgs<
        ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs,
    > = {
        /**
         * The data used to create many Donors.
         */
        data: DonorCreateManyInput | DonorCreateManyInput[];
        skipDuplicates?: boolean;
    };

    /**
     * Donor createManyAndReturn
     */
    export type DonorCreateManyAndReturnArgs<
        ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs,
    > = {
        /**
         * Select specific fields to fetch from the Donor
         */
        select?: DonorSelectCreateManyAndReturn<ExtArgs> | null;
        /**
         * Omit specific fields from the Donor
         */
        omit?: DonorOmit<ExtArgs> | null;
        /**
         * The data used to create many Donors.
         */
        data: DonorCreateManyInput | DonorCreateManyInput[];
        skipDuplicates?: boolean;
    };

    /**
     * Donor update
     */
    export type DonorUpdateArgs<
        ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs,
    > = {
        /**
         * Select specific fields to fetch from the Donor
         */
        select?: DonorSelect<ExtArgs> | null;
        /**
         * Omit specific fields from the Donor
         */
        omit?: DonorOmit<ExtArgs> | null;
        /**
         * Choose, which related nodes to fetch as well
         */
        include?: DonorInclude<ExtArgs> | null;
        /**
         * The data needed to update a Donor.
         */
        data: XOR<DonorUpdateInput, DonorUncheckedUpdateInput>;
        /**
         * Choose, which Donor to update.
         */
        where: DonorWhereUniqueInput;
    };

    /**
     * Donor updateMany
     */
    export type DonorUpdateManyArgs<
        ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs,
    > = {
        /**
         * The data used to update Donors.
         */
        data: XOR<DonorUpdateManyMutationInput, DonorUncheckedUpdateManyInput>;
        /**
         * Filter which Donors to update
         */
        where?: DonorWhereInput;
        /**
         * Limit how many Donors to update.
         */
        limit?: number;
    };

    /**
     * Donor updateManyAndReturn
     */
    export type DonorUpdateManyAndReturnArgs<
        ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs,
    > = {
        /**
         * Select specific fields to fetch from the Donor
         */
        select?: DonorSelectUpdateManyAndReturn<ExtArgs> | null;
        /**
         * Omit specific fields from the Donor
         */
        omit?: DonorOmit<ExtArgs> | null;
        /**
         * The data used to update Donors.
         */
        data: XOR<DonorUpdateManyMutationInput, DonorUncheckedUpdateManyInput>;
        /**
         * Filter which Donors to update
         */
        where?: DonorWhereInput;
        /**
         * Limit how many Donors to update.
         */
        limit?: number;
    };

    /**
     * Donor upsert
     */
    export type DonorUpsertArgs<
        ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs,
    > = {
        /**
         * Select specific fields to fetch from the Donor
         */
        select?: DonorSelect<ExtArgs> | null;
        /**
         * Omit specific fields from the Donor
         */
        omit?: DonorOmit<ExtArgs> | null;
        /**
         * Choose, which related nodes to fetch as well
         */
        include?: DonorInclude<ExtArgs> | null;
        /**
         * The filter to search for the Donor to update in case it exists.
         */
        where: DonorWhereUniqueInput;
        /**
         * In case the Donor found by the `where` argument doesn't exist, create a new Donor with this data.
         */
        create: XOR<DonorCreateInput, DonorUncheckedCreateInput>;
        /**
         * In case the Donor was found with the provided `where` argument, update it with this data.
         */
        update: XOR<DonorUpdateInput, DonorUncheckedUpdateInput>;
    };

    /**
     * Donor delete
     */
    export type DonorDeleteArgs<
        ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs,
    > = {
        /**
         * Select specific fields to fetch from the Donor
         */
        select?: DonorSelect<ExtArgs> | null;
        /**
         * Omit specific fields from the Donor
         */
        omit?: DonorOmit<ExtArgs> | null;
        /**
         * Choose, which related nodes to fetch as well
         */
        include?: DonorInclude<ExtArgs> | null;
        /**
         * Filter which Donor to delete.
         */
        where: DonorWhereUniqueInput;
    };

    /**
     * Donor deleteMany
     */
    export type DonorDeleteManyArgs<
        ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs,
    > = {
        /**
         * Filter which Donors to delete
         */
        where?: DonorWhereInput;
        /**
         * Limit how many Donors to delete.
         */
        limit?: number;
    };

    /**
     * Donor.donatedItems
     */
    export type Donor$donatedItemsArgs<
        ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs,
    > = {
        /**
         * Select specific fields to fetch from the DonatedItem
         */
        select?: DonatedItemSelect<ExtArgs> | null;
        /**
         * Omit specific fields from the DonatedItem
         */
        omit?: DonatedItemOmit<ExtArgs> | null;
        /**
         * Choose, which related nodes to fetch as well
         */
        include?: DonatedItemInclude<ExtArgs> | null;
        where?: DonatedItemWhereInput;
        orderBy?:
            | DonatedItemOrderByWithRelationInput
            | DonatedItemOrderByWithRelationInput[];
        cursor?: DonatedItemWhereUniqueInput;
        take?: number;
        skip?: number;
        distinct?: DonatedItemScalarFieldEnum | DonatedItemScalarFieldEnum[];
    };

    /**
     * Donor without action
     */
    export type DonorDefaultArgs<
        ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs,
    > = {
        /**
         * Select specific fields to fetch from the Donor
         */
        select?: DonorSelect<ExtArgs> | null;
        /**
         * Omit specific fields from the Donor
         */
        omit?: DonorOmit<ExtArgs> | null;
        /**
         * Choose, which related nodes to fetch as well
         */
        include?: DonorInclude<ExtArgs> | null;
    };

    /**
     * Model Program
     */

    export type AggregateProgram = {
        _count: ProgramCountAggregateOutputType | null;
        _avg: ProgramAvgAggregateOutputType | null;
        _sum: ProgramSumAggregateOutputType | null;
        _min: ProgramMinAggregateOutputType | null;
        _max: ProgramMaxAggregateOutputType | null;
    };

    export type ProgramAvgAggregateOutputType = {
        id: number | null;
    };

    export type ProgramSumAggregateOutputType = {
        id: number | null;
    };

    export type ProgramMinAggregateOutputType = {
        id: number | null;
        name: string | null;
        description: string | null;
        startDate: Date | null;
        aimAndCause: string | null;
    };

    export type ProgramMaxAggregateOutputType = {
        id: number | null;
        name: string | null;
        description: string | null;
        startDate: Date | null;
        aimAndCause: string | null;
    };

    export type ProgramCountAggregateOutputType = {
        id: number;
        name: number;
        description: number;
        startDate: number;
        aimAndCause: number;
        _all: number;
    };

    export type ProgramAvgAggregateInputType = {
        id?: true;
    };

    export type ProgramSumAggregateInputType = {
        id?: true;
    };

    export type ProgramMinAggregateInputType = {
        id?: true;
        name?: true;
        description?: true;
        startDate?: true;
        aimAndCause?: true;
    };

    export type ProgramMaxAggregateInputType = {
        id?: true;
        name?: true;
        description?: true;
        startDate?: true;
        aimAndCause?: true;
    };

    export type ProgramCountAggregateInputType = {
        id?: true;
        name?: true;
        description?: true;
        startDate?: true;
        aimAndCause?: true;
        _all?: true;
    };

    export type ProgramAggregateArgs<
        ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs,
    > = {
        /**
         * Filter which Program to aggregate.
         */
        where?: ProgramWhereInput;
        /**
         * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
         *
         * Determine the order of Programs to fetch.
         */
        orderBy?:
            | ProgramOrderByWithRelationInput
            | ProgramOrderByWithRelationInput[];
        /**
         * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
         *
         * Sets the start position
         */
        cursor?: ProgramWhereUniqueInput;
        /**
         * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
         *
         * Take `±n` Programs from the position of the cursor.
         */
        take?: number;
        /**
         * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
         *
         * Skip the first `n` Programs.
         */
        skip?: number;
        /**
         * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
         *
         * Count returned Programs
         **/
        _count?: true | ProgramCountAggregateInputType;
        /**
         * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
         *
         * Select which fields to average
         **/
        _avg?: ProgramAvgAggregateInputType;
        /**
         * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
         *
         * Select which fields to sum
         **/
        _sum?: ProgramSumAggregateInputType;
        /**
         * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
         *
         * Select which fields to find the minimum value
         **/
        _min?: ProgramMinAggregateInputType;
        /**
         * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
         *
         * Select which fields to find the maximum value
         **/
        _max?: ProgramMaxAggregateInputType;
    };

    export type GetProgramAggregateType<T extends ProgramAggregateArgs> = {
        [P in keyof T & keyof AggregateProgram]: P extends '_count' | 'count'
            ? T[P] extends true
                ? number
                : GetScalarType<T[P], AggregateProgram[P]>
            : GetScalarType<T[P], AggregateProgram[P]>;
    };

    export type ProgramGroupByArgs<
        ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs,
    > = {
        where?: ProgramWhereInput;
        orderBy?:
            | ProgramOrderByWithAggregationInput
            | ProgramOrderByWithAggregationInput[];
        by: ProgramScalarFieldEnum[] | ProgramScalarFieldEnum;
        having?: ProgramScalarWhereWithAggregatesInput;
        take?: number;
        skip?: number;
        _count?: ProgramCountAggregateInputType | true;
        _avg?: ProgramAvgAggregateInputType;
        _sum?: ProgramSumAggregateInputType;
        _min?: ProgramMinAggregateInputType;
        _max?: ProgramMaxAggregateInputType;
    };

    export type ProgramGroupByOutputType = {
        id: number;
        name: string;
        description: string;
        startDate: Date;
        aimAndCause: string;
        _count: ProgramCountAggregateOutputType | null;
        _avg: ProgramAvgAggregateOutputType | null;
        _sum: ProgramSumAggregateOutputType | null;
        _min: ProgramMinAggregateOutputType | null;
        _max: ProgramMaxAggregateOutputType | null;
    };

    type GetProgramGroupByPayload<T extends ProgramGroupByArgs> =
        Prisma.PrismaPromise<
            Array<
                PickEnumerable<ProgramGroupByOutputType, T['by']> & {
                    [P in keyof T &
                        keyof ProgramGroupByOutputType]: P extends '_count'
                        ? T[P] extends boolean
                            ? number
                            : GetScalarType<T[P], ProgramGroupByOutputType[P]>
                        : GetScalarType<T[P], ProgramGroupByOutputType[P]>;
                }
            >
        >;

    export type ProgramSelect<
        ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs,
    > = $Extensions.GetSelect<
        {
            id?: boolean;
            name?: boolean;
            description?: boolean;
            startDate?: boolean;
            aimAndCause?: boolean;
            donatedItems?: boolean | Program$donatedItemsArgs<ExtArgs>;
            _count?: boolean | ProgramCountOutputTypeDefaultArgs<ExtArgs>;
        },
        ExtArgs['result']['program']
    >;

    export type ProgramSelectCreateManyAndReturn<
        ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs,
    > = $Extensions.GetSelect<
        {
            id?: boolean;
            name?: boolean;
            description?: boolean;
            startDate?: boolean;
            aimAndCause?: boolean;
        },
        ExtArgs['result']['program']
    >;

    export type ProgramSelectUpdateManyAndReturn<
        ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs,
    > = $Extensions.GetSelect<
        {
            id?: boolean;
            name?: boolean;
            description?: boolean;
            startDate?: boolean;
            aimAndCause?: boolean;
        },
        ExtArgs['result']['program']
    >;

    export type ProgramSelectScalar = {
        id?: boolean;
        name?: boolean;
        description?: boolean;
        startDate?: boolean;
        aimAndCause?: boolean;
    };

    export type ProgramOmit<
        ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs,
    > = $Extensions.GetOmit<
        'id' | 'name' | 'description' | 'startDate' | 'aimAndCause',
        ExtArgs['result']['program']
    >;
    export type ProgramInclude<
        ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs,
    > = {
        donatedItems?: boolean | Program$donatedItemsArgs<ExtArgs>;
        _count?: boolean | ProgramCountOutputTypeDefaultArgs<ExtArgs>;
    };
    export type ProgramIncludeCreateManyAndReturn<
        ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs,
    > = {};
    export type ProgramIncludeUpdateManyAndReturn<
        ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs,
    > = {};

    export type $ProgramPayload<
        ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs,
    > = {
        name: 'Program';
        objects: {
            donatedItems: Prisma.$DonatedItemPayload<ExtArgs>[];
        };
        scalars: $Extensions.GetPayloadResult<
            {
                id: number;
                name: string;
                description: string;
                startDate: Date;
                aimAndCause: string;
            },
            ExtArgs['result']['program']
        >;
        composites: {};
    };

    type ProgramGetPayload<
        S extends boolean | null | undefined | ProgramDefaultArgs,
    > = $Result.GetResult<Prisma.$ProgramPayload, S>;

    type ProgramCountArgs<
        ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs,
    > = Omit<
        ProgramFindManyArgs,
        'select' | 'include' | 'distinct' | 'omit'
    > & {
        select?: ProgramCountAggregateInputType | true;
    };

    export interface ProgramDelegate<
        ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs,
        GlobalOmitOptions = {},
    > {
        [K: symbol]: {
            types: Prisma.TypeMap<ExtArgs>['model']['Program'];
            meta: { name: 'Program' };
        };
        /**
         * Find zero or one Program that matches the filter.
         * @param {ProgramFindUniqueArgs} args - Arguments to find a Program
         * @example
         * // Get one Program
         * const program = await prisma.program.findUnique({
         *   where: {
         *     // ... provide filter here
         *   }
         * })
         */
        findUnique<T extends ProgramFindUniqueArgs>(
            args: SelectSubset<T, ProgramFindUniqueArgs<ExtArgs>>,
        ): Prisma__ProgramClient<
            $Result.GetResult<
                Prisma.$ProgramPayload<ExtArgs>,
                T,
                'findUnique',
                GlobalOmitOptions
            > | null,
            null,
            ExtArgs,
            GlobalOmitOptions
        >;

        /**
         * Find one Program that matches the filter or throw an error with `error.code='P2025'`
         * if no matches were found.
         * @param {ProgramFindUniqueOrThrowArgs} args - Arguments to find a Program
         * @example
         * // Get one Program
         * const program = await prisma.program.findUniqueOrThrow({
         *   where: {
         *     // ... provide filter here
         *   }
         * })
         */
        findUniqueOrThrow<T extends ProgramFindUniqueOrThrowArgs>(
            args: SelectSubset<T, ProgramFindUniqueOrThrowArgs<ExtArgs>>,
        ): Prisma__ProgramClient<
            $Result.GetResult<
                Prisma.$ProgramPayload<ExtArgs>,
                T,
                'findUniqueOrThrow',
                GlobalOmitOptions
            >,
            never,
            ExtArgs,
            GlobalOmitOptions
        >;

        /**
         * Find the first Program that matches the filter.
         * Note, that providing `undefined` is treated as the value not being there.
         * Read more here: https://pris.ly/d/null-undefined
         * @param {ProgramFindFirstArgs} args - Arguments to find a Program
         * @example
         * // Get one Program
         * const program = await prisma.program.findFirst({
         *   where: {
         *     // ... provide filter here
         *   }
         * })
         */
        findFirst<T extends ProgramFindFirstArgs>(
            args?: SelectSubset<T, ProgramFindFirstArgs<ExtArgs>>,
        ): Prisma__ProgramClient<
            $Result.GetResult<
                Prisma.$ProgramPayload<ExtArgs>,
                T,
                'findFirst',
                GlobalOmitOptions
            > | null,
            null,
            ExtArgs,
            GlobalOmitOptions
        >;

        /**
         * Find the first Program that matches the filter or
         * throw `PrismaKnownClientError` with `P2025` code if no matches were found.
         * Note, that providing `undefined` is treated as the value not being there.
         * Read more here: https://pris.ly/d/null-undefined
         * @param {ProgramFindFirstOrThrowArgs} args - Arguments to find a Program
         * @example
         * // Get one Program
         * const program = await prisma.program.findFirstOrThrow({
         *   where: {
         *     // ... provide filter here
         *   }
         * })
         */
        findFirstOrThrow<T extends ProgramFindFirstOrThrowArgs>(
            args?: SelectSubset<T, ProgramFindFirstOrThrowArgs<ExtArgs>>,
        ): Prisma__ProgramClient<
            $Result.GetResult<
                Prisma.$ProgramPayload<ExtArgs>,
                T,
                'findFirstOrThrow',
                GlobalOmitOptions
            >,
            never,
            ExtArgs,
            GlobalOmitOptions
        >;

        /**
         * Find zero or more Programs that matches the filter.
         * Note, that providing `undefined` is treated as the value not being there.
         * Read more here: https://pris.ly/d/null-undefined
         * @param {ProgramFindManyArgs} args - Arguments to filter and select certain fields only.
         * @example
         * // Get all Programs
         * const programs = await prisma.program.findMany()
         *
         * // Get first 10 Programs
         * const programs = await prisma.program.findMany({ take: 10 })
         *
         * // Only select the `id`
         * const programWithIdOnly = await prisma.program.findMany({ select: { id: true } })
         *
         */
        findMany<T extends ProgramFindManyArgs>(
            args?: SelectSubset<T, ProgramFindManyArgs<ExtArgs>>,
        ): Prisma.PrismaPromise<
            $Result.GetResult<
                Prisma.$ProgramPayload<ExtArgs>,
                T,
                'findMany',
                GlobalOmitOptions
            >
        >;

        /**
         * Create a Program.
         * @param {ProgramCreateArgs} args - Arguments to create a Program.
         * @example
         * // Create one Program
         * const Program = await prisma.program.create({
         *   data: {
         *     // ... data to create a Program
         *   }
         * })
         *
         */
        create<T extends ProgramCreateArgs>(
            args: SelectSubset<T, ProgramCreateArgs<ExtArgs>>,
        ): Prisma__ProgramClient<
            $Result.GetResult<
                Prisma.$ProgramPayload<ExtArgs>,
                T,
                'create',
                GlobalOmitOptions
            >,
            never,
            ExtArgs,
            GlobalOmitOptions
        >;

        /**
         * Create many Programs.
         * @param {ProgramCreateManyArgs} args - Arguments to create many Programs.
         * @example
         * // Create many Programs
         * const program = await prisma.program.createMany({
         *   data: [
         *     // ... provide data here
         *   ]
         * })
         *
         */
        createMany<T extends ProgramCreateManyArgs>(
            args?: SelectSubset<T, ProgramCreateManyArgs<ExtArgs>>,
        ): Prisma.PrismaPromise<BatchPayload>;

        /**
         * Create many Programs and returns the data saved in the database.
         * @param {ProgramCreateManyAndReturnArgs} args - Arguments to create many Programs.
         * @example
         * // Create many Programs
         * const program = await prisma.program.createManyAndReturn({
         *   data: [
         *     // ... provide data here
         *   ]
         * })
         *
         * // Create many Programs and only return the `id`
         * const programWithIdOnly = await prisma.program.createManyAndReturn({
         *   select: { id: true },
         *   data: [
         *     // ... provide data here
         *   ]
         * })
         * Note, that providing `undefined` is treated as the value not being there.
         * Read more here: https://pris.ly/d/null-undefined
         *
         */
        createManyAndReturn<T extends ProgramCreateManyAndReturnArgs>(
            args?: SelectSubset<T, ProgramCreateManyAndReturnArgs<ExtArgs>>,
        ): Prisma.PrismaPromise<
            $Result.GetResult<
                Prisma.$ProgramPayload<ExtArgs>,
                T,
                'createManyAndReturn',
                GlobalOmitOptions
            >
        >;

        /**
         * Delete a Program.
         * @param {ProgramDeleteArgs} args - Arguments to delete one Program.
         * @example
         * // Delete one Program
         * const Program = await prisma.program.delete({
         *   where: {
         *     // ... filter to delete one Program
         *   }
         * })
         *
         */
        delete<T extends ProgramDeleteArgs>(
            args: SelectSubset<T, ProgramDeleteArgs<ExtArgs>>,
        ): Prisma__ProgramClient<
            $Result.GetResult<
                Prisma.$ProgramPayload<ExtArgs>,
                T,
                'delete',
                GlobalOmitOptions
            >,
            never,
            ExtArgs,
            GlobalOmitOptions
        >;

        /**
         * Update one Program.
         * @param {ProgramUpdateArgs} args - Arguments to update one Program.
         * @example
         * // Update one Program
         * const program = await prisma.program.update({
         *   where: {
         *     // ... provide filter here
         *   },
         *   data: {
         *     // ... provide data here
         *   }
         * })
         *
         */
        update<T extends ProgramUpdateArgs>(
            args: SelectSubset<T, ProgramUpdateArgs<ExtArgs>>,
        ): Prisma__ProgramClient<
            $Result.GetResult<
                Prisma.$ProgramPayload<ExtArgs>,
                T,
                'update',
                GlobalOmitOptions
            >,
            never,
            ExtArgs,
            GlobalOmitOptions
        >;

        /**
         * Delete zero or more Programs.
         * @param {ProgramDeleteManyArgs} args - Arguments to filter Programs to delete.
         * @example
         * // Delete a few Programs
         * const { count } = await prisma.program.deleteMany({
         *   where: {
         *     // ... provide filter here
         *   }
         * })
         *
         */
        deleteMany<T extends ProgramDeleteManyArgs>(
            args?: SelectSubset<T, ProgramDeleteManyArgs<ExtArgs>>,
        ): Prisma.PrismaPromise<BatchPayload>;

        /**
         * Update zero or more Programs.
         * Note, that providing `undefined` is treated as the value not being there.
         * Read more here: https://pris.ly/d/null-undefined
         * @param {ProgramUpdateManyArgs} args - Arguments to update one or more rows.
         * @example
         * // Update many Programs
         * const program = await prisma.program.updateMany({
         *   where: {
         *     // ... provide filter here
         *   },
         *   data: {
         *     // ... provide data here
         *   }
         * })
         *
         */
        updateMany<T extends ProgramUpdateManyArgs>(
            args: SelectSubset<T, ProgramUpdateManyArgs<ExtArgs>>,
        ): Prisma.PrismaPromise<BatchPayload>;

        /**
         * Update zero or more Programs and returns the data updated in the database.
         * @param {ProgramUpdateManyAndReturnArgs} args - Arguments to update many Programs.
         * @example
         * // Update many Programs
         * const program = await prisma.program.updateManyAndReturn({
         *   where: {
         *     // ... provide filter here
         *   },
         *   data: [
         *     // ... provide data here
         *   ]
         * })
         *
         * // Update zero or more Programs and only return the `id`
         * const programWithIdOnly = await prisma.program.updateManyAndReturn({
         *   select: { id: true },
         *   where: {
         *     // ... provide filter here
         *   },
         *   data: [
         *     // ... provide data here
         *   ]
         * })
         * Note, that providing `undefined` is treated as the value not being there.
         * Read more here: https://pris.ly/d/null-undefined
         *
         */
        updateManyAndReturn<T extends ProgramUpdateManyAndReturnArgs>(
            args: SelectSubset<T, ProgramUpdateManyAndReturnArgs<ExtArgs>>,
        ): Prisma.PrismaPromise<
            $Result.GetResult<
                Prisma.$ProgramPayload<ExtArgs>,
                T,
                'updateManyAndReturn',
                GlobalOmitOptions
            >
        >;

        /**
         * Create or update one Program.
         * @param {ProgramUpsertArgs} args - Arguments to update or create a Program.
         * @example
         * // Update or create a Program
         * const program = await prisma.program.upsert({
         *   create: {
         *     // ... data to create a Program
         *   },
         *   update: {
         *     // ... in case it already exists, update
         *   },
         *   where: {
         *     // ... the filter for the Program we want to update
         *   }
         * })
         */
        upsert<T extends ProgramUpsertArgs>(
            args: SelectSubset<T, ProgramUpsertArgs<ExtArgs>>,
        ): Prisma__ProgramClient<
            $Result.GetResult<
                Prisma.$ProgramPayload<ExtArgs>,
                T,
                'upsert',
                GlobalOmitOptions
            >,
            never,
            ExtArgs,
            GlobalOmitOptions
        >;

        /**
         * Count the number of Programs.
         * Note, that providing `undefined` is treated as the value not being there.
         * Read more here: https://pris.ly/d/null-undefined
         * @param {ProgramCountArgs} args - Arguments to filter Programs to count.
         * @example
         * // Count the number of Programs
         * const count = await prisma.program.count({
         *   where: {
         *     // ... the filter for the Programs we want to count
         *   }
         * })
         **/
        count<T extends ProgramCountArgs>(
            args?: Subset<T, ProgramCountArgs>,
        ): Prisma.PrismaPromise<
            T extends $Utils.Record<'select', any>
                ? T['select'] extends true
                    ? number
                    : GetScalarType<
                          T['select'],
                          ProgramCountAggregateOutputType
                      >
                : number
        >;

        /**
         * Allows you to perform aggregations operations on a Program.
         * Note, that providing `undefined` is treated as the value not being there.
         * Read more here: https://pris.ly/d/null-undefined
         * @param {ProgramAggregateArgs} args - Select which aggregations you would like to apply and on what fields.
         * @example
         * // Ordered by age ascending
         * // Where email contains prisma.io
         * // Limited to the 10 users
         * const aggregations = await prisma.user.aggregate({
         *   _avg: {
         *     age: true,
         *   },
         *   where: {
         *     email: {
         *       contains: "prisma.io",
         *     },
         *   },
         *   orderBy: {
         *     age: "asc",
         *   },
         *   take: 10,
         * })
         **/
        aggregate<T extends ProgramAggregateArgs>(
            args: Subset<T, ProgramAggregateArgs>,
        ): Prisma.PrismaPromise<GetProgramAggregateType<T>>;

        /**
         * Group by Program.
         * Note, that providing `undefined` is treated as the value not being there.
         * Read more here: https://pris.ly/d/null-undefined
         * @param {ProgramGroupByArgs} args - Group by arguments.
         * @example
         * // Group by city, order by createdAt, get count
         * const result = await prisma.user.groupBy({
         *   by: ['city', 'createdAt'],
         *   orderBy: {
         *     createdAt: true
         *   },
         *   _count: {
         *     _all: true
         *   },
         * })
         *
         **/
        groupBy<
            T extends ProgramGroupByArgs,
            HasSelectOrTake extends Or<
                Extends<'skip', Keys<T>>,
                Extends<'take', Keys<T>>
            >,
            OrderByArg extends True extends HasSelectOrTake
                ? { orderBy: ProgramGroupByArgs['orderBy'] }
                : { orderBy?: ProgramGroupByArgs['orderBy'] },
            OrderFields extends ExcludeUnderscoreKeys<
                Keys<MaybeTupleToUnion<T['orderBy']>>
            >,
            ByFields extends MaybeTupleToUnion<T['by']>,
            ByValid extends Has<ByFields, OrderFields>,
            HavingFields extends GetHavingFields<T['having']>,
            HavingValid extends Has<ByFields, HavingFields>,
            ByEmpty extends T['by'] extends never[] ? True : False,
            InputErrors extends ByEmpty extends True
                ? `Error: "by" must not be empty.`
                : HavingValid extends False
                  ? {
                        [P in HavingFields]: P extends ByFields
                            ? never
                            : P extends string
                              ? `Error: Field "${P}" used in "having" needs to be provided in "by".`
                              : [
                                    Error,
                                    'Field ',
                                    P,
                                    ` in "having" needs to be provided in "by"`,
                                ];
                    }[HavingFields]
                  : 'take' extends Keys<T>
                    ? 'orderBy' extends Keys<T>
                        ? ByValid extends True
                            ? {}
                            : {
                                  [P in OrderFields]: P extends ByFields
                                      ? never
                                      : `Error: Field "${P}" in "orderBy" needs to be provided in "by"`;
                              }[OrderFields]
                        : 'Error: If you provide "take", you also need to provide "orderBy"'
                    : 'skip' extends Keys<T>
                      ? 'orderBy' extends Keys<T>
                          ? ByValid extends True
                              ? {}
                              : {
                                    [P in OrderFields]: P extends ByFields
                                        ? never
                                        : `Error: Field "${P}" in "orderBy" needs to be provided in "by"`;
                                }[OrderFields]
                          : 'Error: If you provide "skip", you also need to provide "orderBy"'
                      : ByValid extends True
                        ? {}
                        : {
                              [P in OrderFields]: P extends ByFields
                                  ? never
                                  : `Error: Field "${P}" in "orderBy" needs to be provided in "by"`;
                          }[OrderFields],
        >(
            args: SubsetIntersection<T, ProgramGroupByArgs, OrderByArg> &
                InputErrors,
        ): {} extends InputErrors
            ? GetProgramGroupByPayload<T>
            : Prisma.PrismaPromise<InputErrors>;
        /**
         * Fields of the Program model
         */
        readonly fields: ProgramFieldRefs;
    }

    /**
     * The delegate class that acts as a "Promise-like" for Program.
     * Why is this prefixed with `Prisma__`?
     * Because we want to prevent naming conflicts as mentioned in
     * https://github.com/prisma/prisma-client-js/issues/707
     */
    export interface Prisma__ProgramClient<
        T,
        Null = never,
        ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs,
        GlobalOmitOptions = {},
    > extends Prisma.PrismaPromise<T> {
        readonly [Symbol.toStringTag]: 'PrismaPromise';
        donatedItems<T extends Program$donatedItemsArgs<ExtArgs> = {}>(
            args?: Subset<T, Program$donatedItemsArgs<ExtArgs>>,
        ): Prisma.PrismaPromise<
            | $Result.GetResult<
                  Prisma.$DonatedItemPayload<ExtArgs>,
                  T,
                  'findMany',
                  GlobalOmitOptions
              >
            | Null
        >;
        /**
         * Attaches callbacks for the resolution and/or rejection of the Promise.
         * @param onfulfilled The callback to execute when the Promise is resolved.
         * @param onrejected The callback to execute when the Promise is rejected.
         * @returns A Promise for the completion of which ever callback is executed.
         */
        then<TResult1 = T, TResult2 = never>(
            onfulfilled?:
                | ((value: T) => TResult1 | PromiseLike<TResult1>)
                | undefined
                | null,
            onrejected?:
                | ((reason: any) => TResult2 | PromiseLike<TResult2>)
                | undefined
                | null,
        ): $Utils.JsPromise<TResult1 | TResult2>;
        /**
         * Attaches a callback for only the rejection of the Promise.
         * @param onrejected The callback to execute when the Promise is rejected.
         * @returns A Promise for the completion of the callback.
         */
        catch<TResult = never>(
            onrejected?:
                | ((reason: any) => TResult | PromiseLike<TResult>)
                | undefined
                | null,
        ): $Utils.JsPromise<T | TResult>;
        /**
         * Attaches a callback that is invoked when the Promise is settled (fulfilled or rejected). The
         * resolved value cannot be modified from the callback.
         * @param onfinally The callback to execute when the Promise is settled (fulfilled or rejected).
         * @returns A Promise for the completion of the callback.
         */
        finally(
            onfinally?: (() => void) | undefined | null,
        ): $Utils.JsPromise<T>;
    }

    /**
     * Fields of the Program model
     */
    interface ProgramFieldRefs {
        readonly id: FieldRef<'Program', 'Int'>;
        readonly name: FieldRef<'Program', 'String'>;
        readonly description: FieldRef<'Program', 'String'>;
        readonly startDate: FieldRef<'Program', 'DateTime'>;
        readonly aimAndCause: FieldRef<'Program', 'String'>;
    }

    // Custom InputTypes
    /**
     * Program findUnique
     */
    export type ProgramFindUniqueArgs<
        ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs,
    > = {
        /**
         * Select specific fields to fetch from the Program
         */
        select?: ProgramSelect<ExtArgs> | null;
        /**
         * Omit specific fields from the Program
         */
        omit?: ProgramOmit<ExtArgs> | null;
        /**
         * Choose, which related nodes to fetch as well
         */
        include?: ProgramInclude<ExtArgs> | null;
        /**
         * Filter, which Program to fetch.
         */
        where: ProgramWhereUniqueInput;
    };

    /**
     * Program findUniqueOrThrow
     */
    export type ProgramFindUniqueOrThrowArgs<
        ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs,
    > = {
        /**
         * Select specific fields to fetch from the Program
         */
        select?: ProgramSelect<ExtArgs> | null;
        /**
         * Omit specific fields from the Program
         */
        omit?: ProgramOmit<ExtArgs> | null;
        /**
         * Choose, which related nodes to fetch as well
         */
        include?: ProgramInclude<ExtArgs> | null;
        /**
         * Filter, which Program to fetch.
         */
        where: ProgramWhereUniqueInput;
    };

    /**
     * Program findFirst
     */
    export type ProgramFindFirstArgs<
        ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs,
    > = {
        /**
         * Select specific fields to fetch from the Program
         */
        select?: ProgramSelect<ExtArgs> | null;
        /**
         * Omit specific fields from the Program
         */
        omit?: ProgramOmit<ExtArgs> | null;
        /**
         * Choose, which related nodes to fetch as well
         */
        include?: ProgramInclude<ExtArgs> | null;
        /**
         * Filter, which Program to fetch.
         */
        where?: ProgramWhereInput;
        /**
         * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
         *
         * Determine the order of Programs to fetch.
         */
        orderBy?:
            | ProgramOrderByWithRelationInput
            | ProgramOrderByWithRelationInput[];
        /**
         * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
         *
         * Sets the position for searching for Programs.
         */
        cursor?: ProgramWhereUniqueInput;
        /**
         * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
         *
         * Take `±n` Programs from the position of the cursor.
         */
        take?: number;
        /**
         * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
         *
         * Skip the first `n` Programs.
         */
        skip?: number;
        /**
         * {@link https://www.prisma.io/docs/concepts/components/prisma-client/distinct Distinct Docs}
         *
         * Filter by unique combinations of Programs.
         */
        distinct?: ProgramScalarFieldEnum | ProgramScalarFieldEnum[];
    };

    /**
     * Program findFirstOrThrow
     */
    export type ProgramFindFirstOrThrowArgs<
        ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs,
    > = {
        /**
         * Select specific fields to fetch from the Program
         */
        select?: ProgramSelect<ExtArgs> | null;
        /**
         * Omit specific fields from the Program
         */
        omit?: ProgramOmit<ExtArgs> | null;
        /**
         * Choose, which related nodes to fetch as well
         */
        include?: ProgramInclude<ExtArgs> | null;
        /**
         * Filter, which Program to fetch.
         */
        where?: ProgramWhereInput;
        /**
         * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
         *
         * Determine the order of Programs to fetch.
         */
        orderBy?:
            | ProgramOrderByWithRelationInput
            | ProgramOrderByWithRelationInput[];
        /**
         * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
         *
         * Sets the position for searching for Programs.
         */
        cursor?: ProgramWhereUniqueInput;
        /**
         * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
         *
         * Take `±n` Programs from the position of the cursor.
         */
        take?: number;
        /**
         * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
         *
         * Skip the first `n` Programs.
         */
        skip?: number;
        /**
         * {@link https://www.prisma.io/docs/concepts/components/prisma-client/distinct Distinct Docs}
         *
         * Filter by unique combinations of Programs.
         */
        distinct?: ProgramScalarFieldEnum | ProgramScalarFieldEnum[];
    };

    /**
     * Program findMany
     */
    export type ProgramFindManyArgs<
        ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs,
    > = {
        /**
         * Select specific fields to fetch from the Program
         */
        select?: ProgramSelect<ExtArgs> | null;
        /**
         * Omit specific fields from the Program
         */
        omit?: ProgramOmit<ExtArgs> | null;
        /**
         * Choose, which related nodes to fetch as well
         */
        include?: ProgramInclude<ExtArgs> | null;
        /**
         * Filter, which Programs to fetch.
         */
        where?: ProgramWhereInput;
        /**
         * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
         *
         * Determine the order of Programs to fetch.
         */
        orderBy?:
            | ProgramOrderByWithRelationInput
            | ProgramOrderByWithRelationInput[];
        /**
         * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
         *
         * Sets the position for listing Programs.
         */
        cursor?: ProgramWhereUniqueInput;
        /**
         * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
         *
         * Take `±n` Programs from the position of the cursor.
         */
        take?: number;
        /**
         * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
         *
         * Skip the first `n` Programs.
         */
        skip?: number;
        /**
         * {@link https://www.prisma.io/docs/concepts/components/prisma-client/distinct Distinct Docs}
         *
         * Filter by unique combinations of Programs.
         */
        distinct?: ProgramScalarFieldEnum | ProgramScalarFieldEnum[];
    };

    /**
     * Program create
     */
    export type ProgramCreateArgs<
        ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs,
    > = {
        /**
         * Select specific fields to fetch from the Program
         */
        select?: ProgramSelect<ExtArgs> | null;
        /**
         * Omit specific fields from the Program
         */
        omit?: ProgramOmit<ExtArgs> | null;
        /**
         * Choose, which related nodes to fetch as well
         */
        include?: ProgramInclude<ExtArgs> | null;
        /**
         * The data needed to create a Program.
         */
        data: XOR<ProgramCreateInput, ProgramUncheckedCreateInput>;
    };

    /**
     * Program createMany
     */
    export type ProgramCreateManyArgs<
        ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs,
    > = {
        /**
         * The data used to create many Programs.
         */
        data: ProgramCreateManyInput | ProgramCreateManyInput[];
        skipDuplicates?: boolean;
    };

    /**
     * Program createManyAndReturn
     */
    export type ProgramCreateManyAndReturnArgs<
        ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs,
    > = {
        /**
         * Select specific fields to fetch from the Program
         */
        select?: ProgramSelectCreateManyAndReturn<ExtArgs> | null;
        /**
         * Omit specific fields from the Program
         */
        omit?: ProgramOmit<ExtArgs> | null;
        /**
         * The data used to create many Programs.
         */
        data: ProgramCreateManyInput | ProgramCreateManyInput[];
        skipDuplicates?: boolean;
    };

    /**
     * Program update
     */
    export type ProgramUpdateArgs<
        ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs,
    > = {
        /**
         * Select specific fields to fetch from the Program
         */
        select?: ProgramSelect<ExtArgs> | null;
        /**
         * Omit specific fields from the Program
         */
        omit?: ProgramOmit<ExtArgs> | null;
        /**
         * Choose, which related nodes to fetch as well
         */
        include?: ProgramInclude<ExtArgs> | null;
        /**
         * The data needed to update a Program.
         */
        data: XOR<ProgramUpdateInput, ProgramUncheckedUpdateInput>;
        /**
         * Choose, which Program to update.
         */
        where: ProgramWhereUniqueInput;
    };

    /**
     * Program updateMany
     */
    export type ProgramUpdateManyArgs<
        ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs,
    > = {
        /**
         * The data used to update Programs.
         */
        data: XOR<
            ProgramUpdateManyMutationInput,
            ProgramUncheckedUpdateManyInput
        >;
        /**
         * Filter which Programs to update
         */
        where?: ProgramWhereInput;
        /**
         * Limit how many Programs to update.
         */
        limit?: number;
    };

    /**
     * Program updateManyAndReturn
     */
    export type ProgramUpdateManyAndReturnArgs<
        ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs,
    > = {
        /**
         * Select specific fields to fetch from the Program
         */
        select?: ProgramSelectUpdateManyAndReturn<ExtArgs> | null;
        /**
         * Omit specific fields from the Program
         */
        omit?: ProgramOmit<ExtArgs> | null;
        /**
         * The data used to update Programs.
         */
        data: XOR<
            ProgramUpdateManyMutationInput,
            ProgramUncheckedUpdateManyInput
        >;
        /**
         * Filter which Programs to update
         */
        where?: ProgramWhereInput;
        /**
         * Limit how many Programs to update.
         */
        limit?: number;
    };

    /**
     * Program upsert
     */
    export type ProgramUpsertArgs<
        ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs,
    > = {
        /**
         * Select specific fields to fetch from the Program
         */
        select?: ProgramSelect<ExtArgs> | null;
        /**
         * Omit specific fields from the Program
         */
        omit?: ProgramOmit<ExtArgs> | null;
        /**
         * Choose, which related nodes to fetch as well
         */
        include?: ProgramInclude<ExtArgs> | null;
        /**
         * The filter to search for the Program to update in case it exists.
         */
        where: ProgramWhereUniqueInput;
        /**
         * In case the Program found by the `where` argument doesn't exist, create a new Program with this data.
         */
        create: XOR<ProgramCreateInput, ProgramUncheckedCreateInput>;
        /**
         * In case the Program was found with the provided `where` argument, update it with this data.
         */
        update: XOR<ProgramUpdateInput, ProgramUncheckedUpdateInput>;
    };

    /**
     * Program delete
     */
    export type ProgramDeleteArgs<
        ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs,
    > = {
        /**
         * Select specific fields to fetch from the Program
         */
        select?: ProgramSelect<ExtArgs> | null;
        /**
         * Omit specific fields from the Program
         */
        omit?: ProgramOmit<ExtArgs> | null;
        /**
         * Choose, which related nodes to fetch as well
         */
        include?: ProgramInclude<ExtArgs> | null;
        /**
         * Filter which Program to delete.
         */
        where: ProgramWhereUniqueInput;
    };

    /**
     * Program deleteMany
     */
    export type ProgramDeleteManyArgs<
        ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs,
    > = {
        /**
         * Filter which Programs to delete
         */
        where?: ProgramWhereInput;
        /**
         * Limit how many Programs to delete.
         */
        limit?: number;
    };

    /**
     * Program.donatedItems
     */
    export type Program$donatedItemsArgs<
        ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs,
    > = {
        /**
         * Select specific fields to fetch from the DonatedItem
         */
        select?: DonatedItemSelect<ExtArgs> | null;
        /**
         * Omit specific fields from the DonatedItem
         */
        omit?: DonatedItemOmit<ExtArgs> | null;
        /**
         * Choose, which related nodes to fetch as well
         */
        include?: DonatedItemInclude<ExtArgs> | null;
        where?: DonatedItemWhereInput;
        orderBy?:
            | DonatedItemOrderByWithRelationInput
            | DonatedItemOrderByWithRelationInput[];
        cursor?: DonatedItemWhereUniqueInput;
        take?: number;
        skip?: number;
        distinct?: DonatedItemScalarFieldEnum | DonatedItemScalarFieldEnum[];
    };

    /**
     * Program without action
     */
    export type ProgramDefaultArgs<
        ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs,
    > = {
        /**
         * Select specific fields to fetch from the Program
         */
        select?: ProgramSelect<ExtArgs> | null;
        /**
         * Omit specific fields from the Program
         */
        omit?: ProgramOmit<ExtArgs> | null;
        /**
         * Choose, which related nodes to fetch as well
         */
        include?: ProgramInclude<ExtArgs> | null;
    };

    /**
     * Model DonatedItem
     */

    export type AggregateDonatedItem = {
        _count: DonatedItemCountAggregateOutputType | null;
        _avg: DonatedItemAvgAggregateOutputType | null;
        _sum: DonatedItemSumAggregateOutputType | null;
        _min: DonatedItemMinAggregateOutputType | null;
        _max: DonatedItemMaxAggregateOutputType | null;
    };

    export type DonatedItemAvgAggregateOutputType = {
        id: number | null;
        quantity: number | null;
        donorId: number | null;
        programId: number | null;
    };

    export type DonatedItemSumAggregateOutputType = {
        id: number | null;
        quantity: number | null;
        donorId: number | null;
        programId: number | null;
    };

    export type DonatedItemMinAggregateOutputType = {
        id: number | null;
        itemType: string | null;
        category: string | null;
        quantity: number | null;
        currentStatus: string | null;
        dateDonated: Date | null;
        lastUpdated: Date | null;
        imagePath: string | null;
        donorId: number | null;
        programId: number | null;
    };

    export type DonatedItemMaxAggregateOutputType = {
        id: number | null;
        itemType: string | null;
        category: string | null;
        quantity: number | null;
        currentStatus: string | null;
        dateDonated: Date | null;
        lastUpdated: Date | null;
        imagePath: string | null;
        donorId: number | null;
        programId: number | null;
    };

    export type DonatedItemCountAggregateOutputType = {
        id: number;
        itemType: number;
        category: number;
        quantity: number;
        currentStatus: number;
        dateDonated: number;
        lastUpdated: number;
        imagePath: number;
        analysisMetadata: number;
        donorId: number;
        programId: number;
        _all: number;
    };

    export type DonatedItemAvgAggregateInputType = {
        id?: true;
        quantity?: true;
        donorId?: true;
        programId?: true;
    };

    export type DonatedItemSumAggregateInputType = {
        id?: true;
        quantity?: true;
        donorId?: true;
        programId?: true;
    };

    export type DonatedItemMinAggregateInputType = {
        id?: true;
        itemType?: true;
        category?: true;
        quantity?: true;
        currentStatus?: true;
        dateDonated?: true;
        lastUpdated?: true;
        imagePath?: true;
        donorId?: true;
        programId?: true;
    };

    export type DonatedItemMaxAggregateInputType = {
        id?: true;
        itemType?: true;
        category?: true;
        quantity?: true;
        currentStatus?: true;
        dateDonated?: true;
        lastUpdated?: true;
        imagePath?: true;
        donorId?: true;
        programId?: true;
    };

    export type DonatedItemCountAggregateInputType = {
        id?: true;
        itemType?: true;
        category?: true;
        quantity?: true;
        currentStatus?: true;
        dateDonated?: true;
        lastUpdated?: true;
        imagePath?: true;
        analysisMetadata?: true;
        donorId?: true;
        programId?: true;
        _all?: true;
    };

    export type DonatedItemAggregateArgs<
        ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs,
    > = {
        /**
         * Filter which DonatedItem to aggregate.
         */
        where?: DonatedItemWhereInput;
        /**
         * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
         *
         * Determine the order of DonatedItems to fetch.
         */
        orderBy?:
            | DonatedItemOrderByWithRelationInput
            | DonatedItemOrderByWithRelationInput[];
        /**
         * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
         *
         * Sets the start position
         */
        cursor?: DonatedItemWhereUniqueInput;
        /**
         * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
         *
         * Take `±n` DonatedItems from the position of the cursor.
         */
        take?: number;
        /**
         * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
         *
         * Skip the first `n` DonatedItems.
         */
        skip?: number;
        /**
         * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
         *
         * Count returned DonatedItems
         **/
        _count?: true | DonatedItemCountAggregateInputType;
        /**
         * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
         *
         * Select which fields to average
         **/
        _avg?: DonatedItemAvgAggregateInputType;
        /**
         * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
         *
         * Select which fields to sum
         **/
        _sum?: DonatedItemSumAggregateInputType;
        /**
         * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
         *
         * Select which fields to find the minimum value
         **/
        _min?: DonatedItemMinAggregateInputType;
        /**
         * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
         *
         * Select which fields to find the maximum value
         **/
        _max?: DonatedItemMaxAggregateInputType;
    };

    export type GetDonatedItemAggregateType<
        T extends DonatedItemAggregateArgs,
    > = {
        [P in keyof T & keyof AggregateDonatedItem]: P extends
            | '_count'
            | 'count'
            ? T[P] extends true
                ? number
                : GetScalarType<T[P], AggregateDonatedItem[P]>
            : GetScalarType<T[P], AggregateDonatedItem[P]>;
    };

    export type DonatedItemGroupByArgs<
        ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs,
    > = {
        where?: DonatedItemWhereInput;
        orderBy?:
            | DonatedItemOrderByWithAggregationInput
            | DonatedItemOrderByWithAggregationInput[];
        by: DonatedItemScalarFieldEnum[] | DonatedItemScalarFieldEnum;
        having?: DonatedItemScalarWhereWithAggregatesInput;
        take?: number;
        skip?: number;
        _count?: DonatedItemCountAggregateInputType | true;
        _avg?: DonatedItemAvgAggregateInputType;
        _sum?: DonatedItemSumAggregateInputType;
        _min?: DonatedItemMinAggregateInputType;
        _max?: DonatedItemMaxAggregateInputType;
    };

    export type DonatedItemGroupByOutputType = {
        id: number;
        itemType: string;
        category: string;
        quantity: number;
        currentStatus: string;
        dateDonated: Date;
        lastUpdated: Date;
        imagePath: string | null;
        analysisMetadata: JsonValue | null;
        donorId: number;
        programId: number | null;
        _count: DonatedItemCountAggregateOutputType | null;
        _avg: DonatedItemAvgAggregateOutputType | null;
        _sum: DonatedItemSumAggregateOutputType | null;
        _min: DonatedItemMinAggregateOutputType | null;
        _max: DonatedItemMaxAggregateOutputType | null;
    };

    type GetDonatedItemGroupByPayload<T extends DonatedItemGroupByArgs> =
        Prisma.PrismaPromise<
            Array<
                PickEnumerable<DonatedItemGroupByOutputType, T['by']> & {
                    [P in keyof T &
                        keyof DonatedItemGroupByOutputType]: P extends '_count'
                        ? T[P] extends boolean
                            ? number
                            : GetScalarType<
                                  T[P],
                                  DonatedItemGroupByOutputType[P]
                              >
                        : GetScalarType<T[P], DonatedItemGroupByOutputType[P]>;
                }
            >
        >;

    export type DonatedItemSelect<
        ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs,
    > = $Extensions.GetSelect<
        {
            id?: boolean;
            itemType?: boolean;
            category?: boolean;
            quantity?: boolean;
            currentStatus?: boolean;
            dateDonated?: boolean;
            lastUpdated?: boolean;
            imagePath?: boolean;
            analysisMetadata?: boolean;
            donorId?: boolean;
            programId?: boolean;
            donor?: boolean | DonorDefaultArgs<ExtArgs>;
            program?: boolean | DonatedItem$programArgs<ExtArgs>;
            statuses?: boolean | DonatedItem$statusesArgs<ExtArgs>;
            _count?: boolean | DonatedItemCountOutputTypeDefaultArgs<ExtArgs>;
        },
        ExtArgs['result']['donatedItem']
    >;

    export type DonatedItemSelectCreateManyAndReturn<
        ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs,
    > = $Extensions.GetSelect<
        {
            id?: boolean;
            itemType?: boolean;
            category?: boolean;
            quantity?: boolean;
            currentStatus?: boolean;
            dateDonated?: boolean;
            lastUpdated?: boolean;
            imagePath?: boolean;
            analysisMetadata?: boolean;
            donorId?: boolean;
            programId?: boolean;
            donor?: boolean | DonorDefaultArgs<ExtArgs>;
            program?: boolean | DonatedItem$programArgs<ExtArgs>;
        },
        ExtArgs['result']['donatedItem']
    >;

    export type DonatedItemSelectUpdateManyAndReturn<
        ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs,
    > = $Extensions.GetSelect<
        {
            id?: boolean;
            itemType?: boolean;
            category?: boolean;
            quantity?: boolean;
            currentStatus?: boolean;
            dateDonated?: boolean;
            lastUpdated?: boolean;
            imagePath?: boolean;
            analysisMetadata?: boolean;
            donorId?: boolean;
            programId?: boolean;
            donor?: boolean | DonorDefaultArgs<ExtArgs>;
            program?: boolean | DonatedItem$programArgs<ExtArgs>;
        },
        ExtArgs['result']['donatedItem']
    >;

    export type DonatedItemSelectScalar = {
        id?: boolean;
        itemType?: boolean;
        category?: boolean;
        quantity?: boolean;
        currentStatus?: boolean;
        dateDonated?: boolean;
        lastUpdated?: boolean;
        imagePath?: boolean;
        analysisMetadata?: boolean;
        donorId?: boolean;
        programId?: boolean;
    };

    export type DonatedItemOmit<
        ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs,
    > = $Extensions.GetOmit<
        | 'id'
        | 'itemType'
        | 'category'
        | 'quantity'
        | 'currentStatus'
        | 'dateDonated'
        | 'lastUpdated'
        | 'imagePath'
        | 'analysisMetadata'
        | 'donorId'
        | 'programId',
        ExtArgs['result']['donatedItem']
    >;
    export type DonatedItemInclude<
        ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs,
    > = {
        donor?: boolean | DonorDefaultArgs<ExtArgs>;
        program?: boolean | DonatedItem$programArgs<ExtArgs>;
        statuses?: boolean | DonatedItem$statusesArgs<ExtArgs>;
        _count?: boolean | DonatedItemCountOutputTypeDefaultArgs<ExtArgs>;
    };
    export type DonatedItemIncludeCreateManyAndReturn<
        ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs,
    > = {
        donor?: boolean | DonorDefaultArgs<ExtArgs>;
        program?: boolean | DonatedItem$programArgs<ExtArgs>;
    };
    export type DonatedItemIncludeUpdateManyAndReturn<
        ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs,
    > = {
        donor?: boolean | DonorDefaultArgs<ExtArgs>;
        program?: boolean | DonatedItem$programArgs<ExtArgs>;
    };

    export type $DonatedItemPayload<
        ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs,
    > = {
        name: 'DonatedItem';
        objects: {
            donor: Prisma.$DonorPayload<ExtArgs>;
            program: Prisma.$ProgramPayload<ExtArgs> | null;
            statuses: Prisma.$DonatedItemStatusPayload<ExtArgs>[];
        };
        scalars: $Extensions.GetPayloadResult<
            {
                id: number;
                itemType: string;
                category: string;
                quantity: number;
                currentStatus: string;
                dateDonated: Date;
                lastUpdated: Date;
                imagePath: string | null;
                analysisMetadata: Prisma.JsonValue | null;
                donorId: number;
                programId: number | null;
            },
            ExtArgs['result']['donatedItem']
        >;
        composites: {};
    };

    type DonatedItemGetPayload<
        S extends boolean | null | undefined | DonatedItemDefaultArgs,
    > = $Result.GetResult<Prisma.$DonatedItemPayload, S>;

    type DonatedItemCountArgs<
        ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs,
    > = Omit<
        DonatedItemFindManyArgs,
        'select' | 'include' | 'distinct' | 'omit'
    > & {
        select?: DonatedItemCountAggregateInputType | true;
    };

    export interface DonatedItemDelegate<
        ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs,
        GlobalOmitOptions = {},
    > {
        [K: symbol]: {
            types: Prisma.TypeMap<ExtArgs>['model']['DonatedItem'];
            meta: { name: 'DonatedItem' };
        };
        /**
         * Find zero or one DonatedItem that matches the filter.
         * @param {DonatedItemFindUniqueArgs} args - Arguments to find a DonatedItem
         * @example
         * // Get one DonatedItem
         * const donatedItem = await prisma.donatedItem.findUnique({
         *   where: {
         *     // ... provide filter here
         *   }
         * })
         */
        findUnique<T extends DonatedItemFindUniqueArgs>(
            args: SelectSubset<T, DonatedItemFindUniqueArgs<ExtArgs>>,
        ): Prisma__DonatedItemClient<
            $Result.GetResult<
                Prisma.$DonatedItemPayload<ExtArgs>,
                T,
                'findUnique',
                GlobalOmitOptions
            > | null,
            null,
            ExtArgs,
            GlobalOmitOptions
        >;

        /**
         * Find one DonatedItem that matches the filter or throw an error with `error.code='P2025'`
         * if no matches were found.
         * @param {DonatedItemFindUniqueOrThrowArgs} args - Arguments to find a DonatedItem
         * @example
         * // Get one DonatedItem
         * const donatedItem = await prisma.donatedItem.findUniqueOrThrow({
         *   where: {
         *     // ... provide filter here
         *   }
         * })
         */
        findUniqueOrThrow<T extends DonatedItemFindUniqueOrThrowArgs>(
            args: SelectSubset<T, DonatedItemFindUniqueOrThrowArgs<ExtArgs>>,
        ): Prisma__DonatedItemClient<
            $Result.GetResult<
                Prisma.$DonatedItemPayload<ExtArgs>,
                T,
                'findUniqueOrThrow',
                GlobalOmitOptions
            >,
            never,
            ExtArgs,
            GlobalOmitOptions
        >;

        /**
         * Find the first DonatedItem that matches the filter.
         * Note, that providing `undefined` is treated as the value not being there.
         * Read more here: https://pris.ly/d/null-undefined
         * @param {DonatedItemFindFirstArgs} args - Arguments to find a DonatedItem
         * @example
         * // Get one DonatedItem
         * const donatedItem = await prisma.donatedItem.findFirst({
         *   where: {
         *     // ... provide filter here
         *   }
         * })
         */
        findFirst<T extends DonatedItemFindFirstArgs>(
            args?: SelectSubset<T, DonatedItemFindFirstArgs<ExtArgs>>,
        ): Prisma__DonatedItemClient<
            $Result.GetResult<
                Prisma.$DonatedItemPayload<ExtArgs>,
                T,
                'findFirst',
                GlobalOmitOptions
            > | null,
            null,
            ExtArgs,
            GlobalOmitOptions
        >;

        /**
         * Find the first DonatedItem that matches the filter or
         * throw `PrismaKnownClientError` with `P2025` code if no matches were found.
         * Note, that providing `undefined` is treated as the value not being there.
         * Read more here: https://pris.ly/d/null-undefined
         * @param {DonatedItemFindFirstOrThrowArgs} args - Arguments to find a DonatedItem
         * @example
         * // Get one DonatedItem
         * const donatedItem = await prisma.donatedItem.findFirstOrThrow({
         *   where: {
         *     // ... provide filter here
         *   }
         * })
         */
        findFirstOrThrow<T extends DonatedItemFindFirstOrThrowArgs>(
            args?: SelectSubset<T, DonatedItemFindFirstOrThrowArgs<ExtArgs>>,
        ): Prisma__DonatedItemClient<
            $Result.GetResult<
                Prisma.$DonatedItemPayload<ExtArgs>,
                T,
                'findFirstOrThrow',
                GlobalOmitOptions
            >,
            never,
            ExtArgs,
            GlobalOmitOptions
        >;

        /**
         * Find zero or more DonatedItems that matches the filter.
         * Note, that providing `undefined` is treated as the value not being there.
         * Read more here: https://pris.ly/d/null-undefined
         * @param {DonatedItemFindManyArgs} args - Arguments to filter and select certain fields only.
         * @example
         * // Get all DonatedItems
         * const donatedItems = await prisma.donatedItem.findMany()
         *
         * // Get first 10 DonatedItems
         * const donatedItems = await prisma.donatedItem.findMany({ take: 10 })
         *
         * // Only select the `id`
         * const donatedItemWithIdOnly = await prisma.donatedItem.findMany({ select: { id: true } })
         *
         */
        findMany<T extends DonatedItemFindManyArgs>(
            args?: SelectSubset<T, DonatedItemFindManyArgs<ExtArgs>>,
        ): Prisma.PrismaPromise<
            $Result.GetResult<
                Prisma.$DonatedItemPayload<ExtArgs>,
                T,
                'findMany',
                GlobalOmitOptions
            >
        >;

        /**
         * Create a DonatedItem.
         * @param {DonatedItemCreateArgs} args - Arguments to create a DonatedItem.
         * @example
         * // Create one DonatedItem
         * const DonatedItem = await prisma.donatedItem.create({
         *   data: {
         *     // ... data to create a DonatedItem
         *   }
         * })
         *
         */
        create<T extends DonatedItemCreateArgs>(
            args: SelectSubset<T, DonatedItemCreateArgs<ExtArgs>>,
        ): Prisma__DonatedItemClient<
            $Result.GetResult<
                Prisma.$DonatedItemPayload<ExtArgs>,
                T,
                'create',
                GlobalOmitOptions
            >,
            never,
            ExtArgs,
            GlobalOmitOptions
        >;

        /**
         * Create many DonatedItems.
         * @param {DonatedItemCreateManyArgs} args - Arguments to create many DonatedItems.
         * @example
         * // Create many DonatedItems
         * const donatedItem = await prisma.donatedItem.createMany({
         *   data: [
         *     // ... provide data here
         *   ]
         * })
         *
         */
        createMany<T extends DonatedItemCreateManyArgs>(
            args?: SelectSubset<T, DonatedItemCreateManyArgs<ExtArgs>>,
        ): Prisma.PrismaPromise<BatchPayload>;

        /**
         * Create many DonatedItems and returns the data saved in the database.
         * @param {DonatedItemCreateManyAndReturnArgs} args - Arguments to create many DonatedItems.
         * @example
         * // Create many DonatedItems
         * const donatedItem = await prisma.donatedItem.createManyAndReturn({
         *   data: [
         *     // ... provide data here
         *   ]
         * })
         *
         * // Create many DonatedItems and only return the `id`
         * const donatedItemWithIdOnly = await prisma.donatedItem.createManyAndReturn({
         *   select: { id: true },
         *   data: [
         *     // ... provide data here
         *   ]
         * })
         * Note, that providing `undefined` is treated as the value not being there.
         * Read more here: https://pris.ly/d/null-undefined
         *
         */
        createManyAndReturn<T extends DonatedItemCreateManyAndReturnArgs>(
            args?: SelectSubset<T, DonatedItemCreateManyAndReturnArgs<ExtArgs>>,
        ): Prisma.PrismaPromise<
            $Result.GetResult<
                Prisma.$DonatedItemPayload<ExtArgs>,
                T,
                'createManyAndReturn',
                GlobalOmitOptions
            >
        >;

        /**
         * Delete a DonatedItem.
         * @param {DonatedItemDeleteArgs} args - Arguments to delete one DonatedItem.
         * @example
         * // Delete one DonatedItem
         * const DonatedItem = await prisma.donatedItem.delete({
         *   where: {
         *     // ... filter to delete one DonatedItem
         *   }
         * })
         *
         */
        delete<T extends DonatedItemDeleteArgs>(
            args: SelectSubset<T, DonatedItemDeleteArgs<ExtArgs>>,
        ): Prisma__DonatedItemClient<
            $Result.GetResult<
                Prisma.$DonatedItemPayload<ExtArgs>,
                T,
                'delete',
                GlobalOmitOptions
            >,
            never,
            ExtArgs,
            GlobalOmitOptions
        >;

        /**
         * Update one DonatedItem.
         * @param {DonatedItemUpdateArgs} args - Arguments to update one DonatedItem.
         * @example
         * // Update one DonatedItem
         * const donatedItem = await prisma.donatedItem.update({
         *   where: {
         *     // ... provide filter here
         *   },
         *   data: {
         *     // ... provide data here
         *   }
         * })
         *
         */
        update<T extends DonatedItemUpdateArgs>(
            args: SelectSubset<T, DonatedItemUpdateArgs<ExtArgs>>,
        ): Prisma__DonatedItemClient<
            $Result.GetResult<
                Prisma.$DonatedItemPayload<ExtArgs>,
                T,
                'update',
                GlobalOmitOptions
            >,
            never,
            ExtArgs,
            GlobalOmitOptions
        >;

        /**
         * Delete zero or more DonatedItems.
         * @param {DonatedItemDeleteManyArgs} args - Arguments to filter DonatedItems to delete.
         * @example
         * // Delete a few DonatedItems
         * const { count } = await prisma.donatedItem.deleteMany({
         *   where: {
         *     // ... provide filter here
         *   }
         * })
         *
         */
        deleteMany<T extends DonatedItemDeleteManyArgs>(
            args?: SelectSubset<T, DonatedItemDeleteManyArgs<ExtArgs>>,
        ): Prisma.PrismaPromise<BatchPayload>;

        /**
         * Update zero or more DonatedItems.
         * Note, that providing `undefined` is treated as the value not being there.
         * Read more here: https://pris.ly/d/null-undefined
         * @param {DonatedItemUpdateManyArgs} args - Arguments to update one or more rows.
         * @example
         * // Update many DonatedItems
         * const donatedItem = await prisma.donatedItem.updateMany({
         *   where: {
         *     // ... provide filter here
         *   },
         *   data: {
         *     // ... provide data here
         *   }
         * })
         *
         */
        updateMany<T extends DonatedItemUpdateManyArgs>(
            args: SelectSubset<T, DonatedItemUpdateManyArgs<ExtArgs>>,
        ): Prisma.PrismaPromise<BatchPayload>;

        /**
         * Update zero or more DonatedItems and returns the data updated in the database.
         * @param {DonatedItemUpdateManyAndReturnArgs} args - Arguments to update many DonatedItems.
         * @example
         * // Update many DonatedItems
         * const donatedItem = await prisma.donatedItem.updateManyAndReturn({
         *   where: {
         *     // ... provide filter here
         *   },
         *   data: [
         *     // ... provide data here
         *   ]
         * })
         *
         * // Update zero or more DonatedItems and only return the `id`
         * const donatedItemWithIdOnly = await prisma.donatedItem.updateManyAndReturn({
         *   select: { id: true },
         *   where: {
         *     // ... provide filter here
         *   },
         *   data: [
         *     // ... provide data here
         *   ]
         * })
         * Note, that providing `undefined` is treated as the value not being there.
         * Read more here: https://pris.ly/d/null-undefined
         *
         */
        updateManyAndReturn<T extends DonatedItemUpdateManyAndReturnArgs>(
            args: SelectSubset<T, DonatedItemUpdateManyAndReturnArgs<ExtArgs>>,
        ): Prisma.PrismaPromise<
            $Result.GetResult<
                Prisma.$DonatedItemPayload<ExtArgs>,
                T,
                'updateManyAndReturn',
                GlobalOmitOptions
            >
        >;

        /**
         * Create or update one DonatedItem.
         * @param {DonatedItemUpsertArgs} args - Arguments to update or create a DonatedItem.
         * @example
         * // Update or create a DonatedItem
         * const donatedItem = await prisma.donatedItem.upsert({
         *   create: {
         *     // ... data to create a DonatedItem
         *   },
         *   update: {
         *     // ... in case it already exists, update
         *   },
         *   where: {
         *     // ... the filter for the DonatedItem we want to update
         *   }
         * })
         */
        upsert<T extends DonatedItemUpsertArgs>(
            args: SelectSubset<T, DonatedItemUpsertArgs<ExtArgs>>,
        ): Prisma__DonatedItemClient<
            $Result.GetResult<
                Prisma.$DonatedItemPayload<ExtArgs>,
                T,
                'upsert',
                GlobalOmitOptions
            >,
            never,
            ExtArgs,
            GlobalOmitOptions
        >;

        /**
         * Count the number of DonatedItems.
         * Note, that providing `undefined` is treated as the value not being there.
         * Read more here: https://pris.ly/d/null-undefined
         * @param {DonatedItemCountArgs} args - Arguments to filter DonatedItems to count.
         * @example
         * // Count the number of DonatedItems
         * const count = await prisma.donatedItem.count({
         *   where: {
         *     // ... the filter for the DonatedItems we want to count
         *   }
         * })
         **/
        count<T extends DonatedItemCountArgs>(
            args?: Subset<T, DonatedItemCountArgs>,
        ): Prisma.PrismaPromise<
            T extends $Utils.Record<'select', any>
                ? T['select'] extends true
                    ? number
                    : GetScalarType<
                          T['select'],
                          DonatedItemCountAggregateOutputType
                      >
                : number
        >;

        /**
         * Allows you to perform aggregations operations on a DonatedItem.
         * Note, that providing `undefined` is treated as the value not being there.
         * Read more here: https://pris.ly/d/null-undefined
         * @param {DonatedItemAggregateArgs} args - Select which aggregations you would like to apply and on what fields.
         * @example
         * // Ordered by age ascending
         * // Where email contains prisma.io
         * // Limited to the 10 users
         * const aggregations = await prisma.user.aggregate({
         *   _avg: {
         *     age: true,
         *   },
         *   where: {
         *     email: {
         *       contains: "prisma.io",
         *     },
         *   },
         *   orderBy: {
         *     age: "asc",
         *   },
         *   take: 10,
         * })
         **/
        aggregate<T extends DonatedItemAggregateArgs>(
            args: Subset<T, DonatedItemAggregateArgs>,
        ): Prisma.PrismaPromise<GetDonatedItemAggregateType<T>>;

        /**
         * Group by DonatedItem.
         * Note, that providing `undefined` is treated as the value not being there.
         * Read more here: https://pris.ly/d/null-undefined
         * @param {DonatedItemGroupByArgs} args - Group by arguments.
         * @example
         * // Group by city, order by createdAt, get count
         * const result = await prisma.user.groupBy({
         *   by: ['city', 'createdAt'],
         *   orderBy: {
         *     createdAt: true
         *   },
         *   _count: {
         *     _all: true
         *   },
         * })
         *
         **/
        groupBy<
            T extends DonatedItemGroupByArgs,
            HasSelectOrTake extends Or<
                Extends<'skip', Keys<T>>,
                Extends<'take', Keys<T>>
            >,
            OrderByArg extends True extends HasSelectOrTake
                ? { orderBy: DonatedItemGroupByArgs['orderBy'] }
                : { orderBy?: DonatedItemGroupByArgs['orderBy'] },
            OrderFields extends ExcludeUnderscoreKeys<
                Keys<MaybeTupleToUnion<T['orderBy']>>
            >,
            ByFields extends MaybeTupleToUnion<T['by']>,
            ByValid extends Has<ByFields, OrderFields>,
            HavingFields extends GetHavingFields<T['having']>,
            HavingValid extends Has<ByFields, HavingFields>,
            ByEmpty extends T['by'] extends never[] ? True : False,
            InputErrors extends ByEmpty extends True
                ? `Error: "by" must not be empty.`
                : HavingValid extends False
                  ? {
                        [P in HavingFields]: P extends ByFields
                            ? never
                            : P extends string
                              ? `Error: Field "${P}" used in "having" needs to be provided in "by".`
                              : [
                                    Error,
                                    'Field ',
                                    P,
                                    ` in "having" needs to be provided in "by"`,
                                ];
                    }[HavingFields]
                  : 'take' extends Keys<T>
                    ? 'orderBy' extends Keys<T>
                        ? ByValid extends True
                            ? {}
                            : {
                                  [P in OrderFields]: P extends ByFields
                                      ? never
                                      : `Error: Field "${P}" in "orderBy" needs to be provided in "by"`;
                              }[OrderFields]
                        : 'Error: If you provide "take", you also need to provide "orderBy"'
                    : 'skip' extends Keys<T>
                      ? 'orderBy' extends Keys<T>
                          ? ByValid extends True
                              ? {}
                              : {
                                    [P in OrderFields]: P extends ByFields
                                        ? never
                                        : `Error: Field "${P}" in "orderBy" needs to be provided in "by"`;
                                }[OrderFields]
                          : 'Error: If you provide "skip", you also need to provide "orderBy"'
                      : ByValid extends True
                        ? {}
                        : {
                              [P in OrderFields]: P extends ByFields
                                  ? never
                                  : `Error: Field "${P}" in "orderBy" needs to be provided in "by"`;
                          }[OrderFields],
        >(
            args: SubsetIntersection<T, DonatedItemGroupByArgs, OrderByArg> &
                InputErrors,
        ): {} extends InputErrors
            ? GetDonatedItemGroupByPayload<T>
            : Prisma.PrismaPromise<InputErrors>;
        /**
         * Fields of the DonatedItem model
         */
        readonly fields: DonatedItemFieldRefs;
    }

    /**
     * The delegate class that acts as a "Promise-like" for DonatedItem.
     * Why is this prefixed with `Prisma__`?
     * Because we want to prevent naming conflicts as mentioned in
     * https://github.com/prisma/prisma-client-js/issues/707
     */
    export interface Prisma__DonatedItemClient<
        T,
        Null = never,
        ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs,
        GlobalOmitOptions = {},
    > extends Prisma.PrismaPromise<T> {
        readonly [Symbol.toStringTag]: 'PrismaPromise';
        donor<T extends DonorDefaultArgs<ExtArgs> = {}>(
            args?: Subset<T, DonorDefaultArgs<ExtArgs>>,
        ): Prisma__DonorClient<
            | $Result.GetResult<
                  Prisma.$DonorPayload<ExtArgs>,
                  T,
                  'findUniqueOrThrow',
                  GlobalOmitOptions
              >
            | Null,
            Null,
            ExtArgs,
            GlobalOmitOptions
        >;
        program<T extends DonatedItem$programArgs<ExtArgs> = {}>(
            args?: Subset<T, DonatedItem$programArgs<ExtArgs>>,
        ): Prisma__ProgramClient<
            $Result.GetResult<
                Prisma.$ProgramPayload<ExtArgs>,
                T,
                'findUniqueOrThrow',
                GlobalOmitOptions
            > | null,
            null,
            ExtArgs,
            GlobalOmitOptions
        >;
        statuses<T extends DonatedItem$statusesArgs<ExtArgs> = {}>(
            args?: Subset<T, DonatedItem$statusesArgs<ExtArgs>>,
        ): Prisma.PrismaPromise<
            | $Result.GetResult<
                  Prisma.$DonatedItemStatusPayload<ExtArgs>,
                  T,
                  'findMany',
                  GlobalOmitOptions
              >
            | Null
        >;
        /**
         * Attaches callbacks for the resolution and/or rejection of the Promise.
         * @param onfulfilled The callback to execute when the Promise is resolved.
         * @param onrejected The callback to execute when the Promise is rejected.
         * @returns A Promise for the completion of which ever callback is executed.
         */
        then<TResult1 = T, TResult2 = never>(
            onfulfilled?:
                | ((value: T) => TResult1 | PromiseLike<TResult1>)
                | undefined
                | null,
            onrejected?:
                | ((reason: any) => TResult2 | PromiseLike<TResult2>)
                | undefined
                | null,
        ): $Utils.JsPromise<TResult1 | TResult2>;
        /**
         * Attaches a callback for only the rejection of the Promise.
         * @param onrejected The callback to execute when the Promise is rejected.
         * @returns A Promise for the completion of the callback.
         */
        catch<TResult = never>(
            onrejected?:
                | ((reason: any) => TResult | PromiseLike<TResult>)
                | undefined
                | null,
        ): $Utils.JsPromise<T | TResult>;
        /**
         * Attaches a callback that is invoked when the Promise is settled (fulfilled or rejected). The
         * resolved value cannot be modified from the callback.
         * @param onfinally The callback to execute when the Promise is settled (fulfilled or rejected).
         * @returns A Promise for the completion of the callback.
         */
        finally(
            onfinally?: (() => void) | undefined | null,
        ): $Utils.JsPromise<T>;
    }

    /**
     * Fields of the DonatedItem model
     */
    interface DonatedItemFieldRefs {
        readonly id: FieldRef<'DonatedItem', 'Int'>;
        readonly itemType: FieldRef<'DonatedItem', 'String'>;
        readonly category: FieldRef<'DonatedItem', 'String'>;
        readonly quantity: FieldRef<'DonatedItem', 'Int'>;
        readonly currentStatus: FieldRef<'DonatedItem', 'String'>;
        readonly dateDonated: FieldRef<'DonatedItem', 'DateTime'>;
        readonly lastUpdated: FieldRef<'DonatedItem', 'DateTime'>;
        readonly imagePath: FieldRef<'DonatedItem', 'String'>;
        readonly analysisMetadata: FieldRef<'DonatedItem', 'Json'>;
        readonly donorId: FieldRef<'DonatedItem', 'Int'>;
        readonly programId: FieldRef<'DonatedItem', 'Int'>;
    }

    // Custom InputTypes
    /**
     * DonatedItem findUnique
     */
    export type DonatedItemFindUniqueArgs<
        ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs,
    > = {
        /**
         * Select specific fields to fetch from the DonatedItem
         */
        select?: DonatedItemSelect<ExtArgs> | null;
        /**
         * Omit specific fields from the DonatedItem
         */
        omit?: DonatedItemOmit<ExtArgs> | null;
        /**
         * Choose, which related nodes to fetch as well
         */
        include?: DonatedItemInclude<ExtArgs> | null;
        /**
         * Filter, which DonatedItem to fetch.
         */
        where: DonatedItemWhereUniqueInput;
    };

    /**
     * DonatedItem findUniqueOrThrow
     */
    export type DonatedItemFindUniqueOrThrowArgs<
        ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs,
    > = {
        /**
         * Select specific fields to fetch from the DonatedItem
         */
        select?: DonatedItemSelect<ExtArgs> | null;
        /**
         * Omit specific fields from the DonatedItem
         */
        omit?: DonatedItemOmit<ExtArgs> | null;
        /**
         * Choose, which related nodes to fetch as well
         */
        include?: DonatedItemInclude<ExtArgs> | null;
        /**
         * Filter, which DonatedItem to fetch.
         */
        where: DonatedItemWhereUniqueInput;
    };

    /**
     * DonatedItem findFirst
     */
    export type DonatedItemFindFirstArgs<
        ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs,
    > = {
        /**
         * Select specific fields to fetch from the DonatedItem
         */
        select?: DonatedItemSelect<ExtArgs> | null;
        /**
         * Omit specific fields from the DonatedItem
         */
        omit?: DonatedItemOmit<ExtArgs> | null;
        /**
         * Choose, which related nodes to fetch as well
         */
        include?: DonatedItemInclude<ExtArgs> | null;
        /**
         * Filter, which DonatedItem to fetch.
         */
        where?: DonatedItemWhereInput;
        /**
         * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
         *
         * Determine the order of DonatedItems to fetch.
         */
        orderBy?:
            | DonatedItemOrderByWithRelationInput
            | DonatedItemOrderByWithRelationInput[];
        /**
         * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
         *
         * Sets the position for searching for DonatedItems.
         */
        cursor?: DonatedItemWhereUniqueInput;
        /**
         * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
         *
         * Take `±n` DonatedItems from the position of the cursor.
         */
        take?: number;
        /**
         * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
         *
         * Skip the first `n` DonatedItems.
         */
        skip?: number;
        /**
         * {@link https://www.prisma.io/docs/concepts/components/prisma-client/distinct Distinct Docs}
         *
         * Filter by unique combinations of DonatedItems.
         */
        distinct?: DonatedItemScalarFieldEnum | DonatedItemScalarFieldEnum[];
    };

    /**
     * DonatedItem findFirstOrThrow
     */
    export type DonatedItemFindFirstOrThrowArgs<
        ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs,
    > = {
        /**
         * Select specific fields to fetch from the DonatedItem
         */
        select?: DonatedItemSelect<ExtArgs> | null;
        /**
         * Omit specific fields from the DonatedItem
         */
        omit?: DonatedItemOmit<ExtArgs> | null;
        /**
         * Choose, which related nodes to fetch as well
         */
        include?: DonatedItemInclude<ExtArgs> | null;
        /**
         * Filter, which DonatedItem to fetch.
         */
        where?: DonatedItemWhereInput;
        /**
         * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
         *
         * Determine the order of DonatedItems to fetch.
         */
        orderBy?:
            | DonatedItemOrderByWithRelationInput
            | DonatedItemOrderByWithRelationInput[];
        /**
         * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
         *
         * Sets the position for searching for DonatedItems.
         */
        cursor?: DonatedItemWhereUniqueInput;
        /**
         * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
         *
         * Take `±n` DonatedItems from the position of the cursor.
         */
        take?: number;
        /**
         * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
         *
         * Skip the first `n` DonatedItems.
         */
        skip?: number;
        /**
         * {@link https://www.prisma.io/docs/concepts/components/prisma-client/distinct Distinct Docs}
         *
         * Filter by unique combinations of DonatedItems.
         */
        distinct?: DonatedItemScalarFieldEnum | DonatedItemScalarFieldEnum[];
    };

    /**
     * DonatedItem findMany
     */
    export type DonatedItemFindManyArgs<
        ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs,
    > = {
        /**
         * Select specific fields to fetch from the DonatedItem
         */
        select?: DonatedItemSelect<ExtArgs> | null;
        /**
         * Omit specific fields from the DonatedItem
         */
        omit?: DonatedItemOmit<ExtArgs> | null;
        /**
         * Choose, which related nodes to fetch as well
         */
        include?: DonatedItemInclude<ExtArgs> | null;
        /**
         * Filter, which DonatedItems to fetch.
         */
        where?: DonatedItemWhereInput;
        /**
         * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
         *
         * Determine the order of DonatedItems to fetch.
         */
        orderBy?:
            | DonatedItemOrderByWithRelationInput
            | DonatedItemOrderByWithRelationInput[];
        /**
         * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
         *
         * Sets the position for listing DonatedItems.
         */
        cursor?: DonatedItemWhereUniqueInput;
        /**
         * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
         *
         * Take `±n` DonatedItems from the position of the cursor.
         */
        take?: number;
        /**
         * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
         *
         * Skip the first `n` DonatedItems.
         */
        skip?: number;
        /**
         * {@link https://www.prisma.io/docs/concepts/components/prisma-client/distinct Distinct Docs}
         *
         * Filter by unique combinations of DonatedItems.
         */
        distinct?: DonatedItemScalarFieldEnum | DonatedItemScalarFieldEnum[];
    };

    /**
     * DonatedItem create
     */
    export type DonatedItemCreateArgs<
        ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs,
    > = {
        /**
         * Select specific fields to fetch from the DonatedItem
         */
        select?: DonatedItemSelect<ExtArgs> | null;
        /**
         * Omit specific fields from the DonatedItem
         */
        omit?: DonatedItemOmit<ExtArgs> | null;
        /**
         * Choose, which related nodes to fetch as well
         */
        include?: DonatedItemInclude<ExtArgs> | null;
        /**
         * The data needed to create a DonatedItem.
         */
        data: XOR<DonatedItemCreateInput, DonatedItemUncheckedCreateInput>;
    };

    /**
     * DonatedItem createMany
     */
    export type DonatedItemCreateManyArgs<
        ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs,
    > = {
        /**
         * The data used to create many DonatedItems.
         */
        data: DonatedItemCreateManyInput | DonatedItemCreateManyInput[];
        skipDuplicates?: boolean;
    };

    /**
     * DonatedItem createManyAndReturn
     */
    export type DonatedItemCreateManyAndReturnArgs<
        ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs,
    > = {
        /**
         * Select specific fields to fetch from the DonatedItem
         */
        select?: DonatedItemSelectCreateManyAndReturn<ExtArgs> | null;
        /**
         * Omit specific fields from the DonatedItem
         */
        omit?: DonatedItemOmit<ExtArgs> | null;
        /**
         * The data used to create many DonatedItems.
         */
        data: DonatedItemCreateManyInput | DonatedItemCreateManyInput[];
        skipDuplicates?: boolean;
        /**
         * Choose, which related nodes to fetch as well
         */
        include?: DonatedItemIncludeCreateManyAndReturn<ExtArgs> | null;
    };

    /**
     * DonatedItem update
     */
    export type DonatedItemUpdateArgs<
        ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs,
    > = {
        /**
         * Select specific fields to fetch from the DonatedItem
         */
        select?: DonatedItemSelect<ExtArgs> | null;
        /**
         * Omit specific fields from the DonatedItem
         */
        omit?: DonatedItemOmit<ExtArgs> | null;
        /**
         * Choose, which related nodes to fetch as well
         */
        include?: DonatedItemInclude<ExtArgs> | null;
        /**
         * The data needed to update a DonatedItem.
         */
        data: XOR<DonatedItemUpdateInput, DonatedItemUncheckedUpdateInput>;
        /**
         * Choose, which DonatedItem to update.
         */
        where: DonatedItemWhereUniqueInput;
    };

    /**
     * DonatedItem updateMany
     */
    export type DonatedItemUpdateManyArgs<
        ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs,
    > = {
        /**
         * The data used to update DonatedItems.
         */
        data: XOR<
            DonatedItemUpdateManyMutationInput,
            DonatedItemUncheckedUpdateManyInput
        >;
        /**
         * Filter which DonatedItems to update
         */
        where?: DonatedItemWhereInput;
        /**
         * Limit how many DonatedItems to update.
         */
        limit?: number;
    };

    /**
     * DonatedItem updateManyAndReturn
     */
    export type DonatedItemUpdateManyAndReturnArgs<
        ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs,
    > = {
        /**
         * Select specific fields to fetch from the DonatedItem
         */
        select?: DonatedItemSelectUpdateManyAndReturn<ExtArgs> | null;
        /**
         * Omit specific fields from the DonatedItem
         */
        omit?: DonatedItemOmit<ExtArgs> | null;
        /**
         * The data used to update DonatedItems.
         */
        data: XOR<
            DonatedItemUpdateManyMutationInput,
            DonatedItemUncheckedUpdateManyInput
        >;
        /**
         * Filter which DonatedItems to update
         */
        where?: DonatedItemWhereInput;
        /**
         * Limit how many DonatedItems to update.
         */
        limit?: number;
        /**
         * Choose, which related nodes to fetch as well
         */
        include?: DonatedItemIncludeUpdateManyAndReturn<ExtArgs> | null;
    };

    /**
     * DonatedItem upsert
     */
    export type DonatedItemUpsertArgs<
        ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs,
    > = {
        /**
         * Select specific fields to fetch from the DonatedItem
         */
        select?: DonatedItemSelect<ExtArgs> | null;
        /**
         * Omit specific fields from the DonatedItem
         */
        omit?: DonatedItemOmit<ExtArgs> | null;
        /**
         * Choose, which related nodes to fetch as well
         */
        include?: DonatedItemInclude<ExtArgs> | null;
        /**
         * The filter to search for the DonatedItem to update in case it exists.
         */
        where: DonatedItemWhereUniqueInput;
        /**
         * In case the DonatedItem found by the `where` argument doesn't exist, create a new DonatedItem with this data.
         */
        create: XOR<DonatedItemCreateInput, DonatedItemUncheckedCreateInput>;
        /**
         * In case the DonatedItem was found with the provided `where` argument, update it with this data.
         */
        update: XOR<DonatedItemUpdateInput, DonatedItemUncheckedUpdateInput>;
    };

    /**
     * DonatedItem delete
     */
    export type DonatedItemDeleteArgs<
        ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs,
    > = {
        /**
         * Select specific fields to fetch from the DonatedItem
         */
        select?: DonatedItemSelect<ExtArgs> | null;
        /**
         * Omit specific fields from the DonatedItem
         */
        omit?: DonatedItemOmit<ExtArgs> | null;
        /**
         * Choose, which related nodes to fetch as well
         */
        include?: DonatedItemInclude<ExtArgs> | null;
        /**
         * Filter which DonatedItem to delete.
         */
        where: DonatedItemWhereUniqueInput;
    };

    /**
     * DonatedItem deleteMany
     */
    export type DonatedItemDeleteManyArgs<
        ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs,
    > = {
        /**
         * Filter which DonatedItems to delete
         */
        where?: DonatedItemWhereInput;
        /**
         * Limit how many DonatedItems to delete.
         */
        limit?: number;
    };

    /**
     * DonatedItem.program
     */
    export type DonatedItem$programArgs<
        ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs,
    > = {
        /**
         * Select specific fields to fetch from the Program
         */
        select?: ProgramSelect<ExtArgs> | null;
        /**
         * Omit specific fields from the Program
         */
        omit?: ProgramOmit<ExtArgs> | null;
        /**
         * Choose, which related nodes to fetch as well
         */
        include?: ProgramInclude<ExtArgs> | null;
        where?: ProgramWhereInput;
    };

    /**
     * DonatedItem.statuses
     */
    export type DonatedItem$statusesArgs<
        ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs,
    > = {
        /**
         * Select specific fields to fetch from the DonatedItemStatus
         */
        select?: DonatedItemStatusSelect<ExtArgs> | null;
        /**
         * Omit specific fields from the DonatedItemStatus
         */
        omit?: DonatedItemStatusOmit<ExtArgs> | null;
        /**
         * Choose, which related nodes to fetch as well
         */
        include?: DonatedItemStatusInclude<ExtArgs> | null;
        where?: DonatedItemStatusWhereInput;
        orderBy?:
            | DonatedItemStatusOrderByWithRelationInput
            | DonatedItemStatusOrderByWithRelationInput[];
        cursor?: DonatedItemStatusWhereUniqueInput;
        take?: number;
        skip?: number;
        distinct?:
            | DonatedItemStatusScalarFieldEnum
            | DonatedItemStatusScalarFieldEnum[];
    };

    /**
     * DonatedItem without action
     */
    export type DonatedItemDefaultArgs<
        ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs,
    > = {
        /**
         * Select specific fields to fetch from the DonatedItem
         */
        select?: DonatedItemSelect<ExtArgs> | null;
        /**
         * Omit specific fields from the DonatedItem
         */
        omit?: DonatedItemOmit<ExtArgs> | null;
        /**
         * Choose, which related nodes to fetch as well
         */
        include?: DonatedItemInclude<ExtArgs> | null;
    };

    /**
     * Model DonatedItemStatus
     */

    export type AggregateDonatedItemStatus = {
        _count: DonatedItemStatusCountAggregateOutputType | null;
        _avg: DonatedItemStatusAvgAggregateOutputType | null;
        _sum: DonatedItemStatusSumAggregateOutputType | null;
        _min: DonatedItemStatusMinAggregateOutputType | null;
        _max: DonatedItemStatusMaxAggregateOutputType | null;
    };

    export type DonatedItemStatusAvgAggregateOutputType = {
        id: number | null;
        donatedItemId: number | null;
    };

    export type DonatedItemStatusSumAggregateOutputType = {
        id: number | null;
        donatedItemId: number | null;
    };

    export type DonatedItemStatusMinAggregateOutputType = {
        id: number | null;
        dateModified: Date | null;
        statusType: string | null;
        donatedItemId: number | null;
        donorInformed: boolean | null;
        approval: boolean | null;
        submitter: string | null;
    };

    export type DonatedItemStatusMaxAggregateOutputType = {
        id: number | null;
        dateModified: Date | null;
        statusType: string | null;
        donatedItemId: number | null;
        donorInformed: boolean | null;
        approval: boolean | null;
        submitter: string | null;
    };

    export type DonatedItemStatusCountAggregateOutputType = {
        id: number;
        dateModified: number;
        statusType: number;
        donatedItemId: number;
        imageUrls: number;
        donorInformed: number;
        approval: number;
        submitter: number;
        _all: number;
    };

    export type DonatedItemStatusAvgAggregateInputType = {
        id?: true;
        donatedItemId?: true;
    };

    export type DonatedItemStatusSumAggregateInputType = {
        id?: true;
        donatedItemId?: true;
    };

    export type DonatedItemStatusMinAggregateInputType = {
        id?: true;
        dateModified?: true;
        statusType?: true;
        donatedItemId?: true;
        donorInformed?: true;
        approval?: true;
        submitter?: true;
    };

    export type DonatedItemStatusMaxAggregateInputType = {
        id?: true;
        dateModified?: true;
        statusType?: true;
        donatedItemId?: true;
        donorInformed?: true;
        approval?: true;
        submitter?: true;
    };

    export type DonatedItemStatusCountAggregateInputType = {
        id?: true;
        dateModified?: true;
        statusType?: true;
        donatedItemId?: true;
        imageUrls?: true;
        donorInformed?: true;
        approval?: true;
        submitter?: true;
        _all?: true;
    };

    export type DonatedItemStatusAggregateArgs<
        ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs,
    > = {
        /**
         * Filter which DonatedItemStatus to aggregate.
         */
        where?: DonatedItemStatusWhereInput;
        /**
         * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
         *
         * Determine the order of DonatedItemStatuses to fetch.
         */
        orderBy?:
            | DonatedItemStatusOrderByWithRelationInput
            | DonatedItemStatusOrderByWithRelationInput[];
        /**
         * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
         *
         * Sets the start position
         */
        cursor?: DonatedItemStatusWhereUniqueInput;
        /**
         * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
         *
         * Take `±n` DonatedItemStatuses from the position of the cursor.
         */
        take?: number;
        /**
         * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
         *
         * Skip the first `n` DonatedItemStatuses.
         */
        skip?: number;
        /**
         * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
         *
         * Count returned DonatedItemStatuses
         **/
        _count?: true | DonatedItemStatusCountAggregateInputType;
        /**
         * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
         *
         * Select which fields to average
         **/
        _avg?: DonatedItemStatusAvgAggregateInputType;
        /**
         * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
         *
         * Select which fields to sum
         **/
        _sum?: DonatedItemStatusSumAggregateInputType;
        /**
         * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
         *
         * Select which fields to find the minimum value
         **/
        _min?: DonatedItemStatusMinAggregateInputType;
        /**
         * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
         *
         * Select which fields to find the maximum value
         **/
        _max?: DonatedItemStatusMaxAggregateInputType;
    };

    export type GetDonatedItemStatusAggregateType<
        T extends DonatedItemStatusAggregateArgs,
    > = {
        [P in keyof T & keyof AggregateDonatedItemStatus]: P extends
            | '_count'
            | 'count'
            ? T[P] extends true
                ? number
                : GetScalarType<T[P], AggregateDonatedItemStatus[P]>
            : GetScalarType<T[P], AggregateDonatedItemStatus[P]>;
    };

    export type DonatedItemStatusGroupByArgs<
        ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs,
    > = {
        where?: DonatedItemStatusWhereInput;
        orderBy?:
            | DonatedItemStatusOrderByWithAggregationInput
            | DonatedItemStatusOrderByWithAggregationInput[];
        by:
            | DonatedItemStatusScalarFieldEnum[]
            | DonatedItemStatusScalarFieldEnum;
        having?: DonatedItemStatusScalarWhereWithAggregatesInput;
        take?: number;
        skip?: number;
        _count?: DonatedItemStatusCountAggregateInputType | true;
        _avg?: DonatedItemStatusAvgAggregateInputType;
        _sum?: DonatedItemStatusSumAggregateInputType;
        _min?: DonatedItemStatusMinAggregateInputType;
        _max?: DonatedItemStatusMaxAggregateInputType;
    };

    export type DonatedItemStatusGroupByOutputType = {
        id: number;
        dateModified: Date;
        statusType: string;
        donatedItemId: number;
        imageUrls: string[];
        donorInformed: boolean;
        approval: boolean;
        submitter: string;
        _count: DonatedItemStatusCountAggregateOutputType | null;
        _avg: DonatedItemStatusAvgAggregateOutputType | null;
        _sum: DonatedItemStatusSumAggregateOutputType | null;
        _min: DonatedItemStatusMinAggregateOutputType | null;
        _max: DonatedItemStatusMaxAggregateOutputType | null;
    };

    type GetDonatedItemStatusGroupByPayload<
        T extends DonatedItemStatusGroupByArgs,
    > = Prisma.PrismaPromise<
        Array<
            PickEnumerable<DonatedItemStatusGroupByOutputType, T['by']> & {
                [P in keyof T &
                    keyof DonatedItemStatusGroupByOutputType]: P extends '_count'
                    ? T[P] extends boolean
                        ? number
                        : GetScalarType<
                              T[P],
                              DonatedItemStatusGroupByOutputType[P]
                          >
                    : GetScalarType<
                          T[P],
                          DonatedItemStatusGroupByOutputType[P]
                      >;
            }
        >
    >;

    export type DonatedItemStatusSelect<
        ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs,
    > = $Extensions.GetSelect<
        {
            id?: boolean;
            dateModified?: boolean;
            statusType?: boolean;
            donatedItemId?: boolean;
            imageUrls?: boolean;
            donorInformed?: boolean;
            approval?: boolean;
            submitter?: boolean;
            donatedItem?: boolean | DonatedItemDefaultArgs<ExtArgs>;
        },
        ExtArgs['result']['donatedItemStatus']
    >;

    export type DonatedItemStatusSelectCreateManyAndReturn<
        ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs,
    > = $Extensions.GetSelect<
        {
            id?: boolean;
            dateModified?: boolean;
            statusType?: boolean;
            donatedItemId?: boolean;
            imageUrls?: boolean;
            donorInformed?: boolean;
            approval?: boolean;
            submitter?: boolean;
            donatedItem?: boolean | DonatedItemDefaultArgs<ExtArgs>;
        },
        ExtArgs['result']['donatedItemStatus']
    >;

    export type DonatedItemStatusSelectUpdateManyAndReturn<
        ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs,
    > = $Extensions.GetSelect<
        {
            id?: boolean;
            dateModified?: boolean;
            statusType?: boolean;
            donatedItemId?: boolean;
            imageUrls?: boolean;
            donorInformed?: boolean;
            approval?: boolean;
            submitter?: boolean;
            donatedItem?: boolean | DonatedItemDefaultArgs<ExtArgs>;
        },
        ExtArgs['result']['donatedItemStatus']
    >;

    export type DonatedItemStatusSelectScalar = {
        id?: boolean;
        dateModified?: boolean;
        statusType?: boolean;
        donatedItemId?: boolean;
        imageUrls?: boolean;
        donorInformed?: boolean;
        approval?: boolean;
        submitter?: boolean;
    };

    export type DonatedItemStatusOmit<
        ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs,
    > = $Extensions.GetOmit<
        | 'id'
        | 'dateModified'
        | 'statusType'
        | 'donatedItemId'
        | 'imageUrls'
        | 'donorInformed'
        | 'approval'
        | 'submitter',
        ExtArgs['result']['donatedItemStatus']
    >;
    export type DonatedItemStatusInclude<
        ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs,
    > = {
        donatedItem?: boolean | DonatedItemDefaultArgs<ExtArgs>;
    };
    export type DonatedItemStatusIncludeCreateManyAndReturn<
        ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs,
    > = {
        donatedItem?: boolean | DonatedItemDefaultArgs<ExtArgs>;
    };
    export type DonatedItemStatusIncludeUpdateManyAndReturn<
        ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs,
    > = {
        donatedItem?: boolean | DonatedItemDefaultArgs<ExtArgs>;
    };

    export type $DonatedItemStatusPayload<
        ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs,
    > = {
        name: 'DonatedItemStatus';
        objects: {
            donatedItem: Prisma.$DonatedItemPayload<ExtArgs>;
        };
        scalars: $Extensions.GetPayloadResult<
            {
                id: number;
                dateModified: Date;
                statusType: string;
                donatedItemId: number;
                imageUrls: string[];
                donorInformed: boolean;
                approval: boolean;
                submitter: string;
            },
            ExtArgs['result']['donatedItemStatus']
        >;
        composites: {};
    };

    type DonatedItemStatusGetPayload<
        S extends boolean | null | undefined | DonatedItemStatusDefaultArgs,
    > = $Result.GetResult<Prisma.$DonatedItemStatusPayload, S>;

    type DonatedItemStatusCountArgs<
        ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs,
    > = Omit<
        DonatedItemStatusFindManyArgs,
        'select' | 'include' | 'distinct' | 'omit'
    > & {
        select?: DonatedItemStatusCountAggregateInputType | true;
    };

    export interface DonatedItemStatusDelegate<
        ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs,
        GlobalOmitOptions = {},
    > {
        [K: symbol]: {
            types: Prisma.TypeMap<ExtArgs>['model']['DonatedItemStatus'];
            meta: { name: 'DonatedItemStatus' };
        };
        /**
         * Find zero or one DonatedItemStatus that matches the filter.
         * @param {DonatedItemStatusFindUniqueArgs} args - Arguments to find a DonatedItemStatus
         * @example
         * // Get one DonatedItemStatus
         * const donatedItemStatus = await prisma.donatedItemStatus.findUnique({
         *   where: {
         *     // ... provide filter here
         *   }
         * })
         */
        findUnique<T extends DonatedItemStatusFindUniqueArgs>(
            args: SelectSubset<T, DonatedItemStatusFindUniqueArgs<ExtArgs>>,
        ): Prisma__DonatedItemStatusClient<
            $Result.GetResult<
                Prisma.$DonatedItemStatusPayload<ExtArgs>,
                T,
                'findUnique',
                GlobalOmitOptions
            > | null,
            null,
            ExtArgs,
            GlobalOmitOptions
        >;

        /**
         * Find one DonatedItemStatus that matches the filter or throw an error with `error.code='P2025'`
         * if no matches were found.
         * @param {DonatedItemStatusFindUniqueOrThrowArgs} args - Arguments to find a DonatedItemStatus
         * @example
         * // Get one DonatedItemStatus
         * const donatedItemStatus = await prisma.donatedItemStatus.findUniqueOrThrow({
         *   where: {
         *     // ... provide filter here
         *   }
         * })
         */
        findUniqueOrThrow<T extends DonatedItemStatusFindUniqueOrThrowArgs>(
            args: SelectSubset<
                T,
                DonatedItemStatusFindUniqueOrThrowArgs<ExtArgs>
            >,
        ): Prisma__DonatedItemStatusClient<
            $Result.GetResult<
                Prisma.$DonatedItemStatusPayload<ExtArgs>,
                T,
                'findUniqueOrThrow',
                GlobalOmitOptions
            >,
            never,
            ExtArgs,
            GlobalOmitOptions
        >;

        /**
         * Find the first DonatedItemStatus that matches the filter.
         * Note, that providing `undefined` is treated as the value not being there.
         * Read more here: https://pris.ly/d/null-undefined
         * @param {DonatedItemStatusFindFirstArgs} args - Arguments to find a DonatedItemStatus
         * @example
         * // Get one DonatedItemStatus
         * const donatedItemStatus = await prisma.donatedItemStatus.findFirst({
         *   where: {
         *     // ... provide filter here
         *   }
         * })
         */
        findFirst<T extends DonatedItemStatusFindFirstArgs>(
            args?: SelectSubset<T, DonatedItemStatusFindFirstArgs<ExtArgs>>,
        ): Prisma__DonatedItemStatusClient<
            $Result.GetResult<
                Prisma.$DonatedItemStatusPayload<ExtArgs>,
                T,
                'findFirst',
                GlobalOmitOptions
            > | null,
            null,
            ExtArgs,
            GlobalOmitOptions
        >;

        /**
         * Find the first DonatedItemStatus that matches the filter or
         * throw `PrismaKnownClientError` with `P2025` code if no matches were found.
         * Note, that providing `undefined` is treated as the value not being there.
         * Read more here: https://pris.ly/d/null-undefined
         * @param {DonatedItemStatusFindFirstOrThrowArgs} args - Arguments to find a DonatedItemStatus
         * @example
         * // Get one DonatedItemStatus
         * const donatedItemStatus = await prisma.donatedItemStatus.findFirstOrThrow({
         *   where: {
         *     // ... provide filter here
         *   }
         * })
         */
        findFirstOrThrow<T extends DonatedItemStatusFindFirstOrThrowArgs>(
            args?: SelectSubset<
                T,
                DonatedItemStatusFindFirstOrThrowArgs<ExtArgs>
            >,
        ): Prisma__DonatedItemStatusClient<
            $Result.GetResult<
                Prisma.$DonatedItemStatusPayload<ExtArgs>,
                T,
                'findFirstOrThrow',
                GlobalOmitOptions
            >,
            never,
            ExtArgs,
            GlobalOmitOptions
        >;

        /**
         * Find zero or more DonatedItemStatuses that matches the filter.
         * Note, that providing `undefined` is treated as the value not being there.
         * Read more here: https://pris.ly/d/null-undefined
         * @param {DonatedItemStatusFindManyArgs} args - Arguments to filter and select certain fields only.
         * @example
         * // Get all DonatedItemStatuses
         * const donatedItemStatuses = await prisma.donatedItemStatus.findMany()
         *
         * // Get first 10 DonatedItemStatuses
         * const donatedItemStatuses = await prisma.donatedItemStatus.findMany({ take: 10 })
         *
         * // Only select the `id`
         * const donatedItemStatusWithIdOnly = await prisma.donatedItemStatus.findMany({ select: { id: true } })
         *
         */
        findMany<T extends DonatedItemStatusFindManyArgs>(
            args?: SelectSubset<T, DonatedItemStatusFindManyArgs<ExtArgs>>,
        ): Prisma.PrismaPromise<
            $Result.GetResult<
                Prisma.$DonatedItemStatusPayload<ExtArgs>,
                T,
                'findMany',
                GlobalOmitOptions
            >
        >;

        /**
         * Create a DonatedItemStatus.
         * @param {DonatedItemStatusCreateArgs} args - Arguments to create a DonatedItemStatus.
         * @example
         * // Create one DonatedItemStatus
         * const DonatedItemStatus = await prisma.donatedItemStatus.create({
         *   data: {
         *     // ... data to create a DonatedItemStatus
         *   }
         * })
         *
         */
        create<T extends DonatedItemStatusCreateArgs>(
            args: SelectSubset<T, DonatedItemStatusCreateArgs<ExtArgs>>,
        ): Prisma__DonatedItemStatusClient<
            $Result.GetResult<
                Prisma.$DonatedItemStatusPayload<ExtArgs>,
                T,
                'create',
                GlobalOmitOptions
            >,
            never,
            ExtArgs,
            GlobalOmitOptions
        >;

        /**
         * Create many DonatedItemStatuses.
         * @param {DonatedItemStatusCreateManyArgs} args - Arguments to create many DonatedItemStatuses.
         * @example
         * // Create many DonatedItemStatuses
         * const donatedItemStatus = await prisma.donatedItemStatus.createMany({
         *   data: [
         *     // ... provide data here
         *   ]
         * })
         *
         */
        createMany<T extends DonatedItemStatusCreateManyArgs>(
            args?: SelectSubset<T, DonatedItemStatusCreateManyArgs<ExtArgs>>,
        ): Prisma.PrismaPromise<BatchPayload>;

        /**
         * Create many DonatedItemStatuses and returns the data saved in the database.
         * @param {DonatedItemStatusCreateManyAndReturnArgs} args - Arguments to create many DonatedItemStatuses.
         * @example
         * // Create many DonatedItemStatuses
         * const donatedItemStatus = await prisma.donatedItemStatus.createManyAndReturn({
         *   data: [
         *     // ... provide data here
         *   ]
         * })
         *
         * // Create many DonatedItemStatuses and only return the `id`
         * const donatedItemStatusWithIdOnly = await prisma.donatedItemStatus.createManyAndReturn({
         *   select: { id: true },
         *   data: [
         *     // ... provide data here
         *   ]
         * })
         * Note, that providing `undefined` is treated as the value not being there.
         * Read more here: https://pris.ly/d/null-undefined
         *
         */
        createManyAndReturn<T extends DonatedItemStatusCreateManyAndReturnArgs>(
            args?: SelectSubset<
                T,
                DonatedItemStatusCreateManyAndReturnArgs<ExtArgs>
            >,
        ): Prisma.PrismaPromise<
            $Result.GetResult<
                Prisma.$DonatedItemStatusPayload<ExtArgs>,
                T,
                'createManyAndReturn',
                GlobalOmitOptions
            >
        >;

        /**
         * Delete a DonatedItemStatus.
         * @param {DonatedItemStatusDeleteArgs} args - Arguments to delete one DonatedItemStatus.
         * @example
         * // Delete one DonatedItemStatus
         * const DonatedItemStatus = await prisma.donatedItemStatus.delete({
         *   where: {
         *     // ... filter to delete one DonatedItemStatus
         *   }
         * })
         *
         */
        delete<T extends DonatedItemStatusDeleteArgs>(
            args: SelectSubset<T, DonatedItemStatusDeleteArgs<ExtArgs>>,
        ): Prisma__DonatedItemStatusClient<
            $Result.GetResult<
                Prisma.$DonatedItemStatusPayload<ExtArgs>,
                T,
                'delete',
                GlobalOmitOptions
            >,
            never,
            ExtArgs,
            GlobalOmitOptions
        >;

        /**
         * Update one DonatedItemStatus.
         * @param {DonatedItemStatusUpdateArgs} args - Arguments to update one DonatedItemStatus.
         * @example
         * // Update one DonatedItemStatus
         * const donatedItemStatus = await prisma.donatedItemStatus.update({
         *   where: {
         *     // ... provide filter here
         *   },
         *   data: {
         *     // ... provide data here
         *   }
         * })
         *
         */
        update<T extends DonatedItemStatusUpdateArgs>(
            args: SelectSubset<T, DonatedItemStatusUpdateArgs<ExtArgs>>,
        ): Prisma__DonatedItemStatusClient<
            $Result.GetResult<
                Prisma.$DonatedItemStatusPayload<ExtArgs>,
                T,
                'update',
                GlobalOmitOptions
            >,
            never,
            ExtArgs,
            GlobalOmitOptions
        >;

        /**
         * Delete zero or more DonatedItemStatuses.
         * @param {DonatedItemStatusDeleteManyArgs} args - Arguments to filter DonatedItemStatuses to delete.
         * @example
         * // Delete a few DonatedItemStatuses
         * const { count } = await prisma.donatedItemStatus.deleteMany({
         *   where: {
         *     // ... provide filter here
         *   }
         * })
         *
         */
        deleteMany<T extends DonatedItemStatusDeleteManyArgs>(
            args?: SelectSubset<T, DonatedItemStatusDeleteManyArgs<ExtArgs>>,
        ): Prisma.PrismaPromise<BatchPayload>;

        /**
         * Update zero or more DonatedItemStatuses.
         * Note, that providing `undefined` is treated as the value not being there.
         * Read more here: https://pris.ly/d/null-undefined
         * @param {DonatedItemStatusUpdateManyArgs} args - Arguments to update one or more rows.
         * @example
         * // Update many DonatedItemStatuses
         * const donatedItemStatus = await prisma.donatedItemStatus.updateMany({
         *   where: {
         *     // ... provide filter here
         *   },
         *   data: {
         *     // ... provide data here
         *   }
         * })
         *
         */
        updateMany<T extends DonatedItemStatusUpdateManyArgs>(
            args: SelectSubset<T, DonatedItemStatusUpdateManyArgs<ExtArgs>>,
        ): Prisma.PrismaPromise<BatchPayload>;

        /**
         * Update zero or more DonatedItemStatuses and returns the data updated in the database.
         * @param {DonatedItemStatusUpdateManyAndReturnArgs} args - Arguments to update many DonatedItemStatuses.
         * @example
         * // Update many DonatedItemStatuses
         * const donatedItemStatus = await prisma.donatedItemStatus.updateManyAndReturn({
         *   where: {
         *     // ... provide filter here
         *   },
         *   data: [
         *     // ... provide data here
         *   ]
         * })
         *
         * // Update zero or more DonatedItemStatuses and only return the `id`
         * const donatedItemStatusWithIdOnly = await prisma.donatedItemStatus.updateManyAndReturn({
         *   select: { id: true },
         *   where: {
         *     // ... provide filter here
         *   },
         *   data: [
         *     // ... provide data here
         *   ]
         * })
         * Note, that providing `undefined` is treated as the value not being there.
         * Read more here: https://pris.ly/d/null-undefined
         *
         */
        updateManyAndReturn<T extends DonatedItemStatusUpdateManyAndReturnArgs>(
            args: SelectSubset<
                T,
                DonatedItemStatusUpdateManyAndReturnArgs<ExtArgs>
            >,
        ): Prisma.PrismaPromise<
            $Result.GetResult<
                Prisma.$DonatedItemStatusPayload<ExtArgs>,
                T,
                'updateManyAndReturn',
                GlobalOmitOptions
            >
        >;

        /**
         * Create or update one DonatedItemStatus.
         * @param {DonatedItemStatusUpsertArgs} args - Arguments to update or create a DonatedItemStatus.
         * @example
         * // Update or create a DonatedItemStatus
         * const donatedItemStatus = await prisma.donatedItemStatus.upsert({
         *   create: {
         *     // ... data to create a DonatedItemStatus
         *   },
         *   update: {
         *     // ... in case it already exists, update
         *   },
         *   where: {
         *     // ... the filter for the DonatedItemStatus we want to update
         *   }
         * })
         */
        upsert<T extends DonatedItemStatusUpsertArgs>(
            args: SelectSubset<T, DonatedItemStatusUpsertArgs<ExtArgs>>,
        ): Prisma__DonatedItemStatusClient<
            $Result.GetResult<
                Prisma.$DonatedItemStatusPayload<ExtArgs>,
                T,
                'upsert',
                GlobalOmitOptions
            >,
            never,
            ExtArgs,
            GlobalOmitOptions
        >;

        /**
         * Count the number of DonatedItemStatuses.
         * Note, that providing `undefined` is treated as the value not being there.
         * Read more here: https://pris.ly/d/null-undefined
         * @param {DonatedItemStatusCountArgs} args - Arguments to filter DonatedItemStatuses to count.
         * @example
         * // Count the number of DonatedItemStatuses
         * const count = await prisma.donatedItemStatus.count({
         *   where: {
         *     // ... the filter for the DonatedItemStatuses we want to count
         *   }
         * })
         **/
        count<T extends DonatedItemStatusCountArgs>(
            args?: Subset<T, DonatedItemStatusCountArgs>,
        ): Prisma.PrismaPromise<
            T extends $Utils.Record<'select', any>
                ? T['select'] extends true
                    ? number
                    : GetScalarType<
                          T['select'],
                          DonatedItemStatusCountAggregateOutputType
                      >
                : number
        >;

        /**
         * Allows you to perform aggregations operations on a DonatedItemStatus.
         * Note, that providing `undefined` is treated as the value not being there.
         * Read more here: https://pris.ly/d/null-undefined
         * @param {DonatedItemStatusAggregateArgs} args - Select which aggregations you would like to apply and on what fields.
         * @example
         * // Ordered by age ascending
         * // Where email contains prisma.io
         * // Limited to the 10 users
         * const aggregations = await prisma.user.aggregate({
         *   _avg: {
         *     age: true,
         *   },
         *   where: {
         *     email: {
         *       contains: "prisma.io",
         *     },
         *   },
         *   orderBy: {
         *     age: "asc",
         *   },
         *   take: 10,
         * })
         **/
        aggregate<T extends DonatedItemStatusAggregateArgs>(
            args: Subset<T, DonatedItemStatusAggregateArgs>,
        ): Prisma.PrismaPromise<GetDonatedItemStatusAggregateType<T>>;

        /**
         * Group by DonatedItemStatus.
         * Note, that providing `undefined` is treated as the value not being there.
         * Read more here: https://pris.ly/d/null-undefined
         * @param {DonatedItemStatusGroupByArgs} args - Group by arguments.
         * @example
         * // Group by city, order by createdAt, get count
         * const result = await prisma.user.groupBy({
         *   by: ['city', 'createdAt'],
         *   orderBy: {
         *     createdAt: true
         *   },
         *   _count: {
         *     _all: true
         *   },
         * })
         *
         **/
        groupBy<
            T extends DonatedItemStatusGroupByArgs,
            HasSelectOrTake extends Or<
                Extends<'skip', Keys<T>>,
                Extends<'take', Keys<T>>
            >,
            OrderByArg extends True extends HasSelectOrTake
                ? { orderBy: DonatedItemStatusGroupByArgs['orderBy'] }
                : { orderBy?: DonatedItemStatusGroupByArgs['orderBy'] },
            OrderFields extends ExcludeUnderscoreKeys<
                Keys<MaybeTupleToUnion<T['orderBy']>>
            >,
            ByFields extends MaybeTupleToUnion<T['by']>,
            ByValid extends Has<ByFields, OrderFields>,
            HavingFields extends GetHavingFields<T['having']>,
            HavingValid extends Has<ByFields, HavingFields>,
            ByEmpty extends T['by'] extends never[] ? True : False,
            InputErrors extends ByEmpty extends True
                ? `Error: "by" must not be empty.`
                : HavingValid extends False
                  ? {
                        [P in HavingFields]: P extends ByFields
                            ? never
                            : P extends string
                              ? `Error: Field "${P}" used in "having" needs to be provided in "by".`
                              : [
                                    Error,
                                    'Field ',
                                    P,
                                    ` in "having" needs to be provided in "by"`,
                                ];
                    }[HavingFields]
                  : 'take' extends Keys<T>
                    ? 'orderBy' extends Keys<T>
                        ? ByValid extends True
                            ? {}
                            : {
                                  [P in OrderFields]: P extends ByFields
                                      ? never
                                      : `Error: Field "${P}" in "orderBy" needs to be provided in "by"`;
                              }[OrderFields]
                        : 'Error: If you provide "take", you also need to provide "orderBy"'
                    : 'skip' extends Keys<T>
                      ? 'orderBy' extends Keys<T>
                          ? ByValid extends True
                              ? {}
                              : {
                                    [P in OrderFields]: P extends ByFields
                                        ? never
                                        : `Error: Field "${P}" in "orderBy" needs to be provided in "by"`;
                                }[OrderFields]
                          : 'Error: If you provide "skip", you also need to provide "orderBy"'
                      : ByValid extends True
                        ? {}
                        : {
                              [P in OrderFields]: P extends ByFields
                                  ? never
                                  : `Error: Field "${P}" in "orderBy" needs to be provided in "by"`;
                          }[OrderFields],
        >(
            args: SubsetIntersection<
                T,
                DonatedItemStatusGroupByArgs,
                OrderByArg
            > &
                InputErrors,
        ): {} extends InputErrors
            ? GetDonatedItemStatusGroupByPayload<T>
            : Prisma.PrismaPromise<InputErrors>;
        /**
         * Fields of the DonatedItemStatus model
         */
        readonly fields: DonatedItemStatusFieldRefs;
    }

    /**
     * The delegate class that acts as a "Promise-like" for DonatedItemStatus.
     * Why is this prefixed with `Prisma__`?
     * Because we want to prevent naming conflicts as mentioned in
     * https://github.com/prisma/prisma-client-js/issues/707
     */
    export interface Prisma__DonatedItemStatusClient<
        T,
        Null = never,
        ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs,
        GlobalOmitOptions = {},
    > extends Prisma.PrismaPromise<T> {
        readonly [Symbol.toStringTag]: 'PrismaPromise';
        donatedItem<T extends DonatedItemDefaultArgs<ExtArgs> = {}>(
            args?: Subset<T, DonatedItemDefaultArgs<ExtArgs>>,
        ): Prisma__DonatedItemClient<
            | $Result.GetResult<
                  Prisma.$DonatedItemPayload<ExtArgs>,
                  T,
                  'findUniqueOrThrow',
                  GlobalOmitOptions
              >
            | Null,
            Null,
            ExtArgs,
            GlobalOmitOptions
        >;
        /**
         * Attaches callbacks for the resolution and/or rejection of the Promise.
         * @param onfulfilled The callback to execute when the Promise is resolved.
         * @param onrejected The callback to execute when the Promise is rejected.
         * @returns A Promise for the completion of which ever callback is executed.
         */
        then<TResult1 = T, TResult2 = never>(
            onfulfilled?:
                | ((value: T) => TResult1 | PromiseLike<TResult1>)
                | undefined
                | null,
            onrejected?:
                | ((reason: any) => TResult2 | PromiseLike<TResult2>)
                | undefined
                | null,
        ): $Utils.JsPromise<TResult1 | TResult2>;
        /**
         * Attaches a callback for only the rejection of the Promise.
         * @param onrejected The callback to execute when the Promise is rejected.
         * @returns A Promise for the completion of the callback.
         */
        catch<TResult = never>(
            onrejected?:
                | ((reason: any) => TResult | PromiseLike<TResult>)
                | undefined
                | null,
        ): $Utils.JsPromise<T | TResult>;
        /**
         * Attaches a callback that is invoked when the Promise is settled (fulfilled or rejected). The
         * resolved value cannot be modified from the callback.
         * @param onfinally The callback to execute when the Promise is settled (fulfilled or rejected).
         * @returns A Promise for the completion of the callback.
         */
        finally(
            onfinally?: (() => void) | undefined | null,
        ): $Utils.JsPromise<T>;
    }

    /**
     * Fields of the DonatedItemStatus model
     */
    interface DonatedItemStatusFieldRefs {
        readonly id: FieldRef<'DonatedItemStatus', 'Int'>;
        readonly dateModified: FieldRef<'DonatedItemStatus', 'DateTime'>;
        readonly statusType: FieldRef<'DonatedItemStatus', 'String'>;
        readonly donatedItemId: FieldRef<'DonatedItemStatus', 'Int'>;
        readonly imageUrls: FieldRef<'DonatedItemStatus', 'String[]'>;
        readonly donorInformed: FieldRef<'DonatedItemStatus', 'Boolean'>;
        readonly approval: FieldRef<'DonatedItemStatus', 'Boolean'>;
        readonly submitter: FieldRef<'DonatedItemStatus', 'String'>;
    }

    // Custom InputTypes
    /**
     * DonatedItemStatus findUnique
     */
    export type DonatedItemStatusFindUniqueArgs<
        ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs,
    > = {
        /**
         * Select specific fields to fetch from the DonatedItemStatus
         */
        select?: DonatedItemStatusSelect<ExtArgs> | null;
        /**
         * Omit specific fields from the DonatedItemStatus
         */
        omit?: DonatedItemStatusOmit<ExtArgs> | null;
        /**
         * Choose, which related nodes to fetch as well
         */
        include?: DonatedItemStatusInclude<ExtArgs> | null;
        /**
         * Filter, which DonatedItemStatus to fetch.
         */
        where: DonatedItemStatusWhereUniqueInput;
    };

    /**
     * DonatedItemStatus findUniqueOrThrow
     */
    export type DonatedItemStatusFindUniqueOrThrowArgs<
        ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs,
    > = {
        /**
         * Select specific fields to fetch from the DonatedItemStatus
         */
        select?: DonatedItemStatusSelect<ExtArgs> | null;
        /**
         * Omit specific fields from the DonatedItemStatus
         */
        omit?: DonatedItemStatusOmit<ExtArgs> | null;
        /**
         * Choose, which related nodes to fetch as well
         */
        include?: DonatedItemStatusInclude<ExtArgs> | null;
        /**
         * Filter, which DonatedItemStatus to fetch.
         */
        where: DonatedItemStatusWhereUniqueInput;
    };

    /**
     * DonatedItemStatus findFirst
     */
    export type DonatedItemStatusFindFirstArgs<
        ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs,
    > = {
        /**
         * Select specific fields to fetch from the DonatedItemStatus
         */
        select?: DonatedItemStatusSelect<ExtArgs> | null;
        /**
         * Omit specific fields from the DonatedItemStatus
         */
        omit?: DonatedItemStatusOmit<ExtArgs> | null;
        /**
         * Choose, which related nodes to fetch as well
         */
        include?: DonatedItemStatusInclude<ExtArgs> | null;
        /**
         * Filter, which DonatedItemStatus to fetch.
         */
        where?: DonatedItemStatusWhereInput;
        /**
         * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
         *
         * Determine the order of DonatedItemStatuses to fetch.
         */
        orderBy?:
            | DonatedItemStatusOrderByWithRelationInput
            | DonatedItemStatusOrderByWithRelationInput[];
        /**
         * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
         *
         * Sets the position for searching for DonatedItemStatuses.
         */
        cursor?: DonatedItemStatusWhereUniqueInput;
        /**
         * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
         *
         * Take `±n` DonatedItemStatuses from the position of the cursor.
         */
        take?: number;
        /**
         * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
         *
         * Skip the first `n` DonatedItemStatuses.
         */
        skip?: number;
        /**
         * {@link https://www.prisma.io/docs/concepts/components/prisma-client/distinct Distinct Docs}
         *
         * Filter by unique combinations of DonatedItemStatuses.
         */
        distinct?:
            | DonatedItemStatusScalarFieldEnum
            | DonatedItemStatusScalarFieldEnum[];
    };

    /**
     * DonatedItemStatus findFirstOrThrow
     */
    export type DonatedItemStatusFindFirstOrThrowArgs<
        ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs,
    > = {
        /**
         * Select specific fields to fetch from the DonatedItemStatus
         */
        select?: DonatedItemStatusSelect<ExtArgs> | null;
        /**
         * Omit specific fields from the DonatedItemStatus
         */
        omit?: DonatedItemStatusOmit<ExtArgs> | null;
        /**
         * Choose, which related nodes to fetch as well
         */
        include?: DonatedItemStatusInclude<ExtArgs> | null;
        /**
         * Filter, which DonatedItemStatus to fetch.
         */
        where?: DonatedItemStatusWhereInput;
        /**
         * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
         *
         * Determine the order of DonatedItemStatuses to fetch.
         */
        orderBy?:
            | DonatedItemStatusOrderByWithRelationInput
            | DonatedItemStatusOrderByWithRelationInput[];
        /**
         * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
         *
         * Sets the position for searching for DonatedItemStatuses.
         */
        cursor?: DonatedItemStatusWhereUniqueInput;
        /**
         * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
         *
         * Take `±n` DonatedItemStatuses from the position of the cursor.
         */
        take?: number;
        /**
         * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
         *
         * Skip the first `n` DonatedItemStatuses.
         */
        skip?: number;
        /**
         * {@link https://www.prisma.io/docs/concepts/components/prisma-client/distinct Distinct Docs}
         *
         * Filter by unique combinations of DonatedItemStatuses.
         */
        distinct?:
            | DonatedItemStatusScalarFieldEnum
            | DonatedItemStatusScalarFieldEnum[];
    };

    /**
     * DonatedItemStatus findMany
     */
    export type DonatedItemStatusFindManyArgs<
        ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs,
    > = {
        /**
         * Select specific fields to fetch from the DonatedItemStatus
         */
        select?: DonatedItemStatusSelect<ExtArgs> | null;
        /**
         * Omit specific fields from the DonatedItemStatus
         */
        omit?: DonatedItemStatusOmit<ExtArgs> | null;
        /**
         * Choose, which related nodes to fetch as well
         */
        include?: DonatedItemStatusInclude<ExtArgs> | null;
        /**
         * Filter, which DonatedItemStatuses to fetch.
         */
        where?: DonatedItemStatusWhereInput;
        /**
         * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
         *
         * Determine the order of DonatedItemStatuses to fetch.
         */
        orderBy?:
            | DonatedItemStatusOrderByWithRelationInput
            | DonatedItemStatusOrderByWithRelationInput[];
        /**
         * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
         *
         * Sets the position for listing DonatedItemStatuses.
         */
        cursor?: DonatedItemStatusWhereUniqueInput;
        /**
         * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
         *
         * Take `±n` DonatedItemStatuses from the position of the cursor.
         */
        take?: number;
        /**
         * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
         *
         * Skip the first `n` DonatedItemStatuses.
         */
        skip?: number;
        /**
         * {@link https://www.prisma.io/docs/concepts/components/prisma-client/distinct Distinct Docs}
         *
         * Filter by unique combinations of DonatedItemStatuses.
         */
        distinct?:
            | DonatedItemStatusScalarFieldEnum
            | DonatedItemStatusScalarFieldEnum[];
    };

    /**
     * DonatedItemStatus create
     */
    export type DonatedItemStatusCreateArgs<
        ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs,
    > = {
        /**
         * Select specific fields to fetch from the DonatedItemStatus
         */
        select?: DonatedItemStatusSelect<ExtArgs> | null;
        /**
         * Omit specific fields from the DonatedItemStatus
         */
        omit?: DonatedItemStatusOmit<ExtArgs> | null;
        /**
         * Choose, which related nodes to fetch as well
         */
        include?: DonatedItemStatusInclude<ExtArgs> | null;
        /**
         * The data needed to create a DonatedItemStatus.
         */
        data: XOR<
            DonatedItemStatusCreateInput,
            DonatedItemStatusUncheckedCreateInput
        >;
    };

    /**
     * DonatedItemStatus createMany
     */
    export type DonatedItemStatusCreateManyArgs<
        ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs,
    > = {
        /**
         * The data used to create many DonatedItemStatuses.
         */
        data:
            | DonatedItemStatusCreateManyInput
            | DonatedItemStatusCreateManyInput[];
        skipDuplicates?: boolean;
    };

    /**
     * DonatedItemStatus createManyAndReturn
     */
    export type DonatedItemStatusCreateManyAndReturnArgs<
        ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs,
    > = {
        /**
         * Select specific fields to fetch from the DonatedItemStatus
         */
        select?: DonatedItemStatusSelectCreateManyAndReturn<ExtArgs> | null;
        /**
         * Omit specific fields from the DonatedItemStatus
         */
        omit?: DonatedItemStatusOmit<ExtArgs> | null;
        /**
         * The data used to create many DonatedItemStatuses.
         */
        data:
            | DonatedItemStatusCreateManyInput
            | DonatedItemStatusCreateManyInput[];
        skipDuplicates?: boolean;
        /**
         * Choose, which related nodes to fetch as well
         */
        include?: DonatedItemStatusIncludeCreateManyAndReturn<ExtArgs> | null;
    };

    /**
     * DonatedItemStatus update
     */
    export type DonatedItemStatusUpdateArgs<
        ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs,
    > = {
        /**
         * Select specific fields to fetch from the DonatedItemStatus
         */
        select?: DonatedItemStatusSelect<ExtArgs> | null;
        /**
         * Omit specific fields from the DonatedItemStatus
         */
        omit?: DonatedItemStatusOmit<ExtArgs> | null;
        /**
         * Choose, which related nodes to fetch as well
         */
        include?: DonatedItemStatusInclude<ExtArgs> | null;
        /**
         * The data needed to update a DonatedItemStatus.
         */
        data: XOR<
            DonatedItemStatusUpdateInput,
            DonatedItemStatusUncheckedUpdateInput
        >;
        /**
         * Choose, which DonatedItemStatus to update.
         */
        where: DonatedItemStatusWhereUniqueInput;
    };

    /**
     * DonatedItemStatus updateMany
     */
    export type DonatedItemStatusUpdateManyArgs<
        ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs,
    > = {
        /**
         * The data used to update DonatedItemStatuses.
         */
        data: XOR<
            DonatedItemStatusUpdateManyMutationInput,
            DonatedItemStatusUncheckedUpdateManyInput
        >;
        /**
         * Filter which DonatedItemStatuses to update
         */
        where?: DonatedItemStatusWhereInput;
        /**
         * Limit how many DonatedItemStatuses to update.
         */
        limit?: number;
    };

    /**
     * DonatedItemStatus updateManyAndReturn
     */
    export type DonatedItemStatusUpdateManyAndReturnArgs<
        ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs,
    > = {
        /**
         * Select specific fields to fetch from the DonatedItemStatus
         */
        select?: DonatedItemStatusSelectUpdateManyAndReturn<ExtArgs> | null;
        /**
         * Omit specific fields from the DonatedItemStatus
         */
        omit?: DonatedItemStatusOmit<ExtArgs> | null;
        /**
         * The data used to update DonatedItemStatuses.
         */
        data: XOR<
            DonatedItemStatusUpdateManyMutationInput,
            DonatedItemStatusUncheckedUpdateManyInput
        >;
        /**
         * Filter which DonatedItemStatuses to update
         */
        where?: DonatedItemStatusWhereInput;
        /**
         * Limit how many DonatedItemStatuses to update.
         */
        limit?: number;
        /**
         * Choose, which related nodes to fetch as well
         */
        include?: DonatedItemStatusIncludeUpdateManyAndReturn<ExtArgs> | null;
    };

    /**
     * DonatedItemStatus upsert
     */
    export type DonatedItemStatusUpsertArgs<
        ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs,
    > = {
        /**
         * Select specific fields to fetch from the DonatedItemStatus
         */
        select?: DonatedItemStatusSelect<ExtArgs> | null;
        /**
         * Omit specific fields from the DonatedItemStatus
         */
        omit?: DonatedItemStatusOmit<ExtArgs> | null;
        /**
         * Choose, which related nodes to fetch as well
         */
        include?: DonatedItemStatusInclude<ExtArgs> | null;
        /**
         * The filter to search for the DonatedItemStatus to update in case it exists.
         */
        where: DonatedItemStatusWhereUniqueInput;
        /**
         * In case the DonatedItemStatus found by the `where` argument doesn't exist, create a new DonatedItemStatus with this data.
         */
        create: XOR<
            DonatedItemStatusCreateInput,
            DonatedItemStatusUncheckedCreateInput
        >;
        /**
         * In case the DonatedItemStatus was found with the provided `where` argument, update it with this data.
         */
        update: XOR<
            DonatedItemStatusUpdateInput,
            DonatedItemStatusUncheckedUpdateInput
        >;
    };

    /**
     * DonatedItemStatus delete
     */
    export type DonatedItemStatusDeleteArgs<
        ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs,
    > = {
        /**
         * Select specific fields to fetch from the DonatedItemStatus
         */
        select?: DonatedItemStatusSelect<ExtArgs> | null;
        /**
         * Omit specific fields from the DonatedItemStatus
         */
        omit?: DonatedItemStatusOmit<ExtArgs> | null;
        /**
         * Choose, which related nodes to fetch as well
         */
        include?: DonatedItemStatusInclude<ExtArgs> | null;
        /**
         * Filter which DonatedItemStatus to delete.
         */
        where: DonatedItemStatusWhereUniqueInput;
    };

    /**
     * DonatedItemStatus deleteMany
     */
    export type DonatedItemStatusDeleteManyArgs<
        ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs,
    > = {
        /**
         * Filter which DonatedItemStatuses to delete
         */
        where?: DonatedItemStatusWhereInput;
        /**
         * Limit how many DonatedItemStatuses to delete.
         */
        limit?: number;
    };

    /**
     * DonatedItemStatus without action
     */
    export type DonatedItemStatusDefaultArgs<
        ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs,
    > = {
        /**
         * Select specific fields to fetch from the DonatedItemStatus
         */
        select?: DonatedItemStatusSelect<ExtArgs> | null;
        /**
         * Omit specific fields from the DonatedItemStatus
         */
        omit?: DonatedItemStatusOmit<ExtArgs> | null;
        /**
         * Choose, which related nodes to fetch as well
         */
        include?: DonatedItemStatusInclude<ExtArgs> | null;
    };

    /**
     * Model User
     */

    export type AggregateUser = {
        _count: UserCountAggregateOutputType | null;
        _min: UserMinAggregateOutputType | null;
        _max: UserMaxAggregateOutputType | null;
    };

    export type UserMinAggregateOutputType = {
        id: string | null;
        name: string | null;
        email: string | null;
        password: string | null;
        role: $Enums.Role | null;
        status: $Enums.UserStatus | null;
        createdAt: Date | null;
        firstLogin: boolean | null;
        resetToken: string | null;
        resetTokenExpiry: Date | null;
    };

    export type UserMaxAggregateOutputType = {
        id: string | null;
        name: string | null;
        email: string | null;
        password: string | null;
        role: $Enums.Role | null;
        status: $Enums.UserStatus | null;
        createdAt: Date | null;
        firstLogin: boolean | null;
        resetToken: string | null;
        resetTokenExpiry: Date | null;
    };

    export type UserCountAggregateOutputType = {
        id: number;
        name: number;
        email: number;
        password: number;
        role: number;
        status: number;
        createdAt: number;
        firstLogin: number;
        resetToken: number;
        resetTokenExpiry: number;
        _all: number;
    };

    export type UserMinAggregateInputType = {
        id?: true;
        name?: true;
        email?: true;
        password?: true;
        role?: true;
        status?: true;
        createdAt?: true;
        firstLogin?: true;
        resetToken?: true;
        resetTokenExpiry?: true;
    };

    export type UserMaxAggregateInputType = {
        id?: true;
        name?: true;
        email?: true;
        password?: true;
        role?: true;
        status?: true;
        createdAt?: true;
        firstLogin?: true;
        resetToken?: true;
        resetTokenExpiry?: true;
    };

    export type UserCountAggregateInputType = {
        id?: true;
        name?: true;
        email?: true;
        password?: true;
        role?: true;
        status?: true;
        createdAt?: true;
        firstLogin?: true;
        resetToken?: true;
        resetTokenExpiry?: true;
        _all?: true;
    };

    export type UserAggregateArgs<
        ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs,
    > = {
        /**
         * Filter which User to aggregate.
         */
        where?: UserWhereInput;
        /**
         * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
         *
         * Determine the order of Users to fetch.
         */
        orderBy?: UserOrderByWithRelationInput | UserOrderByWithRelationInput[];
        /**
         * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
         *
         * Sets the start position
         */
        cursor?: UserWhereUniqueInput;
        /**
         * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
         *
         * Take `±n` Users from the position of the cursor.
         */
        take?: number;
        /**
         * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
         *
         * Skip the first `n` Users.
         */
        skip?: number;
        /**
         * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
         *
         * Count returned Users
         **/
        _count?: true | UserCountAggregateInputType;
        /**
         * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
         *
         * Select which fields to find the minimum value
         **/
        _min?: UserMinAggregateInputType;
        /**
         * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
         *
         * Select which fields to find the maximum value
         **/
        _max?: UserMaxAggregateInputType;
    };

    export type GetUserAggregateType<T extends UserAggregateArgs> = {
        [P in keyof T & keyof AggregateUser]: P extends '_count' | 'count'
            ? T[P] extends true
                ? number
                : GetScalarType<T[P], AggregateUser[P]>
            : GetScalarType<T[P], AggregateUser[P]>;
    };

    export type UserGroupByArgs<
        ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs,
    > = {
        where?: UserWhereInput;
        orderBy?:
            | UserOrderByWithAggregationInput
            | UserOrderByWithAggregationInput[];
        by: UserScalarFieldEnum[] | UserScalarFieldEnum;
        having?: UserScalarWhereWithAggregatesInput;
        take?: number;
        skip?: number;
        _count?: UserCountAggregateInputType | true;
        _min?: UserMinAggregateInputType;
        _max?: UserMaxAggregateInputType;
    };

    export type UserGroupByOutputType = {
        id: string;
        name: string;
        email: string;
        password: string;
        role: $Enums.Role | null;
        status: $Enums.UserStatus;
        createdAt: Date;
        firstLogin: boolean;
        resetToken: string | null;
        resetTokenExpiry: Date | null;
        _count: UserCountAggregateOutputType | null;
        _min: UserMinAggregateOutputType | null;
        _max: UserMaxAggregateOutputType | null;
    };

    type GetUserGroupByPayload<T extends UserGroupByArgs> =
        Prisma.PrismaPromise<
            Array<
                PickEnumerable<UserGroupByOutputType, T['by']> & {
                    [P in keyof T &
                        keyof UserGroupByOutputType]: P extends '_count'
                        ? T[P] extends boolean
                            ? number
                            : GetScalarType<T[P], UserGroupByOutputType[P]>
                        : GetScalarType<T[P], UserGroupByOutputType[P]>;
                }
            >
        >;

    export type UserSelect<
        ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs,
    > = $Extensions.GetSelect<
        {
            id?: boolean;
            name?: boolean;
            email?: boolean;
            password?: boolean;
            role?: boolean;
            status?: boolean;
            createdAt?: boolean;
            firstLogin?: boolean;
            resetToken?: boolean;
            resetTokenExpiry?: boolean;
        },
        ExtArgs['result']['user']
    >;

    export type UserSelectCreateManyAndReturn<
        ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs,
    > = $Extensions.GetSelect<
        {
            id?: boolean;
            name?: boolean;
            email?: boolean;
            password?: boolean;
            role?: boolean;
            status?: boolean;
            createdAt?: boolean;
            firstLogin?: boolean;
            resetToken?: boolean;
            resetTokenExpiry?: boolean;
        },
        ExtArgs['result']['user']
    >;

    export type UserSelectUpdateManyAndReturn<
        ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs,
    > = $Extensions.GetSelect<
        {
            id?: boolean;
            name?: boolean;
            email?: boolean;
            password?: boolean;
            role?: boolean;
            status?: boolean;
            createdAt?: boolean;
            firstLogin?: boolean;
            resetToken?: boolean;
            resetTokenExpiry?: boolean;
        },
        ExtArgs['result']['user']
    >;

    export type UserSelectScalar = {
        id?: boolean;
        name?: boolean;
        email?: boolean;
        password?: boolean;
        role?: boolean;
        status?: boolean;
        createdAt?: boolean;
        firstLogin?: boolean;
        resetToken?: boolean;
        resetTokenExpiry?: boolean;
    };

    export type UserOmit<
        ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs,
    > = $Extensions.GetOmit<
        | 'id'
        | 'name'
        | 'email'
        | 'password'
        | 'role'
        | 'status'
        | 'createdAt'
        | 'firstLogin'
        | 'resetToken'
        | 'resetTokenExpiry',
        ExtArgs['result']['user']
    >;

    export type $UserPayload<
        ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs,
    > = {
        name: 'User';
        objects: {};
        scalars: $Extensions.GetPayloadResult<
            {
                id: string;
                name: string;
                email: string;
                password: string;
                role: $Enums.Role | null;
                status: $Enums.UserStatus;
                createdAt: Date;
                firstLogin: boolean;
                resetToken: string | null;
                resetTokenExpiry: Date | null;
            },
            ExtArgs['result']['user']
        >;
        composites: {};
    };

    type UserGetPayload<
        S extends boolean | null | undefined | UserDefaultArgs,
    > = $Result.GetResult<Prisma.$UserPayload, S>;

    type UserCountArgs<
        ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs,
    > = Omit<UserFindManyArgs, 'select' | 'include' | 'distinct' | 'omit'> & {
        select?: UserCountAggregateInputType | true;
    };

    export interface UserDelegate<
        ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs,
        GlobalOmitOptions = {},
    > {
        [K: symbol]: {
            types: Prisma.TypeMap<ExtArgs>['model']['User'];
            meta: { name: 'User' };
        };
        /**
         * Find zero or one User that matches the filter.
         * @param {UserFindUniqueArgs} args - Arguments to find a User
         * @example
         * // Get one User
         * const user = await prisma.user.findUnique({
         *   where: {
         *     // ... provide filter here
         *   }
         * })
         */
        findUnique<T extends UserFindUniqueArgs>(
            args: SelectSubset<T, UserFindUniqueArgs<ExtArgs>>,
        ): Prisma__UserClient<
            $Result.GetResult<
                Prisma.$UserPayload<ExtArgs>,
                T,
                'findUnique',
                GlobalOmitOptions
            > | null,
            null,
            ExtArgs,
            GlobalOmitOptions
        >;

        /**
         * Find one User that matches the filter or throw an error with `error.code='P2025'`
         * if no matches were found.
         * @param {UserFindUniqueOrThrowArgs} args - Arguments to find a User
         * @example
         * // Get one User
         * const user = await prisma.user.findUniqueOrThrow({
         *   where: {
         *     // ... provide filter here
         *   }
         * })
         */
        findUniqueOrThrow<T extends UserFindUniqueOrThrowArgs>(
            args: SelectSubset<T, UserFindUniqueOrThrowArgs<ExtArgs>>,
        ): Prisma__UserClient<
            $Result.GetResult<
                Prisma.$UserPayload<ExtArgs>,
                T,
                'findUniqueOrThrow',
                GlobalOmitOptions
            >,
            never,
            ExtArgs,
            GlobalOmitOptions
        >;

        /**
         * Find the first User that matches the filter.
         * Note, that providing `undefined` is treated as the value not being there.
         * Read more here: https://pris.ly/d/null-undefined
         * @param {UserFindFirstArgs} args - Arguments to find a User
         * @example
         * // Get one User
         * const user = await prisma.user.findFirst({
         *   where: {
         *     // ... provide filter here
         *   }
         * })
         */
        findFirst<T extends UserFindFirstArgs>(
            args?: SelectSubset<T, UserFindFirstArgs<ExtArgs>>,
        ): Prisma__UserClient<
            $Result.GetResult<
                Prisma.$UserPayload<ExtArgs>,
                T,
                'findFirst',
                GlobalOmitOptions
            > | null,
            null,
            ExtArgs,
            GlobalOmitOptions
        >;

        /**
         * Find the first User that matches the filter or
         * throw `PrismaKnownClientError` with `P2025` code if no matches were found.
         * Note, that providing `undefined` is treated as the value not being there.
         * Read more here: https://pris.ly/d/null-undefined
         * @param {UserFindFirstOrThrowArgs} args - Arguments to find a User
         * @example
         * // Get one User
         * const user = await prisma.user.findFirstOrThrow({
         *   where: {
         *     // ... provide filter here
         *   }
         * })
         */
        findFirstOrThrow<T extends UserFindFirstOrThrowArgs>(
            args?: SelectSubset<T, UserFindFirstOrThrowArgs<ExtArgs>>,
        ): Prisma__UserClient<
            $Result.GetResult<
                Prisma.$UserPayload<ExtArgs>,
                T,
                'findFirstOrThrow',
                GlobalOmitOptions
            >,
            never,
            ExtArgs,
            GlobalOmitOptions
        >;

        /**
         * Find zero or more Users that matches the filter.
         * Note, that providing `undefined` is treated as the value not being there.
         * Read more here: https://pris.ly/d/null-undefined
         * @param {UserFindManyArgs} args - Arguments to filter and select certain fields only.
         * @example
         * // Get all Users
         * const users = await prisma.user.findMany()
         *
         * // Get first 10 Users
         * const users = await prisma.user.findMany({ take: 10 })
         *
         * // Only select the `id`
         * const userWithIdOnly = await prisma.user.findMany({ select: { id: true } })
         *
         */
        findMany<T extends UserFindManyArgs>(
            args?: SelectSubset<T, UserFindManyArgs<ExtArgs>>,
        ): Prisma.PrismaPromise<
            $Result.GetResult<
                Prisma.$UserPayload<ExtArgs>,
                T,
                'findMany',
                GlobalOmitOptions
            >
        >;

        /**
         * Create a User.
         * @param {UserCreateArgs} args - Arguments to create a User.
         * @example
         * // Create one User
         * const User = await prisma.user.create({
         *   data: {
         *     // ... data to create a User
         *   }
         * })
         *
         */
        create<T extends UserCreateArgs>(
            args: SelectSubset<T, UserCreateArgs<ExtArgs>>,
        ): Prisma__UserClient<
            $Result.GetResult<
                Prisma.$UserPayload<ExtArgs>,
                T,
                'create',
                GlobalOmitOptions
            >,
            never,
            ExtArgs,
            GlobalOmitOptions
        >;

        /**
         * Create many Users.
         * @param {UserCreateManyArgs} args - Arguments to create many Users.
         * @example
         * // Create many Users
         * const user = await prisma.user.createMany({
         *   data: [
         *     // ... provide data here
         *   ]
         * })
         *
         */
        createMany<T extends UserCreateManyArgs>(
            args?: SelectSubset<T, UserCreateManyArgs<ExtArgs>>,
        ): Prisma.PrismaPromise<BatchPayload>;

        /**
         * Create many Users and returns the data saved in the database.
         * @param {UserCreateManyAndReturnArgs} args - Arguments to create many Users.
         * @example
         * // Create many Users
         * const user = await prisma.user.createManyAndReturn({
         *   data: [
         *     // ... provide data here
         *   ]
         * })
         *
         * // Create many Users and only return the `id`
         * const userWithIdOnly = await prisma.user.createManyAndReturn({
         *   select: { id: true },
         *   data: [
         *     // ... provide data here
         *   ]
         * })
         * Note, that providing `undefined` is treated as the value not being there.
         * Read more here: https://pris.ly/d/null-undefined
         *
         */
        createManyAndReturn<T extends UserCreateManyAndReturnArgs>(
            args?: SelectSubset<T, UserCreateManyAndReturnArgs<ExtArgs>>,
        ): Prisma.PrismaPromise<
            $Result.GetResult<
                Prisma.$UserPayload<ExtArgs>,
                T,
                'createManyAndReturn',
                GlobalOmitOptions
            >
        >;

        /**
         * Delete a User.
         * @param {UserDeleteArgs} args - Arguments to delete one User.
         * @example
         * // Delete one User
         * const User = await prisma.user.delete({
         *   where: {
         *     // ... filter to delete one User
         *   }
         * })
         *
         */
        delete<T extends UserDeleteArgs>(
            args: SelectSubset<T, UserDeleteArgs<ExtArgs>>,
        ): Prisma__UserClient<
            $Result.GetResult<
                Prisma.$UserPayload<ExtArgs>,
                T,
                'delete',
                GlobalOmitOptions
            >,
            never,
            ExtArgs,
            GlobalOmitOptions
        >;

        /**
         * Update one User.
         * @param {UserUpdateArgs} args - Arguments to update one User.
         * @example
         * // Update one User
         * const user = await prisma.user.update({
         *   where: {
         *     // ... provide filter here
         *   },
         *   data: {
         *     // ... provide data here
         *   }
         * })
         *
         */
        update<T extends UserUpdateArgs>(
            args: SelectSubset<T, UserUpdateArgs<ExtArgs>>,
        ): Prisma__UserClient<
            $Result.GetResult<
                Prisma.$UserPayload<ExtArgs>,
                T,
                'update',
                GlobalOmitOptions
            >,
            never,
            ExtArgs,
            GlobalOmitOptions
        >;

        /**
         * Delete zero or more Users.
         * @param {UserDeleteManyArgs} args - Arguments to filter Users to delete.
         * @example
         * // Delete a few Users
         * const { count } = await prisma.user.deleteMany({
         *   where: {
         *     // ... provide filter here
         *   }
         * })
         *
         */
        deleteMany<T extends UserDeleteManyArgs>(
            args?: SelectSubset<T, UserDeleteManyArgs<ExtArgs>>,
        ): Prisma.PrismaPromise<BatchPayload>;

        /**
         * Update zero or more Users.
         * Note, that providing `undefined` is treated as the value not being there.
         * Read more here: https://pris.ly/d/null-undefined
         * @param {UserUpdateManyArgs} args - Arguments to update one or more rows.
         * @example
         * // Update many Users
         * const user = await prisma.user.updateMany({
         *   where: {
         *     // ... provide filter here
         *   },
         *   data: {
         *     // ... provide data here
         *   }
         * })
         *
         */
        updateMany<T extends UserUpdateManyArgs>(
            args: SelectSubset<T, UserUpdateManyArgs<ExtArgs>>,
        ): Prisma.PrismaPromise<BatchPayload>;

        /**
         * Update zero or more Users and returns the data updated in the database.
         * @param {UserUpdateManyAndReturnArgs} args - Arguments to update many Users.
         * @example
         * // Update many Users
         * const user = await prisma.user.updateManyAndReturn({
         *   where: {
         *     // ... provide filter here
         *   },
         *   data: [
         *     // ... provide data here
         *   ]
         * })
         *
         * // Update zero or more Users and only return the `id`
         * const userWithIdOnly = await prisma.user.updateManyAndReturn({
         *   select: { id: true },
         *   where: {
         *     // ... provide filter here
         *   },
         *   data: [
         *     // ... provide data here
         *   ]
         * })
         * Note, that providing `undefined` is treated as the value not being there.
         * Read more here: https://pris.ly/d/null-undefined
         *
         */
        updateManyAndReturn<T extends UserUpdateManyAndReturnArgs>(
            args: SelectSubset<T, UserUpdateManyAndReturnArgs<ExtArgs>>,
        ): Prisma.PrismaPromise<
            $Result.GetResult<
                Prisma.$UserPayload<ExtArgs>,
                T,
                'updateManyAndReturn',
                GlobalOmitOptions
            >
        >;

        /**
         * Create or update one User.
         * @param {UserUpsertArgs} args - Arguments to update or create a User.
         * @example
         * // Update or create a User
         * const user = await prisma.user.upsert({
         *   create: {
         *     // ... data to create a User
         *   },
         *   update: {
         *     // ... in case it already exists, update
         *   },
         *   where: {
         *     // ... the filter for the User we want to update
         *   }
         * })
         */
        upsert<T extends UserUpsertArgs>(
            args: SelectSubset<T, UserUpsertArgs<ExtArgs>>,
        ): Prisma__UserClient<
            $Result.GetResult<
                Prisma.$UserPayload<ExtArgs>,
                T,
                'upsert',
                GlobalOmitOptions
            >,
            never,
            ExtArgs,
            GlobalOmitOptions
        >;

        /**
         * Count the number of Users.
         * Note, that providing `undefined` is treated as the value not being there.
         * Read more here: https://pris.ly/d/null-undefined
         * @param {UserCountArgs} args - Arguments to filter Users to count.
         * @example
         * // Count the number of Users
         * const count = await prisma.user.count({
         *   where: {
         *     // ... the filter for the Users we want to count
         *   }
         * })
         **/
        count<T extends UserCountArgs>(
            args?: Subset<T, UserCountArgs>,
        ): Prisma.PrismaPromise<
            T extends $Utils.Record<'select', any>
                ? T['select'] extends true
                    ? number
                    : GetScalarType<T['select'], UserCountAggregateOutputType>
                : number
        >;

        /**
         * Allows you to perform aggregations operations on a User.
         * Note, that providing `undefined` is treated as the value not being there.
         * Read more here: https://pris.ly/d/null-undefined
         * @param {UserAggregateArgs} args - Select which aggregations you would like to apply and on what fields.
         * @example
         * // Ordered by age ascending
         * // Where email contains prisma.io
         * // Limited to the 10 users
         * const aggregations = await prisma.user.aggregate({
         *   _avg: {
         *     age: true,
         *   },
         *   where: {
         *     email: {
         *       contains: "prisma.io",
         *     },
         *   },
         *   orderBy: {
         *     age: "asc",
         *   },
         *   take: 10,
         * })
         **/
        aggregate<T extends UserAggregateArgs>(
            args: Subset<T, UserAggregateArgs>,
        ): Prisma.PrismaPromise<GetUserAggregateType<T>>;

        /**
         * Group by User.
         * Note, that providing `undefined` is treated as the value not being there.
         * Read more here: https://pris.ly/d/null-undefined
         * @param {UserGroupByArgs} args - Group by arguments.
         * @example
         * // Group by city, order by createdAt, get count
         * const result = await prisma.user.groupBy({
         *   by: ['city', 'createdAt'],
         *   orderBy: {
         *     createdAt: true
         *   },
         *   _count: {
         *     _all: true
         *   },
         * })
         *
         **/
        groupBy<
            T extends UserGroupByArgs,
            HasSelectOrTake extends Or<
                Extends<'skip', Keys<T>>,
                Extends<'take', Keys<T>>
            >,
            OrderByArg extends True extends HasSelectOrTake
                ? { orderBy: UserGroupByArgs['orderBy'] }
                : { orderBy?: UserGroupByArgs['orderBy'] },
            OrderFields extends ExcludeUnderscoreKeys<
                Keys<MaybeTupleToUnion<T['orderBy']>>
            >,
            ByFields extends MaybeTupleToUnion<T['by']>,
            ByValid extends Has<ByFields, OrderFields>,
            HavingFields extends GetHavingFields<T['having']>,
            HavingValid extends Has<ByFields, HavingFields>,
            ByEmpty extends T['by'] extends never[] ? True : False,
            InputErrors extends ByEmpty extends True
                ? `Error: "by" must not be empty.`
                : HavingValid extends False
                  ? {
                        [P in HavingFields]: P extends ByFields
                            ? never
                            : P extends string
                              ? `Error: Field "${P}" used in "having" needs to be provided in "by".`
                              : [
                                    Error,
                                    'Field ',
                                    P,
                                    ` in "having" needs to be provided in "by"`,
                                ];
                    }[HavingFields]
                  : 'take' extends Keys<T>
                    ? 'orderBy' extends Keys<T>
                        ? ByValid extends True
                            ? {}
                            : {
                                  [P in OrderFields]: P extends ByFields
                                      ? never
                                      : `Error: Field "${P}" in "orderBy" needs to be provided in "by"`;
                              }[OrderFields]
                        : 'Error: If you provide "take", you also need to provide "orderBy"'
                    : 'skip' extends Keys<T>
                      ? 'orderBy' extends Keys<T>
                          ? ByValid extends True
                              ? {}
                              : {
                                    [P in OrderFields]: P extends ByFields
                                        ? never
                                        : `Error: Field "${P}" in "orderBy" needs to be provided in "by"`;
                                }[OrderFields]
                          : 'Error: If you provide "skip", you also need to provide "orderBy"'
                      : ByValid extends True
                        ? {}
                        : {
                              [P in OrderFields]: P extends ByFields
                                  ? never
                                  : `Error: Field "${P}" in "orderBy" needs to be provided in "by"`;
                          }[OrderFields],
        >(
            args: SubsetIntersection<T, UserGroupByArgs, OrderByArg> &
                InputErrors,
        ): {} extends InputErrors
            ? GetUserGroupByPayload<T>
            : Prisma.PrismaPromise<InputErrors>;
        /**
         * Fields of the User model
         */
        readonly fields: UserFieldRefs;
    }

    /**
     * The delegate class that acts as a "Promise-like" for User.
     * Why is this prefixed with `Prisma__`?
     * Because we want to prevent naming conflicts as mentioned in
     * https://github.com/prisma/prisma-client-js/issues/707
     */
    export interface Prisma__UserClient<
        T,
        Null = never,
        ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs,
        GlobalOmitOptions = {},
    > extends Prisma.PrismaPromise<T> {
        readonly [Symbol.toStringTag]: 'PrismaPromise';
        /**
         * Attaches callbacks for the resolution and/or rejection of the Promise.
         * @param onfulfilled The callback to execute when the Promise is resolved.
         * @param onrejected The callback to execute when the Promise is rejected.
         * @returns A Promise for the completion of which ever callback is executed.
         */
        then<TResult1 = T, TResult2 = never>(
            onfulfilled?:
                | ((value: T) => TResult1 | PromiseLike<TResult1>)
                | undefined
                | null,
            onrejected?:
                | ((reason: any) => TResult2 | PromiseLike<TResult2>)
                | undefined
                | null,
        ): $Utils.JsPromise<TResult1 | TResult2>;
        /**
         * Attaches a callback for only the rejection of the Promise.
         * @param onrejected The callback to execute when the Promise is rejected.
         * @returns A Promise for the completion of the callback.
         */
        catch<TResult = never>(
            onrejected?:
                | ((reason: any) => TResult | PromiseLike<TResult>)
                | undefined
                | null,
        ): $Utils.JsPromise<T | TResult>;
        /**
         * Attaches a callback that is invoked when the Promise is settled (fulfilled or rejected). The
         * resolved value cannot be modified from the callback.
         * @param onfinally The callback to execute when the Promise is settled (fulfilled or rejected).
         * @returns A Promise for the completion of the callback.
         */
        finally(
            onfinally?: (() => void) | undefined | null,
        ): $Utils.JsPromise<T>;
    }

    /**
     * Fields of the User model
     */
    interface UserFieldRefs {
        readonly id: FieldRef<'User', 'String'>;
        readonly name: FieldRef<'User', 'String'>;
        readonly email: FieldRef<'User', 'String'>;
        readonly password: FieldRef<'User', 'String'>;
        readonly role: FieldRef<'User', 'Role'>;
        readonly status: FieldRef<'User', 'UserStatus'>;
        readonly createdAt: FieldRef<'User', 'DateTime'>;
        readonly firstLogin: FieldRef<'User', 'Boolean'>;
        readonly resetToken: FieldRef<'User', 'String'>;
        readonly resetTokenExpiry: FieldRef<'User', 'DateTime'>;
    }

    // Custom InputTypes
    /**
     * User findUnique
     */
    export type UserFindUniqueArgs<
        ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs,
    > = {
        /**
         * Select specific fields to fetch from the User
         */
        select?: UserSelect<ExtArgs> | null;
        /**
         * Omit specific fields from the User
         */
        omit?: UserOmit<ExtArgs> | null;
        /**
         * Filter, which User to fetch.
         */
        where: UserWhereUniqueInput;
    };

    /**
     * User findUniqueOrThrow
     */
    export type UserFindUniqueOrThrowArgs<
        ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs,
    > = {
        /**
         * Select specific fields to fetch from the User
         */
        select?: UserSelect<ExtArgs> | null;
        /**
         * Omit specific fields from the User
         */
        omit?: UserOmit<ExtArgs> | null;
        /**
         * Filter, which User to fetch.
         */
        where: UserWhereUniqueInput;
    };

    /**
     * User findFirst
     */
    export type UserFindFirstArgs<
        ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs,
    > = {
        /**
         * Select specific fields to fetch from the User
         */
        select?: UserSelect<ExtArgs> | null;
        /**
         * Omit specific fields from the User
         */
        omit?: UserOmit<ExtArgs> | null;
        /**
         * Filter, which User to fetch.
         */
        where?: UserWhereInput;
        /**
         * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
         *
         * Determine the order of Users to fetch.
         */
        orderBy?: UserOrderByWithRelationInput | UserOrderByWithRelationInput[];
        /**
         * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
         *
         * Sets the position for searching for Users.
         */
        cursor?: UserWhereUniqueInput;
        /**
         * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
         *
         * Take `±n` Users from the position of the cursor.
         */
        take?: number;
        /**
         * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
         *
         * Skip the first `n` Users.
         */
        skip?: number;
        /**
         * {@link https://www.prisma.io/docs/concepts/components/prisma-client/distinct Distinct Docs}
         *
         * Filter by unique combinations of Users.
         */
        distinct?: UserScalarFieldEnum | UserScalarFieldEnum[];
    };

    /**
     * User findFirstOrThrow
     */
    export type UserFindFirstOrThrowArgs<
        ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs,
    > = {
        /**
         * Select specific fields to fetch from the User
         */
        select?: UserSelect<ExtArgs> | null;
        /**
         * Omit specific fields from the User
         */
        omit?: UserOmit<ExtArgs> | null;
        /**
         * Filter, which User to fetch.
         */
        where?: UserWhereInput;
        /**
         * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
         *
         * Determine the order of Users to fetch.
         */
        orderBy?: UserOrderByWithRelationInput | UserOrderByWithRelationInput[];
        /**
         * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
         *
         * Sets the position for searching for Users.
         */
        cursor?: UserWhereUniqueInput;
        /**
         * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
         *
         * Take `±n` Users from the position of the cursor.
         */
        take?: number;
        /**
         * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
         *
         * Skip the first `n` Users.
         */
        skip?: number;
        /**
         * {@link https://www.prisma.io/docs/concepts/components/prisma-client/distinct Distinct Docs}
         *
         * Filter by unique combinations of Users.
         */
        distinct?: UserScalarFieldEnum | UserScalarFieldEnum[];
    };

    /**
     * User findMany
     */
    export type UserFindManyArgs<
        ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs,
    > = {
        /**
         * Select specific fields to fetch from the User
         */
        select?: UserSelect<ExtArgs> | null;
        /**
         * Omit specific fields from the User
         */
        omit?: UserOmit<ExtArgs> | null;
        /**
         * Filter, which Users to fetch.
         */
        where?: UserWhereInput;
        /**
         * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
         *
         * Determine the order of Users to fetch.
         */
        orderBy?: UserOrderByWithRelationInput | UserOrderByWithRelationInput[];
        /**
         * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
         *
         * Sets the position for listing Users.
         */
        cursor?: UserWhereUniqueInput;
        /**
         * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
         *
         * Take `±n` Users from the position of the cursor.
         */
        take?: number;
        /**
         * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
         *
         * Skip the first `n` Users.
         */
        skip?: number;
        /**
         * {@link https://www.prisma.io/docs/concepts/components/prisma-client/distinct Distinct Docs}
         *
         * Filter by unique combinations of Users.
         */
        distinct?: UserScalarFieldEnum | UserScalarFieldEnum[];
    };

    /**
     * User create
     */
    export type UserCreateArgs<
        ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs,
    > = {
        /**
         * Select specific fields to fetch from the User
         */
        select?: UserSelect<ExtArgs> | null;
        /**
         * Omit specific fields from the User
         */
        omit?: UserOmit<ExtArgs> | null;
        /**
         * The data needed to create a User.
         */
        data: XOR<UserCreateInput, UserUncheckedCreateInput>;
    };

    /**
     * User createMany
     */
    export type UserCreateManyArgs<
        ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs,
    > = {
        /**
         * The data used to create many Users.
         */
        data: UserCreateManyInput | UserCreateManyInput[];
        skipDuplicates?: boolean;
    };

    /**
     * User createManyAndReturn
     */
    export type UserCreateManyAndReturnArgs<
        ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs,
    > = {
        /**
         * Select specific fields to fetch from the User
         */
        select?: UserSelectCreateManyAndReturn<ExtArgs> | null;
        /**
         * Omit specific fields from the User
         */
        omit?: UserOmit<ExtArgs> | null;
        /**
         * The data used to create many Users.
         */
        data: UserCreateManyInput | UserCreateManyInput[];
        skipDuplicates?: boolean;
    };

    /**
     * User update
     */
    export type UserUpdateArgs<
        ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs,
    > = {
        /**
         * Select specific fields to fetch from the User
         */
        select?: UserSelect<ExtArgs> | null;
        /**
         * Omit specific fields from the User
         */
        omit?: UserOmit<ExtArgs> | null;
        /**
         * The data needed to update a User.
         */
        data: XOR<UserUpdateInput, UserUncheckedUpdateInput>;
        /**
         * Choose, which User to update.
         */
        where: UserWhereUniqueInput;
    };

    /**
     * User updateMany
     */
    export type UserUpdateManyArgs<
        ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs,
    > = {
        /**
         * The data used to update Users.
         */
        data: XOR<UserUpdateManyMutationInput, UserUncheckedUpdateManyInput>;
        /**
         * Filter which Users to update
         */
        where?: UserWhereInput;
        /**
         * Limit how many Users to update.
         */
        limit?: number;
    };

    /**
     * User updateManyAndReturn
     */
    export type UserUpdateManyAndReturnArgs<
        ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs,
    > = {
        /**
         * Select specific fields to fetch from the User
         */
        select?: UserSelectUpdateManyAndReturn<ExtArgs> | null;
        /**
         * Omit specific fields from the User
         */
        omit?: UserOmit<ExtArgs> | null;
        /**
         * The data used to update Users.
         */
        data: XOR<UserUpdateManyMutationInput, UserUncheckedUpdateManyInput>;
        /**
         * Filter which Users to update
         */
        where?: UserWhereInput;
        /**
         * Limit how many Users to update.
         */
        limit?: number;
    };

    /**
     * User upsert
     */
    export type UserUpsertArgs<
        ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs,
    > = {
        /**
         * Select specific fields to fetch from the User
         */
        select?: UserSelect<ExtArgs> | null;
        /**
         * Omit specific fields from the User
         */
        omit?: UserOmit<ExtArgs> | null;
        /**
         * The filter to search for the User to update in case it exists.
         */
        where: UserWhereUniqueInput;
        /**
         * In case the User found by the `where` argument doesn't exist, create a new User with this data.
         */
        create: XOR<UserCreateInput, UserUncheckedCreateInput>;
        /**
         * In case the User was found with the provided `where` argument, update it with this data.
         */
        update: XOR<UserUpdateInput, UserUncheckedUpdateInput>;
    };

    /**
     * User delete
     */
    export type UserDeleteArgs<
        ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs,
    > = {
        /**
         * Select specific fields to fetch from the User
         */
        select?: UserSelect<ExtArgs> | null;
        /**
         * Omit specific fields from the User
         */
        omit?: UserOmit<ExtArgs> | null;
        /**
         * Filter which User to delete.
         */
        where: UserWhereUniqueInput;
    };

    /**
     * User deleteMany
     */
    export type UserDeleteManyArgs<
        ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs,
    > = {
        /**
         * Filter which Users to delete
         */
        where?: UserWhereInput;
        /**
         * Limit how many Users to delete.
         */
        limit?: number;
    };

    /**
     * User without action
     */
    export type UserDefaultArgs<
        ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs,
    > = {
        /**
         * Select specific fields to fetch from the User
         */
        select?: UserSelect<ExtArgs> | null;
        /**
         * Omit specific fields from the User
         */
        omit?: UserOmit<ExtArgs> | null;
    };

    /**
     * Enums
     */

    export const TransactionIsolationLevel: {
        ReadUncommitted: 'ReadUncommitted';
        ReadCommitted: 'ReadCommitted';
        RepeatableRead: 'RepeatableRead';
        Serializable: 'Serializable';
    };

    export type TransactionIsolationLevel =
        (typeof TransactionIsolationLevel)[keyof typeof TransactionIsolationLevel];

    export const DonorScalarFieldEnum: {
        id: 'id';
        firstName: 'firstName';
        lastName: 'lastName';
        contact: 'contact';
        email: 'email';
        addressLine1: 'addressLine1';
        addressLine2: 'addressLine2';
        state: 'state';
        city: 'city';
        zipcode: 'zipcode';
        emailOptIn: 'emailOptIn';
    };

    export type DonorScalarFieldEnum =
        (typeof DonorScalarFieldEnum)[keyof typeof DonorScalarFieldEnum];

    export const ProgramScalarFieldEnum: {
        id: 'id';
        name: 'name';
        description: 'description';
        startDate: 'startDate';
        aimAndCause: 'aimAndCause';
    };

    export type ProgramScalarFieldEnum =
        (typeof ProgramScalarFieldEnum)[keyof typeof ProgramScalarFieldEnum];

    export const DonatedItemScalarFieldEnum: {
        id: 'id';
        itemType: 'itemType';
        category: 'category';
        quantity: 'quantity';
        currentStatus: 'currentStatus';
        dateDonated: 'dateDonated';
        lastUpdated: 'lastUpdated';
        imagePath: 'imagePath';
        analysisMetadata: 'analysisMetadata';
        donorId: 'donorId';
        programId: 'programId';
    };

    export type DonatedItemScalarFieldEnum =
        (typeof DonatedItemScalarFieldEnum)[keyof typeof DonatedItemScalarFieldEnum];

    export const DonatedItemStatusScalarFieldEnum: {
        id: 'id';
        dateModified: 'dateModified';
        statusType: 'statusType';
        donatedItemId: 'donatedItemId';
        imageUrls: 'imageUrls';
        donorInformed: 'donorInformed';
        approval: 'approval';
        submitter: 'submitter';
    };

    export type DonatedItemStatusScalarFieldEnum =
        (typeof DonatedItemStatusScalarFieldEnum)[keyof typeof DonatedItemStatusScalarFieldEnum];

    export const UserScalarFieldEnum: {
        id: 'id';
        name: 'name';
        email: 'email';
        password: 'password';
        role: 'role';
        status: 'status';
        createdAt: 'createdAt';
        firstLogin: 'firstLogin';
        resetToken: 'resetToken';
        resetTokenExpiry: 'resetTokenExpiry';
    };

    export type UserScalarFieldEnum =
        (typeof UserScalarFieldEnum)[keyof typeof UserScalarFieldEnum];

    export const SortOrder: {
        asc: 'asc';
        desc: 'desc';
    };

    export type SortOrder = (typeof SortOrder)[keyof typeof SortOrder];

    export const NullableJsonNullValueInput: {
        DbNull: typeof DbNull;
        JsonNull: typeof JsonNull;
    };

    export type NullableJsonNullValueInput =
        (typeof NullableJsonNullValueInput)[keyof typeof NullableJsonNullValueInput];

    export const QueryMode: {
        default: 'default';
        insensitive: 'insensitive';
    };

    export type QueryMode = (typeof QueryMode)[keyof typeof QueryMode];

    export const NullsOrder: {
        first: 'first';
        last: 'last';
    };

    export type NullsOrder = (typeof NullsOrder)[keyof typeof NullsOrder];

    export const JsonNullValueFilter: {
        DbNull: typeof DbNull;
        JsonNull: typeof JsonNull;
        AnyNull: typeof AnyNull;
    };

    export type JsonNullValueFilter =
        (typeof JsonNullValueFilter)[keyof typeof JsonNullValueFilter];

    /**
     * Field references
     */

    /**
     * Reference to a field of type 'Int'
     */
    export type IntFieldRefInput<$PrismaModel> = FieldRefInputType<
        $PrismaModel,
        'Int'
    >;

    /**
     * Reference to a field of type 'Int[]'
     */
    export type ListIntFieldRefInput<$PrismaModel> = FieldRefInputType<
        $PrismaModel,
        'Int[]'
    >;

    /**
     * Reference to a field of type 'String'
     */
    export type StringFieldRefInput<$PrismaModel> = FieldRefInputType<
        $PrismaModel,
        'String'
    >;

    /**
     * Reference to a field of type 'String[]'
     */
    export type ListStringFieldRefInput<$PrismaModel> = FieldRefInputType<
        $PrismaModel,
        'String[]'
    >;

    /**
     * Reference to a field of type 'Boolean'
     */
    export type BooleanFieldRefInput<$PrismaModel> = FieldRefInputType<
        $PrismaModel,
        'Boolean'
    >;

    /**
     * Reference to a field of type 'DateTime'
     */
    export type DateTimeFieldRefInput<$PrismaModel> = FieldRefInputType<
        $PrismaModel,
        'DateTime'
    >;

    /**
     * Reference to a field of type 'DateTime[]'
     */
    export type ListDateTimeFieldRefInput<$PrismaModel> = FieldRefInputType<
        $PrismaModel,
        'DateTime[]'
    >;

    /**
     * Reference to a field of type 'Json'
     */
    export type JsonFieldRefInput<$PrismaModel> = FieldRefInputType<
        $PrismaModel,
        'Json'
    >;

    /**
     * Reference to a field of type 'QueryMode'
     */
    export type EnumQueryModeFieldRefInput<$PrismaModel> = FieldRefInputType<
        $PrismaModel,
        'QueryMode'
    >;

    /**
     * Reference to a field of type 'Role'
     */
    export type EnumRoleFieldRefInput<$PrismaModel> = FieldRefInputType<
        $PrismaModel,
        'Role'
    >;

    /**
     * Reference to a field of type 'Role[]'
     */
    export type ListEnumRoleFieldRefInput<$PrismaModel> = FieldRefInputType<
        $PrismaModel,
        'Role[]'
    >;

    /**
     * Reference to a field of type 'UserStatus'
     */
    export type EnumUserStatusFieldRefInput<$PrismaModel> = FieldRefInputType<
        $PrismaModel,
        'UserStatus'
    >;

    /**
     * Reference to a field of type 'UserStatus[]'
     */
    export type ListEnumUserStatusFieldRefInput<$PrismaModel> =
        FieldRefInputType<$PrismaModel, 'UserStatus[]'>;

    /**
     * Reference to a field of type 'Float'
     */
    export type FloatFieldRefInput<$PrismaModel> = FieldRefInputType<
        $PrismaModel,
        'Float'
    >;

    /**
     * Reference to a field of type 'Float[]'
     */
    export type ListFloatFieldRefInput<$PrismaModel> = FieldRefInputType<
        $PrismaModel,
        'Float[]'
    >;

    /**
     * Deep Input Types
     */

    export type DonorWhereInput = {
        AND?: DonorWhereInput | DonorWhereInput[];
        OR?: DonorWhereInput[];
        NOT?: DonorWhereInput | DonorWhereInput[];
        id?: IntFilter<'Donor'> | number;
        firstName?: StringFilter<'Donor'> | string;
        lastName?: StringFilter<'Donor'> | string;
        contact?: StringNullableFilter<'Donor'> | string | null;
        email?: StringFilter<'Donor'> | string;
        addressLine1?: StringNullableFilter<'Donor'> | string | null;
        addressLine2?: StringNullableFilter<'Donor'> | string | null;
        state?: StringNullableFilter<'Donor'> | string | null;
        city?: StringNullableFilter<'Donor'> | string | null;
        zipcode?: StringFilter<'Donor'> | string;
        emailOptIn?: BoolFilter<'Donor'> | boolean;
        donatedItems?: DonatedItemListRelationFilter;
    };

    export type DonorOrderByWithRelationInput = {
        id?: SortOrder;
        firstName?: SortOrder;
        lastName?: SortOrder;
        contact?: SortOrderInput | SortOrder;
        email?: SortOrder;
        addressLine1?: SortOrderInput | SortOrder;
        addressLine2?: SortOrderInput | SortOrder;
        state?: SortOrderInput | SortOrder;
        city?: SortOrderInput | SortOrder;
        zipcode?: SortOrder;
        emailOptIn?: SortOrder;
        donatedItems?: DonatedItemOrderByRelationAggregateInput;
    };

    export type DonorWhereUniqueInput = Prisma.AtLeast<
        {
            id?: number;
            email?: string;
            AND?: DonorWhereInput | DonorWhereInput[];
            OR?: DonorWhereInput[];
            NOT?: DonorWhereInput | DonorWhereInput[];
            firstName?: StringFilter<'Donor'> | string;
            lastName?: StringFilter<'Donor'> | string;
            contact?: StringNullableFilter<'Donor'> | string | null;
            addressLine1?: StringNullableFilter<'Donor'> | string | null;
            addressLine2?: StringNullableFilter<'Donor'> | string | null;
            state?: StringNullableFilter<'Donor'> | string | null;
            city?: StringNullableFilter<'Donor'> | string | null;
            zipcode?: StringFilter<'Donor'> | string;
            emailOptIn?: BoolFilter<'Donor'> | boolean;
            donatedItems?: DonatedItemListRelationFilter;
        },
        'id' | 'email'
    >;

    export type DonorOrderByWithAggregationInput = {
        id?: SortOrder;
        firstName?: SortOrder;
        lastName?: SortOrder;
        contact?: SortOrderInput | SortOrder;
        email?: SortOrder;
        addressLine1?: SortOrderInput | SortOrder;
        addressLine2?: SortOrderInput | SortOrder;
        state?: SortOrderInput | SortOrder;
        city?: SortOrderInput | SortOrder;
        zipcode?: SortOrder;
        emailOptIn?: SortOrder;
        _count?: DonorCountOrderByAggregateInput;
        _avg?: DonorAvgOrderByAggregateInput;
        _max?: DonorMaxOrderByAggregateInput;
        _min?: DonorMinOrderByAggregateInput;
        _sum?: DonorSumOrderByAggregateInput;
    };

    export type DonorScalarWhereWithAggregatesInput = {
        AND?:
            | DonorScalarWhereWithAggregatesInput
            | DonorScalarWhereWithAggregatesInput[];
        OR?: DonorScalarWhereWithAggregatesInput[];
        NOT?:
            | DonorScalarWhereWithAggregatesInput
            | DonorScalarWhereWithAggregatesInput[];
        id?: IntWithAggregatesFilter<'Donor'> | number;
        firstName?: StringWithAggregatesFilter<'Donor'> | string;
        lastName?: StringWithAggregatesFilter<'Donor'> | string;
        contact?: StringNullableWithAggregatesFilter<'Donor'> | string | null;
        email?: StringWithAggregatesFilter<'Donor'> | string;
        addressLine1?:
            | StringNullableWithAggregatesFilter<'Donor'>
            | string
            | null;
        addressLine2?:
            | StringNullableWithAggregatesFilter<'Donor'>
            | string
            | null;
        state?: StringNullableWithAggregatesFilter<'Donor'> | string | null;
        city?: StringNullableWithAggregatesFilter<'Donor'> | string | null;
        zipcode?: StringWithAggregatesFilter<'Donor'> | string;
        emailOptIn?: BoolWithAggregatesFilter<'Donor'> | boolean;
    };

    export type ProgramWhereInput = {
        AND?: ProgramWhereInput | ProgramWhereInput[];
        OR?: ProgramWhereInput[];
        NOT?: ProgramWhereInput | ProgramWhereInput[];
        id?: IntFilter<'Program'> | number;
        name?: StringFilter<'Program'> | string;
        description?: StringFilter<'Program'> | string;
        startDate?: DateTimeFilter<'Program'> | Date | string;
        aimAndCause?: StringFilter<'Program'> | string;
        donatedItems?: DonatedItemListRelationFilter;
    };

    export type ProgramOrderByWithRelationInput = {
        id?: SortOrder;
        name?: SortOrder;
        description?: SortOrder;
        startDate?: SortOrder;
        aimAndCause?: SortOrder;
        donatedItems?: DonatedItemOrderByRelationAggregateInput;
    };

    export type ProgramWhereUniqueInput = Prisma.AtLeast<
        {
            id?: number;
            AND?: ProgramWhereInput | ProgramWhereInput[];
            OR?: ProgramWhereInput[];
            NOT?: ProgramWhereInput | ProgramWhereInput[];
            name?: StringFilter<'Program'> | string;
            description?: StringFilter<'Program'> | string;
            startDate?: DateTimeFilter<'Program'> | Date | string;
            aimAndCause?: StringFilter<'Program'> | string;
            donatedItems?: DonatedItemListRelationFilter;
        },
        'id'
    >;

    export type ProgramOrderByWithAggregationInput = {
        id?: SortOrder;
        name?: SortOrder;
        description?: SortOrder;
        startDate?: SortOrder;
        aimAndCause?: SortOrder;
        _count?: ProgramCountOrderByAggregateInput;
        _avg?: ProgramAvgOrderByAggregateInput;
        _max?: ProgramMaxOrderByAggregateInput;
        _min?: ProgramMinOrderByAggregateInput;
        _sum?: ProgramSumOrderByAggregateInput;
    };

    export type ProgramScalarWhereWithAggregatesInput = {
        AND?:
            | ProgramScalarWhereWithAggregatesInput
            | ProgramScalarWhereWithAggregatesInput[];
        OR?: ProgramScalarWhereWithAggregatesInput[];
        NOT?:
            | ProgramScalarWhereWithAggregatesInput
            | ProgramScalarWhereWithAggregatesInput[];
        id?: IntWithAggregatesFilter<'Program'> | number;
        name?: StringWithAggregatesFilter<'Program'> | string;
        description?: StringWithAggregatesFilter<'Program'> | string;
        startDate?: DateTimeWithAggregatesFilter<'Program'> | Date | string;
        aimAndCause?: StringWithAggregatesFilter<'Program'> | string;
    };

    export type DonatedItemWhereInput = {
        AND?: DonatedItemWhereInput | DonatedItemWhereInput[];
        OR?: DonatedItemWhereInput[];
        NOT?: DonatedItemWhereInput | DonatedItemWhereInput[];
        id?: IntFilter<'DonatedItem'> | number;
        itemType?: StringFilter<'DonatedItem'> | string;
        category?: StringFilter<'DonatedItem'> | string;
        quantity?: IntFilter<'DonatedItem'> | number;
        currentStatus?: StringFilter<'DonatedItem'> | string;
        dateDonated?: DateTimeFilter<'DonatedItem'> | Date | string;
        lastUpdated?: DateTimeFilter<'DonatedItem'> | Date | string;
        imagePath?: StringNullableFilter<'DonatedItem'> | string | null;
        analysisMetadata?: JsonNullableFilter<'DonatedItem'>;
        donorId?: IntFilter<'DonatedItem'> | number;
        programId?: IntNullableFilter<'DonatedItem'> | number | null;
        donor?: XOR<DonorScalarRelationFilter, DonorWhereInput>;
        program?: XOR<
            ProgramNullableScalarRelationFilter,
            ProgramWhereInput
        > | null;
        statuses?: DonatedItemStatusListRelationFilter;
    };

    export type DonatedItemOrderByWithRelationInput = {
        id?: SortOrder;
        itemType?: SortOrder;
        category?: SortOrder;
        quantity?: SortOrder;
        currentStatus?: SortOrder;
        dateDonated?: SortOrder;
        lastUpdated?: SortOrder;
        imagePath?: SortOrderInput | SortOrder;
        analysisMetadata?: SortOrderInput | SortOrder;
        donorId?: SortOrder;
        programId?: SortOrderInput | SortOrder;
        donor?: DonorOrderByWithRelationInput;
        program?: ProgramOrderByWithRelationInput;
        statuses?: DonatedItemStatusOrderByRelationAggregateInput;
    };

    export type DonatedItemWhereUniqueInput = Prisma.AtLeast<
        {
            id?: number;
            AND?: DonatedItemWhereInput | DonatedItemWhereInput[];
            OR?: DonatedItemWhereInput[];
            NOT?: DonatedItemWhereInput | DonatedItemWhereInput[];
            itemType?: StringFilter<'DonatedItem'> | string;
            category?: StringFilter<'DonatedItem'> | string;
            quantity?: IntFilter<'DonatedItem'> | number;
            currentStatus?: StringFilter<'DonatedItem'> | string;
            dateDonated?: DateTimeFilter<'DonatedItem'> | Date | string;
            lastUpdated?: DateTimeFilter<'DonatedItem'> | Date | string;
            imagePath?: StringNullableFilter<'DonatedItem'> | string | null;
            analysisMetadata?: JsonNullableFilter<'DonatedItem'>;
            donorId?: IntFilter<'DonatedItem'> | number;
            programId?: IntNullableFilter<'DonatedItem'> | number | null;
            donor?: XOR<DonorScalarRelationFilter, DonorWhereInput>;
            program?: XOR<
                ProgramNullableScalarRelationFilter,
                ProgramWhereInput
            > | null;
            statuses?: DonatedItemStatusListRelationFilter;
        },
        'id'
    >;

    export type DonatedItemOrderByWithAggregationInput = {
        id?: SortOrder;
        itemType?: SortOrder;
        category?: SortOrder;
        quantity?: SortOrder;
        currentStatus?: SortOrder;
        dateDonated?: SortOrder;
        lastUpdated?: SortOrder;
        imagePath?: SortOrderInput | SortOrder;
        analysisMetadata?: SortOrderInput | SortOrder;
        donorId?: SortOrder;
        programId?: SortOrderInput | SortOrder;
        _count?: DonatedItemCountOrderByAggregateInput;
        _avg?: DonatedItemAvgOrderByAggregateInput;
        _max?: DonatedItemMaxOrderByAggregateInput;
        _min?: DonatedItemMinOrderByAggregateInput;
        _sum?: DonatedItemSumOrderByAggregateInput;
    };

    export type DonatedItemScalarWhereWithAggregatesInput = {
        AND?:
            | DonatedItemScalarWhereWithAggregatesInput
            | DonatedItemScalarWhereWithAggregatesInput[];
        OR?: DonatedItemScalarWhereWithAggregatesInput[];
        NOT?:
            | DonatedItemScalarWhereWithAggregatesInput
            | DonatedItemScalarWhereWithAggregatesInput[];
        id?: IntWithAggregatesFilter<'DonatedItem'> | number;
        itemType?: StringWithAggregatesFilter<'DonatedItem'> | string;
        category?: StringWithAggregatesFilter<'DonatedItem'> | string;
        quantity?: IntWithAggregatesFilter<'DonatedItem'> | number;
        currentStatus?: StringWithAggregatesFilter<'DonatedItem'> | string;
        dateDonated?:
            | DateTimeWithAggregatesFilter<'DonatedItem'>
            | Date
            | string;
        lastUpdated?:
            | DateTimeWithAggregatesFilter<'DonatedItem'>
            | Date
            | string;
        imagePath?:
            | StringNullableWithAggregatesFilter<'DonatedItem'>
            | string
            | null;
        analysisMetadata?: JsonNullableWithAggregatesFilter<'DonatedItem'>;
        donorId?: IntWithAggregatesFilter<'DonatedItem'> | number;
        programId?:
            | IntNullableWithAggregatesFilter<'DonatedItem'>
            | number
            | null;
    };

    export type DonatedItemStatusWhereInput = {
        AND?: DonatedItemStatusWhereInput | DonatedItemStatusWhereInput[];
        OR?: DonatedItemStatusWhereInput[];
        NOT?: DonatedItemStatusWhereInput | DonatedItemStatusWhereInput[];
        id?: IntFilter<'DonatedItemStatus'> | number;
        dateModified?: DateTimeFilter<'DonatedItemStatus'> | Date | string;
        statusType?: StringFilter<'DonatedItemStatus'> | string;
        donatedItemId?: IntFilter<'DonatedItemStatus'> | number;
        imageUrls?: StringNullableListFilter<'DonatedItemStatus'>;
        donorInformed?: BoolFilter<'DonatedItemStatus'> | boolean;
        approval?: BoolFilter<'DonatedItemStatus'> | boolean;
        submitter?: StringFilter<'DonatedItemStatus'> | string;
        donatedItem?: XOR<
            DonatedItemScalarRelationFilter,
            DonatedItemWhereInput
        >;
    };

    export type DonatedItemStatusOrderByWithRelationInput = {
        id?: SortOrder;
        dateModified?: SortOrder;
        statusType?: SortOrder;
        donatedItemId?: SortOrder;
        imageUrls?: SortOrder;
        donorInformed?: SortOrder;
        approval?: SortOrder;
        submitter?: SortOrder;
        donatedItem?: DonatedItemOrderByWithRelationInput;
    };

    export type DonatedItemStatusWhereUniqueInput = Prisma.AtLeast<
        {
            id?: number;
            AND?: DonatedItemStatusWhereInput | DonatedItemStatusWhereInput[];
            OR?: DonatedItemStatusWhereInput[];
            NOT?: DonatedItemStatusWhereInput | DonatedItemStatusWhereInput[];
            dateModified?: DateTimeFilter<'DonatedItemStatus'> | Date | string;
            statusType?: StringFilter<'DonatedItemStatus'> | string;
            donatedItemId?: IntFilter<'DonatedItemStatus'> | number;
            imageUrls?: StringNullableListFilter<'DonatedItemStatus'>;
            donorInformed?: BoolFilter<'DonatedItemStatus'> | boolean;
            approval?: BoolFilter<'DonatedItemStatus'> | boolean;
            submitter?: StringFilter<'DonatedItemStatus'> | string;
            donatedItem?: XOR<
                DonatedItemScalarRelationFilter,
                DonatedItemWhereInput
            >;
        },
        'id'
    >;

    export type DonatedItemStatusOrderByWithAggregationInput = {
        id?: SortOrder;
        dateModified?: SortOrder;
        statusType?: SortOrder;
        donatedItemId?: SortOrder;
        imageUrls?: SortOrder;
        donorInformed?: SortOrder;
        approval?: SortOrder;
        submitter?: SortOrder;
        _count?: DonatedItemStatusCountOrderByAggregateInput;
        _avg?: DonatedItemStatusAvgOrderByAggregateInput;
        _max?: DonatedItemStatusMaxOrderByAggregateInput;
        _min?: DonatedItemStatusMinOrderByAggregateInput;
        _sum?: DonatedItemStatusSumOrderByAggregateInput;
    };

    export type DonatedItemStatusScalarWhereWithAggregatesInput = {
        AND?:
            | DonatedItemStatusScalarWhereWithAggregatesInput
            | DonatedItemStatusScalarWhereWithAggregatesInput[];
        OR?: DonatedItemStatusScalarWhereWithAggregatesInput[];
        NOT?:
            | DonatedItemStatusScalarWhereWithAggregatesInput
            | DonatedItemStatusScalarWhereWithAggregatesInput[];
        id?: IntWithAggregatesFilter<'DonatedItemStatus'> | number;
        dateModified?:
            | DateTimeWithAggregatesFilter<'DonatedItemStatus'>
            | Date
            | string;
        statusType?: StringWithAggregatesFilter<'DonatedItemStatus'> | string;
        donatedItemId?: IntWithAggregatesFilter<'DonatedItemStatus'> | number;
        imageUrls?: StringNullableListFilter<'DonatedItemStatus'>;
        donorInformed?: BoolWithAggregatesFilter<'DonatedItemStatus'> | boolean;
        approval?: BoolWithAggregatesFilter<'DonatedItemStatus'> | boolean;
        submitter?: StringWithAggregatesFilter<'DonatedItemStatus'> | string;
    };

    export type UserWhereInput = {
        AND?: UserWhereInput | UserWhereInput[];
        OR?: UserWhereInput[];
        NOT?: UserWhereInput | UserWhereInput[];
        id?: StringFilter<'User'> | string;
        name?: StringFilter<'User'> | string;
        email?: StringFilter<'User'> | string;
        password?: StringFilter<'User'> | string;
        role?: EnumRoleNullableFilter<'User'> | $Enums.Role | null;
        status?: EnumUserStatusFilter<'User'> | $Enums.UserStatus;
        createdAt?: DateTimeFilter<'User'> | Date | string;
        firstLogin?: BoolFilter<'User'> | boolean;
        resetToken?: StringNullableFilter<'User'> | string | null;
        resetTokenExpiry?:
            | DateTimeNullableFilter<'User'>
            | Date
            | string
            | null;
    };

    export type UserOrderByWithRelationInput = {
        id?: SortOrder;
        name?: SortOrder;
        email?: SortOrder;
        password?: SortOrder;
        role?: SortOrderInput | SortOrder;
        status?: SortOrder;
        createdAt?: SortOrder;
        firstLogin?: SortOrder;
        resetToken?: SortOrderInput | SortOrder;
        resetTokenExpiry?: SortOrderInput | SortOrder;
    };

    export type UserWhereUniqueInput = Prisma.AtLeast<
        {
            id?: string;
            email?: string;
            AND?: UserWhereInput | UserWhereInput[];
            OR?: UserWhereInput[];
            NOT?: UserWhereInput | UserWhereInput[];
            name?: StringFilter<'User'> | string;
            password?: StringFilter<'User'> | string;
            role?: EnumRoleNullableFilter<'User'> | $Enums.Role | null;
            status?: EnumUserStatusFilter<'User'> | $Enums.UserStatus;
            createdAt?: DateTimeFilter<'User'> | Date | string;
            firstLogin?: BoolFilter<'User'> | boolean;
            resetToken?: StringNullableFilter<'User'> | string | null;
            resetTokenExpiry?:
                | DateTimeNullableFilter<'User'>
                | Date
                | string
                | null;
        },
        'id' | 'email'
    >;

    export type UserOrderByWithAggregationInput = {
        id?: SortOrder;
        name?: SortOrder;
        email?: SortOrder;
        password?: SortOrder;
        role?: SortOrderInput | SortOrder;
        status?: SortOrder;
        createdAt?: SortOrder;
        firstLogin?: SortOrder;
        resetToken?: SortOrderInput | SortOrder;
        resetTokenExpiry?: SortOrderInput | SortOrder;
        _count?: UserCountOrderByAggregateInput;
        _max?: UserMaxOrderByAggregateInput;
        _min?: UserMinOrderByAggregateInput;
    };

    export type UserScalarWhereWithAggregatesInput = {
        AND?:
            | UserScalarWhereWithAggregatesInput
            | UserScalarWhereWithAggregatesInput[];
        OR?: UserScalarWhereWithAggregatesInput[];
        NOT?:
            | UserScalarWhereWithAggregatesInput
            | UserScalarWhereWithAggregatesInput[];
        id?: StringWithAggregatesFilter<'User'> | string;
        name?: StringWithAggregatesFilter<'User'> | string;
        email?: StringWithAggregatesFilter<'User'> | string;
        password?: StringWithAggregatesFilter<'User'> | string;
        role?:
            | EnumRoleNullableWithAggregatesFilter<'User'>
            | $Enums.Role
            | null;
        status?: EnumUserStatusWithAggregatesFilter<'User'> | $Enums.UserStatus;
        createdAt?: DateTimeWithAggregatesFilter<'User'> | Date | string;
        firstLogin?: BoolWithAggregatesFilter<'User'> | boolean;
        resetToken?: StringNullableWithAggregatesFilter<'User'> | string | null;
        resetTokenExpiry?:
            | DateTimeNullableWithAggregatesFilter<'User'>
            | Date
            | string
            | null;
    };

    export type DonorCreateInput = {
        firstName: string;
        lastName: string;
        contact?: string | null;
        email: string;
        addressLine1?: string | null;
        addressLine2?: string | null;
        state?: string | null;
        city?: string | null;
        zipcode: string;
        emailOptIn: boolean;
        donatedItems?: DonatedItemCreateNestedManyWithoutDonorInput;
    };

    export type DonorUncheckedCreateInput = {
        id?: number;
        firstName: string;
        lastName: string;
        contact?: string | null;
        email: string;
        addressLine1?: string | null;
        addressLine2?: string | null;
        state?: string | null;
        city?: string | null;
        zipcode: string;
        emailOptIn: boolean;
        donatedItems?: DonatedItemUncheckedCreateNestedManyWithoutDonorInput;
    };

    export type DonorUpdateInput = {
        firstName?: StringFieldUpdateOperationsInput | string;
        lastName?: StringFieldUpdateOperationsInput | string;
        contact?: NullableStringFieldUpdateOperationsInput | string | null;
        email?: StringFieldUpdateOperationsInput | string;
        addressLine1?: NullableStringFieldUpdateOperationsInput | string | null;
        addressLine2?: NullableStringFieldUpdateOperationsInput | string | null;
        state?: NullableStringFieldUpdateOperationsInput | string | null;
        city?: NullableStringFieldUpdateOperationsInput | string | null;
        zipcode?: StringFieldUpdateOperationsInput | string;
        emailOptIn?: BoolFieldUpdateOperationsInput | boolean;
        donatedItems?: DonatedItemUpdateManyWithoutDonorNestedInput;
    };

    export type DonorUncheckedUpdateInput = {
        id?: IntFieldUpdateOperationsInput | number;
        firstName?: StringFieldUpdateOperationsInput | string;
        lastName?: StringFieldUpdateOperationsInput | string;
        contact?: NullableStringFieldUpdateOperationsInput | string | null;
        email?: StringFieldUpdateOperationsInput | string;
        addressLine1?: NullableStringFieldUpdateOperationsInput | string | null;
        addressLine2?: NullableStringFieldUpdateOperationsInput | string | null;
        state?: NullableStringFieldUpdateOperationsInput | string | null;
        city?: NullableStringFieldUpdateOperationsInput | string | null;
        zipcode?: StringFieldUpdateOperationsInput | string;
        emailOptIn?: BoolFieldUpdateOperationsInput | boolean;
        donatedItems?: DonatedItemUncheckedUpdateManyWithoutDonorNestedInput;
    };

    export type DonorCreateManyInput = {
        id?: number;
        firstName: string;
        lastName: string;
        contact?: string | null;
        email: string;
        addressLine1?: string | null;
        addressLine2?: string | null;
        state?: string | null;
        city?: string | null;
        zipcode: string;
        emailOptIn: boolean;
    };

    export type DonorUpdateManyMutationInput = {
        firstName?: StringFieldUpdateOperationsInput | string;
        lastName?: StringFieldUpdateOperationsInput | string;
        contact?: NullableStringFieldUpdateOperationsInput | string | null;
        email?: StringFieldUpdateOperationsInput | string;
        addressLine1?: NullableStringFieldUpdateOperationsInput | string | null;
        addressLine2?: NullableStringFieldUpdateOperationsInput | string | null;
        state?: NullableStringFieldUpdateOperationsInput | string | null;
        city?: NullableStringFieldUpdateOperationsInput | string | null;
        zipcode?: StringFieldUpdateOperationsInput | string;
        emailOptIn?: BoolFieldUpdateOperationsInput | boolean;
    };

    export type DonorUncheckedUpdateManyInput = {
        id?: IntFieldUpdateOperationsInput | number;
        firstName?: StringFieldUpdateOperationsInput | string;
        lastName?: StringFieldUpdateOperationsInput | string;
        contact?: NullableStringFieldUpdateOperationsInput | string | null;
        email?: StringFieldUpdateOperationsInput | string;
        addressLine1?: NullableStringFieldUpdateOperationsInput | string | null;
        addressLine2?: NullableStringFieldUpdateOperationsInput | string | null;
        state?: NullableStringFieldUpdateOperationsInput | string | null;
        city?: NullableStringFieldUpdateOperationsInput | string | null;
        zipcode?: StringFieldUpdateOperationsInput | string;
        emailOptIn?: BoolFieldUpdateOperationsInput | boolean;
    };

    export type ProgramCreateInput = {
        name: string;
        description: string;
        startDate: Date | string;
        aimAndCause: string;
        donatedItems?: DonatedItemCreateNestedManyWithoutProgramInput;
    };

    export type ProgramUncheckedCreateInput = {
        id?: number;
        name: string;
        description: string;
        startDate: Date | string;
        aimAndCause: string;
        donatedItems?: DonatedItemUncheckedCreateNestedManyWithoutProgramInput;
    };

    export type ProgramUpdateInput = {
        name?: StringFieldUpdateOperationsInput | string;
        description?: StringFieldUpdateOperationsInput | string;
        startDate?: DateTimeFieldUpdateOperationsInput | Date | string;
        aimAndCause?: StringFieldUpdateOperationsInput | string;
        donatedItems?: DonatedItemUpdateManyWithoutProgramNestedInput;
    };

    export type ProgramUncheckedUpdateInput = {
        id?: IntFieldUpdateOperationsInput | number;
        name?: StringFieldUpdateOperationsInput | string;
        description?: StringFieldUpdateOperationsInput | string;
        startDate?: DateTimeFieldUpdateOperationsInput | Date | string;
        aimAndCause?: StringFieldUpdateOperationsInput | string;
        donatedItems?: DonatedItemUncheckedUpdateManyWithoutProgramNestedInput;
    };

    export type ProgramCreateManyInput = {
        id?: number;
        name: string;
        description: string;
        startDate: Date | string;
        aimAndCause: string;
    };

    export type ProgramUpdateManyMutationInput = {
        name?: StringFieldUpdateOperationsInput | string;
        description?: StringFieldUpdateOperationsInput | string;
        startDate?: DateTimeFieldUpdateOperationsInput | Date | string;
        aimAndCause?: StringFieldUpdateOperationsInput | string;
    };

    export type ProgramUncheckedUpdateManyInput = {
        id?: IntFieldUpdateOperationsInput | number;
        name?: StringFieldUpdateOperationsInput | string;
        description?: StringFieldUpdateOperationsInput | string;
        startDate?: DateTimeFieldUpdateOperationsInput | Date | string;
        aimAndCause?: StringFieldUpdateOperationsInput | string;
    };

    export type DonatedItemCreateInput = {
        itemType: string;
        category: string;
        quantity: number;
        currentStatus: string;
        dateDonated: Date | string;
        lastUpdated?: Date | string;
        imagePath?: string | null;
        analysisMetadata?: NullableJsonNullValueInput | InputJsonValue;
        donor: DonorCreateNestedOneWithoutDonatedItemsInput;
        program?: ProgramCreateNestedOneWithoutDonatedItemsInput;
        statuses?: DonatedItemStatusCreateNestedManyWithoutDonatedItemInput;
    };

    export type DonatedItemUncheckedCreateInput = {
        id?: number;
        itemType: string;
        category: string;
        quantity: number;
        currentStatus: string;
        dateDonated: Date | string;
        lastUpdated?: Date | string;
        imagePath?: string | null;
        analysisMetadata?: NullableJsonNullValueInput | InputJsonValue;
        donorId: number;
        programId?: number | null;
        statuses?: DonatedItemStatusUncheckedCreateNestedManyWithoutDonatedItemInput;
    };

    export type DonatedItemUpdateInput = {
        itemType?: StringFieldUpdateOperationsInput | string;
        category?: StringFieldUpdateOperationsInput | string;
        quantity?: IntFieldUpdateOperationsInput | number;
        currentStatus?: StringFieldUpdateOperationsInput | string;
        dateDonated?: DateTimeFieldUpdateOperationsInput | Date | string;
        lastUpdated?: DateTimeFieldUpdateOperationsInput | Date | string;
        imagePath?: NullableStringFieldUpdateOperationsInput | string | null;
        analysisMetadata?: NullableJsonNullValueInput | InputJsonValue;
        donor?: DonorUpdateOneRequiredWithoutDonatedItemsNestedInput;
        program?: ProgramUpdateOneWithoutDonatedItemsNestedInput;
        statuses?: DonatedItemStatusUpdateManyWithoutDonatedItemNestedInput;
    };

    export type DonatedItemUncheckedUpdateInput = {
        id?: IntFieldUpdateOperationsInput | number;
        itemType?: StringFieldUpdateOperationsInput | string;
        category?: StringFieldUpdateOperationsInput | string;
        quantity?: IntFieldUpdateOperationsInput | number;
        currentStatus?: StringFieldUpdateOperationsInput | string;
        dateDonated?: DateTimeFieldUpdateOperationsInput | Date | string;
        lastUpdated?: DateTimeFieldUpdateOperationsInput | Date | string;
        imagePath?: NullableStringFieldUpdateOperationsInput | string | null;
        analysisMetadata?: NullableJsonNullValueInput | InputJsonValue;
        donorId?: IntFieldUpdateOperationsInput | number;
        programId?: NullableIntFieldUpdateOperationsInput | number | null;
        statuses?: DonatedItemStatusUncheckedUpdateManyWithoutDonatedItemNestedInput;
    };

    export type DonatedItemCreateManyInput = {
        id?: number;
        itemType: string;
        category: string;
        quantity: number;
        currentStatus: string;
        dateDonated: Date | string;
        lastUpdated?: Date | string;
        imagePath?: string | null;
        analysisMetadata?: NullableJsonNullValueInput | InputJsonValue;
        donorId: number;
        programId?: number | null;
    };

    export type DonatedItemUpdateManyMutationInput = {
        itemType?: StringFieldUpdateOperationsInput | string;
        category?: StringFieldUpdateOperationsInput | string;
        quantity?: IntFieldUpdateOperationsInput | number;
        currentStatus?: StringFieldUpdateOperationsInput | string;
        dateDonated?: DateTimeFieldUpdateOperationsInput | Date | string;
        lastUpdated?: DateTimeFieldUpdateOperationsInput | Date | string;
        imagePath?: NullableStringFieldUpdateOperationsInput | string | null;
        analysisMetadata?: NullableJsonNullValueInput | InputJsonValue;
    };

    export type DonatedItemUncheckedUpdateManyInput = {
        id?: IntFieldUpdateOperationsInput | number;
        itemType?: StringFieldUpdateOperationsInput | string;
        category?: StringFieldUpdateOperationsInput | string;
        quantity?: IntFieldUpdateOperationsInput | number;
        currentStatus?: StringFieldUpdateOperationsInput | string;
        dateDonated?: DateTimeFieldUpdateOperationsInput | Date | string;
        lastUpdated?: DateTimeFieldUpdateOperationsInput | Date | string;
        imagePath?: NullableStringFieldUpdateOperationsInput | string | null;
        analysisMetadata?: NullableJsonNullValueInput | InputJsonValue;
        donorId?: IntFieldUpdateOperationsInput | number;
        programId?: NullableIntFieldUpdateOperationsInput | number | null;
    };

    export type DonatedItemStatusCreateInput = {
        dateModified: Date | string;
        statusType: string;
        imageUrls?: DonatedItemStatusCreateimageUrlsInput | string[];
        donorInformed?: boolean;
        approval?: boolean;
        submitter?: string;
        donatedItem: DonatedItemCreateNestedOneWithoutStatusesInput;
    };

    export type DonatedItemStatusUncheckedCreateInput = {
        id?: number;
        dateModified: Date | string;
        statusType: string;
        donatedItemId: number;
        imageUrls?: DonatedItemStatusCreateimageUrlsInput | string[];
        donorInformed?: boolean;
        approval?: boolean;
        submitter?: string;
    };

    export type DonatedItemStatusUpdateInput = {
        dateModified?: DateTimeFieldUpdateOperationsInput | Date | string;
        statusType?: StringFieldUpdateOperationsInput | string;
        imageUrls?: DonatedItemStatusUpdateimageUrlsInput | string[];
        donorInformed?: BoolFieldUpdateOperationsInput | boolean;
        approval?: BoolFieldUpdateOperationsInput | boolean;
        submitter?: StringFieldUpdateOperationsInput | string;
        donatedItem?: DonatedItemUpdateOneRequiredWithoutStatusesNestedInput;
    };

    export type DonatedItemStatusUncheckedUpdateInput = {
        id?: IntFieldUpdateOperationsInput | number;
        dateModified?: DateTimeFieldUpdateOperationsInput | Date | string;
        statusType?: StringFieldUpdateOperationsInput | string;
        donatedItemId?: IntFieldUpdateOperationsInput | number;
        imageUrls?: DonatedItemStatusUpdateimageUrlsInput | string[];
        donorInformed?: BoolFieldUpdateOperationsInput | boolean;
        approval?: BoolFieldUpdateOperationsInput | boolean;
        submitter?: StringFieldUpdateOperationsInput | string;
    };

    export type DonatedItemStatusCreateManyInput = {
        id?: number;
        dateModified: Date | string;
        statusType: string;
        donatedItemId: number;
        imageUrls?: DonatedItemStatusCreateimageUrlsInput | string[];
        donorInformed?: boolean;
        approval?: boolean;
        submitter?: string;
    };

    export type DonatedItemStatusUpdateManyMutationInput = {
        dateModified?: DateTimeFieldUpdateOperationsInput | Date | string;
        statusType?: StringFieldUpdateOperationsInput | string;
        imageUrls?: DonatedItemStatusUpdateimageUrlsInput | string[];
        donorInformed?: BoolFieldUpdateOperationsInput | boolean;
        approval?: BoolFieldUpdateOperationsInput | boolean;
        submitter?: StringFieldUpdateOperationsInput | string;
    };

    export type DonatedItemStatusUncheckedUpdateManyInput = {
        id?: IntFieldUpdateOperationsInput | number;
        dateModified?: DateTimeFieldUpdateOperationsInput | Date | string;
        statusType?: StringFieldUpdateOperationsInput | string;
        donatedItemId?: IntFieldUpdateOperationsInput | number;
        imageUrls?: DonatedItemStatusUpdateimageUrlsInput | string[];
        donorInformed?: BoolFieldUpdateOperationsInput | boolean;
        approval?: BoolFieldUpdateOperationsInput | boolean;
        submitter?: StringFieldUpdateOperationsInput | string;
    };

    export type UserCreateInput = {
        id?: string;
        name: string;
        email: string;
        password: string;
        role?: $Enums.Role | null;
        status?: $Enums.UserStatus;
        createdAt?: Date | string;
        firstLogin?: boolean;
        resetToken?: string | null;
        resetTokenExpiry?: Date | string | null;
    };

    export type UserUncheckedCreateInput = {
        id?: string;
        name: string;
        email: string;
        password: string;
        role?: $Enums.Role | null;
        status?: $Enums.UserStatus;
        createdAt?: Date | string;
        firstLogin?: boolean;
        resetToken?: string | null;
        resetTokenExpiry?: Date | string | null;
    };

    export type UserUpdateInput = {
        id?: StringFieldUpdateOperationsInput | string;
        name?: StringFieldUpdateOperationsInput | string;
        email?: StringFieldUpdateOperationsInput | string;
        password?: StringFieldUpdateOperationsInput | string;
        role?: NullableEnumRoleFieldUpdateOperationsInput | $Enums.Role | null;
        status?: EnumUserStatusFieldUpdateOperationsInput | $Enums.UserStatus;
        createdAt?: DateTimeFieldUpdateOperationsInput | Date | string;
        firstLogin?: BoolFieldUpdateOperationsInput | boolean;
        resetToken?: NullableStringFieldUpdateOperationsInput | string | null;
        resetTokenExpiry?:
            | NullableDateTimeFieldUpdateOperationsInput
            | Date
            | string
            | null;
    };

    export type UserUncheckedUpdateInput = {
        id?: StringFieldUpdateOperationsInput | string;
        name?: StringFieldUpdateOperationsInput | string;
        email?: StringFieldUpdateOperationsInput | string;
        password?: StringFieldUpdateOperationsInput | string;
        role?: NullableEnumRoleFieldUpdateOperationsInput | $Enums.Role | null;
        status?: EnumUserStatusFieldUpdateOperationsInput | $Enums.UserStatus;
        createdAt?: DateTimeFieldUpdateOperationsInput | Date | string;
        firstLogin?: BoolFieldUpdateOperationsInput | boolean;
        resetToken?: NullableStringFieldUpdateOperationsInput | string | null;
        resetTokenExpiry?:
            | NullableDateTimeFieldUpdateOperationsInput
            | Date
            | string
            | null;
    };

    export type UserCreateManyInput = {
        id?: string;
        name: string;
        email: string;
        password: string;
        role?: $Enums.Role | null;
        status?: $Enums.UserStatus;
        createdAt?: Date | string;
        firstLogin?: boolean;
        resetToken?: string | null;
        resetTokenExpiry?: Date | string | null;
    };

    export type UserUpdateManyMutationInput = {
        id?: StringFieldUpdateOperationsInput | string;
        name?: StringFieldUpdateOperationsInput | string;
        email?: StringFieldUpdateOperationsInput | string;
        password?: StringFieldUpdateOperationsInput | string;
        role?: NullableEnumRoleFieldUpdateOperationsInput | $Enums.Role | null;
        status?: EnumUserStatusFieldUpdateOperationsInput | $Enums.UserStatus;
        createdAt?: DateTimeFieldUpdateOperationsInput | Date | string;
        firstLogin?: BoolFieldUpdateOperationsInput | boolean;
        resetToken?: NullableStringFieldUpdateOperationsInput | string | null;
        resetTokenExpiry?:
            | NullableDateTimeFieldUpdateOperationsInput
            | Date
            | string
            | null;
    };

    export type UserUncheckedUpdateManyInput = {
        id?: StringFieldUpdateOperationsInput | string;
        name?: StringFieldUpdateOperationsInput | string;
        email?: StringFieldUpdateOperationsInput | string;
        password?: StringFieldUpdateOperationsInput | string;
        role?: NullableEnumRoleFieldUpdateOperationsInput | $Enums.Role | null;
        status?: EnumUserStatusFieldUpdateOperationsInput | $Enums.UserStatus;
        createdAt?: DateTimeFieldUpdateOperationsInput | Date | string;
        firstLogin?: BoolFieldUpdateOperationsInput | boolean;
        resetToken?: NullableStringFieldUpdateOperationsInput | string | null;
        resetTokenExpiry?:
            | NullableDateTimeFieldUpdateOperationsInput
            | Date
            | string
            | null;
    };

    export type IntFilter<$PrismaModel = never> = {
        equals?: number | IntFieldRefInput<$PrismaModel>;
        in?: number[] | ListIntFieldRefInput<$PrismaModel>;
        notIn?: number[] | ListIntFieldRefInput<$PrismaModel>;
        lt?: number | IntFieldRefInput<$PrismaModel>;
        lte?: number | IntFieldRefInput<$PrismaModel>;
        gt?: number | IntFieldRefInput<$PrismaModel>;
        gte?: number | IntFieldRefInput<$PrismaModel>;
        not?: NestedIntFilter<$PrismaModel> | number;
    };

    export type StringFilter<$PrismaModel = never> = {
        equals?: string | StringFieldRefInput<$PrismaModel>;
        in?: string[] | ListStringFieldRefInput<$PrismaModel>;
        notIn?: string[] | ListStringFieldRefInput<$PrismaModel>;
        lt?: string | StringFieldRefInput<$PrismaModel>;
        lte?: string | StringFieldRefInput<$PrismaModel>;
        gt?: string | StringFieldRefInput<$PrismaModel>;
        gte?: string | StringFieldRefInput<$PrismaModel>;
        contains?: string | StringFieldRefInput<$PrismaModel>;
        startsWith?: string | StringFieldRefInput<$PrismaModel>;
        endsWith?: string | StringFieldRefInput<$PrismaModel>;
        mode?: QueryMode;
        not?: NestedStringFilter<$PrismaModel> | string;
    };

    export type StringNullableFilter<$PrismaModel = never> = {
        equals?: string | StringFieldRefInput<$PrismaModel> | null;
        in?: string[] | ListStringFieldRefInput<$PrismaModel> | null;
        notIn?: string[] | ListStringFieldRefInput<$PrismaModel> | null;
        lt?: string | StringFieldRefInput<$PrismaModel>;
        lte?: string | StringFieldRefInput<$PrismaModel>;
        gt?: string | StringFieldRefInput<$PrismaModel>;
        gte?: string | StringFieldRefInput<$PrismaModel>;
        contains?: string | StringFieldRefInput<$PrismaModel>;
        startsWith?: string | StringFieldRefInput<$PrismaModel>;
        endsWith?: string | StringFieldRefInput<$PrismaModel>;
        mode?: QueryMode;
        not?: NestedStringNullableFilter<$PrismaModel> | string | null;
    };

    export type BoolFilter<$PrismaModel = never> = {
        equals?: boolean | BooleanFieldRefInput<$PrismaModel>;
        not?: NestedBoolFilter<$PrismaModel> | boolean;
    };

    export type DonatedItemListRelationFilter = {
        every?: DonatedItemWhereInput;
        some?: DonatedItemWhereInput;
        none?: DonatedItemWhereInput;
    };

    export type SortOrderInput = {
        sort: SortOrder;
        nulls?: NullsOrder;
    };

    export type DonatedItemOrderByRelationAggregateInput = {
        _count?: SortOrder;
    };

    export type DonorCountOrderByAggregateInput = {
        id?: SortOrder;
        firstName?: SortOrder;
        lastName?: SortOrder;
        contact?: SortOrder;
        email?: SortOrder;
        addressLine1?: SortOrder;
        addressLine2?: SortOrder;
        state?: SortOrder;
        city?: SortOrder;
        zipcode?: SortOrder;
        emailOptIn?: SortOrder;
    };

    export type DonorAvgOrderByAggregateInput = {
        id?: SortOrder;
    };

    export type DonorMaxOrderByAggregateInput = {
        id?: SortOrder;
        firstName?: SortOrder;
        lastName?: SortOrder;
        contact?: SortOrder;
        email?: SortOrder;
        addressLine1?: SortOrder;
        addressLine2?: SortOrder;
        state?: SortOrder;
        city?: SortOrder;
        zipcode?: SortOrder;
        emailOptIn?: SortOrder;
    };

    export type DonorMinOrderByAggregateInput = {
        id?: SortOrder;
        firstName?: SortOrder;
        lastName?: SortOrder;
        contact?: SortOrder;
        email?: SortOrder;
        addressLine1?: SortOrder;
        addressLine2?: SortOrder;
        state?: SortOrder;
        city?: SortOrder;
        zipcode?: SortOrder;
        emailOptIn?: SortOrder;
    };

    export type DonorSumOrderByAggregateInput = {
        id?: SortOrder;
    };

    export type IntWithAggregatesFilter<$PrismaModel = never> = {
        equals?: number | IntFieldRefInput<$PrismaModel>;
        in?: number[] | ListIntFieldRefInput<$PrismaModel>;
        notIn?: number[] | ListIntFieldRefInput<$PrismaModel>;
        lt?: number | IntFieldRefInput<$PrismaModel>;
        lte?: number | IntFieldRefInput<$PrismaModel>;
        gt?: number | IntFieldRefInput<$PrismaModel>;
        gte?: number | IntFieldRefInput<$PrismaModel>;
        not?: NestedIntWithAggregatesFilter<$PrismaModel> | number;
        _count?: NestedIntFilter<$PrismaModel>;
        _avg?: NestedFloatFilter<$PrismaModel>;
        _sum?: NestedIntFilter<$PrismaModel>;
        _min?: NestedIntFilter<$PrismaModel>;
        _max?: NestedIntFilter<$PrismaModel>;
    };

    export type StringWithAggregatesFilter<$PrismaModel = never> = {
        equals?: string | StringFieldRefInput<$PrismaModel>;
        in?: string[] | ListStringFieldRefInput<$PrismaModel>;
        notIn?: string[] | ListStringFieldRefInput<$PrismaModel>;
        lt?: string | StringFieldRefInput<$PrismaModel>;
        lte?: string | StringFieldRefInput<$PrismaModel>;
        gt?: string | StringFieldRefInput<$PrismaModel>;
        gte?: string | StringFieldRefInput<$PrismaModel>;
        contains?: string | StringFieldRefInput<$PrismaModel>;
        startsWith?: string | StringFieldRefInput<$PrismaModel>;
        endsWith?: string | StringFieldRefInput<$PrismaModel>;
        mode?: QueryMode;
        not?: NestedStringWithAggregatesFilter<$PrismaModel> | string;
        _count?: NestedIntFilter<$PrismaModel>;
        _min?: NestedStringFilter<$PrismaModel>;
        _max?: NestedStringFilter<$PrismaModel>;
    };

    export type StringNullableWithAggregatesFilter<$PrismaModel = never> = {
        equals?: string | StringFieldRefInput<$PrismaModel> | null;
        in?: string[] | ListStringFieldRefInput<$PrismaModel> | null;
        notIn?: string[] | ListStringFieldRefInput<$PrismaModel> | null;
        lt?: string | StringFieldRefInput<$PrismaModel>;
        lte?: string | StringFieldRefInput<$PrismaModel>;
        gt?: string | StringFieldRefInput<$PrismaModel>;
        gte?: string | StringFieldRefInput<$PrismaModel>;
        contains?: string | StringFieldRefInput<$PrismaModel>;
        startsWith?: string | StringFieldRefInput<$PrismaModel>;
        endsWith?: string | StringFieldRefInput<$PrismaModel>;
        mode?: QueryMode;
        not?:
            | NestedStringNullableWithAggregatesFilter<$PrismaModel>
            | string
            | null;
        _count?: NestedIntNullableFilter<$PrismaModel>;
        _min?: NestedStringNullableFilter<$PrismaModel>;
        _max?: NestedStringNullableFilter<$PrismaModel>;
    };

    export type BoolWithAggregatesFilter<$PrismaModel = never> = {
        equals?: boolean | BooleanFieldRefInput<$PrismaModel>;
        not?: NestedBoolWithAggregatesFilter<$PrismaModel> | boolean;
        _count?: NestedIntFilter<$PrismaModel>;
        _min?: NestedBoolFilter<$PrismaModel>;
        _max?: NestedBoolFilter<$PrismaModel>;
    };

    export type DateTimeFilter<$PrismaModel = never> = {
        equals?: Date | string | DateTimeFieldRefInput<$PrismaModel>;
        in?: Date[] | string[] | ListDateTimeFieldRefInput<$PrismaModel>;
        notIn?: Date[] | string[] | ListDateTimeFieldRefInput<$PrismaModel>;
        lt?: Date | string | DateTimeFieldRefInput<$PrismaModel>;
        lte?: Date | string | DateTimeFieldRefInput<$PrismaModel>;
        gt?: Date | string | DateTimeFieldRefInput<$PrismaModel>;
        gte?: Date | string | DateTimeFieldRefInput<$PrismaModel>;
        not?: NestedDateTimeFilter<$PrismaModel> | Date | string;
    };

    export type ProgramCountOrderByAggregateInput = {
        id?: SortOrder;
        name?: SortOrder;
        description?: SortOrder;
        startDate?: SortOrder;
        aimAndCause?: SortOrder;
    };

    export type ProgramAvgOrderByAggregateInput = {
        id?: SortOrder;
    };

    export type ProgramMaxOrderByAggregateInput = {
        id?: SortOrder;
        name?: SortOrder;
        description?: SortOrder;
        startDate?: SortOrder;
        aimAndCause?: SortOrder;
    };

    export type ProgramMinOrderByAggregateInput = {
        id?: SortOrder;
        name?: SortOrder;
        description?: SortOrder;
        startDate?: SortOrder;
        aimAndCause?: SortOrder;
    };

    export type ProgramSumOrderByAggregateInput = {
        id?: SortOrder;
    };

    export type DateTimeWithAggregatesFilter<$PrismaModel = never> = {
        equals?: Date | string | DateTimeFieldRefInput<$PrismaModel>;
        in?: Date[] | string[] | ListDateTimeFieldRefInput<$PrismaModel>;
        notIn?: Date[] | string[] | ListDateTimeFieldRefInput<$PrismaModel>;
        lt?: Date | string | DateTimeFieldRefInput<$PrismaModel>;
        lte?: Date | string | DateTimeFieldRefInput<$PrismaModel>;
        gt?: Date | string | DateTimeFieldRefInput<$PrismaModel>;
        gte?: Date | string | DateTimeFieldRefInput<$PrismaModel>;
        not?: NestedDateTimeWithAggregatesFilter<$PrismaModel> | Date | string;
        _count?: NestedIntFilter<$PrismaModel>;
        _min?: NestedDateTimeFilter<$PrismaModel>;
        _max?: NestedDateTimeFilter<$PrismaModel>;
    };
    export type JsonNullableFilter<$PrismaModel = never> =
        | PatchUndefined<
              Either<
                  Required<JsonNullableFilterBase<$PrismaModel>>,
                  Exclude<
                      keyof Required<JsonNullableFilterBase<$PrismaModel>>,
                      'path'
                  >
              >,
              Required<JsonNullableFilterBase<$PrismaModel>>
          >
        | OptionalFlat<
              Omit<Required<JsonNullableFilterBase<$PrismaModel>>, 'path'>
          >;

    export type JsonNullableFilterBase<$PrismaModel = never> = {
        equals?:
            | InputJsonValue
            | JsonFieldRefInput<$PrismaModel>
            | JsonNullValueFilter;
        path?: string[];
        mode?: QueryMode | EnumQueryModeFieldRefInput<$PrismaModel>;
        string_contains?: string | StringFieldRefInput<$PrismaModel>;
        string_starts_with?: string | StringFieldRefInput<$PrismaModel>;
        string_ends_with?: string | StringFieldRefInput<$PrismaModel>;
        array_starts_with?:
            | InputJsonValue
            | JsonFieldRefInput<$PrismaModel>
            | null;
        array_ends_with?:
            | InputJsonValue
            | JsonFieldRefInput<$PrismaModel>
            | null;
        array_contains?:
            | InputJsonValue
            | JsonFieldRefInput<$PrismaModel>
            | null;
        lt?: InputJsonValue | JsonFieldRefInput<$PrismaModel>;
        lte?: InputJsonValue | JsonFieldRefInput<$PrismaModel>;
        gt?: InputJsonValue | JsonFieldRefInput<$PrismaModel>;
        gte?: InputJsonValue | JsonFieldRefInput<$PrismaModel>;
        not?:
            | InputJsonValue
            | JsonFieldRefInput<$PrismaModel>
            | JsonNullValueFilter;
    };

    export type IntNullableFilter<$PrismaModel = never> = {
        equals?: number | IntFieldRefInput<$PrismaModel> | null;
        in?: number[] | ListIntFieldRefInput<$PrismaModel> | null;
        notIn?: number[] | ListIntFieldRefInput<$PrismaModel> | null;
        lt?: number | IntFieldRefInput<$PrismaModel>;
        lte?: number | IntFieldRefInput<$PrismaModel>;
        gt?: number | IntFieldRefInput<$PrismaModel>;
        gte?: number | IntFieldRefInput<$PrismaModel>;
        not?: NestedIntNullableFilter<$PrismaModel> | number | null;
    };

    export type DonorScalarRelationFilter = {
        is?: DonorWhereInput;
        isNot?: DonorWhereInput;
    };

    export type ProgramNullableScalarRelationFilter = {
        is?: ProgramWhereInput | null;
        isNot?: ProgramWhereInput | null;
    };

    export type DonatedItemStatusListRelationFilter = {
        every?: DonatedItemStatusWhereInput;
        some?: DonatedItemStatusWhereInput;
        none?: DonatedItemStatusWhereInput;
    };

    export type DonatedItemStatusOrderByRelationAggregateInput = {
        _count?: SortOrder;
    };

    export type DonatedItemCountOrderByAggregateInput = {
        id?: SortOrder;
        itemType?: SortOrder;
        category?: SortOrder;
        quantity?: SortOrder;
        currentStatus?: SortOrder;
        dateDonated?: SortOrder;
        lastUpdated?: SortOrder;
        imagePath?: SortOrder;
        analysisMetadata?: SortOrder;
        donorId?: SortOrder;
        programId?: SortOrder;
    };

    export type DonatedItemAvgOrderByAggregateInput = {
        id?: SortOrder;
        quantity?: SortOrder;
        donorId?: SortOrder;
        programId?: SortOrder;
    };

    export type DonatedItemMaxOrderByAggregateInput = {
        id?: SortOrder;
        itemType?: SortOrder;
        category?: SortOrder;
        quantity?: SortOrder;
        currentStatus?: SortOrder;
        dateDonated?: SortOrder;
        lastUpdated?: SortOrder;
        imagePath?: SortOrder;
        donorId?: SortOrder;
        programId?: SortOrder;
    };

    export type DonatedItemMinOrderByAggregateInput = {
        id?: SortOrder;
        itemType?: SortOrder;
        category?: SortOrder;
        quantity?: SortOrder;
        currentStatus?: SortOrder;
        dateDonated?: SortOrder;
        lastUpdated?: SortOrder;
        imagePath?: SortOrder;
        donorId?: SortOrder;
        programId?: SortOrder;
    };

    export type DonatedItemSumOrderByAggregateInput = {
        id?: SortOrder;
        quantity?: SortOrder;
        donorId?: SortOrder;
        programId?: SortOrder;
    };
    export type JsonNullableWithAggregatesFilter<$PrismaModel = never> =
        | PatchUndefined<
              Either<
                  Required<JsonNullableWithAggregatesFilterBase<$PrismaModel>>,
                  Exclude<
                      keyof Required<
                          JsonNullableWithAggregatesFilterBase<$PrismaModel>
                      >,
                      'path'
                  >
              >,
              Required<JsonNullableWithAggregatesFilterBase<$PrismaModel>>
          >
        | OptionalFlat<
              Omit<
                  Required<JsonNullableWithAggregatesFilterBase<$PrismaModel>>,
                  'path'
              >
          >;

    export type JsonNullableWithAggregatesFilterBase<$PrismaModel = never> = {
        equals?:
            | InputJsonValue
            | JsonFieldRefInput<$PrismaModel>
            | JsonNullValueFilter;
        path?: string[];
        mode?: QueryMode | EnumQueryModeFieldRefInput<$PrismaModel>;
        string_contains?: string | StringFieldRefInput<$PrismaModel>;
        string_starts_with?: string | StringFieldRefInput<$PrismaModel>;
        string_ends_with?: string | StringFieldRefInput<$PrismaModel>;
        array_starts_with?:
            | InputJsonValue
            | JsonFieldRefInput<$PrismaModel>
            | null;
        array_ends_with?:
            | InputJsonValue
            | JsonFieldRefInput<$PrismaModel>
            | null;
        array_contains?:
            | InputJsonValue
            | JsonFieldRefInput<$PrismaModel>
            | null;
        lt?: InputJsonValue | JsonFieldRefInput<$PrismaModel>;
        lte?: InputJsonValue | JsonFieldRefInput<$PrismaModel>;
        gt?: InputJsonValue | JsonFieldRefInput<$PrismaModel>;
        gte?: InputJsonValue | JsonFieldRefInput<$PrismaModel>;
        not?:
            | InputJsonValue
            | JsonFieldRefInput<$PrismaModel>
            | JsonNullValueFilter;
        _count?: NestedIntNullableFilter<$PrismaModel>;
        _min?: NestedJsonNullableFilter<$PrismaModel>;
        _max?: NestedJsonNullableFilter<$PrismaModel>;
    };

    export type IntNullableWithAggregatesFilter<$PrismaModel = never> = {
        equals?: number | IntFieldRefInput<$PrismaModel> | null;
        in?: number[] | ListIntFieldRefInput<$PrismaModel> | null;
        notIn?: number[] | ListIntFieldRefInput<$PrismaModel> | null;
        lt?: number | IntFieldRefInput<$PrismaModel>;
        lte?: number | IntFieldRefInput<$PrismaModel>;
        gt?: number | IntFieldRefInput<$PrismaModel>;
        gte?: number | IntFieldRefInput<$PrismaModel>;
        not?:
            | NestedIntNullableWithAggregatesFilter<$PrismaModel>
            | number
            | null;
        _count?: NestedIntNullableFilter<$PrismaModel>;
        _avg?: NestedFloatNullableFilter<$PrismaModel>;
        _sum?: NestedIntNullableFilter<$PrismaModel>;
        _min?: NestedIntNullableFilter<$PrismaModel>;
        _max?: NestedIntNullableFilter<$PrismaModel>;
    };

    export type StringNullableListFilter<$PrismaModel = never> = {
        equals?: string[] | ListStringFieldRefInput<$PrismaModel> | null;
        has?: string | StringFieldRefInput<$PrismaModel> | null;
        hasEvery?: string[] | ListStringFieldRefInput<$PrismaModel>;
        hasSome?: string[] | ListStringFieldRefInput<$PrismaModel>;
        isEmpty?: boolean;
    };

    export type DonatedItemScalarRelationFilter = {
        is?: DonatedItemWhereInput;
        isNot?: DonatedItemWhereInput;
    };

    export type DonatedItemStatusCountOrderByAggregateInput = {
        id?: SortOrder;
        dateModified?: SortOrder;
        statusType?: SortOrder;
        donatedItemId?: SortOrder;
        imageUrls?: SortOrder;
        donorInformed?: SortOrder;
        approval?: SortOrder;
        submitter?: SortOrder;
    };

    export type DonatedItemStatusAvgOrderByAggregateInput = {
        id?: SortOrder;
        donatedItemId?: SortOrder;
    };

    export type DonatedItemStatusMaxOrderByAggregateInput = {
        id?: SortOrder;
        dateModified?: SortOrder;
        statusType?: SortOrder;
        donatedItemId?: SortOrder;
        donorInformed?: SortOrder;
        approval?: SortOrder;
        submitter?: SortOrder;
    };

    export type DonatedItemStatusMinOrderByAggregateInput = {
        id?: SortOrder;
        dateModified?: SortOrder;
        statusType?: SortOrder;
        donatedItemId?: SortOrder;
        donorInformed?: SortOrder;
        approval?: SortOrder;
        submitter?: SortOrder;
    };

    export type DonatedItemStatusSumOrderByAggregateInput = {
        id?: SortOrder;
        donatedItemId?: SortOrder;
    };

    export type EnumRoleNullableFilter<$PrismaModel = never> = {
        equals?: $Enums.Role | EnumRoleFieldRefInput<$PrismaModel> | null;
        in?: $Enums.Role[] | ListEnumRoleFieldRefInput<$PrismaModel> | null;
        notIn?: $Enums.Role[] | ListEnumRoleFieldRefInput<$PrismaModel> | null;
        not?: NestedEnumRoleNullableFilter<$PrismaModel> | $Enums.Role | null;
    };

    export type EnumUserStatusFilter<$PrismaModel = never> = {
        equals?: $Enums.UserStatus | EnumUserStatusFieldRefInput<$PrismaModel>;
        in?:
            | $Enums.UserStatus[]
            | ListEnumUserStatusFieldRefInput<$PrismaModel>;
        notIn?:
            | $Enums.UserStatus[]
            | ListEnumUserStatusFieldRefInput<$PrismaModel>;
        not?: NestedEnumUserStatusFilter<$PrismaModel> | $Enums.UserStatus;
    };

    export type DateTimeNullableFilter<$PrismaModel = never> = {
        equals?: Date | string | DateTimeFieldRefInput<$PrismaModel> | null;
        in?: Date[] | string[] | ListDateTimeFieldRefInput<$PrismaModel> | null;
        notIn?:
            | Date[]
            | string[]
            | ListDateTimeFieldRefInput<$PrismaModel>
            | null;
        lt?: Date | string | DateTimeFieldRefInput<$PrismaModel>;
        lte?: Date | string | DateTimeFieldRefInput<$PrismaModel>;
        gt?: Date | string | DateTimeFieldRefInput<$PrismaModel>;
        gte?: Date | string | DateTimeFieldRefInput<$PrismaModel>;
        not?: NestedDateTimeNullableFilter<$PrismaModel> | Date | string | null;
    };

    export type UserCountOrderByAggregateInput = {
        id?: SortOrder;
        name?: SortOrder;
        email?: SortOrder;
        password?: SortOrder;
        role?: SortOrder;
        status?: SortOrder;
        createdAt?: SortOrder;
        firstLogin?: SortOrder;
        resetToken?: SortOrder;
        resetTokenExpiry?: SortOrder;
    };

    export type UserMaxOrderByAggregateInput = {
        id?: SortOrder;
        name?: SortOrder;
        email?: SortOrder;
        password?: SortOrder;
        role?: SortOrder;
        status?: SortOrder;
        createdAt?: SortOrder;
        firstLogin?: SortOrder;
        resetToken?: SortOrder;
        resetTokenExpiry?: SortOrder;
    };

    export type UserMinOrderByAggregateInput = {
        id?: SortOrder;
        name?: SortOrder;
        email?: SortOrder;
        password?: SortOrder;
        role?: SortOrder;
        status?: SortOrder;
        createdAt?: SortOrder;
        firstLogin?: SortOrder;
        resetToken?: SortOrder;
        resetTokenExpiry?: SortOrder;
    };

    export type EnumRoleNullableWithAggregatesFilter<$PrismaModel = never> = {
        equals?: $Enums.Role | EnumRoleFieldRefInput<$PrismaModel> | null;
        in?: $Enums.Role[] | ListEnumRoleFieldRefInput<$PrismaModel> | null;
        notIn?: $Enums.Role[] | ListEnumRoleFieldRefInput<$PrismaModel> | null;
        not?:
            | NestedEnumRoleNullableWithAggregatesFilter<$PrismaModel>
            | $Enums.Role
            | null;
        _count?: NestedIntNullableFilter<$PrismaModel>;
        _min?: NestedEnumRoleNullableFilter<$PrismaModel>;
        _max?: NestedEnumRoleNullableFilter<$PrismaModel>;
    };

    export type EnumUserStatusWithAggregatesFilter<$PrismaModel = never> = {
        equals?: $Enums.UserStatus | EnumUserStatusFieldRefInput<$PrismaModel>;
        in?:
            | $Enums.UserStatus[]
            | ListEnumUserStatusFieldRefInput<$PrismaModel>;
        notIn?:
            | $Enums.UserStatus[]
            | ListEnumUserStatusFieldRefInput<$PrismaModel>;
        not?:
            | NestedEnumUserStatusWithAggregatesFilter<$PrismaModel>
            | $Enums.UserStatus;
        _count?: NestedIntFilter<$PrismaModel>;
        _min?: NestedEnumUserStatusFilter<$PrismaModel>;
        _max?: NestedEnumUserStatusFilter<$PrismaModel>;
    };

    export type DateTimeNullableWithAggregatesFilter<$PrismaModel = never> = {
        equals?: Date | string | DateTimeFieldRefInput<$PrismaModel> | null;
        in?: Date[] | string[] | ListDateTimeFieldRefInput<$PrismaModel> | null;
        notIn?:
            | Date[]
            | string[]
            | ListDateTimeFieldRefInput<$PrismaModel>
            | null;
        lt?: Date | string | DateTimeFieldRefInput<$PrismaModel>;
        lte?: Date | string | DateTimeFieldRefInput<$PrismaModel>;
        gt?: Date | string | DateTimeFieldRefInput<$PrismaModel>;
        gte?: Date | string | DateTimeFieldRefInput<$PrismaModel>;
        not?:
            | NestedDateTimeNullableWithAggregatesFilter<$PrismaModel>
            | Date
            | string
            | null;
        _count?: NestedIntNullableFilter<$PrismaModel>;
        _min?: NestedDateTimeNullableFilter<$PrismaModel>;
        _max?: NestedDateTimeNullableFilter<$PrismaModel>;
    };

    export type DonatedItemCreateNestedManyWithoutDonorInput = {
        create?:
            | XOR<
                  DonatedItemCreateWithoutDonorInput,
                  DonatedItemUncheckedCreateWithoutDonorInput
              >
            | DonatedItemCreateWithoutDonorInput[]
            | DonatedItemUncheckedCreateWithoutDonorInput[];
        connectOrCreate?:
            | DonatedItemCreateOrConnectWithoutDonorInput
            | DonatedItemCreateOrConnectWithoutDonorInput[];
        createMany?: DonatedItemCreateManyDonorInputEnvelope;
        connect?: DonatedItemWhereUniqueInput | DonatedItemWhereUniqueInput[];
    };

    export type DonatedItemUncheckedCreateNestedManyWithoutDonorInput = {
        create?:
            | XOR<
                  DonatedItemCreateWithoutDonorInput,
                  DonatedItemUncheckedCreateWithoutDonorInput
              >
            | DonatedItemCreateWithoutDonorInput[]
            | DonatedItemUncheckedCreateWithoutDonorInput[];
        connectOrCreate?:
            | DonatedItemCreateOrConnectWithoutDonorInput
            | DonatedItemCreateOrConnectWithoutDonorInput[];
        createMany?: DonatedItemCreateManyDonorInputEnvelope;
        connect?: DonatedItemWhereUniqueInput | DonatedItemWhereUniqueInput[];
    };

    export type StringFieldUpdateOperationsInput = {
        set?: string;
    };

    export type NullableStringFieldUpdateOperationsInput = {
        set?: string | null;
    };

    export type BoolFieldUpdateOperationsInput = {
        set?: boolean;
    };

    export type DonatedItemUpdateManyWithoutDonorNestedInput = {
        create?:
            | XOR<
                  DonatedItemCreateWithoutDonorInput,
                  DonatedItemUncheckedCreateWithoutDonorInput
              >
            | DonatedItemCreateWithoutDonorInput[]
            | DonatedItemUncheckedCreateWithoutDonorInput[];
        connectOrCreate?:
            | DonatedItemCreateOrConnectWithoutDonorInput
            | DonatedItemCreateOrConnectWithoutDonorInput[];
        upsert?:
            | DonatedItemUpsertWithWhereUniqueWithoutDonorInput
            | DonatedItemUpsertWithWhereUniqueWithoutDonorInput[];
        createMany?: DonatedItemCreateManyDonorInputEnvelope;
        set?: DonatedItemWhereUniqueInput | DonatedItemWhereUniqueInput[];
        disconnect?:
            | DonatedItemWhereUniqueInput
            | DonatedItemWhereUniqueInput[];
        delete?: DonatedItemWhereUniqueInput | DonatedItemWhereUniqueInput[];
        connect?: DonatedItemWhereUniqueInput | DonatedItemWhereUniqueInput[];
        update?:
            | DonatedItemUpdateWithWhereUniqueWithoutDonorInput
            | DonatedItemUpdateWithWhereUniqueWithoutDonorInput[];
        updateMany?:
            | DonatedItemUpdateManyWithWhereWithoutDonorInput
            | DonatedItemUpdateManyWithWhereWithoutDonorInput[];
        deleteMany?:
            | DonatedItemScalarWhereInput
            | DonatedItemScalarWhereInput[];
    };

    export type IntFieldUpdateOperationsInput = {
        set?: number;
        increment?: number;
        decrement?: number;
        multiply?: number;
        divide?: number;
    };

    export type DonatedItemUncheckedUpdateManyWithoutDonorNestedInput = {
        create?:
            | XOR<
                  DonatedItemCreateWithoutDonorInput,
                  DonatedItemUncheckedCreateWithoutDonorInput
              >
            | DonatedItemCreateWithoutDonorInput[]
            | DonatedItemUncheckedCreateWithoutDonorInput[];
        connectOrCreate?:
            | DonatedItemCreateOrConnectWithoutDonorInput
            | DonatedItemCreateOrConnectWithoutDonorInput[];
        upsert?:
            | DonatedItemUpsertWithWhereUniqueWithoutDonorInput
            | DonatedItemUpsertWithWhereUniqueWithoutDonorInput[];
        createMany?: DonatedItemCreateManyDonorInputEnvelope;
        set?: DonatedItemWhereUniqueInput | DonatedItemWhereUniqueInput[];
        disconnect?:
            | DonatedItemWhereUniqueInput
            | DonatedItemWhereUniqueInput[];
        delete?: DonatedItemWhereUniqueInput | DonatedItemWhereUniqueInput[];
        connect?: DonatedItemWhereUniqueInput | DonatedItemWhereUniqueInput[];
        update?:
            | DonatedItemUpdateWithWhereUniqueWithoutDonorInput
            | DonatedItemUpdateWithWhereUniqueWithoutDonorInput[];
        updateMany?:
            | DonatedItemUpdateManyWithWhereWithoutDonorInput
            | DonatedItemUpdateManyWithWhereWithoutDonorInput[];
        deleteMany?:
            | DonatedItemScalarWhereInput
            | DonatedItemScalarWhereInput[];
    };

    export type DonatedItemCreateNestedManyWithoutProgramInput = {
        create?:
            | XOR<
                  DonatedItemCreateWithoutProgramInput,
                  DonatedItemUncheckedCreateWithoutProgramInput
              >
            | DonatedItemCreateWithoutProgramInput[]
            | DonatedItemUncheckedCreateWithoutProgramInput[];
        connectOrCreate?:
            | DonatedItemCreateOrConnectWithoutProgramInput
            | DonatedItemCreateOrConnectWithoutProgramInput[];
        createMany?: DonatedItemCreateManyProgramInputEnvelope;
        connect?: DonatedItemWhereUniqueInput | DonatedItemWhereUniqueInput[];
    };

    export type DonatedItemUncheckedCreateNestedManyWithoutProgramInput = {
        create?:
            | XOR<
                  DonatedItemCreateWithoutProgramInput,
                  DonatedItemUncheckedCreateWithoutProgramInput
              >
            | DonatedItemCreateWithoutProgramInput[]
            | DonatedItemUncheckedCreateWithoutProgramInput[];
        connectOrCreate?:
            | DonatedItemCreateOrConnectWithoutProgramInput
            | DonatedItemCreateOrConnectWithoutProgramInput[];
        createMany?: DonatedItemCreateManyProgramInputEnvelope;
        connect?: DonatedItemWhereUniqueInput | DonatedItemWhereUniqueInput[];
    };

    export type DateTimeFieldUpdateOperationsInput = {
        set?: Date | string;
    };

    export type DonatedItemUpdateManyWithoutProgramNestedInput = {
        create?:
            | XOR<
                  DonatedItemCreateWithoutProgramInput,
                  DonatedItemUncheckedCreateWithoutProgramInput
              >
            | DonatedItemCreateWithoutProgramInput[]
            | DonatedItemUncheckedCreateWithoutProgramInput[];
        connectOrCreate?:
            | DonatedItemCreateOrConnectWithoutProgramInput
            | DonatedItemCreateOrConnectWithoutProgramInput[];
        upsert?:
            | DonatedItemUpsertWithWhereUniqueWithoutProgramInput
            | DonatedItemUpsertWithWhereUniqueWithoutProgramInput[];
        createMany?: DonatedItemCreateManyProgramInputEnvelope;
        set?: DonatedItemWhereUniqueInput | DonatedItemWhereUniqueInput[];
        disconnect?:
            | DonatedItemWhereUniqueInput
            | DonatedItemWhereUniqueInput[];
        delete?: DonatedItemWhereUniqueInput | DonatedItemWhereUniqueInput[];
        connect?: DonatedItemWhereUniqueInput | DonatedItemWhereUniqueInput[];
        update?:
            | DonatedItemUpdateWithWhereUniqueWithoutProgramInput
            | DonatedItemUpdateWithWhereUniqueWithoutProgramInput[];
        updateMany?:
            | DonatedItemUpdateManyWithWhereWithoutProgramInput
            | DonatedItemUpdateManyWithWhereWithoutProgramInput[];
        deleteMany?:
            | DonatedItemScalarWhereInput
            | DonatedItemScalarWhereInput[];
    };

    export type DonatedItemUncheckedUpdateManyWithoutProgramNestedInput = {
        create?:
            | XOR<
                  DonatedItemCreateWithoutProgramInput,
                  DonatedItemUncheckedCreateWithoutProgramInput
              >
            | DonatedItemCreateWithoutProgramInput[]
            | DonatedItemUncheckedCreateWithoutProgramInput[];
        connectOrCreate?:
            | DonatedItemCreateOrConnectWithoutProgramInput
            | DonatedItemCreateOrConnectWithoutProgramInput[];
        upsert?:
            | DonatedItemUpsertWithWhereUniqueWithoutProgramInput
            | DonatedItemUpsertWithWhereUniqueWithoutProgramInput[];
        createMany?: DonatedItemCreateManyProgramInputEnvelope;
        set?: DonatedItemWhereUniqueInput | DonatedItemWhereUniqueInput[];
        disconnect?:
            | DonatedItemWhereUniqueInput
            | DonatedItemWhereUniqueInput[];
        delete?: DonatedItemWhereUniqueInput | DonatedItemWhereUniqueInput[];
        connect?: DonatedItemWhereUniqueInput | DonatedItemWhereUniqueInput[];
        update?:
            | DonatedItemUpdateWithWhereUniqueWithoutProgramInput
            | DonatedItemUpdateWithWhereUniqueWithoutProgramInput[];
        updateMany?:
            | DonatedItemUpdateManyWithWhereWithoutProgramInput
            | DonatedItemUpdateManyWithWhereWithoutProgramInput[];
        deleteMany?:
            | DonatedItemScalarWhereInput
            | DonatedItemScalarWhereInput[];
    };

    export type DonorCreateNestedOneWithoutDonatedItemsInput = {
        create?: XOR<
            DonorCreateWithoutDonatedItemsInput,
            DonorUncheckedCreateWithoutDonatedItemsInput
        >;
        connectOrCreate?: DonorCreateOrConnectWithoutDonatedItemsInput;
        connect?: DonorWhereUniqueInput;
    };

    export type ProgramCreateNestedOneWithoutDonatedItemsInput = {
        create?: XOR<
            ProgramCreateWithoutDonatedItemsInput,
            ProgramUncheckedCreateWithoutDonatedItemsInput
        >;
        connectOrCreate?: ProgramCreateOrConnectWithoutDonatedItemsInput;
        connect?: ProgramWhereUniqueInput;
    };

    export type DonatedItemStatusCreateNestedManyWithoutDonatedItemInput = {
        create?:
            | XOR<
                  DonatedItemStatusCreateWithoutDonatedItemInput,
                  DonatedItemStatusUncheckedCreateWithoutDonatedItemInput
              >
            | DonatedItemStatusCreateWithoutDonatedItemInput[]
            | DonatedItemStatusUncheckedCreateWithoutDonatedItemInput[];
        connectOrCreate?:
            | DonatedItemStatusCreateOrConnectWithoutDonatedItemInput
            | DonatedItemStatusCreateOrConnectWithoutDonatedItemInput[];
        createMany?: DonatedItemStatusCreateManyDonatedItemInputEnvelope;
        connect?:
            | DonatedItemStatusWhereUniqueInput
            | DonatedItemStatusWhereUniqueInput[];
    };

    export type DonatedItemStatusUncheckedCreateNestedManyWithoutDonatedItemInput =
        {
            create?:
                | XOR<
                      DonatedItemStatusCreateWithoutDonatedItemInput,
                      DonatedItemStatusUncheckedCreateWithoutDonatedItemInput
                  >
                | DonatedItemStatusCreateWithoutDonatedItemInput[]
                | DonatedItemStatusUncheckedCreateWithoutDonatedItemInput[];
            connectOrCreate?:
                | DonatedItemStatusCreateOrConnectWithoutDonatedItemInput
                | DonatedItemStatusCreateOrConnectWithoutDonatedItemInput[];
            createMany?: DonatedItemStatusCreateManyDonatedItemInputEnvelope;
            connect?:
                | DonatedItemStatusWhereUniqueInput
                | DonatedItemStatusWhereUniqueInput[];
        };

    export type DonorUpdateOneRequiredWithoutDonatedItemsNestedInput = {
        create?: XOR<
            DonorCreateWithoutDonatedItemsInput,
            DonorUncheckedCreateWithoutDonatedItemsInput
        >;
        connectOrCreate?: DonorCreateOrConnectWithoutDonatedItemsInput;
        upsert?: DonorUpsertWithoutDonatedItemsInput;
        connect?: DonorWhereUniqueInput;
        update?: XOR<
            XOR<
                DonorUpdateToOneWithWhereWithoutDonatedItemsInput,
                DonorUpdateWithoutDonatedItemsInput
            >,
            DonorUncheckedUpdateWithoutDonatedItemsInput
        >;
    };

    export type ProgramUpdateOneWithoutDonatedItemsNestedInput = {
        create?: XOR<
            ProgramCreateWithoutDonatedItemsInput,
            ProgramUncheckedCreateWithoutDonatedItemsInput
        >;
        connectOrCreate?: ProgramCreateOrConnectWithoutDonatedItemsInput;
        upsert?: ProgramUpsertWithoutDonatedItemsInput;
        disconnect?: ProgramWhereInput | boolean;
        delete?: ProgramWhereInput | boolean;
        connect?: ProgramWhereUniqueInput;
        update?: XOR<
            XOR<
                ProgramUpdateToOneWithWhereWithoutDonatedItemsInput,
                ProgramUpdateWithoutDonatedItemsInput
            >,
            ProgramUncheckedUpdateWithoutDonatedItemsInput
        >;
    };

    export type DonatedItemStatusUpdateManyWithoutDonatedItemNestedInput = {
        create?:
            | XOR<
                  DonatedItemStatusCreateWithoutDonatedItemInput,
                  DonatedItemStatusUncheckedCreateWithoutDonatedItemInput
              >
            | DonatedItemStatusCreateWithoutDonatedItemInput[]
            | DonatedItemStatusUncheckedCreateWithoutDonatedItemInput[];
        connectOrCreate?:
            | DonatedItemStatusCreateOrConnectWithoutDonatedItemInput
            | DonatedItemStatusCreateOrConnectWithoutDonatedItemInput[];
        upsert?:
            | DonatedItemStatusUpsertWithWhereUniqueWithoutDonatedItemInput
            | DonatedItemStatusUpsertWithWhereUniqueWithoutDonatedItemInput[];
        createMany?: DonatedItemStatusCreateManyDonatedItemInputEnvelope;
        set?:
            | DonatedItemStatusWhereUniqueInput
            | DonatedItemStatusWhereUniqueInput[];
        disconnect?:
            | DonatedItemStatusWhereUniqueInput
            | DonatedItemStatusWhereUniqueInput[];
        delete?:
            | DonatedItemStatusWhereUniqueInput
            | DonatedItemStatusWhereUniqueInput[];
        connect?:
            | DonatedItemStatusWhereUniqueInput
            | DonatedItemStatusWhereUniqueInput[];
        update?:
            | DonatedItemStatusUpdateWithWhereUniqueWithoutDonatedItemInput
            | DonatedItemStatusUpdateWithWhereUniqueWithoutDonatedItemInput[];
        updateMany?:
            | DonatedItemStatusUpdateManyWithWhereWithoutDonatedItemInput
            | DonatedItemStatusUpdateManyWithWhereWithoutDonatedItemInput[];
        deleteMany?:
            | DonatedItemStatusScalarWhereInput
            | DonatedItemStatusScalarWhereInput[];
    };

    export type NullableIntFieldUpdateOperationsInput = {
        set?: number | null;
        increment?: number;
        decrement?: number;
        multiply?: number;
        divide?: number;
    };

    export type DonatedItemStatusUncheckedUpdateManyWithoutDonatedItemNestedInput =
        {
            create?:
                | XOR<
                      DonatedItemStatusCreateWithoutDonatedItemInput,
                      DonatedItemStatusUncheckedCreateWithoutDonatedItemInput
                  >
                | DonatedItemStatusCreateWithoutDonatedItemInput[]
                | DonatedItemStatusUncheckedCreateWithoutDonatedItemInput[];
            connectOrCreate?:
                | DonatedItemStatusCreateOrConnectWithoutDonatedItemInput
                | DonatedItemStatusCreateOrConnectWithoutDonatedItemInput[];
            upsert?:
                | DonatedItemStatusUpsertWithWhereUniqueWithoutDonatedItemInput
                | DonatedItemStatusUpsertWithWhereUniqueWithoutDonatedItemInput[];
            createMany?: DonatedItemStatusCreateManyDonatedItemInputEnvelope;
            set?:
                | DonatedItemStatusWhereUniqueInput
                | DonatedItemStatusWhereUniqueInput[];
            disconnect?:
                | DonatedItemStatusWhereUniqueInput
                | DonatedItemStatusWhereUniqueInput[];
            delete?:
                | DonatedItemStatusWhereUniqueInput
                | DonatedItemStatusWhereUniqueInput[];
            connect?:
                | DonatedItemStatusWhereUniqueInput
                | DonatedItemStatusWhereUniqueInput[];
            update?:
                | DonatedItemStatusUpdateWithWhereUniqueWithoutDonatedItemInput
                | DonatedItemStatusUpdateWithWhereUniqueWithoutDonatedItemInput[];
            updateMany?:
                | DonatedItemStatusUpdateManyWithWhereWithoutDonatedItemInput
                | DonatedItemStatusUpdateManyWithWhereWithoutDonatedItemInput[];
            deleteMany?:
                | DonatedItemStatusScalarWhereInput
                | DonatedItemStatusScalarWhereInput[];
        };

    export type DonatedItemStatusCreateimageUrlsInput = {
        set: string[];
    };

    export type DonatedItemCreateNestedOneWithoutStatusesInput = {
        create?: XOR<
            DonatedItemCreateWithoutStatusesInput,
            DonatedItemUncheckedCreateWithoutStatusesInput
        >;
        connectOrCreate?: DonatedItemCreateOrConnectWithoutStatusesInput;
        connect?: DonatedItemWhereUniqueInput;
    };

    export type DonatedItemStatusUpdateimageUrlsInput = {
        set?: string[];
        push?: string | string[];
    };

    export type DonatedItemUpdateOneRequiredWithoutStatusesNestedInput = {
        create?: XOR<
            DonatedItemCreateWithoutStatusesInput,
            DonatedItemUncheckedCreateWithoutStatusesInput
        >;
        connectOrCreate?: DonatedItemCreateOrConnectWithoutStatusesInput;
        upsert?: DonatedItemUpsertWithoutStatusesInput;
        connect?: DonatedItemWhereUniqueInput;
        update?: XOR<
            XOR<
                DonatedItemUpdateToOneWithWhereWithoutStatusesInput,
                DonatedItemUpdateWithoutStatusesInput
            >,
            DonatedItemUncheckedUpdateWithoutStatusesInput
        >;
    };

    export type NullableEnumRoleFieldUpdateOperationsInput = {
        set?: $Enums.Role | null;
    };

    export type EnumUserStatusFieldUpdateOperationsInput = {
        set?: $Enums.UserStatus;
    };

    export type NullableDateTimeFieldUpdateOperationsInput = {
        set?: Date | string | null;
    };

    export type NestedIntFilter<$PrismaModel = never> = {
        equals?: number | IntFieldRefInput<$PrismaModel>;
        in?: number[] | ListIntFieldRefInput<$PrismaModel>;
        notIn?: number[] | ListIntFieldRefInput<$PrismaModel>;
        lt?: number | IntFieldRefInput<$PrismaModel>;
        lte?: number | IntFieldRefInput<$PrismaModel>;
        gt?: number | IntFieldRefInput<$PrismaModel>;
        gte?: number | IntFieldRefInput<$PrismaModel>;
        not?: NestedIntFilter<$PrismaModel> | number;
    };

    export type NestedStringFilter<$PrismaModel = never> = {
        equals?: string | StringFieldRefInput<$PrismaModel>;
        in?: string[] | ListStringFieldRefInput<$PrismaModel>;
        notIn?: string[] | ListStringFieldRefInput<$PrismaModel>;
        lt?: string | StringFieldRefInput<$PrismaModel>;
        lte?: string | StringFieldRefInput<$PrismaModel>;
        gt?: string | StringFieldRefInput<$PrismaModel>;
        gte?: string | StringFieldRefInput<$PrismaModel>;
        contains?: string | StringFieldRefInput<$PrismaModel>;
        startsWith?: string | StringFieldRefInput<$PrismaModel>;
        endsWith?: string | StringFieldRefInput<$PrismaModel>;
        not?: NestedStringFilter<$PrismaModel> | string;
    };

    export type NestedStringNullableFilter<$PrismaModel = never> = {
        equals?: string | StringFieldRefInput<$PrismaModel> | null;
        in?: string[] | ListStringFieldRefInput<$PrismaModel> | null;
        notIn?: string[] | ListStringFieldRefInput<$PrismaModel> | null;
        lt?: string | StringFieldRefInput<$PrismaModel>;
        lte?: string | StringFieldRefInput<$PrismaModel>;
        gt?: string | StringFieldRefInput<$PrismaModel>;
        gte?: string | StringFieldRefInput<$PrismaModel>;
        contains?: string | StringFieldRefInput<$PrismaModel>;
        startsWith?: string | StringFieldRefInput<$PrismaModel>;
        endsWith?: string | StringFieldRefInput<$PrismaModel>;
        not?: NestedStringNullableFilter<$PrismaModel> | string | null;
    };

    export type NestedBoolFilter<$PrismaModel = never> = {
        equals?: boolean | BooleanFieldRefInput<$PrismaModel>;
        not?: NestedBoolFilter<$PrismaModel> | boolean;
    };

    export type NestedIntWithAggregatesFilter<$PrismaModel = never> = {
        equals?: number | IntFieldRefInput<$PrismaModel>;
        in?: number[] | ListIntFieldRefInput<$PrismaModel>;
        notIn?: number[] | ListIntFieldRefInput<$PrismaModel>;
        lt?: number | IntFieldRefInput<$PrismaModel>;
        lte?: number | IntFieldRefInput<$PrismaModel>;
        gt?: number | IntFieldRefInput<$PrismaModel>;
        gte?: number | IntFieldRefInput<$PrismaModel>;
        not?: NestedIntWithAggregatesFilter<$PrismaModel> | number;
        _count?: NestedIntFilter<$PrismaModel>;
        _avg?: NestedFloatFilter<$PrismaModel>;
        _sum?: NestedIntFilter<$PrismaModel>;
        _min?: NestedIntFilter<$PrismaModel>;
        _max?: NestedIntFilter<$PrismaModel>;
    };

    export type NestedFloatFilter<$PrismaModel = never> = {
        equals?: number | FloatFieldRefInput<$PrismaModel>;
        in?: number[] | ListFloatFieldRefInput<$PrismaModel>;
        notIn?: number[] | ListFloatFieldRefInput<$PrismaModel>;
        lt?: number | FloatFieldRefInput<$PrismaModel>;
        lte?: number | FloatFieldRefInput<$PrismaModel>;
        gt?: number | FloatFieldRefInput<$PrismaModel>;
        gte?: number | FloatFieldRefInput<$PrismaModel>;
        not?: NestedFloatFilter<$PrismaModel> | number;
    };

    export type NestedStringWithAggregatesFilter<$PrismaModel = never> = {
        equals?: string | StringFieldRefInput<$PrismaModel>;
        in?: string[] | ListStringFieldRefInput<$PrismaModel>;
        notIn?: string[] | ListStringFieldRefInput<$PrismaModel>;
        lt?: string | StringFieldRefInput<$PrismaModel>;
        lte?: string | StringFieldRefInput<$PrismaModel>;
        gt?: string | StringFieldRefInput<$PrismaModel>;
        gte?: string | StringFieldRefInput<$PrismaModel>;
        contains?: string | StringFieldRefInput<$PrismaModel>;
        startsWith?: string | StringFieldRefInput<$PrismaModel>;
        endsWith?: string | StringFieldRefInput<$PrismaModel>;
        not?: NestedStringWithAggregatesFilter<$PrismaModel> | string;
        _count?: NestedIntFilter<$PrismaModel>;
        _min?: NestedStringFilter<$PrismaModel>;
        _max?: NestedStringFilter<$PrismaModel>;
    };

    export type NestedStringNullableWithAggregatesFilter<$PrismaModel = never> =
        {
            equals?: string | StringFieldRefInput<$PrismaModel> | null;
            in?: string[] | ListStringFieldRefInput<$PrismaModel> | null;
            notIn?: string[] | ListStringFieldRefInput<$PrismaModel> | null;
            lt?: string | StringFieldRefInput<$PrismaModel>;
            lte?: string | StringFieldRefInput<$PrismaModel>;
            gt?: string | StringFieldRefInput<$PrismaModel>;
            gte?: string | StringFieldRefInput<$PrismaModel>;
            contains?: string | StringFieldRefInput<$PrismaModel>;
            startsWith?: string | StringFieldRefInput<$PrismaModel>;
            endsWith?: string | StringFieldRefInput<$PrismaModel>;
            not?:
                | NestedStringNullableWithAggregatesFilter<$PrismaModel>
                | string
                | null;
            _count?: NestedIntNullableFilter<$PrismaModel>;
            _min?: NestedStringNullableFilter<$PrismaModel>;
            _max?: NestedStringNullableFilter<$PrismaModel>;
        };

    export type NestedIntNullableFilter<$PrismaModel = never> = {
        equals?: number | IntFieldRefInput<$PrismaModel> | null;
        in?: number[] | ListIntFieldRefInput<$PrismaModel> | null;
        notIn?: number[] | ListIntFieldRefInput<$PrismaModel> | null;
        lt?: number | IntFieldRefInput<$PrismaModel>;
        lte?: number | IntFieldRefInput<$PrismaModel>;
        gt?: number | IntFieldRefInput<$PrismaModel>;
        gte?: number | IntFieldRefInput<$PrismaModel>;
        not?: NestedIntNullableFilter<$PrismaModel> | number | null;
    };

    export type NestedBoolWithAggregatesFilter<$PrismaModel = never> = {
        equals?: boolean | BooleanFieldRefInput<$PrismaModel>;
        not?: NestedBoolWithAggregatesFilter<$PrismaModel> | boolean;
        _count?: NestedIntFilter<$PrismaModel>;
        _min?: NestedBoolFilter<$PrismaModel>;
        _max?: NestedBoolFilter<$PrismaModel>;
    };

    export type NestedDateTimeFilter<$PrismaModel = never> = {
        equals?: Date | string | DateTimeFieldRefInput<$PrismaModel>;
        in?: Date[] | string[] | ListDateTimeFieldRefInput<$PrismaModel>;
        notIn?: Date[] | string[] | ListDateTimeFieldRefInput<$PrismaModel>;
        lt?: Date | string | DateTimeFieldRefInput<$PrismaModel>;
        lte?: Date | string | DateTimeFieldRefInput<$PrismaModel>;
        gt?: Date | string | DateTimeFieldRefInput<$PrismaModel>;
        gte?: Date | string | DateTimeFieldRefInput<$PrismaModel>;
        not?: NestedDateTimeFilter<$PrismaModel> | Date | string;
    };

    export type NestedDateTimeWithAggregatesFilter<$PrismaModel = never> = {
        equals?: Date | string | DateTimeFieldRefInput<$PrismaModel>;
        in?: Date[] | string[] | ListDateTimeFieldRefInput<$PrismaModel>;
        notIn?: Date[] | string[] | ListDateTimeFieldRefInput<$PrismaModel>;
        lt?: Date | string | DateTimeFieldRefInput<$PrismaModel>;
        lte?: Date | string | DateTimeFieldRefInput<$PrismaModel>;
        gt?: Date | string | DateTimeFieldRefInput<$PrismaModel>;
        gte?: Date | string | DateTimeFieldRefInput<$PrismaModel>;
        not?: NestedDateTimeWithAggregatesFilter<$PrismaModel> | Date | string;
        _count?: NestedIntFilter<$PrismaModel>;
        _min?: NestedDateTimeFilter<$PrismaModel>;
        _max?: NestedDateTimeFilter<$PrismaModel>;
    };
    export type NestedJsonNullableFilter<$PrismaModel = never> =
        | PatchUndefined<
              Either<
                  Required<NestedJsonNullableFilterBase<$PrismaModel>>,
                  Exclude<
                      keyof Required<
                          NestedJsonNullableFilterBase<$PrismaModel>
                      >,
                      'path'
                  >
              >,
              Required<NestedJsonNullableFilterBase<$PrismaModel>>
          >
        | OptionalFlat<
              Omit<Required<NestedJsonNullableFilterBase<$PrismaModel>>, 'path'>
          >;

    export type NestedJsonNullableFilterBase<$PrismaModel = never> = {
        equals?:
            | InputJsonValue
            | JsonFieldRefInput<$PrismaModel>
            | JsonNullValueFilter;
        path?: string[];
        mode?: QueryMode | EnumQueryModeFieldRefInput<$PrismaModel>;
        string_contains?: string | StringFieldRefInput<$PrismaModel>;
        string_starts_with?: string | StringFieldRefInput<$PrismaModel>;
        string_ends_with?: string | StringFieldRefInput<$PrismaModel>;
        array_starts_with?:
            | InputJsonValue
            | JsonFieldRefInput<$PrismaModel>
            | null;
        array_ends_with?:
            | InputJsonValue
            | JsonFieldRefInput<$PrismaModel>
            | null;
        array_contains?:
            | InputJsonValue
            | JsonFieldRefInput<$PrismaModel>
            | null;
        lt?: InputJsonValue | JsonFieldRefInput<$PrismaModel>;
        lte?: InputJsonValue | JsonFieldRefInput<$PrismaModel>;
        gt?: InputJsonValue | JsonFieldRefInput<$PrismaModel>;
        gte?: InputJsonValue | JsonFieldRefInput<$PrismaModel>;
        not?:
            | InputJsonValue
            | JsonFieldRefInput<$PrismaModel>
            | JsonNullValueFilter;
    };

    export type NestedIntNullableWithAggregatesFilter<$PrismaModel = never> = {
        equals?: number | IntFieldRefInput<$PrismaModel> | null;
        in?: number[] | ListIntFieldRefInput<$PrismaModel> | null;
        notIn?: number[] | ListIntFieldRefInput<$PrismaModel> | null;
        lt?: number | IntFieldRefInput<$PrismaModel>;
        lte?: number | IntFieldRefInput<$PrismaModel>;
        gt?: number | IntFieldRefInput<$PrismaModel>;
        gte?: number | IntFieldRefInput<$PrismaModel>;
        not?:
            | NestedIntNullableWithAggregatesFilter<$PrismaModel>
            | number
            | null;
        _count?: NestedIntNullableFilter<$PrismaModel>;
        _avg?: NestedFloatNullableFilter<$PrismaModel>;
        _sum?: NestedIntNullableFilter<$PrismaModel>;
        _min?: NestedIntNullableFilter<$PrismaModel>;
        _max?: NestedIntNullableFilter<$PrismaModel>;
    };

    export type NestedFloatNullableFilter<$PrismaModel = never> = {
        equals?: number | FloatFieldRefInput<$PrismaModel> | null;
        in?: number[] | ListFloatFieldRefInput<$PrismaModel> | null;
        notIn?: number[] | ListFloatFieldRefInput<$PrismaModel> | null;
        lt?: number | FloatFieldRefInput<$PrismaModel>;
        lte?: number | FloatFieldRefInput<$PrismaModel>;
        gt?: number | FloatFieldRefInput<$PrismaModel>;
        gte?: number | FloatFieldRefInput<$PrismaModel>;
        not?: NestedFloatNullableFilter<$PrismaModel> | number | null;
    };

    export type NestedEnumRoleNullableFilter<$PrismaModel = never> = {
        equals?: $Enums.Role | EnumRoleFieldRefInput<$PrismaModel> | null;
        in?: $Enums.Role[] | ListEnumRoleFieldRefInput<$PrismaModel> | null;
        notIn?: $Enums.Role[] | ListEnumRoleFieldRefInput<$PrismaModel> | null;
        not?: NestedEnumRoleNullableFilter<$PrismaModel> | $Enums.Role | null;
    };

    export type NestedEnumUserStatusFilter<$PrismaModel = never> = {
        equals?: $Enums.UserStatus | EnumUserStatusFieldRefInput<$PrismaModel>;
        in?:
            | $Enums.UserStatus[]
            | ListEnumUserStatusFieldRefInput<$PrismaModel>;
        notIn?:
            | $Enums.UserStatus[]
            | ListEnumUserStatusFieldRefInput<$PrismaModel>;
        not?: NestedEnumUserStatusFilter<$PrismaModel> | $Enums.UserStatus;
    };

    export type NestedDateTimeNullableFilter<$PrismaModel = never> = {
        equals?: Date | string | DateTimeFieldRefInput<$PrismaModel> | null;
        in?: Date[] | string[] | ListDateTimeFieldRefInput<$PrismaModel> | null;
        notIn?:
            | Date[]
            | string[]
            | ListDateTimeFieldRefInput<$PrismaModel>
            | null;
        lt?: Date | string | DateTimeFieldRefInput<$PrismaModel>;
        lte?: Date | string | DateTimeFieldRefInput<$PrismaModel>;
        gt?: Date | string | DateTimeFieldRefInput<$PrismaModel>;
        gte?: Date | string | DateTimeFieldRefInput<$PrismaModel>;
        not?: NestedDateTimeNullableFilter<$PrismaModel> | Date | string | null;
    };

    export type NestedEnumRoleNullableWithAggregatesFilter<
        $PrismaModel = never,
    > = {
        equals?: $Enums.Role | EnumRoleFieldRefInput<$PrismaModel> | null;
        in?: $Enums.Role[] | ListEnumRoleFieldRefInput<$PrismaModel> | null;
        notIn?: $Enums.Role[] | ListEnumRoleFieldRefInput<$PrismaModel> | null;
        not?:
            | NestedEnumRoleNullableWithAggregatesFilter<$PrismaModel>
            | $Enums.Role
            | null;
        _count?: NestedIntNullableFilter<$PrismaModel>;
        _min?: NestedEnumRoleNullableFilter<$PrismaModel>;
        _max?: NestedEnumRoleNullableFilter<$PrismaModel>;
    };

    export type NestedEnumUserStatusWithAggregatesFilter<$PrismaModel = never> =
        {
            equals?:
                | $Enums.UserStatus
                | EnumUserStatusFieldRefInput<$PrismaModel>;
            in?:
                | $Enums.UserStatus[]
                | ListEnumUserStatusFieldRefInput<$PrismaModel>;
            notIn?:
                | $Enums.UserStatus[]
                | ListEnumUserStatusFieldRefInput<$PrismaModel>;
            not?:
                | NestedEnumUserStatusWithAggregatesFilter<$PrismaModel>
                | $Enums.UserStatus;
            _count?: NestedIntFilter<$PrismaModel>;
            _min?: NestedEnumUserStatusFilter<$PrismaModel>;
            _max?: NestedEnumUserStatusFilter<$PrismaModel>;
        };

    export type NestedDateTimeNullableWithAggregatesFilter<
        $PrismaModel = never,
    > = {
        equals?: Date | string | DateTimeFieldRefInput<$PrismaModel> | null;
        in?: Date[] | string[] | ListDateTimeFieldRefInput<$PrismaModel> | null;
        notIn?:
            | Date[]
            | string[]
            | ListDateTimeFieldRefInput<$PrismaModel>
            | null;
        lt?: Date | string | DateTimeFieldRefInput<$PrismaModel>;
        lte?: Date | string | DateTimeFieldRefInput<$PrismaModel>;
        gt?: Date | string | DateTimeFieldRefInput<$PrismaModel>;
        gte?: Date | string | DateTimeFieldRefInput<$PrismaModel>;
        not?:
            | NestedDateTimeNullableWithAggregatesFilter<$PrismaModel>
            | Date
            | string
            | null;
        _count?: NestedIntNullableFilter<$PrismaModel>;
        _min?: NestedDateTimeNullableFilter<$PrismaModel>;
        _max?: NestedDateTimeNullableFilter<$PrismaModel>;
    };

    export type DonatedItemCreateWithoutDonorInput = {
        itemType: string;
        category: string;
        quantity: number;
        currentStatus: string;
        dateDonated: Date | string;
        lastUpdated?: Date | string;
        imagePath?: string | null;
        analysisMetadata?: NullableJsonNullValueInput | InputJsonValue;
        program?: ProgramCreateNestedOneWithoutDonatedItemsInput;
        statuses?: DonatedItemStatusCreateNestedManyWithoutDonatedItemInput;
    };

    export type DonatedItemUncheckedCreateWithoutDonorInput = {
        id?: number;
        itemType: string;
        category: string;
        quantity: number;
        currentStatus: string;
        dateDonated: Date | string;
        lastUpdated?: Date | string;
        imagePath?: string | null;
        analysisMetadata?: NullableJsonNullValueInput | InputJsonValue;
        programId?: number | null;
        statuses?: DonatedItemStatusUncheckedCreateNestedManyWithoutDonatedItemInput;
    };

    export type DonatedItemCreateOrConnectWithoutDonorInput = {
        where: DonatedItemWhereUniqueInput;
        create: XOR<
            DonatedItemCreateWithoutDonorInput,
            DonatedItemUncheckedCreateWithoutDonorInput
        >;
    };

    export type DonatedItemCreateManyDonorInputEnvelope = {
        data:
            | DonatedItemCreateManyDonorInput
            | DonatedItemCreateManyDonorInput[];
        skipDuplicates?: boolean;
    };

    export type DonatedItemUpsertWithWhereUniqueWithoutDonorInput = {
        where: DonatedItemWhereUniqueInput;
        update: XOR<
            DonatedItemUpdateWithoutDonorInput,
            DonatedItemUncheckedUpdateWithoutDonorInput
        >;
        create: XOR<
            DonatedItemCreateWithoutDonorInput,
            DonatedItemUncheckedCreateWithoutDonorInput
        >;
    };

    export type DonatedItemUpdateWithWhereUniqueWithoutDonorInput = {
        where: DonatedItemWhereUniqueInput;
        data: XOR<
            DonatedItemUpdateWithoutDonorInput,
            DonatedItemUncheckedUpdateWithoutDonorInput
        >;
    };

    export type DonatedItemUpdateManyWithWhereWithoutDonorInput = {
        where: DonatedItemScalarWhereInput;
        data: XOR<
            DonatedItemUpdateManyMutationInput,
            DonatedItemUncheckedUpdateManyWithoutDonorInput
        >;
    };

    export type DonatedItemScalarWhereInput = {
        AND?: DonatedItemScalarWhereInput | DonatedItemScalarWhereInput[];
        OR?: DonatedItemScalarWhereInput[];
        NOT?: DonatedItemScalarWhereInput | DonatedItemScalarWhereInput[];
        id?: IntFilter<'DonatedItem'> | number;
        itemType?: StringFilter<'DonatedItem'> | string;
        category?: StringFilter<'DonatedItem'> | string;
        quantity?: IntFilter<'DonatedItem'> | number;
        currentStatus?: StringFilter<'DonatedItem'> | string;
        dateDonated?: DateTimeFilter<'DonatedItem'> | Date | string;
        lastUpdated?: DateTimeFilter<'DonatedItem'> | Date | string;
        imagePath?: StringNullableFilter<'DonatedItem'> | string | null;
        analysisMetadata?: JsonNullableFilter<'DonatedItem'>;
        donorId?: IntFilter<'DonatedItem'> | number;
        programId?: IntNullableFilter<'DonatedItem'> | number | null;
    };

    export type DonatedItemCreateWithoutProgramInput = {
        itemType: string;
        category: string;
        quantity: number;
        currentStatus: string;
        dateDonated: Date | string;
        lastUpdated?: Date | string;
        imagePath?: string | null;
        analysisMetadata?: NullableJsonNullValueInput | InputJsonValue;
        donor: DonorCreateNestedOneWithoutDonatedItemsInput;
        statuses?: DonatedItemStatusCreateNestedManyWithoutDonatedItemInput;
    };

    export type DonatedItemUncheckedCreateWithoutProgramInput = {
        id?: number;
        itemType: string;
        category: string;
        quantity: number;
        currentStatus: string;
        dateDonated: Date | string;
        lastUpdated?: Date | string;
        imagePath?: string | null;
        analysisMetadata?: NullableJsonNullValueInput | InputJsonValue;
        donorId: number;
        statuses?: DonatedItemStatusUncheckedCreateNestedManyWithoutDonatedItemInput;
    };

    export type DonatedItemCreateOrConnectWithoutProgramInput = {
        where: DonatedItemWhereUniqueInput;
        create: XOR<
            DonatedItemCreateWithoutProgramInput,
            DonatedItemUncheckedCreateWithoutProgramInput
        >;
    };

    export type DonatedItemCreateManyProgramInputEnvelope = {
        data:
            | DonatedItemCreateManyProgramInput
            | DonatedItemCreateManyProgramInput[];
        skipDuplicates?: boolean;
    };

    export type DonatedItemUpsertWithWhereUniqueWithoutProgramInput = {
        where: DonatedItemWhereUniqueInput;
        update: XOR<
            DonatedItemUpdateWithoutProgramInput,
            DonatedItemUncheckedUpdateWithoutProgramInput
        >;
        create: XOR<
            DonatedItemCreateWithoutProgramInput,
            DonatedItemUncheckedCreateWithoutProgramInput
        >;
    };

    export type DonatedItemUpdateWithWhereUniqueWithoutProgramInput = {
        where: DonatedItemWhereUniqueInput;
        data: XOR<
            DonatedItemUpdateWithoutProgramInput,
            DonatedItemUncheckedUpdateWithoutProgramInput
        >;
    };

    export type DonatedItemUpdateManyWithWhereWithoutProgramInput = {
        where: DonatedItemScalarWhereInput;
        data: XOR<
            DonatedItemUpdateManyMutationInput,
            DonatedItemUncheckedUpdateManyWithoutProgramInput
        >;
    };

    export type DonorCreateWithoutDonatedItemsInput = {
        firstName: string;
        lastName: string;
        contact?: string | null;
        email: string;
        addressLine1?: string | null;
        addressLine2?: string | null;
        state?: string | null;
        city?: string | null;
        zipcode: string;
        emailOptIn: boolean;
    };

    export type DonorUncheckedCreateWithoutDonatedItemsInput = {
        id?: number;
        firstName: string;
        lastName: string;
        contact?: string | null;
        email: string;
        addressLine1?: string | null;
        addressLine2?: string | null;
        state?: string | null;
        city?: string | null;
        zipcode: string;
        emailOptIn: boolean;
    };

    export type DonorCreateOrConnectWithoutDonatedItemsInput = {
        where: DonorWhereUniqueInput;
        create: XOR<
            DonorCreateWithoutDonatedItemsInput,
            DonorUncheckedCreateWithoutDonatedItemsInput
        >;
    };

    export type ProgramCreateWithoutDonatedItemsInput = {
        name: string;
        description: string;
        startDate: Date | string;
        aimAndCause: string;
    };

    export type ProgramUncheckedCreateWithoutDonatedItemsInput = {
        id?: number;
        name: string;
        description: string;
        startDate: Date | string;
        aimAndCause: string;
    };

    export type ProgramCreateOrConnectWithoutDonatedItemsInput = {
        where: ProgramWhereUniqueInput;
        create: XOR<
            ProgramCreateWithoutDonatedItemsInput,
            ProgramUncheckedCreateWithoutDonatedItemsInput
        >;
    };

    export type DonatedItemStatusCreateWithoutDonatedItemInput = {
        dateModified: Date | string;
        statusType: string;
        imageUrls?: DonatedItemStatusCreateimageUrlsInput | string[];
        donorInformed?: boolean;
        approval?: boolean;
        submitter?: string;
    };

    export type DonatedItemStatusUncheckedCreateWithoutDonatedItemInput = {
        id?: number;
        dateModified: Date | string;
        statusType: string;
        imageUrls?: DonatedItemStatusCreateimageUrlsInput | string[];
        donorInformed?: boolean;
        approval?: boolean;
        submitter?: string;
    };

    export type DonatedItemStatusCreateOrConnectWithoutDonatedItemInput = {
        where: DonatedItemStatusWhereUniqueInput;
        create: XOR<
            DonatedItemStatusCreateWithoutDonatedItemInput,
            DonatedItemStatusUncheckedCreateWithoutDonatedItemInput
        >;
    };

    export type DonatedItemStatusCreateManyDonatedItemInputEnvelope = {
        data:
            | DonatedItemStatusCreateManyDonatedItemInput
            | DonatedItemStatusCreateManyDonatedItemInput[];
        skipDuplicates?: boolean;
    };

    export type DonorUpsertWithoutDonatedItemsInput = {
        update: XOR<
            DonorUpdateWithoutDonatedItemsInput,
            DonorUncheckedUpdateWithoutDonatedItemsInput
        >;
        create: XOR<
            DonorCreateWithoutDonatedItemsInput,
            DonorUncheckedCreateWithoutDonatedItemsInput
        >;
        where?: DonorWhereInput;
    };

    export type DonorUpdateToOneWithWhereWithoutDonatedItemsInput = {
        where?: DonorWhereInput;
        data: XOR<
            DonorUpdateWithoutDonatedItemsInput,
            DonorUncheckedUpdateWithoutDonatedItemsInput
        >;
    };

    export type DonorUpdateWithoutDonatedItemsInput = {
        firstName?: StringFieldUpdateOperationsInput | string;
        lastName?: StringFieldUpdateOperationsInput | string;
        contact?: NullableStringFieldUpdateOperationsInput | string | null;
        email?: StringFieldUpdateOperationsInput | string;
        addressLine1?: NullableStringFieldUpdateOperationsInput | string | null;
        addressLine2?: NullableStringFieldUpdateOperationsInput | string | null;
        state?: NullableStringFieldUpdateOperationsInput | string | null;
        city?: NullableStringFieldUpdateOperationsInput | string | null;
        zipcode?: StringFieldUpdateOperationsInput | string;
        emailOptIn?: BoolFieldUpdateOperationsInput | boolean;
    };

    export type DonorUncheckedUpdateWithoutDonatedItemsInput = {
        id?: IntFieldUpdateOperationsInput | number;
        firstName?: StringFieldUpdateOperationsInput | string;
        lastName?: StringFieldUpdateOperationsInput | string;
        contact?: NullableStringFieldUpdateOperationsInput | string | null;
        email?: StringFieldUpdateOperationsInput | string;
        addressLine1?: NullableStringFieldUpdateOperationsInput | string | null;
        addressLine2?: NullableStringFieldUpdateOperationsInput | string | null;
        state?: NullableStringFieldUpdateOperationsInput | string | null;
        city?: NullableStringFieldUpdateOperationsInput | string | null;
        zipcode?: StringFieldUpdateOperationsInput | string;
        emailOptIn?: BoolFieldUpdateOperationsInput | boolean;
    };

    export type ProgramUpsertWithoutDonatedItemsInput = {
        update: XOR<
            ProgramUpdateWithoutDonatedItemsInput,
            ProgramUncheckedUpdateWithoutDonatedItemsInput
        >;
        create: XOR<
            ProgramCreateWithoutDonatedItemsInput,
            ProgramUncheckedCreateWithoutDonatedItemsInput
        >;
        where?: ProgramWhereInput;
    };

    export type ProgramUpdateToOneWithWhereWithoutDonatedItemsInput = {
        where?: ProgramWhereInput;
        data: XOR<
            ProgramUpdateWithoutDonatedItemsInput,
            ProgramUncheckedUpdateWithoutDonatedItemsInput
        >;
    };

    export type ProgramUpdateWithoutDonatedItemsInput = {
        name?: StringFieldUpdateOperationsInput | string;
        description?: StringFieldUpdateOperationsInput | string;
        startDate?: DateTimeFieldUpdateOperationsInput | Date | string;
        aimAndCause?: StringFieldUpdateOperationsInput | string;
    };

    export type ProgramUncheckedUpdateWithoutDonatedItemsInput = {
        id?: IntFieldUpdateOperationsInput | number;
        name?: StringFieldUpdateOperationsInput | string;
        description?: StringFieldUpdateOperationsInput | string;
        startDate?: DateTimeFieldUpdateOperationsInput | Date | string;
        aimAndCause?: StringFieldUpdateOperationsInput | string;
    };

    export type DonatedItemStatusUpsertWithWhereUniqueWithoutDonatedItemInput =
        {
            where: DonatedItemStatusWhereUniqueInput;
            update: XOR<
                DonatedItemStatusUpdateWithoutDonatedItemInput,
                DonatedItemStatusUncheckedUpdateWithoutDonatedItemInput
            >;
            create: XOR<
                DonatedItemStatusCreateWithoutDonatedItemInput,
                DonatedItemStatusUncheckedCreateWithoutDonatedItemInput
            >;
        };

    export type DonatedItemStatusUpdateWithWhereUniqueWithoutDonatedItemInput =
        {
            where: DonatedItemStatusWhereUniqueInput;
            data: XOR<
                DonatedItemStatusUpdateWithoutDonatedItemInput,
                DonatedItemStatusUncheckedUpdateWithoutDonatedItemInput
            >;
        };

    export type DonatedItemStatusUpdateManyWithWhereWithoutDonatedItemInput = {
        where: DonatedItemStatusScalarWhereInput;
        data: XOR<
            DonatedItemStatusUpdateManyMutationInput,
            DonatedItemStatusUncheckedUpdateManyWithoutDonatedItemInput
        >;
    };

    export type DonatedItemStatusScalarWhereInput = {
        AND?:
            | DonatedItemStatusScalarWhereInput
            | DonatedItemStatusScalarWhereInput[];
        OR?: DonatedItemStatusScalarWhereInput[];
        NOT?:
            | DonatedItemStatusScalarWhereInput
            | DonatedItemStatusScalarWhereInput[];
        id?: IntFilter<'DonatedItemStatus'> | number;
        dateModified?: DateTimeFilter<'DonatedItemStatus'> | Date | string;
        statusType?: StringFilter<'DonatedItemStatus'> | string;
        donatedItemId?: IntFilter<'DonatedItemStatus'> | number;
        imageUrls?: StringNullableListFilter<'DonatedItemStatus'>;
        donorInformed?: BoolFilter<'DonatedItemStatus'> | boolean;
        approval?: BoolFilter<'DonatedItemStatus'> | boolean;
        submitter?: StringFilter<'DonatedItemStatus'> | string;
    };

    export type DonatedItemCreateWithoutStatusesInput = {
        itemType: string;
        category: string;
        quantity: number;
        currentStatus: string;
        dateDonated: Date | string;
        lastUpdated?: Date | string;
        imagePath?: string | null;
        analysisMetadata?: NullableJsonNullValueInput | InputJsonValue;
        donor: DonorCreateNestedOneWithoutDonatedItemsInput;
        program?: ProgramCreateNestedOneWithoutDonatedItemsInput;
    };

    export type DonatedItemUncheckedCreateWithoutStatusesInput = {
        id?: number;
        itemType: string;
        category: string;
        quantity: number;
        currentStatus: string;
        dateDonated: Date | string;
        lastUpdated?: Date | string;
        imagePath?: string | null;
        analysisMetadata?: NullableJsonNullValueInput | InputJsonValue;
        donorId: number;
        programId?: number | null;
    };

    export type DonatedItemCreateOrConnectWithoutStatusesInput = {
        where: DonatedItemWhereUniqueInput;
        create: XOR<
            DonatedItemCreateWithoutStatusesInput,
            DonatedItemUncheckedCreateWithoutStatusesInput
        >;
    };

    export type DonatedItemUpsertWithoutStatusesInput = {
        update: XOR<
            DonatedItemUpdateWithoutStatusesInput,
            DonatedItemUncheckedUpdateWithoutStatusesInput
        >;
        create: XOR<
            DonatedItemCreateWithoutStatusesInput,
            DonatedItemUncheckedCreateWithoutStatusesInput
        >;
        where?: DonatedItemWhereInput;
    };

    export type DonatedItemUpdateToOneWithWhereWithoutStatusesInput = {
        where?: DonatedItemWhereInput;
        data: XOR<
            DonatedItemUpdateWithoutStatusesInput,
            DonatedItemUncheckedUpdateWithoutStatusesInput
        >;
    };

    export type DonatedItemUpdateWithoutStatusesInput = {
        itemType?: StringFieldUpdateOperationsInput | string;
        category?: StringFieldUpdateOperationsInput | string;
        quantity?: IntFieldUpdateOperationsInput | number;
        currentStatus?: StringFieldUpdateOperationsInput | string;
        dateDonated?: DateTimeFieldUpdateOperationsInput | Date | string;
        lastUpdated?: DateTimeFieldUpdateOperationsInput | Date | string;
        imagePath?: NullableStringFieldUpdateOperationsInput | string | null;
        analysisMetadata?: NullableJsonNullValueInput | InputJsonValue;
        donor?: DonorUpdateOneRequiredWithoutDonatedItemsNestedInput;
        program?: ProgramUpdateOneWithoutDonatedItemsNestedInput;
    };

    export type DonatedItemUncheckedUpdateWithoutStatusesInput = {
        id?: IntFieldUpdateOperationsInput | number;
        itemType?: StringFieldUpdateOperationsInput | string;
        category?: StringFieldUpdateOperationsInput | string;
        quantity?: IntFieldUpdateOperationsInput | number;
        currentStatus?: StringFieldUpdateOperationsInput | string;
        dateDonated?: DateTimeFieldUpdateOperationsInput | Date | string;
        lastUpdated?: DateTimeFieldUpdateOperationsInput | Date | string;
        imagePath?: NullableStringFieldUpdateOperationsInput | string | null;
        analysisMetadata?: NullableJsonNullValueInput | InputJsonValue;
        donorId?: IntFieldUpdateOperationsInput | number;
        programId?: NullableIntFieldUpdateOperationsInput | number | null;
    };

    export type DonatedItemCreateManyDonorInput = {
        id?: number;
        itemType: string;
        category: string;
        quantity: number;
        currentStatus: string;
        dateDonated: Date | string;
        lastUpdated?: Date | string;
        imagePath?: string | null;
        analysisMetadata?: NullableJsonNullValueInput | InputJsonValue;
        programId?: number | null;
    };

    export type DonatedItemUpdateWithoutDonorInput = {
        itemType?: StringFieldUpdateOperationsInput | string;
        category?: StringFieldUpdateOperationsInput | string;
        quantity?: IntFieldUpdateOperationsInput | number;
        currentStatus?: StringFieldUpdateOperationsInput | string;
        dateDonated?: DateTimeFieldUpdateOperationsInput | Date | string;
        lastUpdated?: DateTimeFieldUpdateOperationsInput | Date | string;
        imagePath?: NullableStringFieldUpdateOperationsInput | string | null;
        analysisMetadata?: NullableJsonNullValueInput | InputJsonValue;
        program?: ProgramUpdateOneWithoutDonatedItemsNestedInput;
        statuses?: DonatedItemStatusUpdateManyWithoutDonatedItemNestedInput;
    };

    export type DonatedItemUncheckedUpdateWithoutDonorInput = {
        id?: IntFieldUpdateOperationsInput | number;
        itemType?: StringFieldUpdateOperationsInput | string;
        category?: StringFieldUpdateOperationsInput | string;
        quantity?: IntFieldUpdateOperationsInput | number;
        currentStatus?: StringFieldUpdateOperationsInput | string;
        dateDonated?: DateTimeFieldUpdateOperationsInput | Date | string;
        lastUpdated?: DateTimeFieldUpdateOperationsInput | Date | string;
        imagePath?: NullableStringFieldUpdateOperationsInput | string | null;
        analysisMetadata?: NullableJsonNullValueInput | InputJsonValue;
        programId?: NullableIntFieldUpdateOperationsInput | number | null;
        statuses?: DonatedItemStatusUncheckedUpdateManyWithoutDonatedItemNestedInput;
    };

    export type DonatedItemUncheckedUpdateManyWithoutDonorInput = {
        id?: IntFieldUpdateOperationsInput | number;
        itemType?: StringFieldUpdateOperationsInput | string;
        category?: StringFieldUpdateOperationsInput | string;
        quantity?: IntFieldUpdateOperationsInput | number;
        currentStatus?: StringFieldUpdateOperationsInput | string;
        dateDonated?: DateTimeFieldUpdateOperationsInput | Date | string;
        lastUpdated?: DateTimeFieldUpdateOperationsInput | Date | string;
        imagePath?: NullableStringFieldUpdateOperationsInput | string | null;
        analysisMetadata?: NullableJsonNullValueInput | InputJsonValue;
        programId?: NullableIntFieldUpdateOperationsInput | number | null;
    };

    export type DonatedItemCreateManyProgramInput = {
        id?: number;
        itemType: string;
        category: string;
        quantity: number;
        currentStatus: string;
        dateDonated: Date | string;
        lastUpdated?: Date | string;
        imagePath?: string | null;
        analysisMetadata?: NullableJsonNullValueInput | InputJsonValue;
        donorId: number;
    };

    export type DonatedItemUpdateWithoutProgramInput = {
        itemType?: StringFieldUpdateOperationsInput | string;
        category?: StringFieldUpdateOperationsInput | string;
        quantity?: IntFieldUpdateOperationsInput | number;
        currentStatus?: StringFieldUpdateOperationsInput | string;
        dateDonated?: DateTimeFieldUpdateOperationsInput | Date | string;
        lastUpdated?: DateTimeFieldUpdateOperationsInput | Date | string;
        imagePath?: NullableStringFieldUpdateOperationsInput | string | null;
        analysisMetadata?: NullableJsonNullValueInput | InputJsonValue;
        donor?: DonorUpdateOneRequiredWithoutDonatedItemsNestedInput;
        statuses?: DonatedItemStatusUpdateManyWithoutDonatedItemNestedInput;
    };

    export type DonatedItemUncheckedUpdateWithoutProgramInput = {
        id?: IntFieldUpdateOperationsInput | number;
        itemType?: StringFieldUpdateOperationsInput | string;
        category?: StringFieldUpdateOperationsInput | string;
        quantity?: IntFieldUpdateOperationsInput | number;
        currentStatus?: StringFieldUpdateOperationsInput | string;
        dateDonated?: DateTimeFieldUpdateOperationsInput | Date | string;
        lastUpdated?: DateTimeFieldUpdateOperationsInput | Date | string;
        imagePath?: NullableStringFieldUpdateOperationsInput | string | null;
        analysisMetadata?: NullableJsonNullValueInput | InputJsonValue;
        donorId?: IntFieldUpdateOperationsInput | number;
        statuses?: DonatedItemStatusUncheckedUpdateManyWithoutDonatedItemNestedInput;
    };

    export type DonatedItemUncheckedUpdateManyWithoutProgramInput = {
        id?: IntFieldUpdateOperationsInput | number;
        itemType?: StringFieldUpdateOperationsInput | string;
        category?: StringFieldUpdateOperationsInput | string;
        quantity?: IntFieldUpdateOperationsInput | number;
        currentStatus?: StringFieldUpdateOperationsInput | string;
        dateDonated?: DateTimeFieldUpdateOperationsInput | Date | string;
        lastUpdated?: DateTimeFieldUpdateOperationsInput | Date | string;
        imagePath?: NullableStringFieldUpdateOperationsInput | string | null;
        analysisMetadata?: NullableJsonNullValueInput | InputJsonValue;
        donorId?: IntFieldUpdateOperationsInput | number;
    };

    export type DonatedItemStatusCreateManyDonatedItemInput = {
        id?: number;
        dateModified: Date | string;
        statusType: string;
        imageUrls?: DonatedItemStatusCreateimageUrlsInput | string[];
        donorInformed?: boolean;
        approval?: boolean;
        submitter?: string;
    };

    export type DonatedItemStatusUpdateWithoutDonatedItemInput = {
        dateModified?: DateTimeFieldUpdateOperationsInput | Date | string;
        statusType?: StringFieldUpdateOperationsInput | string;
        imageUrls?: DonatedItemStatusUpdateimageUrlsInput | string[];
        donorInformed?: BoolFieldUpdateOperationsInput | boolean;
        approval?: BoolFieldUpdateOperationsInput | boolean;
        submitter?: StringFieldUpdateOperationsInput | string;
    };

    export type DonatedItemStatusUncheckedUpdateWithoutDonatedItemInput = {
        id?: IntFieldUpdateOperationsInput | number;
        dateModified?: DateTimeFieldUpdateOperationsInput | Date | string;
        statusType?: StringFieldUpdateOperationsInput | string;
        imageUrls?: DonatedItemStatusUpdateimageUrlsInput | string[];
        donorInformed?: BoolFieldUpdateOperationsInput | boolean;
        approval?: BoolFieldUpdateOperationsInput | boolean;
        submitter?: StringFieldUpdateOperationsInput | string;
    };

    export type DonatedItemStatusUncheckedUpdateManyWithoutDonatedItemInput = {
        id?: IntFieldUpdateOperationsInput | number;
        dateModified?: DateTimeFieldUpdateOperationsInput | Date | string;
        statusType?: StringFieldUpdateOperationsInput | string;
        imageUrls?: DonatedItemStatusUpdateimageUrlsInput | string[];
        donorInformed?: BoolFieldUpdateOperationsInput | boolean;
        approval?: BoolFieldUpdateOperationsInput | boolean;
        submitter?: StringFieldUpdateOperationsInput | string;
    };

    /**
     * Batch Payload for updateMany & deleteMany & createMany
     */

    export type BatchPayload = {
        count: number;
    };

    /**
     * DMMF
     */
    export const dmmf: runtime.BaseDMMF;
}
