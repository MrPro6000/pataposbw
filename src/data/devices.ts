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
    price: "P9,980",
  },
  "Patapos Silver": {
    id: "silver",
    name: "Pata Silver",
    model: "Patapos Silver",
    image: pataSilverImg,
    description: "Sleek touchscreen tablet terminal",
    price: "P3,480",
  },
  "Go Pata": {
    id: "go",
    name: "Go Pata",
    model: "Go Pata",
    image: pataPlatinumImg,
    description: "Compact handheld with keypad",
    price: "P880",
  },
  "Pata Diamond": {
    id: "diamond",
    name: "Pata Diamond",
    model: "Pata Diamond",
    image: pataDiamondImg,
    description: "Premium handheld with large touchscreen",
    price: "P1,980",
  },
  "Pata Pro": {
    id: "pro",
    name: "Pata Pro",
    model: "Pata Pro",
    image: pataProImg,
    description: "Powerful handheld with built-in printer",
    price: "P3,880",
  },
  "Pata Platinum": {
    id: "platinum",
    name: "Pata Platinum",
    model: "Pata Platinum",
    image: goPataImg,
    description: "Classic keypad terminal",
    price: "P998",
  },
};

export const getDeviceImage = (model: string): string => {
  return deviceModels[model]?.image || "/placeholder.svg";
};
