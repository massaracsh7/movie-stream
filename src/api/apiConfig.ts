export const HTTP_MIDDLEWARE_HOST = 'https://api.us-central1.gcp.commercetools.com';
export const AUTH_MIDDLEWARE_HOST = 'https://auth.us-central1.gcp.commercetools.com';

export const projectKey: string =
  typeof import.meta.env.VITE_CTP_PROJECT_KEY === 'string'
    ? import.meta.env.VITE_CTP_PROJECT_KEY
    : 'movie-stream';

export const clientId: string =
  typeof import.meta.env.VITE_CTP_CLIENT_ID === 'string' ? import.meta.env.VITE_CTP_CLIENT_ID : 'HQ4dPnJcZgZ6yXWhnaEfnTBU';

export const clientSecret: string =
  typeof import.meta.env.VITE_CTP_CLIENT_SECRET === 'string'
    ? import.meta.env.VITE_CTP_CLIENT_SECRET
    : 'OC6_7-FBkMRWimOGUUllRmxZaXU4gTGn';

export const authApiRootscopes = [
  `manage_my_orders:${projectKey} view_categories:${projectKey} view_published_products:${projectKey} view_products:${projectKey} manage_my_profile:${projectKey} view_orders:${projectKey} manage_customers:${projectKey} view_payments:${projectKey} manage_my_payments:${projectKey} create_anonymous_token:${projectKey} manage_my_business_units:${projectKey} manage_my_quotes:${projectKey} manage_my_shopping_lists:${projectKey} view_cart_discounts:${projectKey} manage_my_quote_requests:${projectKey}`,
];

export const apiRootScopes = [
  `manage_customers:${projectKey} view_products:${projectKey} manage_my_orders:${projectKey} manage_my_profile:${projectKey} view_orders:${projectKey} view_cart_discounts:${projectKey} manage_my_quote_requests:${projectKey} manage_my_business_units:${projectKey} manage_my_quotes:${projectKey} manage_my_shopping_lists:${projectKey}`,
];

export const authScopes = ['manage_products:movie-stream manage_customers:movie-stream manage_my_quotes:movie-stream manage_attribute_groups:movie-stream manage_my_quote_requests:movie-stream manage_my_profile:movie-stream manage_orders:movie-stream view_categories:movie-stream manage_cart_discounts:movie-stream create_anonymous_token:movie-stream manage_my_orders:movie-stream manage_payments:movie-stream manage_my_business_units:movie-stream manage_my_payments:movie-stream manage_my_shopping_lists:movie-stream manage_categories:movie-stream manage_project:movie-stream view_published_products:movie-stream'];

