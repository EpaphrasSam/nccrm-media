import { regionData } from "./data";
import { clientApiCall, serverApiCall } from "@/utils/api-wrapper";

export interface Coordinates {
  latitude: number;
  longitude: number;
}

export interface District {
  id: string;
  name: string;
}

export interface Region {
  id: string;
  name: string;
  districts: District[];
}

export interface RegionResponse {
  region: string;
  district: string;
  coordinates: Coordinates;
}

type ApiOptions = {
  handleError?: (error: string) => void;
};

// Simulate fetching region/district based on coordinates
export const regionService = {
  fetchByCoordinates(
    coordinates: Coordinates,
    isServer = false,
    options?: ApiOptions
  ) {
    // Simulate an API call
    const promise = new Promise<RegionResponse>((resolve) => {
      // Get a random region and district for demo purposes
      const randomRegionIndex = Math.floor(Math.random() * regionData.length);
      const randomRegion = regionData[randomRegionIndex];

      const randomDistrictIndex = Math.floor(
        Math.random() * randomRegion.districts.length
      );
      const randomDistrict = randomRegion.districts[randomDistrictIndex];

      resolve({
        region: randomRegion.name,
        district: randomDistrict.name,
        coordinates,
      });
    });

    return isServer
      ? serverApiCall(promise, { region: "", district: "", coordinates })
      : clientApiCall(
          promise,
          { region: "", district: "", coordinates },
          false,
          options
        );
  },

  // Fetch all regions and districts data
  fetchAll(isServer = false, options?: ApiOptions) {
    // Simulate an API call
    const promise = new Promise<{ regions: Region[] }>((resolve) => {
      // Simulate API latency
      setTimeout(() => {
        resolve({
          regions: regionData,
        });
      }, 300);
    });

    return isServer
      ? serverApiCall(promise, { regions: [] })
      : clientApiCall(promise, { regions: [] }, false, options);
  },
};
