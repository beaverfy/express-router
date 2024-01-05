import type { Request, Response } from "express";
import { RouteNameVariables } from "./constants";

export type RouteRequireAuthorization = boolean |
    `${string | null}${RouteNameVariables.RequireAuthorizationByDefault}${string | null}` |
    RouteNameVariables.RequireAuthorizationByDefault;

export class Route {
    /**
     * This is an internal method, use contructor with super instead
     */
    public routeName: string = RouteNameVariables.DefaultPath;
    /**
     * This is an internal method, use contructor with super instead
     */
    public requireAuthorization: RouteRequireAuthorization = true;
    constructor(options?: {
        /**
         * Overrides the route name derived from the file path
         */
        routeName?: string;
        /**
         * If this route should require authorization, if not defined uses `ExpressRouterConfiguration.authentication#enabledByDefault`
         */
        requireAuthorization?: RouteRequireAuthorization;
    }) {
        this.routeName = typeof options?.routeName == "string" ?
            options.routeName :
            RouteNameVariables.DefaultPath;
        this.requireAuthorization = typeof options?.requireAuthorization == "boolean" ?
            options.requireAuthorization :
            RouteNameVariables.RequireAuthorizationByDefault;
    }

    /* Methods from https://developer.mozilla.org/en-US/docs/Web/HTTP/Methods */
    public onGet?(request: Request, response: Response): any;
    public onHead?(request: Request, response: Response): any;
    public onPost?(request: Request, response: Response): any;
    public onPut?(request: Request, response: Response): any;
    public onDelete?(request: Request, response: Response): any;
    public onPatch?(request: Request, response: Response): any;
}