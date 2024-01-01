export enum RouteNameVariables {
    /**
     * Default path selected for http route
     * @example `/blog/:id`
     */
    DefaultPath = "%DEFAULT_PATH%",
    /**
     * Returns a boolean from `ExpressRouterConfiguration.authentication#enabledByDefault`
     */
    RequireAuthorizationByDefault = "%AUTHORIZATION_BY_DEFAULT%"
}

export function IgnoreFile() {
    return {
        expressRouter: {
            ignoreFile: true
        }
    }
}