import { ProductPage } from "@/components/product-page"

interface ProductPageProps {
  params: {
    id: string
  }
  searchParams: {
    shopId?: string
  }
}

export default function Product({ params, searchParams }: ProductPageProps) {
  const productId = Number.parseInt(params.id)
  const shopId = searchParams.shopId ? Number.parseInt(searchParams.shopId) : undefined

  return <ProductPage productId={productId} shopId={shopId} onBack={() => {}} />
}
