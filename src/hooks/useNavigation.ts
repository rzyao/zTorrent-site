import { useQuery } from "@tanstack/react-query";
import { NavigationService } from "@/api/services/NavigationService";
import { NavigationResponse } from "@/types/navigation";
import { MOCK_DESKTOP_NAV, MOCK_MOBILE_NAV } from "@/mocks/navigationData";

export function useNavigation() {
  const { data, isLoading, error } = useQuery({
    queryKey: ['navigation'],
    queryFn: async (): Promise<NavigationResponse> => {
      try {
        const response = await NavigationService.navigationControllerGetUserNavigation();
        
        // Handle empty or invalid API responses (due to generated SDK issues or backend readiness)
        if (!response) {
            throw new Error("Empty response from Navigation API");
        }

        // Check if data is valid (runtime check for empty objects due to empty DTOs)
        const navData = (response as any).data || response;
        if (!navData || (!navData.desktop && !navData.mobile)) {
             // If we got an empty object, it means the backend might be returning 200 OK but with empty body
             // or the SDK mapping failed. Treat as error to trigger fallback.
             console.warn("Navigation API returned empty structure, falling back to mock.");
             throw new Error("Invalid navigation data structure");
        }
        
        return navData as NavigationResponse;
      } catch (err) {
        console.warn("Failed to fetch navigation, using mock data.", err);
        // Return mock data on failure or if backend is not ready
        return {
          desktop: MOCK_DESKTOP_NAV,
          mobile: MOCK_MOBILE_NAV
        };
      }
    },
    staleTime: 5 * 60 * 1000, // 5 minutes
    retry: 1,
    // Ensure we always have data even if loading fails (via initialData or placeholderData if needed, 
    // but here we handle it in queryFn catch block for fallback)
  });

  return {
    desktop: data?.desktop || MOCK_DESKTOP_NAV,
    mobile: data?.mobile || MOCK_MOBILE_NAV,
    isLoading, // True only for the first fetch if not using initialData
    error
  };
}
