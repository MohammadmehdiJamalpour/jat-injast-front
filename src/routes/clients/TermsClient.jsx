import TermsContainer from "@/components/terms/TermsContainer";
import Footer from "@/components/Footer";

function TermsClient() {
  return (
    <div className="mt-20 min-w-0 md:mt-24">
      <div className="min-w-0">
        <TermsContainer />
      </div>
      <Footer mode="static" />
    </div>
  );
}

export default TermsClient;
