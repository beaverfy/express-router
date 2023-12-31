import type { Request, Response } from "express";

export class Route {
    /**
     * This is an internal method, use contructor with super instead
     */
    public routeName: string = "%FILE_NAME%";
    /**
     * This is an internal method, use contructor with super instead
     */
    public requireAuthorization = true;
    constructor(options?: {
        /**
         * Overrides the route name derived from the file path
         */
        routeName?: string;
        /**
         * If this route should require authorization, if not defined uses `ExpressRouterConfiguration.authentication#enabledByDefault`
         */
        requireAuthorization?: boolean;
    }) {
        this.routeName = options?.routeName ?? "%FILE_NAME%";
        this.requireAuthorization = options?.requireAuthorization ?? true;
    }

    /* Methods from https://developer.mozilla.org/en-US/docs/Web/HTTP/Methods */
    onGet?(request: Request, response: Response): any;
    onHead?(request: Request, response: Response): any;
    onPost?(request: Request, response: Response): any;
    onPut?(request: Request, response: Response): any;
    onDelete?(request: Request, response: Response): any;
    onPatch?(request: Request, response: Response): any;
}