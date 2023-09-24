import { NextRequest, NextResponse } from 'next/server';

const GUARDED_ROUTES: { [key: string]: { requiresAuthentication?: boolean; redirectUrl?: string } } = {
	'/login': {
		requiresAuthentication: false,
	},
	'/problems': {
		redirectUrl: '/login',
	},
};

const DEFAULT_REDIRECT_URL = '/';

const routeNames = Object.keys(GUARDED_ROUTES);

export function middleware(request: NextRequest) {
	const pathname = request.nextUrl.pathname;
	const isAuthenticated = request.cookies.has('auth');
	const route = routeNames.find((route) => pathname.startsWith(route));
	if (route !== undefined) {
		const requiredAuthenticated = GUARDED_ROUTES[route].requiresAuthentication ?? true;
		if (isAuthenticated !== requiredAuthenticated) {
			const url = new URL(GUARDED_ROUTES[route].redirectUrl ?? DEFAULT_REDIRECT_URL, request.url);
			if (route !== '/login') url.searchParams.set('to', route);
			return NextResponse.redirect(url);
		}
	}
}

export const config = {
	matcher: Object.keys(GUARDED_ROUTES),
};
