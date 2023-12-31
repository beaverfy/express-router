export interface ExpressRouterConfiguration {
    /**
     * Directory where routes are stored
     * #### Typescript
     * If you're using typescript, replace `./src` (source folder) with `./dist` (out dir)
     */
    directory: string;
    /**
     * Allow only requests with authentication provided
     */
    authentication?: {
        /**
         * If routes should have authentication required by default
         */
        enabledByDefault?: boolean;
        /**
         * The token to use to authenticate requests
         * Defaults to `process.env.ROUTER_TOKEN`
         * @example process.env.API_TOKEN
         */
        token: string;
    };
    /**
     * Use these settings at your own risk
     */
    advanced?: {
        /**
         * Replaces typescript directorys with your project's `tsconfig.json#outDir`
         */
        useExperimentalDirectoryHelper?: boolean;
        /**
         * Replaces default authentication query key (`?token=...`)
         */
        authenticationQueryKey?: string;
    }
}