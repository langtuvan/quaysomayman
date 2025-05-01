 type UseDiscountPriceReturn = {
  price: string
  salePrice: string
  discountPrice: string
  discountPercent: string
}

type UseDiscountPriceProps = {
  price: number
  salePrice?: number
  discountPrice?: number
}

