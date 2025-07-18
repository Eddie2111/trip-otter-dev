"use client";

import { useState, useEffect, useRef } from "react";
import {
  type FullFormData,
  fullFormSchema,
  type LocationFormData,
} from "@/lib/validations/profile";
import { useUserApi } from "@/hooks/use-user-api";
import { useLocationApi } from "@/hooks/use-location-api";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { MapPin, Loader2 } from "lucide-react";

interface ProfileEditModalProps {
  defaultData: any;
  type: "QUICKFORM" | "FULLFORM";
  onClose: () => void;
}

const ProfileEditModal = ({
  defaultData,
  type,
  onClose,
}: ProfileEditModalProps) => {
  const [fullNameData, setFullNameData] = useState({
    fullName: defaultData?.fullName || "",
  });
  const [usernameData, setUsernameData] = useState({
    username: defaultData?.username || "",
  });
  const [emailData, setEmailData] = useState({
    email: defaultData?.email || "",
  });
  const [bioData, setBioData] = useState({ bio: defaultData?.bio || "" });
  const [locationData, setLocationData] = useState<LocationFormData>({
    location: defaultData?.location || "",
  });
  const [socialsData, setSocialsData] = useState({
    socials:
      defaultData?.socials && defaultData.socials.length > 0
        ? defaultData.socials
        : [{ platform: "", url: "" }],
  });
  const [locationSearchLoading, setLocationSearchLoading] = useState(false);
  const [locationSearchResults, setLocationSearchResults] = useState([]);
  const [showLocationDropdown, setShowLocationDropdown] = useState(false);
  const [errors, setErrors] = useState({});
  const debounceTimeoutRef = useRef<NodeJS.Timeout | null>(null);

  useEffect(() => {
    setBioData({ bio: defaultData?.bio || "" });
    setLocationData({ location: defaultData?.location || "" });
    setSocialsData({
      socials:
        defaultData?.socials && defaultData.socials.length > 0
          ? defaultData.socials
          : [{ platform: "", url: "" }],
    });
    setFullNameData({ fullName: defaultData?.fullName || "" });
    setUsernameData({ username: defaultData?.username || "" });
    setEmailData({ email: defaultData?.email || "" });
  }, [defaultData, type]);

  useEffect(() => {
    if (debounceTimeoutRef.current) {
      clearTimeout(debounceTimeoutRef.current);
    }
    if (locationData.location && locationData.location.trim().length > 2) {
      // Only search if input is not empty and has at least 3 characters
      setLocationSearchLoading(true);
      setShowLocationDropdown(true); // Show dropdown when loading
      debounceTimeoutRef.current = setTimeout(async () => {
        try {
          const response = await useLocationApi.getLocations(
            locationData.location ?? ""
          );
          if (response.status === 200 && response.data) {
            setLocationSearchResults(response.data);
          } else {
            setLocationSearchResults([]);
          }
        } catch (error) {
          console.error("Error fetching locations:", error);
          setLocationSearchResults([]);
        } finally {
          setLocationSearchLoading(false);
        }
      }, 2000); // 2-second debounce
    } else {
      setLocationSearchResults([]);
      setLocationSearchLoading(false);
      setShowLocationDropdown(false); // Hide dropdown if search query is too short or empty
    }
    return () => {
      if (debounceTimeoutRef.current) {
        clearTimeout(debounceTimeoutRef.current);
      }
    };
  }, [locationData.location]);

  const renderLocationForm = () => (
    <div className="grid gap-3 relative">
      <Label htmlFor="location-input" className="flex items-center gap-2">
        <MapPin className="h-4 w-4" />
        Location
      </Label>
      <Input
        id="location-input"
        name="location"
        value={locationData.location}
        onChange={(e) => setLocationData({ location: e.target.value })}
        placeholder="Enter your location..."
        maxLength={30}
        onFocus={() => setShowLocationDropdown(true)}
        onBlur={() => setTimeout(() => setShowLocationDropdown(false), 200)}
      />
      <div className="flex justify-between text-sm text-gray-500">
        <span>{locationData.location?.length || 0}/30 characters</span>
        {errors.location && (
          <span className="text-red-500">{errors.location}</span>
        )}
      </div>
      {/* Location Search Results Dropdown */}
      {showLocationDropdown &&
        (locationSearchLoading || locationSearchResults.length > 0) && (
          <div className="absolute top-full left-0 right-0 bg-white border border-gray-200 rounded-md shadow-lg z-10 max-h-40 overflow-y-auto mt-1">
            {locationSearchLoading ? (
              <div className="p-2 flex items-center justify-center text-gray-500">
                <Loader2 className="animate-spin mr-2" /> Searching...
              </div>
            ) : locationSearchResults.length > 0 ? (
              <ul className="divide-y divide-gray-100">
                {locationSearchResults.map((result) => (
                  <li
                    key={result._id}
                    className="p-2 hover:bg-gray-100 cursor-pointer text-sm"
                    onMouseDown={(e) => {
                      e.preventDefault();
                      setLocationData({ location: result.Location });
                      setLocationSearchResults([]);
                      setShowLocationDropdown(false);
                    }}
                  >
                    {result.Location}
                  </li>
                ))}
              </ul>
            ) : (
              <div className="p-2 text-gray-500 text-sm">
                No locations found.
              </div>
            )}
          </div>
        )}
    </div>
  );

  // Function to handle location input change
  const handleLocationInputChange = (event) => {
    const newLocation = event.target.value;
    setLocationData({ location: newLocation });

    if (newLocation.trim().length > 2) {
      // Only search if input is not empty and has at least 3 characters
      setLocationSearchLoading(true);
      setShowLocationDropdown(true); // Show dropdown when loading
      // ... rest of your logic
    } else {
      setLocationSearchLoading(false);
      setShowLocationDropdown(false); // Hide dropdown if input is too short
    }
  };

  const handleSubmit = async (e: any) => {
    e.preventDefault();
    let validatedData;
    let payload;
    try {
      switch (type) {
        case "FULLFORM":
          const fullFormData: FullFormData = {
            fullName: fullNameData.fullName,
            username: usernameData.username,
            email: emailData.email,
            bio: bioData.bio,
            location: locationData.location,
            socials: socialsData.socials.filter(
              (social) =>
                social.platform.trim() !== "" || social.url.trim() !== ""
            ),
          };
          validatedData = fullFormSchema.parse(fullFormData);
          payload = validatedData;
          await useUserApi.updateUser(payload);
          break;
        case "QUICKFORM":
          break;
        default:
          throw new Error("Invalid form type");
      }
      onClose();
    } catch (error: any) {
      console.error("Validation Error:", error.errors);
      // Extract errors from ZodError and set them to state
      const validationErrors = {};
      for (const issue of error.errors) {
        validationErrors[issue.path[0]] = issue.message;
      }
      setErrors(validationErrors);
    }
  };

  return (
    <div>
      <input
        type="text"
        value={locationData.location}
        onChange={handleLocationInputChange}
        placeholder="Enter your location"
      />
      {locationSearchLoading && <div>Loading...</div>}
      {showLocationDropdown && <div>Location Dropdown</div>}
    </div>
  );
};

export default ProfileEditModal;
