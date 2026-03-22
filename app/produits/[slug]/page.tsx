import { notFound } from "next/navigation";
import TopBar from "@/components/TopBar";
import Header from "@/components/Header";
import NavBar from "@/components/NavBar";
import Footer from "@/components/Footer";
import { getProduct } from "@/lib/api";
import ProductDetailClient from "./ProductDetailClient";

export async function generateMetadata({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  try {
    const { data: product } = await getProduct(slug);
    return {
      title: `${product.name} - Tunisia Phone`,
      description: product.description?.slice(0, 160),
    };
  } catch {
    return { title: "Produit introuvable - Tunisia Phone" };
  }
}

export default async function ProductDetailPage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  let product;
  try {
    const res = await getProduct(slug);
    product = res.data;
  } catch {
    notFound();
  }

  return (
    <>
      <TopBar />
      <Header />
      <NavBar />
      <main className="bg-white min-h-[60vh]">
        <div className="max-w-[1280px] mx-auto px-4 py-8">
          <ProductDetailClient product={product} />
        </div>
      </main>
      <Footer />
    </>
  );
}
