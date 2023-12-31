import type { Request, Response } from "express";
import type { ParamsDictionary } from "express-serve-static-core";
import type { ParsedQs } from "qs";
import { Route } from "../../../lib";
export default class AppRoute extends Route {
    constructor() {
        super({
            requireAuthorization: true
        });
    }

    onGet(_request: Request<ParamsDictionary, any, any, ParsedQs, Record<string, any>>, response: Response<any, Record<string, any>>) {
        response.send("This is an secret route 🕵️");
    }
}