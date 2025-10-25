import { createFileRoute } from '@tanstack/react-router'
import HeroSection from '@/components/index/HeroSection';
import Functions from '@/components/index/Functions';
import About from '@/components/index/About';
import News from '@/components/index/News';
import Footer from '@/components/index/Footer';
import Contact from '@/components/index/Contact';
import { Button } from '@/components/ui/button';
import { authClient } from '@/lib/auth-client';

export const Route = createFileRoute('/')({
  component: App,
})

function App() {
  //const tasks = useQuery(api.test.get)

  const logOut  = async () => {
    await authClient.signOut();
    location.reload();
  }
  // dat do profilu nekam do nastavni theme switch

  return (
    <div className="text-center relative flex flex-col items-center max-w-[500px] mx-auto">
      <Button onClick={logOut}>Log out</Button>
      <HeroSection />
      <Functions />
      <About />
      <News />
      <Contact />
      <Footer />
    </div>
  )
}
