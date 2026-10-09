declare module "papaparse" {
    export type ParseResult<T> = {
        data: T[];
        errors: unknown[];
        meta: unknown;
    };

    export type ParseConfig = {
        header?: boolean;
        skipEmptyLines?: boolean | "greedy";
    };

    export type UnparseConfig = {
        header?: boolean;
        delimiter?: string;
        newline?: string;
    };

    const Papa: {
        parse<T>(input: string, config?: ParseConfig): ParseResult<T>;
        unparse(
            data: Array<Record<string, string | number | boolean | null | undefined>>,
            config?: UnparseConfig,
        ): string;
    };

    export default Papa;
}
