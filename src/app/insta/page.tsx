import Carousel from "@/components/Carousel";

export const metadata = {
  title: 'Instagram Feed',
  description: 'My latest Instagram posts.',
}

export default function Insta() {
  return (
    <div className="relative h-screen">
      <Carousel />
    </div>
  );
}
