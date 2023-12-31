import type { ExpressRouterConfiguration } from "./types";
import type { Application, Request, Response } from "express";
import klawSync from "klaw-sync";
import type { Route } from "./route";
import { FileSystemWalker } from "file-system-walker";

const defaultRouterConfiguration: ExpressRouterConfiguration = {
    directory: "./routes",
    authentication: {
        token: process.env.ROUTER_TOKEN as string,
        enabledByDefault: true
    },
    advanced: {
        useExperimentalDirectoryHelper: false,
        authenticationQueryKey: "token"
    }
}

export async function useExpressRouter(app: Application, _config?: ExpressRouterConfiguration) {
    // merge default configuration
    const configuration = {
        ...defaultRouterConfiguration,
        ..._config
    };

    if (!configuration.directory) throw new Error(`[ExpressRouter] expected string for directory but got ${configuration.directory}`);
    async function fetchRouteFiles(): Promise<(Route & { path: string; })[]> {
        const walker = new FileSystemWalker(configuration.directory);
        const routeFiles = [];
        for await (const file of walker) {
            const fileContent = require(file.filepath);
            const route: Route = new fileContent.default();
            routeFiles.push({
                ...route,
                path: file.filepath
            });
        }

        return routeFiles;
    }

    function addAuthentication(route: (req: Request, res: Response) => unknown, config: Route) {
        if (configuration.authentication?.token != null && (config?.requireAuthorization == true || (
            config.requireAuthorization == null && configuration.authentication?.enabledByDefault
        ))) {
            return (req: Request, res: Response) => {
                if (
                    req.headers?.authorization != configuration.authentication?.token &&
                    req.query?.[configuration?.advanced?.authenticationQueryKey as string] != configuration.authentication?.token
                ) {
                    return res
                        .status(401)
                        .send("Unauthorized");
                } else return route(req, res);
            }
        } else return route;
    }

    const routes = new Set<Route & { path: string; }>(
        await fetchRouteFiles()
    );

    function resolvePath(filePath: string): string {
        console.log("resolving: ", filePath);

        // // Normalize the paths using path.join
        // const normalizedBasePath = path.join(basePath);
        // const normalizedFilePath = path.join(filePath);

        // Remove the base path
        let relativePath = filePath;

        // Remove ".js" if present
        relativePath = relativePath.replace(".js", "");

        // Remove "index" and leading "/" if present
        relativePath = relativePath.replace("index", "").replace(/^\//, "");

        // Handle dynamic paths like "/blog/[author]/[id].ts"
        while (relativePath.includes("[") && relativePath.includes("]")) {
            const paramStart = relativePath.indexOf("[");
            const paramEnd = relativePath.indexOf("]");
            const param = relativePath.substring(paramStart + 1, paramEnd);

            // Update the path to include the dynamic parameter
            relativePath = relativePath.replace(`[${param}]`, `:${param}`);
        }

        console.log("resolved: ", relativePath);

        return relativePath;
    }

    for (const route of routes.values()) {
        const name = resolvePath(route.path);
        if (route.onGet) app.get(name, addAuthentication(route.onGet, route));
        if (route.onHead) app.head(name, addAuthentication(route.onHead, route));
        if (route.onPost) app.post(name, addAuthentication(route.onPost, route));
        if (route.onPut) app.put(name, addAuthentication(route.onPut, route));
        if (route.onPatch) app.patch(name, addAuthentication(route.onPatch, route));
        if (route.onDelete) app.delete(name, addAuthentication(route.onDelete, route));
    }
}