export interface RequestError {
    discriminator: string
    title: string
    msg: string
  }
  
  export function instanceOfRequestError(object: any): boolean {
    return object.discriminator === "request-error"
  }
  
  export const NotFoundErrorTitle = "找不到服务器"
  export const UnkownRequestErrorTitle = "服务器开小差了, 请再重试一次~"
  export const UnauthorizedErrorTitle = "芝麻开门?"
  export const InvalidTokenErrorTitle = "Token无效"
  
  export const NotFoundError: RequestError = {
    discriminator: "request-error",
    title: NotFoundErrorTitle,
    msg: NotFoundErrorTitle,
  }
  
  export const UnkownRequestError: RequestError = {
    discriminator: "request-error",
    title: UnkownRequestErrorTitle,
    msg: UnkownRequestErrorTitle,
  }
  
  export const UnauthorizedError: RequestError = {
    discriminator: "request-error",
    title: UnauthorizedErrorTitle,
    msg: UnauthorizedErrorTitle,
  }
  
  export const InvalidTokenError: RequestError = {
    discriminator: "request-error",
    title: InvalidTokenErrorTitle,
    msg: InvalidTokenErrorTitle,
  }
  