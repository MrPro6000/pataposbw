import hubPreview from "@/assets/hub-preview.png";

const DevicePreview = () => {
  return (
    <div className="relative w-full max-w-2xl mx-auto">
      {/* Laptop frame */}
      <div className="relative">
        {/* Screen */}
        <div className="bg-foreground rounded-t-lg overflow-hidden shadow-2xl">
          <div className="relative pt-6 px-4 pb-0">
            {/* Browser dots */}
            <div className="absolute top-2 left-4 flex gap-1.5">
              <div className="w-2.5 h-2.5 rounded-full bg-muted-foreground/30"></div>
              <div className="w-2.5 h-2.5 rounded-full bg-muted-foreground/30"></div>
              <div className="w-2.5 h-2.5 rounded-full bg-muted-foreground/30"></div>
            </div>
            {/* Preview image */}
            <img 
              src={hubPreview} 
              alt="Yoco Dashboard Preview" 
              className="w-full rounded-t-md"
            />
          </div>
        </div>
        {/* Laptop base */}
        <div className="bg-foreground h-4 rounded-b-lg"></div>
        <div className="bg-muted-foreground/20 h-1 mx-auto w-1/3 rounded-b-full"></div>
      </div>
    </div>
  );
};

export default DevicePreview;
