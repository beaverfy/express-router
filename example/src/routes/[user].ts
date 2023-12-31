import type { Request, Response } from "express";
import type { ParsedQs } from "qs";
import { Route } from "../../../lib";

export default class AppRoute extends Route {
    onGet(request: Request, response: Response) {
        const user = request.params.user;
        response.send(`Looking up ${user}... 🔍`);
    }
}