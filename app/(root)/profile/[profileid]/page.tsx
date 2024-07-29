import { SearchParamProps } from "@/types";
import React from "react";

const ProfilePage = ({ params }: SearchParamProps) => {
  const profileId = params?.profileid;

  return <div>{profileId}</div>;
};

export default ProfilePage;
