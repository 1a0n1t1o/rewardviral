import { withWhopAppConfig } from "@whop/react/next.config";
import type { NextConfig } from "next";

const nextConfig: NextConfig = {
	/* config options here */
	images: {
		remotePatterns: [{ hostname: "**" }],
	},
	async headers() {
		return [
			{
				source: "/(.*)",
				headers: [
					{
						key: "Content-Security-Policy",
						value: [
							"default-src 'self'",
							"script-src 'self' 'unsafe-inline' https://apps.whop.com",
							"connect-src 'self' https://api.whop.com https://apps.whop.com",
							"frame-ancestors https://whop.com https://*.whop.com",
							"img-src 'self' data: https:",
							"style-src 'self' 'unsafe-inline'",
						].join("; "),
					},
				],
			},
		];
	},
};

export default withWhopAppConfig(nextConfig);
