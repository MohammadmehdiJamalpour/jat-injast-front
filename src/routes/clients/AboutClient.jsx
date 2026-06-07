import AboutUsContainer from "@/components/about-us/AboutUsContainer";
import Footer from "@/components/Footer";

function AboutClient() {
  return (
    <div className="mt-20 min-w-0 md:mt-24">
      <div className="min-w-0">
        <AboutUsContainer />
      </div>
      <Footer mode="static" />
    </div>
  );
}

export default AboutClient;
