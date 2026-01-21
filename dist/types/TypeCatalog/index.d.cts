/**
 * @example create Type Catalog from existing Union Type
 * ```
 * type PoolCatalog = CreateTypeCatalog<Pool>
 * ```
 */
type CreateTypeCatalog<Union extends {
    type: string;
}> = {
    [Member in Union as Member["type"]]: Member;
};

export type { CreateTypeCatalog };
