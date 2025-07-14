// add the components in here that requires test
import { ProfileEditModal } from "@/components/profile-page/profile-edit-modal";

export default function Test() { 
    return (
      <div>
        <ProfileEditModal type="BIO" />
        <ProfileEditModal type="LOCATION" />
        <ProfileEditModal type="SOCIALS" />
        <ProfileEditModal type="FULLFORM" />
      </div>
    );
}