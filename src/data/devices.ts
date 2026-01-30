// Import device images
import pataSpazaImg from "@/assets/devices/pata-spaza.jpeg";
import pataSilverImg from "@/assets/devices/pata-silver.jpeg";
import goPataImg from "@/assets/devices/go-pata.jpeg";
import pataDiamondImg from "@/assets/devices/pata-diamond.jpeg";
import pataProImg from "@/assets/devices/pata-pro.jpeg";
import pataPlatinumImg from "@/assets/devices/pata-platinum.jpeg";

export interface DeviceModel {
  id: string;
  name: string;
  model: string;
  image: string;
  description: string;
  price: string;
}

export const deviceModels: Record<string, DeviceModel> = {
  "Pata Spaza": {
    id: "spaza",
    name: "Pata Spaza",
    model: "Pata Spaza",
    image: pataSpazaImg,
    description: "Full POS system with customer display",
    price: "P3,499",
  },
  "Patapos Silver": {
    id: "silver",
    name: "Pata Silver",
    model: "Patapos Silver",
    image: pataSilverImg,
    description: "Sleek touchscreen tablet terminal",
    price: "P799",
  },
  "Go Pata": {
    id: "go",
    name: "Go Pata",
    model: "Go Pata",
    image: goPataImg,
    description: "Compact handheld with keypad",
    price: "P499",
  },
  "Pata Diamond": {
    id: "diamond",
    name: "Pata Diamond",
    model: "Pata Diamond",
    image: pataDiamondImg,
    description: "Premium handheld with large touchscreen",
    price: "P1,799",
  },
  "Pata Pro": {
    id: "pro",
    name: "Pata Pro",
    model: "Pata Pro",
    image: pataProImg,
    description: "Powerful handheld with built-in printer",
    price: "P1,299",
  },
  "Pata Platinum": {
    id: "platinum",
    name: "Pata Platinum",
    model: "Pata Platinum",
    image: pataPlatinumImg,
    description: "Classic keypad terminal",
    price: "P999",
  },
};

export const getDeviceImage = (model: string): string => {
  return deviceModels[model]?.image || "/placeholder.svg";
};
