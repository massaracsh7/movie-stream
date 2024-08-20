import type {
  ApiRoot,
  CustomerDraft,
  CustomerSignin,
  Product,
  ProductDiscount,
} from '@commercetools/platform-sdk';
import type { DiscountsType, QueryArgs } from 'types';

import { projectKey } from './apiConfig';
import { apiRoot, getAnonymousApiRoot, getAuthApiRoot } from './apiHelpers';
import { ACTION_ADD_ITEM, CURRENCY_USD, MERGE_CART_MODE } from './constants';

export const apiRootWithProjectKey = apiRoot.withProjectKey({ projectKey });

let anonymousApiRoot: ApiRoot;
let authApiRoot: ApiRoot;

export const signIn = async (loginRequest: CustomerSignin, cartId: string) => {
  if (cartId) {
    await mergeAnonymousCart(loginRequest.email, loginRequest.password);
  }

  authApiRoot = getAuthApiRoot(loginRequest);

  const response = await authApiRoot
    .withProjectKey({ projectKey })
    .login()
    .post({ body: loginRequest })
    .execute();

  return response;
};

export const signUp = async (customer: CustomerDraft) => {
  const response = await apiRootWithProjectKey.customers().post({ body: customer }).execute();

  return response;
};

export const composeQueryArgs = (
  year: string,
  price: string[],
  sortParam: string,
  sortVal: string,
  word: string,
  category: string,
  limit: number,
  offset: number,
) => {
  let sortArgs: string[] = [];
  let queryArgs: QueryArgs = {};

  if (sortParam === 'name') {
    sortArgs = [`name.en-US ${sortVal}`];
  } else if (sortParam === 'price') {
    sortArgs = [`price ${sortVal}`];
  }

  if (year && price.length > 0) {
    queryArgs = {
      filter: [
        `variants.price.centAmount:range (${price[0]} to ${price[1]})`,
        `variants.attributes.year: ${year}`,
      ],
      sort: sortArgs,
      ['text.en-US']: word,
      limit,
      offset,
    };
  } else if (year) {
    queryArgs = {
      filter: [`variants.attributes.year: ${year}`],
      sort: sortArgs,
      ['text.en-US']: word,
      limit,
      offset,
    };
  } else if (price.length > 0) {
    queryArgs = {
      filter: [`variants.price.centAmount:range (${price[0]} to ${price[1]})`],
      sort: sortArgs,
      ['text.en-US']: word,
      limit,
      offset,
    };
  } else {
    queryArgs = {
      filter: [],
      sort: sortArgs,
      ['text.en-US']: word,
      limit,
      offset,
    };
  }

  if (category && Array.isArray(queryArgs.filter)) {
    queryArgs.filter.push(`categories.id: "${category}"`);
  }

  return queryArgs;
};

export const getProducts = async (
  year: string,
  price: string[],
  sortParam: string,
  sortVal: string,
  word: string,
  category: string,
  limit: number,
  offset: number,
) => {
  const queryArgs = composeQueryArgs(
    year,
    price,
    sortParam,
    sortVal,
    word,
    category,
    limit,
    offset,
  );

  const response = await apiRootWithProjectKey
    .productProjections()
    .search()
    .get({ queryArgs })
    .execute();

  return response;
};

export const getDiscounts = async () => {
  const response = await apiRootWithProjectKey.productDiscounts().get().execute();

  return response;
};

export const getProduct = async (id: string) => {
  const getSingleDiscountValue = (product: Product, discount: ProductDiscount) => {
    if (
      discount.references[0]?.typeId === 'category' &&
      discount.references[0]?.id === product.masterData.current.categories?.[0]?.id
    ) {
      return {
        sortOrder: discount.sortOrder,
        discount: discount.value.type == 'absolute' ? discount.value.money[0]?.centAmount : 0,
      };
    }
    return { sortOrder: '0', discount: 0 };
  };
  const getFinalDiscountValue = (product: Product, discounts: ProductDiscount[]) => {
    const { discount } = discounts.reduce(
      (acc: DiscountsType, val: ProductDiscount): DiscountsType => {
        const { sortOrder, discount } = getSingleDiscountValue(product, val);
        if (Number(sortOrder) > Number(acc.sortOrder)) {
          return { sortOrder, discount };
        }
        return acc;
      },
      { sortOrder: '0', discount: 0 },
    );

    return discount;
  };

  const response = await apiRootWithProjectKey.products().withId({ ID: id }).get().execute();
  const discountsResponse = await getDiscounts();
  let discounts: ProductDiscount[] = [];
  discounts = discountsResponse.body.results;

  const product: Product = response.body;

  let price: number | undefined = undefined;
  if (product.masterData.current.masterVariant.prices) {
    if (product.masterData.current.masterVariant.prices[0]) {
      price = product.masterData.current.masterVariant.prices[0].value.centAmount;
    }
  }

  return {
    id: product.id,
    name: product.masterData.current.name,
    categories: product.masterData.current.categories,
    description: product.masterData.current.description,
    images: product.masterData.current.masterVariant.images,
    attributes: product.masterData.current.masterVariant.attributes,
    price,
    discount: getFinalDiscountValue(product, discounts),
  };
};

export const createUserCart = async () => {
  const response = await authApiRoot
    .withProjectKey({ projectKey })
    .me()
    .carts()
    .post({ body: { currency: `${CURRENCY_USD}` } })
    .execute();

  return response;
};

export const createAnonymousCart = async () => {
  anonymousApiRoot = getAnonymousApiRoot();

  const response = await anonymousApiRoot
    .withProjectKey({ projectKey })
    .me()
    .carts()
    .post({ body: { currency: `${CURRENCY_USD}` } })
    .execute();

  return response;
};

export const addItemToCart = async (
  userId: string,
  cartId: string,
  itemId: string,
  version: number,
) => {
  const apiRoot = userId ? authApiRoot : anonymousApiRoot;

  const response = await apiRoot
    .withProjectKey({ projectKey })
    .me()
    .carts()
    .withId({ ID: `${cartId}` })
    .post({
      body: {
        version: version,
        actions: [{ action: ACTION_ADD_ITEM, productId: `${itemId}` }],
      },
    })
    .execute();

  return response;
};

export const getActiveCart = async (userId: string) => {
  const apiRoot = userId ? authApiRoot : anonymousApiRoot;
  const response = await apiRoot.withProjectKey({ projectKey }).me().activeCart().get().execute();

  return response;
};

export const mergeAnonymousCart = async (email: string, password: string) => {
  const response = await anonymousApiRoot
    .withProjectKey({ projectKey })
    .me()
    .login()
    .post({
      body: {
        email,
        password,
        activeCartSignInMode: `${MERGE_CART_MODE}`,
      },
    })
    .execute();

  return response;
};

export const removeItem = async (
  userId: string,
  cartsId: string,
  lineItemId: string,
  version: number,
) => {
  const apiRoot = userId ? authApiRoot : anonymousApiRoot;
  const response = await apiRoot
    .withProjectKey({ projectKey })
    .me()
    .carts()
    .withId({ ID: cartsId })
    .post({
      body: {
        version: version,
        actions: [
          {
            action: 'removeLineItem',
            lineItemId: lineItemId,
          },
        ],
      },
    })
    .execute();

  return response;
};

export const updateQuantity = async (
  userId: string,
  cartsId: string,
  lineItemId: string,
  version: number,
  quantity: number,
) => {
  const apiRoot = userId ? authApiRoot : anonymousApiRoot;
  const response = await apiRoot
    .withProjectKey({ projectKey })
    .me()
    .carts()
    .withId({ ID: cartsId })
    .post({
      body: {
        version: version,
        actions: [
          {
            action: 'changeLineItemQuantity',
            lineItemId: lineItemId,
            quantity: quantity,
          },
        ],
      },
    })
    .execute();

  return response;
};

export const deleteCart = async (userId: string, cartId: string, version: number) => {
  const apiRoot = userId ? authApiRoot : anonymousApiRoot;
  const response = await apiRoot
    .withProjectKey({ projectKey })
    .me()
    .carts()
    .withId({ ID: cartId })
    .delete({
      queryArgs: {
        version: version,
      },
    })
    .execute();

  return response;
};

export const addDiscount = async (
  userId: string,
  cartsId: string,
  version: number,
  code: string,
) => {
  const apiRoot = userId ? authApiRoot : anonymousApiRoot;
  const response = await apiRoot
    .withProjectKey({ projectKey })
    .me()
    .carts()
    .withId({ ID: cartsId })
    .post({
      body: {
        version: version,
        actions: [
          {
            action: 'addDiscountCode',
            code: code,
          },
        ],
      },
    })
    .execute();
  return response;
};

export const cartDiscounts = async (userId: string) => {
  const apiRoot = userId ? authApiRoot : anonymousApiRoot;
  const response = await apiRoot.withProjectKey({ projectKey }).cartDiscounts().get().execute();

  return response;
};
