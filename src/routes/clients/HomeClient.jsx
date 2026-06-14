import HomeContainer from "@/components/home/HomeContainer";

function HomeClient({ initialContent, initialZones, initialFooterContent }) {
  return (
    <div className="flex w-full flex-col justify-between">
      <HomeContainer
        initialContent={initialContent}
        initialZones={initialZones}
        initialFooterContent={initialFooterContent}
      />
    </div>
  );
}

export default HomeClient;
