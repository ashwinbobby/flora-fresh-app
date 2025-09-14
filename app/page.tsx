import Image from "next/image";
import {Logo, Intro, ImageCard} from '@/app/homepage';
export default function Home() {
  return (
    <div className="min-h-screen flex flex-col items-center justify-start p-6 bg-white">
      <Logo />
      <Intro />
      <ImageCard />
    </div>
  );
}
